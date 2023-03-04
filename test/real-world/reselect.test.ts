import * as H from "../../src/index";

type res = MergeParameters<
  // ^?
  [
    (a: number, b: number) => boolean,
    (c: 21, b: "hello") => string,
    (c: number | string, b: 2, d: 123) => string
  ]
>;

type MergeParameters<T extends readonly UnknownFunction[]> = H.Pipe<
  T,
  [
    H.Tuples.Map<H.Functions.Parameters>,
    PadWithUnknown,
    Transpose,
    H.Tuples.Map<H.Tuples.ToIntersection>
  ]
>;

interface Transpose extends H.Fn {
  return: H.Apply<H.Tuples.Zip, Extract<this["arg0"], any[]>>;
}

/**
 * Returns a list of `unknown` to pad the argsList
 * to make them all have the same length.
 * @example
 * ```ts
 * type T = GetUnknownPadding<2, [[], [1], [1, 2]]>
 * // [[unknown, unknown], [unknown], []]
 * ```
 */
type GetUnknownPadding<
  maxLength extends number,
  argsList extends any[][]
> = H.Eval<
  H.Tuples.Map<
    H.ComposeLeft<
      [
        H.Tuples.Length,
        H.Numbers.Sub<maxLength, H._>,
        H.Tuples.Range<0>,
        H.Tuples.Map<H.Constant<unknown>>,
        H.Tuples.Tail
      ]
    >,
    argsList
  >
>;

type GetMaxLength<argsList extends any[][]> = H.Pipe<
  argsList,
  [H.Tuples.Map<H.Tuples.Length>, H.Tuples.Reduce<H.Numbers.Max, 0>]
>;

interface PadWithUnknown extends H.Fn {
  return: this["args"] extends [infer argsList extends any[][]]
    ? GetMaxLength<argsList> extends infer maxLength extends number
      ? GetUnknownPadding<maxLength, argsList> extends infer pad extends any[]
        ? H.Eval<H.Tuples.ZipWith<H.Tuples.Concat, argsList, pad>>
        : never
      : never
    : never;
}

/** Any function with arguments */
type UnknownFunction = (...args: any[]) => any;
