export type Equal<a, b> = (<T>() => T extends a ? 1 : 2) extends <
  T
>() => T extends b ? 1 : 2
  ? true
  : false;

export type Expect<a extends true> = a;

export type Some<bools extends boolean[]> = true extends bools[number]
  ? true
  : false;

export type Every<bools extends boolean[]> = bools[number] extends true
  ? true
  : false;

export type Extends<a, b> = [a] extends [b] ? true : false;

export type Not<a extends boolean> = a extends true ? false : true;

export type UnionToIntersection<union> = (
  union extends any ? (k: union) => void : never
) extends (k: infer intersection) => void
  ? intersection
  : never;

export type Prettify<T> = { [K in keyof T]: T[K] } | never;

export type AnyTuple = readonly [any, ...any];

/**
 * args sometimes have an  unknown[] & [...tuple] type, and the
 * unknown[] breaks destructuring. Might be a TS bug?
 */
export type RemoveUnknownArrayConstraint<xs extends any[]> = xs extends [
  infer x1,
  infer x2,
  infer x3,
  infer x4,
  infer x5
]
  ? [x1, x2, x3, x4, x5]
  : xs extends [infer x1, infer x2, infer x3, infer x4]
  ? [x1, x2, x3, x4]
  : xs extends [infer x1, infer x2, infer x3]
  ? [x1, x2, x3]
  : xs extends [infer x1, infer x2]
  ? [x1, x2]
  : xs extends [infer x1]
  ? [x1]
  : [];
