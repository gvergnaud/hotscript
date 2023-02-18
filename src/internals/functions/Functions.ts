import { Apply, Eval, Fn, unset, _ } from "../core/Core";
import { MergeArgs } from "./impl/MergeArgs";

export namespace Functions {
  /**
   * Returns the the function's first argument.
   *
   * @param arg0 - The function to extract the first argument from.
   * @returns The first argument of the function.
   */
  export interface Identity extends Fn {
    return: this["arg0"];
  }

  /**
   * A function that returns it's generic parameter.
   *
   * @param T - The type to return.
   * @returns The type `T`.
   */
  export interface Constant<T> extends Fn {
    return: T;
  }

  type ParametersImpl<fn> = fn extends (...args: infer args) => any
    ? args
    : never;

  export interface ParametersFn extends Fn {
    return: ParametersImpl<this["arg0"]>;
  }

  /**
   * Returns the parameters of a function.
   *
   * @param fn - The function to extract the parameters from.
   * @returns The parameters of the function.
   *
   * @example
   * ```ts
   * type T0 = Call<Parameters, (a: number, b: string) => void>; // [a: number,b: string]
   * ```
   */
  export type Parameters<
    fn extends ((...args: any[]) => any) | _ | unset = unset
  > = PartialApply<ParametersFn, [fn]>;

  export interface ParameterFn extends Fn {
    return: ParametersImpl<this["arg0"]>[this["arg1"]];
  }
  /**
   * Returns the Nth parameter of a function.
   *
   * @param fn - The function to extract the parameter from.
   * @param N - The index of the parameter to return.
   * @returns The Nth parameter of the function.
   *
   * @example
   * ```ts
   * type T0 = Call<Parameter<1>, (a: number, b: string) => void>; // number
   * type T1 = Call2<Parameter, (a: number, b: string) => void, 1>; // string
   * type T2 = Eval<Parameter<(a: number, b: string) => void, 0>>; // number
   */
  export type Parameter<
    N extends number | _ | unset = unset,
    fn extends ((...args: any[]) => any) | _ | unset = unset
  > = PartialApply<ParameterFn, [fn, N]>;

  type ReturnImpl<fn> = fn extends (...args: any[]) => infer ret ? ret : never;

  /**
   * Returns the return type of a function.
   *
   * @param fn - The function to extract the return type from.
   * @returns The return type of the function.
   *
   * @example
   * ```ts
   * type T0 = Call<Return, (a: number, b: string) => number>; // number
   * type T1 = Eval<Return<(a: number, b: string) => number>>; // number
   * ```
   */
  export interface Return extends Fn {
    return: ReturnImpl<this["arg0"]>;
  }

  type Head<xs> = xs extends [infer first, ...any] ? first : never;

  type ComposeImpl<fns extends Fn[], args extends any[]> = fns extends [
    ...infer rest extends Fn[],
    infer last extends Fn
  ]
    ? ComposeImpl<rest, [Apply<last, args>]>
    : Head<args>;

  /**
   * Composes a list of functions into a single function that passes the result of each function to the next.
   * Executes the functions from right to left.
   *
   * @param fns - The list of functions to compose.
   * @returns The composed function.
   *
   * @example
   * ```ts
   * type T0 = Call<Compose<T.Join<'-'>, S.Split<'.'>>, 'a.b.c'>; // 'a-b-c'
   * ```
   */
  export type Compose<
    fn0 extends Fn | unset | _ = unset,
    fn1 extends Fn | unset | _ = unset,
    fn2 extends Fn | unset | _ = unset,
    fn3 extends Fn | unset | _ = unset,
    fn4 extends Fn | unset | _ = unset,
    fn5 extends Fn | unset | _ = unset,
    fn6 extends Fn | unset | _ = unset,
    fn7 extends Fn | unset | _ = unset,
    fn8 extends Fn | unset | _ = unset,
    fn9 extends Fn | unset | _ = unset,
    value = unset
  > = PartialApply<
    ComposeFn,
    [fn0, fn1, fn2, fn3, fn4, fn5, fn6, fn7, fn8, fn9, value]
  >;
  interface ComposeFn extends Fn {
    return: this["args"] extends [...infer fns extends Fn[], infer value]
      ? ComposeImpl<fns, [value]>
      : never;
  }

