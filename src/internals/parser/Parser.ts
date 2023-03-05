import {
  Call,
  Compose,
  Constant,
  Eval,
  Fn,
  PartialApply,
  Pipe,
  unset,
  _,
} from "../core/Core";
import { Match } from "../match/Match";
import { Strings } from "../strings/Strings";
import { Tuples } from "../tuples/Tuples";

export namespace Parser {
  /**
   * A parser is a function that takes static parameters and a string input
   * and returns a result or an error.
   * @description to enable introspection, parsers augment the function type
   * with a name and a list of parameters.
   */
  export interface ParserFn extends Fn {
    name: string;
    params: Array<
      string | number | bigint | undefined | null | boolean | ParserFn
    >;
  }

  /**
   * Base functionnal Ok type to allow for advanced error handling in HOTScript.
   */
  export type Value<value> = {
    kind: "Ok";
    value: value;
  };

  /**
   * Base functionnal Error type to allow for advanced error handling in HOTScript.
   */
  type Error<error> = {
    kind: "Err";
    error: error;
  };

  /**
   * specialised Ok type for parsers.
   */
  export type Ok<Result = unknown, Input extends string = string> = Value<{
    result: Result;
    input: Input;
  }>;

  /**
   * specialised Error type for parsers.
   */
  export type Err<
    Parser extends ParserFn,
    Input extends string,
    Cause extends unknown = ""
  > = Error<{
    message: `Expected '${Eval<ToString<Parser>>}' - Received '${Input}'`;
    input: Input;
    cause: Eval<Tuples.Join<" | ", Cause>>;
  }>;

  /**
   * specialised Error type for parsers when the input is not a string.
   */
  export type InputError<Input extends string> = Error<{
    message: "Input must be a string";
    cause: Input;
  }>;

  /**
   * Extract the most appropriate error message from an error type.
   */
  export type ErrMsg<TError> = TError extends Error<{
    message: infer Msg;
    cause: infer Cause;
  }>
    ? Cause extends ""
      ? Msg
      : Cause
    : never;

  interface ToStringFn extends Fn {
    return: this["arg0"] extends infer Parser extends ParserFn
      ? `${Parser["name"]}(${Eval<
          Tuples.Join<
            ",",
            Pipe<
              Parser["params"],
              [
                Tuples.Map<
                  Match<
                    [
                      Match.With<ParserFn, ToString>,
                      Match.With<
                        number | undefined | null | boolean,
                        Strings.ToString
                      >,
                      Match.With<
                        string,
                        Compose<[Strings.Append<"'">, Strings.Append<_, "'">]>
                      >
                    ]
                  >
                >
              ]
            >
          >
        >})`
      : never;
  }

  /**
   * Introspetion function to convert a parser to a string for error messages.
   * @param Parser - the parser to convert to a string
   *
   * @example
   * ```ts
   * type T0 = Eval<ToString<Literal<"a">>>;
   * //   ^? type T0 = "literal('a')"
   * ```
   */
  export type ToString<Parser extends ParserFn | _ | unset = unset> =
    PartialApply<ToStringFn, [Parser]>;

  /**
   * Parser that matches a string.
   * It can be a union of string literals or a string literal.
   * in case of a union, the correct string literal is returned.
   */
  type LiteralImpl<
    Self extends ParserFn,
    ExpectedLiteral extends string,
    Input extends string
  > = Input extends `${ExpectedLiteral}${infer Rest}`
    ? Input extends `${infer Lit}${Rest}`
      ? Ok<Lit, Rest>
      : Err<Self, Input>
    : Err<Self, Input>;

  /**
   * Parser that matches a literal string or a union of literal strings.
   * @param ExpectedLiteral - the literal string or a union of literal strings to match
   * @returns an Ok type if the literal string is found, an Err type otherwise
   *
   * @example
   * ```ts
   * type T0 = Call<Literal<"a">, "a">;
   * //   ^? type T0 = Ok<{ result: "a"; input: "" }>
   * type T1 = Call<Literal<"a">, "b">;
   * //   ^? type T1 = Error<{ message: "Expected 'literal('a')' - Received 'b'"; cause: "" }>
   * type T2 = Call<Literal<"a" | "b">, "a">;
   * //   ^? type T2 = Ok<{ result: "a"; input: "" }>
   * ```
   */
  export interface Literal<ExpectedLiteral extends string> extends ParserFn {
    name: "literal";
    params: [ExpectedLiteral];
    return: LiteralImpl<this, ExpectedLiteral, this["arg0"]>;
  }

