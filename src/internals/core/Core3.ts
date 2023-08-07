import { _, unset } from "./Core";
import { ExcludePlaceholders, ExcludeUnset, MergeArgs } from "./impl/MergeArgs";
import * as NumberImpl from "../numbers/impl/numbers";
import * as StringImpl from "../strings/impl/strings";
import { Equal, Expect } from "../helpers";

/**
 * Core
 */

export interface Fn<input extends unknown[] = unknown[], output = unknown> {
  inputTypes: input;
  outputType: output;
  args: unknown;
  return: unknown;
}

export type Apply<fn extends Fn, args extends unknown[]> = (fn & {
  args: args;
})["return"];

type ExcludePlaceholdersFromInputTypes<
  inputTypes extends unknown[],
  partialArgs extends unknown[],
  result extends unknown[] = []
> = [inputTypes, partialArgs] extends [
  [infer fInput, ...infer rInput],
  [infer fPartial, ...infer rPartial]
]
  ? ExcludePlaceholdersFromInputTypes<
      rInput,
      rPartial,
      fPartial extends _ ? [...result, fInput] : result
    >
  : [...result, ...inputTypes];

interface Applied<fn extends Fn, partialArgs extends unknown[] = []>
  extends Fn {
  name: "$.partial";

  argsArray: Extract<this["args"], unknown[]>;
  allArgs: [...partialArgs, ...this["argsArray"]];

  inputTypes: ExcludePlaceholdersFromInputTypes<fn["inputTypes"], partialArgs>;

  outputType: fn["outputType"];

  return: Apply<fn, MergeArgs<this["argsArray"], partialArgs>>;
}

namespace Tuple {
  export type Last<xs> = xs extends [...any, infer last] ? last : never;
}

type ApplyLeftToRight<x extends any[], fns> = fns extends [
  infer fn extends Fn,
  ...infer restFns
]
  ? ApplyLeftToRight<[Apply<fn, x>], restFns>
  : x[0];

interface Piped<fns extends Fn[]> extends Fn {
  name: "$.pipe";

  inputTypes: fns[0]["inputTypes"];
  outputType: Extract<Tuple.Last<fns>, Fn>["outputType"];

  return: ApplyLeftToRight<Extract<this["args"], any[]>, fns>;
}

namespace $ {
  export type partial<
    fn extends Fn,
    arg0 extends fn["inputTypes"][0] | _ = unset,
    arg1 extends fn["inputTypes"][1] | _ = unset,
    arg2 extends fn["inputTypes"][2] | _ = unset,
    arg3 extends fn["inputTypes"][3] | _ = unset
  > = Applied<fn, ExcludeUnset<[arg0, arg1, arg2, arg3]>>;

  type getOutputType<x> = x extends { outputType: infer O } ? O : never;

  export type pipe<
    fn0 extends Fn,
    fn1 extends Fn<[getOutputType<fn0>]> | unset = unset,
    fn2 extends Fn<[getOutputType<fn1>]> | unset = unset,
    fn3 extends Fn<[getOutputType<fn2>]> | unset = unset,
    fn4 extends Fn<[getOutputType<fn3>]> | unset = unset,
    fn5 extends Fn<[getOutputType<fn4>]> | unset = unset,
    fn6 extends Fn<[getOutputType<fn5>]> | unset = unset,
    fn7 extends Fn<[getOutputType<fn6>]> | unset = unset,
    fn8 extends Fn<[getOutputType<fn7>]> | unset = unset,
    fn9 extends Fn<[getOutputType<fn8>]> | unset = unset,
    fn10 extends Fn<[getOutputType<fn9>]> | unset = unset,
    fn11 extends Fn<[getOutputType<fn10>]> | unset = unset,
    fn12 extends Fn<[getOutputType<fn11>]> | unset = unset,
    fn13 extends Fn<[getOutputType<fn12>]> | unset = unset
  > = Piped<
    Extract<
      ExcludeUnset<
        [
          fn0,
          fn1,
          fn2,
          fn3,
          fn4,
          fn5,
          fn6,
          fn7,
          fn8,
          fn9,
          fn10,
          fn11,
          fn12,
          fn13
        ]
      >,
      Fn[]
    >
  >;
}

export type $<
  fn extends Fn,
  arg0 extends fn["inputTypes"][0] = unset,
  arg1 extends fn["inputTypes"][1] = unset,
  arg2 extends fn["inputTypes"][2] = unset,
  arg3 extends fn["inputTypes"][3] = unset
> = Extract<
  (fn & {
    args: ExcludeUnset<[arg0, arg1, arg2, arg3]>;
  })["return"],
  fn["outputType"]
>;

type Args<fn extends Fn> = fn["args"];
type Arg0<fn extends Fn> = Extract<
  Extract<fn["args"], unknown[]>[0],
  fn["inputTypes"][0]
>;
type Arg1<fn extends Fn> = Extract<
  Extract<fn["args"], unknown[]>[1],
  fn["inputTypes"][1]
>;
type Arg2<fn extends Fn> = Extract<
  Extract<fn["args"], unknown[]>[2],
  fn["inputTypes"][2]
>;
type Arg3<fn extends Fn> = Extract<
  Extract<fn["args"], unknown[]>[3],
  fn["inputTypes"][3]
>;

/**
 * Playground 👇
 */

