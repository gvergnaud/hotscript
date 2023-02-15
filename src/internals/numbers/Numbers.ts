import { Fn, unset, _ } from "../core/Core";
import * as Impl from "./impl/numbers";
import { Functions } from "../functions/Functions";

export namespace Numbers {
  export type Add<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<AddFn, [n1, n2]>;

  interface AddFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Add<a, b>
      : never;
  }

  export type Sub<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<SubFn, n2 extends unset ? [unset, n1] : [n1, n2]>;

  interface SubFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Sub<a, b>
      : never;
  }

  // Multiply

  export type Mul<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<MulFn, [n1, n2]>;

  interface MulFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Mul<a, b>
      : never;
  }

  // Divide

  export type Div<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<DivFn, n2 extends unset ? [unset, n1] : [n1, n2]>;

  interface DivFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Div<a, b>
      : never;
  }

  // Modulo

  export type Mod<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<ModFn, [n1, n2]>;

  interface ModFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Mod<a, b>
      : never;
  }

  // Negate
  export type Negate<n extends number | bigint | _ | unset = unset> =
    Functions.PartialApply<NegateFn, [n]>;

  interface NegateFn extends Fn {
    return: Fn.args<this> extends [infer a extends number | bigint, ...any]
      ? Impl.Negate<a>
      : never;
  }

  // Absolute
  export type Abs<n extends number | bigint | _ | unset = unset> =
    Functions.PartialApply<AbsFn, [n]>;

  export interface AbsFn extends Fn {
    return: Fn.args<this> extends [infer a extends number | bigint, ...any]
      ? Impl.Abs<a>
      : never;
  }

  // Power
  export type Power<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    PowerFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface PowerFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Power<a, b>
      : never;
  }

  // Compare
  export type Compare<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    CompareFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface CompareFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Compare<a, b>
      : never;
  }

  // Equal
  export type Equal<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    EqualFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface EqualFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Equal<a, b>
      : never;
  }

  // NotEqual
  export type NotEqual<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    NotEqualFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface NotEqualFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.NotEqual<a, b>
      : never;
  }

  // LessThan
  export type LessThan<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    LessThanFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface LessThanFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.LessThan<a, b>
      : never;
  }

  // LessThanOrEqual
  export type LessThanOrEqual<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    LessThanOrEqualFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface LessThanOrEqualFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.LessThanOrEqual<a, b>
      : never;
  }

  // GreaterThan
  export type GreaterThan<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    GreaterThanFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface GreaterThanFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.GreaterThan<a, b>
      : never;
  }

  // GreaterThanOrEqual
  export type GreaterThanOrEqual<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    GreaterThanOrEqualFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface GreaterThanOrEqualFn extends Fn {
    return: Fn.args<this> extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.GreaterThanOrEqual<a, b>
      : never;
  }
}
