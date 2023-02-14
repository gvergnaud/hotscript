import { Call, Strings } from "../src/index";
import { Equal, Expect } from "../src/internals/helpers";

describe("Strings", () => {
  it("Join", () => {
    type res1 = Call<Strings.Join<".">, [1, 2, 3]>;
    //    ^?
    type test1 = Expect<Equal<res1, "1.2.3">>;
  });

  it("Split", () => {
    type res1 = Call<Strings.Split<".">, "1.2.3">;
    //    ^?
    type test1 = Expect<Equal<res1, ["1", "2", "3"]>>;
    type res2 = Call<Strings.Split<"">, "123">;
    //    ^?
    type test2 = Expect<Equal<res2, ["1", "2", "3"]>>;
    type res3 = Call<Strings.Split<"">, "">;
    //    ^?
    type test3 = Expect<Equal<res3, []>>;
    type res4 = Call<Strings.Split<"--" | ".">, "1--2-3.4..5">;
    //    ^?
    type test4 = Expect<Equal<res4, ["1", "2-3", "4", "5"]>>;
  });

  it("ToNumber", () => {
    type res1 = Call<Strings.ToNumber, "11">;
    //    ^?
    type test1 = Expect<Equal<res1, 11>>;
  });

  it("ToString", () => {
    type res1 = Call<Strings.ToString, 11>;
    //    ^?
    type test1 = Expect<Equal<res1, "11">>;
  });

  it("Prepend", () => {
    type res1 = Call<Strings.Prepend<"1 ">, "abc">;
    //    ^?
    type test1 = Expect<Equal<res1, "1 abc">>;
  });

  it("Append", () => {
    type res1 = Call<Strings.Append<" 1">, "abc">;
    //    ^?
    type test1 = Expect<Equal<res1, "abc 1">>;
  });

  it("Uppercase", () => {
    type res1 = Call<Strings.Uppercase, "abc">;
    //    ^?
    type test1 = Expect<Equal<res1, "ABC">>;
  });

  it("Lowercase", () => {
    type res1 = Call<Strings.Lowercase, "ABC">;
    //    ^?
    type test1 = Expect<Equal<res1, "abc">>;
  });

  it("Capitalize", () => {
    type res1 = Call<Strings.Capitalize, "abc">;
    //    ^?
    type test1 = Expect<Equal<res1, "Abc">>;
  });

  it("Uncapitalize", () => {
    type res1 = Call<Strings.Uncapitalize, "ABC">;
    //    ^?
    type test1 = Expect<Equal<res1, "aBC">>;
  });

  it("SnakeCase", () => {
    type res1 = Call<Strings.SnakeCase, "helloWorldYo">;
    //    ^?
    type test1 = Expect<Equal<res1, "hello_world_yo">>;
  });

  it("KebabCase", () => {
    type res1 = Call<Strings.KebabCase, "helloWorldYo">;
    //    ^?
    type test1 = Expect<Equal<res1, "hello-world-yo">>;
  });

  it("CamelCase", () => {
    type res1 = Call<Strings.CamelCase, "hello_world_yo">;
    //    ^?
    type test1 = Expect<Equal<res1, "helloWorldYo">>;
  });
});
