import { F, Numbers, Strings, Tuples, _ } from "../src/index";
import { Call } from "../src/internals/core/Core";
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
    type res2 = Call<F.Parameter, (a: string, b: number) => void, 0>;
    //   ^?
    type tes2 = Expect<Equal<res2, string>>;
  });

  it("ReturnType", () => {
    type res1 = Call<F.ReturnType, (a: string, b: number) => boolean>;
    //   ^?
    type tes1 = Expect<Equal<res1, boolean>>;
  });
  it("MapReturnType", () => {
    type res1 = Call<
      //   ^?
      F.MapReturnType<Strings.ToNumber>,
      (a: string, b: number) => "1" | "2"
    >;
    type tes1 = Expect<Equal<res1, (a: string, b: number) => 1 | 2>>;
  });
  it("MapParameters", () => {
    type res1 = Call<
      //   ^?
      F.MapParameters<Tuples.Map<Strings.ToNumber>>,
      (a: "1" | "2", b: "3" | "4") => void
    >;
    type tes1 = Expect<Equal<res1, (a: 1 | 2, b: 3 | 4) => void>>;
  });
});
