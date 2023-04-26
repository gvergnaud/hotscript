import { Pipe, Fn, B, U, Call, Unions, _ } from "../src/index";
import { Compose } from "../src/internals/core/Core";
import { Equal, Expect, Extends } from "../src/internals/helpers";

describe("Unions", () => {
  it("Exclude", () => {
    type res1 = Pipe<"a" | "b" | "c", [U.Exclude<"a">]>;
    //   ^?
    type tes1 = Expect<Equal<res1, "b" | "c">>;
  });

  it("NonNullable", () => {
    type res1 = Pipe<"a" | 1 | null | undefined, [U.NonNullable]>;
    //   ^?
    type tes1 = Expect<Equal<res1, "a" | 1>>;
    type res2 = Call<Unions.NonNullable<"a" | 1 | null | undefined>>;
    //    ^?
    type tes2 = Expect<Equal<res2, "a" | 1>>;
    type res3 = Call<Unions.NonNullable, "a" | 1 | null | undefined>;
    //    ^?
    type tes3 = Expect<Equal<res3, "a" | 1>>;
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

    type res2 = Call<U.Map<ToTuple, "a" | "b" | "c">>;
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

    type res3 = Call<Unions.Range<-2, 2>>;
    //    ^?
    type test3 = Expect<Equal<res3, -2 | -1 | 0 | 1 | 2>>;

    type res4 = Call<Unions.Range<-5, -2>>;
    //    ^?
    type test4 = Expect<Equal<res4, -5 | -4 | -3 | -2>>;
  });

  it("ToTuple", () => {
    type res1 = Call<Unions.ToTuple, 1 | 2 | 3>;
    //    ^?
    // Since the order isn't stable we can't use `Equal`:
    type test1 = Expect<Extends<res1, (1 | 2 | 3)[]>>;
    type test2 = Expect<Extends<res1, [any, ...any]>>;
  });

  it("ToIntersection", () => {
    type res1 = Call<Unions.ToIntersection, 1 | 2 | 3>;
    //    ^?
    type test1 = Expect<Equal<res1, never>>;

    type res2 = Call<Unions.ToIntersection, { a: string } | { b: number }>;
    //    ^?
    type test2 = Expect<Equal<res2, { a: string } & { b: number }>>;

    type res3 = Call<Unions.ToIntersection, { a: string } & { b: number }>;
    //    ^?
    type test3 = Expect<Equal<res3, { a: string } & { b: number }>>;

    type res4 = Call<Unions.ToIntersection, [1, 2, 3]>;
    //    ^?
    type test4 = Expect<Equal<res4, [1, 2, 3]>>;
  });
});
