import { Equal, Expect } from "../src/internals/helpers";
import { Parser as P } from "../src/internals/parser/Parser";
import { Objects } from "../src/internals/objects/Objects";
import { Tuples } from "../src/internals/tuples/Tuples";
import {
  arg0,
  arg1,
  Call,
  ComposeLeft,
  Constant,
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
        [
          P.Between<P.Trim<P.Literal<"(">>, Expr, P.Trim<P.Literal<")">>>,
          Integer
        ]
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

      type res1 = Calc<"( 3*2 ) / ( 4/2 ) - 2">;
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

    it("should parse json grammar", () => {
      // The grammar is defined as a recursive grammar:
      // -------------------------------------------------------------
      // | Value = Object | Array | String | Number | Boolean | Null |
      // | Object = { (Pair (, Pair)*)? }                            |
      // | Pair = String : Value                                     |
      // | Array = [ (Value (, Value)*)? ]                           |
      // | String = " Character* "                                   |
      // | Character = any character except "                        |
      // | Number = -? Digits ( . Digits )?                          |
      // | Boolean = true | false                                    |
      // | Null = null                                               |
      // -------------------------------------------------------------
      type Value = P.Choice<
        [JSonObject, JSonArray, JSonString, JSonNumber, JsonBoolean, JSonNull]
      >;
      type JSonObject = P.Map<
        P.Sequence<
          [
            P.Trim<P.Skip<P.Literal<"{">>>,
            P.Optional<P.SepBy<JSonPair, P.Trim<P.Literal<",">>>>,
            P.Trim<P.Skip<P.Literal<"}">>>
          ]
        >,
        Objects.FromArray
      >;
      type JSonPair = P.Sequence<
        [JSonString, P.Trim<P.Skip<P.Literal<":">>>, Value]
      >;
      type JSonArray = P.Map<
        P.Sequence<
          [
            P.Trim<P.Skip<P.Literal<"[">>>,
            P.Optional<P.SepBy<Value, P.Trim<P.Literal<",">>>>,
            P.Trim<P.Skip<P.Literal<"]">>>
          ]
        >,
        Objects.Create<[arg0]>
      >;

      type JSonString = P.Map<
        P.Between<
          P.TrimLeft<P.Skip<P.Literal<'"'>>>,
          P.Many<P.NotLiteral<'"'>>,
          P.TrimRight<P.Skip<P.Literal<'"'>>>
        >,
        Tuples.Join<"">
      >;

      type JSonNumber = P.Map<
        P.Sequence<
          [
            P.Optional<P.Literal<"-" | "+">>,
            P.Digits,
            P.Optional<P.Sequence<[P.Literal<".">, P.Digits]>>
          ]
        >,
        ComposeLeft<[Tuples.Join<"">, Strings.ToNumber]>
      >;
      type JsonBoolean = P.Map<
        P.Literal<"true" | "false">,
        Match<[Match.With<"true", true>, Match.With<"false", false>]>
      >;
      type JSonNull = P.Map<P.Literal<"null">, Constant<null>>;

      type Json<T extends string> = Eval<
        P.Parse<P.Map<P.Sequence<[Value, P.EndOfInput]>, Tuples.At<0>>, T>
      >;

      type res1 = Json<`{"hello": " world! with @", "foo": [1.4, 2, 3]}`>;
      //   ^?
      type test1 = Expect<
        Equal<res1, { hello: " world! with @"; foo: [1.4, 2, 3] }>
      >;
      type res2 = Json<`[]`>;
      //   ^?
      type test2 = Expect<Equal<res2, []>>;
      type res3 = Json<`{}`>;
      //   ^?
      type test3 = Expect<Equal<res3, {}>>;
      // 4 deep nested objects
      type res4 = Json<`{"a": {"b": {"c": {"d": 8}}}}`>;
      //   ^?
      type test4 = Expect<Equal<res4, { a: { b: { c: { d: 8 } } } }>>;
    });
  });

  it("should parse regex grammar", () => {
    // The grammar is defined as a recursive grammar for Extended Regular Expressions:
    // -------------------------------------------------------------
    // | ERE = ERE_branch (| ERE_branch)*
    // | ERE_branch = ERE_expr+
    // | ERE_expr = ERE_term ERE_quant*
    // | ERE_term = ERE_atom | ERE_group | ERE_assertion
    // | ERE_atom = ERE_char | ERE_quoted_char | . | ERE_char_class | \d | \D | \s | \S | \w | \W | \t | \r | \v | \f | \n
    // | ERE_group = ( ERE ) | (?<name> ERE ) | (?: ERE ) | \ Digit | \k<name>
    // | ERE_assertion = ^ | $ | \b | \B | (?= ERE ) | (?! ERE ) | (?<= ERE ) | (?<! ERE )
    // | ERE_char = any char exept ^ . [ $ ( ) | * + ? { \
    // | ERE_any_char_class = any char exept ]
    // | ERE_quoted_char = one of the following char sequences: \^ \. \[ \$ \( \) \| \* \+ \? \{ \\
    // | ERE_quant = * | + | ? | { Digits } | { Digits , } | { Digits , Digits }
    // | ERE_char_class = [ ERE_char_class_expr+ ] | [^ ERE_char_class_expr+ ]
    // | ERE_char_class_expr = ERE_range | ERE_any_char_class
    // | ERE_range = ERE_char - ERE_char
    // | name = word
    // -------------------------------------------------------------

    type ERE = P.Choice<[ERE_branch, P.SepBy<ERE_branch, P.Literal<"|">>]>;
    type ERE_branch = P.Many<ERE_expr>;
    type ERE_expr = P.Sequence<[ERE_term, P.Many<ERE_quant>]>;
    type ERE_term = P.Choice<[ERE_atom, ERE_group, ERE_assertion]>;
    type ERE_atom = P.Choice<
      [
        ERE_char,
        ERE_quoted_char,
        // prettier-ignore
        P.Literal<"." | "\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\t" | "\\r" | "\\v" | "\\f" | "\\n">,
        ERE_char_class
      ]
    >;
    type ERE_group = P.Choice<
      [
        P.Between<P.Literal<"(">, ERE, P.Literal<")">>,
        P.Between<P.Literal<"(?<">, ERE, P.Literal<")">>,
        P.Between<P.Literal<"(?:">, ERE, P.Literal<")">>,
        P.Sequence<[P.Literal<"\\">, P.Digits]>,
        P.Sequence<[P.Literal<"\\k<">, P.Word, P.Literal<">">]>
      ]
    >;
    type ERE_assertion = P.Choice<
      [
        P.Literal<"^" | "$" | "\\b" | "\\B">,
        P.Between<P.Literal<"(?=">, ERE, P.Literal<")">>,
        P.Between<P.Literal<"(?!">, ERE, P.Literal<")">>,
        P.Between<P.Literal<"(?<=">, ERE, P.Literal<")">>,
        P.Between<P.Literal<"(?<!">, ERE, P.Literal<")">>
      ]
    >;
    // prettier-ignore
    type ERE_char = P.NotLiteral<"^" | "." | "[" | "$" | "(" | ")" | "|" | "*" | "+" | "?" | "{" | "\\" | "]" | "-">;
    type ERE_any_char_class = P.NotLiteral<"]">;
    // prettier-ignore
    type ERE_quoted_char = P.Literal<
      "\\^" | "\\." | "\\[" | "\\$" | "\\(" | "\\)" | "\\|" | "\\*" | "\\+" | "\\?" | "\\{" | "\\\\"
    >;
    type ERE_quant = P.Choice<
      [
        P.Literal<"*" | "+" | "?">,
        P.Between<P.Literal<"{">, P.Digits, P.Literal<"}">>,
        P.Sequence<[P.Literal<"{">, P.Digits, P.Literal<",">, P.Literal<"}">]>,
        P.Sequence<
          [P.Literal<"{">, P.Digits, P.Literal<",">, P.Digits, P.Literal<"}">]
        >
      ]
    >;
    type ERE_char_class = P.Choice<
      [
        P.Between<P.Literal<"[">, P.Many<ERE_char_class_expr>, P.Literal<"]">>,
        P.Between<P.Literal<"[^">, P.Many<ERE_char_class_expr>, P.Literal<"]">>
      ]
    >;
    type ERE_char_class_expr = P.Choice<[ERE_range, ERE_any_char_class]>;
    type ERE_range = P.Sequence<[ERE_char, P.Literal<"-">, ERE_char]>;

    type RegExpr<T extends string> = Eval<
      P.Parse<P.Sequence<[ERE, P.EndOfInput]>, T>
    >;

    type test1 = RegExpr<"a+[a-zA-Z]">;
  });

  it("should parse complex endpoint routing grammar", () => {
    // examples route:
    // /api/v1/users/{id:number}/posts/{postId:number}/comments/{commentId:number}
    // /api/v2/emails/{email:string}/lists/{listEmail:string}

    // The grammar is defined as a recursive grammar for routing paths.
    // -------------------------------------------------------------
    // | path = path_segment ( / path_segment )*
    // | path_segment = path_parameter | path_literal
    // | path_parameter = { name : type } | { name }
    // | path_literal = word
    // | name = word
    // | type = string | number | boolean
    // -------------------------------------------------------------

    type path = P.Map<
      P.Sequence<
        [P.Skip<P.Literal<"/">>, P.SepBy<path_segment, P.Literal<"/">>]
      >,
      Objects.FromArray
    >;
    type path_segment = P.Choice<[path_parameter, P.Skip<P.Word>]>;
    type path_parameter = P.Between<
      P.Literal<"{">,
      P.Sequence<
        [
          P.Trim<P.Word>,
          P.Map<
            P.Optional<P.Prefix<P.Literal<":">, type>>,
            Match<
              [
                Match.With<["string"], string>,
                Match.With<["number"], number>,
                Match.With<["boolean"], boolean>,
                Match.With<any, string>
              ]
            >
          >
        ]
      >,
      P.Literal<"}">
    >;
    type type = P.Trim<P.Literal<"string" | "number" | "boolean">>;

    type PathParams<T extends string> = Eval<
      P.Parse<P.Map<P.Sequence<[path, P.EndOfInput]>, Tuples.At<0>>, T>
    >;

    // should allow to cast to number or boolean
    type res1 =
      //  ^?
      PathParams<"/api/v1/users/{ id : number }/posts/{postId:number}/comments/{commentId:number}/active/{active:boolean}">;
    type test1 = Expect<
      Equal<
        res1,
        { id: number; postId: number; commentId: number; active: boolean }
      >
    >;

    // should default to string
    type res2 = PathParams<"/api/v2/emails/{email}/lists/{listEmail}">;
    //    ^?
    type test2 = Expect<Equal<res2, { email: string; listEmail: string }>>;

    // should error
    type res3 =
      //  ^?
      PathParams<"/api/v2/emails/{email:string}/lists/{listEmail:string">;
    type test3 = Expect<
      Equal<
        res3,
        {
          message: never;
          input: "{listEmail:string";
          cause: "Expected 'literal('}')' - Received '' | Expected 'word()' - Received '{listEmail:string'";
        }
      >
    >;
  });
});