  type ComposeLeftImpl<fns extends Fn[], args extends any[]> = fns extends [
    infer first extends Fn,
    ...infer rest extends Fn[]
  ]
    ? ComposeLeftImpl<rest, [Apply<first, args>]>
    : Head<args>;

  /**
   * Composes a list of functions into a single function that passes the result of each function to the next.
   * Executes the functions from left to right.
   *
   * @param fns - The list of functions to compose.
   * @returns The composed function.
   *
   * @example
   * ```ts
   * type T0 = Call<ComposeLeft< [S.Split<'.'>,T.Join<'-'> ]>, 'a.b.c'>; // 'a-b-c'
   * ```
   */
  export type ComposeLeft<
    fn0 extends Fn | unset | _ = unset,
    fn1 extends Fn | unset | _ = unset,
    fn2 extends Fn | unset | _ = unset,
    fn3 extends Fn | unset | _ = unset,
    fn4 extends Fn | unset | _ = unset,
    fn5 extends Fn | unset | _ = unset,
    fn6 extends Fn | unset | _ = unset,
    fn7 extends Fn | unset | _ = unset,
    fn8 extends Fn | unset | _ = unset,
    fn9 extends Fn | unset | _ = unset,
    value = unset
  > = PartialApply<
    ComposeLeftFn,
    [fn0, fn1, fn2, fn3, fn4, fn5, fn6, fn7, fn8, fn9, value]
  >;

  interface ComposeLeftFn extends Fn {
    return: this["args"] extends [...infer fns extends Fn[], infer value]
      ? ComposeLeftImpl<fns, [value]>
      : never;
  }

  /**
   * Partially applies the passed arguments to the function and returns a new function.
   * The new function will have the applied arguments passed to the original function
   *
   * @param fn - The function to partially apply.
   * @param partialArgs - The arguments to partially apply.
   * @returns The partially applied function.
   *
   * @example
   * ```ts
   * type T0 = Call<PartialApply<Parameter, [_, (a: number, b: string) => void]>, 1> ; // [b: string]
   */
  export interface PartialApply<fn extends Fn, partialArgs extends unknown[]>
    extends Fn {
    return: MergeArgs<
      this["args"],
      partialArgs
    > extends infer args extends unknown[]
      ? Apply<fn, args>
      : never;
  }
}

/**
 * Pipe a value through a list of functions.
 * @description This is the same as the pipe operator in other languages.
 * Evaluates the first function with the initial value, then passes the result to the second function, and so on.
 *
 * @param acc - The initial value to pass to the first function.
 * @param xs - The list of functions to pipe the value through.
 * @returns The result of the last function.
 *
 * @example
 * ```ts
 * type T0 = Pipe<1, [Numbers.Add<1>, Numbers.Negate]>; // -2
 * ```
 */
export type Pipe<
  input,
  fn0 extends Fn | unset | _ = unset,
  fn1 extends Fn | unset | _ = unset,
  fn2 extends Fn | unset | _ = unset,
  fn3 extends Fn | unset | _ = unset,
  fn4 extends Fn | unset | _ = unset,
  fn5 extends Fn | unset | _ = unset,
  fn6 extends Fn | unset | _ = unset,
  fn7 extends Fn | unset | _ = unset,
  fn8 extends Fn | unset | _ = unset,
  fn9 extends Fn | unset | _ = unset
> = Eval<
  Functions.ComposeLeft<fn0, fn1, fn2, fn3, fn4, fn5, fn6, fn7, fn8, fn9, input>
>;
