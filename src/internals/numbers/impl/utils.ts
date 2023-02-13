export type ToNumber<T extends string> = T extends `${infer N extends
  | number
  | bigint}`
  ? N
  : never;

export type ToString<T extends number | bigint> = `${T}`;

export type Digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export type Digit = Digits[number];

export type DigitNumber = { sign: "-" | ""; num: Digit[] };
export type MakeDigitNumber<S extends "-" | "", N extends Digit[]> = {
  sign: S;
  num: N;
};

export type ToDigits<
  T extends string,
  Acc extends Digit[] = []
> = T extends `${infer N extends Digit}${infer R}`
  ? ToDigits<R, [...Acc, N]>
  : Acc;

export type ToDigitNumber<T extends string> = T extends `-${infer R}`
  ? { sign: "-"; num: ToDigits<R> }
  : { sign: ""; num: ToDigits<T> };

export type FromDigits<T, Acc extends string = ""> = T extends [
  infer N extends Digit,
  ...infer R
]
  ? FromDigits<R, `${Acc}${N}`>
  : Acc;

export type Sign<T extends DigitNumber> = T["sign"];
export type InvertSign<T extends DigitNumber> = Sign<T> extends "-" ? "" : "-";
export type MulSign<S1 extends "-" | "", S2 extends "-" | ""> = S1 extends "-"
  ? S2 extends "-"
    ? ""
    : "-"
  : S2 extends "-"
  ? "-"
  : "";

export type Num<T extends DigitNumber> = T["num"];

export type FromDigitNumber<T extends DigitNumber> = `${Sign<T>}${FromDigits<
  Num<T>
>}`;

export type TrimZeros<T extends Digit[]> = T extends [0]
  ? [0]
  : T extends [0, ...infer R extends Digit[]]
  ? TrimZeros<R>
  : T;

export type Normalize<
  T extends DigitNumber,
  Trim extends Digit[] = TrimZeros<Num<T>>
> = Trim extends [0]
  ? MakeDigitNumber<"", Trim>
  : MakeDigitNumber<Sign<T>, Trim>;
