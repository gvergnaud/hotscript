import { Booleans } from "../src/internals/booleans/Booleans";
import {
  Apply,
  Call,
  Call2,
  Eval,
  Fn,
  Pipe,
  _,
} from "../src/internals/core/Core";
import { Equal, Expect } from "../src/internals/helpers";
import { Numbers } from "../src/internals/numbers/Numbers";
import { Strings } from "../src/internals/strings/Strings";
import { Tuples } from "../src/internals/tuples/Tuples";

describe("Tuples", () => {
  it("Create", () => {
    type res1 = Apply<Tuples.Create, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]>;
    //   ^?
    type tes1 = Expect<Equal<res1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]>>;

    type res2 = Eval<Tuples.Create<1, 2, 3, 4, 5>>;
    //   ^?
    type tes2 = Expect<Equal<res2, [1, 2, 3, 4, 5]>>;
  });

  it("Head", () => {
    type res1 = Call<Tuples.Head, [1, 2, 3]>;
    //   ^?
    type tes1 = Expect<Equal<res1, 1>>;

    type res2 = Eval<Tuples.Head<[1, 2, 3]>>;
    //   ^?
    type tes2 = Expect<Equal<res2, 1>>;
  });

  it("Tail", () => {
    type res1 = Call<Tuples.Tail, [1, 2, 3]>;
    //   ^?
    type tes1 = Expect<Equal<res1, [2, 3]>>;

    type res2 = Eval<Tuples.Tail<[1, 2, 3]>>;
    //   ^?
    type tes2 = Expect<Equal<res2, [2, 3]>>;
  });

  it("Last", () => {
    type res1 = Call<Tuples.Last, [1, 2, 3]>;
    //   ^?
    type tes1 = Expect<Equal<res1, 3>>;

    type res2 = Eval<Tuples.Last<[1, 2, 3]>>;
    //   ^?
    type tes2 = Expect<Equal<res2, 3>>;
  });

  it("Map", () => {
    interface ToPhrase extends Fn {
      return: `number is ${Extract<this["arg0"], string | number | boolean>}`;
    }

    type res1 = Call<Tuples.Map<ToPhrase>, [1, 2, 3]>;
    //   ^?
    type tes1 = Expect<
      Equal<res1, ["number is 1", "number is 2", "number is 3"]>
    >;

    type res2 = Eval<Tuples.Map<ToPhrase, [1, 2, 3]>>;
    //   ^?
    type tes2 = Expect<
      Equal<res2, ["number is 1", "number is 2", "number is 3"]>
    >;
  });

  it("Filter", () => {
    interface IsNumber extends Fn {
      return: this["arg0"] extends number ? true : false;
    }

    type res1 = Call<Tuples.Filter<IsNumber>, [1, 2, "oops", 3]>;
    //   ^?
    type tes1 = Expect<Equal<res1, [1, 2, 3]>>;

    type res2 = Eval<Tuples.Filter<IsNumber, [1, 2, "oops", 3]>>;
    //   ^?
    type tes2 = Expect<Equal<res2, [1, 2, 3]>>;
  });

  it("Reduce", () => {
    interface ToUnaryTupleArray extends Fn {
      return: this["args"] extends [infer acc extends any[], infer item]
        ? [...acc, [item]]
        : never;
    }

    type res1 = Call<Tuples.Reduce<ToUnaryTupleArray, []>, [1, 2, 3]>;
    //   ^?
    type tes1 = Expect<Equal<res1, [[1], [2], [3]]>>;

    type res2 = Eval<Tuples.Reduce<ToUnaryTupleArray, [], [1, 2, 3]>>;
    //   ^?
    type tes2 = Expect<Equal<res2, [[1], [2], [3]]>>;
  });

  it("ReduceRight", () => {
    interface ToUnaryTupleArray extends Fn {
      return: this["args"] extends [infer acc extends any[], infer item]
        ? [...acc, [item]]
        : never;
    }

    type res1 = Call<
      //   ^?
      Tuples.ReduceRight<ToUnaryTupleArray, []>,
      [1, 2, 3]
    >;
    type tes1 = Expect<Equal<res1, [[3], [2], [1]]>>;

    type res2 = Eval<Tuples.ReduceRight<ToUnaryTupleArray, [], [1, 2, 3]>>;
    //   ^?
    type tes2 = Expect<Equal<res2, [[3], [2], [1]]>>;
  });

  it("FlatMap", () => {
    interface Duplicate extends Fn {
      return: [this["arg0"], this["arg0"]];
    }

    type res1 = Call<Tuples.FlatMap<Duplicate>, [1, 2, 3]>;
    //   ^?
    type tes1 = Expect<Equal<res1, [1, 1, 2, 2, 3, 3]>>;

    type res2 = Eval<Tuples.FlatMap<Duplicate, [1, 2, 3]>>;
    //   ^?
    type tes2 = Expect<Equal<res2, [1, 1, 2, 2, 3, 3]>>;
  });

  it("Find", () => {
    interface IsNumber extends Fn {
      return: this["arg0"] extends number ? true : false;
    }

    type res1 = Call<Tuples.Find<IsNumber>, ["a", "b", "c", 2, "d"]>;
    //   ^?
    type tes1 = Expect<Equal<res1, 2>>;

    interface IsSecond extends Fn {
      return: this["arg1"] extends 1 ? true : false;
    }

    type res2 = Call<Tuples.Find<IsSecond>, ["a", "b", "c", 2, "d"]>;
    //   ^?
    type tes2 = Expect<Equal<res2, "b">>;

    type res3 = Eval<Tuples.Find<IsSecond, ["a", "b", "c", 2, "d"]>>;
    //   ^?
    type tes3 = Expect<Equal<res3, "b">>;
  });

  it("Drop", () => {
    type res1 = Call<Tuples.Drop<1>, ["a", "b", "c", 2, "d"]>;
    //   ^?
    type tes1 = Expect<Equal<res1, ["b", "c", 2, "d"]>>;

    type res2 = Call<Tuples.Drop<2>, ["a", "b", "c", 2, "d"]>;
    //   ^?
    type tes2 = Expect<Equal<res2, ["c", 2, "d"]>>;

    type res3 = Eval<Tuples.Drop<2, ["a", "b", "c", 2, "d"]>>;
    //   ^?
    type tes3 = Expect<Equal<res3, ["c", 2, "d"]>>;
  });

  it("Take", () => {
    type res1 = Call<Tuples.Take<1>, ["a", "b", "c", 2, "d"]>;
    //   ^?
    type tes1 = Expect<Equal<res1, ["a"]>>;

    type res2 = Call<Tuples.Take<2>, ["a", "b", "c", 2, "d"]>;
    //   ^?
    type tes2 = Expect<Equal<res2, ["a", "b"]>>;

    type res3 = Eval<Tuples.Take<2, ["a", "b", "c", 2, "d"]>>;
    //   ^?
    type tes3 = Expect<Equal<res3, ["a", "b"]>>;
  });

  it("TakeWhile", () => {
    type res1 = Call<
      //   ^?
      Tuples.TakeWhile<Booleans.Extends<_, string>>,
      ["a", "b", "c", 2, "d"]
    >;
    type tes1 = Expect<Equal<res1, ["a", "b", "c"]>>;

    type res2 = Call<
      //   ^?
      Tuples.TakeWhile<Booleans.Extends<_, number>>,
      [1, 2, "a", "b", "c", 2, "d"]
    >;
    type tes2 = Expect<Equal<res2, [1, 2]>>;

    type res3 = Eval<
      //   ^?
      Tuples.TakeWhile<
        Booleans.Extends<_, number>,
        [1, 2, "a", "b", "c", 2, "d"]
      >
    >;
    type tes3 = Expect<Equal<res3, [1, 2]>>;
  });

  it("Every", () => {
    type res1 = Call<
      //   ^?
      Tuples.Every<Booleans.Extends<_, string>>,
      ["a", "b", "c", "d"]
    >;
    type tes1 = Expect<Equal<res1, true>>;

    type res2 = Call<
      //   ^?
      Tuples.Every<Booleans.Extends<_, number>>,
      [1, 2, "a", "b", "c", 2, "d"]
    >;
    type tes2 = Expect<Equal<res2, false>>;
  });

  it("Some", () => {
    type res1 = Call<
      //   ^?
      Tuples.Some<Booleans.Extends<_, number>>,
      ["a", "b", "c", "d"]
    >;
    type tes1 = Expect<Equal<res1, false>>;

    type res2 = Call<
      //   ^?
      Tuples.Some<Booleans.Extends<_, number>>,
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

    type res2 = Eval<Tuples.Append<4, [1, 2, 3]>>;
    //    ^?
    type test2 = Expect<Equal<res2, [1, 2, 3, 4]>>;
  });

  it("Prepend", () => {
    type res1 = Call<Tuples.Prepend<0>, [1, 2, 3]>;
    //    ^?
    type test1 = Expect<Equal<res1, [0, 1, 2, 3]>>;

    type res2 = Eval<Tuples.Prepend<0, [1, 2, 3]>>;
    //    ^?
    type test2 = Expect<Equal<res2, [0, 1, 2, 3]>>;
  });

  it("Partition", () => {
    type res1 = Call<
      //    ^?
      Tuples.Partition<Booleans.Extends<number>>,
      [1, "a", 2, "b", 3, "c"]
    >;
    type test1 = Expect<Equal<res1, [[1, 2, 3], ["a", "b", "c"]]>>;

    type res2 = Pipe<
      //    ^?
      [1, "a", 2, "b", 3, "c"],
      [Tuples.Partition<Booleans.Extends<number>>, Tuples.At<0>, Tuples.At<2>]
    >;
    type test2 = Expect<Equal<res2, 3>>;
  });

  it("At", () => {
    type res1 = Eval<
      //    ^?
      Tuples.At<2, [1, "a", 2, "b", 3, "c"]>
    >;
    type test1 = Expect<Equal<res1, 2>>;

    // check out of bounds
    type res2 = Eval<
      //    ^?
      Tuples.At<6, [1, "a", 2, "b", 3, "c"]>
    >;
    type test2 = Expect<Equal<res2, undefined>>;
  });

  it("IsEmpty", () => {
    type res1 = Eval<
      //    ^?
      Tuples.IsEmpty<[1, "a", 2, "b", 3, "c"]>
    >;
    type test1 = Expect<Equal<res1, false>>;

    type res2 = Call<
      //    ^?
      Tuples.IsEmpty,
      []
    >;
    type test2 = Expect<Equal<res2, true>>;

    type res3 = Eval<
      //    ^?
      Tuples.IsEmpty<[]>
    >;
    type test3 = Expect<Equal<res3, true>>;
  });

  it("Zip", () => {
    type res1 = Call<
      //    ^?
      Tuples.Zip<[1, 2, 3]>,
      ["a", "b", "c"]
    >;
    type test1 = Expect<Equal<res1, [[1, "a"], [2, "b"], [3, "c"]]>>;

    type res2 = Call2<
      //    ^?
      Tuples.Zip,
      [1, 2, 3],
      ["a", "b", "c"]
    >;
    type test2 = Expect<Equal<res2, [[1, "a"], [2, "b"], [3, "c"]]>>;

    type res3 = Eval<
      //    ^?
      Tuples.Zip<[1, 2, 3], ["a", "b", "c"]>
    >;
    type test3 = Expect<Equal<res3, [[1, "a"], [2, "b"], [3, "c"]]>>;
  });

  it("ZipWith", () => {
    type res1 = Call2<
      //    ^?
      Tuples.ZipWith<Numbers.Add>,
      [1, 2, 3],
      [4, 5, 6]
    >;
    type test1 = Expect<Equal<res1, [5, 7, 9]>>;

    type res2 = Eval<
      //    ^?
      Tuples.ZipWith<Numbers.Add, [1, 2, 3], [4, 5, 6]>
    >;
    type test2 = Expect<Equal<res2, [5, 7, 9]>>;

    type res3 = Pipe<
      //    ^?
      [1, 2, 3],
      [Tuples.ZipWith<Numbers.Add, [4, 5, 6]>]
    >;
    type test3 = Expect<Equal<res3, [5, 7, 9]>>;
  });

  it("Composition", () => {
    interface Duplicate extends Fn {
      return: [this["arg0"], this["arg0"]];
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
