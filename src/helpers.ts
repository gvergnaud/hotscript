export type Equal<a, b> = (<T>() => T extends a ? 1 : 2) extends <
  T
>() => T extends b ? 1 : 2
  ? true
  : false;

export type Expect<a extends true> = a;

// if types are not equal, error "Expected 1 arguments, but got 0"
export const IsEqual=<T,U>(...Error_Types_Are_Not_Equal: Equal<T,U> extends true ? [] : [1])=>{
  //
}
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
    ? SnakeCase<rest, `${output}_${Lowercase<first>}`>
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
    ? KebabCase<rest, `${output}-${Lowercase<first>}`>
    : first extends "_"
    ? KebabCase<rest, `${output}-`>
    : KebabCase<rest, `${output}${first}`>
  : output extends ""
  ? str
  : output;

export type IsTuple<a extends readonly any[]> = a extends
  | readonly []
  | readonly [any, ...any]
  | readonly [...any, any]
  ? true
  : false;

export type IsArrayStrict<a> = a extends readonly any[]
  ? Not<IsTuple<a>>
  : false;

// This split function is a bit complex because it needs to support
// a union type as a separator.
export type Split<
  Str,
  Sep extends string,
  Output extends string[] = [],
  CurrentChunk extends string = ""
> =
  // Loop through each character:
  Str extends `${infer First}${infer Rest}`
    ? // If `First` is a separator:
      First extends Sep
      ? // Add the current chunk to our output:
        Split<Rest, Sep, [...Output, CurrentChunk], "">
      : // Otherwise, add it to the chunk:
        Split<Rest, Sep, Output, `${CurrentChunk}${First}`>
    : // If the string is empty and `CurrentChunk` as well:
    CurrentChunk extends ""
    ? // Return the output:
      Output
    : // Otherwise, append the CurrentChunk to our Output:
      [...Output, CurrentChunk];

export type GetFromPath<Obj, Path> = RecursiveGet<Obj, ParsePath<Path>>;

type ParsePath<
  Path,
  Output extends string[] = [],
  CurrentChunk extends string = ""
> = Path extends `${infer First}${infer Rest}`
  ? First extends "." | "[" | "]"
    ? ParsePath<
        Rest,
        [...Output, ...(CurrentChunk extends "" ? [] : [CurrentChunk])],
        ""
      >
    : ParsePath<Rest, Output, `${CurrentChunk}${First}`>
  : [...Output, ...(CurrentChunk extends "" ? [] : [CurrentChunk])];

type RecursiveGet<Obj, PathList> = Obj extends any
  ? PathList extends [infer First, ...infer Rest]
    ? First extends keyof Obj
      ? RecursiveGet<Obj[First], Rest>
      : [First, Obj] extends [`${number}`, any[]]
      ? RecursiveGet<Extract<Obj, any[]>[number], Rest>
      : undefined
    : Obj
  : never;
