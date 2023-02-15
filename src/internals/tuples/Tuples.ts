import { Args } from "../args/Args";
import { Booleans as B } from "../booleans/Booleans";
import { Functions as F, Functions } from "../functions/Functions";
import { Numbers as N } from "../numbers/Numbers";
import { Call, Call2, Fn, unset } from "../core/Core";
import { Iterator, Stringifiable } from "../helpers";

export namespace Tuples {
  type HeadImpl<xs> = xs extends readonly [infer head, ...any] ? head : never;

  /**
   * Returns the first element of a tuple.
   * @params args[0] - A tuple.
   * @return The first element of a tuple.
   * @example
   * ```ts
   * type T0 = Call<T.Head,[1, 2, 3]>; // 1
   * type T1 = Call<T.Head,[]>; // never
   * type T2 = Call<T.Head,[1]>; // 1
   * ```
   */
  export interface Head extends Fn {
    return: HeadImpl<Fn.arg0<this>>;
  }

  type TailImpl<xs> = xs extends readonly [any, ...infer tail] ? tail : [];

  /**
   * Returns a tuple with all elements except the first.
   * @params args[0] - A tuple.
   * @return A tuple with all elements except the first.
   * @example
   * ```ts
   * type T0 = Call<T.Tail,[1, 2, 3]>; // [2, 3]
   * type T1 = Call<T.Tail,[]>; // []
   * type T2 = Call<T.Tail,[1]>; // []
   * ```
   */
  export interface Tail extends Fn {
    return: TailImpl<Fn.arg0<this>>;
  }

  type LastImpl<xs> = xs extends readonly [...any, infer last] ? last : never;

  /**
   * Returns the last element of a tuple.
   * @params args[0] - A tuple.
   * @return The last element of a tuple.
   * @example
   * ```ts
   * type T0 = Call<T.Last,[1, 2, 3]>; // 3
   * type T1 = Call<T.Last,[]>; // never
   * type T2 = Call<T.Last,[1]>; // 1
   * ```
   */
  export interface Last extends Fn {
    return: LastImpl<Fn.arg0<this>>;
  }

  interface MapReducer<fn extends Fn> extends Fn {
    return: Fn.args<this> extends [infer acc extends any[], infer item]
      ? [...acc, Call<fn, item>]
      : never;
  }

  /**
   * Apply a function to each element of a tuple and return a new tuple with the results.
   * @params args[0] - A tuple of elements to be transformed.
   * @param fn - A function that takes an element of the tuple and transforms it.
   * @returns A tuple with the results of applying the function to each element of the input tuple.
   * @example
   * ```ts
   * type T0 = Call<T.Map<S.ToString>,[1,2,3]>; // ["1","2","3"]
   * type T1 = Call<T.Map<S.ToString>,[]>; // []
   * ```
   */
  export interface Map<fn extends Fn> extends Fn {
    return: ReduceImpl<Fn.arg0<this>, [], MapReducer<fn>>;
  }

  interface FlatMapReducer<fn extends Fn> extends Fn {
    return: Fn.args<this> extends [infer acc extends any[], infer item]
      ? [...acc, ...Extract<Call<fn, item>, readonly any[]>]
      : never;
  }

  /**
   * Apply a function to each element of a tuple and return a new tuple with the results flattened by one level.
   * @params args[0] - A tuple of elements to be transformed.
   * @param fn - A function that takes an element of the tuple and transforms it.
   * @returns A tuple with the results of applying the function to each element of the input tuple flattened by one level.
   * @example
   * ```ts
   * type T0 = Call<T.FlatMap<S.ToTuple>,["hello","world"]>; // ["h","e","l","l","o","w","o","r","l","d"]
   * type T1 = Call<T.FlatMap<S.ToTuple>,[]>; // []
   * ```
   */
  export interface FlatMap<fn extends Fn> extends Fn {
    return: ReduceImpl<Fn.arg0<this>, [], FlatMapReducer<fn>>;
  }

  type ReduceImpl<xs, acc, fn extends Fn> = xs extends [
    infer first,
    ...infer rest
  ]
    ? ReduceImpl<rest, Call2<fn, acc, first>, fn>
    : acc;

