import { Call, Eval, Tuples, Booleans } from "../src/index";
import { Equal, Expect } from "../src/internals/helpers";

describe("Booleans", () => {
  describe("And", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Booleans.And, true>, [true, true, false]>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Booleans.And<true>>, [true, false, true]>;
      //    ^?
      type test1 = Expect<Equal<res1, [true, false, true]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Eval<Booleans.And<true, true>>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;

      type res2 = Eval<Booleans.And<false, false>>;
      //    ^?
      type test2 = Expect<Equal<res2, false>>;

      type res3 = Eval<Booleans.And<true, false>>;
      //    ^?
      type test3 = Expect<Equal<res3, false>>;

      type res4 = Eval<Booleans.And<false, true>>;
      //    ^?
      type test4 = Expect<Equal<res4, false>>;
    });
  });

  describe("Or", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Booleans.Or, false>, [false, true, false]>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Booleans.Or<true>>, [true, false, true]>;
      //    ^?
      type test1 = Expect<Equal<res1, [true, true, true]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Eval<Booleans.Or<false, false>>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;

      type res2 = Eval<Booleans.Or<true, false>>;
      //    ^?
      type test2 = Expect<Equal<res2, true>>;

      type res3 = Eval<Booleans.Or<false, true>>;
      //    ^?
      type test3 = Expect<Equal<res3, true>>;

      type res4 = Eval<Booleans.Or<true, true>>;
      //    ^?
      type test4 = Expect<Equal<res4, true>>;
    });
  });

  it("Not", () => {
    type res1 = Call<Booleans.Not, true>;
    //    ^?
    type test1 = Expect<Equal<res1, false>>;

    type res2 = Eval<Booleans.Not<true>>;
    //    ^?
    type test2 = Expect<Equal<res2, false>>;
  });

  it("Extends", () => {
    type res1 = Call<Booleans.Extends<".">, [1, 2, 3]>;
    //    ^?
    type test1 = Expect<Equal<res1, false>>;

    type res2 = Eval<Booleans.Extends<"a", string>>;
    //    ^?
    type test2 = Expect<Equal<res2, true>>;

    type res3 = Eval<Booleans.Extends<string, "a">>;
    //    ^?
    type test3 = Expect<Equal<res3, false>>;
  });

  it("Equals", () => {
    type res1 = Call<Booleans.Equals<".">, ".">;
    //    ^?
    type test1 = Expect<Equal<res1, true>>;
  });

  it("DoesNotExtends", () => {
    type res1 = Call<Booleans.DoesNotExtends<"a">, "b">;
    //    ^?
    type test1 = Expect<Equal<res1, true>>;
  });
});