type ExpectNumber<a extends number> = [a];
// arguments are typed internally:
interface TakeNumAndStr extends Fn<[number, string], boolean> {
  works: ExpectNumber<Arg0<this>>; // ✅
  // @ts-expect-error
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

type t1 = $<Div, 10, 2>; // 5
//   ^?
type test1 = Expect<Equal<t1, 5>>;

// @ts-expect-error
type err1 = $<Div, "10", 2>;
//                 ~~~ ❌

// @ts-expect-error
type err2 = $<Div, 11, "2">;
//                     ~~~ ❌

/**
 * Partial application in order
 */

type Div1 = $.partial<Div, 10>;
type t2 = $<Div1, 2>;
//   ^?
type test2 = Expect<Equal<t2, 5>>;
//    ^?

// @ts-expect-error
type t3 = $<$.partial<Div, 10>, "2">;
//                       ~~~ ❌

/**
 * Partial application different order
 */
type DivBy2 = $.partial<Div, _, 2>;
//   ^?
type t4 = $<DivBy2, 10>; // 5 ✅
//   ^?
type test4 = Expect<Equal<t4, 5>>;

type t5 = $<$.partial<Div, _>, 10, 5>; // ✅
//   ^?
type test5 = Expect<Equal<t5, 2>>;

type TakeStr = $.partial<TakeNumAndStr, 10>;
//   ^? $.partial<TakeNumAndStr, [10]>

// @ts-expect-error
type t8 = $<TakeStr, 10>;
//                   ~~ ❌

type TakeNum = $.partial<TakeNumAndStr, _, "10">;
//   ^?$.partial<TakeNumAndStr, [_, "10"]>

type t7 = $<TakeNum, 10>; // ✅
type test7 = Expect<Equal<t7, true>>;

// @ts-expect-error
type t8 = $<TakeNum, "10">;
//                   ~~~~ ❌

/**
 * Higher order
 */

interface Map<A = unknown, B = A> extends Fn<[Fn<[A], B>, A[]], B[]> {
  return: Args<this> extends [infer fn extends Fn, infer tuple]
    ? { [key in keyof tuple]: $<fn, tuple[key]> }
    : never;
}

type t9 = $<Map<number>, $.partial<Div, _, 2>, [2, 4, 6, 8, 10]>;
//   ^? [1, 2, 3, 4, 5]
type test9 = Expect<Equal<t9, [1, 2, 3, 4, 5]>>;

type Defaults<a, b> = [a] extends [undefined] ? b : a;

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

interface Reduce<A = unknown, B = A> extends Fn<[Fn<[B, A], B>, B, A[]], B> {
  return: Args<this> extends [infer fn extends Fn, infer acc, infer tuple]
    ? ReduceImpl<fn, acc, tuple>
    : never;
}

type t11 = $<Reduce<number>, Add, 0, [2, 4, 6, 8, 10]>;
//   ^? 30
type test11 = Expect<Equal<t11, 30>>;

type t12 = $<Reduce<number>, Mul, 1, [2, 4, 6, 8, 10]>;
//   ^? 3840
type test12 = Expect<Equal<t12, 3840>>;

// @ts-expect-error
type t13 = $<Reduce<number>, Mul, 1, ["2", "4", "6", "8", "10"]>;
//                                           ~~~~~~~~~~~~~~~~~~~~~~~~~~ ❌

// @ts-expect-error
type t14 = $<Reduce, Mul, 1, "oops">;
//                           ~~~~~~ ❌

interface NumToStringReducer extends Fn<[string, number], string> {
  return: `${Arg0<this>}${Arg1<this>}`;
}

interface StringToNumReducer extends Fn<[number, string], number> {
  return: NumberImpl.Add<Arg0<this>, StringImpl.Length<Arg1<this>>>;
}

// prettier-ignore
type t15 = $<Reduce<string, number>, StringToNumReducer, 1, ["a", "aa", "aaa", "aaaa", "aaaaa"]>;
//     ^? 16
type test15 = Expect<Equal<t15, 16>>;

// @ts-expect-error
// prettier-ignore
type t16 = $<Reduce<string, number>, NumToStringReducer, 1, ["a", "aa", "aaa", "aaaa", "aaaaa"]>;
//                                   ~~~~~~~~~~~~~~~~~~ ❌

interface ToString extends Fn<[number], string> {
  return: `${Arg0<this>}`;
}

interface ToNumber extends Fn<[string], number> {
  return: Arg0<this> extends `${infer N extends number}` ? N : never;
}

interface Prepend extends Fn<[string, string], string> {
  return: `${Arg0<this>}${Arg1<this>}`;
}

interface ToArray extends Fn<[unknown], [unknown]> {
  return: [Arg0<this>];
}

type Times10<T extends number> = $<Prepend, "1", $<ToString, T>>;

type t17 = Times10<10>;
//    ^? 110
type test17 = Expect<Equal<t17, "110">>;

// @ts-expect-error
type WrongComposition1<T extends string> = $<Prepend, "1", $<ToNumber, T>>;
//                                                         ~~~~~~~~~~~~~~ ❌
// @ts-expect-error
type WrongComposition2<T extends number> = $<Add, 1, $<ToString, T>>;
//                                                   ~~~~~~~~~~~~~~ ❌

type Test<T extends string> = $<Prepend, "1", T>;

type t18 = Test<"10">;
//    ^? 110
type test18 = Expect<Equal<t18, "110">>;

type Sum = $.partial<Reduce<number>, Add, 0>;

type Composition<T extends number[]> = $<
  $.pipe<
    $.partial<Map<number>, $.partial<Add, 1>>,
    $.partial<
      Map<number>,
      $.pipe<
        $.partial<Add, 1>,
        $.partial<Mul, 3>,
        ToString,
        $.partial<Prepend, "1">,
        ToNumber
      >
    >,
    Sum,
    ToString,
    $.partial<Prepend, "1">,
    ToNumber,
    $.partial<Mul, 10>,
    $.partial<Div, _, 2>,
    ToString,
    $.partial<Prepend, _, "10">,
    ToNumber
  >,
  T
>;

type t19 = Composition<[1, 2, 3, 4]>;
//   ^?
type test19 = Expect<Equal<t19, 682010>>;
