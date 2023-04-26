import { arg, Call, Fn, PartialApply, unset } from "../../core/Core";
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

export type Match<value, patterns extends With<any, any>[]> = patterns extends [
  With<infer pattern, infer handler>,
  ...infer restPatterns extends With<any, any>[]
]
  ? DoesMatch<value, pattern> extends true
    ? handler extends Fn
      ? Call<PartialApply<Extract<handler, Fn>, ExtractArgs<value, pattern>>>
      : handler
    : Match<value, restPatterns>
  : never;

export type With<pattern, handler> = { pattern: pattern; handler: handler };
