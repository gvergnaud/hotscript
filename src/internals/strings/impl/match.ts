import { Call, Fn } from "../../core/Core";
import { Split } from "../../helpers";
import { T } from "../../..";

import {
  ParseRegExp,
  MatchRegExp,
  MatchAllRegExp,
  Flag,
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

export interface Match extends Fn {
  return: this["args"] extends [
    infer Str extends string,
    infer RawRegExp extends string,
    ...any
  ]
    ? Str extends Str
      ? RawRegExp extends `/${infer RegExp}/`
        ? PrettifyRegExpMatchArray<MatchRegExp<Str, ParseRegExp<RegExp>, never>>
        : RawRegExp extends `/${infer RegExp}/${SupportedRegExpReplaceFlags}`
        ? RawRegExp extends `/${RegExp}/${infer Flags}`
          ? Split<Flags, "">[number] extends infer FlagsUnion extends Flag
            ? "g" extends FlagsUnion
              ? MatchRegExp<Str, ParseRegExp<RegExp>, FlagsUnion>
              : PrettifyRegExpMatchArray<
                  MatchRegExp<Str, ParseRegExp<RegExp>, FlagsUnion>
                >
            : never
          : never
        : PrettifyRegExpMatchArray<
            MatchRegExp<Str, ParseRegExp<RawRegExp>, never>
          >
      : never
    : never;
}

export interface MatchAll extends Fn {
  return: this["args"] extends [
    infer Str extends string,
    infer RawRegExp extends string,
    ...any
  ]
    ? Str extends Str
      ? RawRegExp extends `/${infer RegExp}/g`
        ? MatchAllRegExp<Str, ParseRegExp<RegExp>, never> extends {
            _matchedTuple: infer MatchTuple extends any[];
          }
          ? Call<T.Map<PrettifyRegExpMatchArrayFn>, MatchTuple>
          : null
        : RawRegExp extends `/${infer RegExp}/${Exclude<
            SupportedRegExpReplaceFlags,
            "i"
          >}`
        ? MatchAllRegExp<
            Str,
            ParseRegExp<RegExp>,
            Split<
              RawRegExp extends `/${RegExp}/${infer Flags extends SupportedRegExpReplaceFlags}`
                ? Flags
                : never,
              ""
            >[number]
          > extends {
            _matchedTuple: infer MatchTuple extends any[];
          }
          ? Call<T.Map<PrettifyRegExpMatchArrayFn>, MatchTuple>
          : null
        : TypeError & {
            msg: "MatchAll called with a non-global RegExp argument";
          }
      : never
    : never;
}
