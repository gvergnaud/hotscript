import { Call, Fn } from "../src/index";

type Ok<A> = { tag: "Ok"; value: A };

type Err<B> = { tag: "Err"; value: B };

type Result<A, B> = Ok<A> | Err<B>;

type ParseError<expected, encountered> = {
  expected: expected;
  encountered: encountered;
};

type Tag<tag extends string, T> = { tag: tag; value: T };

interface Parser extends Fn {
  return: [string, Result<unknown, ParseError<unknown, unknown>>];
}

interface Literal<str extends string> extends Parser {
  return: this["args"] extends [infer input extends string, ...any]
    ? input extends `${str}${infer rest}`
      ? [rest, Ok<str>]
      : [input, Err<ParseError<str, input>>]
    : never;
}

interface Any<str extends string> extends Parser {
  return: this["args"] extends [infer input extends string, ...any]
    ? input extends `${infer start}${infer rest}`
      ? [rest, Ok<start>]
      : [input, Err<ParseError<"any charater", "then end of the input">>]
    : never;
}

interface EndOfLine<str extends string> extends Parser {
  return: this["args"] extends [infer input extends string, ...any]
    ? input extends ""
      ? [input, Ok<null>]
      : [input, Err<ParseError<"end of line", input>>]
    : never;
}

interface AndThen<p extends Parser, getParser extends Fn> extends Parser {
  return: this["args"] extends [infer input extends string, ...any]
    ? Call<p, input> extends infer result
      ? result extends [infer rest, Ok<infer a>]
        ? Call<getParser, a> extends infer newParser extends Parser
          ? Call<newParser, rest>
          : never
        : result extends [infer rest, Err<infer a>]
        ? [rest, Err<a>]
        : never
      : never
    : never;
}

type Sequence<
  parser extends Parser,
  getParsers extends Fn[]
> = getParsers extends [infer first extends Fn, ...infer rest extends Fn[]]
  ? Sequence<AndThen<parser, first>, rest>
  : parser;

interface TupleParser extends Parser {
  return: Sequence<
    [Literal<"[">, Let<"first">, Literal<",">, Let<"second">, Literal<"]">]
  >;
}

// interface Optional<parser extends Parser> extends Parser {
//   return: Call<parser, this["arg0"]> extends [infer rest, Ok<infer A>]
//     ? [rest, Ok<A>] : [this["arg0"], Ok<A>]
//     ? [rest, Ok<Tag<"literal", str>>]
//     : [this["arg0"], Err<`Expectedinput to start with ${str}`>];
// }

type ParseRegex<str> = never;

type Reg = { type: "range"; values: string };

type ParseString<reg extends Reg, str> = {
  range: never;
}[reg["type"]];