  type ManyImpl<
    Parser extends ParserFn,
    Input extends string,
    Acc extends unknown[] = []
  > = Input extends ""
    ? Ok<Acc, Input>
    : Call<Parser, Input> extends infer A
    ? A extends Ok<unknown[]>
      ? ManyImpl<Parser, A["value"]["input"], [...Acc, ...A["value"]["result"]]>
      : A extends Ok
      ? ManyImpl<Parser, A["value"]["input"], [...Acc, A["value"]["result"]]>
      : Ok<Acc, Input>
    : Ok<Acc, Input>;

  /**
   * Parser that matches a parser 0 or more times.
   * @param Parser - the parser to match
   * @returns an Ok type if the parser matches 0 or more times and the rest of the input
   *
   * @example
   * ```ts
   * type T0 = Call<Many<Literal<"a">>, "aaa">;
   * //   ^? type T0 = Ok<{ result: ["a", "a", "a"]; input: "" }>
   * type T1 = Call<Many<Literal<"a">>, "bbb">;
   * //   ^? type T1 = Ok<{ result: []; input: "bbb" }>
   * ```
   */
  export interface Many<Parser extends ParserFn> extends ParserFn {
    name: "many";
    params: [Parser["name"]];
    return: this["arg0"] extends infer Input extends string
      ? ManyImpl<Parser, Input>
      : InputError<this["arg0"]>;
  }

  type SequenceImpl<
    Self extends ParserFn,
    Parsers extends ParserFn[],
    Input extends string,
    Acc extends unknown[] = []
  > = Parsers extends [
    infer Head extends ParserFn,
    ...infer Tail extends ParserFn[]
  ]
    ? Call<Head, Input> extends infer A
      ? A extends Ok<unknown[]>
        ? SequenceImpl<
            Self,
            Tail,
            A["value"]["input"],
            [...Acc, ...A["value"]["result"]]
          >
        : A extends Ok<unknown>
        ? SequenceImpl<
            Self,
            Tail,
            A["value"]["input"],
            [...Acc, A["value"]["result"]]
          >
        : A // forwards error
      : never
    : Ok<Acc, Input>;

  /**
   * Parser that matches a list of parsers in sequence.
   * @param Parsers - the parsers to match
   * @returns an Ok type if the parsers match in sequence or the error of the first parser that fails
   *
   * @example
   * ```ts
   * type T0 = Call<Sequence<[Literal<"a">, Literal<"b">]>, "ab">;
   * //   ^? type T0 = Ok<{ result: ["a", "b"]; input: "" }>
   * type T1 = Call<Sequence<[Literal<"a">, Literal<"b">]>, "ac">;
   * //   ^? type T1 = Error<{ message: "Expected 'literal('b')' - Received 'c'"; cause: "" }>
   * ```
   */
  export interface Sequence<Parsers extends ParserFn[]> extends ParserFn {
    name: "sequence";
    params: Parsers;
    return: this["arg0"] extends infer Input extends string
      ? SequenceImpl<this, Parsers, Input>
      : InputError<this["arg0"]>;
  }

  /**
   * Parser that fails if there is any input left.
   * @returns an Ok type if there is no input left
   *
   * @example
   * ```ts
   * type T0 = Call<EndOfInput, "">;
   * //   ^? type T0 = Ok<{ result: []; input: "" }>
   * type T1 = Call<EndOfInput, "a">;
   * //   ^? type T1 = Error<{ message: "Expected 'endOfInput()' - Received 'a'"; cause: "" }>
   * ```
   */
  export interface EndOfInput extends ParserFn {
    name: "endOfInput";
    params: [];
    return: this["arg0"] extends infer Input extends string
      ? Input extends ""
        ? Ok<[], Input>
        : Err<this, Input>
      : InputError<this["arg0"]>;
  }

