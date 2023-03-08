import * as C from "../core/Core";
import { Prettify } from "../helpers";
import { Match } from "../match/Match";
import { Strings } from "../strings/Strings";
import { Tuples } from "../tuples/Tuples";

export namespace Parser {
  export type Ok<A> = { tag: "Ok"; value: A };

  export type Err<B> = { tag: "Err"; value: B };

  type Result<A, B> = Ok<A> | Err<B>;

  export type ParseError<expected = unknown, encountered = unknown> = {
    expected: expected;
    encountered: encountered;
  };

  export type ParseResult = [string, Result<unknown, ParseError>];

  interface Parser extends C.Fn {
    return: ParseResult;
  }

  type LiteralImpl<str, expected, output extends string = ""> = [
    expected
  ] extends [`${infer eFirst}${infer eRest}`]
    ? str extends `${infer sFirst}${infer sRest}`
      ? sFirst extends eFirst
        ? LiteralImpl<sRest, eRest, `${output}${sFirst}`>
        : Err<"Does not math">
      : Err<"Does not math">
    : Ok<[str, output]>;

  export interface Literal<expected extends string> extends Parser {
    return: LiteralImpl<this["arg0"], expected> extends infer res
      ? res extends Ok<[infer rest, infer output]>
        ? [rest, Ok<output>]
        : [this["arg0"], Err<ParseError<expected, this["arg0"]>>]
      : never;
  }

  export interface Pure<value> extends Parser {
    return: [this["arg0"], Ok<value>];
  }

  export interface Fail<err extends ParseError> extends Parser {
    return: [this["arg0"], Err<err>];
  }

  export interface Any extends Parser {
    return: this["args"] extends [infer input extends string, ...any]
      ? input extends `${infer start}${infer rest}`
        ? [rest, Ok<start>]
        : [input, Err<ParseError<"any charater", "the end of the input">>]
      : never;
  }

  export interface EndOfInput extends Parser {
    return: this["args"] extends [infer input extends string, ...any]
      ? input extends ""
        ? [input, Ok<[]>]
        : [input, Err<ParseError<"end of line", input>>]
      : never;
  }

  export interface Optional<parser extends Parser, defaultValue = null>
    extends Parser {
    return: C.Call<parser, this["arg0"]> extends [
      infer rest extends string,
      Ok<infer A>
    ]
      ? [rest, Ok<A>]
      : [this["arg0"], Ok<defaultValue>];
  }

  type ManyImpl<
    input extends string,
    parser extends Parser,
    fullInput = input,
    output extends any[] = []
  > = C.Call<parser, input> extends [infer rest extends string, Ok<infer value>]
    ? ManyImpl<rest, parser, fullInput, [...output, value]>
    : output extends []
    ? [fullInput, Err<ParseError<"many", fullInput>>]
    : [input, Ok<output>];

  export interface Many<parser extends Parser> extends Parser {
    return: ManyImpl<this["arg0"], parser>;
  }

  type LetterUnion =
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z";

  export type Letter = Literal<LetterUnion>;

  export type Word = Map<Tuples.Join<"">, Many<Letter>>;

  type DigitUnion = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

  export type Digit = Literal<DigitUnion>;

  export type Number = Map<
    C.Compose<[Strings.ToNumber, Tuples.Join<"">]>,
    Many<Digit>
  >;

  export type WhiteSpace = Literal<" " | "\t" | "\n">;

  export type WhiteSpaces = Many<WhiteSpace>;

  type OneOfImpl<parsers, input> = parsers extends [
    infer parser extends Parser,
    ...infer rest
  ]
    ? C.Call<parser, input> extends infer res
      ? res extends [unknown, Ok<unknown>]
        ? res
        : OneOfImpl<rest, input>
      : never
    : [input, Err<ParseError<"nothing matched", input>>];

  export interface OneOf<parsers extends Parser[]> extends Parser {
    return: OneOfImpl<parsers, this["arg0"]>;
  }

  export interface Map<fn extends C.Fn, parser extends Parser> extends Parser {
    return: C.Call<parser, this["arg0"]> extends infer res extends ParseResult
      ? res extends [infer rest extends string, Ok<infer value>]
        ? [rest, Ok<C.Call<fn, value>>]
        : res
      : never;
  }

  type DoImpl<getParsers extends C.Fn[], output> = output extends [
    infer rest,
    Ok<infer a>
  ]
    ? getParsers extends [
        infer first extends Parser,
        ...infer restParsers extends C.Fn[]
      ]
      ? DoImpl<restParsers, C.Call<Map<C.Constant<a>, first>, rest>>
      : getParsers extends [
          infer first extends C.Fn,
          ...infer restParsers extends C.Fn[]
        ]
      ? C.Call<first, a> extends infer newParser extends Parser
        ? DoImpl<restParsers, C.Call<newParser, rest>>
        : never
      : output
    : output;

  export interface Do<getParsers extends C.Fn[]> extends Parser {
    return: DoImpl<getParsers, [this["arg0"], Ok<{}>]>;
  }

  interface LetParser<name extends string, variables, parser extends Parser>
    extends Parser {
    return: C.Call<parser, this["arg0"]> extends infer res extends ParseResult
      ? res extends [infer rest extends string, Ok<infer a>]
        ? [rest, Ok<Prettify<variables & { [k in name]: a }>>]
        : res
      : [
          this["arg0"],
          Err<ParseError<`parser given to Let<${name}, _> is invalid`>>
        ];
  }

  export interface Let<name extends string, parser extends Parser>
    extends C.Fn {
    return: LetParser<name, this["arg0"], parser>;
  }

  type GetByName<names, obj, output extends any[] = []> = names extends [
    infer first extends keyof obj,
    ...infer rest
  ]
    ? GetByName<rest, obj, [...output, obj[first]]>
    : output;

  export interface Apply<fn extends C.Fn, names> extends C.Fn {
    return: this["arg0"] extends infer variables
      ? Pure<C.Apply<fn, GetByName<names, variables>>>
      : Fail<ParseError<"no variables in Ap">>;
  }

  export interface Return<parser extends Parser> extends C.Fn {
    return: parser;
  }

  export type Parse<parser extends C.Fn, str> = C.Pipe<
    str,
    [
      parser,
      Match<
        [
          Match.With<[any, Ok<C.arg0>], C.Identity>,
          Match.With<[any, Err<C.arg0>], C.Identity>
        ]
      >
    ]
  >;
}
