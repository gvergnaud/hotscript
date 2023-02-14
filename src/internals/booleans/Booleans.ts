import { Equal, Every, Some } from "../helpers";
import { Call, Fn, MergeArgs, placeholder } from "../core/Core";
import { Functions } from "../functions/Functions";

export namespace Booleans {
  type ExtendsImpl<a, b> = a extends b ? true : false;

  export interface Extends<a = placeholder, b = placeholder> extends Fn {
    output: MergeArgs<this["args"], [a, b]> extends [
      infer first,
      infer second,
      ...any
    ]
      ? ExtendsImpl<first, second>
      : never;
  }

  type NotImpl<a> = a extends true ? false : true;

  export interface Not<a = placeholder> extends Fn {
    output: MergeArgs<this["args"], [a]> extends [infer first, ...any]
      ? NotImpl<first>
      : never;
  }

  type EqualsImpl<a, b> = Equal<a, b>;

  export interface Equals<a = placeholder, b = placeholder> extends Fn {
    output: MergeArgs<this["args"], [a, b]> extends [
      infer first,
      infer second,
      ...any
    ]
      ? EqualsImpl<first, second>
      : never;
  }

  export type DoesNotExtends<T> = Functions.Compose<[Not, Extends<T>]>;

  export interface And<a = placeholder, b = placeholder> extends Fn {
    output: MergeArgs<this["args"], [a, b]> extends [
      infer first extends boolean,
      infer second extends boolean,
      ...any
    ]
      ? Every<[first, second]>
      : never;
  }

  export interface Or<a = placeholder, b = placeholder> extends Fn {
    output: MergeArgs<this["args"], [a, b]> extends [
      infer first extends boolean,
      infer second extends boolean,
      ...any
    ]
      ? Some<[first, second]>
      : never;
  }
}
