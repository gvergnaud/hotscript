// Original impl https://gist.github.com/sno2/7dac868ec6d11abb75250ce5e2b36041

import { Add } from "../../numbers/impl/addition";
import { StringIterator as StrIter } from "./utils";

// Implementation of the following algorithm:
//
// function length(s, acc) {
//   if (s === "") {
//       return 0;
//   } else if (s.indexOf(acc) === 0) {
//       return acc.length + length(s.slice(acc.length), acc + acc);
//   } else {
//       return length(s, acc.slice(acc.length / 2));
//   }
// }

type LengthUp<
  T extends string,
  $Length extends number | bigint = 0,
  It extends StrIter.Iterator = StrIter.Init
> = It extends []
  ? $Length
  : StrIter.Double<It> extends infer $DoubleIt extends StrIter.Iterator
  ? `$${T}` extends `${StrIter.String<$DoubleIt>}${infer $Rest}`
    ? StrIter.Size<It> extends 12 // 2^13 is the last block size within the complexity limit
      ? LengthDown<$Rest, Add<$Length, StrIter.Value<$DoubleIt>>, $DoubleIt>
      : LengthUp<$Rest, Add<$Length, StrIter.Value<$DoubleIt>>, $DoubleIt>
    : `$${T}` extends `${StrIter.String<It>}${infer $Rest}`
    ? LengthUp<$Rest, Add<$Length, StrIter.Value<It>>, It>
    : LengthDown<T, $Length, StrIter.Prev<It>>
  : never;

type LengthDown<
  T extends string,
  $Length extends number | bigint,
  It extends StrIter.Iterator
> = It extends []
  ? $Length
  : `$${T}` extends `${StrIter.String<It>}${infer $Rest}`
  ? LengthDown<$Rest, Add<$Length, StrIter.Value<It>>, It>
  : LengthDown<T, $Length, StrIter.Prev<It>>;

export type Length<T extends string> = T extends "" ? 0 : LengthUp<T>;
