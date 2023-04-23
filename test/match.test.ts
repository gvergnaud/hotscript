import {
  Booleans,
  Call,
  Match,
  Numbers,
  Objects,
  Strings,
  Tuples,
  Unions,
} from "../src/index";
import {
  arg0,
  arg1,
  ComposeLeft,
  Constant,
  Pipe,
} from "../src/internals/core/Core";
import { Equal, Expect } from "../src/internals/helpers";

describe("Match", () => {
  it("should match with regular types", () => {
    type MatchTest<T> = Call<
      Match<
        T,
        [
          Match.With<{ msg: string }, Constant<"a">>,
          Match.With<string, Constant<"b">>,
          Match.With<any, Constant<"c">>
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
    type MatchTest<T> = Call<
      Match<
        T,
        [
          Match.With<
            { nested: { value: arg0 } },
            Strings.Prepend<"nested.value === ">
          >,
          Match.With<{ x: arg0; y: arg1 }, Numbers.Add>,
          Match.With<
            { x: { y: [1, 2, arg0] } },
            Strings.Prepend<"x.y[2] === ">
          >,
          Match.With<string, Strings.Prepend<"string: ">>,
          Match.With<any, Constant<"default value">>
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
    type MatchTest<T> = Call<
      Match<
        T,
        [
          Match.With<{ msg: arg0<string> }, Strings.Prepend<"msg: ">>,
          Match.With<{ x: arg0<number>; y: arg1<number> }, Numbers.Add>,
          Match.With<{ x: arg0<string>; y: arg1<string> }, Strings.Prepend>
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

  it("Handlers can also be regular values", () => {
    type MatchTest<T> = Call<
      Match<
        T,
        [
          Match.With<{ msg: string }, "a">,
          Match.With<string, "b">,
          Match.With<any, "c">
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

  describe("Composition", () => {
    it("Map and Match", () => {
      type Transform<xs extends any[]> = Call<
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

    it("RouteToParams", () => {
      type RouteToParams<T> = Pipe<
        T,
        [
          Strings.Split<"/">,
          Tuples.Filter<Strings.StartsWith<"<">>,
          Tuples.ToUnion,
          Unions.Map<
            ComposeLeft<
              [
                Strings.Trim<"<" | ">">,
                Strings.Split<":">,
                Objects.Update<
                  "[1]",
                  Match<
                    [
                      Match.With<"string", string>,
                      Match.With<"number", number>,
                      Match.With<"boolean", boolean>
                    ]
                  >
                >
              ]
            >
          >,
          Objects.FromEntries
        ]
      >;

      type res1 = RouteToParams<"/users/<id:string>/posts/<index:number>">;
      //    ^?
      type test1 = Expect<Equal<res1, { id: string; index: number }>>;

      type res2 = RouteToParams<"/dashboard/<dashId:string>">;
      //    ^?
      type test2 = Expect<Equal<res2, { dashId: string }>>;
    });
  });
});
