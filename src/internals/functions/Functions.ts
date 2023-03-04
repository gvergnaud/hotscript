import { Fn, PartialApply, unset, _ } from "../core/Core";

export namespace Functions {
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

  type ReturnTypeImpl<fn> = fn extends (...args: any[]) => infer ret
    ? ret
    : never;

  /**
   * ReturnTypes the return type of a function.
   *
   * @param fn - The function to extract the return type from.
   * @returns The return type of the function.
   *
   * @example
   * ```ts
   * type T0 = Call<ReturnType, (a: number, b: string) => number>; // number
   * type T1 = Eval<ReturnType<(a: number, b: string) => number>>; // number
   * ```
   */
  export interface ReturnType extends Fn {
    return: ReturnTypeImpl<this["arg0"]>;
  }
}
