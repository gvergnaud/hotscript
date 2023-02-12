import { HOT, Numbers, Strings, Tuples } from "../HOTScript";
import { Equal, Expect } from "./helpers";

describe("HOTScript", () => {
  describe("Composition", () => {
    describe("Pipe", () => {
      type res1 = HOT.Pipe<
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

    describe("PipeRight", () => {
      type res1 = HOT.PipeRight<
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
    describe("Map", () => {
      interface ToPhrase extends HOT.Fn {
        output: `number is ${Extract<
          this["args"][0],
          string | number | boolean
        >}`;
      }

      type res1 = HOT.Call<Tuples.Map<ToPhrase>, [1, 2, 3]>;
      //   ^?
      type tes1 = Expect<
        Equal<res1, ["number is 1", "number is 2", "number is 3"]>
      >;
    });
  });
});
