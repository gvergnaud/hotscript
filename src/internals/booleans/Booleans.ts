import { Equal, Every, Some } from "../helpers";
import { Fn, MergeArgs } from "../core/Core";
import { Functions } from "../functions/Functions";

export namespace Booleans {
  type ExtendsImpl<a, b> = [a] extends [b] ? true : false;

  export interface Extends<a = never, b = never> extends Fn {
    output: MergeArgs<this["args"], [a, b]> extends [
      infer first,
      infer second,
      ...any
    ]
      ? ExtendsImpl<first, second>
      : never;
  }

  type NotImpl<a> = a extends true ? false : true;

  export interface Not<a = never> extends Fn {
    output: MergeArgs<this["args"], [a]> extends [infer first, ...any]
      ? NotImpl<first>
      : never;
  }

  type EqualsImpl<a, b> = Equal<a, b>;

  export interface Equals<a = never, b = never> extends Fn {
    output: MergeArgs<this["args"], [a, b]> extends [
      infer first,
      infer second,
      ...any
    ]
      ? EqualsImpl<first, second>
      : never;
  }

  export type DoesNotExtends<T> = Functions.Compose<[Not, Extends<T>]>;

  export interface And<a = never, b = never> extends Fn {
    output: MergeArgs<this["args"], [a, b]> extends [
      infer first extends boolean,
      infer second extends boolean,
      ...any
    ]
      ? Every<[first, second]>
      : never;
  }

  export interface Or<a = never, b = never> extends Fn {
    output: MergeArgs<this["args"], [a, b]> extends [
      infer first extends boolean,
      infer second extends boolean,
      ...any
    ]
      ? Some<[first, second]>
      : never;
  }
}
