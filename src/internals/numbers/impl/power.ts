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
  Digit,
} from "./utils";
import { PowerDigits } from "./digits/power";

type PowerSign<S extends "" | "-", U extends DigitNumber> = S extends "-"
  ? Num<U> extends [...Digit[], 0 | 2 | 4 | 6 | 8]
    ? ""
    : "-"
  : "";

export type PowerDigitNumbers<
  T extends DigitNumber,
  U extends DigitNumber
> = Sign<U> extends "-"
  ? MakeDigitNumber<Sign<T>, [0]>
  : MakeDigitNumber<PowerSign<Sign<T>, U>, PowerDigits<Num<T>, Num<U>>>;

export type Power<
  T extends number | bigint,
  U extends number | bigint
> = ToNumber<
  FromDigitNumber<
    Normalize<
      PowerDigitNumbers<ToDigitNumber<ToString<T>>, ToDigitNumber<ToString<U>>>
    >
  >
>;
