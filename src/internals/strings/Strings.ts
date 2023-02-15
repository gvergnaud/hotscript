import { Fn, MergeArgs, Pipe, placeholder, unset } from "../core/Core";
import { Std } from "../std/Std";
import { Tuples } from "../tuples/Tuples";
import * as H from "../helpers";
import * as Impl from "./impl/strings";

export namespace Strings {
  export type Stringifiable =
    | string
    | number
    | boolean
    | bigint
    | null
    | undefined;

  /**
   * Get the length of a string.
   * @warning - 🔥🔥🔥does not work with emojis since they are multiple characters🔥🔥🔥
   * @param args[0] - The string to get the length of.
   * @returns The length of the string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Length,"abc">; // 3
   * ```
   */
  export interface Length extends Fn {
    output: this["args"][0] extends string
      ? Impl.Length<this["args"][0]>
      : never;
  }

  /**
   * Trim the left side of a string.
   * @param args[0] - The string to trim.
   * @param Sep - The separator to trim.
   * @returns The trimmed string.
   * @example
   * ```ts
   * type T0 = Call<Strings.TrimLeft,"  abc">; // "abc"
   * ```
   */
  export interface TrimLeft<Sep extends string = " "> extends Fn {
    output: Impl.TrimLeft<this["args"][0], Sep>;
  }

  /**
   * Trim the right side of a string.
   * @param args[0] - The string to trim.
   * @param Sep - The separator to trim.
   * @returns The trimmed string.
   * @example
   * ```ts
   * type T0 = Call<Strings.TrimRight,"abc  ">; // "abc"
   * ```
   */
  export interface TrimRight<Sep extends string = " "> extends Fn {
    output: Impl.TrimRight<this["args"][0], Sep>;
  }

  /**
   * Trim a string.
   * @param args[0] - The string to trim.
   * @param Sep - The separator to trim.
   * @returns The trimmed string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Trim,"  abc  ">; // "abc"
   * ```
   */
  export interface Trim<Sep extends string = " "> extends Fn {
    output: Impl.Trim<this["args"][0], Sep>;
  }

  /**
   * Replace all instances of a substring in a string.
   * @param args[0] - The string to replace.
   * @param from - The substring to replace.
   * @param to - The substring to replace with.
   * @returns The replaced string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Replace<".","/">,"a.b.c.d">; // "a/b/c/d"
   */
  export interface Replace<from extends string, to extends string> extends Fn {
    output: Impl.Replace<this["args"][0], from, to>;
  }

  /**
   * Cut a slice of a string out from a start index to an end index.
   * @warning - 🔥🔥🔥does not work with emojis since they are multiple characters🔥🔥🔥
   * @param args[0] - The string to slice.
   * @param start - The start index.
   * @param end - The end index.
   * @returns The sliced string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Slice<1,9>,"1234567890">; // "23456789"
   */
  export interface Slice<start extends number, end extends number> extends Fn {
    output: Pipe<
      Impl.StringToTuple<this["args"][0]>,
      [Tuples.Take<end>, Tuples.Drop<start>, Tuples.Join<"">]
    >;
  }

  /**
   * Split a string into a tuple of strings.
   * @warning - 🔥🔥🔥using an empty sep with emojis in the string will destroy the emoji🔥🔥🔥
   * @param args[0] - The string to split.
   * @param sep - The separator to split the string with.
   * @returns The split string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Split<",">,"a,b,c">; // ["a","b","c"]
   * ```
   */
  export interface Split<sep extends string> extends Fn {
    output: Impl.Split<this["args"][0], sep>;
  }

  /**
   * Repeat a string a number of times.
   * @param args[0] - The string to repeat.
   * @param times - The number of times to repeat the string.
   * @returns The repeated string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Repeat<3>,"Hello! ">; // "Hello! Hello! Hello! "
   * ```
   */
  export interface Repeat<times extends number> extends Fn {
    output: Impl.Repeat<this["args"][0], H.Iterator.Iterator<times>>;
  }

