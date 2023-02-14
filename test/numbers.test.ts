import { Call, Call2, Eval, Numbers, Tuples, Args } from "../src/index";
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
      type res1 = Eval<Numbers.Add<1, 2>>;
      //    ^?

      type test1 = Expect<Equal<res1, 3>>;
    });
  });

  describe("Sub", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Sub, 0>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, -6>>;

      type res2 = Call2<Numbers.Sub, 0, 1>;
      //    ^?
      type test2 = Expect<Equal<res2, -1>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Numbers.Sub<Args._, 1>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [0, 1, 2]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Eval<Numbers.Sub<1, 2>>;
      //    ^?
      type test1 = Expect<Equal<res1, -1>>;
    });
  });

  describe("Mul", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Mul, 2>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, 12>>;

      type res2 = Call2<Numbers.Mul, 3, 2>;
      //    ^?
      type test2 = Expect<Equal<res2, 6>>;

      type res3 = Call2<Numbers.Mul, 3, -2>;
      //    ^?
      type test3 = Expect<Equal<res3, -6>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Numbers.Mul<Args._, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [2, 4, 6]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Eval<Numbers.Mul<3, 2>>;
      //    ^?
      type test1 = Expect<Equal<res1, 6>>;
    });
  });

  describe("Div", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Div, 20>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, 3>>;

      type res2 = Call2<Numbers.Div, 6, 2>;
      //    ^?
      type test2 = Expect<Equal<res2, 3>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Numbers.Div<Args._, 2>>, [2, 4, 6]>;
      //    ^?
      type test1 = Expect<Equal<res1, [1, 2, 3]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Eval<Numbers.Div<6, 2>>;
      //    ^?
      type test1 = Expect<Equal<res1, 3>>;
    });
  });

  describe("Mod", () => {
    it("can be called without any pre-filled arguments", () => {
      type res2 = Call2<Numbers.Mod, 5, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, 2>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<Tuples.Map<Numbers.Mod<Args._, 5>>, [2, 4, 6]>;
      //    ^?
      type test1 = Expect<Equal<res1, [2, 4, 1]>>;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Eval<Numbers.Mod<5, 3>>;
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
      type res1 = Eval<Numbers.Negate<100>>;
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
      type res1 = Eval<Numbers.Abs<-100>>;
      //    ^?
      type test1 = Expect<Equal<res1, 100>>;
    });
  });

  describe("Power", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<Tuples.Reduce<Numbers.Power, 2>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, 64>>;

      type res2 = Call2<Numbers.Power, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, 8>>;

      type res3 = Call2<Numbers.Power, 2, -3>;
      //    ^?
      type test3 = Expect<Equal<res3, 0>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.Power<Args._, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [1, 4, 9]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Eval<Numbers.Power<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, 8>>;
    });
  });

  describe("Compare", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call2<Numbers.Compare, 3, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, 1>>;

      type res2 = Call2<Numbers.Compare, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, -1>>;

      type res3 = Call2<Numbers.Compare, 2, 2>;
      //    ^?
      type test3 = Expect<Equal<res3, 0>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.Compare<Args._, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [-1, 0, 1]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Eval<Numbers.Compare<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, -1>>;
    });
  });

  describe("LessThan", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call2<Numbers.LessThan, 3, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;

      type res2 = Call2<Numbers.LessThan, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, true>>;

      type res3 = Call2<Numbers.LessThan, 2, 2>;
      //    ^?
      type test3 = Expect<Equal<res3, false>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.LessThan<Args._, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [true, false, false]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Eval<Numbers.LessThan<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;
    });
  });

  describe("LessThanOrEqual", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call2<Numbers.LessThanOrEqual, 3, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;

      type res2 = Call2<Numbers.LessThanOrEqual, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, true>>;

      type res3 = Call2<Numbers.LessThanOrEqual, 2, 2>;
      //    ^?
      type test3 = Expect<Equal<res3, true>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<
        Tuples.Map<Numbers.LessThanOrEqual<Args._, 2>>,
        [1, 2, 3]
      >;
      //    ^?
      type test1 = Expect<Equal<res1, [true, true, false]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Eval<Numbers.LessThanOrEqual<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;
    });
  });

  describe("GreaterThan", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call2<Numbers.GreaterThan, 3, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;

      type res2 = Call2<Numbers.GreaterThan, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, false>>;

      type res3 = Call2<Numbers.GreaterThan, 2, 2>;
      //    ^?
      type test3 = Expect<Equal<res3, false>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<Tuples.Map<Numbers.GreaterThan<Args._, 2>>, [1, 2, 3]>;
      //    ^?
      type test1 = Expect<Equal<res1, [false, false, true]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Eval<Numbers.GreaterThan<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;
    });
  });

  describe("GreaterThanOrEqual", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call2<Numbers.GreaterThanOrEqual, 3, 2>;
      //    ^?
      type test1 = Expect<Equal<res1, true>>;

      type res2 = Call2<Numbers.GreaterThanOrEqual, 2, 3>;
      //    ^?
      type test2 = Expect<Equal<res2, false>>;

      type res3 = Call2<Numbers.GreaterThanOrEqual, 2, 2>;
      //    ^?
      type test3 = Expect<Equal<res3, true>>;
    });

    it("can be called with one pre-filled arguments", () => {
      type res1 = Call<
        Tuples.Map<Numbers.GreaterThanOrEqual<Args._, 2>>,
        [1, 2, 3]
      >;
      //    ^?
      type test1 = Expect<Equal<res1, [false, true, true]>>;
    });

    it("can be called with 1 pre-filled arguments", () => {
      type res1 = Eval<Numbers.GreaterThanOrEqual<2, 3>>;
      //    ^?
      type test1 = Expect<Equal<res1, false>>;
    });
  });
});
