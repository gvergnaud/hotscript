import { RemoveUnknownArrayConstraint } from "../../helpers";
import { Tuples } from "../tuples/Tuples";

export interface Fn {
  args: unknown[];
  output: unknown;
}

export type Apply<fn extends Fn, args> = (fn & {
  args: args;
})["output"];

export type Call<fn extends Fn, arg1> = (fn & {
  args: [arg1];
})["output"];

export type Eval<fn extends Fn> = (fn & {
  args: [];
})["output"];

export type Call2<fn extends Fn, arg1, arg2> = (fn & {
  args: [arg1, arg2];
})["output"];

export type Call3<fn extends Fn, arg1, arg2, arg3> = (fn & {
  args: [arg1, arg2, arg3];
})["output"];

export type Call4<fn extends Fn, arg1, arg2, arg3, arg4> = (fn & {
  args: [arg1, arg2, arg3, arg3];
})["output"];

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

/**
 * Misc
 */

export interface Extends<T> extends Fn {
  output: this["args"][0] extends T ? true : false;
}

export interface DoesNotExtends<T> extends Fn {
  output: this["args"][0] extends T ? false : true;
}

export type placeholder = "@hotscript/placeholder";

type MergeArgsRec<
  inputArgs extends any[],
  partialArgs extends any[],
  output extends any[] = []
> = partialArgs extends [infer partialFirst, ...infer partialRest]
  ? partialFirst extends placeholder
    ? inputArgs extends [infer inputFirst, ...infer inputRest]
      ? MergeArgsRec<inputRest, partialRest, [...output, inputFirst]>
      : [
          ...output,
          ...Call<Tuples.Filter<DoesNotExtends<placeholder>>, partialRest>
        ]
    : MergeArgsRec<inputArgs, partialRest, [...output, partialFirst]>
  : [...output, ...inputArgs];

export type MergeArgs<
  inputArgs extends any[],
  partialArgs extends any[]
> = MergeArgsRec<RemoveUnknownArrayConstraint<inputArgs>, partialArgs>;
