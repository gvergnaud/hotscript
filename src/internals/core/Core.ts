declare const rawArgs: unique symbol;
type rawArgs = typeof rawArgs;

export interface Fn {
  [rawArgs]: unknown;
  args: this[rawArgs] extends infer args extends unknown[] ? args : never;
  arg0: this[rawArgs] extends [infer arg, ...any] ? arg : never;
  arg1: this[rawArgs] extends [any, infer arg, ...any] ? arg : never;
  arg2: this[rawArgs] extends [any, any, infer arg, ...any] ? arg : never;
  arg3: this[rawArgs] extends [any, any, any, infer arg, ...any] ? arg : never;
  return: unknown;
}

export type unset = "@hotscript/unset";

export type _ = "@hotscript/placeholder";

export type Apply<fn extends Fn, args extends unknown[]> = (fn & {
  [rawArgs]: args;
})["return"];

export type Call<fn extends Fn, arg1> = (fn & {
  [rawArgs]: [arg1];
})["return"];

export type Eval<fn extends Fn> = (fn & {
  [rawArgs]: [];
})["return"];

export type Call2<fn extends Fn, arg1, arg2> = (fn & {
  [rawArgs]: [arg1, arg2];
})["return"];

export type Call3<fn extends Fn, arg1, arg2, arg3> = (fn & {
  [rawArgs]: [arg1, arg2, arg3];
})["return"];

export type Call4<fn extends Fn, arg1, arg2, arg3, arg4> = (fn & {
  [rawArgs]: [arg1, arg2, arg3, arg4];
})["return"];

export type Call5<fn extends Fn, arg1, arg2, arg3, arg4, arg5> = (fn & {
  args: [arg1, arg2, arg3, arg4, arg5];
})["return"];

export type Pipe<acc, xs extends Fn[]> = xs extends [
  infer first extends Fn,
  ...infer rest extends Fn[]
]
  ? Pipe<Call<first, acc>, rest>
  : acc;

export type PipeRight<xs extends Fn[], acc> = xs extends [
  ...infer rest extends Fn[],
  infer last extends Fn
]
  ? PipeRight<rest, Call<last, acc>>
  : acc;
