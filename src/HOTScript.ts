import {
  AnyTuple,
  Prettify,
  RemoveUnknownArrayConstraint,
  UnionToIntersection,
} from "./helpers";

export interface Fn {
  args: unknown[];
  output: unknown;
}

export type Apply<fn extends Fn, args> = (fn & {
  args: args;
})["output"];

export type Call<fn extends Fn, arg1> = (fn & {
  args: [arg1];
})["output"];

export type Eval<fn extends Fn> = (fn & {
  args: [];
})["output"];

export type Call2<fn extends Fn, arg1, arg2> = (fn & {
  args: [arg1, arg2];
})["output"];

export type Call3<fn extends Fn, arg1, arg2, arg3> = (fn & {
  args: [arg1, arg2, arg3];
})["output"];

export type Call4<fn extends Fn, arg1, arg2, arg3, arg4> = (fn & {
  args: [arg1, arg2, arg3, arg3];
})["output"];

interface PipeFn extends Fn {
  output: this["args"] extends [infer acc, infer fn extends Fn]
    ? Call<fn, acc>
    : never;
}

export type Pipe<init, xs extends Fn[]> = Tuples.ReduceImpl<xs, init, PipeFn>;

interface PipeRightFn extends Fn {
  output: this["args"] extends [infer acc, infer fn extends Fn]
    ? Call<fn, acc>
    : never;
}

export type PipeRight<xs extends Fn[], init> = Tuples.ReduceRightImpl<
  xs,
  init,
  PipeRightFn
>;

/**
 * Misc
 */

export interface Extends<T> extends Fn {
  output: this["args"][0] extends T ? true : false;
}

export interface DoesNotExtends<T> extends Fn {
  output: this["args"][0] extends T ? false : true;
}

type placeholder = "@hotscript/placeholder";

type MergeArgsRec<
  inputArgs extends any[],
  partialArgs extends any[],
  output extends any[] = []
> = partialArgs extends [infer partialFirst, ...infer partialRest]
  ? partialFirst extends placeholder
    ? inputArgs extends [infer inputFirst, ...infer inputRest]
      ? MergeArgsRec<inputRest, partialRest, [...output, inputFirst]>
      : [
          ...output,
          ...Call<Tuples.Filter<DoesNotExtends<placeholder>>, partialRest>
        ]
    : MergeArgsRec<inputArgs, partialRest, [...output, partialFirst]>
  : [...output, ...inputArgs];

type MergeArgs<
  inputArgs extends any[],
  partialArgs extends any[]
> = MergeArgsRec<RemoveUnknownArrayConstraint<inputArgs>, partialArgs>;

/**
 * Functions
 */
export namespace Functions {
  export type _ = placeholder;

  interface PipeableApplyPartial<fn extends Fn, partialArgs extends any[]>
    extends Fn {
    output: Apply<fn, MergeArgs<this["args"], partialArgs>>;
  }

  export type ApplyPartial<
    fn extends Fn,
    args extends any[]
  > = PipeableApplyPartial<fn, args>;
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
    : [...output, str];

  interface JoinReducer<sep extends string> extends Fn {
    output: this["args"] extends [
      infer acc extends Strings.Stringifiable,
      infer item extends Strings.Stringifiable
    ]
      ? `${acc extends "" ? "" : `${acc}${sep}`}${item}`
      : never;
  }

  export interface Join<sep extends string> extends Fn {
    output: Tuples.ReduceImpl<this["args"][0], "", JoinReducer<sep>>;
  }

  export interface Split<sep extends string> extends Fn {
    output: SplitImpl<this["args"][0], sep>;
  }

  export interface ToNumber extends Fn {
    output: this["args"][0] extends `${infer n extends number}` ? n : never;
  }

  export interface ToString extends Fn {
    output: `${Extract<this["args"][0], Strings.Stringifiable>}`;
  }

  export interface Prepend<str extends string> extends Fn {
    output: `${str}${Extract<this["args"][0], Strings.Stringifiable>}`;
  }

  export interface Append<str extends string> extends Fn {
    output: `${Extract<this["args"][0], Strings.Stringifiable>}${str}`;
  }
}

/**
 * Numbers
 */
export namespace Numbers {
  type Add2Impl<a, b> = [...Tuples.Range<a>, ...Tuples.Range<b>]["length"];

  export interface Add<
    n1 extends number | placeholder = placeholder,
    n2 extends number | placeholder = placeholder
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [infer a, infer b, ...any]
      ? Add2Impl<a, b>
      : never;
  }
}

/**
 * Tuples
 */
export namespace Tuples {
  type HeadImpl<xs> = xs extends readonly [infer head, ...any] ? head : never;

  export interface Head extends Fn {
    output: HeadImpl<this["args"][0]>;
  }

  type TailImpl<xs> = xs extends readonly [any, ...infer tail] ? tail : never;

  export interface Tail extends Fn {
    output: TailImpl<this["args"][0]>;
  }

  type LastImpl<xs> = xs extends readonly [...any, infer last] ? last : never;

  export interface Last extends Fn {
    output: LastImpl<this["args"][0]>;
  }

  interface MapFn<fn extends Fn> extends Fn {
    output: this["args"] extends [infer acc extends any[], infer item]
      ? [...acc, Call<fn, item>]
      : never;
  }

  export interface Map<fn extends Fn> extends Fn {
    output: Tuples.ReduceImpl<this["args"][0], [], MapFn<fn>>;
  }

  interface FlatMapFn<fn extends Fn> extends Fn {
    output: this["args"] extends [infer acc extends any[], infer item]
      ? [...acc, ...Extract<Call<fn, item>, readonly any[]>]
      : never;
  }

  export interface FlatMap<fn extends Fn> extends Fn {
    output: Tuples.ReduceImpl<this["args"][0], [], FlatMapFn<fn>>;
  }

