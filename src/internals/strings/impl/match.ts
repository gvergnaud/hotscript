import { Call, Fn } from "../../core/Core";
import { Split } from "../../helpers";
import { T } from "../../..";

import {
  ParseRegExp,
  MatchRegExp,
  MatchAllRegExp,
  Flag,
  Matcher,
} from "type-level-regexp/regexp";

type SupportedRegExpReplaceFlags = "i" | "g" | "ig" | "gi";

type PrettifyRegExpMatchArray<RegExpMatchResult> = RegExpMatchResult extends {
  _matchArray: infer MatchArray;
  index: infer Index;
  groups: infer Groups;
}
  ? MatchArray & { index: Index; groups: Groups }
  : null;

interface PrettifyRegExpMatchArrayFn extends Fn {
  return: this["args"] extends [infer RegExpMatchResult, ...any]
    ? PrettifyRegExpMatchArray<RegExpMatchResult>
    : never;
}

type ResovleRegExpMatchOrError<
  Str extends string,
  RegExp extends string,
  FlagUnion extends Flag,
  ParsedResult = ParseRegExp<RegExp>
> = ParsedResult extends Matcher[]
  ? "g" extends FlagUnion
    ? MatchRegExp<Str, ParsedResult, FlagUnion>
    : PrettifyRegExpMatchArray<MatchRegExp<Str, ParsedResult, FlagUnion>>
  : ParsedResult;

export interface Match extends Fn {
  return: this["args"] extends [
    infer Str extends string,
    infer RawRegExp extends string,
    ...any
  ]
    ? Str extends Str
      ? RawRegExp extends `/${infer RegExp}/`
        ? ResovleRegExpMatchOrError<Str, RegExp, never>
        : RawRegExp extends `/${infer RegExp}/${SupportedRegExpReplaceFlags}`
        ? RawRegExp extends `/${RegExp}/${infer Flags}`
          ? Split<Flags, "">[number] extends infer FlagsUnion extends Flag
            ? ResovleRegExpMatchOrError<Str, RegExp, FlagsUnion>
            : never
          : never
        : ResovleRegExpMatchOrError<Str, RawRegExp, never>
      : never
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
    infer RawRegExp extends string,
    ...any
  ]
    ? Str extends Str
      ? RawRegExp extends `/${infer RegExp}/g`
        ? ResovleRegExpMatchAllOrError<Str, RegExp, "g">
        : RawRegExp extends `/${infer RegExp}/${Exclude<
            SupportedRegExpReplaceFlags,
            "i"
          >}`
        ? ResovleRegExpMatchAllOrError<
            Str,
            RegExp,
            Split<
              RawRegExp extends `/${RegExp}/${infer Flags extends SupportedRegExpReplaceFlags}`
                ? Flags
                : never,
              ""
            >[number]
          >
        : TypeError & {
            msg: "MatchAll called with a non-global RegExp argument";
          }
      : never
    : never;
}
