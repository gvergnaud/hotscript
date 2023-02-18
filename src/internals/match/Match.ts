import { Fn, unset, _ } from "../core/Core";
import { Functions } from "../functions/Functions";
import * as Impl from "./impl/match";

/**
 * Match creates a pattern matching expression.
 * Pattern matching let you execute different
 * branches of code based on the structure
 * of the input type exdestructure the input type, and execute
 *
 * @param input - the input to pattern match on
 * @param withClauses - list of with clauses representing different branches if code
 *
 * @example
 * ```ts
 * type Test<T> = Match<T, [
 *   With<{ msg: string }, F.ComposeLeft<O.Get<"msg">, S.Prepend<"Message: ">>>,
 *   With<string, S.Append<" <-- Message">>,
 *   With<any, F.Constant<"default value">>
 * ]>
 * ```
 */
export type Match<
  valueOrWith = unset,
  with0 = unset,
  with1 = unset,
  with2 = unset,
  with3 = unset,
  with4 = unset,
  with5 = unset,
  with6 = unset,
  with7 = unset,
  with8 = unset,
  with9 = unset
> = Functions.PartialApply<
  MatchFn,
  valueOrWith extends Impl.With<any, any>
    ? [
        unset,
        valueOrWith,
        with0,
        with1,
        with2,
        with3,
        with4,
        with5,
        with6,
        with7,
        with8,
        with9
      ]
    : [
        valueOrWith,
        with0,
        with1,
        with2,
        with3,
        with4,
        with5,
        with6,
        with7,
        with8,
        with9
      ]
>;

interface MatchFn extends Fn {
  return: this["args"] extends [
    infer value,
    ...infer clauses extends Impl.With<any, any>[]
  ]
    ? Impl.Match<value, clauses>
    : never;
}

export namespace Match {
  export type With<pattern, fn extends Fn> = Impl.With<pattern, fn>;

  export type arg0<Constraint = unknown> = Impl.arg<0, Constraint>;
  export type arg1<Constraint = unknown> = Impl.arg<1, Constraint>;
  export type arg2<Constraint = unknown> = Impl.arg<2, Constraint>;
  export type arg3<Constraint = unknown> = Impl.arg<3, Constraint>;
}
