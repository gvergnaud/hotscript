import {
  Pipe,
  PipeRight,
  Call,
  Call2,
  Numbers,
  Strings,
  Tuples,
  O,
  N,
  F,
  Args,
} from "../src/index";
import { Equal, Expect } from "../src/internals/helpers";

describe("Functions", () => {
  it("Identity", () => {
    // check primitives
    type res1 = Call<F.Identity, string>;
    //   ^?
    type tes1 = Expect<Equal<res1, string>>;
    type res2 = Call<F.Identity, undefined>;
    //   ^?
    type tes2 = Expect<Equal<res2, undefined>>;
    // check unions
    type res3 = Call<F.Identity, string | number>;
    //   ^?
    type tes3 = Expect<Equal<res3, string | number>>;
  });

  it("Parameters", () => {
    type res1 = Call<F.Parameters, (a: string, b: number) => void>;
    //   ^?
    type tes1 = Expect<Equal<res1, [string, number]>>;
  });

  it("Parameter", () => {
    type res1 = Call<F.Parameter<0>, (a: string, b: number) => void>;
    //   ^?
    type tes1 = Expect<Equal<res1, string>>;
  });

  it("Return", () => {
    type res1 = Call<F.Return, (a: string, b: number) => boolean>;
    //   ^?
    type tes1 = Expect<Equal<res1, boolean>>;
  });
});

describe("Composition", () => {
  it("Pipe", () => {
    type res1 = Pipe<
      //  ^?
      [1, 2, 3, 4, 3, 4, 124678765435897587654478964568576n],
      [
        Tuples.Map<Numbers.Add<3>>,
        Strings.Join<".">,
        Strings.Split<".">,
        Tuples.Map<Strings.ToNumber>,
        Tuples.Map<Numbers.Add<10>>,
        Tuples.Map<Numbers.Sub<Args._, 1>>,
        Tuples.Sum
      ]
    >;
    type tes1 = Expect<Equal<res1, 124678765435897587654478964568677n>>;
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

    type tes1 = Expect<Equal<res1, 95>>;
  });

  it("ApplyPartial", () => {
    type res1 = Call2<
      //   ^?
      F.ApplyPartial<O.Assign, [Args._, Args._, { c: boolean }]>,
      { a: string },
      { b: number }
    >;

    type test1 = Expect<Equal<res1, { c: boolean; a: string; b: number }>>;

    type res2 = Call<
      //   ^?
      F.ApplyPartial<N.Add, [2]>,
      2
    >;
    type test2 = Expect<Equal<res2, 4>>;

    type res3 = Pipe<
      //   ^?
      3,
      [N.Add<3>, N.Add<3>, N.Add<3>, N.Add<3>]
    >;
    type test3 = Expect<Equal<res3, 15>>;

    type res4 = Pipe<
      //   ^?
      {},
      [
        F.ApplyPartial<O.Assign, [{ a: string }]>,
        F.ApplyPartial<O.Assign, [{ b: number }]>,
        F.ApplyPartial<O.Assign, [{ c: boolean }]>,
        F.ApplyPartial<O.Assign, [{ d: bigint }]>
      ]
    >;
    type test4 = Expect<
      Equal<
        res4,
        {
          d: bigint;
          c: boolean;
          b: number;
          a: string;
        }
      >
    >;
  });
});
