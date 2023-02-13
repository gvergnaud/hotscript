import { Digit } from "../utils";
import { AddDigits } from "./addition";
import { SubDigits } from "./substraction";

export type MulX2<T extends Digit[]> = AddDigits<T, T>;
export type MulX3<T extends Digit[]> = AddDigits<T, MulX2<T>>;
export type MulX4<T extends Digit[]> = MulX2<MulX2<T>>;
export type MulX5<T extends Digit[]> = AddDigits<T, MulX4<T>>;
export type MulX6<T extends Digit[]> = MulX2<MulX3<T>>;
export type MulX7<T extends Digit[]> = SubDigits<MulX10<T>, MulX3<T>>;
export type MulX8<T extends Digit[]> = SubDigits<MulX10<T>, MulX2<T>>;
export type MulX9<T extends Digit[]> = SubDigits<MulX10<T>, T>;
export type MulX10<T extends Digit[]> = [...T, 0];

export type MulByDigit<T extends Digit[], U extends Digit> = U extends 0
  ? [0]
  : U extends 1
  ? T
  : U extends 2
  ? MulX2<T>
  : U extends 3
  ? MulX3<T>
  : U extends 4
  ? MulX4<T>
  : U extends 5
  ? MulX5<T>
  : U extends 6
  ? MulX6<T>
  : U extends 7
  ? MulX7<T>
  : U extends 8
  ? MulX8<T>
  : MulX9<T>;

export type MulDigits<
  T extends Digit[],
  U extends Digit[],
  Acc extends Digit[] = []
> = U extends [infer N extends Digit, ...infer R extends Digit[]]
  ? MulDigits<T, R, AddDigits<MulByDigit<T, N>, MulX10<Acc>>>
  : Acc;
