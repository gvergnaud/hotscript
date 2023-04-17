import { Fn } from "../../core/Core";
import { Split } from "../../helpers";

import { ParseRegExp, ReplaceWithRegExp } from "type-level-regexp/regexp";

type SupportedRegExpReplaceFlags = "i" | "g" | "ig" | "gi";

export type Replace<
  Str,
  From extends string,
  To extends string
> = Str extends string
  ? Str extends `${infer Before}${From}${infer After}`
    ? Replace<`${Before}${To}${After}`, From, To>
    : Str
  : Str;

export interface ReplaceReducer<To extends string> extends Fn {
  return: this["args"] extends [
    infer Str extends string,
    infer From extends string,
    ...any
  ]
    ? Str extends Str
      ? From extends `/${infer RegExp}/`
        ? ReplaceWithRegExp<Str, ParseRegExp<RegExp>, To, never>
        : From extends `/${infer RegExp}/${SupportedRegExpReplaceFlags}`
        ? ReplaceWithRegExp<
            Str,
            ParseRegExp<RegExp>,
            To,
            Split<
              From extends `/${RegExp}/${infer Flags extends SupportedRegExpReplaceFlags}`
                ? Flags
                : never,
              ""
            >[number]
          >
        : Replace<Str, From, To>
      : never
    : never;
}
