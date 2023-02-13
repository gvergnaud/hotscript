import { Call, Fn } from "../core/Core";
import { Std } from "../std/Std";
import { Tuples } from "../tuples/Tuples";
import * as H from "../../helpers";
import * as Impl from "./impl/strings";

export namespace Strings {
  export type Stringifiable =
    | string
    | number
    | boolean
    | bigint
    | null
    | undefined;

  interface JoinReducer<sep extends string> extends Fn {
    output: this["args"] extends [
      infer acc extends Strings.Stringifiable,
      infer item extends Strings.Stringifiable
    ]
      ? `${acc extends "" ? "" : `${acc}${sep}`}${item}`
      : never;
  }

  /**
   * Get the length of a string.
   * @param args[0] - The string to get the length of.
   * @returns The length of the string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Length,"abc">; // 3
   * ```
   */
  export interface Length extends Fn {
    output: Impl.StringToTuple<this["args"][0]>["length"];
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
   * Join a tuple of strings into a single string.
   * @param args[0] - The tuple of strings to join.
   * @param sep - The separator to join the strings with.
   * @returns The joined string.
   * @example
   * ```ts
   * type T0 = Call<Strings.Join<",">,["a","b","c"]>; // "a,b,c"
   * ```
   */
  export interface Join<sep extends string> extends Fn {
    output: Tuples.ReduceImpl<this["args"][0], "", JoinReducer<sep>>;
  }

  /**
   * Split a string into a tuple of strings.
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
   * Split a string into a tuple of each character.
   * @param args[0] - The string to split.
   * @returns The splited string.
   * @example
   * ```ts
   * type T0 = Call<Strings.ToTuple,"abc">; // ["a","b","c"]
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
}
