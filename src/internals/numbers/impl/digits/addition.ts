import type { Digit } from "../utils";

type AddDigitTable = [
  [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
    [3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
    [4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
    [5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
    [6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
    [7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
    [8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
    [9, 0, 1, 2, 3, 4, 5, 6, 7, 8]
  ],
  [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
    [3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
    [4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
    [5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
    [6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
    [7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
    [8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
    [9, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  ]
];

type AddDigitCarryTable = [
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
];

type AddDigit<
  T extends Digit,
  U extends Digit,
  Carry extends 0 | 1 = 0
> = AddDigitTable[Carry][T][U];

type AddCarryDigit<
  T extends Digit,
  U extends Digit,
  Carry extends 0 | 1 = 0
> = AddDigitCarryTable[Carry][T][U];

export type AddDigits<
  T extends Digit[],
  U extends Digit[],
  Carry extends 0 | 1 = 0,
  Acc extends Digit[] = []
> = T extends [...infer R extends Digit[], infer N extends Digit]
  ? U extends [...infer S extends Digit[], infer M extends Digit]
    ? AddDigits<
        R,
        S,
        AddCarryDigit<N, M, Carry>,
        [AddDigit<N, M, Carry>, ...Acc]
      >
    : AddDigits<
        R,
        [],
        AddCarryDigit<N, 0, Carry>,
        [AddDigit<N, 0, Carry>, ...Acc]
      >
  : U extends [...infer S extends Digit[], infer M extends Digit]
  ? AddDigits<
      [],
      S,
      AddCarryDigit<0, M, Carry>,
      [AddDigit<0, M, Carry>, ...Acc]
    >
  : Carry extends 1
  ? [1, ...Acc]
  : Acc;
