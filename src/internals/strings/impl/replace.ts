import { Fn } from "../../core/Core";
import { RegExp } from "./regexp";

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
    infer From extends string | RegExp<string, any>,
    ...any
  ]
    ? Str extends Str
      ? From extends RegExp<infer RegExpPattern, infer Flags>
        ? ParseRegExp<RegExpPattern> extends infer ParsedResult
          ? ParsedResult extends Matcher[]
            ? ReplaceWithRegExp<Str, ParsedResult, To, Flags>
            : ParsedResult
          : never
        : From extends string
        ? Replace<Str, From, To>
        : never
      : never
    : never;
}
