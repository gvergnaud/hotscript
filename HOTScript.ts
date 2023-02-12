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

interface TupleMap<fn extends Fn> extends Fn {
  output: Reduce<this["input"], [], MapFn<fn>>;
}

interface TupleReduce<init, fn extends Fn> extends Fn {
  output: Reduce<this["input"], init, fn>;
}

interface TupleFilter<fn extends Fn> extends Fn {
  output: Reduce<this["input"], [], FilterFn<fn>>;
}

/**
 * Lets use that!
 */

interface ToPhrase extends Fn {
  output: `number is ${Extract<this["input"], string | number | boolean>}`;
}

type ys = Call<TupleMap<ToPhrase>, [1, 2, 3]>;
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
  output: Call<TupleMap<Add<n>>, this["input"]>;
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
  output: Call<TupleMap<ToNumber>, this["input"]>;
}

interface Sum extends Fn {
  output: Reduce<this["input"], 0, Add2>;
}

// prettier-ignore
type result = Pipe<
  //  ^?
  [1, 2, 3, 4, 3, 4],
  [
    TupleMap<Add<3>>,
    Join<'.'>,
    Split<'.'>,
    TupleMap<ToNumber>,
    TupleMap<Add<10>>,
    Sum
  ]
>;
