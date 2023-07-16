import { _, unset } from "./Core";
import { ExcludePlaceholders, ExcludeUnset, MergeArgs } from "./impl/MergeArgs";
import * as NumberImpl from "../numbers/impl/numbers";
import * as StringImpl from "../strings/impl/strings";
import { Iterator } from "../helpers";

/**
 * Core
 */

export interface Fn<input extends any[] = unknown[], output = unknown> {
  inputTypes: input;
  outputType: output;
  args: unknown;
  return: unknown;
}

type Drop<
  xs extends readonly any[],
  n extends number,
  dropped extends readonly any[] = []
> = n extends dropped["length"]
  ? xs
  : xs extends readonly [infer first, ...infer tail]
  ? Drop<tail, n, [...dropped, first]>
  : [];

interface Ap<fn extends Fn, partialArgs extends any[] = []> extends Fn {
  name: "Ap";

  argsArray: Extract<this["args"], any[]>;
  allArgs: [...partialArgs, ...this["argsArray"]];

  expectedArgsCount: fn["inputTypes"]["length"];
  providedArgsCount: ExcludePlaceholders<this["allArgs"]>["length"];

  inputTypes: Drop<
    fn["inputTypes"],
    ExcludePlaceholders<partialArgs>["length"]
  >;

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
  arg0 extends fn["inputTypes"][0] | _ = unset,
  arg1 extends fn["inputTypes"][1] | _ = unset,
  arg2 extends fn["inputTypes"][2] | _ = unset,
  arg3 extends fn["inputTypes"][3] | _ = unset
> = Extract<
  ((fn extends { name: "Ap" } ? fn : Ap<fn>) & {
    args: ExcludeUnset<[arg0, arg1, arg2, arg3]>;
  })["return"],
  fn["outputType"]
>;

type Args<fn extends Fn> = Extract<fn["args"], fn["inputTypes"]>;
type Arg0<fn extends Fn> = Extract<fn["args"], fn["inputTypes"]>[0];
type Arg1<fn extends Fn> = Extract<fn["args"], fn["inputTypes"]>[1];
type Arg2<fn extends Fn> = Extract<fn["args"], fn["inputTypes"]>[2];
type Arg3<fn extends Fn> = Extract<fn["args"], fn["inputTypes"]>[3];

type ExpectNumber<a extends number> = [a];
// arguments are typed internally:
interface TakeNumAndStr extends Fn<[number, string], boolean> {
  works: ExpectNumber<Arg0<this>>; // ✅
  fails: ExpectNumber<Arg1<this>>;
  //                  ~~~~~~~~~~  ❌
  return: true;
}

interface Div extends Fn<[number, number], number> {
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
 * Partial application different order
 */
type DivBy2 = $<Div, _, 2>;
//   ^?
type q = $<DivBy2, 10>; // 5 ✅
//   ^?
type r = $<$<Div, _>, 10, 5>; // ✅
//   ^?

type TakeStr = $<TakeNumAndStr, 10>;
//   ^? Ap<TakeNumAndStr, [10]>
type e = $<TakeStr, 10>;
//                  ~~ ❌

type TakeNum = $<TakeNumAndStr, _, "10">;
//   ^?Ap<TakeNumAndStr, [_, "10"]>
type s = $<TakeNum, 10>;
//                  ~~ FIXME

/**
 * Higher order
 */

interface Map extends Fn<[Fn, any[]]> {
  return: Args<this> extends [infer fn extends Fn, infer tuple]
    ? { [key in keyof tuple]: $<fn, tuple[key]> }
    : never;
}

type z2 = $<Map, $<Div, _, 2>, [2, 4, 6, 8, 10]>;
//   ^? [1, 2, 3, 4, 5]

interface Add extends Fn<[number, number], number> {
  return: NumberImpl.Add<Arg0<this>, Arg1<this>>;
}

interface Mul extends Fn<[number, number], number> {
  return: NumberImpl.Mul<Arg0<this>, Arg1<this>>;
}

type ReduceImpl<fn extends Fn, acc, xs> = xs extends [
  infer first,
  ...infer rest
]
  ? ReduceImpl<fn, $<fn, acc, first>, rest>
  : acc;

interface Reduce<A = any, B = any> extends Fn<[Fn<[B, A], B>, B, A[]], B> {
  return: Args<this> extends [infer fn extends Fn, infer acc, infer tuple]
    ? ReduceImpl<fn, acc, tuple>
    : never;
}

type reduced1 = $<Reduce<number, number>, Add, 0, [2, 4, 6, 8, 10]>;
//   ^? 30
type reduced2 = $<Reduce<number, number>, Mul, 1, [2, 4, 6, 8, 10]>;
//   ^? 3840
type reduced3 = $<Reduce<number, number>, Mul, 1, ["2", "4", "6", "8", "10"]>;
//                                                ~~~~~~~~~~~~~~~~~~~~~~~~~~ ❌
type reducedOops = $<Reduce, Mul, 1, "oops">;
//                                   ~~~~~~ ❌

interface NumToStringReducer extends Fn<[string, number], string> {
  return: `${Arg0<this>}${Arg1<this>}`;
}

interface StringToNumReducer extends Fn<[number, string], number> {
  return: NumberImpl.Add<Arg0<this>, StringImpl.Length<Arg1<this>>>;
}

// prettier-ignore
type reduced4 = $<Reduce<string, number>, StringToNumReducer, 1, ["a", "aa", "aaa", "aaaa", "aaaaa"]>;
//     ^? 16

// prettier-ignore
type reduced5 = $<Reduce<string, number>, NumToStringReducer, 1, ["a", "aa", "aaa", "aaaa", "aaaaa"]>;
//                                        ~~~~~~~~~~~~~~~~~~ ❌

interface ToString extends Fn<[number], string> {
  return: `${Arg0<this>}`;
}

interface ToNumber extends Fn<[string], number> {
  return: Arg0<this> extends `${infer N extends number}` ? N : never;
}

interface Prepend extends Fn<[string, string], string> {
  return: this["args"] extends [
    infer first extends string,
    infer str extends string
  ]
    ? `${first}${str}`
    : never;
}

type Times10<T extends number> = $<ToNumber, $<Prepend, "1", $<ToString, T>>>;

type WrongComposition1<T extends string> = $<Prepend, "1", $<ToNumber, T>>;
//                                                         ~~~~~~~~~~~~~~ ❌
type WrongComposition2<T extends number> = $<Add, 1, $<ToString, T>>;
//                                                   ~~~~~~~~~~~~~~ ❌

type test1 = Times10<10>;
//    ^? 110
