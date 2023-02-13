import {
  ToNumber,
  MakeDigitNumber,
  FromDigitNumber,
  Normalize,
  DigitNumber,
  Sign,
  Num,
  ToDigitNumber,
  ToString,
  MulSign,
} from "./utils";
import { DivDigits, ModDigits } from "./digits/division";

export type DivDigitNumbers<
  T extends DigitNumber,
  U extends DigitNumber
> = MakeDigitNumber<MulSign<Sign<T>, Sign<U>>, DivDigits<Num<T>, Num<U>>>;

export type Div<
  T extends number | bigint,
  U extends number | bigint
> = ToNumber<
  FromDigitNumber<
    Normalize<
      DivDigitNumbers<ToDigitNumber<ToString<T>>, ToDigitNumber<ToString<U>>>
    >
  >
>;

export type ModDigitNumbers<
  T extends DigitNumber,
  U extends DigitNumber
> = MakeDigitNumber<Sign<T>, ModDigits<Num<T>, Num<U>>>;

export type Mod<
  T extends number | bigint,
  U extends number | bigint
> = ToNumber<
  FromDigitNumber<
    Normalize<
      ModDigitNumbers<ToDigitNumber<ToString<T>>, ToDigitNumber<ToString<U>>>
    >
  >
>;
