import { Fn, PartialApply, unset, _ } from "../core/Core";
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
 *   With<{ msg: Match.arg0 }, S.Prepend<"Message: ">>,
 *   With<string, S.Append<": string">>,
 *   With<any, F.Constant<"default value">>
 * ]>
 * ```
 */
export type Match<
  valueOrWithClauses = unset,
  withClauses extends Impl.With<any, any>[] | unset | _ = unset
> = PartialApply<
  MatchFn,
  withClauses extends unset
    ? [unset, valueOrWithClauses]
    : [valueOrWithClauses, withClauses]
>;

interface MatchFn extends Fn {
  return: Impl.Match<this["arg0"], this["arg1"]>;
}

export namespace Match {
  export type With<pattern, handler> = Impl.With<pattern, handler>;

  /**
   * Returns the Nth parameter of a function.
   *
   * @param Discriminant - Discriminant field.
   * @param Body - Matching functions.
   * @param Union - Union for matching.
   * @returns The Nth parameter of the function.
   *
   * @example
   * ```ts
   * type AorB =
   *   | {
   *       type: "a" | "c";
   *       a: "aaa";
   *       c: false;
   *     }
   *   | {
   *       type: "b";
   *       b: 123;
   *     };
   *
   * type T0 = DiscriminatedUnion<'type', {
   *         a: ComposeLeft<[Objects.Get<"a">, Strings.Uppercase]>,
   *         b: ComposeLeft<[Objects.Get<"b">, Numbers.Negate]>,
   *         c: ComposeLeft<[Objects.Get<"c">]>,
   * }, AorB> // -123 | 'AAA' | false
   */
  export type DiscriminatedUnion<
    Discriminator extends PropertyKey,
    Body extends Record<Union[Discriminator], Fn>,
    Union extends {[K in Discriminator]: PropertyKey},
  > = Impl.DiscriminatedUnion<Discriminator, Body, Union>;
}