  /**
   * Apply a reducer function to each element of a tuple starting from the first and return the accumulated result.
   * @params args[0] - A tuple of elements to be transformed.
   * @params fn - A reducer function that takes the accumulated result and the current element and returns a new accumulated result.
   * @params init - The initial value of the accumulated result.
   * @returns The accumulated result.
   * @example
   * ```ts
   * type T0 = Call<T.Reduce<N.Add,0>,[1,2,3]>; // 6
   * type T1 = Call<T.Reduce<N.Add,0>,[]>; // 0
   * ```
   */
  export interface Reduce<fn extends Fn, init> extends Fn {
    return: ReduceImpl<Fn.arg0<this>, init, fn>;
  }

  type ReduceRightImpl<xs, acc, fn extends Fn> = xs extends [
    ...infer rest,
    infer last
  ]
    ? ReduceRightImpl<rest, Call2<fn, acc, last>, fn>
    : acc;

  /**
   * Apply a reducer function to each element of a tuple starting from the last and return the accumulated result.
   * @params args[0] - A tuple of elements to be transformed.
   * @params fn - A reducer function that takes the accumulated result and the current element and returns a new accumulated result.
   * @params init - The initial value of the accumulated result.
   * @returns The accumulated result.
   * @example
   * ```ts
   * type T0 = Call<T.ReduceRight<N.Add,0>,[1,2,3]>; // 6
   * type T1 = Call<T.ReduceRight<N.Add,0>,[]>; // 0
   * ```
   */
  export interface ReduceRight<fn extends Fn, init> extends Fn {
    return: ReduceRightImpl<Fn.arg0<this>, init, fn>;
  }

  interface FilterReducer<fn extends Fn> extends Fn {
    return: Fn.args<this> extends [infer acc extends any[], infer item]
      ? Call<fn, item> extends true
        ? [...acc, item]
        : acc
      : never;
  }

  /**
   * Apply a predicate function to each element of a tuple and return a new tuple with the elements that satisfy the predicate.
   * @params args[0] - A tuple of elements to be filtered.
   * @param fn - A predicate function that takes an element of the tuple and returns a boolean.
   * @returns A tuple with the elements that satisfy the predicate.
   * @example
   * ```ts
   * type T0 = Call<T.Filter<B.Extends<string>>,[1,2,"3"]>; // ["3"]
   * type T1 = Call<T.Filter<B.Extends<string>>,[]>; // []
   * ```
   */
  export interface Filter<fn extends Fn> extends Fn {
    return: ReduceImpl<Fn.arg0<this>, [], FilterReducer<fn>>;
  }

  type FindImpl<xs, fn extends Fn, index extends any[] = []> = xs extends [
    infer first,
    ...infer rest
  ]
    ? Call2<fn, first, index["length"]> extends true
      ? first
      : FindImpl<rest, fn, [...index, any]>
    : never;

  /**
   * Apply a predicate function to each element of a tuple and return the first element that satisfies the predicate.
   * @params args[0] - A tuple of elements to be filtered.
   * @param fn - A predicate function that takes an element of the tuple and returns a boolean.
   * @returns The first element that satisfies the predicate.
   * @example
   * ```ts
   * type T0 = Call<T.Find<B.Extends<string>>,[1,2,"3",4,"5"]>; // "3"
   * type T1 = Call<T.Find<B.Extends<string>>,[1,2]>; // never
   * ```
   */
  export interface Find<fn extends Fn> extends Fn {
    return: FindImpl<Fn.arg0<this>, fn>;
  }

  /**
   * Sum the elements of a tuple of numbers.
   * @params args[0] - A tuple of numbers.
   * @returns The sum of the elements of the tuple.
   * @example
   * ```ts
   * type T0 = Call<T.Sum,[1,2,3]>; // 6
   * type T1 = Call<T.Sum,[]>; // 0
   * ```
   */
  export interface Sum extends Fn {
    return: ReduceImpl<Fn.arg0<this>, 0, N.Add>;
  }