  /**
   * Parser that transforms the result of another parser when it succeeds.
   * @description The function `Map` is called with the result of `Parser` and the result of `Map` is returned.
   * This allows you to transform the result of a parser to create an AST.
   * @param Parser - the parser to match
   * @param Map - the function to call with the result of `Parser`
   * @returns an Ok type if the parser matches and the result of `Map` or the error of the parser
   *
   * @example
   * ```ts
   * type T0 = Call<Map<Literal<"a">, Constant<"b">>, "a">;
   * //   ^? type T0 = Ok<{ result: "b"; input: "" }>
   * type T1 = Call<Map<Literal<"a">, Constant<"b">>, "b">;
   * //   ^? type T1 = Error<{ message: "Expected 'literal('a')' - Received 'b'"; cause: "" }>
   * ```
   */
  export interface Map<Parser extends ParserFn, Map extends Fn>
    extends ParserFn {
    name: "map";
    params: [Parser, "Fn"];
    return: this["arg0"] extends infer Input extends string
      ? Call<Parser, Input> extends infer A
        ? A extends Ok<infer Result>
          ? Ok<Call<Map, Result>, A["value"]["input"]>
          : A
        : never
      : InputError<this["arg0"]>;
  }

  /**
   * Parser that discards the result of another parser when it succeeds.
   * But it still returns the rest of the input.
   * @param Parser - the parser to match
   * @returns an Ok type if the parser matches and an empty array or the error of the parser
   *
   * @example
   * ```ts
   * type T0 = Call<Skip<Literal<"a">>, "a">;
   * //   ^? type T0 = Ok<{ result: []; input: "" }>
   * type T1 = Call<Skip<Literal<"a">>, "b">;
   * //   ^? type T1 = Error<{ message: "Expected 'literal('a')' - Received 'b'"; cause: "" }>
   * ```
   */
  export type Skip<Parser extends ParserFn> = Map<Parser, Constant<[]>>;

  /**
   * Parser that transforms the error of another parser when it fails.
   * @description The function `Map` is called with the error of `Parser` and the error of `Map` is returned.
   * This allows you to transform the error of a parser to create a more helpful error message or even to recover from an error.
   * @param Parser - the parser to match
   * @param Map - the function to call with the error of `Parser`
   * @returns an Ok type if the parser matches or the result of `Map`
   *
   * @example
   * ```ts
   * type T0 = Call<MapError<Literal<"a">, Constant<"b">>, "a">;
   * //   ^? type T0 = Ok<{ result: "a"; input: "" }>
   * type T1 = Call<MapError<Literal<"a">, Objects.Create<{
   *  kind: "Ok";
   *  value: {
   *   result: 'not "a"';
   *   input: Objects.Get<'error.input'>
   *  }
   * }>>, "b">; // transforms the error to an Ok type
   * ```
   */
  export interface MapError<Parser extends ParserFn, Map extends Fn>
    extends ParserFn {
    name: "mapError";
    params: [Parser, "Fn"];
    return: this["arg0"] extends infer Input extends string
      ? Call<Parser, Input> extends infer A
        ? A extends Error<unknown>
          ? Call<Map, A>
          : A
        : never
      : InputError<this["arg0"]>;
  }

  type ChoiceImpl<
    Self extends ParserFn,
    Parsers extends ParserFn[],
    Input extends string,
    ErrorAcc extends unknown[] = []
  > = Parsers extends [
    infer Head extends ParserFn,
    ...infer Tail extends ParserFn[]
  ]
    ? Call<Head, Input> extends infer A
      ? A extends Ok
        ? A
        : ChoiceImpl<Self, Tail, Input, [...ErrorAcc, ErrMsg<A>]>
      : never
    : Err<Self, Input, ErrorAcc>;