  /**
   * Check if a string starts with a substring.
   * @param args[0] - The string to check.
   * @param str - The substring to check for.
   * @returns Whether the string starts with the substring.
   * @example
   * ```ts
   * type T0 = Call<Strings.StartsWith<"abc">,"abcdef">; // true
   * type T1 = Call<Strings.StartsWith<"abc">,"defabc">; // false
   * ```
   */
  export interface StartsWith<str extends string> extends Fn {
    output: this["args"][0] extends `${str}${string}` ? true : false;
  }

  /**
   * Check if a string ends with a substring.
   * @param args[0] - The string to check.
   * @param str - The substring to check for.
   * @returns Whether the string ends with the substring.
   * @example
   * ```ts
   * type T0 = Call<Strings.EndsWith<"abc">,"abcdef">; // false
   * type T1 = Call<Strings.EndsWith<"abc">,"defabc">; // true
   * ```
   */
  export interface EndsWith<str extends string> extends Fn {
    output: this["args"][0] extends `${string}${str}` ? true : false;
  }

  /**
   * Split a string into a tuple of each character.
   * @warning - 🔥🔥🔥does not work with emojis since they are multiple characters🔥🔥🔥
   * @param args[0] - The string to split.
   * @returns The splited string.
   * @example
   * ```ts
   * type T0 = Call<Strings.ToTuple,"abc">; // ["a","b","c"]
   * ```
   */
  export interface ToTuple extends Fn {
    output: Impl.StringToTuple<this["args"][0]>;
  }

  /**
   * Convert a string to a number or bigint.
   * @param args[0] - The string to convert.
   * @returns The converted number or bigint.
   * @example
   * ```ts
   * type T0 = Call<Strings.ToNumber,"123">; // 123
   * type T1 = Call<Strings.ToNumber,"12367543547677078675456656790">; // 12367543547677078675456656790n
   * ```
   */
  export interface ToNumber extends Fn {
    output: this["args"][0] extends `${infer n extends number | bigint}`
      ? n
      : never;
  }

  /**
   * Convert a stringifiable literal to a string.
   * @param args[0] - The stringifiable literal to convert.
   * @returns The converted string.
   * @example
   * ```ts
   * type T0 = Call<Strings.ToString,123>; // "123"
   * type T1 = Call<Strings.ToString,true>; // "true"
   * type T2 = Call<Strings.ToString,null>; // "null"
   * ```
   */
  export interface ToString extends Fn {
    output: `${Extract<this["args"][0], Strings.Stringifiable>}`;
  }

  /**
   * Prepend a string to another string.
   * @param args[0] - The string to be prepended to.
   * @param str - The string to prepend.
   * @returns The prepended string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Prepend<"abc">,"def">; // "abcdef"
   * ```
   */
  export interface Prepend<str extends string> extends Fn {
    output: `${str}${Extract<this["args"][0], Strings.Stringifiable>}`;
  }

  /**
   * Append a string to another string.
   * @param args[0] - The string to be appended to.
   * @param str - The string to append.
   * @returns The appended string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Append<"abc">,"def">; // "defabc"
   * ```
   */
  export interface Append<str extends string> extends Fn {
    output: `${Extract<this["args"][0], Strings.Stringifiable>}${str}`;
  }

  /**
   * Transform a string to uppercase.
   * @param args[0] - The string to transform.
   * @returns The transformed string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Uppercase,"abc">; // "ABC"
   * ```
   */
  export interface Uppercase extends Fn {
    output: Std._Uppercase<Extract<this["args"][0], string>>;
  }

  /**
   * Transform a string to lowercase.
   * @param args[0] - The string to transform.
   * @returns The transformed string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Lowercase,"ABC">; // "abc"
   * ```
   */
  export interface Lowercase extends Fn {
    output: Std._Lowercase<Extract<this["args"][0], string>>;
  }

