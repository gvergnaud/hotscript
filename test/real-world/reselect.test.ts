/**
 * Use case from @markerikson
 * https://github.com/gvergnaud/hotscript/discussions/65#discussioncomment-5109155
 */

import * as H from "../../src/index";
import { Equal, Expect } from "../../src/internals/helpers";

describe("Reselect", () => {
  type MergeParameters<T> = H.Pipe<
    T,
    [
      H.Tuples.Map<H.Functions.Parameters>,
      PadWithUnknown,
      ApplyArg<H.Tuples.Zip>,
      H.Tuples.Map<H.Tuples.ToIntersection>
    ]
  >;

  interface ApplyArg<fn extends H.Fn> extends H.Fn {
    return: H.Apply<fn, this["arg0"]>;
  }

  /**
   * Make sure all lists of arguments have the same length by
   * adding unknown arguments at the end of the shorter ones.
   * @example
   * ```ts
   * type T = Call<PadWithUnknown, [[], [1], [1, 2]]>>
   * // [[unknown, unknown], [1, unknown], [1, 2]]
   * ```
   */
  interface PadWithUnknown extends H.Fn {
    return: this["args"] extends [infer argsList extends any[][]]
      ? H.Pipe<
          argsList,
          [
            GetMaxLength,
            GetUnknownPadding<argsList>,
            H.Tuples.ZipWith<H.Tuples.Concat, argsList, H._>
          ]
        >
      : never;
  }

  type GetMaxLength = H.ComposeLeft<
    [H.Tuples.Map<H.Tuples.Length>, H.Tuples.Reduce<H.Numbers.Max, 0>]
  >;

  /**
   * Returns a list of `unknown` to pad the argsList
   * to make them all have the same length.
   * @example
   * ```ts
   * type T = Call<GetUnknownPadding<[[], [1], [1, 2]]>, 2>
   * // [[unknown, unknown], [unknown], []]
   * ```
   */
  interface GetUnknownPadding<argsList extends any[][]> extends H.Fn {
    return: H.Call<
      H.Tuples.Map<
        H.ComposeLeft<
          [
            H.Tuples.Length,
            H.Numbers.Sub<this["arg0"], H._>,
            H.Tuples.Range<0>,
            H.Tuples.Map<H.Constant<unknown>>,
            H.Tuples.Tail
          ]
        >,
        argsList
      >
    >;
  }

  it("MergeParameters", () => {
    type res1 = MergeParameters<[(a: number) => boolean, (c: 42) => string]>;
    //   ^?
    type test1 = Expect<Equal<res1, [42]>>;

    type res2 = MergeParameters<
      //  ^?
      [
        (a: number | string) => boolean,
        (a: number) => boolean,
        (c: 42) => string
      ]
    >;
    type test2 = Expect<Equal<res2, [42]>>;

    type res3 = MergeParameters<
      //  ^?
      [
        (a: number | string) => boolean,
        (a: string, b: string, c: string) => boolean,
        (c: "hello") => string
      ]
    >;
    type test3 = Expect<Equal<res3, ["hello", string, string]>>;

    type res4 = MergeParameters<
      //  ^?
      [
        (a: number | string) => boolean,
        (a: string, b: string) => boolean,
        (c: number, b: string) => string
      ]
    >;
    type test4 = Expect<Equal<res4, [never, string]>>;
  });
});
