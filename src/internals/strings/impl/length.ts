// Original impl https://gist.github.com/sno2/7dac868ec6d11abb75250ce5e2b36041

import { Add } from "../../numbers/impl/addition";
import { Mul } from "../../numbers/impl/multiply";

type TCache = [string, 0[]];

type LengthUp<
  T extends string,
  $Acc extends 0[] = [],
  $Cache extends TCache[] = [[`$${string}`, [0]]]
> =
  //
  $Cache extends [infer C extends TCache, ...infer $RestCache extends TCache[]]
    ? (
        `${C[0]}${C[0]}_` extends `$${string}$${infer $After}`
          ? `${C[0]}${$After}` extends `${infer $Before}_`
            ? $Before
            : never
          : never
      ) extends infer $DoubleC extends string
      ? `$${T}` extends `${$DoubleC}${infer $Rest}`
        ? $Cache["length"] extends 12 // 2^12 is the last block size within the complexity limit
          ? LengthDownSlow<
              $Rest,
              Add<$Acc["length"], Mul<C[1]["length"], 2>>,
              $Cache
            >
          : LengthUp<
              $Rest,
              [...$Acc, ...C[1], ...C[1]],
              [[$DoubleC, [...C[1], ...C[1]]], ...$Cache]
            >
        : `$${T}` extends `${C[0]}${infer $Rest}`
        ? LengthUp<$Rest, [...$Acc, ...C[1]], $Cache>
        : LengthDown<T, $Acc, $RestCache>
      : never
    : $Acc["length"];

type LengthDown<
  T extends string,
  $Acc extends 0[],
  $Cache extends TCache[]
> = $Cache extends [
  infer C extends TCache,
  ...infer $RestCache extends TCache[]
]
  ? `$${T}` extends `${C[0]}${infer $Rest}`
    ? LengthDown<$Rest, [...$Acc, ...C[1]], $Cache>
    : LengthDown<T, $Acc, $RestCache>
  : $Acc["length"];

type LengthDownSlow<
  T extends string,
  $Acc extends bigint | number,
  $Cache extends TCache[]
> = $Cache extends [
  infer C extends TCache,
  ...infer $RestCache extends TCache[]
]
  ? `$${T}` extends `${C[0]}${infer $Rest}`
    ? LengthDownSlow<$Rest, Add<$Acc, C[1]["length"]>, $Cache>
    : LengthDownSlow<T, $Acc, $RestCache>
  : $Acc;

export type Length<T extends string> = T extends "" ? 0 : LengthUp<T>;
