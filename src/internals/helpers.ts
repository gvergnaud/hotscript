export type Equal<a, b> = (<T>() => T extends a ? 1 : 2) extends <
  T
>() => T extends b ? 1 : 2
  ? true
  : false;

/**
 * HACK:
 * Special function for never because `Equal<T, never>` doesn't
 * work when called deep in the call stack (for a reason I don't understand
 * probably a TS bug).
 */
export type IsNever<T> = [T] extends [never] ? true : false;

export type Expect<a extends true> = a;

export type Some<bools extends boolean[]> = true extends bools[number]
  ? true
  : false;

export type Every<bools extends boolean[]> = bools[number] extends true
  ? true
  : false;

export type Extends<a, b> = [a] extends [b] ? true : false;

export type Not<a extends boolean> = a extends true ? false : true;

/**
 * trick to combine multiple unions of objects into a single object
 * only works with objects not primitives
 * @param union - Union of objects
 * @returns Intersection of objects
 */
export type UnionToIntersection<union> = (
  union extends any ? (k: union) => void : never
) extends (k: infer intersection) => void
  ? intersection
  : never;

export type Prettify<T> = { [K in keyof T]: T[K] } | never;

export type RecursivePrettify<T> = IsArrayStrict<T> extends true
  ? RecursivePrettify<Extract<T, readonly any[]>[number]>[]
  : { [K in keyof T]: RecursivePrettify<T[K]> };

export type AnyTuple = readonly [any, ...any];

export namespace Iterator {
  export type Get<it extends readonly any[]> = it["length"];

  export type Iterator<
    n extends number,
    it extends any[] = []
  > = it["length"] extends n ? it : Iterator<n, [any, ...it]>;

  export type Next<it extends any[]> = [any, ...it];
  export type Prev<it extends any[]> = it extends readonly [any, ...infer tail]
    ? tail
    : [];
}

type UppercaseLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

type KebabToCamel<str> = str extends `${infer first}-${infer rest}`
  ? `${first}${KebabToCamel<Capitalize<rest>>}`
  : str;

type SnakeToCamel<str> = str extends `${infer first}_${infer rest}`
  ? `${first}${SnakeToCamel<Capitalize<rest>>}`
  : str;

/**
 * Converts string casing from snake_case or kebab-case to camelCase.
 */
export type CamelCase<str> = KebabToCamel<SnakeToCamel<str>>;

/**
 * Converts string casing from camelCase or kebab-case to snake_case.
 */
export type SnakeCase<
  str,
  output extends string = ""
> = str extends `${infer first}${infer rest}`
  ? first extends UppercaseLetter
    ? output extends ""
      ? SnakeCase<rest, Lowercase<first>>
      : SnakeCase<rest, `${output}_${Lowercase<first>}`>
    : first extends "-"
    ? SnakeCase<rest, `${output}_`>
    : SnakeCase<rest, `${output}${first}`>
  : output extends ""
  ? str
  : output;

/**
 * Converts string casing from camelCase or snake_case to kebab-case.
 */
export type KebabCase<
  str,
  output extends string = ""
> = str extends `${infer first}${infer rest}`
  ? first extends UppercaseLetter
    ? output extends ""
      ? KebabCase<rest, Lowercase<first>>
      : KebabCase<rest, `${output}-${Lowercase<first>}`>
    : first extends "_"
    ? KebabCase<rest, `${output}-`>
    : KebabCase<rest, `${output}${first}`>
  : output extends ""
  ? str
  : output;

// https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
export type IsAny<type> = 0 extends 1 & type ? true : false;

export type IsUnknown<type> = IsAny<type> extends true
  ? false
  : unknown extends type
  ? true
  : false;

export type IsTuple<a extends readonly any[]> = a extends
  | readonly []
  | readonly [any, ...any]
  | readonly [...any, any]
  ? true
  : false;

export type IsArrayStrict<a> = a extends readonly any[]
  ? Not<IsTuple<a>>
  : false;

/**
 * get last element of union
 * @param Union - Union of any types
 * @returns Last element of union
 */
type GetUnionLast<Union> = UnionToIntersection<
  Union extends any ? () => Union : never
> extends () => infer Last
  ? Last
  : never;

/**
 * Convert union to tuple
 * @param Union - Union of any types, can be union of complex, composed or primitive types
 * @returns Tuple of each elements in the union
 */
export type UnionToTuple<Union, Tuple extends unknown[] = []> = [
  Union
] extends [never]
  ? Tuple
  : UnionToTuple<
      Exclude<Union, GetUnionLast<Union>>,
      [GetUnionLast<Union>, ...Tuple]
    >;

/**
 * Split string into a tuple, using a simple string literal separator
 * @description - This is a simple implementation of split, it does not support multiple separators
 *  A more complete implementation is built on top of this one
 * @param Str - String to split
 * @param Sep - Separator, must be a string literal not a union of string literals
 * @returns Tuple of strings
 */
export type Split<
  Str,
  Sep extends string,
  Acc extends string[] = []
> = Str extends ""
  ? Acc
  : Str extends `${infer T}${Sep}${infer U}`
  ? Split<U, Sep, [...Acc, T]>
  : [...Acc, Str];

export type Stringifiable =
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined;

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined
  | symbol;

export type Head<xs> = xs extends [infer first, ...any] ? first : never;
