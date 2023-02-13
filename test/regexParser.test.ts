import { Equal, Expect } from "../src/helpers";

describe("RegexParser", () => {
  it("should infer capturing groups correctly", () => {
    class SafeRegExp<T extends string> {
      private regExp: RegExp;

      constructor(regexpStr: T, flags?: string) {
        this.regExp = new RegExp(regexpStr, flags);
      }

      exec(input: string): CapturingGroups<T> | null {
        return this.regExp.exec(input) as any;
      }
    }

    const regexp1 = new SafeRegExp("([a-z]+) (0-9+)", "i");
    const res1 = regexp1.exec("Gabriel Vergnaud");
    //     ^?
    type tes1 = Expect<Equal<typeof res1, [string, string, string] | null>>;

    const regexp2 = new SafeRegExp(
      "^(?<firstName>[a-z]+) (?<lastName>[a-z]+)$",
      "i"
    );
    const res2 = regexp2.exec("Gabriel Vergnaud");
    //     ^?
    type tes2 = Expect<
      Equal<
        typeof res2,
        | ([string, string, string] & {
            groups: { firstName: string; lastName: string };
          })
        | null
      >
    >;

    const regexp3 = new SafeRegExp(
      "^((?<firstName>[a-z]+) (?<lastName>[a-z]+))$",
      "i"
    );
    const res3 = regexp3.exec("Gabriel Vergnaud");
    //     ^?
    type tes3 = Expect<
      Equal<
        typeof res3,
        | ([string, string, string, string] & {
            groups: { firstName: string; lastName: string };
          })
        | null
      >
    >;

    const regexp4 = new SafeRegExp(
      "^(?<fullName>(?<firstName>[a-z]+) (?<lastName>[a-z]+))$",
      "i"
    );
    const res4 = regexp4.exec("Gabriel Vergnaud");
    const groups4 = res4?.groups;
    //     ^?
    type tes4 = Expect<
      Equal<
        typeof groups4,
        { firstName: string; lastName: string; fullName: string } | undefined
      >
    >;

    type CapturingGroups<T> =
      | GroupNamesToMatch<AstToListOfGroupNames<Parse<Tokenize<T>>>>
      | never;

    type ListExclude<
      List,
      Condition,
      Output extends any[] = []
    > = List extends [infer First, ...infer Rest]
      ? First extends Condition
        ? ListExclude<Rest, Condition, Output>
        : ListExclude<Rest, Condition, [...Output, First]>
      : Output;

    type MapListTo<List, Value> = List extends [any, ...infer Rest]
      ? [Value, ...MapListTo<Rest, Value>]
      : [];

    type TwoCharsPattern = "?<";
    type OneCharPattern = ">" | "(" | ")";

    type Tokenize<
      T,
      Current extends string = "",
      Output extends any[] = []
    > = T extends `${infer First}${infer Second}${infer Rest}`
      ? `${First}${Second}` extends TwoCharsPattern
        ? Tokenize<
            Rest,
            "",
            [...Output, ...ListExclude<[Current], "">, `${First}${Second}`]
          >
        : First extends OneCharPattern
        ? Tokenize<
            `${Second}${Rest}`,
            "",
            [...Output, ...ListExclude<[Current], "">, First]
          >
        : Tokenize<`${Second}${Rest}`, `${Current}${First}`, Output>
      : T extends `${infer First}${infer Rest}`
      ? First extends OneCharPattern
        ? Tokenize<Rest, "", [...Output, ...ListExclude<[Current], "">, First]>
        : Tokenize<Rest, `${Current}${First}`, Output>
      : Output;

    type Parse<Tokens, Ast extends any[] = []> = Tokens extends [
      infer First,
      ...infer Rest
    ]
      ? First extends ")"
        ? [Ast, Rest]
        : First extends "("
        ? Parse<Rest> extends [infer GroupAst, infer GroupRest]
          ? GroupAst extends [
              { content: `?<` },
              { content: infer Name },
              { content: ">" },
              ...infer RestGroupAst
            ]
            ? Parse<
                GroupRest,
                [...Ast, { type: "group"; name: Name; content: RestGroupAst }]
              >
            : Parse<
                GroupRest,
                [...Ast, { type: "group"; name: never; content: GroupAst }]
              >
          : never
        : Parse<Rest, [...Ast, { type: "string"; content: First }]>
      : Ast;

    type AstToListOfGroupNames<Ast, Output extends any[] = []> = Ast extends [
      infer First,
      ...infer Rest
    ]
      ? First extends {
          type: "group";
          name: infer Name;
          content: infer GroupAst;
        }
        ? AstToListOfGroupNames<
            Rest,
            [...Output, Name, ...AstToListOfGroupNames<GroupAst>]
          >
        : AstToListOfGroupNames<Rest, Output>
      : Output;

    type GroupNamesToMatch<Names extends any[]> =
      | ([string, ...MapListTo<Names, string>] &
          ([Names[number]] extends [never]
            ? {}
            : { groups: { [K in Names[number]]: string } }))
      | never;
  });
});
