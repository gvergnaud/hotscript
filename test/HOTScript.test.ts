import {
  Pipe,
  PipeRight,
  Call,
  Fn,
  Extends,
  Numbers,
  Strings,
  Tuples,
  T,
  O,
  S,
  N,
  U,
} from "../src";
import { Equal, Expect } from "./helpers";

describe("HOTScript", () => {
  describe("Composition", () => {
    it("Pipe", () => {
      type res1 = Pipe<
        //  ^?
        [1, 2, 3, 4, 3, 4],
        [
          Tuples.Map<Numbers.Add<3>>,
          Strings.Join<".">,
          Strings.Split<".">,
          Tuples.Map<Strings.ToNumber>,
          Tuples.Map<Numbers.Add<10>>,
          Tuples.Sum
        ]
      >;

      type tes1 = Expect<Equal<res1, 78>>;
    });

    it("PipeRight", () => {
      type res1 = PipeRight<
        //  ^?
        [
          Tuples.Sum,
          Tuples.Map<Numbers.Add<10>>,
          Tuples.Map<Strings.ToNumber>,
          Strings.Split<".">,
          Strings.Join<".">,
          Tuples.Map<Numbers.Add<3>>
        ],
        [1, 2, 3, 4, 3, 4]
      >;

      type tes1 = Expect<Equal<res1, 78>>;
    });
  });

  describe("Tuples", () => {
    it("Head", () => {
      type res1 = Call<Tuples.Head, [1, 2, 3]>;
      //   ^?
      type tes1 = Expect<Equal<res1, 1>>;
    });

    it("Tail", () => {
      type res1 = Call<Tuples.Tail, [1, 2, 3]>;
      //   ^?
      type tes1 = Expect<Equal<res1, [2, 3]>>;
    });

    it("Last", () => {
      type res1 = Call<Tuples.Last, [1, 2, 3]>;
      //   ^?
      type tes1 = Expect<Equal<res1, 3>>;
    });

    it("Map", () => {
      interface ToPhrase extends Fn {
        output: `number is ${Extract<
          this["args"][0],
          string | number | boolean
        >}`;
      }

      type res1 = Call<Tuples.Map<ToPhrase>, [1, 2, 3]>;
      //   ^?
      type tes1 = Expect<
        Equal<res1, ["number is 1", "number is 2", "number is 3"]>
      >;
    });

    it("Filter", () => {
      interface IsNumber extends Fn {
        output: this["args"][0] extends number ? true : false;
      }

      type res1 = Call<Tuples.Filter<IsNumber>, [1, 2, "oops", 3]>;
      //   ^?
      type tes1 = Expect<Equal<res1, [1, 2, 3]>>;
    });

    it("Reduce", () => {
      interface ToUnaryTupleArray extends Fn {
        output: this["args"] extends [infer acc extends any[], infer item]
          ? [...acc, [item]]
          : never;
      }

      type res1 = Call<Tuples.Reduce<[], ToUnaryTupleArray>, [1, 2, 3]>;
      //   ^?
      type tes1 = Expect<Equal<res1, [[1], [2], [3]]>>;
    });

    it("ReduceRight", () => {
      interface ToUnaryTupleArray extends Fn {
        output: this["args"] extends [infer acc extends any[], infer item]
          ? [...acc, [item]]
          : never;
      }

      type res1 = Call<
        //   ^?
        Tuples.ReduceRight<[], ToUnaryTupleArray>,
        [1, 2, 3]
      >;
      type tes1 = Expect<Equal<res1, [[3], [2], [1]]>>;
    });

    it("FlatMap", () => {
      interface Duplicate extends Fn {
        output: [this["args"][0], this["args"][0]];
      }

      type res1 = Call<Tuples.FlatMap<Duplicate>, [1, 2, 3]>;
      //   ^?
      type tes1 = Expect<Equal<res1, [1, 1, 2, 2, 3, 3]>>;
    });

    it("Find", () => {
      interface IsNumber extends Fn {
        output: this["args"][0] extends number ? true : false;
      }

      type res1 = Call<Tuples.Find<IsNumber>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      type tes1 = Expect<Equal<res1, 2>>;

      interface IsSecond extends Fn {
        output: this["args"][1] extends 1 ? true : false;
      }

      type res2 = Call<Tuples.Find<IsSecond>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      type tes2 = Expect<Equal<res2, "b">>;
    });

    it("Drop", () => {
      type res1 = Call<Tuples.Drop<1>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      type tes1 = Expect<Equal<res1, ["b", "c", 2, "d"]>>;

      type res2 = Call<Tuples.Drop<2>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      type tes2 = Expect<Equal<res2, ["c", 2, "d"]>>;
    });

    it("Take", () => {
      type res1 = Call<Tuples.Take<1>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      type tes1 = Expect<Equal<res1, ["a"]>>;

      type res2 = Call<Tuples.Take<2>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      type tes2 = Expect<Equal<res2, ["a", "b"]>>;
    });

    it("TakeWhile", () => {
      type res1 = Call<
        //   ^?
        Tuples.TakeWhile<Extends<string>>,
        ["a", "b", "c", 2, "d"]
      >;
      type tes1 = Expect<Equal<res1, ["a", "b", "c"]>>;

      type res2 = Call<
        //   ^?
        Tuples.TakeWhile<Extends<number>>,
        [1, 2, "a", "b", "c", 2, "d"]
      >;
      type tes2 = Expect<Equal<res2, [1, 2]>>;
    });

    it("Composition", () => {
      interface Duplicate extends Fn {
        output: [this["args"][0], this["args"][0]];
      }

      // prettier-ignore
      type res = Pipe<
      //    ^?
        [1, 2, 3, 4, 5, 5, 6],
        [
          T.FlatMap<Duplicate>,
          T.Map<Numbers.Add<3>>,
          T.Drop<3>,
          T.Take<6>,
          T.Sum
        ]
      >;

      type test = Expect<Equal<res, 39>>;
    });
  });

  describe("Objects", () => {
    it("FromEntries", () => {
      type res1 = Call<
        //   ^?
        O.FromEntries,
        ["a", string] | ["b", number]
      >;
      type tes1 = Expect<Equal<res1, { a: string; b: number }>>;
    });

    it("Entries", () => {
      type res1 = Call<
        //   ^?
        O.Entries,
        { a: string; b: number }
      >;
      type tes1 = Expect<Equal<res1, ["a", string] | ["b", number]>>;
    });

    it("Entries >> FromEntries identity", () => {
      type res1 = Pipe<{ a: string; b: number }, [O.Entries, O.FromEntries]>;
      //   ^?

      type tes1 = Expect<Equal<res1, { a: string; b: number }>>;
    });

    it("MapValues", () => {
      type res1 = Call<
        //   ^?
        O.MapValues<S.ToString>,
        { a: 1; b: true }
      >;
      type tes1 = Expect<Equal<res1, { a: "1"; b: "true" }>>;
    });

    it("MapKeys", () => {
      type res1 = Call<
        //   ^?
        O.MapKeys<S.Prepend<"get_">>,
        { a: 1; b: true }
      >;
      type tes1 = Expect<Equal<res1, { get_a: 1; get_b: true }>>;
    });
  });
});
