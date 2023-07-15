import { _, unset } from "./Core";
import { ExcludePlaceholders, ExcludeUnset, MergeArgs } from "./impl/MergeArgs";
import * as NumberImpl from "../numbers/impl/numbers";

/**
 * Core
 */

export interface Fn<input extends any[] = unknown[]> {
  inputTypes: input;
  args: unknown;
  return: unknown;
}

interface Ap<fn extends Fn, partialArgs extends any[] = []> extends Fn {
  name: "Ap";

  inputTypes: fn["inputTypes"];

  argsArray: Extract<this["args"], any[]>;
  allArgs: [...partialArgs, ...this["argsArray"]];

  expectedArgsCount: fn["inputTypes"]["length"];
  providedArgsCount: ExcludePlaceholders<this["allArgs"]>["length"];

  return: NumberImpl.Compare<
    this["providedArgsCount"],
    this["expectedArgsCount"]
  > extends 1 | 0
    ? Apply<fn, MergeArgs<this["argsArray"], partialArgs>>
    : Ap<fn, this["allArgs"]>;
}

export type Apply<fn extends Fn, args extends any[]> = (fn & {
  args: args;
})["return"];

export type $<
  fn extends Fn,
  arg0 extends fn["inputTypes"][0] | _ | unset = unset,
  arg1 extends fn["inputTypes"][1] | _ | unset = unset,
  arg2 extends fn["inputTypes"][2] | _ | unset = unset,
  arg3 extends fn["inputTypes"][3] | _ | unset = unset
> = ((fn extends { name: "Ap" } ? fn : Ap<fn>) & {
  args: ExcludeUnset<[arg0, arg1, arg2, arg3]>;
})["return"];

type Args<fn extends Fn> = Extract<fn["args"], fn["inputTypes"]>;
type Arg0<fn extends Fn> = Extract<fn["args"], fn["inputTypes"]>[0];
type Arg1<fn extends Fn> = Extract<fn["args"], fn["inputTypes"]>[1];
type Arg2<fn extends Fn> = Extract<fn["args"], fn["inputTypes"]>[2];
type Arg3<fn extends Fn> = Extract<fn["args"], fn["inputTypes"]>[3];

type ExpectNumber<a extends number> = [a];
// arguments are typed internally:
interface TypedArgsTest extends Fn<[number, string]> {
  works: ExpectNumber<Arg0<this>>; // ✅
  fails: ExpectNumber<Arg1<this>>;
  //                  ~~~~~~~~~~  ❌
  return: true;
}

interface Div extends Fn<[number, number]> {
  return: NumberImpl.Div<Arg0<this>, Arg1<this>>;
}

/**
 * Full application
 */

type x = $<Div, 10, 2>; // 5
//   ^?
type y = $<Div, "10", 2>;
//              ~~~ ❌
type z = $<Div, 11, "2">;
//                  ~~~ ❌

/**
 * Partial application in order
 */

type Div1 = $<Div, 10>;
type Three = $<Div1, 2>;
//    ^?
type w = $<$<Div, 10>, "2">;
//                     ~~~ ❌

/**
 * Partial application different order order
 */
type DivBy2 = $<Div, _, 2>;
//   ^?
type q = $<DivBy2, 10>; // 5 ✅
//   ^?
type r = $<$<Div, _>, 10, 5>; // ✅
//   ^?

/**
 * Higher order
 */

interface Map extends Fn<[Fn, any[]]> {
  return: Args<this> extends [infer fn extends Fn, infer tuple]
    ? { [key in keyof tuple]: $<fn, tuple[key]> }
    : never;
}

type z2 = $<Map, $<Div, _, 2>, [2, 4, 6, 8, 10]>;
//   ^?

type ReduceImpl<fn extends Fn, acc, xs> = xs extends [
  infer first,
  ...infer rest
]
  ? ReduceImpl<fn, $<fn, acc, first>, rest>
  : acc;

interface Reduce extends Fn<[Fn, any, any[]]> {
  return: Args<this> extends [infer fn extends Fn, infer acc, infer tuple]
    ? ReduceImpl<fn, acc, tuple>
    : never;
}

interface Add extends Fn<[number, number]> {
  return: NumberImpl.Add<Arg0<this>, Arg1<this>>;
}

interface Mul extends Fn<[number, number]> {
  return: NumberImpl.Mul<Arg0<this>, Arg1<this>>;
}

type reduced1 = $<Reduce, Add, 0, [2, 4, 6, 8, 10]>;
//   ^?
type reduced2 = $<Reduce, Mul, 1, [2, 4, 6, 8, 10]>;
//   ^?

type reducedOops = $<Reduce, Mul, 1, "oops">;
//                                   ~~~~~~ ❌
