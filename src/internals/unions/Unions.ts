import { Call, Eval, Fn, PartialApply, unset, _ } from "../core/Core";
import { Functions } from "../functions/Functions";
import { UnionToTuple } from "../helpers";
import { Std } from "../std/Std";
import { Tuples } from "../tuples/Tuples";

export namespace Unions {
  export type Extract<
    unionOrExtracted = unset,
    extracted = unset
  > = PartialApply<
    ExtractFn,
    extracted extends unset
      ? [unset, unionOrExtracted]
      : [unionOrExtracted, extracted]
  >;

  interface ExtractFn extends Fn {
    return: Std._Extract<this["arg0"], this["arg1"]>;
  }

  type ExtractByImpl<union, predicate extends Fn> = union extends any
    ? Call<predicate, union> extends true
      ? union
      : never
    : never;

  export interface ExtractBy<predicate extends Fn> extends Fn {
    return: ExtractByImpl<this["arg0"], predicate>;
  }

  export type Exclude<unionOrExcluded = unset, excluded = unset> = PartialApply<
    ExcludeFn,
    excluded extends unset
      ? [unset, unionOrExcluded]
      : [unionOrExcluded, excluded]
  >;

  interface ExcludeFn extends Fn {
    return: Std._Exclude<this["arg0"], this["arg1"]>;
  }

  type ExcludeByImpl<union, predicate extends Fn> = union extends any
    ? Call<predicate, union> extends true
      ? never
      : union
    : never;

  export interface ExcludeBy<predicate extends Fn> extends Fn {
    return: ExcludeByImpl<this["arg0"], predicate>;
  }

  type MapImpl<fn extends Fn, union> = union extends any
    ? Call<fn, union>
    : never;

  export type Map<fn extends Fn, u = unset> = PartialApply<MapFn, [fn, u]>;
  interface MapFn extends Fn {
    return: this["args"] extends [infer fn extends Fn, infer u]
      ? MapImpl<fn, u>
      : never;
  }

  /**
   * `Unions.Range` takes a `start` and an `end` integer and produces
   * a union containing integer ranging from `start` to `end`
   * @param start - the start of the range (included)
   * @param end - the end of the range (included)
   * @returns a union of integers
   * @example
   * ```ts
   * type T0 = Call<Unions.Range<3>, 7>; // 3 | 4 | 5 | 6 | 7
   * type T1 = Eval<Unions.Range<_, 10>, 5>; // 5 | 6 | 7 | 8 | 9 | 10
   * type T3 = Eval<Unions.Range< -2, 2>, 5>; // -2 | 1 | 0 | 1 | 2
   * type T4 = Eval<Unions.Range< -5, -2>, 5>; // -5 | -4 | -3 | -2
   * ```
   */
  export type Range<
    start extends number | _ | unset = unset,
    end extends number | _ | unset = unset
  > = PartialApply<RangeFn, [start, end]>;

  interface RangeFn extends Fn {
    return: this["args"] extends [
      infer start extends number,
      infer end extends number
    ]
      ? Eval<Tuples.Range<start, end>>[number]
      : never;
  }

  /**
   * `Unions.ToTuple` turns a union type into a tuple.
   * Warning: the ordering of the output tuple is not stable.
   * @param union - any union type.
   * @returns a tuple containing each member of this union type.
   * @example
   * ```ts
   * type T0 = Call<Unions.ToTuple, 1 | 2 | 3>; // [1, 2, 3]
   * ```
   */
  export type ToTuple<union = unset> = PartialApply<ToTupleFn, [union]>;

  interface ToTupleFn extends Fn {
    return: this["args"] extends [infer union, ...any]
      ? UnionToTuple<union>
      : never;
  }

  /**
   * `Unions.NonNullable` excludes null and undefined from the union type.
   * @param union - any union type.
   * @returns a union which is excluded by null and undefined.
   * @example
   * ```ts
   * type T0 = Call<Unions.NonNullable, "a" | 1 | null | undefined>; // 1 | "a"
   * type T1 = Pipe<"a" | 1 | null | undefined, [U.NonNullable]>; // 1 | "a"
   * type T2 = Eval<Unions.NonNullable<"a" | 1 | null | undefined>>; // 1 | "a"
   * ```
   */
  export type NonNullable<union = unset> = PartialApply<NonNullableFn, [union]>;

  interface NonNullableFn extends Fn {
    return: this["arg0"] extends infer union ? Std._NonNullable<union> : never;
  }
}
