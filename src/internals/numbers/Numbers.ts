import { Eval, Fn, unset, _ } from "../core/Core";
import * as Impl from "./impl/numbers";
import { Functions } from "../functions/Functions";

export namespace Numbers {
  /**
   * Add two numbers together
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number
   * @returns the sum of the two numbers
   * @example
   * ```ts
   * type T0 = Eval<Numbers.Add<1, 2>>; // 3
   * type T1 = Eval<Numbers.Add<999999999999999999999999999n, 2>>; // 1000000000000000000000000001n
   * ```
   */
  export type Add<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<AddFn, [n1, n2]>;

  interface AddFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Add<a, b>
      : never;
  }

  /**
   * Subtract two numbers
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number to subtract from the first
   * @returns the difference of the two numbers
   * @example
   * ```ts
   * type T0 = Eval<Numbers.Sub<1, 2>>; // -1
   * type T1 = Eval<Numbers.Sub<1000000000000000000000000001n, 2>>; // 999999999999999999999999999n
   * ```
   */
  export type Sub<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<SubFn, n2 extends unset ? [unset, n1] : [n1, n2]>;

  interface SubFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Sub<a, b>
      : never;
  }

  /**
   * Multiply two numbers together
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number
   * @returns the product of the two numbers
   * @example
   * ```ts
   * type T0 = Eval<Numbers.Mul<99, 3>>; // 297
   * type T1 = Eval<Numbers.Mul<999999999999999999999999999n, 2>>; // 1999999999999999999999999998n
   * ```
   */
  export type Mul<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<MulFn, [n1, n2]>;

  interface MulFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Mul<a, b>
      : never;
  }

  /**
   * Divide two numbers
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number to divide the first by
   * @returns the quotient of the two numbers
   * @example
   * ```ts
   * type T0 = Eval<Numbers.Div<99, 3>>; // 33
   * type T1 = Eval<Numbers.Div<999999999999999999999999999n, 4>>; // 249999999999999999999999999n
   * ```
   */
  export type Div<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<DivFn, n2 extends unset ? [unset, n1] : [n1, n2]>;

  interface DivFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Div<a, b>
      : never;
  }

  /**
   * Modulo of two numbers
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number to divide the first by
   * @returns the remainder of the two numbers
   * @example
   * ```ts
   * type T0 = Eval<Numbers.Mod<100, 3>>; // 1
   * type T1 = Eval<Numbers.Mod<999999999999999999999999999n, 4>>; // 3n
   * ```
   */
  export type Mod<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<ModFn, [n1, n2]>;

  interface ModFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Mod<a, b>
      : never;
  }

  /**
   * Negate a number
   * @description the number can be of different types (bigint or number) and handle really large numbers
   * @param n - the number to negate
   * @returns the negated number
   * @example
   * ```ts
   * type T0 = Eval<Numbers.Negate<1>>; // -1
   * type T1 = Eval<Numbers.Negate<999999999999999999999999999n>>; // -999999999999999999999999999n
   * ```
   */
  export type Negate<n extends number | bigint | _ | unset = unset> =
    Functions.PartialApply<NegateFn, [n]>;

  interface NegateFn extends Fn {
    return: this["args"] extends [infer a extends number | bigint, ...any]
      ? Impl.Negate<a>
      : never;
  }

  /**
   * Absolute value of a number
   * @description the number can be of different types (bigint or number) and handle really large numbers
   * @param n - the number to get the absolute value of
   * @returns the absolute value of the number
   * @example
   * ```ts
   * type T0 = Eval<Numbers.Abs<-1>>; // 1
   * type T1 = Eval<Numbers.Abs<999999999999999999999999999n>>; // 999999999999999999999999999n
   * ```
   */
  export type Abs<n extends number | bigint | _ | unset = unset> =
    Functions.PartialApply<AbsFn, [n]>;

  export interface AbsFn extends Fn {
    return: this["args"] extends [infer a extends number | bigint, ...any]
      ? Impl.Abs<a>
      : never;
  }

  /**
   * Power of a number
   * @description the number can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the base number
   * @param n2 - the exponent
   * @returns the power of the two numbers
   * @example
   * ```ts
   * type T0 = Eval<Numbers.Power<2, 128>>; // 340282366920938463463374607431768211456
   * ```
   */
  export type Power<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    PowerFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface PowerFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Power<a, b>
      : never;
  }

  /**
   * Compare two numbers
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number to compare the first to
   * @returns -1 if n1 < n2, 0 if n1 === n2, 1 if n1 > n2
   * @example
   * ```ts
   * type T0 = Eval<Numbers.Compare<1, 2>>; // -1
   * type T1 = Eval<Numbers.Compare<999999999999999999999999999n, 4>>; // 1
   * type T2 = Eval<Numbers.Compare<999999999999999999999999999n, 999999999999999999999999999n>>; // 0
   * ```
   */
  export type Compare<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    CompareFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface CompareFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Compare<a, b>
      : never;
  }

  /**
   * Check if two numbers are equal
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number to compare the first to
   * @returns true if n1 === n2, false otherwise
   * @example
   * ```ts
   * type T0 = Eval<Numbers.Equal<1, 2>>; // false
   * type T1 = Eval<Numbers.Equal<2, 2>>; // true
   * ```
   */
  export type Equal<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    EqualFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface EqualFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.Equal<a, b>
      : never;
  }

  /**
   * Check if two numbers are not equal
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number to compare the first to
   * @returns true if n1 !== n2, false otherwise
   * @example
   * ```ts
   * type T0 = Eval<Numbers.NotEqual<1, 2>>; // true
   * type T1 = Eval<Numbers.NotEqual<2, 2>>; // false
   * ```
   */
  export type NotEqual<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    NotEqualFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface NotEqualFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.NotEqual<a, b>
      : never;
  }

  /**
   * Check if a number is less than another
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number to compare the first to
   * @returns true if n1 < n2, false otherwise
   * @example
   * ```ts
   * type T0 = Eval<Numbers.LessThan<1, 2>>; // true
   * type T1 = Eval<Numbers.LessThan<2, 2>>; // false
   * type T2 = Eval<Numbers.LessThan<3, 2>>; // false
   * ```
   */
  export type LessThan<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    LessThanFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface LessThanFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.LessThan<a, b>
      : never;
  }

  /**
   * Check if a number is less than or equal to another
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number to compare the first to
   * @returns true if n1 <= n2, false otherwise
   * @example
   * ```ts
   * type T0 = Eval<Numbers.LessThanOrEqual<1, 2>>; // true
   * type T1 = Eval<Numbers.LessThanOrEqual<2, 2>>; // true
   * type T2 = Eval<Numbers.LessThanOrEqual<3, 2>>; // false
   * ```
   */
  export type LessThanOrEqual<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    LessThanOrEqualFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface LessThanOrEqualFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.LessThanOrEqual<a, b>
      : never;
  }

  /**
   * Check if a number is greater than another
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number to compare the first to
   * @returns true if n1 > n2, false otherwise
   * @example
   * ```ts
   * type T0 = Eval<Numbers.GreaterThan<1, 2>>; // false
   * type T1 = Eval<Numbers.GreaterThan<2, 2>>; // false
   * type T2 = Eval<Numbers.GreaterThan<3, 2>>; // true
   * ```
   */
  export type GreaterThan<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    GreaterThanFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface GreaterThanFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.GreaterThan<a, b>
      : never;
  }

  /**
   * Check if a number is greater than or equal to another
   * @description the two numbers can be of different types (bigint or number) and handle really large numbers
   * @param n1 - the first number
   * @param n2 - the second number to compare the first to
   * @returns true if n1 >= n2, false otherwise
   * @example
   * ```ts
   * type T0 = Eval<Numbers.GreaterThanOrEqual<1, 2>>; // false
   * type T1 = Eval<Numbers.GreaterThanOrEqual<2, 2>>; // true
   * type T2 = Eval<Numbers.GreaterThanOrEqual<3, 2>>; // true
   * ```
   */
  export type GreaterThanOrEqual<
    n1 extends number | bigint | _ | unset = unset,
    n2 extends number | bigint | _ | unset = unset
  > = Functions.PartialApply<
    GreaterThanOrEqualFn,
    n2 extends unset ? [unset, n1] : [n1, n2]
  >;

  interface GreaterThanOrEqualFn extends Fn {
    return: this["args"] extends [
      infer a extends number | bigint,
      infer b extends number | bigint,
      ...any
    ]
      ? Impl.GreaterThanOrEqual<a, b>
      : never;
  }
}
