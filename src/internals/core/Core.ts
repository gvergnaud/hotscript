declare const rawArgs: unique symbol;
type rawArgs = typeof rawArgs;

/**
 * Base type for all functions
 * @description You need to extend this type to create a new function that can be used in the HOTScript library.
 * usually you will just convert some typescript utility time you already have to a hotscript function.
 * This way you can use the HOTScript library to create more complex functions.
 *
 * @example
 * ```ts
 * export interface CustomOmitFn extends Fn {
 *  return: this[args] extends [infer obj, infer keys] ? Omit<obj, keys> : never;
 * }
 * ```
 */
export interface Fn {
  [rawArgs]: unknown;
  args: this[rawArgs] extends infer args extends unknown[] ? args : never;
  arg0: this[rawArgs] extends [infer arg, ...any] ? arg : never;
  arg1: this[rawArgs] extends [any, infer arg, ...any] ? arg : never;
  arg2: this[rawArgs] extends [any, any, infer arg, ...any] ? arg : never;
  arg3: this[rawArgs] extends [any, any, any, infer arg, ...any] ? arg : never;
  return: unknown;
}

/**
 * A placeholder type that can be used to indicate that a parameter is not set.
 */
export type unset = "@hotscript/unset";

/**
 * A placeholder type that can be used to indicate that a parameter is to partially applied.
 */
export type _ = "@hotscript/placeholder";

/**
 * Call a HOTScript function with the given arguments.
 *
 * @param fn - The function to call.
 * @param args - The arguments to pass to the function.
 * @returns The result of the function.
 *
 * @example
 * ```ts
 * type T0 = Apply<Numbers.Add, [1, 2]>; // 3
 * ```
 */
export type Apply<fn extends Fn, args extends unknown[]> = (fn & {
  [rawArgs]: args;
})["return"];

/**
 * Call a HOTScript function with the only one argument.
 *
 * @param fn - The function to call.
 * @param arg1 - The argument to pass to the function.
 * @returns The result of the function.
 *
 * @example
 * ```ts
 * type T0 = Call<Numbers.Negate, 1>; // -1
 * ```
 */
export type Call<fn extends Fn, arg1> = (fn & {
  [rawArgs]: [arg1];
})["return"];

/**
 * Call a HOTScript function like a normal Utility type.
 *
 * @param fn - The function to call.
 *
 * @example
 * ```ts
 * type T0 = Eval<Numbers.Add<1, 2>>; // 3
 * type T1 = Eval<Numbers.Negate<1>>; // -1
 * ```
 */
export type Eval<fn extends Fn> = (fn & {
  [rawArgs]: [];
})["return"];

/**
 * Call a HOTScript function with the two arguments.
 *
 * @param fn - The function to call.
 * @param arg1 - The first argument to pass to the function.
 * @param arg2 - The second argument to pass to the function.
 * @returns The result of the function.
 *
 * @example
 * ```ts
 * type T0 = Call2<Numbers.Add, 1, 2>; // 3
 * ```
 */
export type Call2<fn extends Fn, arg1, arg2> = (fn & {
  [rawArgs]: [arg1, arg2];
})["return"];

/**
 * Call a HOTScript function with the three arguments.
 *
 * @param fn - The function to call.
 * @param arg1 - The first argument to pass to the function.
 * @param arg2 - The second argument to pass to the function.
 * @param arg3 - The third argument to pass to the function.
 * @returns The result of the function.
 */
export type Call3<fn extends Fn, arg1, arg2, arg3> = (fn & {
  [rawArgs]: [arg1, arg2, arg3];
})["return"];

/**
 * Call a HOTScript function with the four arguments.
 *
 * @param fn - The function to call.
 * @param arg1 - The first argument to pass to the function.
 * @param arg2 - The second argument to pass to the function.
 * @param arg3 - The third argument to pass to the function.
 * @param arg4 - The fourth argument to pass to the function.
 * @returns The result of the function.
 */
export type Call4<fn extends Fn, arg1, arg2, arg3, arg4> = (fn & {
  [rawArgs]: [arg1, arg2, arg3, arg4];
})["return"];

/**
 * Call a HOTScript function with the five arguments.
 *
 * @param fn - The function to call.
 * @param arg1 - The first argument to pass to the function.
 * @param arg2 - The second argument to pass to the function.
 * @param arg3 - The third argument to pass to the function.
 * @param arg4 - The fourth argument to pass to the function.
 * @param arg5 - The fifth argument to pass to the function.
 * @returns The result of the function.
 */
export type Call5<fn extends Fn, arg1, arg2, arg3, arg4, arg5> = (fn & {
  args: [arg1, arg2, arg3, arg4, arg5];
})["return"];