  type DropImpl<
    xs extends readonly any[],
    n extends any[]
  > = Iterator.Get<n> extends 0
    ? xs
    : xs extends readonly [any, ...infer tail]
    ? DropImpl<tail, Iterator.Prev<n>>
    : [];

  /**
   * Drop the first n elements of a tuple.
   * @params args[0] - A tuple of elements.
   * @params n - The number of elements to drop.
   * @returns A tuple with the first n elements dropped.
   * @example
   * ```ts
   * type T0 = Call<T.Drop<2>,[1,2,3,4]>; // [3,4]
   * type T1 = Call<T.Drop<2>,[1,2]>; // []
   * type T2 = Call<T.Drop<2>,[]>; // []
   * ```
   */
  export type Drop<
    n extends number | unset | Args._ = unset,
    str = unset
  > = Functions.PartialApply<DropFn, [n, str]>;

  export interface DropFn extends Fn {
    return: Fn.args<this> extends [
      infer N extends number,
      infer T extends readonly any[]
    ]
      ? DropImpl<T, Iterator.Iterator<N>>
      : never;
  }

  type TakeImpl<
    xs extends readonly any[],
    it extends any[],
    output extends any[] = []
  > = Iterator.Get<it> extends 0
    ? output
    : xs extends readonly [infer head, ...infer tail]
    ? TakeImpl<tail, Iterator.Prev<it>, [...output, head]>
    : output;

  /**
   * Take the first n elements of a tuple.
   * @params args[0] - A tuple of elements.
   * @params n - The number of elements to take.
   * @returns A tuple with the first n elements.
   * @example
   * ```ts
   * type T0 = Call<T.Take<2>,[1,2,3,4]>; // [1,2]
   * type T1 = Call<T.Take<2>,[1,2]>; // [1,2]
   * type T2 = Call<T.Take<2>,[]>; // []
   * ```
   */
  export type Take<
    n extends number | unset | Args._ = unset,
    str = unset
  > = Functions.PartialApply<TakeFn, [n, str]>;

  interface TakeFn extends Fn {
    return: Fn.args<this> extends [
      infer N extends number,
      infer T extends readonly any[]
    ]
      ? TakeImpl<T, Iterator.Iterator<N>>
      : never;
  }

  type TakeWhileImpl<
    xs extends readonly any[],
    fn extends Fn,
    index extends any[] = [],
    output extends any[] = []
  > = xs extends readonly [infer head, ...infer tail]
    ? Call2<fn, head, index["length"]> extends true
      ? TakeWhileImpl<tail, fn, [...index, any], [...output, head]>
      : output
    : output;

  /**
   * Take the first elements of a tuple that satisfy a predicate function.
   * @params args[0] - A tuple of elements.
   * @param fn - A predicate function that takes an element of the tuple and returns a boolean.
   * @returns A tuple with the first elements that satisfy the predicate.
   * @example
   * ```ts
   * type T0 = Call<T.TakeWhile<B.Extends<number>>,[1,2,"3",4,"5"]>; // [1,2]
   * type T1 = Call<T.TakeWhile<B.Extends<number>>,["1", 2]>; // []
   * ```
   */
  export interface TakeWhile<fn extends Fn> extends Fn {
    return: TakeWhileImpl<Extract<Fn.arg0<this>, readonly any[]>, fn>;
  }

  /**
   * Check if a tuple staisfies a predicate function for at least one element.
   * @params args[0] - A tuple of elements.
   * @param fn - A predicate function that takes an element of the tuple and returns a boolean.
   * @returns A boolean indicating whether the predicate is satisfied by at least one element.
   * @example
   * ```ts
   * type T0 = Call<T.Some<B.Extends<number>>,[1,2,"3",4,"5"]>; // true
   * type T1 = Call<T.Some<B.Extends<number>>,["1", "2"]>; // false
   * ```
   */
  export interface Some<fn extends Fn> extends Fn {
    return: true extends Call<Tuples.Map<fn>, Fn.arg0<this>>[number]
      ? true
      : false;
  }

