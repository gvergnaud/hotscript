import { Functions as F, Functions } from "../functions/Functions";
import { Numbers as N, Numbers } from "../numbers/Numbers";

import {
  Apply,
  args,
  Call,
  Call2,
  Call3,
  Eval,
  Fn,
  PartialApply,
  Pipe,
  unset,
  _,
} from "../core/Core";
import { Iterator, Stringifiable } from "../helpers";
import { Objects } from "../objects/Objects";
import { ToNumber } from "../numbers/impl/utils";

export namespace Tuples {
  type HeadImpl<xs> = xs extends readonly [infer head, ...any] ? head : never;

  /**
   * Get an element from a tuple at a given index.
   * @param args[0] - The index of the element to get.
   * @param args[1] - The tuple to get the element from.
   * @param index - The index of the element to get.
   * @param tuple - The tuple to get the element from.
   * @returns The element at the specified index.
   * @example
   * ```ts
   * type T0 = Call2<Tuples.At, 1, ["a", "b", "c"]>; // "b"
   * type T1 = Eval<Tuples.At<1, ["a", "b", "c"]>>; // "b"
   * type T2 = Call<Tuples.At<1>, ["a", "b", "c"]>; // "b"
   * ```
   */
  export type At<
    index extends number | _ | unset = unset,
    tuple = unset
  > = PartialApply<AtFn, [index, tuple]>;

  interface AtFn extends Fn {
    return: Extract<this["arg1"], readonly any[]>[Extract<
      this["arg0"],
      number
    >];
  }

  type IsEmptyImpl<tuple extends unknown[]> = [] extends tuple ? true : false;

  interface IsEmptyFn extends Fn {
    return: IsEmptyImpl<Extract<this["arg0"], unknown[]>>;
  }

  /**
   * Check if a tuple is empty.
   * @param args[0] - The tuple to check.
   * @param tuple - The tuple to check.
   * @returns `true` if the tuple is empty, `false` otherwise.
   * @example
   * ```ts
   * type T0 = Call<Tuples.IsEmpty, []>; // true
   * type T1 = Call<Tuples.IsEmpty, [1, 2, 3]>; // false
   * type T2 = Eval<Tuples.IsEmpty<[]>>; // true
   * ```
   */
  export type IsEmpty<tuple = unset> = PartialApply<IsEmptyFn, [tuple]>;

  interface ToUnionFn extends Fn {
    return: this["arg0"][number];
  }

  /**
   * Convert a tuple to a union of its elements.
   * @param tuple - The tuple to convert.
   * @returns A union of the tuple's elements.
   * @example
   * ```ts
   * type T0 = Call<Tuples.ToUnion, [1, 2, 3]>; // 1 | 2 | 3
   * type T1 = Eval<Tuples.ToUnion<[1, 2, 3]>>; // 1 | 2 | 3
   * ```
   */
  export type ToUnion<tuple extends readonly any[] | _ | unset = unset> =
    PartialApply<ToUnionFn, [tuple]>;

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
  export type Head<tuple extends readonly any[] | unset = unset> = PartialApply<
    HeadFn,
    [tuple]
  >;

  interface HeadFn extends Fn {
    return: HeadImpl<this["arg0"]>;
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
  export type Tail<tuple extends readonly any[] | unset = unset> = PartialApply<
    TailFn,
    [tuple]
  >;

  export interface TailFn extends Fn {
    return: TailImpl<this["arg0"]>;
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
  export type Last<tuple extends readonly any[] | unset = unset> = PartialApply<
    LastFn,
    [tuple]
  >;

  export interface LastFn extends Fn {
    return: LastImpl<this["arg0"]>;
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
    fn extends Fn | unset | _ = unset,
    tuple extends readonly any[] | unset = unset
  > = PartialApply<MapFn, [fn, tuple]>;

  interface MapFn extends Fn {
    return: this["args"] extends [
      infer fn extends Fn,
      infer tuple extends unknown[]
    ]
      ? { [key in keyof tuple]: Call<fn, tuple[key]> }
      : never;
  }

  interface FlatMapReducer<fn extends Fn> extends Fn {
    return: this["args"] extends [infer acc extends any[], infer item]
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
  > = PartialApply<FlatMapFn, [fn, tuple]>;

  interface FlatMapFn extends Fn {
    return: ReduceImpl<
      this["arg1"],
      [],
      FlatMapReducer<Extract<this["arg0"], Fn>>
    >;
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
  > = PartialApply<ReduceFn, [fn, init, tuple]>;

  interface ReduceFn extends Fn {
    return: ReduceImpl<this["arg2"], this["arg1"], Extract<this["arg0"], Fn>>;
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
  > = PartialApply<ReduceRightFn, [fn, init, tuple]>;

