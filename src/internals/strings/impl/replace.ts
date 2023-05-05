import { Fn } from "../../core/Core";
import { RegExpStruct } from "./regexp";

import {
  Matcher,
  ParseRegExp,
  ReplaceWithRegExp,
} from "type-level-regexp/regexp";

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
      ? Replace<Str, From, To>
      : never
    : never;
}

export interface ReplaceWithRegExpReducer<To extends string> extends Fn {
  return: this["args"] extends [
    infer Str extends string,
    RegExpStruct<infer RegExpPattern, infer Flags>,
    ...any
  ]
    ? ParseRegExp<RegExpPattern> extends infer ParsedResult
      ? ParsedResult extends Matcher[]
        ? ReplaceWithRegExp<Str, ParsedResult, To, Flags>
        : ParsedResult
      : never
    : never;
}
