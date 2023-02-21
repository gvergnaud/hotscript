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
import { Equal, Expect } from "../src/internals/helpers";

describe("Functions", () => {
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
