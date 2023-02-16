import { Sub } from "../../numbers/impl/substraction";
import { Add } from "../../numbers/impl/addition";

type TCache = [string, number | bigint];

type IsPositive<N extends number | bigint> =
  //
  `${N}` extends `-${string}` ? false : true;

export type Repeat<T extends string, N extends number | bigint> =
  //
  RepeatUp<T, N>;

type RepeatUp<
  T extends string,
  N extends number | bigint,
  $Acc extends string = "",
  $Cache extends TCache[] = [[T, 1]]
> =
  //
  $Cache extends [infer $FirstCache extends TCache, ...unknown[]]
    ? Add<$FirstCache[1], $FirstCache[1]> extends infer $DoubleCache extends
        | number
        | bigint
      ? Sub<N, $DoubleCache> extends infer $Rem extends number | bigint
        ? IsPositive<$Rem> extends true
          ? RepeatUp<
              T,
              $Rem,
              `${$Acc}${$FirstCache[0]}${$FirstCache[0]}`,
              [[`${$FirstCache[0]}${$FirstCache[0]}`, $DoubleCache], ...$Cache]
            >
          : RepeatDown<T, N, $Acc, $Cache>
        : never
      : never
    : never;

type RepeatDown<
  T extends string,
  N extends bigint | number,
  $Acc extends string,
  $Cache extends TCache[]
> = $Cache extends [
  infer $FirstCache extends TCache,
  ...infer $RestCache extends TCache[]
]
  ? Sub<N, $FirstCache[1]> extends infer $Rem extends number | bigint
    ? IsPositive<$Rem> extends true
      ? RepeatDown<T, $Rem, `${$Acc}${$FirstCache[0]}`, $Cache>
      : RepeatDown<T, N, $Acc, $RestCache>
    : never
  : $Acc;