  export type ReduceImpl<xs, acc, fn extends Fn> = xs extends [
    infer first,
    ...infer rest
  ]
    ? ReduceImpl<rest, Call2<fn, acc, first>, fn>
    : acc;

  export interface Reduce<fn extends Fn, init> extends Fn {
    output: Tuples.ReduceImpl<this["args"][0], init, fn>;
  }

  export type ReduceRightImpl<xs, acc, fn extends Fn> = xs extends [
    ...infer rest,
    infer last
  ]
    ? ReduceRightImpl<rest, Call2<fn, acc, last>, fn>
    : acc;

  export interface ReduceRight<fn extends Fn, init> extends Fn {
    output: Tuples.ReduceRightImpl<this["args"][0], init, fn>;
  }

  interface FilterFn<fn extends Fn> extends Fn {
    output: this["args"] extends [infer acc extends any[], infer item]
      ? Call<fn, item> extends true
        ? [...acc, item]
        : acc
      : never;
  }

  export interface Filter<fn extends Fn> extends Fn {
    output: Tuples.ReduceImpl<this["args"][0], [], FilterFn<fn>>;
  }

  type FindImpl<xs, fn extends Fn, index extends any[] = []> = xs extends [
    infer first,
    ...infer rest
  ]
    ? Call2<fn, first, index["length"]> extends true
      ? first
      : FindImpl<rest, fn, [...index, any]>
    : never;

  export interface Find<fn extends Fn> extends Fn {
    output: FindImpl<this["args"][0], fn>;
  }

  export interface Sum extends Fn {
    output: Tuples.ReduceImpl<this["args"][0], 0, Numbers.Add>;
  }

  export type Range<n, acc extends any[] = []> = acc["length"] extends n
    ? acc
    : Range<n, [...acc, acc["length"]]>;

  type DropImpl<
    xs extends readonly any[],
    n extends any[]
  > = Iterator.Get<n> extends 0
    ? xs
    : xs extends readonly [any, ...infer tail]
    ? DropImpl<tail, Iterator.Prev<n>>
    : [];

  export interface Drop<n extends number> extends Fn {
    output: DropImpl<
      Extract<this["args"][0], readonly any[]>,
      Iterator.Iterator<n>
    >;
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

  export interface Take<n extends number> extends Fn {
    output: TakeImpl<
      Extract<this["args"][0], readonly any[]>,
      Iterator.Iterator<n>
    >;
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

  export interface TakeWhile<fn extends Fn> extends Fn {
    output: TakeWhileImpl<Extract<this["args"][0], readonly any[]>, fn>;
  }
}

/**
 * Objects
 */

export namespace Objects {
  type FromEntriesImpl<entries extends [PropertyKey, any]> = {
    [entry in entries as entry[0]]: entry[1];
  };

  export interface FromEntries extends Fn {
    output: FromEntriesImpl<Extract<this["args"][0], [PropertyKey, any]>>;
  }

  type EntriesImpl<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T];

  export interface Entries extends Fn {
    output: EntriesImpl<this["args"][0]>;
  }

  type MapValuesImpl<T, fn extends Fn> = {
    [K in keyof T]: Call2<fn, T[K], K>;
  };

  export interface MapValues<fn extends Fn> extends Fn {
    output: MapValuesImpl<this["args"][0], fn>;
  }

  type MapKeysImpl<T, fn extends Fn> = {
    [K in keyof T as Extract<Call<fn, K>, PropertyKey>]: T[K];
  };

  export interface MapKeys<fn extends Fn> extends Fn {
    output: MapKeysImpl<this["args"][0], fn>;
  }

  export interface PickKey<key> extends Fn {
    output: Pick<this["args"][0], Extract<key, keyof this["args"][0]>>;
  }

  export interface OmitKey<key> extends Fn {
    output: Omit<this["args"][0], Extract<key, keyof this["args"][0]>>;
  }

  type PickEntriesImpl<
    entries extends [PropertyKey, any],
    fn extends Fn
  > = entries extends any
    ? Call2<fn, entries[1], entries[0]> extends true
      ? entries
      : never
    : never;

  type PickByImpl<T, fn extends Fn> = FromEntriesImpl<
    PickEntriesImpl<EntriesImpl<T>, fn>
  >;

  export interface PickBy<fn extends Fn> extends Fn {
    output: PickByImpl<this["args"][0], fn>;
  }

  type OmitEntriesImpl<
    entries extends [PropertyKey, any],
    fn extends Fn
  > = entries extends any
    ? Call2<fn, entries[1], entries[0]> extends true
      ? never
      : entries
    : never;

  type OmitByImpl<T, fn extends Fn> = FromEntriesImpl<
    OmitEntriesImpl<EntriesImpl<T>, fn>
  >;

  export interface OmitBy<fn extends Fn> extends Fn {
    output: OmitByImpl<this["args"][0], fn>;
  }

  type AssignImpl<xs extends readonly any[]> = Prettify<
    UnionToIntersection<xs[number]>
  >;

  export interface Assign extends Fn {
    output: AssignImpl<this["args"]>;
  }
}

/**
 * Unions
 */
export namespace Unions {}

export namespace Iterator {
  export type Get<it extends readonly any[]> = it["length"];

  export type Iterator<
    n extends number,
    it extends any[] = []
  > = it["length"] extends n ? it : Iterator<n, [any, ...it]>;

  export type Next<it extends any[]> = [any, ...it];
  export type Prev<it extends any[]> = it extends readonly [any, ...infer tail]
    ? tail
    : [];
}

export {
  Objects as O,
  Unions as U,
  Strings as S,
  Numbers as N,
  Tuples as T,
  Functions as F,
};
