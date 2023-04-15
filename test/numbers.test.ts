import { Call, Numbers, Tuples, _, T } from "../src/index";
import { Equal, Expect } from "../src/internals/helpers";

describe("Numbers", () => {
  describe("Add", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Add, 0>, [1, 2, 3]>;
      //    ^?

      type test1 = Expect<Equal<res1, 6>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Numbers.Add<1>>, [1, 2, 3]>;
      //    ^?

      type test1 = Expect<Equal<res1, [2, 3, 4]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Call<Numbers.Add<1, 2>>;
      //    ^?

      type test1 = Expect<Equal<res1, 3>>;
    });
  });

  describe("Sub", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Sub, 0>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, -6>>;

      type res2 = Call<Numbers.Sub, 0, 1>;
      //    ^?
      type test2 = Expect<Equal<res2, -1>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Numbers.Sub<_, 1>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [0, 1, 2]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Call<Numbers.Sub<1, 2>>;
      //    ^?
      type test1 = Expect<Equal<res1, -1>>;
    });
    it("should reverse it's function arguments when partial applied", () => {
      type res1 = Call<Numbers.Sub<1>, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, 1>>;
    });

    it("shouldn't reverse if the position is explicit", () => {
      type res1 = Call<Numbers.Sub<1, _>, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, -1>>;
    });
  });

  describe("Mul", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Mul, 2>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, 12>>;

      type res2 = Call<Numbers.Mul, 3, 2>;
      //    ^?
      type test2 = Expect<Equal<res2, 6>>;

      type res3 = Call<Numbers.Mul, 3, -2>;
      //    ^?
      type test3 = Expect<Equal<res3, -6>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Numbers.Mul<_, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [2, 4, 6]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Call<Numbers.Mul<3, 2>>;
      //    ^?
      type test1 = Expect<Equal<res1, 6>>;
    });
  });

  describe("Div", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Div, 20>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, 3>>;

      type res2 = Call<Numbers.Div, 6, 2>;
      //    ^?
      type test2 = Expect<Equal<res2, 3>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Numbers.Div<_, 2>>, [2, 4, 6]>;
      //    ^?
      type test1 = Expect<Equal<res1, [1, 2, 3]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Call<Numbers.Div<6, 2>>;
      //    ^?
      type test1 = Expect<Equal<res1, 3>>;
    });
  });

  describe("Mod", () => {
    it("can be called without any pre-filled arguments", () => {
      type res2 = Call<Numbers.Mod, 5, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, 2>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Numbers.Mod<_, 5>>, [2, 4, 6]>;
      //    ^?
      type test1 = Expect<Equal<res1, [2, 4, 1]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Call<Numbers.Mod<5, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, 2>>;
    });
  });

  describe("Negate", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.Negate>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [-1, -2, -3]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Call<Numbers.Negate<100>>;
      //    ^?
      type test1 = Expect<Equal<res1, -100>>;
    });
  });

  describe("Abs", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.Abs>, [-1, 2, -3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [1, 2, 3]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Call<Numbers.Abs<-100>>;
      //    ^?
      type test1 = Expect<Equal<res1, 100>>;
    });
  });

  describe("Power", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Power, 2>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, 64>>;

      type res2 = Call<Numbers.Power, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, 8>>;

      type res3 = Call<Numbers.Power, 2, -3>;
      //    ^?
      type test3 = Expect<Equal<res3, 0>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.Power<_, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [1, 4, 9]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Call<Numbers.Power<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, 8>>;
    });
  });

  describe("Min", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Min, 2>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, 1>>;

      type res2 = Call<Numbers.Min, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, 2>>;

      type res3 = Call<Numbers.Min, 2, -3>;
      //    ^?
      type test3 = Expect<Equal<res3, -3>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.Min<_, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [1, 2, 2]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Call<Numbers.Min<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, 2>>;
    });
  });

  describe("Max", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Max, 2>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, 3>>;

      type res2 = Call<Numbers.Max, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, 3>>;

      type res3 = Call<Numbers.Max, 2, -3>;
      //    ^?
      type test3 = Expect<Equal<res3, 2>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.Max<_, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [2, 2, 3]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Call<Numbers.Max<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, 3>>;
    });
  });

  describe("Compare", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Numbers.Compare, 3, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, 1>>;

      type res2 = Call<Numbers.Compare, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, -1>>;

      type res3 = Call<Numbers.Compare, 2, 2>;
      //    ^?
      type test3 = Expect<Equal<res3, 0>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.Compare<_, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [-1, 0, 1]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Call<Numbers.Compare<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, -1>>;
    });
  });

  describe("LessThan", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Numbers.LessThan, 3, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;

      type res2 = Call<Numbers.LessThan, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, true>>;

      type res3 = Call<Numbers.LessThan, 2, 2>;
      //    ^?
      type test3 = Expect<Equal<res3, false>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.LessThan<_, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [true, false, false]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Call<Numbers.LessThan<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;
    });
  });

  describe("LessThanOrEqual", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Numbers.LessThanOrEqual, 3, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;

      type res2 = Call<Numbers.LessThanOrEqual, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, true>>;

      type res3 = Call<Numbers.LessThanOrEqual, 2, 2>;
      //    ^?
      type test3 = Expect<Equal<res3, true>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.LessThanOrEqual<_, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [true, true, false]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Call<Numbers.LessThanOrEqual<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;
    });
  });

  describe("GreaterThan", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Numbers.GreaterThan, 3, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;

      type res2 = Call<Numbers.GreaterThan, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, false>>;

      type res3 = Call<Numbers.GreaterThan, 2, 2>;
      //    ^?
      type test3 = Expect<Equal<res3, false>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.GreaterThan<_, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [false, false, true]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Call<Numbers.GreaterThan<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;
    });

    it("should reverse it's function arguments when partial applied", () => {
      type res4 = Call<Numbers.GreaterThan<1, 2>>;
      type test4 = Expect<Equal<res4, false>>;

      type res5 = Call<Numbers.GreaterThan<_, 2>, 1>;
      type test5 = Expect<Equal<res5, false>>;

      type res6 = Call<T.Map<Numbers.GreaterThan<_, 2>>, [1, 2, 3]>;
      type test6 = Expect<Equal<res6, [false, false, true]>>;

      type res7 = Call<Numbers.GreaterThan<2>, 1>;
      type test7 = Expect<Equal<res7, false>>;

      type res8 = Call<T.Map<Numbers.GreaterThan<2>>, [1, 2, 3]>;
      type test8 = Expect<Equal<res8, [false, false, true]>>;
    });
  });

  describe("GreaterThanOrEqual", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Numbers.GreaterThanOrEqual, 3, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;

      type res2 = Call<Numbers.GreaterThanOrEqual, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, false>>;

      type res3 = Call<Numbers.GreaterThanOrEqual, 2, 2>;
      //    ^?
      type test3 = Expect<Equal<res3, true>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.GreaterThanOrEqual<_, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [false, true, true]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Call<Numbers.GreaterThanOrEqual<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;
    });
  });
});
