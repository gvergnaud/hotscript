import { Add } from "./addition";
import { AddDigits } from "./digits/addition";
import { Digit, Num, ToDigitNumber, ToString } from "./utils";
import { Sub } from "./substraction";

export type SequenceOfDigits<
  T extends number | bigint,
  Min extends number | bigint = 0,
  MinDigits extends Digit[] = Num<ToDigitNumber<ToString<Min>>>,
  Acc extends Digit[][] = [MinDigits]
> = Acc["length"] extends T
  ? Acc
  : SequenceOfDigits<
      T,
      Min,
      MinDigits,
      [
        ...Acc,
        AddDigits<Num<ToDigitNumber<ToString<Acc["length"]>>>, MinDigits>
      ]
    >;

export type RangeOfDigits<
  Min extends number | bigint,
  Max extends number | bigint
> = SequenceOfDigits<Sub<Add<Max, 1>, Min>, Min>;