  /**
   * Parser that tries to match the input with one of the given parsers.
   * @description The parsers are tried in the order they are given.
   * @param Parsers - the parsers to try
   * @returns an Ok type if one of the parsers matches or an error with all the errors of the parsers
   *
   * @example
   * ```ts
   * type T0 = Call<Choice<[
   * //   ^? type T0 = Ok<{ result: "a"; input: "" }>
   *   Literal<"a">,
   *   Literal<"b">,
   * ]>, "a">;
   * type T1 = Call<Choice<[
   * //   ^? type T1 = Ok<{ result: "b"; input: "" }>
   *  Literal<"a">,
   *  Literal<"b">,
   * ]>, "b">;
   * type T2 = Call<Choice<[
   * //   ^? type T2 = Error<{ message: "Expected 'choice(literal('a'),literal('b'))' - Received 'c'"; cause: "Expected 'literal('a')' - Received 'c' | Expected 'literal('b')' - Received 'c'";}>
   * Literal<"a">,
   * Literal<"b">,
   * ]>, "c">;
   * ```
   */
  export interface Choice<Parsers extends ParserFn[]> extends ParserFn {
    name: "choice";
    params: Parsers;
    return: this["arg0"] extends infer Input extends string
      ? ChoiceImpl<this, Parsers, Input>
      : InputError<this["arg0"]>;
  }

  /**
   * Parser that tries to match the input with one of the two given parsers.
   * @description The parsers are tried in the order they are given.
   * @param Parser1 - the first parser to try
   * @param Parser2 - the second parser to try
   * @returns an Ok type if one of the parsers matches or an error with all the errors of the parsers
   *
   * @example
   * ```ts
   * type T0 = Call<Or<Literal<"a">, Literal<"b">>, "a">;
   * //   ^? type T0 = Ok<{ result: "a"; input: "" }>
   * ```
   */
  export type Or<Parser1 extends ParserFn, Parser2 extends ParserFn> = Choice<
    [Parser1, Parser2]
  >;

  /**
   * Parser that optionally matches the input with the given parser.
   * @description If the parser matches it will return the result of the parser.
   * If the parser doesn't match it will return an empty array.
   * @param Parser - the parser to match
   * @returns an Ok type if the parser matches and an empty array or the error of the parser
   *
   * @example
   * ```ts
   * type T0 = Call<Optional<Literal<"a">>, "a">;
   * //   ^? type T0 = Ok<{ result: ["a"]; input: "" }>
   * type T1 = Call<Optional<Literal<"a">>, "b">;
   * //   ^? type T1 = Ok<{ result: []; input: "b" }>
   * ```
   */
  export interface Optional<Parser extends ParserFn> extends ParserFn {
    name: "optional";
    params: [Parser];
    return: this["arg0"] extends infer Input extends string
      ? Call<Parser, Input> extends infer A
        ? A extends Ok
          ? A
          : Ok<{ result: []; input: Input }>
        : never
      : InputError<this["arg0"]>;
  }

  /**
   * Parser that matches if the given parser doesn't match.
   * it will not consume any input allowing to use it as a lookahead in a sequence.
   * @param Parser - the parser to match
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Not<Literal<"test">>, "test">;
   * //   ^? type T0 = Error<{ message: "Expected 'not(literal('test'))' - Received 'test'"; cause: "";}>
   * type T1 = Call<Not<Literal<"test">>, "other">;
   * //   ^? type T1 = Ok<{ result: []; input: "other" }>
   */
  export interface Not<Parser extends ParserFn> extends ParserFn {
    name: "not";
    params: [Parser];
    return: this["arg0"] extends infer Input extends string
      ? Call<Parser, Input> extends Ok
        ? Err<this, Input>
        : Ok<[], Input>
      : InputError<this["arg0"]>;
  }

  // prettier-ignore
  type _lower = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";
  // prettier-ignore
  type _upper = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
  type _alpha = _lower | _upper;
  // prettier-ignore
  type _digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  type _alhanum = _alpha | _digit;

  /**
   * Parser that matches a single character that is an alphabetical character.
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Alpha, "a">;
   * //   ^? type T0 = Ok<{ result: "a"; input: "" }>
   * type T1 = Call<Alpha, "A">;
   * //   ^? type T1 = Ok<{ result: "A"; input: "" }>
   * type T2 = Call<Alpha, "1">;
   * //   ^? type T2 = Error<{ message: "Expected 'alpha()' - Received '1'"; cause: "";}>
   * ```
   */
  export interface Alpha extends ParserFn {
    name: "alpha";
    params: [];
    return: this["arg0"] extends infer Input extends string
      ? Input extends `${infer Head}${infer Tail}`
        ? Head extends _lower | _upper | "_"
          ? Ok<Head, Tail>
          : Err<this, Input>
        : Err<this, Input>
      : InputError<this["arg0"]>;
  }

