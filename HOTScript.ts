/**
 * Generic helpers
 */

interface Fn {
  input: unknown;
  output: unknown;
}

type Call<fn extends Fn, input> = (fn & { input: input })["output"];

type Stringifiable = string | number | boolean | bigint | null | undefined;

type SplitImpl<
  str,
  sep extends string,
  output extends any[] = []
> = str extends `${infer first}${sep}${infer rest}`
  ? SplitImpl<rest, sep, [...output, first]>
  : output;

/**
 * Generic Array operations
 */

/**
 * Reduce
 */
type Reduce<xs, acc, fn extends Fn> = xs extends [infer first, ...infer rest]
  ? Reduce<rest, Call<fn, { acc: acc; item: first }>, fn>
  : acc;

/**
 * Define Map in terms of Reduce
 */
interface MapFn<fn extends Fn> extends Fn {
  output: this["input"] extends {
    acc: infer acc extends any[];
    item: infer item;
  }
    ? [...acc, Call<fn, item>]
    : never;
}

type ListMap<xs, fn extends Fn> = Reduce<xs, [], MapFn<fn>>;

/**
 * Define Filter in terms of Reduce
 */
interface FilterFn<fn extends Fn> extends Fn {
  output: this["input"] extends {
    acc: infer acc extends any[];
    item: infer item;
  }
    ? Call<fn, item> extends true
      ? [...acc, item]
      : acc
    : never;
}

type Filter<xs, fn extends Fn> = Reduce<xs, [], FilterFn<fn>>;

/**
 * Lets use that!
 */

interface ToPhrase extends Fn {
  output: `number is ${Extract<this["input"], string | number | boolean>}`;
}

type ys = ListMap<[1, 2, 3], ToPhrase>;
//   ^?

type MakeRange<n, acc extends any[] = []> = acc["length"] extends n
  ? acc
  : MakeRange<n, [...acc, acc["length"]]>;

type AddNumbers<a, b> = [...MakeRange<a>, ...MakeRange<b>]["length"];

type StringToNumber<str> = str extends `${infer n extends number}` ? n : never;

interface Add2 extends Fn {
  output: this["input"] extends {
    acc: infer acc;
    item: infer item;
  }
    ? AddNumbers<acc, item>
    : never;
}

interface JoinReducer<sep extends string> extends Fn {
  output: this["input"] extends {
    acc: infer acc extends Stringifiable;
    item: infer item extends Stringifiable;
  }
    ? `${acc extends "" ? "" : `${acc}${sep}`}${item}`
    : never;
}

interface PipeFn extends Fn {
  output: this["input"] extends {
    acc: infer acc;
    item: infer fn extends Fn;
  }
    ? Call<fn, acc>
    : never;
}

type Pipe<init, xs extends Fn[]> = Reduce<xs, init, PipeFn>;

interface Add<n> extends Fn {
  output: AddNumbers<this["input"], n>;
}

interface MapAdd<n> extends Fn {
  output: ListMap<this["input"], Add<n>>;
}

interface Join<sep extends string> extends Fn {
  output: Reduce<this["input"], "", JoinReducer<sep>>;
}

interface Split<sep extends string> extends Fn {
  output: SplitImpl<this["input"], sep>;
}

interface ToNumber extends Fn {
  output: this["input"] extends `${infer n extends number}` ? n : never;
}

interface MapToNumber extends Fn {
  output: ListMap<this["input"], ToNumber>;
}

interface Sum extends Fn {
  output: Reduce<this["input"], 0, Add2>;
}

// prettier-ignore
type result = Pipe<
  //  ^?
  [1, 2, 3, 4, 3, 4],
  [
    MapAdd<3>,
    Join<'.'>,
    Split<'.'>,
    MapToNumber,
    MapAdd<10>,
    Sum
  ]
>;
