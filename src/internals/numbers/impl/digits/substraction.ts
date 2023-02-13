import type { Digit } from "../utils";

type SubDigitTable = [
  [
    [0, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    [1, 0, 9, 8, 7, 6, 5, 4, 3, 2],
    [2, 1, 0, 9, 8, 7, 6, 5, 4, 3],
    [3, 2, 1, 0, 9, 8, 7, 6, 5, 4],
    [4, 3, 2, 1, 0, 9, 8, 7, 6, 5],
    [5, 4, 3, 2, 1, 0, 9, 8, 7, 6],
    [6, 5, 4, 3, 2, 1, 0, 9, 8, 7],
    [7, 6, 5, 4, 3, 2, 1, 0, 9, 8],
    [8, 7, 6, 5, 4, 3, 2, 1, 0, 9],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  ],
  [
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    [0, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    [1, 0, 9, 8, 7, 6, 5, 4, 3, 2],
    [2, 1, 0, 9, 8, 7, 6, 5, 4, 3],
    [3, 2, 1, 0, 9, 8, 7, 6, 5, 4],
    [4, 3, 2, 1, 0, 9, 8, 7, 6, 5],
    [5, 4, 3, 2, 1, 0, 9, 8, 7, 6],
    [6, 5, 4, 3, 2, 1, 0, 9, 8, 7],
    [7, 6, 5, 4, 3, 2, 1, 0, 9, 8],
    [8, 7, 6, 5, 4, 3, 2, 1, 0, 9]
  ]
];

type SubDigitCarryTable = [
  [
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  ]
];

type SubDigit<
  T extends Digit,
  U extends Digit,
  Carry extends 0 | 1 = 0
> = SubDigitTable[Carry][T][U];

type SubCarryDigit<
  T extends Digit,
  U extends Digit,
  Carry extends 0 | 1 = 0
> = SubDigitCarryTable[Carry][T][U];

export type SubDigits<
  T extends Digit[],
  U extends Digit[],
  Carry extends 0 | 1 = 0,
  Acc extends Digit[] = []
> = T extends [...infer R extends Digit[], infer N extends Digit]
  ? U extends [...infer S extends Digit[], infer M extends Digit]
    ? SubDigits<
        R,
        S,
        SubCarryDigit<N, M, Carry>,
        [SubDigit<N, M, Carry>, ...Acc]
      >
    : SubDigits<
        R,
        [],
        SubCarryDigit<N, 0, Carry>,
        [SubDigit<N, 0, Carry>, ...Acc]
      >
  : U extends [...infer S extends Digit[], infer M extends Digit]
  ? SubDigits<
      [],
      S,
      SubCarryDigit<0, M, Carry>,
      [SubDigit<0, M, Carry>, ...Acc]
    >
  : Carry extends 1
  ? [...Acc, 9]
  : Acc;
