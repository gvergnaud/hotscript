import { Call, Fn } from "../core/Core";
import { Std } from "../std/Std";

export namespace Unions {
  export interface Extract<key> extends Fn {
    output: Std._Extract<this["args"][0], key>;
  }

  type ExtractByImpl<union, predicate extends Fn> = union extends any
    ? Call<predicate, union> extends true
      ? union
      : never
    : never;

  export interface ExtractBy<predicate extends Fn> extends Fn {
    output: ExtractByImpl<this["args"][0], predicate>;
  }

  export interface Exclude<key> extends Fn {
    output: Std._Exclude<this["args"][0], key>;
  }

  type ExcludeByImpl<union, predicate extends Fn> = union extends any
    ? Call<predicate, union> extends true
      ? never
      : union
    : never;

  export interface ExcludeBy<predicate extends Fn> extends Fn {
    output: ExcludeByImpl<this["args"][0], predicate>;
  }

  type MapImpl<union, fn extends Fn> = union extends any
    ? Call<fn, union>
    : never;

  export interface Map<fn extends Fn> extends Fn {
    output: MapImpl<this["args"][0], fn>;
  }
}
