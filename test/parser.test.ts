import { Equal, Expect } from "../src/internals/helpers";
import { Parser as P } from "../src/internals/parser/Parser";
import { Objects } from "../src/internals/objects/Objects";
import { Tuples } from "../src/internals/tuples/Tuples";
import {
  arg0,
  arg1,
  Call,
  ComposeLeft,
  Eval,
  Identity,
} from "../src/internals/core/Core";
import { Strings } from "../src/internals/strings/Strings";
import { Numbers as N } from "../src/internals/numbers/Numbers";
import { Match } from "../src/internals/match/Match";

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

    it("should parse a calculator grammar", () => {
      // The grammar is defined as a recursive grammar:
      // ---------------------------------------------
      // | Expr = Added (AddOp Added)*               |
      // | Added = Multiplied (MulOp Multipled)*     |
      // | Multiplied = (Expr) | Integer             |
      // | AddOp = + | -                             |
      // | MulOp = * | /                             |
      // ---------------------------------------------

      type MulOp = P.Literal<"*" | "/">;
      type AddOp = P.Literal<"+" | "-">;
      type Integer = P.Map<
        P.Trim<P.Digits>,
        ComposeLeft<[Tuples.At<0>, Strings.ToNumber]>
      >;
      type Multiplied = P.Choice<
        [P.Between<P.Literal<"(">, Expr, P.Literal<")">>, Integer]
      >;
      type Added = P.Map<
        P.Sequence<[Multiplied, P.Many<P.Sequence<[MulOp, Multiplied]>>]>,
        Match<
          [
            Match.With<[arg0, "*", arg1], N.Mul>,
            Match.With<[arg0, "/", arg1], N.Div>,
            Match.With<arg0, Identity>
          ]
        >
      >;
      type Expr = P.Map<
        P.Sequence<[Added, P.Many<P.Sequence<[AddOp, Added]>>]>,
        Match<
          [
            Match.With<[arg0, "+", arg1], N.Add>,
            Match.With<[arg0, "-", arg1], N.Sub>,
            Match.With<arg0, Identity>
          ]
        >
      >;
      type Calc<T extends string> = Eval<
        P.Parse<P.Map<P.Sequence<[Expr, P.EndOfInput]>, Tuples.At<0>>, T>
      >;

      type res1 = Calc<"(3*2)/(4/2)-2">;
      //   ^?
      type test1 = Expect<Equal<res1, 1>>;
      type res2 = Calc<"3*(2-5)">;
      //   ^?
      type test2 = Expect<Equal<res2, -9>>;
      type res3 = Calc<"3*(2-5">;
      //   ^?
      type test3 = Expect<
        Equal<
          res3,
          {
            message: "Expected 'endOfInput()' - Received '*(2-5'";
            input: "*(2-5";
            cause: "";
          }
        >
      >;
    });
  });
});
