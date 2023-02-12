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
