import { Call, Fn, unset } from "../core/Core";
import { Functions } from "../functions/Functions";
import { Std } from "../std/Std";

export namespace Unions {
  export type Extract<
    unionOrExtracted = unset,
    extracted = unset
  > = Functions.PartialApply<
    ExtractFn,
    extracted extends unset
      ? [unset, unionOrExtracted]
      : [unionOrExtracted, extracted]
  >;

  interface ExtractFn extends Fn {
    return: Std._Extract<Fn.arg0<this>, Fn.arg1<this>>;
  }

  type ExtractByImpl<union, predicate extends Fn> = union extends any
    ? Call<predicate, union> extends true
      ? union
      : never
    : never;

  export interface ExtractBy<predicate extends Fn> extends Fn {
    return: ExtractByImpl<Fn.arg0<this>, predicate>;
  }

  export type Exclude<
    unionOrExcluded = unset,
    excluded = unset
  > = Functions.PartialApply<
    ExcludeFn,
    excluded extends unset
      ? [unset, unionOrExcluded]
      : [unionOrExcluded, excluded]
  >;

  interface ExcludeFn extends Fn {
    return: Std._Exclude<Fn.arg0<this>, Fn.arg1<this>>;
  }

  type ExcludeByImpl<union, predicate extends Fn> = union extends any
    ? Call<predicate, union> extends true
      ? never
      : union
    : never;

  export interface ExcludeBy<predicate extends Fn> extends Fn {
    return: ExcludeByImpl<Fn.arg0<this>, predicate>;
  }

  type MapImpl<fn extends Fn, union> = union extends any
    ? Call<fn, union>
    : never;

  export type Map<fn extends Fn, u = unset> = Functions.PartialApply<
    MapFn,
    [fn, u]
  >;
  interface MapFn extends Fn {
    return: MapImpl<Fn.arg0<this, Fn>, Fn.arg1<this>>;
  }
}
