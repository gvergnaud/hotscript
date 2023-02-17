// Original impl https://gist.github.com/sno2/7dac868ec6d11abb75250ce5e2b36041

import { Add } from "../../numbers/impl/addition";
import { StringIterator as StrIter } from "./utils";

// Implementation of the following algorithm:
//
// function lengthUp(s, length = 0, it = It.init()) {
//   const doubleIt = It.double(it);
//   let rest = s.slice(It.size(doubleIt));
//   if (rest) {
//     if (It.size(it) === 12) {
//       return lengthDown(rest, length + It.value(doubleIt), doubleIt);
//     }
//     return lengthUp(rest, length + It.value(doubleIt), doubleIt);
//   }
//   rest = s.slice(It.size(it));
//   if (rest) {
//     return lengthUp(rest, length + It.value(it), it);
//   }
//   return lengthDown(s, length, It.prev(it));
// }
//
// function lengthDown(s, length, it) {
//  if(it) {
//    const rest = s.slice(It.size(it));
//    if (rest) {
//      return lengthDown(rest, length + It.value(it), it);
//    }
//    return lengthDown(s, length, It.prev(it));
//  }
//  return length;
// }

type LengthUp<
  Str extends string,
  Length extends number | bigint = 0,
  It extends StrIter.Iterator = StrIter.Init
> = StrIter.Double<It> extends infer $DoubleIt extends StrIter.Iterator
  ? StrIter.CutAt<Str, $DoubleIt> extends `${infer $Rest}`
    ? StrIter.Size<It> extends 12 // 2^13 is the last block size within the complexity limit
      ? LengthDown<$Rest, Add<Length, StrIter.Value<$DoubleIt>>, $DoubleIt>
      : LengthUp<$Rest, Add<Length, StrIter.Value<$DoubleIt>>, $DoubleIt>
    : StrIter.CutAt<Str, It> extends `${infer $Rest}`
    ? LengthUp<$Rest, Add<Length, StrIter.Value<It>>, It>
    : LengthDown<Str, Length, StrIter.Prev<It>>
  : never;

type LengthDown<
  Str extends string,
  Length extends number | bigint,
  It
> = It extends StrIter.Iterator
  ? StrIter.CutAt<Str, It> extends `${infer $Rest}`
    ? LengthDown<$Rest, Add<Length, StrIter.Value<It>>, It>
    : LengthDown<Str, Length, StrIter.Prev<It>>
  : Length;

export type Length<T extends string> = T extends "" ? 0 : LengthUp<T>;
