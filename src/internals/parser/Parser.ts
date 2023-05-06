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
import { CharToNumber } from "../strings/impl/chars";
import { Strings } from "../strings/Strings";
import { Tuples } from "../tuples/Tuples";
import { GreaterThanOrEqual, LessThanOrEqual } from "../numbers/impl/compare";
export namespace Parser {
  /**
   * A parser is a function that takes static parameters and a string input
   * and returns a result or an error.
   * @description to enable introspection, parsers augment the function type
   * with a name and a list of parameters.
   */
  export interface ParserFn extends Fn {
    name: string;
    params: any;
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
    Parser,
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
  export type ToString<Parser extends unknown | _ | unset = unset> =
    PartialApply<ToStringFn, [Parser]>;

  /**
   * Parser that matches a string.
   * It can be a union of string literals or a string literal.
   * in case of a union, the correct string literal is returned.
   */
  type LiteralImpl<
    Self,
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
   * //   ^? type T0 = Ok< "a", "" >
   * type T1 = Call<Literal<"a">, "b">;
   * //   ^? type T1 = Error<{ message: "Expected 'literal('a')' - Received 'b'"; cause: "" }>
   * type T2 = Call<Literal<"a" | "b">, "a">;
   * //   ^? type T2 = Ok< "a", "" >
   * ```
   */
  export interface Literal<ExpectedLiteral extends string> extends ParserFn {
    name: "literal";
    params: [ExpectedLiteral];
    return: LiteralImpl<this, ExpectedLiteral, this["arg0"]>;
  }

  type ManyImpl<
    Self,
    Parser,
    Input extends string,
    Acc extends unknown[] = []
  > = Input extends ""
    ? Ok<Acc, Input>
    : Parser extends infer F extends ParserFn
    ? Call<F, Input> extends infer A
      ? A extends Ok<infer Res extends unknown[], infer In>
        ? ManyImpl<Self, Parser, In, [...Acc, ...Res]>
        : A extends Ok<infer Res, infer In>
        ? ManyImpl<Self, Parser, In, [...Acc, Res]>
        : Ok<Acc, Input>
      : Ok<Acc, Input>
    : Err<Self, Input>;

  /**
   * Parser that matches a parser 0 or more times. It returns an array of the matched parsers results.
   * @param Parser - the parser to match
   * @returns an Ok type if the parser matches 0 or more times and the rest of the input
   *
   * @example
   * ```ts
   * type T0 = Call<Many<Literal<"a">>, "aaa">;
   * //   ^? type T0 = Ok< ["a", "a", "a"], "" >
   * type T1 = Call<Many<Literal<"a">>, "bbb">;
   * //   ^? type T1 = Ok< [], "bbb" >
   * ```
   */
  export interface Many<Parser> extends ParserFn {
    name: "many";
    params: [Parser];
    return: this["arg0"] extends infer Input extends string
      ? ManyImpl<this, Parser, Input>
      : InputError<this["arg0"]>;
  }

  type SequenceImpl<
    Self,
    Parsers,
    Input extends string,
    Acc extends unknown[] = []
  > = Parsers extends [infer Head extends ParserFn, ...infer Tail]
    ? Call<Head, Input> extends infer A
      ? A extends Ok<infer Res extends unknown[], infer In>
        ? SequenceImpl<Self, Tail, In, [...Acc, ...Res]>
        : A extends Ok<infer Res, infer In>
        ? SequenceImpl<Self, Tail, In, [...Acc, Res]>
        : A // forwards error
      : never
    : Ok<Acc, Input>;

  /**
   * Parser that matches a list of parsers in sequence.
   * @param Parsers - the parsers to match
   * @returns an Ok type with an array of all the parsers results or the error of the first parser that fails
   *
   * @example
   * ```ts
   * type T0 = Call<Sequence<[Literal<"a">, Literal<"b">]>, "ab">;
   * //   ^? type T0 = Ok< ["a", "b"], "" >
   * type T1 = Call<Sequence<[Literal<"a">, Literal<"b">]>, "ac">;
   * //   ^? type T1 = Error<{ message: "Expected 'literal('b')' - Received 'c'"; cause: "" }>
   * ```
   */
  export interface Sequence<Parsers> extends ParserFn {
    name: "sequence";
    params: Parsers;
    return: this["arg0"] extends infer Input extends string
      ? SequenceImpl<this, Parsers, Input>
      : InputError<this["arg0"]>;
  }

  type CommaSep = Sequence<
    [Trim<Word>, Optional<Sequence<[Literal<",">, CommaSep]>>]
  >;

  type test = Call<CommaSep, "a, b, c">;
  //    ^?

  /**
   * Parser that fails if there is any input left.
   * @returns an Ok type if there is no input left
   *
   * @example
   * ```ts
   * type T0 = Call<EndOfInput, "">;
   * //   ^? type T0 = Ok< [], "" >
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
   * //   ^? type T0 = Ok< "b", "" >
   * type T1 = Call<Map<Literal<"a">, Constant<"b">>, "b">;
   * //   ^? type T1 = Error<{ message: "Expected 'literal('a')' - Received 'b'"; cause: "" }>
   * ```
   */
  export interface Map<Parser, Map extends Fn> extends ParserFn {
    name: "map";
    params: [Parser, "Fn"];
    return: this["arg0"] extends infer Input extends string
      ? Parser extends infer F extends ParserFn
        ? Call<F, Input> extends infer A
          ? A extends Ok<infer Result, infer Input>
            ? Ok<Call<Map, Result>, Input>
            : A
          : never
        : Err<this, Input>
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
   * //   ^? type T0 = Ok< [], "" >
   * type T1 = Call<Skip<Literal<"a">>, "b">;
   * //   ^? type T1 = Error<{ message: "Expected 'literal('a')' - Received 'b'"; cause: "" }>
   * ```
   */
  export type Skip<Parser> = Map<Parser, Constant<[]>>;

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
   * //   ^? type T0 = Ok< "a", "" >
   * type T1 = Call<MapError<Literal<"a">, Objects.Create<{
   *  kind: "Ok";
   *  value: {
   *   result: 'not "a"';
   *   input: Objects.Get<'error.input'>
   *  }
   * }>>, "b">; // transforms the error to an Ok type
   * ```
   */
  export interface MapError<Parser, Map extends Fn> extends ParserFn {
    name: "mapError";
    params: [Parser, "Fn"];
    return: this["arg0"] extends infer Input extends string
      ? Parser extends infer F extends ParserFn
        ? Call<F, Input> extends infer A
          ? A extends Error<unknown>
            ? Call<Map, A>
            : A
          : never
        : Err<this, Input>
      : InputError<this["arg0"]>;
  }

  type ChoiceImpl<
    Self,
    Parsers,
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
   * //   ^? type T0 = Ok< "a", "" >
   *   Literal<"a">,
   *   Literal<"b">,
   * ]>, "a">;
   * type T1 = Call<Choice<[
   * //   ^? type T1 = Ok< "b", "" >
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
  export interface Choice<Parsers> extends ParserFn {
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
   * //   ^? type T0 = Ok<"a", "">
   * ```
   */
  export type Or<Parser1, Parser2> = Choice<[Parser1, Parser2]>;

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
   * //   ^? type T0 = Ok<["a"],"">
   * type T1 = Call<Optional<Literal<"a">>, "b">;
   * //   ^? type T1 = Ok<[],"b">
   * ```
   */
  export interface Optional<Parser> extends ParserFn {
    name: "optional";
    params: [Parser];
    return: this["arg0"] extends infer Input extends string
      ? Parser extends infer F extends ParserFn
        ? Call<F, Input> extends infer A
          ? A extends Ok
            ? A
            : Ok<[], Input>
          : never
        : Err<this, Input>
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
   * //   ^? type T1 = Ok< [], "other" >
   */
  export interface Not<Parser> extends ParserFn {
    name: "not";
    params: [Parser];
    return: this["arg0"] extends infer Input extends string
      ? Parser extends infer F extends ParserFn
        ? Call<F, Input> extends Ok
          ? Err<this, Input>
          : Ok<[], Input>
        : Err<this, Input>
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
   * //   ^? type T0 = Ok< "a", "" >
   * type T1 = Call<Alpha, "A">;
   * //   ^? type T1 = Ok< "A", "" >
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
   * Parser that matches a single character between the given characters.
   * @param start - the start of the range
   * @param end - the end of the range
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<CharRange<"a", "z">, "a">;
   * //   ^? type T0 = Ok< "a", "" >
   * type T1 = Call<CharRange<"a", "z">, "z">;
   * //   ^? type T1 = Ok< "z", "" >
   * type T2 = Call<CharRange<"a", "z">, "A">;
   * //   ^? type T2 = Error<{ message: "Expected 'range('a', 'z')' - Received 'A'"; cause: "";}>
   * ```
   */
  export interface CharRange<start extends string, end extends string>
    extends ParserFn {
    name: "range";
    params: [start, end];
    return: this["arg0"] extends infer Input extends string
      ? Input extends `${infer Head}${infer Tail}`
        ? [CharToNumber<start>, CharToNumber<Head>, CharToNumber<end>] extends [
            infer S extends number,
            infer H extends number,
            infer E extends number
          ]
          ? [GreaterThanOrEqual<H, S>, LessThanOrEqual<H, E>] extends [
              true,
              true
            ]
            ? Ok<Head, Tail>
            : Err<this, Input>
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
   * //   ^? type T0 = Ok< "a", "" >
   * type T1 = Call<AlphaNum, "A">;
   * //   ^? type T1 = Ok< "A", "" >
   * type T2 = Call<AlphaNum, "1">;
   * //   ^? type T2 = Ok< "1", "" >
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
   * //   ^? type T0 = Ok< "1", "" >
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

  /**
   * Parser that matches any single character
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Any, "a">;
   * //   ^? type T0 = Ok< "a", "" >
   * type T1 = Call<Any, "">;
   * //   ^? type T1 = Error<{ message: "Expected 'any()' - Received ''"; cause: "";}>
   * ```
   */
  export interface Any extends ParserFn {
    name: "any";
    params: [];
    return: this["arg0"] extends infer Input extends string
      ? Input extends `${infer Head}${infer Tail}`
        ? Ok<Head, Tail>
        : Err<this, Input>
      : InputError<this["arg0"]>;
  }

  /**
   * Parser that matches a single character that is not the given literal.
   * @param NotExpected - The character that should not be matched
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<NotLiteral<"a">, "b">;
   * //   ^? type T0 = Ok< "b", "" >
   * type T1 = Call<NotLiteral<"a">, "a">;
   * //   ^? type T1 = Error<{ message: "Expected 'notLiteral('a')' - Received 'a'"; cause: "";}>
   * ```
   */
  export type NotLiteral<NotExpected extends string> = Sequence<
    [Not<Literal<NotExpected>>, Any]
  >;

  export type DigitsImpl<
    Self,
    Input extends string,
    Acc extends string = ""
  > = Input extends ""
    ? Acc extends ""
      ? Err<Self, Input>
      : Ok<Acc, Input>
    : Input extends `${infer Head}${infer Tail}`
    ? Acc extends ""
      ? Head extends _digit
        ? DigitsImpl<Self, Tail, `${Acc}${Head}`>
        : Err<Self, Input>
      : Head extends _digit
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
   * //   ^? type T0 = Ok< "123", "" >
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
    Self,
    Input extends string,
    Acc extends string = ""
  > = Input extends ""
    ? Acc extends ""
      ? Err<Self, Input>
      : Ok<Acc, Input>
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
   * //   ^? type T0 = Ok< "abc", "" >
   * type T1 = Call<Word, "123">;
   * //   ^? type T1 = Error<{ message: "Expected 'word()' - Received '123'"; cause: "";}>
   * type T2 = Call<Word, "_abc">;
   * //   ^? type T2 = Ok< "_abc", "" >
   * type T3 = Call<Word, "a_123">;
   * //   ^? type T3 = Ok< "a_123", "" >
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
   * //   ^? type T0 = Ok< ["a", "b", "c"], "" >
   * type T1 = Call<Many1<Alpha>, "123">;
   * //  ^? type T1 = Error<{ message: "Expected 'alpha()' - Received '123'"; cause: "";}>
   * ```
   */
  export type Many1<Parser> = Sequence<[Parser, Many<Parser>]>;

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
   * //   ^? type T0 = Ok< ["a", "b", "c"], "" >
   * type T1 = Call<SepBy<Alpha, Literal<",">>, "a,b,c,">;
   * //   ^? type T1 = Error<{ message: "Expected 'alpha()' - Received ''"; cause: "";}>
   * ```
   */
  export type SepBy<Parser, Sep> = Sequence<
    [Many<Sequence<[Parser, Skip<Sep>]>>, Parser]
  >;

  export type SepByLiteral<Parser, Sep extends string> = SepBy<
    Parser,
    Literal<Sep>
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
   * //   ^? type T0 = Ok< "a", "" >
   * type T1 = Call<Between<Literal<"(">, Alpha, Literal<")">>, "(a">;
   * //   ^? type T1 = Error<{ message: "Expected Literal(')') - Received ''"; cause: "";}>
   * ```
   */
  export type Between<Open, Parser, Close> = Sequence<
    [Skip<Open>, Parser, Skip<Close>]
  >;

  export type BetweenLiterals<
    Open extends string,
    Parser,
    Close extends string
  > = Between<Literal<Open>, Parser, Literal<Close>>;

  /**
   * Parser that matches the given prefix parser and the given parser and discards the result of the prefix parser.
   * @param Prefix - the parser to match before the parser to match and discard
   * @param Parser - the parser to match
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<PrefixBy<Literal<":">, Alpha>, ":a">;
   * //   ^? type T0 = Ok< "a", "" >
   * type T1 = Call<PrefixBy<Literal<":">, Alpha>, "a">;
   * //   ^? type T1 = Error<{ message: "Expected Literal(':') - Received 'a'"; cause: "";}>
   * ```
   */
  export type PrefixBy<Prefix, Parser> = Sequence<[Skip<Prefix>, Parser]>;

  export type PrefixByLiteral<Prefix extends string, Parser> = PrefixBy<
    Literal<Prefix>,
    Parser
  >;

  /**
   * Parser that matches the given parser and the given suffix parser and discards the result of the suffix parser.
   * @param Parser - the parser to match
   * @param Suffix - the parser to match after the parser to match and discard
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Suffix<Alpha, Literal<":">>, "a:">;
   * //   ^? type T0 = Ok< "a", "" >
   * type T1 = Call<Suffix<Alpha, Literal<":">>, "a">;
   * //   ^? type T1 = Error<{ message: "Expected Literal(':') - Received ''"; cause: "";}>
   * ```
   */
  export type SuffixBy<Parser, Suffix> = Sequence<[Parser, Skip<Suffix>]>;

  export type SuffixByLiteral<Parser, Suffix extends string> = SuffixBy<
    Parser,
    Literal<Suffix>
  >;

  /**
   * Parser that matches whitespace characters.
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<Whitespace, " ">; // space
   * //   ^? type T0 = Ok< " ", "" >
   * type T1 = Call<Whitespace, "\t">; // tab
   * //   ^? type T1 = Ok< "\t", "" >
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
   * //   ^? type T0 = Ok< [" ", "\t", " ", "\n", " ", "\r", " "], "" >
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
   * //   ^? type T0 = Ok< "test", "" >
   * ```
   */
  export type Trim<Parser> = Sequence<
    [Skip<Whitespaces>, Parser, Skip<Whitespaces>]
  >;

  /**
   * Parser that matches the given parser and discards the enclosing whitespace characters.
   * @param Parser - the parser to match
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<TrimLeft<Literal<"test">>, "     test  ">;
   * //   ^? type T0 = Ok<["test"], "  " >
   * ```
   */
  export type TrimLeft<Parser> = Sequence<[Skip<Whitespaces>, Parser]>;

  /**
   * Parser that matches the given parser and discards the enclosing whitespace characters.
   * @param Parser - the parser to match
   * @returns an Ok type if the parser matches or an error
   *
   * @example
   * ```ts
   * type T0 = Call<TrimRight<Literal<"test">>, "test  ">;
   * //   ^? type T0 = Ok< "test", "" >
   * ```
   */
  export type TrimRight<Parser> = Sequence<[Parser, Skip<Whitespaces>]>;

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
    Parser extends unknown | _ | unset = unset,
    Input extends string | _ | unset = unset
  > = PartialApply<ParseFn, [Parser, Input]>;
}
