import {
  Pipe,
  PipeRight,
  Call,
  Numbers,
  Strings,
  Tuples,
  F,
  _,
} from "../src/index";
import { Call2, Identity, unset } from "../src/internals/core/Core";
import { MergeArgs } from "../src/internals/functions/impl/MergeArgs";
import { Equal, Expect } from "../src/internals/helpers";

describe("Functions", () => {
  it("Identity", () => {
    // check primitives
    type res1 = Call<Identity, string>;
    //   ^?
    type tes1 = Expect<Equal<res1, string>>;
    type res2 = Call<Identity, undefined>;
    //   ^?
    type tes2 = Expect<Equal<res2, undefined>>;
    // check unions
    type res3 = Call<Identity, string | number>;
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
    type res2 = Call2<F.Parameter, (a: string, b: number) => void, 0>;
    //   ^?
    type tes2 = Expect<Equal<res2, string>>;
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
        Tuples.Join<".">,
        Strings.Split<".">,
        Tuples.Map<Strings.ToNumber>,
        Tuples.Map<Numbers.Add<10>>,
        Tuples.Map<Numbers.Sub<_, 1>>,
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
        Tuples.Join<".">,
        Tuples.Map<Numbers.Add<3>>
      ],
      [1, 2, 3, 4, 3, 4]
    >;

    type tes1 = Expect<Equal<res1, 95>>;
  });

  describe("MergeArgs", () => {
    it("should remove unset args from partialArgs", () => {
      type pipedArgs1 = ["hello"];
      type partialArgs1 = [unset, unset];
      type res1 = MergeArgs<pipedArgs1, partialArgs1>;
      type test1 = Expect<Equal<res1, ["hello"]>>;

      type pipedArgs2 = [1, 2];
      type partialArgs2 = [unset, unset];
      type res2 = MergeArgs<pipedArgs2, partialArgs2>;
      type test2 = Expect<Equal<res2, [1, 2]>>;
    });

    it("should support never", () => {
      type pipedArgs1 = ["hello"];
      type partialArgs1 = ["a" | "b", never];
      type res1 = MergeArgs<pipedArgs1, partialArgs1>;
      type test1 = Expect<Equal<res1, ["a" | "b", never, "hello"]>>;
    });
  });
});
