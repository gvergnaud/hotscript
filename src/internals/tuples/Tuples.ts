import { Booleans as B } from "../booleans/Booleans";
import { Functions as F, Functions } from "../functions/Functions";
import { Numbers as N } from "../numbers/Numbers";
import { Call, Call2, Fn, unset, _ } from "../core/Core";
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
  export type Head<tuple extends readonly any[] | unset = unset> =
    Functions.PartialApply<HeadFn, [tuple]>;

  interface HeadFn extends Fn {
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
  export type Tail<tuple extends readonly any[] | unset = unset> =
    Functions.PartialApply<TailFn, [tuple]>;

  export interface TailFn extends Fn {
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
  export type Last<tuple extends readonly any[] | unset = unset> =
    Functions.PartialApply<LastFn, [tuple]>;

  export interface LastFn extends Fn {
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
  export type Map<
    fn extends Fn,
    tuple extends readonly any[] | unset = unset
  > = Functions.PartialApply<MapFn, [fn, tuple]>;

  interface MapFn extends Fn {
    return: ReduceImpl<Fn.arg1<this>, [], MapReducer<Fn.arg0<this, Fn>>>;
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
  export type FlatMap<
    fn extends Fn,
    tuple extends readonly any[] | unset = unset
  > = Functions.PartialApply<FlatMapFn, [fn, tuple]>;

  interface FlatMapFn extends Fn {
    return: ReduceImpl<Fn.arg1<this>, [], FlatMapReducer<Fn.arg0<this, Fn>>>;
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
  export type Reduce<
    fn extends Fn,
    init = unset,
    tuple extends readonly any[] | unset = unset
  > = Functions.PartialApply<ReduceFn, [fn, init, tuple]>;

  interface ReduceFn extends Fn {
    return: ReduceImpl<Fn.arg2<this>, Fn.arg1<this>, Fn.arg0<this, Fn>>;
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
  export type ReduceRight<
    fn extends Fn,
    init = unset,
    tuple extends readonly any[] | unset = unset
  > = Functions.PartialApply<ReduceRightFn, [fn, init, tuple]>;

  interface ReduceRightFn extends Fn {
    return: ReduceRightImpl<Fn.arg2<this>, Fn.arg1<this>, Fn.arg0<this, Fn>>;
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
  export type Filter<
    fn extends Fn,
    tuple extends readonly any[] | unset = unset
  > = Functions.PartialApply<FilterFn, [fn, tuple]>;

  export interface FilterFn extends Fn {
    return: ReduceImpl<Fn.arg1<this>, [], FilterReducer<Fn.arg0<this, Fn>>>;
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
  export type Find<
    fn extends Fn,
    tuple extends readonly any[] | unset = unset
  > = Functions.PartialApply<FindFn, [fn, tuple]>;

  export interface FindFn extends Fn {
    return: FindImpl<Fn.arg1<this>, Fn.arg0<this, Fn>>;
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
  export type Sum<tuple extends readonly any[] | unset = unset> =
    Functions.PartialApply<SumFn, [tuple]>;

  interface SumFn extends Fn {
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
    n extends number | unset | _ = unset,
    tuple = unset
  > = Functions.PartialApply<DropFn, [n, tuple]>;

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
    n extends number | unset | _ = unset,
    tuple = unset
  > = Functions.PartialApply<TakeFn, [n, tuple]>;

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
  export type TakeWhile<fn extends Fn, tuple = unset> = Functions.PartialApply<
    TakeWhileFn,
    [fn, tuple]
  >;

  export interface TakeWhileFn extends Fn {
    return: TakeWhileImpl<Fn.arg1<this, readonly any[]>, Fn.arg0<this, Fn>>;
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
  export type Some<fn extends Fn, tuple = unset> = Functions.PartialApply<
    SomeFn,
    [fn, tuple]
  >;
  export interface SomeFn extends Fn {
    return: true extends Call<
      Tuples.Map<Fn.arg0<this, Fn>>,
      Fn.arg1<this>
    >[number]
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
  export type Every<fn extends Fn, tuple = unset> = Functions.PartialApply<
    EveryFn,
    [fn, tuple]
  >;
  export interface EveryFn extends Fn {
    return: false extends Call<
      Tuples.Map<Fn.arg0<this, Fn>>,
      Fn.arg1<this>
    >[number]
      ? false
      : true;
  }

  type SortImpl<xs extends any[], predicateFn extends Fn> = xs extends [
    infer head,
    ...infer tail
  ]
    ? [
        ...SortImpl<
          Call<Tuples.Filter<F.PartialApply<predicateFn, [_, head]>>, tail>,
          predicateFn
        >,
        head,
        ...SortImpl<
          Call<
            Tuples.Filter<
              F.Compose<[B.Not, F.PartialApply<predicateFn, [_, head]>]>
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
    Sep extends string | _ | unset = unset,
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

  /**
   * Splits a tuple into two groups based on a predicate:
   * - The first group contains elements predicate returns true for.
   * - The second group contains elements predicate returns false for.
   *
   * @param predicate - The tuple to update.
   * @param element - The element to add to our tuple
   * @returns - a tuple containing two tuples: one for each groupe
   * @example
   * ```ts
   * type T0 = Call<T.Partition<B.Extends<number>>, [1, "a", 2, "b", 3, "c"]>;
   * //   ^? [[1, 2, 3], ["a", "b", "c"]]
   * ```
   */
  export type Partition<fn extends Fn, tuple = unset> = Functions.PartialApply<
    PartitionFn,
    [fn, tuple]
  >;

  type PartitionImpl<
    fn extends Fn,
    tuple extends any[],
    left extends any[] = [],
    right extends any[] = []
  > = tuple extends [infer first, ...infer rest]
    ? Call<fn, first> extends true
      ? PartitionImpl<fn, rest, [...left, first], right>
      : PartitionImpl<fn, rest, left, [...right, first]>
    : [left, right];

  interface PartitionFn extends Fn {
    return: PartitionImpl<Fn.arg0<this, Fn>, Fn.arg1<this, any[]>>;
  }

  /**
   * Get an element from a tuple at a given index.
   *
   * @param index - The index to lookup
   * @param tuple - the tuple
   * @returns - a tuple containing two tuples: one for each groupe
   * @example
   * ```ts
   * type T0 = Call<T.Partition<B.Extends<number>>, [1, "a", 2, "b", 3, "c"]>;
   * //   ^? [[1, 2, 3], ["a", "b", "c"]]
   * ```
   */
  export type At<
    index extends number | _ | unset = unset,
    tuple = unset
  > = Functions.PartialApply<AtFn, [index, tuple]>;

  interface AtFn extends Fn {
    return: Fn.arg1<this, readonly any[]>[Fn.arg0<this, number>];
  }
}
