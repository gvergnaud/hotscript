import { Equal, Expect } from "../src/internals/helpers";
import { Parser as P } from "../src/internals/parser/Parser";
import { Objects } from "../src/internals/objects/Objects";
import { Tuples } from "../src/internals/tuples/Tuples";
import { Eval } from "../src/internals/core/Core";

describe("Parser", () => {
  describe("P.Literal", () => {
    it("should parse a literal", () => {
      type res1 = Eval<P.Parse<P.Literal<"hello">, "hello">>;
      //   ^?
      type test1 = Expect<Equal<res1, "hello">>;
      type res2 = Eval<P.Parse<P.Literal<"hello">, "hello world">>;
      //   ^?
      type test2 = Expect<Equal<res2, "hello">>;
    });

    it("should not parse another literal", () => {
      type res1 = Eval<P.Parse<P.Literal<"hello">, "world">>;
      //   ^?
      type test1 = Expect<
        Equal<
          res1,
          {
            message: "Expected 'literal('hello')' - Received 'world'";
            input: "world";
            cause: "";
          }
        >
      >;
    });

    it("should not parse an empty string", () => {
      type res1 = Eval<P.Parse<P.Literal<"hello">, "">>;
      //   ^?
      type test1 = Expect<
        Equal<
          res1,
          {
            message: "Expected 'literal('hello')' - Received ''";
            input: "";
            cause: "";
          }
        >
      >;
    });
  });

  describe("P.Word", () => {
    it("should parse a word", () => {
      type res1 = Eval<P.Parse<P.Word, "hello">>;
      //   ^?
      type test1 = Expect<Equal<res1, "hello">>;
      type res2 = Eval<P.Parse<P.Word, "hello world">>;
      //   ^?
      type test2 = Expect<Equal<res2, "hello">>;
      type res3 = Eval<P.Parse<P.Word, "hello_world">>;
      //   ^?
      type test3 = Expect<Equal<res3, "hello_world">>;
      type res4 = Eval<P.Parse<P.Word, "hello-world">>;
      //   ^?
      type test4 = Expect<Equal<res4, "hello">>;
      type res5 = Eval<P.Parse<P.Word, "_42">>;
      //   ^?
      type test5 = Expect<Equal<res5, "_42">>;
      type res6 = Eval<P.Parse<P.Word, "42">>;
      //   ^?
      type test6 = Expect<
        Equal<
          res6,
          {
            message: "Expected 'word()' - Received '42'";
            input: "42";
            cause: "";
          }
        >
      >;
    });
    it("should not parse and empty string", () => {
      type res1 = Eval<P.Parse<P.Word, "">>;
      //   ^?
      type test1 = Expect<
        Equal<
          res1,
          { message: "Expected 'word()' - Received ''"; input: ""; cause: "" }
        >
      >;
    });
  });

  describe("P.Digits", () => {
    it("should parse digits", () => {
      type res1 = Eval<P.Parse<P.Digits, "42">>;
      //   ^?
      type test1 = Expect<Equal<res1, "42">>;
      type res2 = Eval<P.Parse<P.Digits, "42hello">>;
      //   ^?
      type test2 = Expect<Equal<res2, "42">>;
      type res3 = Eval<P.Parse<P.Digits, "hello">>;
      //   ^?
      type test3 = Expect<
        Equal<
          res3,
          {
            message: "Expected 'digits()' - Received 'hello'";
            input: "hello";
            cause: "";
          }
        >
      >;
    });

    it("should not parse and empty string", () => {
      type res1 = Eval<P.Parse<P.Digits, "">>;
      //   ^?
      type test1 = Expect<
        Equal<
          res1,
          { message: "Expected 'digits()' - Received ''"; input: ""; cause: "" }
        >
      >;
    });
  });

  describe("P.Parse", () => {
    it("should parse complex grammar and allow to transform it", () => {
      type res1 = Eval<
        //  ^?
        P.Parse<
          P.Map<
            P.Sequence<
              [
                P.Skip<P.Literal<"function">>,
                P.Trim<P.Word>,
                P.Between<
                  P.Literal<"(">,
                  P.SepBy<P.Trim<P.Word>, P.Literal<",">>,
                  P.Literal<")">
                >,
                P.Skip<P.Literal<";">>,
                P.EndOfInput
              ]
            >,
            Objects.Create<{
              type: "function";
              name: Tuples.At<0>;
              parameters: Tuples.Drop<1>;
            }>
          >,
          `function test ( aaaaa, hello_  ,  allo  );`
        >
      >;
      type test1 = Expect<
        Equal<
          res1,
          {
            type: "function";
            name: "test";
            parameters: ["aaaaa", "hello_", "allo"];
          }
        >
      >;
    });
  });
});