  interface ReduceRightFn extends Fn {
    return: ReduceRightImpl<
      this["arg2"],
      this["arg1"],
      Extract<this["arg0"], Fn>
    >;
  }

  interface FilterReducer<fn extends Fn> extends Fn {
    return: this["args"] extends [infer acc extends any[], infer item]
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
  > = PartialApply<FilterFn, [fn, tuple]>;

  export interface FilterFn extends Fn {
    return: ReduceImpl<
      this["arg1"],
      [],
      FilterReducer<Extract<this["arg0"], Fn>>
    >;
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
  > = PartialApply<FindFn, [fn, tuple]>;

  export interface FindFn extends Fn {
    return: FindImpl<this["arg1"], Extract<this["arg0"], Fn>>;
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
  export type Sum<tuple extends readonly any[] | unset = unset> = PartialApply<
    SumFn,
    [tuple]
  >;

  interface SumFn extends Fn {
    return: ReduceImpl<this["arg0"], 0, N.Add>;
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
  > = PartialApply<DropFn, [n, tuple]>;

  export interface DropFn extends Fn {
    return: this["args"] extends [
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
  > = PartialApply<TakeFn, [n, tuple]>;

  interface TakeFn extends Fn {
    return: this["args"] extends [
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
  export type TakeWhile<fn extends Fn, tuple = unset> = PartialApply<
    TakeWhileFn,
    [fn, tuple]
  >;

  export interface TakeWhileFn extends Fn {
    return: TakeWhileImpl<
      Extract<this["arg1"], readonly any[]>,
      Extract<this["arg0"], Fn>
    >;
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
  export type Some<fn extends Fn, tuple = unset> = PartialApply<
    SomeFn,
    [fn, tuple]
  >;
  export interface SomeFn extends Fn {
    return: true extends Call<
      Tuples.Map<Extract<this["arg0"], Fn>>,
      this["arg1"]
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
  export type Every<fn extends Fn, tuple = unset> = PartialApply<
    EveryFn,
    [fn, tuple]
  >;
  export interface EveryFn extends Fn {
    return: false extends Call<
      Tuples.Map<Extract<this["arg0"], Fn>>,
      this["arg1"]
    >[number]
      ? false
      : true;
  }

  type SortImpl<xs extends any[], predicateFn extends Fn> = xs extends [
    infer head,
    ...infer tail
  ]
    ? Eval<
        Tuples.Partition<PartialApply<predicateFn, [_, head]>, tail>
      > extends [infer left extends any[], infer right extends any[]]
      ? [...SortImpl<left, predicateFn>, head, ...SortImpl<right, predicateFn>]
      : never
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
    return: this["args"] extends [infer xs extends any[]]
      ? SortImpl<xs, predicateFn>
      : never;
  }

  interface JoinReducer<sep extends string> extends Fn {
    return: this["args"] extends [
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
   * type T1 = Call2<Tuples.Join,",",["a","b","c"]>; // "a,b,c"
   * type T2 = Eval<Tuples.Join<",",["a","b","c"]>>; // "a,b,c"
   * ```
   */
  export type Join<
    Sep extends string | _ | unset = unset,
    Tuple = unset
  > = PartialApply<JoinFn, [Sep, Tuple]>;

  interface JoinFn extends Fn {
    return: this["args"] extends [infer Sep extends string, infer Tuple]
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
  export type Prepend<element = unset, tuple = unset> = PartialApply<
    PrependFn,
    [element, tuple]
  >;

  interface PrependFn extends Fn {
    return: this["args"] extends [infer element, infer tuple extends any[]]
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
  export type Append<element = unset, tuple = unset> = PartialApply<
    AppendFn,
    [element, tuple]
  >;

  interface AppendFn extends Fn {
    return: this["args"] extends [infer element, infer tuple extends any[]]
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
  export type Partition<fn extends Fn, tuple = unset> = PartialApply<
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
    return: PartitionImpl<
      Extract<this["arg0"], Fn>,
      Extract<this["arg1"], any[]>
    >;
  }

  interface ZipWithMapper<fn extends Fn, arrs extends unknown[][]> extends Fn {
    return: this["args"] extends [infer Index extends number, ...any]
      ? Apply<fn, Eval<Tuples.Map<Tuples.At<Index>, arrs>>>
      : never;
  }

  interface ZipWithFn<fn extends Fn> extends Fn {
    return: this["args"] extends infer arrays extends unknown[][]
      ? Pipe<
          arrays,
          [
            Tuples.Map<Objects.Get<"length">>,
            Tuples.Reduce<Numbers.Min, 9999>, // a length of 9999 is the longest possible tuple
            Numbers.Sub<_, 1>,
            Tuples.Range<0, _>,
            Tuples.Map<ZipWithMapper<fn, arrays>>
          ]
        >
      : never;
  }

  /**
   * Zip two tuples together.
   * @param args[0] - The first tuple to zip.
   * @param args[1] - The second tuple to zip.
   * @param arr1 - The first tuple to zip.
   * @param arr2 - The second tuple to zip.
   * @returns The zipped tuple.
   * @example
   * ```ts
   * type T0 = Call2<Tuples.Zip, [1, 2, 3], [10, 2, 5]>; // [[1, 10], [2, 2], [3, 5]]
   * type T1 = Eval<Tuples.Zip<[1, 2, 3], [10, 2, 5]>>; // [[1, 10], [2, 2], [3, 5]]
   * ```
   */
  export type Zip<
    arr0 extends unknown[] | _ | unset = unset,
    arr1 extends unknown[] | _ | unset = unset,
    arr2 extends unknown[] | _ | unset = unset,
    arr3 extends unknown[] | _ | unset = unset,
    arr4 extends unknown[] | _ | unset = unset,
    arr5 extends unknown[] | _ | unset = unset,
    arr6 extends unknown[] | _ | unset = unset,
    arr7 extends unknown[] | _ | unset = unset,
    arr8 extends unknown[] | _ | unset = unset,
    arr9 extends unknown[] | _ | unset = unset
  > = PartialApply<
    ZipWith<args>,
    [arr0, arr1, arr2, arr3, arr4, arr5, arr6, arr7, arr8, arr9]
  >;

  /**
   * Zip two tuples together using a function.
   * @description The function should take a 2 elements and return a value.
   * Using the identity function will return a 2-tuple and have the same effect as `Zip`.
   * @param args[0] - The first tuple to zip.
   * @param args[1] - The second tuple to zip.
   * @param fn - The function to use to zip the tuples.
   * @param arr1 - The first tuple to zip.
   * @param arr2 - The second tuple to zip.
   * @returns The zipped tuple.
   * @example
   * ```ts
   * type T0 = Call2<Tuples.ZipWith<args>, [1, 2, 3], [10, 2, 5]>; // [[1, 10], [2, 2], [3, 5]]
   * type T1 = Eval<Tuples.ZipWith<args, [1, 2, 3], [10, 2, 5]>>; // [[1, 10], [2, 2], [3, 5]]
   * type T3 = Call2<Tuples.ZipWith<N.Add>, [1, 2, 3], [10, 2, 5]>; // [11, 4, 8]
   * ```
   */
  export type ZipWith<
    fn extends Fn,
    arr0 extends unknown[] | _ | unset = unset,
    arr1 extends unknown[] | _ | unset = unset,
    arr2 extends unknown[] | _ | unset = unset,
    arr3 extends unknown[] | _ | unset = unset,
    arr4 extends unknown[] | _ | unset = unset,
    arr5 extends unknown[] | _ | unset = unset,
    arr6 extends unknown[] | _ | unset = unset,
    arr7 extends unknown[] | _ | unset = unset,
    arr8 extends unknown[] | _ | unset = unset,
    arr9 extends unknown[] | _ | unset = unset
  > = PartialApply<
    ZipWithFn<fn>,
    [arr0, arr1, arr2, arr3, arr4, arr5, arr6, arr7, arr8, arr9]
  >;

  /**
   * Range takes a `start` and an `end` integer and produces
   * a tuple containing integer ranging from `start` to `end`
   * @param start - the start of the range (included)
   * @param end - the end of the range (included)
   * @returns a tuple of integers
   * @example
   * ```ts
   * type T0 = Call<Tuples.Range<3>, 7>; // [3, 4, 5, 6, 7]
   * type T1 = Eval<Tuples.Range<_, 10>, 5>; // [5, 6, 7, 8, 9, 10]
   * type T3 = Eval<Tuples.Range< -2, 2>, 5>; // [-2, 1, 0, 1, 2]
   * type T4 = Eval<Tuples.Range< -5, -2>, 5>; // [-5, -4, -3, -2]
   * ```
   */
  export type Range<
    start extends number | _ | unset = unset,
    end extends number | _ | unset = unset
  > = PartialApply<RangeFn, [start, end]>;

  interface RangeFn extends Fn {
    return: this["args"] extends [
      infer start extends number,
      infer end extends number
    ]
      ? Call2<Numbers.LessThanOrEqual, start, end> extends true
        ? Pipe<
            start,
            [Numbers.Sub<end, _>, Numbers.Add<1>, Numbers.Abs]
          > extends infer length extends number
          ? RangeImpl<start, length>
          : never
        : never
      : never;
  }

  type RangeImpl<
    start extends number,
    length extends number,
    output extends any[] = []
  > = output["length"] extends length
    ? output
    : RangeImpl<
        start,
        length,
        [...output, Eval<Numbers.Add<start, output["length"]>>]
      >;
}
