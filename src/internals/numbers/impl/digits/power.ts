import { Digit, TrimZeros } from "../utils";
import { DivModDigits } from "./division";
import { MulDigits } from "./multiply";

export type PowerDigits<
  T extends Digit[],
  U extends Digit[],
  Acc extends Digit[] = [1]
> = U extends [0]
  ? [1]
  : U extends [1]
  ? MulDigits<T, Acc>
  : U extends [infer UN extends Digit, ...infer UR extends Digit[]]
  ? DivModDigits<UR, [UN], [2]> extends {
      Quotient: infer Q extends Digit[];
      Remainder: infer R extends Digit[];
    }
    ? TrimZeros<R> extends [0]
      ? PowerDigits<MulDigits<T, T>, TrimZeros<Q>, Acc>
      : PowerDigits<MulDigits<T, T>, TrimZeros<Q>, MulDigits<T, Acc>>
    : never
  : Acc;
