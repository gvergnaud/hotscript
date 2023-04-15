import { $, Tuples, Booleans, T, _ } from "../src/index";
import { Equal, Expect } from "../src/internals/helpers";

describe("Booleans", () => {
  describe("And", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = $<Tuples.Reduce<Booleans.And, true>, [true, true, false]>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = $<Tuples.Map<Booleans.And<true>>, [true, false, true]>;
      //    ^?
      type test1 = Expect<Equal<res1, [true, false, true]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = $<Booleans.And<true, true>>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;

      type res2 = $<Booleans.And<false, false>>;
      //    ^?
      type test2 = Expect<Equal<res2, false>>;

      type res3 = $<Booleans.And<true, false>>;
      //    ^?
      type test3 = Expect<Equal<res3, false>>;

      type res4 = $<Booleans.And<false, true>>;
      //    ^?
      type test4 = Expect<Equal<res4, false>>;
    });
  });

  describe("Or", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = $<Tuples.Reduce<Booleans.Or, false>, [false, true, false]>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = $<Tuples.Map<Booleans.Or<true>>, [true, false, true]>;
      //    ^?
      type test1 = Expect<Equal<res1, [true, true, true]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = $<Booleans.Or<false, false>>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;

      type res2 = $<Booleans.Or<true, false>>;
      //    ^?
      type test2 = Expect<Equal<res2, true>>;

      type res3 = $<Booleans.Or<false, true>>;
      //    ^?
      type test3 = Expect<Equal<res3, true>>;

      type res4 = $<Booleans.Or<true, true>>;
      //    ^?
      type test4 = Expect<Equal<res4, true>>;
    });
  });

  describe("XOr", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = $<Tuples.Reduce<Booleans.XOr, true>, [false, true, false]>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = $<Tuples.Map<Booleans.XOr<true>>, [true, false, true]>;
      //    ^?
      type test1 = Expect<Equal<res1, [false, true, false]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = $<Booleans.XOr<true, true>>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;

      type res2 = $<Booleans.XOr<false, false>>;
      //    ^?
      type test2 = Expect<Equal<res2, false>>;

      type res3 = $<Booleans.XOr<true, false>>;
      //    ^?
      type test3 = Expect<Equal<res3, true>>;

      type res4 = $<Booleans.XOr<false, true>>;
      //    ^?
      type test4 = Expect<Equal<res4, true>>;
    });
  });

  it("Not", () => {
    type res1 = $<Booleans.Not, true>;
    //    ^?
    type test1 = Expect<Equal<res1, false>>;

    type res2 = $<Booleans.Not<true>>;
    //    ^?
    type test2 = Expect<Equal<res2, false>>;
  });

  describe("Extends", () => {
    it("should check if a type is assignable to another type", () => {
      type res1 = $<Booleans.Extends<".">, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;

      type res2 = $<Booleans.Extends<"a", string>>;
      //    ^?
      type test2 = Expect<Equal<res2, true>>;

      type res3 = $<Booleans.Extends<string, "a">>;
      //    ^?
      type test3 = Expect<Equal<res3, false>>;
    });

    it("should reverse it's function arguments when partial applied", () => {
      type res4 = $<Booleans.Extends<1, number>>;
      type test4 = Expect<Equal<res4, true>>;

      type res5 = $<Booleans.Extends<_, 2>, 1>;
      type test5 = Expect<Equal<res5, false>>;

      type res6 = $<T.Map<Booleans.Extends<_, number>>, [1, "2", 3]>;
      type test6 = Expect<Equal<res6, [true, false, true]>>;

      type res7 = $<Booleans.Extends<number>, 1>;
      type test7 = Expect<Equal<res7, true>>;

      type res8 = $<T.Map<Booleans.Extends<number>>, [1, "2", 3]>;
      type test8 = Expect<Equal<res8, [true, false, true]>>;
    });
  });

  it("Equals", () => {
    type res1 = $<Booleans.Equals<".">, ".">;
    //    ^?
    type test1 = Expect<Equal<res1, true>>;
  });

  it("DoesNotExtend", () => {
    type res1 = $<Booleans.DoesNotExtend<"a">, "b">;
    //    ^?
    type test1 = Expect<Equal<res1, true>>;
  });
});
