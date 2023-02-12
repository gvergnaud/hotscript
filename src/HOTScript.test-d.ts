import { describe, assertType, it, expectTypeOf } from 'vitest'
import { Pipe, Numbers, Tuples, Strings, PipeRight, Call, Fn, Extends, T, O, S } from './HOTScript';

describe("HOTScript", () => {
  describe("Composition", () => {
    it("Pipe", () => {
      type Result = Pipe<
        // ^?
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

      assertType<Result>(78)
    });

    it("PipeRight", () => {
      type Result = PipeRight<
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

      assertType<Result>(78)
    });
  });

  describe("Tuples", () => {
    it("Head", () => {
      type Result = Call<Tuples.Head, [1, 2, 3]>;
      //   ^?
      assertType<Result>(1)
    });

    it("Tail", () => {
      type Result = Call<Tuples.Tail, [1, 2, 3]>;
      //   ^?
      assertType<Result>([2, 3])
    });

    it("Last", () => {
      type Result = Call<Tuples.Last, [1, 2, 3]>;
      //   ^?
      assertType<Result>(3)
    });

    it("Map", () => {
      interface ToPhrase extends Fn {
        output: `number is ${Extract<
          this["args"][0],
          string | number | boolean
        >}`;
      }

      type Result = Call<Tuples.Map<ToPhrase>, [1, 2, 3]>;
      //   ^?
      assertType<Result>(["number is 1", "number is 2", "number is 3"])
    });

    it("Filter", () => {
      interface IsNumber extends Fn {
        output: this["args"][0] extends number ? true : false;
      }

      type Result = Call<Tuples.Filter<IsNumber>, [1, 2, "oops", 3]>;
      //   ^?
      assertType<Result>([1, 2, 3])
    });

    it("Reduce", () => {
      interface ToUnaryTupleArray extends Fn {
        output: this["args"] extends [infer acc extends any[], infer item]
          ? [...acc, [item]]
          : never;
      }

      type Result = Call<Tuples.Reduce<[], ToUnaryTupleArray>, [1, 2, 3]>;
      //   ^?
      assertType<Result>([[1], [2], [3]])
    });

    it("ReduceRight", () => {
      interface ToUnaryTupleArray extends Fn {
        output: this["args"] extends [infer acc extends any[], infer item]
          ? [...acc, [item]]
          : never;
      }

      type Result = Call<
        //   ^?
        Tuples.ReduceRight<[], ToUnaryTupleArray>,
        [1, 2, 3]
      >;
      assertType<Result>([[3], [2], [1]]);
    });

    it("FlatMap", () => {
      interface Duplicate extends Fn {
        output: [this["args"][0], this["args"][0]];
      }

      type Result = Call<Tuples.FlatMap<Duplicate>, [1, 2, 3]>;
      //   ^?
      assertType<Result>([1, 1, 2, 2, 3, 3])
    });

    it("Find", () => {
      interface IsNumber extends Fn {
        output: this["args"][0] extends number ? true : false;
      }

      type Result = Call<Tuples.Find<IsNumber>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      assertType<Result>(2)

      interface IsSecond extends Fn {
        output: this["args"][1] extends 1 ? true : false;
      }

      type Result2 = Call<Tuples.Find<IsSecond>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      assertType<Result2>("b")
    });

    it("Drop", () => {
      type Result = Call<Tuples.Drop<1>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      assertType<Result>(["b", "c", 2, "d"])

      type Result2 = Call<Tuples.Drop<2>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      assertType<Result2>(["c", 2, "d"])
    });

    it("Take", () => {
      type Result = Call<Tuples.Take<1>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      assertType<Result>(["a"])

      type Result2 = Call<Tuples.Take<2>, ["a", "b", "c", 2, "d"]>;
      //   ^?
      assertType<Result2>(["a", "b"])
    });

    it("TakeWhile", () => {
      type Result = Call<
        //   ^?
        Tuples.TakeWhile<Extends<string>>,
        ["a", "b", "c", 2, "d"]
      >;
      assertType<Result>(["a", "b", "c"]);

      type Result2 = Call<
        //   ^?
        Tuples.TakeWhile<Extends<number>>,
        [1, 2, "a", "b", "c", 2, "d"]
      >;
      assertType<Result2>([1, 2]);
    });

    it("Composition", () => {
      interface Duplicate extends Fn {
        output: [this["args"][0], this["args"][0]];
      }

      // prettier-ignore
      type Result = Pipe<
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

      assertType<Result>(39);
    });
  });

  describe("Objects", () => {
    it("FromEntries", () => {
      type Result = Call<
        //   ^?
        O.FromEntries,
        ["a", string] | ["b", number]
      >;
      expectTypeOf<Result>().toEqualTypeOf<{ a: string; b: number }>();
    });

    it("Entries", () => {
      type Result = Call<
        //   ^?
        O.Entries,
        { a: string; b: number }
      >;
      expectTypeOf<Result>().toEqualTypeOf<["a", string] | ["b", number]>();
    });

    it("Entries >> FromEntries identity", () => {
      type Result = Pipe<{ a: string; b: number }, [O.Entries, O.FromEntries]>;
      //   ^?
      expectTypeOf<Result>().toEqualTypeOf<{ a: string; b: number }>();
    });

    it("MapValues", () => {
      type Result = Call<
        //   ^?
        O.MapValues<S.ToString>,
        { a: 1; b: true }
      >;
      assertType<Result>({ a: "1", b: "true" });
    });

    it("MapKeys", () => {
      type Result = Call<
        //   ^?
        O.MapKeys<S.Prepend<"get_">>,
        { a: 1; b: true }
      >;
      assertType<Result>({ get_a: 1, get_b: true });
    });

    it("Pick", () => {
      type Result = Call<
        //   ^?
        O.PickKey<"a">,
        { a: 1; b: true }
      >;
      assertType<Result>({ a: 1 })
    });

    it("Omit", () => {
      type Result = Call<
        //   ^?
        O.OmitKey<"a">,
        { a: 1; b: true }
      >;
      assertType<Result>({ b: true })
    });

    it("PickBy", () => {
      type Result = Call<
        //   ^?
        O.PickBy<Extends<1>>,
        { a: 1; b: true; c: 1 }
      >;
      assertType<Result>({ a: 1, c: 1 });
    });

    it("OmitBy", () => {
      type Result = Call<
        //   ^?
        O.OmitBy<Extends<1>>,
        { a: 1; b: true; c: 1 }
      >;
      assertType<Result>({ b: true });
    });
  });
});