  /**
   * Parser that matches a single character that is an alphanumeric character.
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<AlphaNum, "a">;
   * //   ^? type T0 = Ok<{ result: "a"; input: "" }>
   * type T1 = Call<AlphaNum, "A">;
   * //   ^? type T1 = Ok<{ result: "A"; input: "" }>
   * type T2 = Call<AlphaNum, "1">;
   * //   ^? type T2 = Ok<{ result: "1"; input: "" }>
   * type T3 = Call<AlphaNum, "_">;
   * //   ^? type T3 = Error<{ message: "Expected 'alphaNum()' - Received '_'"; cause: "";}>
   * ```
   */
  export interface AlphaNum extends ParserFn {
    name: "alphaNum";
    params: [];
    return: this["arg0"] extends infer Input extends string
      ? Input extends `${infer Head}${infer Tail}`
        ? Head extends _alhanum
          ? Ok<Head, Tail>
          : Err<this, Input>
        : Err<this, Input>
      : InputError<this["arg0"]>;
  }

  /**
   * Parser that matches a single character that is a digit.
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Digit, "1">;
   * //   ^? type T0 = Ok<{ result: "1"; input: "" }>
   * type T1 = Call<Digit, "a">;
   * //   ^? type T1 = Error<{ message: "Expected 'digit()' - Received 'a'"; cause: "";}>
   * ```
   */
  export interface Digit extends ParserFn {
    name: "digit";
    params: [];
    return: this["arg0"] extends infer Input extends string
      ? Input extends `${infer Head}${infer Tail}`
        ? Head extends _digit
          ? Ok<Head, Tail>
          : Err<this, Input>
        : Err<this, Input>
      : InputError<this["arg0"]>;
  }

  export type DigitsImpl<
    Self extends ParserFn,
    Input extends string,
    Acc extends string = ""
  > = Input extends ""
    ? Ok<Acc, Input>
    : Input extends `${infer Head}${infer Tail}`
    ? Head extends _digit
      ? DigitsImpl<Self, Tail, `${Acc}${Head}`>
      : Ok<Acc, Input>
    : never;

  /**
   * Parser that matches a sequence of digits.
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Digits, "123">;
   * //   ^? type T0 = Ok<{ result: "123"; input: "" }>
   * type T1 = Call<Digits, "a">;
   * //   ^? type T1 = Error<{ message: "Expected 'digits()' - Received 'a'"; cause: "";}>
   * ```
   */
  export interface Digits extends ParserFn {
    name: "digits";
    params: [];
    return: this["arg0"] extends infer Input extends string
      ? DigitsImpl<this, Input>
      : InputError<this["arg0"]>;
  }

  type WordImpl<
    Self extends ParserFn,
    Input extends string,
    Acc extends string = ""
  > = Input extends ""
    ? Ok<Acc, Input>
    : Input extends `${infer Head}${infer Tail}`
    ? Acc extends ""
      ? Head extends _alpha | "_"
        ? WordImpl<Self, Tail, Head>
        : Err<Self, Input>
      : Head extends _alhanum | "_"
      ? WordImpl<Self, Tail, `${Acc}${Head}`>
      : Ok<Acc, Input>
    : never;

  /**
   * Parser that matches a sequence of alphanumeric characters that starts with an alphabetical character or an underscore.
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Word, "abc">;
   * //   ^? type T0 = Ok<{ result: "abc"; input: "" }>
   * type T1 = Call<Word, "123">;
   * //   ^? type T1 = Error<{ message: "Expected 'word()' - Received '123'"; cause: "";}>
   * type T2 = Call<Word, "_abc">;
   * //   ^? type T2 = Ok<{ result: "_abc"; input: "" }>
   * type T3 = Call<Word, "a_123">;
   * //   ^? type T3 = Ok<{ result: "a_123"; input: "" }>
   * ```
   */
  export interface Word extends ParserFn {
    name: "word";
    params: [];
    return: this["arg0"] extends infer Input extends string
      ? WordImpl<this, Input>
      : InputError<this["arg0"]>;
  }

