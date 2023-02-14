import { Pipe, Fn, B, U, F } from "../src/index";
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
      [U.ExtractBy<F.Compose<[B.Not, B.Extends<"a">]>>]
    >;
    type tes1 = Expect<Equal<res1, "b" | "c">>;
  });

  it("Map", () => {
    interface ToTuple extends Fn {
      output: [this["args"][0]];
    }

    type res1 = Pipe<"a" | "b" | "c", [U.Map<ToTuple>]>;
    //   ^?
    type tes1 = Expect<Equal<res1, ["a"] | ["b"] | ["c"]>>;
  });
});
