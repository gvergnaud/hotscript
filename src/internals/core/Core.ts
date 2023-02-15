import { RemoveUnknownArrayConstraint } from "../helpers";

export interface Fn {
  args: unknown;
  return: unknown;
}

export namespace Fn {
  export type args<F, Constraint extends unknown[] = unknown[]> = F extends {
    args: infer args extends Constraint;
  }
    ? RemoveUnknownArrayConstraint<args>
    : never;

  export type arg0<F, Constraint = unknown> = F extends {
    args: [infer arg extends Constraint, ...any];
  }
    ? arg
    : never;

  export type arg1<F, Constraint = unknown> = F extends {
    args: [any, infer arg extends Constraint, ...any];
  }
    ? arg
    : never;

  export type arg2<F, Constraint = unknown> = F extends {
    args: [any, any, infer arg extends Constraint, ...any];
  }
    ? arg
    : never;

  export type arg3<F, Constraint = unknown> = F extends {
    args: [any, any, any, infer arg extends Constraint, ...any];
  }
    ? arg
    : never;
}

export type unset = "@hotscript/unset";

export type _ = "@hotscript/placeholder";

export type Apply<fn extends Fn, args extends unknown[]> = (fn & {
  args: args;
})["return"];

export type Call<fn extends Fn, arg1> = (fn & {
  args: [arg1];
})["return"];

export type Eval<fn extends Fn> = (fn & {
  args: [];
})["return"];

export type Call2<fn extends Fn, arg1, arg2> = (fn & {
  args: [arg1, arg2];
})["return"];

export type Call3<fn extends Fn, arg1, arg2, arg3> = (fn & {
  args: [arg1, arg2, arg3];
})["return"];

export type Call4<fn extends Fn, arg1, arg2, arg3, arg4> = (fn & {
  args: [arg1, arg2, arg3, arg4];
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
