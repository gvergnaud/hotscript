import { unset, MergeArgs } from "../src/internals/core/Core";
import { Equal, Expect } from "../src/internals/helpers";

describe("Core", () => {
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

    it("should support intersections with unknown[] coming from function application", () => {
      type pipedArgs2 = unknown[] & [0, 1];
      type partialArgs2 = [unset, unset];
      type res2 = MergeArgs<pipedArgs2, partialArgs2>;
      type test2 = Expect<Equal<res2, [0, 1]>>;
    });

    it("should support never", () => {
      type pipedArgs1 = ["hello"];
      type partialArgs1 = ["a" | "b", never];
      type res1 = MergeArgs<pipedArgs1, partialArgs1>;
      type test1 = Expect<Equal<res1, ["a" | "b", never, "hello"]>>;
    });

    it("if given two partial argument like [T, unset], it should reverse them", () => {
      /**
       * We do this because most partially applied functions of arity 2 make more
       * sense if the partially applied argument is considered as the second one.
       *
       * For example `Call<B.Extends<string>, 'hello'>` should return true and not false!
       *
       */
      type pipedArgs1 = ["hello"];
      type partialArgs1 = [string, unset];
      type res1 = MergeArgs<pipedArgs1, partialArgs1>;
      type test1 = Expect<Equal<res1, ["hello", string]>>;
    });
  });
});
