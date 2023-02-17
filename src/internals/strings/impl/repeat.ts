import { DivMod } from "../../numbers/impl/division";
import { Sub } from "../../numbers/impl/substraction";

// The below algorithm is based on the following one :
//
// const repeat = (s: string, count: number, acc: string = ''): string => {
//   if (count === 0) {
//     return acc;
//   } else if (count % 2 === 0) {
//     return repeat(s + s, count / 2, acc);
//   } else {
//     return repeat(s, count - 1, acc + s);
//   }
// }

type RepeatX2<T extends string> = `${T}${T}`;

export type Repeat<
  T extends string,
  N extends number,
  Acc extends string = "",
  Calc extends { Quotient: number; Remainder: number } = DivMod<N, 2>
> = N extends 0
  ? Acc
  : N extends 1
  ? `${Acc}${T}`
  : Calc["Remainder"] extends 0
  ? Repeat<RepeatX2<T>, Calc["Quotient"], Acc>
  : Repeat<T, Sub<N, 1>, `${Acc}${T}`>;
