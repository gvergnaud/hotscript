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
 *   With<{ msg: string }, F.ComposeLeft<[O.Get<"msg">, S.Prepend<"Message: ">]>>,
 *   With<string, S.Append<" <-- Message">>,
 *   With<any, F.Constant<"default value">>
 * ]>
 * ```
 */
export type Match<
  value = unset,
  patterns extends Match.With<any, any>[] | _ | unset = unset
> = Functions.PartialApply<MatchFn, [value, patterns]>;

interface MatchFn extends Fn {
  return: Impl.Match<this["arg0"], this["arg1"]>;
}

export namespace Match {
  export type With<pattern, fn extends Fn> = Impl.With<pattern, fn>;

  export type arg0 = Impl.arg0;
  export type arg1 = Impl.arg1;
  export type arg2 = Impl.arg2;
  export type arg3 = Impl.arg3;
}