  /**
   * Check if a tuple staisfies a predicate function for all elements.
   * @params args[0] - A tuple of elements.
   * @param fn - A predicate function that takes an element of the tuple and returns a boolean.
   * @returns A boolean indicating whether the predicate is satisfied by all elements.
   * @example
   * ```ts
   * type T0 = Call<T.Every<B.Extends<number>>,[1,2,"3",4,"5"]>; // false
   * type T1 = Call<T.Every<B.Extends<number>>,["1", "2"]>; // false
   * type T2 = Call<T.Every<B.Extends<number>>,[1, 2]>; // true
   * ```
   */
  export interface Every<fn extends Fn> extends Fn {
    return: false extends Call<Tuples.Map<fn>, Fn.arg0<this>>[number]
      ? false
      : true;
  }

  type SortImpl<xs extends any[], predicateFn extends Fn> = xs extends [
    infer head,
    ...infer tail
  ]
    ? [
        ...SortImpl<
          Call<
            Tuples.Filter<F.PartialApply<predicateFn, [Args._, head]>>,
            tail
          >,
          predicateFn
        >,
        head,
        ...SortImpl<
          Call<
            Tuples.Filter<
              F.Compose<[B.Not, F.PartialApply<predicateFn, [Args._, head]>]>
            >,
            tail
          >,
          predicateFn
        >
      ]
    : [];

  /**
   * Sort a tuple.
   * @param args[0] - The tuple to sort.
   * @param predicateFn - The predicate function to use for sorting. should compare 2 items and return a boolean.
   * @returns The sorted tuple.
   * @example
   * ```ts
   * type T0 = Call<Tuples.Sort,[3,2,1]>; // [1,2,3]
   * type T1 = Call<Tuples.Sort<Strings.LessThan>,["b","c","a"]>; // ["a","b","c"]
   * ```
   */
  export interface Sort<predicateFn extends Fn = N.LessThanOrEqual> extends Fn {
    return: Fn.args<this> extends [infer xs extends any[]]
      ? SortImpl<xs, predicateFn>
      : never;
  }

  interface JoinReducer<sep extends string> extends Fn {
    return: Fn.args<this> extends [
      infer acc extends Stringifiable,
      infer item extends Stringifiable
    ]
      ? `${acc extends "" ? "" : `${acc}${sep}`}${item}`
      : never;
  }

  /**
   * Join a tuple into a single string.
   * @param args[0] - The tuple to join.
   * @param sep - The separator to join the strings with.
   * @returns The joined string.
   * @example
   * ```ts
   * type T0 = Call<Tuples.Join<",">,["a","b","c"]>; // "a,b,c"
   * ```
   */
  export type Join<
    Sep extends string | Args._ | unset = unset,
    Tuple = unset
  > = Functions.PartialApply<JoinFn, [Sep, Tuple]>;

  interface JoinFn extends Fn {
    return: Fn.args<this> extends [infer Sep extends string, infer Tuple]
      ? ReduceImpl<Tuple, "", JoinReducer<Sep>>
      : never;
  }

  /**
   * Adds a new element to the start of a tuple
   * @param args[0] - The tuple to update.
   * @param element - The element to add to our tuple
   * @returns The updated tuple.
   * @example
   * ```ts
   * type T0 = Call<Tuples.Prepend<"new">, ["a", "b", "c"]>; // ["new", "a", "b", "c"]
   * ```
   */
  export type Prepend<element = unset, tuple = unset> = Functions.PartialApply<
    PrependFn,
    [element, tuple]
  >;

  interface PrependFn extends Fn {
    return: Fn.args<this> extends [infer element, infer tuple extends any[]]
      ? [element, ...tuple]
      : never;
  }
  /**
   * Adds a new element to the end of a tuple
   * @param args[0] - The tuple to update.
   * @param element - The element to add to our tuple
   * @returns The updated tuple.
   * @example
   * ```ts
   * type T0 = Call<Tuples.Append<"new">, ["a", "b", "c"]>; // ["a", "b", "c", "new"]
   * ```
   */
  export type Append<element = unset, tuple = unset> = Functions.PartialApply<
    AppendFn,
    [element, tuple]
  >;

  interface AppendFn extends Fn {
    return: Fn.args<this> extends [infer element, infer tuple extends any[]]
      ? [...tuple, element]
      : never;
  }
}
