import { _, Call, Call2, Strings, Functions } from "../src/index";
import { Equal, Expect } from "../src/internals/helpers";

describe("Strings", () => {
  it("Length", () => {
    type res1 = Call<Strings.Length, "">;
    //    ^?
    type test1 = Expect<Equal<res1, 0>>;
    type res2 = Call<Strings.Length, "123">;
    //    ^?
    type test2 = Expect<Equal<res2, 3>>;
    type res3 = Call<
      //  ^?
      Functions.Compose<[Strings.Length, Strings.Repeat<1001>]>,
      "a"
    >;
    type test3 = Expect<Equal<res3, 1001>>;
  });

  it("TrimLeft", () => {
    type res1 = Call<Strings.TrimLeft, "  abc  ">;
    //    ^?
    type test1 = Expect<Equal<res1, "abc  ">>;
    type res2 = Call<Strings.TrimLeft<"0">, "0001000">;
    //    ^?
    type test2 = Expect<Equal<res2, "1000">>;
  });

  it("TrimRight", () => {
    type res1 = Call<Strings.TrimRight, "  abc  ">;
    //    ^?
    type test1 = Expect<Equal<res1, "  abc">>;
    type res2 = Call<Strings.TrimRight<"0">, "0001000">;
    //    ^?
    type test2 = Expect<Equal<res2, "0001">>;
  });

  it("Trim", () => {
    type res1 = Call<Strings.Trim, "  abc  ">;
    //    ^?
    type test1 = Expect<Equal<res1, "abc">>;
    type res2 = Call<Strings.Trim<"0">, "0001000">;
    //    ^?
    type test2 = Expect<Equal<res2, "1">>;
  });

  it("Replace", () => {
    type res1 = Call<Strings.Replace<"a", "b">, "abc">;
    //    ^?
    type test1 = Expect<Equal<res1, "bbc">>;
    type res2 = Call<Strings.Replace<"a", "b">, "">;
    //    ^?
    type test2 = Expect<Equal<res2, "">>;
    type res3 = Call<Strings.Replace<"a", "">, "abc">;
    //    ^?
    type test3 = Expect<Equal<res3, "bc">>;
    type res4 = Call<Strings.Replace<"hello", "hi!">, "hello world!">;
    //    ^?
    type test4 = Expect<Equal<res4, "hi! world!">>;
    type res5 = Call<Strings.Replace<"many", "more">, "many more than many">;
    //    ^?
    type test5 = Expect<Equal<res5, "more more than more">>;
  });

  it("Slice", () => {
    type res1 = Call<Strings.Slice<1, 3>, "123">;
    //    ^?
    type test1 = Expect<Equal<res1, "23">>;
    type res2 = Call<Strings.Slice<0, 3>, "123">;
    //    ^?
    type test2 = Expect<Equal<res2, "123">>;
    type res3 = Call<Strings.Slice<1, 4>, "123">;
    //    ^?
    type test3 = Expect<Equal<res3, "23">>;
    type res4 = Call<Strings.Slice<1, 1>, "123">;
    //    ^?
    type test4 = Expect<Equal<res4, "">>;
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

  it("Repeat", () => {
    type res1 = Call<Strings.Repeat<3>, "a">;
    //    ^?
    type test1 = Expect<Equal<res1, "aaa">>;
    type res2 = Call<Strings.Repeat<0>, "a">;
    //    ^?
    type test2 = Expect<Equal<res2, "">>;
    type res3 = Call<Strings.Repeat<1>, "a">;
    //    ^?
    type test3 = Expect<Equal<res3, "a">>;
    type res4 = Call<Strings.Repeat<2>, "hello!">;
    //    ^?
    type test4 = Expect<Equal<res4, "hello!hello!">>;
  });

  it("StartsWith", () => {
    type res1 = Call<Strings.StartsWith<"hello">, "hello world">;
    //    ^?
    type test1 = Expect<Equal<res1, true>>;
    type res2 = Call<Strings.StartsWith<"hello">, "world hello">;
    //    ^?
    type test2 = Expect<Equal<res2, false>>;
    type res3 = Call<Strings.StartsWith<"">, "hello world">;
    //    ^?
    type test3 = Expect<Equal<res3, true>>;
    type res4 = Call<Strings.StartsWith<"">, "">;
    //    ^?
    type test4 = Expect<Equal<res4, true>>;
  });

  it("EndsWith", () => {
    type res1 = Call<Strings.EndsWith<"world">, "hello world">;
    //    ^?
    type test1 = Expect<Equal<res1, true>>;
    type res2 = Call<Strings.EndsWith<"world">, "world hello">;
    //    ^?
    type test2 = Expect<Equal<res2, false>>;
    type res3 = Call<Strings.EndsWith<"">, "hello world">;
    //    ^?
    type test3 = Expect<Equal<res3, true>>;
    type res4 = Call<Strings.EndsWith<"">, "">;
    //    ^?
    type test4 = Expect<Equal<res4, true>>;
  });

  it("ToTuple", () => {
    type res1 = Call<Strings.ToTuple, "abc">;
    //    ^?
    type test1 = Expect<Equal<res1, ["a", "b", "c"]>>;
    type res2 = Call<Strings.ToTuple, "">;
    //    ^?
    type test2 = Expect<Equal<res2, []>>;
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
    type res2 = Call<Strings.SnakeCase, "HelloWorldYo">;
    //    ^?
    type test2 = Expect<Equal<res2, "hello_world_yo">>;
  });

  it("KebabCase", () => {
    type res1 = Call<Strings.KebabCase, "helloWorldYo">;
    //    ^?
    type test1 = Expect<Equal<res1, "hello-world-yo">>;
    type res2 = Call<Strings.KebabCase, "HelloWorldYo">;
    //    ^?
    type test2 = Expect<Equal<res2, "hello-world-yo">>;
  });

  it("CamelCase", () => {
    type res1 = Call<Strings.CamelCase, "hello_world_yo">;
    //    ^?
    type test1 = Expect<Equal<res1, "helloWorldYo">>;
  });

  it("Compare", () => {
    type res1 = Call<Strings.Compare<"a">, "a">;
    //    ^?
    type test1 = Expect<Equal<res1, 0>>;
    type res2 = Call<Strings.Compare<"a">, "b">;
    //    ^?
    type test2 = Expect<Equal<res2, 1>>;
    type res3 = Call<Strings.Compare<"a", _>, "b">;
    //    ^?
    type test3 = Expect<Equal<res3, -1>>;
    type res4 = Call<Strings.Compare<"b">, "a">;
    //    ^?
    type test4 = Expect<Equal<res4, -1>>;
    type res5 = Call2<Strings.Compare, "ab", "b">;
    //    ^?
    type test5 = Expect<Equal<res5, -1>>;
    type res6 = Call2<Strings.Compare, "b", "ab">;
    //    ^?
    type test6 = Expect<Equal<res6, 1>>;
    type res7 = Call2<Strings.Compare, "ab", "ab">;
    //    ^?
    type test7 = Expect<Equal<res7, 0>>;
    type res8 = Call2<Strings.Compare, "ab", "ac">;
    //    ^?
    type test8 = Expect<Equal<res8, -1>>;
  });

  it("LessThan", () => {
    type res1 = Call<Strings.LessThan<"a">, "b">;
    //    ^?
    type test1 = Expect<Equal<res1, false>>;
    type res2 = Call<Strings.LessThan<"b">, "a">;
    //    ^?
    type test2 = Expect<Equal<res2, true>>;
    type res3 = Call<Strings.LessThan<"a">, "a">;
    //    ^?
    type test3 = Expect<Equal<res3, false>>;
    type res4 = Call2<Strings.LessThan, "a", "aa">;
    //    ^?
    type test4 = Expect<Equal<res4, true>>;
  });

  it("LessThanOrEqual", () => {
    type res1 = Call<Strings.LessThanOrEqual<"a">, "b">;
    //    ^?
    type test1 = Expect<Equal<res1, false>>;
    type res2 = Call<Strings.LessThanOrEqual<"b">, "a">;
    //    ^?
    type test2 = Expect<Equal<res2, true>>;
    type res3 = Call<Strings.LessThanOrEqual<"a">, "a">;
    //    ^?
    type test3 = Expect<Equal<res3, true>>;
    type res4 = Call2<Strings.LessThanOrEqual, "a", "aa">;
    //    ^?
    type test4 = Expect<Equal<res4, true>>;
  });

  it("GreaterThan", () => {
    type res1 = Call<Strings.GreaterThan<"a">, "b">;
    //    ^?
    type test1 = Expect<Equal<res1, true>>;
    type res2 = Call<Strings.GreaterThan<"b">, "a">;
    //    ^?
    type test2 = Expect<Equal<res2, false>>;
    type res3 = Call<Strings.GreaterThan<"a">, "a">;
    //    ^?
    type test3 = Expect<Equal<res3, false>>;
    type res4 = Call2<Strings.GreaterThan, "a", "aa">;
    //    ^?
    type test4 = Expect<Equal<res4, false>>;
  });

  it("GreaterThanOrEqual", () => {
    type res1 = Call<Strings.GreaterThanOrEqual<"a">, "b">;
    //    ^?
    type test1 = Expect<Equal<res1, true>>;
    type res2 = Call<Strings.GreaterThanOrEqual<"b">, "a">;
    //    ^?
    type test2 = Expect<Equal<res2, false>>;
    type res3 = Call<Strings.GreaterThanOrEqual<"a">, "a">;
    //    ^?
    type test3 = Expect<Equal<res3, true>>;
    type res4 = Call2<Strings.GreaterThanOrEqual, "a", "aa">;
    //    ^?
    type test4 = Expect<Equal<res4, false>>;
  });
});
