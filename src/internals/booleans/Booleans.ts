import { Equal, Every, Some } from "../helpers";
import { Fn, unset } from "../core/Core";

import { Functions } from "../functions/Functions";

export namespace Booleans {
  type ExtendsImpl<a, b> = [a] extends [b] ? true : false;

  interface ExtendsFn extends Fn {
    return: Fn.args<this> extends [infer first, infer second, ...any]
      ? ExtendsImpl<first, second>
      : never;
  }

  export type Extends<a = unset, b = unset> = Functions.PartialApply<
    ExtendsFn,
    b extends unset ? [unset, a] : [a, b]
  >;

  type NotImpl<a> = a extends true ? false : true;

  interface NotFn extends Fn {
    return: Fn.args<this> extends [infer first, ...any]
      ? NotImpl<first>
      : never;
  }

  export type Not<a = unset> = Functions.PartialApply<NotFn, [a]>;

  interface EqualsFn extends Fn {
    return: Fn.args<this> extends [infer a, infer b, ...any]
      ? Equal<a, b>
      : never;
  }

  export type Equals<a = unset, b = unset> = Functions.PartialApply<
    EqualsFn,
    [a, b]
  >;

  export type NotEqual<a = unset, b = unset> = Functions.Compose<
    [Not, Functions.PartialApply<EqualsFn, [a, b]>]
  >;

  export type DoesNotExtend<a = unset, b = unset> = Functions.Compose<
    [Not, Functions.PartialApply<ExtendsFn, [a, b]>]
  >;

  interface AndFn extends Fn {
    return: Fn.args<this> extends [
      infer first extends boolean,
      infer second extends boolean,
      ...any
    ]
      ? Every<[first, second]>
      : never;
  }

  export type And<a = unset, b = unset> = Functions.PartialApply<AndFn, [a, b]>;

  interface OrFn extends Fn {
    return: Fn.args<this> extends [
      infer first extends boolean,
      infer second extends boolean,
      ...any
    ]
      ? Some<[first, second]>
      : never;
  }

  export type Or<a = unset, b = unset> = Functions.PartialApply<OrFn, [a, b]>;
}
