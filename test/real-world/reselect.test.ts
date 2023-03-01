import * as H from "../../src/index";
import { MergeArgs } from "../../src/internals/core/impl/MergeArgs";

interface Longest extends H.Fn {
  return: this["args"] extends [
    infer acc extends any[],
    infer first extends any[]
  ]
    ? H.Eval<H.Numbers.GreaterThan<acc["length"], first["length"]>> extends true
      ? acc
      : first
    : never;
}
interface Transpose extends H.Fn {
  return: H.Apply<H.Tuples.Zip, Extract<this["arg0"], any[]>>;
}

interface Rest extends H.Fn {
  return: this["arg0"] extends infer LongestParamsArray extends any[]
    ? ExpandItems2<
        RemoveNames2<{
          [index in keyof LongestParamsArray]: LongestParamsArray[index] extends LongestParamsArray[number]
            ? IgnoreInvalidIntersections<
                IntersectAll<LongestParamsArray[index]>
              >
            : never;
        }>
      >
    : never;
}

interface Arity1<fn extends H.Fn> extends H.Fn {
  return: H.PartialApply<fn, [this["arg0"]]>;
}

type ApplyPartialArgFunctions<
  args extends unknown[],
  partialArgs extends unknown[],
  output extends any[] = []
> = partialArgs extends [infer first, ...infer rest]
  ? ApplyPartialArgFunctions<
      args,
      rest,
      [
        ...output,
        first extends H.Fn ? H.Apply<Extract<first, H.Fn>, args> : first
      ]
    >
  : output;

interface PreApply<fn extends H.Fn, args extends H.Fn[]> extends H.Fn {
  return: ApplyPartialArgFunctions<
    this["args"],
    args
  > extends infer AppliedArgs extends any[]
    ? H.PartialApply<fn, AppliedArgs>
    : never;
}

type x2 = ApplyPartialArgFunctions<
  [{ x: string }],
  [H.ShouldApply<H.Objects.Get<"x">>, H.ShouldApply<H.Objects.Get<"x">>]
>;

interface CallWith<T> extends H.Fn {
  return: H.Call<this["arg0"], T>;
}

/**
 * I don't know why the input is in-between the
 *
 */
type x = MergeParameters<
  // ^?
  [
    (a: string, b: number) => boolean,
    (c: 21, b: "hello") => string,
    (c: "a", b: 2, d: 123) => string
  ]
>;

type MergeParameters<T extends readonly UnknownFunction[]> = H.Pipe<
  T,
  [
    H.Tuples.Map<H.Functions.Parameters>,
    H.Objects.Create<{
      parametersList: H.arg0;
      longestLength: H.ComposeLeft<
        [H.Tuples.Map<H.Tuples.Length>, H.Tuples.Reduce<H.Numbers.Max, 0>]
      >;
    }>,
    H.Objects.Create<{
      parametersList: H.Objects.Get<"parametersList">;
      getUnknownOffset: PreApply<
        H.ComposeLeft<
          [
            H.Numbers.Sub,
            H.Tuples.Range<0, H._>,
            H.Tuples.Map<H.Constant<unknown>>
          ]
        >,
        [H.Objects.Get<"longestLength">]
      >;
    }>,
    H.Objects.Create<{
      parametersList: H.Objects.Get<"parametersList">;
      ranges: H.PartialApply<
        H.Tuples.Map,
        [
          H.ShouldApply<H.Objects.Get<"getUnknownOffset">>,
          H.ShouldApply<
            H.ComposeLeft<
              [H.Objects.Get<"parametersList">, H.Tuples.Map<H.Tuples.Length>]
            >
          >
        ]
      >;
    }>
    // H.Tuples.ZipWith<
    //   H.Tuples.Concat,
    //   [
    //     H.ShouldApply<H.Objects.Get<"ranges">>,
    //     H.ShouldApply<H.Objects.Get<"parametersList">>
    //   ]
    // >
    // Transpose
    // // Rest
  ]
>;

type GetUnknownPadding<
  longestLength extends number,
  argsList extends any[][]
> = H.Eval<
  H.Tuples.Map<
    H.ComposeLeft<
      [
        H.Tuples.Length,
        H.Numbers.Sub<longestLength, H._>,
        H.Tuples.Range<0>,
        H.Tuples.Map<H.Constant<unknown>>,
        H.Tuples.Tail
      ]
    >,
    argsList
  >
>;

type GetLongest<argsList extends any[][]> = H.Pipe<
  argsList,
  [H.Tuples.Map<H.Tuples.Length>, H.Tuples.Reduce<H.Numbers.Max, 0>]
>;