  /**
   * Capitalize a string.
   * @param args[0] - The string to capitalize.
   * @returns The capitalized string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Capitalize,"abc">; // "Abc"
   * ```
   */
  export interface Capitalize extends Fn {
    output: Std._Capitalize<Extract<this["args"][0], string>>;
  }

  /**
   * Uncapitalize a string.
   * @param args[0] - The string to uncapitalize.
   * @returns The uncapitalized string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Uncapitalize,"AddTop">; // "addTop"
   * ```
   */
  export interface Uncapitalize extends Fn {
    output: Std._Uncapitalize<Extract<this["args"][0], string>>;
  }

  /**
   * Convert a string to snake case.
   * @param args[0] - The string to convert.
   * @returns The converted string.
   * @example
   * ```ts
   * type T0 = Call<Strings.SnakeCase,"AddTop">; // "add_top"
   * ```
   */
  export interface SnakeCase extends Fn {
    output: H.SnakeCase<this["args"][0]>;
  }

  /**
   * Convert a string to camel case.
   * @param args[0] - The string to convert.
   * @returns The converted string.
   * @example
   * ```ts
   * type T0 = Call<Strings.CamelCase,"add_top">; // "addTop"
   * ```
   */
  export interface CamelCase extends Fn {
    output: H.CamelCase<this["args"][0]>;
  }

  /**
   * Convert a string to kebab case.
   * @param args[0] - The string to convert.
   * @returns The converted string.
   * @example
   * ```ts
   * type T0 = Call<Strings.KebabCase,"add_top">; // "add-top"
   * type T1 = Call<Strings.KebabCase,"AddTop">; // "add-top"
   * type T2 = Call<Strings.KebabCase,"addTop">; // "add-top"
   * ```
   */
  export interface KebabCase extends Fn {
    output: H.KebabCase<this["args"][0]>;
  }

