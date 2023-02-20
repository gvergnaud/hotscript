import { arg, Eval, Fn, unset } from "../../core/Core";
import { Functions } from "../../functions/Functions";
import { Primitive, UnionToIntersection } from "../../helpers";

type GetWithDefault<Obj, K, Def> = K extends keyof Obj ? Obj[K] : Def;

type ReplaceArgsWithConstraint<pattern> = pattern extends arg<
  any,
  infer Constraint
>
  ? Constraint
  : pattern extends Primitive
  ? pattern
  : pattern extends [any, ...any]
  ? { [key in keyof pattern]: ReplaceArgsWithConstraint<pattern[key]> }
  : pattern extends (infer V)[]
  ? ReplaceArgsWithConstraint<V>[]
  : pattern extends object
  ? { [key in keyof pattern]: ReplaceArgsWithConstraint<pattern[key]> }
  : pattern;

type DoesMatch<value, pattern> =
  value extends ReplaceArgsWithConstraint<pattern> ? true : false;

type ExtractArgObject<value, pattern> = pattern extends arg<infer N, any>
  ? { [K in N]: value }
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
  GetWithDefault<T, 0, unset>,
  GetWithDefault<T, 1, unset>,
  GetWithDefault<T, 2, unset>,
  GetWithDefault<T, 3, unset>
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