interface PadWithUnknown extends H.Fn {
  return: this["args"] extends [infer argsList extends any[][]]
    ? GetLongest<argsList> extends infer longestLength extends number
      ? GetUnknownPadding<
          longestLength,
          argsList
        > extends infer pad extends any[]
        ? H.Eval<H.Tuples.ZipWith<H.Tuples.Concat, argsList, pad>>
        : never
      : never
    : never;
}

type x3 = MergeParameters2<
  // ^?
  [
    (a: number, b: number) => boolean,
    (c: 21, b: "hello") => string,
    (c: number | string, b: 2, d: 123) => string
  ]
>;

type MergeParameters2<T extends readonly UnknownFunction[]> = H.Pipe<
  T,
  [
    H.Tuples.Map<H.Functions.Parameters>,
    PadWithUnknown,
    Transpose,
    H.Tuples.Map<H.Tuples.ToIntersection>
  ]
>;

type MergeParameters3<T extends readonly UnknownFunction[]> = H.Pipe<
  T,
  [
    H.Let<"parametersList", H.Tuples.Map<H.Functions.Parameters>>,
    H.Let<
      "longestLength",
      H.ComposeLeft<
        [
          H.Get<"parametersList">,
          H.Tuples.Map<H.Tuples.Length>,
          H.Tuples.Reduce<H.Numbers.Max, 0>
        ]
      >
    >,
    H.Let<
      "unknownPadding",
      H.Tuples.Map<
        H.ComposeLeft<
          [
            H.Numbers.Sub<H.Get<"longestLength">, H._>,
            H.Tuples.Range<0>,
            H.Tuples.Map<H.Constant<unknown>>
          ]
        >,
        H.Get<"parametersList">
      >
    >,
    H.Let<
      "unknownPadding",
      H.Tuples.Map<
        H.ComposeLeft<
          [
            H.Numbers.Sub<H.Get<"longestLength">, H._>,
            H.Tuples.Range<0>,
            H.Tuples.Map<H.Constant<unknown>>
          ]
        >,
        H.Get<"parametersList">
      >
    >,
    H.Tuples.ZipWith<
      H.Tuples.Concat,
      H.Get<"parametersList">,
      H.Get<"unknownPadding">
    >,
    Transpose,
    H.Tuples.Map<H.Tuples.Reduce<H.Objects.Assign, {}>>
  ]
>;

/*
 *
 * Reselect Internal Utility Types
 *
 */

/** Any function with arguments */
type UnknownFunction = (...args: any[]) => any;

/** An object with no fields */
type EmptyObject = {
  [K in any]: never;
};

type IgnoreInvalidIntersections<T> = T extends EmptyObject ? never : T;

/** Recursively expand all fields in an object for easier reading */
type ExpandItems2<T extends readonly unknown[]> = {
  [index in keyof T]: T[index] extends T[number] ? Expand<T[index]> : never;
};

/** Recursive type for intersecting together all items in a tuple, to determine
 *  the final parameter type at a given argument index in the generated selector. */
type IntersectAll<T extends any[]> = IsTuple<T> extends "0"
  ? T[0]
  : _IntersectAll<T>;

type IfJustNullish<T, True, False> = [T] extends [undefined | null]
  ? True
  : False;

/** Intersect a pair of types together, for use in parameter type calculation.
 * This is made much more complex because we need to correctly handle cases
 * where a function has fewer parameters and the type is `undefined`, as well as
 * optional params or params that have `null` or `undefined` as part of a union.
 *
 * If the next type by itself is `null` or `undefined`, we exclude it and return
 * the other type. Otherwise, intersect them together.
 */
type _IntersectAll<T, R = unknown> = T extends [infer First, ...infer Rest]
  ? _IntersectAll<Rest, IfJustNullish<First, R, R & First>>
  : R;

/**
 * Removes field names from a tuple
 * Source: https://stackoverflow.com/a/63571175/62937
 */
type RemoveNames2<T extends readonly any[]> = [any, ...T] extends [
  any,
  ...infer U
]
  ? U
  : never;

/**
 * Assorted util types for type-level conditional logic
 * Source: https://github.com/KiaraGrouwstra/typical
 */
type Bool = "0" | "1";
type Obj<T> = { [k: string]: T };
type And<A extends Bool, B extends Bool> = ({
  1: { 1: "1" } & Obj<"0">;
} & Obj<Obj<"0">>)[A][B];

type Matches<V, T> = V extends T ? "1" : "0";
type IsArrayType<T> = Matches<T, any[]>;

type Not<T extends Bool> = { "1": "0"; "0": "1" }[T];
type InstanceOf<V, T> = And<Matches<V, T>, Not<Matches<T, V>>>;
type IsTuple<T extends { length: number }> = And<
  IsArrayType<T>,
  InstanceOf<T["length"], number>
>;

/**
 * Expand an item a single level, or recursively.
 * Source: https://stackoverflow.com/a/69288824/62937
 */
type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
  ? { [K in keyof O]: O[K] }
  : never;
