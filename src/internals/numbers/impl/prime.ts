import { Mod } from './division'
import { Mul } from './multiply'
import { GreaterThan } from './numbers';
import { Add } from './addition';

type isPrime<N extends number | bigint, T extends number | bigint> =
    N extends 2 ? true :
    N extends 0 | 1 ? false :
    Mod<N, T> extends 0 ? false :
    GreaterThan<Mul<N, N>, N> extends true ? true :
    isPrime<N, Add<T, 1>>

export type Prime<N extends number | bigint> = isPrime<N, 2>

