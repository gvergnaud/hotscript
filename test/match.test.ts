import {
  Booleans,
  Eval,
  Functions,
  Match,
  Numbers,
  Strings,
  Tuples,
} from "../src/index";
import { Equal, Expect } from "../src/internals/helpers";

describe("Match", () => {
  it("should match with regular types", () => {
    type MatchTest<T> = Eval<
      Match<
        T,
        [
          Match.With<{ msg: string }, Functions.Constant<"a">>,
          Match.With<string, Functions.Constant<"b">>,
          Match.With<any, Functions.Constant<"c">>
        ]
      >
    >;

    type res1 = MatchTest<{ msg: "hello" }>;
    //    ^?

    type test1 = Expect<Equal<res1, "a">>;
    type res2 = MatchTest<"hello">;
    //    ^?

    type test2 = Expect<Equal<res2, "b">>;
    type res3 = MatchTest<1>;
    //    ^?

    type test3 = Expect<Equal<res3, "c">>;
  });

  it("should work with patterns destructuring arguments", () => {
    type MatchTest<T> = Eval<
      Match<
        T,
        [
          Match.With<
            { nested: { value: Match.arg0 } },
            Strings.Prepend<"nested.value === ">
          >,
          Match.With<{ x: Match.arg0; y: Match.arg1 }, Numbers.Add>,
          Match.With<
            { x: { y: [1, 2, Match.arg0] } },
            Strings.Prepend<"x.y[2] === ">
          >,
          Match.With<string, Strings.Prepend<"string: ">>,
          Match.With<any, Functions.Constant<"default value">>
        ]
      >
    >;

    type res1 = MatchTest<{ nested: { value: 123 } }>;
    //   ^?
    type test1 = Expect<Equal<res1, "nested.value === 123">>;

    type res2 = MatchTest<"world">;
    //   ^?
    type test2 = Expect<Equal<res2, "string: world">>;

    type res3 = MatchTest<1>;
    //   ^?
    type test3 = Expect<Equal<res3, "default value">>;

    type res4 = MatchTest<{ x: 1; y: 2 }>;
    //   ^?
    type test4 = Expect<Equal<res4, 3>>;

    type res5 = MatchTest<{ x: { y: [1, 2, 3] } }>;
    //   ^?
    type test5 = Expect<Equal<res5, "x.y[2] === 3">>;
  });

  it("should work with constrained arguments", () => {
    type MatchTest<T> = Eval<
      Match<
        T,
        [
          Match.With<{ msg: Match.arg0<string> }, Strings.Prepend<"msg: ">>,
          Match.With<
            { x: Match.arg0<number>; y: Match.arg1<number> },
            Numbers.Add
          >,
          Match.With<
            { x: Match.arg0<string>; y: Match.arg1<string> },
            Strings.Prepend
          >
        ]
      >
    >;

    type res1 = MatchTest<{ msg: "hello" }>;
    //   ^?
    type test1 = Expect<Equal<res1, "msg: hello">>;

    type res2 = MatchTest<{ x: 1; y: 2 }>;
    //   ^?
    type test2 = Expect<Equal<res2, 3>>;

    type res3 = MatchTest<{ x: "a"; y: "b" }>;
    //   ^?
    type test3 = Expect<Equal<res3, "ab">>;
  });

  it("Composition", () => {
    type Transform<xs extends any[]> = Eval<
      Tuples.Map<
        Match<
          [
            Match.With<string, Strings.Replace<"0", "1">>,
            Match.With<number, Numbers.Add<1>>,
            Match.With<boolean, Booleans.Not>
          ]
        >,
        xs
      >
    >;

    type res1 = Transform<[1, 2, "101", true]>;
    //    ^?
    type test1 = Expect<Equal<res1, [2, 3, "111", false]>>;
  });
});