  /**
   * Parser that matches at least one time the given parser and tries to match it as many times as possible.
   * @param Parser - the parser to match
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Many1<Alpha>, "abc">;
   * //   ^? type T0 = Ok<{ result: ["a", "b", "c"]; input: "" }>
   * type T1 = Call<Many1<Alpha>, "123">;
   * //  ^? type T1 = Error<{ message: "Expected 'alpha()' - Received '123'"; cause: "";}>
   * ```
   */
  export type Many1<Parser extends ParserFn> = Sequence<[Parser, Many<Parser>]>;

  /**
   * Parser that matches the given parser followed by the given separator
   * and tries to match it as many times as possible while discarding the separator.
   * @param Parser - the parser to match
   * @param Sep - the separator to match
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<SepBy<Alpha, Literal<",">>, "a,b,c">;
   * //   ^? type T0 = Ok<{ result: ["a", "b", "c"]; input: "" }>
   * type T1 = Call<SepBy<Alpha, Literal<",">>, "a,b,c,">;
   * //   ^? type T1 = Error<{ message: "Expected 'alpha()' - Received ''"; cause: "";}>
   * ```
   */
  export type SepBy<Parser extends ParserFn, Sep extends ParserFn> = Sequence<
    [Many<Sequence<[Parser, Skip<Sep>]>>, Parser]
  >;

  /**
   * Parser that matches 3 parsers in sequence but discards the result of the enclosing parsers.
   * @param Open - the parser to match before the parser to match
   * @param Parser - the parser to match
   * @param Close - the parser to match after the parser to match
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Between<Literal<"(">, Alpha, Literal<")">>, "(a)">;
   * //   ^? type T0 = Ok<{ result: "a"; input: "" }>
   * type T1 = Call<Between<Literal<"(">, Alpha, Literal<")">>, "(a">;
   * //   ^? type T1 = Error<{ message: "Expected Literal(')') - Received ''"; cause: "";}>
   * ```
   */
  export type Between<
    Open extends ParserFn,
    Parser extends ParserFn,
    Close extends ParserFn
  > = Sequence<[Skip<Open>, Parser, Skip<Close>]>;

  /**
   * Parser that matches whitespace characters.
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Whitespace, " ">; // space
   * //   ^? type T0 = Ok<{ result: " "; input: "" }>
   * type T1 = Call<Whitespace, "\t">; // tab
   * //   ^? type T1 = Ok<{ result: "\t"; input: "" }>
   * ```
   */
  export type Whitespace = Literal<" " | "\t" | "\n" | "\r">;

  /**
   * Parser that matches 0 or more whitespace characters.
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Whitespaces, " \t \n \r ">;
   * //   ^? type T0 = Ok<{ result: [" ", "\t", " ", "\n", " ", "\r", " "]; input: "" }>
   * ```
   */
  export type Whitespaces = Many<Whitespace>;

  /**
   * Parser that matches the given parser and discards the enclosing whitespace characters.
   * @param Parser - the parser to match
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Trim<Literal<"test">>, "     test  ">;
   * //   ^? type T0 = Ok<{ result: "test"; input: "" }>
   * ```
   */
  export type Trim<Parser extends ParserFn> = Sequence<
    [Skip<Whitespaces>, Parser, Skip<Whitespaces>]
  >;

  interface ParseFn extends Fn {
    return: this["args"] extends [
      infer Parser extends ParserFn,
      infer Input extends string
    ]
      ? Call<Parser, Input> extends infer A
        ? A extends Ok<infer Result>
          ? Result
          : A extends Error<infer Err>
          ? Err
          : never
        : never
      : never;
  }

  /**
   * Parse a string using the given parser and return the result.
   * @param Parser - the parser to use
   * @param Input - the string to parse
   * @returns the result of the parser
   *
   * @example
   * ```ts
   * type T0 = Eval<Parse<Word, "abc">>;
   * ```
   */
  export type Parse<
    Parser extends ParserFn | _ | unset = unset,
    Input extends string | _ | unset = unset
  > = PartialApply<ParseFn, [Parser, Input]>;
}
