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
  Digit,
} from "./utils";
import { DivDigits, ModDigits, DivModDigits } from "./digits/division";

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

export type DivModDigitNumbers<
  T extends DigitNumber,
  U extends DigitNumber,
  DivMod extends { Quotient: Digit[]; Remainder: Digit[] } = DivModDigits<
    Num<T>,
    Num<U>
  >
> = {
  Quotient: MakeDigitNumber<MulSign<Sign<T>, Sign<U>>, DivMod["Quotient"]>;
  Remainder: MakeDigitNumber<Sign<T>, DivMod["Remainder"]>;
};

export type DivMod<
  T extends number | bigint,
  U extends number | bigint,
  DivModNumbers extends {
    Quotient: DigitNumber;
    Remainder: DigitNumber;
  } = DivModDigitNumbers<ToDigitNumber<ToString<T>>, ToDigitNumber<ToString<U>>>
> = {
  Quotient: ToNumber<FromDigitNumber<Normalize<DivModNumbers["Quotient"]>>>;
  Remainder: ToNumber<FromDigitNumber<Normalize<DivModNumbers["Remainder"]>>>;
};
