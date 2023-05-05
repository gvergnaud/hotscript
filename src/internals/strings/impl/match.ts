import { Call, Fn } from "../../core/Core";
import { T } from "../../..";

import { RegExpStruct } from "./regexp";

import {
  ParseRegExp,
  MatchRegExp,
  MatchAllRegExp,
  Flag,
  Matcher,
} from "type-level-regexp/regexp";

type PrettifyRegExpMatchArray<RegExpMatchResult> = RegExpMatchResult extends {
  _matchArray: infer MatchArray;
  index: infer Index;
  groups: infer Groups;
}
  ? MatchArray & { index: Index; groups: Groups }
  : null;

export interface Match extends Fn {
  return: this["args"] extends [
    infer Str extends string,
    RegExpStruct<infer RegExpPattern, infer Flags>,
    ...any
  ]
    ? Str extends Str
      ? ParseRegExp<RegExpPattern> extends infer ParsedResult
        ? ParsedResult extends Matcher[]
          ? "g" extends Flags
            ? MatchRegExp<Str, ParsedResult, Flags>
            : PrettifyRegExpMatchArray<MatchRegExp<Str, ParsedResult, Flags>>
          : ParsedResult
        : never
      : never
    : never;
}

interface PrettifyRegExpMatchArrayFn extends Fn {
  return: this["args"] extends [infer RegExpMatchResult, ...any]
    ? PrettifyRegExpMatchArray<RegExpMatchResult>
    : never;
}

type ResovleRegExpMatchAllOrError<
  Str extends string,
  RegExp extends string,
  FlagUnion extends Flag,
  ParsedResult = ParseRegExp<RegExp>
> = ParsedResult extends Matcher[]
  ? MatchAllRegExp<Str, ParsedResult, FlagUnion> extends {
      _matchedTuple: infer MatchTuple extends any[];
    }
    ? Call<T.Map<PrettifyRegExpMatchArrayFn>, MatchTuple>
    : null
  : ParsedResult;

export interface MatchAll extends Fn {
  return: this["args"] extends [
    infer Str extends string,
    RegExpStruct<infer RegExpPattern, infer Flags>,
    ...any
  ]
    ? Str extends Str
      ? "g" extends Flags
        ? ResovleRegExpMatchAllOrError<Str, RegExpPattern, Flags>
        : TypeError & {
            msg: "MatchAll called with a non-global RegExp argument";
          }
      : never
    : never;
}
