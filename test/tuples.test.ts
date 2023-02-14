import { Args } from "../src/internals/args/Args";
import { Booleans } from "../src/internals/booleans/Booleans";
import { Call, Eval, Fn, Pipe } from "../src/internals/core/Core";
import { Equal, Expect } from "../src/internals/helpers";
import { Numbers } from "../src/internals/numbers/Numbers";
import { Strings } from "../src/internals/strings/Strings";
import { Tuples } from "../src/internals/tuples/Tuples";

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

    type res1 = Call<Tuples.Reduce<ToUnaryTupleArray, []>, [1, 2, 3]>;
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
      Tuples.ReduceRight<ToUnaryTupleArray, []>,
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
      Tuples.TakeWhile<Booleans.Extends<Args._, string>>,
      ["a", "b", "c", 2, "d"]
    >;
    type tes1 = Expect<Equal<res1, ["a", "b", "c"]>>;

    type NewType = Args._;

    type res2 = Call<
      //   ^?
      Tuples.TakeWhile<Booleans.Extends<NewType, number>>,
      [1, 2, "a", "b", "c", 2, "d"]
    >;
    type tes2 = Expect<Equal<res2, [1, 2]>>;
  });

  it("Every", () => {
    type res1 = Call<
      //   ^?
      Tuples.Every<Booleans.Extends<Args._, string>>,
      ["a", "b", "c", "d"]
    >;
    type tes1 = Expect<Equal<res1, true>>;

    type res2 = Call<
      //   ^?
      Tuples.Every<Booleans.Extends<Args._, number>>,
      [1, 2, "a", "b", "c", 2, "d"]
    >;
    type tes2 = Expect<Equal<res2, false>>;
  });

  it("Some", () => {
    type res1 = Call<
      //   ^?
      Tuples.Some<Booleans.Extends<Args._, number>>,
      ["a", "b", "c", "d"]
    >;
    type tes1 = Expect<Equal<res1, false>>;

    type res2 = Call<
      //   ^?
      Tuples.Some<Booleans.Extends<Args._, number>>,
      [1, 2, "a", "b", "c", 2, "d"]
    >;
    type tes2 = Expect<Equal<res2, true>>;
  });

  it("Sort Numbers (default)", () => {
    type res1 = Call<
      //   ^?
      Tuples.Sort,
      [7, 1, 3, 2, 6, 5, 8, 4]
    >;
    type tes1 = Expect<Equal<res1, [1, 2, 3, 4, 5, 6, 7, 8]>>;
  });

  it("Sort Numbers (custom)", () => {
    type res1 = Call<
      //   ^?
      Tuples.Sort<Numbers.GreaterThanOrEqual>,
      [7, 1, 3, 2, 6, 5, 8, 4]
    >;
    type tes1 = Expect<Equal<res1, [8, 7, 6, 5, 4, 3, 2, 1]>>;
  });

  it("Sort Strings (custom)", () => {
    type res1 = Call<
      //   ^?
      Tuples.Sort<Strings.LessThanOrEqual>,
      ["c", "a", "f", "b", "e", "d"]
    >;
    type tes1 = Expect<Equal<res1, ["a", "b", "c", "d", "e", "f"]>>;
  });

  it("Join", () => {
    type res1 = Call<Tuples.Join<".">, [1, 2, 3]>;
    //    ^?
    type test1 = Expect<Equal<res1, "1.2.3">>;
  });

  it("Append", () => {
    type res1 = Call<Tuples.Append<4>, [1, 2, 3]>;
    //    ^?
    type test1 = Expect<Equal<res1, [1, 2, 3, 4]>>;

    type res2 = Eval<Tuples.Append<[1, 2, 3], 4>>;
    //    ^?
    type test2 = Expect<Equal<res2, [1, 2, 3, 4]>>;
  });

  it("Prepend", () => {
    type res1 = Call<Tuples.Prepend<0>, [1, 2, 3]>;
    //    ^?
    type test1 = Expect<Equal<res1, [0, 1, 2, 3]>>;

    type res2 = Eval<Tuples.Prepend<[1, 2, 3], 0>>;
    //    ^?
    type test2 = Expect<Equal<res2, [0, 1, 2, 3]>>;
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
        Tuples.FlatMap<Duplicate>,
        Tuples.Map<Numbers.Add<3>>,
        Tuples.Drop<3>,
        Tuples.Take<6>,
        Tuples.Sum
      ]
    >;

    type test = Expect<Equal<res, 39>>;
  });
});
