import { MergeArgs } from "./impl/MergeArgs";
import { Head } from "../helpers";
import { Objects } from "../objects/Objects";

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

export interface arg<Index extends number, Constraint = unknown> extends Fn {
  return: this["args"][Index] extends infer arg extends Constraint
    ? arg
    : never;
}

export interface args<Constraint extends unknown[] = unknown[]> extends Fn {
  return: this["args"] extends infer args extends Constraint ? args : never;
}

export type arg0<Constraint = unknown> = arg<0, Constraint>;
export type arg1<Constraint = unknown> = arg<1, Constraint>;
export type arg2<Constraint = unknown> = arg<2, Constraint>;
export type arg3<Constraint = unknown> = arg<3, Constraint>;

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
export type Pipe<acc, xs extends Fn[]> = xs extends [
  infer first extends Fn,
  ...infer rest extends Fn[]
]
  ? Pipe<Call<first, acc>, rest>
  : acc;

/**
 * Pipe a value through a list of functions.
 * @description This is the same as the pipe operator in other languages.
 * Evaluates the last function with the initial value, then passes the result to the second to last function, and so on.
 *
 * @param xs - The list of functions to pipe the value through.
 * @param acc - The initial value to pass to the last function.
 * @returns The result of the first function.
 *
 * @example
 * ```ts
 * type T0 = PipeRight<[Numbers.Add<1>, Numbers.Negate], 1>; // 0
 */
export type PipeRight<xs extends Fn[], acc> = xs extends [
  ...infer rest extends Fn[],
  infer last extends Fn
]
  ? PipeRight<rest, Call<last, acc>>
  : acc;

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

/**
 * Composes a list of functions into a single function that passes the result of each function to the next.
 * Executes the functions from right to left.
 *
 * @param fns - The list of functions to compose.
 * @returns The composed function.
 *
 * @example
 * ```ts
 * type T0 = Call<Compose< [T.Join<'-'>,S.Split<'.'> ]>, 'a.b.c'>; // 'a-b-c'
 * ```
 */
export interface Compose<fns extends Fn[]> extends Fn {
  return: ComposeImpl<fns, this["args"]>;
}

type ComposeImpl<fns extends Fn[], args extends any[]> = fns extends [
  ...infer rest extends Fn[],
  infer last extends Fn
]
  ? ComposeImpl<rest, [Apply<last, args>]>
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
export interface ComposeLeft<fns extends Fn[]> extends Fn {
  return: ComposeLeftImpl<fns, this["args"]>;
}

type ComposeLeftImpl<fns extends Fn[], args extends any[]> = fns extends [
  infer first extends Fn,
  ...infer rest extends Fn[]
]
  ? ComposeLeftImpl<rest, [Apply<first, args>]>
  : Head<args>;

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
    ApplyPartialArgFunctions<this["args"], partialArgs>
  > extends infer args extends unknown[]
    ? Apply<fn, args>
    : never;
}

export type ApplyPartialArgFunctions<
  args extends unknown[],
  partialArgs extends unknown[],
  output extends any[] = []
> = partialArgs extends [infer first, ...infer rest]
  ? ApplyPartialArgFunctions<
      args,
      rest,
      [...output, first extends ShouldApply<infer fn> ? Apply<fn, args> : first]
    >
  : output;

export interface ShouldApply<fn extends Fn> {
  shouldApply: true;
  fn: fn;
}
