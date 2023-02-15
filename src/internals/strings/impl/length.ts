// Original impl https://gist.github.com/sno2/7dac868ec6d11abb75250ce5e2b36041

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
        ? LengthUp<
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

export type Length<T extends string> = T extends "" ? 0 : LengthUp<T>;
