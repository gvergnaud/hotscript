export namespace HOT {
  export interface Fn {
    args: unknown[];
    output: unknown;
  }

  export type Apply<fn extends HOT.Fn, args> = (fn & {
    args: args;
  })["output"];

  export type Call<fn extends HOT.Fn, arg1> = (fn & {
    args: [arg1];
  })["output"];

  export type Call2<fn extends HOT.Fn, arg1, arg2> = (fn & {
    args: [arg1, arg2];
  })["output"];

  export type Call3<fn extends HOT.Fn, arg1, arg2, arg3> = (fn & {
    args: [arg1, arg2, arg3];
  })["output"];

  export type Call4<fn extends HOT.Fn, arg1, arg2, arg3, arg4> = (fn & {
    args: [arg1, arg2, arg3, arg3];
  })["output"];

  export type Reduce<xs, acc, fn extends HOT.Fn> = xs extends [
    infer first,
    ...infer rest
  ]
    ? Reduce<rest, HOT.Call2<fn, acc, first>, fn>
    : acc;

  export type ReduceRight<xs, acc, fn extends HOT.Fn> = xs extends [
    ...infer rest,
    infer last
  ]
    ? ReduceRight<rest, HOT.Call2<fn, acc, last>, fn>
    : acc;

  interface PipeFn extends HOT.Fn {
    output: this["args"] extends [infer acc, infer fn extends HOT.Fn]
      ? HOT.Call<fn, acc>
      : never;
  }

  export type Pipe<init, xs extends HOT.Fn[]> = HOT.Reduce<xs, init, PipeFn>;

  interface PipeRightFn extends HOT.Fn {
    output: this["args"] extends [infer acc, infer fn extends HOT.Fn]
      ? HOT.Call<fn, acc>
      : never;
  }

  export type PipeRight<xs extends HOT.Fn[], init> = HOT.ReduceRight<
    xs,
    init,
    PipeRightFn
  >;
}

/**
 * Strings
 */

export namespace Strings {
  export type Stringifiable =
    | string
    | number
    | boolean
    | bigint
    | null
    | undefined;

  type SplitImpl<
    str,
    sep extends string,
    output extends any[] = []
  > = str extends `${infer first}${sep}${infer rest}`
    ? SplitImpl<rest, sep, [...output, first]>
    : output;

  interface JoinReducer<sep extends string> extends HOT.Fn {
    output: this["args"] extends [
      infer acc extends Strings.Stringifiable,
      infer item extends Strings.Stringifiable
    ]
      ? `${acc extends "" ? "" : `${acc}${sep}`}${item}`
      : never;
  }

  export interface Join<sep extends string> extends HOT.Fn {
    output: HOT.Reduce<this["args"][0], "", JoinReducer<sep>>;
  }

  export interface Split<sep extends string> extends HOT.Fn {
    output: SplitImpl<this["args"][0], sep>;
  }

  export interface ToNumber extends HOT.Fn {
    output: this["args"][0] extends `${infer n extends number}` ? n : never;
  }
}

/**
 * Numbers
 */
export namespace Numbers {
  type Add2Impl<a, b> = [...Tuples.Range<a>, ...Tuples.Range<b>]["length"];

  export interface Add<n> extends HOT.Fn {
    output: Add2Impl<this["args"][0], n>;
  }

  export interface Add2 extends HOT.Fn {
    output: this["args"] extends [infer acc, infer item]
      ? Add2Impl<acc, item>
      : never;
  }
}

/**
 * Tuples
 */
export namespace Tuples {
  interface MapFn<fn extends HOT.Fn> extends HOT.Fn {
    output: this["args"] extends [infer acc extends any[], infer item]
      ? [...acc, HOT.Call<fn, item>]
      : never;
  }

  interface FilterFn<fn extends HOT.Fn> extends HOT.Fn {
    output: this["args"] extends [infer acc extends any[], infer item]
      ? HOT.Call<fn, item> extends true
        ? [...acc, item]
        : acc
      : never;
  }

  type HeadImpl<xs> = xs extends readonly [infer head, ...any] ? head : never;

  type TailImpl<xs> = xs extends readonly [any, ...infer tail] ? tail : never;

  type LastImpl<xs> = xs extends readonly [...any, infer last] ? last : never;

  export interface Head extends HOT.Fn {
    output: HeadImpl<this["args"][0]>;
  }

  export interface Tail extends HOT.Fn {
    output: TailImpl<this["args"][0]>;
  }

  export interface Last extends HOT.Fn {
    output: LastImpl<this["args"][0]>;
  }

  export interface Map<fn extends HOT.Fn> extends HOT.Fn {
    output: HOT.Reduce<this["args"][0], [], MapFn<fn>>;
  }

  export interface Reduce<init, fn extends HOT.Fn> extends HOT.Fn {
    output: HOT.Reduce<this["args"][0], init, fn>;
  }

  export interface Filter<fn extends HOT.Fn> extends HOT.Fn {
    output: HOT.Reduce<this["args"][0], [], FilterFn<fn>>;
  }

  export interface Sum extends HOT.Fn {
    output: HOT.Reduce<this["args"][0], 0, Numbers.Add2>;
  }

  export type Range<n, acc extends any[] = []> = acc["length"] extends n
    ? acc
    : Range<n, [...acc, acc["length"]]>;
}

/**
 * Objects
 */

export namespace Objects {}

/**
 * Unions
 */
export namespace Unions {}
