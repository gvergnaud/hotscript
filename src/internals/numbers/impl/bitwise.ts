import { GreaterThan, GreaterThanOrEqual } from "./compare";
import { Add } from "./addition";
import { Div, Mod } from "./division";
import { Mul } from "./multiply";
import { Sub } from "./substraction";

// prettier-ignore
type Pow2Normal = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648];

export type BitShiftLeft<N extends number, Places extends number> =
  //
  Pow2Normal[Places] extends number ? Mul<N, Pow2Normal[Places]> : -2147483648;

export type BitShiftRight<N extends number, Places extends number> =
  //
  Pow2Normal[Places] extends number ? Div<N, Pow2Normal[Places]> : 0;

// prettier-ignore
type Pow2 = [2147483648, 1073741824, 536870912, 268435456, 134217728, 67108864, 33554432, 16777216, 8388608, 4194304, 2097152, 1048576, 524288, 262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];

export type BitAnd<
  N1 extends number | bigint,
  N2 extends number | bigint,
  $Pow extends number[] = Pow2,
  $Acc extends number | bigint = 0
> =
  //
  $Pow extends [infer $P extends number, ...infer $RestP extends number[]]
    ? GreaterThanOrEqual<N1, $P> extends true
      ? GreaterThanOrEqual<N2, $P> extends true
        ? BitAnd<Sub<N1, $P>, Sub<N2, $P>, $RestP, Add<$Acc, $P>>
        : BitAnd<Sub<N1, $P>, N2, $RestP, $Acc>
      : GreaterThanOrEqual<N2, $P> extends true
      ? BitAnd<N1, Sub<N2, $P>, $RestP, $Acc>
      : BitAnd<N1, N2, $RestP, $Acc>
    : $Acc;

export type BitOr<
  N1 extends number | bigint,
  N2 extends number | bigint,
  $Pow extends number[] = Pow2,
  $Acc extends number | bigint = 0
> =
  //
  $Pow extends [infer $P extends number, ...infer $RestP extends number[]]
    ? GreaterThanOrEqual<N1, $P> extends true
      ? GreaterThanOrEqual<N2, $P> extends true
        ? BitOr<Sub<N1, $P>, Sub<N2, $P>, $RestP, Add<$Acc, $P>>
        : BitOr<Sub<N1, $P>, N2, $RestP, Add<$Acc, $P>>
      : GreaterThanOrEqual<N2, $P> extends true
      ? BitOr<N1, Sub<N2, $P>, $RestP, Add<$Acc, $P>>
      : BitOr<N1, N2, $RestP, $Acc>
    : $Acc;

export type BitXor<
  N1 extends number | bigint,
  N2 extends number | bigint,
  $Pow extends number[] = Pow2,
  $Acc extends number | bigint = 0
> =
  //
  $Pow extends [infer $P extends number, ...infer $RestP extends number[]]
    ? GreaterThanOrEqual<N1, $P> extends true
      ? GreaterThanOrEqual<N2, $P> extends true
        ? BitXor<Sub<N1, $P>, Sub<N2, $P>, $RestP, $Acc>
        : BitXor<Sub<N1, $P>, N2, $RestP, Add<$Acc, $P>>
      : GreaterThanOrEqual<N2, $P> extends true
      ? BitXor<N1, Sub<N2, $P>, $RestP, Add<$Acc, $P>>
      : BitXor<N1, N2, $RestP, $Acc>
    : $Acc;
