import { Pipe, Fn, B, U, F, Eval, Call, Unions, _ } from "../src/index";
import { Compose } from "../src/internals/core/Core";
import { Equal, Expect } from "../src/internals/helpers";

describe("Unions", () => {
  it("Exclude", () => {
    type res1 = Pipe<"a" | "b" | "c", [U.Exclude<"a">]>;
    //   ^?
    type tes1 = Expect<Equal<res1, "b" | "c">>;
  });

  it("Extract", () => {
    type res1 = Pipe<"a" | "b" | "c", [U.Extract<"a" | "b">]>;
    type tes1 = Expect<Equal<res1, "a" | "b">>;
  });

  it("ExcludeBy", () => {
    type res1 = Pipe<"a" | "b" | "c", [U.ExcludeBy<B.Extends<"a">>]>;
    //   ^?
    type tes1 = Expect<Equal<res1, "b" | "c">>;
  });

  it("ExtractBy", () => {
    type res1 = Pipe<
      //  ^?
      "a" | "b" | "c",
      [U.ExtractBy<Compose<[B.Not, B.Extends<"a">]>>]
    >;
    type tes1 = Expect<Equal<res1, "b" | "c">>;
  });

  it("Map", () => {
    interface ToTuple extends Fn {
      return: [this["arg0"]];
    }

    type res1 = Pipe<"a" | "b" | "c", [U.Map<ToTuple>]>;
    //   ^?
    type tes1 = Expect<Equal<res1, ["a"] | ["b"] | ["c"]>>;

    type res2 = Eval<U.Map<ToTuple, "a" | "b" | "c">>;
    //   ^?
    type tes2 = Expect<Equal<res2, ["a"] | ["b"] | ["c"]>>;
  });

  it("Range", () => {
    type res0 = Call<Unions.Range<3>, 7>;
    //    ^?
    type test0 = Expect<Equal<res0, 3 | 4 | 5 | 6 | 7>>;

    type res1 = Call<Unions.Range<_, 10>, 5>;
    //    ^?
    type test1 = Expect<Equal<res1, 5 | 6 | 7 | 8 | 9 | 10>>;

    type res3 = Eval<Unions.Range<-2, 2>>;
    //    ^?
    type test3 = Expect<Equal<res3, -2 | -1 | 0 | 1 | 2>>;

    type res4 = Eval<Unions.Range<-5, -2>>;
    //    ^?
    type test4 = Expect<Equal<res4, -5 | -4 | -3 | -2>>;
  });

  it("ToTuple", () => {
    type res0 = Call<Unions.ToTuple, 1 | 2 | 3>;
    //    ^?
    type test0 = Expect<Equal<res0, [1, 2, 3]>>;
  });
});
