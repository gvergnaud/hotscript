import { Eval, Fn, unset } from "../../core/Core";
import { Functions } from "../../functions/Functions";
import { Primitive, UnionToIntersection } from "../../helpers";

export type arg0 = "@hotscript/arg0";
export type arg1 = "@hotscript/arg1";
export type arg2 = "@hotscript/arg2";
export type arg3 = "@hotscript/arg3";

type GetWithDefault<Obj, K, Def> = K extends keyof Obj ? Obj[K] : Def;

type ReplaceArgsWithAny<pattern> = pattern extends arg0 | arg1 | arg2 | arg3
  ? any
  : pattern extends Primitive
  ? pattern
  : pattern extends [any, ...any]
  ? { [key in keyof pattern]: ReplaceArgsWithAny<pattern[key]> }
  : pattern extends (infer V)[]
  ? ReplaceArgsWithAny<V>[]
  : pattern extends object
  ? { [key in keyof pattern]: ReplaceArgsWithAny<pattern[key]> }
  : pattern;

type DoesMatch<value, pattern> = value extends ReplaceArgsWithAny<pattern>
  ? true
  : false;

type ExtractArgObject<value, pattern> = pattern extends
  | arg0
  | arg1
  | arg2
  | arg3
  ? { [K in pattern]: value }
  : pattern extends []
  ? {}
  : [value, pattern] extends [
      [infer valueFirst, ...infer valueRest],
      [infer patternFirst, ...infer patternRest]
    ]
  ? ExtractArgObject<valueRest, patternRest> &
      ExtractArgObject<valueFirst, patternFirst>
  : [value, pattern] extends [(infer valueFirst)[], (infer patternFirst)[]]
  ? ExtractArgObject<valueFirst, patternFirst>
  : [value, pattern] extends [object, object]
  ? UnionToIntersection<
      {
        [k in keyof value & keyof pattern]: ExtractArgObject<
          value[k],
          pattern[k]
        >;
      }[keyof value & keyof pattern]
    >
  : {};

type WithDefaultArgs<Args extends any[], Def> = [Args[number]] extends [unset]
  ? Def
  : Args;

type ArgObjectToArgs<T> = [
  GetWithDefault<T, arg0, unset>,
  GetWithDefault<T, arg1, unset>,
  GetWithDefault<T, arg2, unset>,
  GetWithDefault<T, arg3, unset>
];

type ExtractArgs<value, pattern> = WithDefaultArgs<
  ArgObjectToArgs<ExtractArgObject<value, pattern>>,
  [value]
>;

export type Match<
  value,
  patterns extends With<unknown, any>[]
> = patterns extends [
  With<infer pattern, infer fn extends Fn>,
  ...infer restPatterns extends With<unknown, Fn>[]
]
  ? DoesMatch<value, pattern> extends true
    ? Eval<Functions.PartialApply<fn, ExtractArgs<value, pattern>>>
    : Match<value, restPatterns>
  : never;

export type With<pattern, fn extends Fn> = { pattern: pattern; fn: fn };
