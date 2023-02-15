import { Call, Fn } from "../core/Core";
import { Std } from "../std/Std";

export namespace Unions {
  export interface Extract<key> extends Fn {
    return: Std._Extract<Fn.arg0<this>, key>;
  }

  type ExtractByImpl<union, predicate extends Fn> = union extends any
    ? Call<predicate, union> extends true
      ? union
      : never
    : never;

  export interface ExtractBy<predicate extends Fn> extends Fn {
    return: ExtractByImpl<Fn.arg0<this>, predicate>;
  }

  export interface Exclude<key> extends Fn {
    return: Std._Exclude<Fn.arg0<this>, key>;
  }

  type ExcludeByImpl<union, predicate extends Fn> = union extends any
    ? Call<predicate, union> extends true
      ? never
      : union
    : never;

  export interface ExcludeBy<predicate extends Fn> extends Fn {
    return: ExcludeByImpl<Fn.arg0<this>, predicate>;
  }

  type MapImpl<union, fn extends Fn> = union extends any
    ? Call<fn, union>
    : never;

  export interface Map<fn extends Fn> extends Fn {
    return: MapImpl<Fn.arg0<this>, fn>;
  }
}
