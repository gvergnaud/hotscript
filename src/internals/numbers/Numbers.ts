import { Fn, MergeArgs, placeholder, unset } from "../core/Core";
import * as Impl from "./impl/numbers";

export namespace Numbers {
  export interface Add<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Add<a, b>
      : never;
  }

  export interface Sub<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Sub<a, b>
      : never;
  }

  // Multiply
  export interface Mul<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Mul<a, b>
      : never;
  }

  // Divide
  export interface Div<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Div<a, b>
      : never;
  }

  // Modulo
  export interface Mod<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Mod<a, b>
      : never;
  }

  // Negate
  export interface Negate<
    n extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n]> extends [
      infer a extends number | bigint,
      ...any
    ]
      ? Impl.Negate<a>
      : never;
  }

  // Absolute
  export interface Abs<n extends number | bigint | placeholder | unset = unset>
    extends Fn {
    output: MergeArgs<this["args"], [n]> extends [
      infer a extends number | bigint,
      ...any
    ]
      ? Impl.Abs<a>
      : never;
  }

  // Power
  export interface Power<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Power<a, b>
      : never;
  }

  // Compare
  export interface Compare<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Compare<a, b>
      : never;
  }

  // Equal
  export interface Equal<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Equal<a, b>
      : never;
  }

  // NotEqual
  export interface NotEqual<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.NotEqual<a, b>
      : never;
  }

  // LessThan
  export interface LessThan<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.LessThan<a, b>
      : never;
  }

  // LessThanOrEqual
  export interface LessThanOrEqual<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.LessThanOrEqual<a, b>
      : never;
  }

  // GreaterThan
  export interface GreaterThan<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.GreaterThan<a, b>
      : never;
  }

  // GreaterThanOrEqual
  export interface GreaterThanOrEqual<
    n1 extends number | bigint | placeholder | unset = unset,
    n2 extends number | bigint | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.GreaterThanOrEqual<a, b>
      : never;
  }
}