  /**
   * Compare two strings. (only works with ascii extended characters)
   * @param args[0] - The first string to compare.
   * @param args[1] - The second string to compare.
   * @n1 - The first string to compare or placeholder.
   * @n2 - The second string to compare or placeholder.
   * @returns The result of the comparison.
   * @example
   * ```ts
   * type T0 = Call2<Strings.Compare,"abc","def">; // -1
   * type T1 = Call2<Strings.Compare,"def","abc">; // 1
   * type T2 = Call2<Strings.Compare,"abc","abc">; // 0
   * ```
   */
  export interface Compare<
    n1 extends string | placeholder | unset = unset,
    n2 extends string | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends string,
      infer b extends string,
      ...any
    ]
      ? Impl.Compare<a, b>
      : never;
  }

  /**
   * Check if two strings are equal. (only works with ascii extended characters)
   * @param args[0] - The first string to compare.
   * @param args[1] - The second string to compare.
   * @n1 - The first string to compare or placeholder.
   * @n2 - The second string to compare or placeholder.
   * @returns True if the strings are equal, false otherwise.
   * @example
   * ```ts
   * type T0 = Call2<Strings.Equal,"abc","def">; // false
   * type T1 = Call2<Strings.Equal,"def","abc">; // false
   * type T2 = Call2<Strings.Equal,"abc","abc">; // true
   */
  export interface Equal<
    n1 extends string | placeholder | unset = unset,
    n2 extends string | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends string,
      infer b extends string,
      ...any
    ]
      ? Impl.Equal<a, b>
      : never;
  }

  /**
   * Check if two strings are not equal. (only works with ascii extended characters)
   * @param args[0] - The first string to compare.
   * @param args[1] - The second string to compare.
   * @n1 - The first string to compare or placeholder.
   * @n2 - The second string to compare or placeholder.
   * @returns True if the strings are not equal, false otherwise.
   * @example
   * ```ts
   * type T0 = Call2<Strings.NotEqual,"abc","def">; // true
   * type T1 = Call2<Strings.NotEqual,"def","abc">; // true
   * type T2 = Call2<Strings.NotEqual,"abc","abc">; // false
   * ```
   */
  export interface NotEqual<
    n1 extends string | placeholder | unset = unset,
    n2 extends string | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends string,
      infer b extends string,
      ...any
    ]
      ? Impl.NotEqual<a, b>
      : never;
  }

  /**
   * Check if a string is lexically less than another string. (only works with ascii extended characters)
   * @param args[0] - The first string to compare.
   * @param args[1] - The second string to compare.
   * @n1 - The first string to compare or placeholder.
   * @n2 - The second string to compare or placeholder.
   * @returns True if the first string is lexically less than the second string, false otherwise.
   * @example
   * ```ts
   * type T0 = Call2<Strings.LessThan,"abc","def">; // true
   * type T1 = Call2<Strings.LessThan,"def","abc">; // false
   * type T2 = Call2<Strings.LessThan,"abc","abc">; // false
   * ```
   */
  export interface LessThan<
    n1 extends string | placeholder | unset = unset,
    n2 extends string | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends string,
      infer b extends string,
      ...any
    ]
      ? Impl.LessThan<a, b>
      : never;
  }

  /**
   * Check if a string is lexically less than or equal to another string. (only works with ascii extended characters)
   * @param args[0] - The first string to compare.
   * @param args[1] - The second string to compare.
   * @n1 - The first string to compare or placeholder.
   * @n2 - The second string to compare or placeholder.
   * @returns True if the first string is lexically less than or equal to the second string, false otherwise.
   * @example
   * ```ts
   * type T0 = Call2<Strings.LessThanOrEqual,"abc","def">; // true
   * type T1 = Call2<Strings.LessThanOrEqual,"def","abc">; // false
   * type T2 = Call2<Strings.LessThanOrEqual,"abc","abc">; // true
   */
  export interface LessThanOrEqual<
    n1 extends string | placeholder | unset = unset,
    n2 extends string | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends string,
      infer b extends string,
      ...any
    ]
      ? Impl.LessThanOrEqual<a, b>
      : never;
  }

  /**
   * Check if a string is lexically greater than another string. (only works with ascii extended characters)
   * @param args[0] - The first string to compare.
   * @param args[1] - The second string to compare.
   * @n1 - The first string to compare or placeholder.
   * @n2 - The second string to compare or placeholder.
   * @returns True if the first string is lexically greater than the second string, false otherwise.
   * @example
   * ```ts
   * type T0 = Call2<Strings.GreaterThan,"abc","def">; // false
   * type T1 = Call2<Strings.GreaterThan,"def","abc">; // true
   * type T2 = Call2<Strings.GreaterThan,"abc","abc">; // false
   * ```
   */
  export interface GreaterThan<
    n1 extends string | placeholder | unset = unset,
    n2 extends string | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends string,
      infer b extends string,
      ...any
    ]
      ? Impl.GreaterThan<a, b>
      : never;
  }

  /**
   * Check if a string is lexically greater than or equal to another string. (only works with ascii extended characters)
   * @param args[0] - The first string to compare.
   * @param args[1] - The second string to compare.
   * @n1 - The first string to compare or placeholder.
   * @n2 - The second string to compare or placeholder.
   * @returns True if the first string is lexically greater than or equal to the second string, false otherwise.
   * @example
   * ```ts
   * type T0 = Call2<Strings.GreaterThanOrEqual,"abc","def">; // false
   * type T1 = Call2<Strings.GreaterThanOrEqual,"def","abc">; // true
   * type T2 = Call2<Strings.GreaterThanOrEqual,"abc","abc">; // true
   * ```
   */
  export interface GreaterThanOrEqual<
    n1 extends string | placeholder | unset = unset,
    n2 extends string | placeholder | unset = unset
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [
      infer a extends string,
      infer b extends string,
      ...any
    ]
      ? Impl.GreaterThanOrEqual<a, b>
      : never;
  }
}
