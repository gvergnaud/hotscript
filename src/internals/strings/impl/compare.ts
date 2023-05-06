import { Call } from "../../core/Core";
import { Numbers } from "../../numbers/Numbers";
import { StringToTuple } from "./split";
import { Equal as _Equal } from "../../helpers";
import { ascii } from "./chars";

type CharacterCompare<
  Char1 extends string,
  Char2 extends string
> = Char1 extends Char2
  ? 0
  : Char1 extends keyof ascii
  ? Char2 extends keyof ascii
    ? Call<Numbers.Compare, ascii[Char1], ascii[Char2]>
    : 1
  : -1;

type CharactersCompare<T extends string[], U extends string[]> = T extends [
  infer N1 extends string,
  ...infer R1 extends string[]
]
  ? U extends [infer N2 extends string, ...infer R2 extends string[]]
    ? CharacterCompare<N1, N2> extends 0
      ? CharactersCompare<R1, R2>
      : CharacterCompare<N1, N2>
    : 1
  : U extends [string, ...string[]]
  ? -1
  : 0;

export type Compare<T extends string, U extends string> = _Equal<
  T,
  U
> extends true
  ? 0
  : CharactersCompare<StringToTuple<T>, StringToTuple<U>>;

export type LessThan<T extends string, U extends string> = Compare<
  T,
  U
> extends -1
  ? true
  : false;

export type LessThanOrEqual<T extends string, U extends string> = Compare<
  T,
  U
> extends 1
  ? false
  : true;

export type Equal<T extends string, U extends string> = _Equal<T, U>;

export type NotEqual<T extends string, U extends string> = _Equal<
  T,
  U
> extends true
  ? false
  : true;

export type GreaterThan<T extends string, U extends string> = Compare<
  T,
  U
> extends 1
  ? true
  : false;

export type GreaterThanOrEqual<T extends string, U extends string> = Compare<
  T,
  U
> extends -1
  ? false
  : true;
