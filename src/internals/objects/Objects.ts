import { IsArrayStrict, Prettify } from "../helpers";
import { Call, Call2, Fn, PartialApply, unset, _ } from "../core/Core";
import { Std } from "../std/Std";
import { Strings } from "../strings/Strings";
import * as Impl from "./impl/objects";

export namespace Objects {
  /**
   * Create an object from a union of `[key, value]` entries.
   * @param entries - union of entries to convert to an object
   * @returns an object
   * @example
   * ```ts
   * type T0 = Call<Objects.FromEntries, ["a", 1] | ["b", true]>; // { a: 1; b: true }
   * ```
   */
  export interface FromEntries extends Fn {
    return: Impl.FromEntries<Extract<this["arg0"], [PropertyKey, any]>>;
  }

  /**
   * Turn an object into a union of entries
   * @param obj - The object to transform to entries
   * @returns a union of `[key, value]` entry tuples.
   * @example
   * ```ts
   * type T0 = Call<Objects.Entries, { a: 1; b: true }>; // ["a", 1] | ["b", true]
   * ```
   */
  export interface Entries extends Fn {
    return: Impl.Entries<this["arg0"]>;
  }

  type MapValuesImpl<T, fn extends Fn> = {
    [K in keyof T]: Call2<fn, T[K], K>;
  };

  /**
   * Map over values in an object type.
   * @param fn - The function to run on every object value
   * @param obj - The object to transform
   * @returns a new object with updated values
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.MapValues<Strings.ToNumber>,
   *   { a: "1"; b: "2" }
   * >; // { a: 1, b: 2 }
   * ```
   */
  export interface MapValues<fn extends Fn> extends Fn {
    return: MapValuesImpl<this["arg0"], fn>;
  }

  type MapKeysImpl<T, fn extends Fn> = {
    [K in keyof T as Extract<Call<fn, K>, PropertyKey>]: T[K];
  };

  /**
   * Map over keys in an object type.
   * @param fn - The function to run on every object key
   * @param obj - The object to transform
   * @returns a new object with updated keys
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.MapKeys<Strings.Uppercase>,
   *   { a: 1; b: 2 }
   * >; // { A: 1, B: 2 }
   * ```
   */
  export interface MapKeys<fn extends Fn> extends Fn {
    return: MapKeysImpl<this["arg0"], fn>;
  }

  /**
   * Turn object keys into kebab-case
   * @param obj - The object to transform
   * @returns a new object with updated keys
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.KebabCase,
   *   { userName: "Bob" }
   * >; // { "user-name": "Bob" }
   * ```
   */
  export interface KebabCase extends Fn {
    return: Call<MapKeys<Strings.KebabCase>, this["arg0"]>;
  }

  /**
   * Turn object keys into snake_case
   * @param obj - The object to transform
   * @returns a new object with updated keys
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.SnakeCase,
   *   { userName: "Bob" }
   * >; // { user_name: "Bob" }
   * ```
   */
  export interface SnakeCase extends Fn {
    return: Call<MapKeys<Strings.SnakeCase>, this["arg0"]>;
  }

  /**
   * Turn object keys into camelCase
   * @param obj - The object to transform
   * @returns a new object with updated keys
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.CamelCase,
   *   { user_name: "Bob" }
   * >; // { userName: "Bob" }
   * ```
   */
  export interface CamelCase extends Fn {
    return: Call<MapKeys<Strings.CamelCase>, this["arg0"]>;
  }

  type MapKeysDeepImpl<T, fn extends Fn> = IsArrayStrict<T> extends true
    ? MapKeysDeepImpl<Extract<T, readonly any[]>[number], fn>[]
    : T extends object
    ? {
        [K in keyof T as Extract<Call<fn, K>, PropertyKey>]: Prettify<
          MapKeysDeepImpl<T[K], fn>
        >;
      }
    : T;

  /**
   * Recursively transform all keys in a structure of object types
   * @param fn - The function to apply to every key
   * @param obj - The object to transform
   * @returns a new object with updated keys
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.MapKeysDeep<Strings.Prepend<'_'>>,
   *   { a: { b: { c: string } } }
   * >; // { _a: { _b: { _c: string } } }
   * ```
   */
  export interface MapKeysDeep<fn extends Fn> extends Fn {
    return: MapKeysDeepImpl<this["arg0"], fn>;
  }

  /**
   * Recursively transform all keys of a deeply nested object
   * to kebab-case.
   * @param obj - The object to transform
   * @returns a new object with updated keys
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.KebabCaseDeep,
   *   { currentUser: { firstName: string } }
   * >; // { "current-user": { "first-name": string } }
   * ```
   */
  export interface KebabCaseDeep extends Fn {
    return: Call<MapKeysDeep<Strings.KebabCase>, this["arg0"]>;
  }

  /**
   * Recursively transform all keys of a deeply nested object
   * to snake_case.
   * @param obj - The object to transform
   * @returns a new object with updated keys
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.SnakeCaseDeep,
   *   { currentUser: { firstName: string } }
   * >; // { current_user: { first_name: string } }
   * ```
   */
  export interface SnakeCaseDeep extends Fn {
    return: Call<MapKeysDeep<Strings.SnakeCase>, this["arg0"]>;
  }

  /**
   * Recursively transform all keys of a deeply nested object
   * to camelCase.
   * @param obj - The object to transform
   * @returns a new object with updated keys
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.CamelCaseDeep,
   *   { current_user: { first_name: string } }
   * >; // { currentUser: { firstName: string } }
   * ```
   */
  export interface CamelCaseDeep extends Fn {
    return: Call<MapKeysDeep<Strings.CamelCase>, this["arg0"]>;
  }

  /**
   * Only keep keys of an object if they are
   * assignable to some type.
   * @param key - The type remaining keys should be assignable to
   * @param obj - The object to filter
   * @returns a filtered object
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.Pick<"a" | "b">,
   *   { a: 1, b: 1, c: 1 }
   * >; // { a: 1, b: 1 }
   * ```
   */
  export type Pick<key = unset, obj = unset> = PartialApply<PickFn, [key, obj]>;

  interface PickFn extends Fn {
    return: PickImpl<this["arg1"], this["arg0"]>;
  }

  type PickImpl<obj, keys> = {
    [key in Extract<keyof obj, keys>]: obj[key];
  };

  /**
   * Only keep keys of an object if they aren't
   * assignable to some type.
   * @param key - The type remaining keys should _not_ be assignable to
   * @param obj - The object to filter
   * @returns a filtered object
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.Pick<"a" | "b">,
   *   { a: 1, b: 1, c: 1 }
   * >; // { c: 1 }
   * ```
   */
  export type Omit<key = unset, obj = unset> = PartialApply<OmitFn, [key, obj]>;

  interface OmitFn extends Fn {
    return: OmitImpl<this["arg1"], this["arg0"]>;
  }

  type OmitImpl<obj, keys> = {
    [key in Exclude<keyof obj, keys>]: obj[key];
  };

  /**
   * Only keep keys of an object if the predicate function
   * returns true
   * @param fn - The predicate function, taking (value, key) as arguments
   * @param obj - The object to filter
   * @returns a filtered object
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.PickBy<Strings.StartsWith<"a">>,
   *   { a: "ab", b: "ac", c: "bc" }
   * >; // { a: "ab", b: "ac" }
   * ```
   */
  export interface PickBy<fn extends Fn> extends Fn {
    return: PickByImpl<this["arg0"], fn>;
  }

  type PickByImpl<T, fn extends Fn> = Impl.FromEntries<
    PickEntriesImpl<Impl.Entries<T>, fn>
  >;

  type PickEntriesImpl<
    entries extends [PropertyKey, any],
    fn extends Fn
  > = entries extends any
    ? Call2<fn, entries[1], entries[0]> extends true
      ? entries
      : never
    : never;

  /**
   * Only keep keys of an object if the predicate function
   * returns false
   * @param fn - The predicate function, taking (value, key) as arguments
   * @param obj - The object to filter
   * @returns a filtered object
   * @example
   * ```ts
   * type T0 = Call<
   *   Objects.PickBy<Strings.StartsWith<"a">>,
   *   { a: "ab", b: "ac", c: "bc" }
   * >; // { c: "bc" }
   * ```
   */
  export interface OmitBy<fn extends Fn> extends Fn {
    return: OmitByImpl<this["arg0"], fn>;
  }

  type OmitByImpl<T, fn extends Fn> = Impl.FromEntries<
    OmitEntriesImpl<Impl.Entries<T>, fn>
  >;

  type OmitEntriesImpl<
    entries extends [PropertyKey, any],
    fn extends Fn
  > = entries extends any
    ? Call2<fn, entries[1], entries[0]> extends true
      ? never
      : entries
    : never;

  /**
   * Merge several objects together
   * @param {...objects} - Objects to merge
   * @returns a merged object
   * @example
   * ```ts
   * type T0 = Call<Objects.Assign<{ a: string }>, { b: number }>; // { a: string, b: number }
   * type T1 = Eval<Objects.Assign<{ a: string }, { b: number }>>; // { a: string, b: number }
   * type T2 = Eval<Objects.Assign<{ a: 1 }, { b: 1 }, { c: 1 }>>; // { a: 1, b: 1, c: 1 }
   * ```
   */
  export type Assign<
    arg1 = unset,
    arg2 = unset,
    arg3 = unset,
    arg4 = unset,
    arg5 = unset
  > = PartialApply<AssignFn, [arg1, arg2, arg3, arg4, arg5]>;

  interface AssignFn extends Fn {
    return: Impl.Assign<this["args"]>;
  }

  /**
   * Make all properties of an object readonly
   * @description This function is used to make properties of an object readonly
   * @param value - The object to make properties readonly
   * @returns The object with its properties made readonly
   * @example
   * ```ts
   * type T0 = Call<Objects.Readonly, {a: 1; b: true }>; // { readonly a:1; readonly b: true}
   * type T1 = Eval<Objects.Readonly<{ a: 1; b: true }>>; // { readonly a:1; readonly b: true}
   * ```
   */
  export type Readonly<value = unset> = PartialApply<ReadonlyFn, [value]>;

  interface ReadonlyFn extends Fn {
    return: this["args"] extends [infer value] ? Std._Readonly<value> : never;
  }

  /**
   * Make all properties of an object required
   * @description This function is used to make properties of an object required
   * @param value - The object to make properties required
   * @returns The object with its properties made required
   * @example
   * ```ts
   * type T0 = Call<Objects.Required, {a?: 1; b?: true }>; // { a:1; b: true}
   * type T1 = Eval<Objects.Required<{ a?: 1; b?: true }>>; // { a:1; b: true}
   * ```
   */
  export type Required<value = unset> = PartialApply<RequiredFn, [value]>;

  interface RequiredFn extends Fn {
    return: this["args"] extends [infer value] ? Std._Required<value> : never;
  }

  /**
   * Make all properties of an object optional
   * @description This function is used to make properties of an object optional
   * @param value - The object to make properties optional
   * @returns The object with its properties made optional
   * @example
   * ```ts
   * type T0 = Call<Objects.Partial, {a: 1; b: true }>; // { a?:1; b?: true}
   * type T1 = Eval<Objects.Partial<{ a: 1; b: true }>>; // { a?:1; b?: true}
   * ```
   */
  export type Partial<value = unset> = PartialApply<PartialFn, [value]>;

  interface PartialFn extends Fn {
    return: this["args"] extends [infer value] ? Std._Partial<value> : never;
  }

  /**
   * Makes all levels of an object optional
   * @description This function is used to make all levels of an object optional
   * @param obj - The object to make levels optional
   * @returns The object with its levels made optional
   *
   * @example
   * ```ts
   * type T0 = Call<Objects.PartialDeep, {a: 1; b: true }>; // { a?:1; b?: true}
   * type T1 = Call<Objects.PartialDeep, {a: 1; b: { c: true } }>; // { a?:1; b?: { c?: true } }
   * type T2 = Call<Objects.PartialDeep, {a: 1; b: { c: true, d: { e: false } } }>; // { a?:1; b?: { c?: true, d?: { e?: false } } }
   */

  export type PartialDeep<obj = unset> = PartialApply<PartialDeepFn, [obj]>;

  interface PartialDeepFn extends Fn {
    return: this["args"] extends [infer obj]
      ? Impl.TransformObjectDeep<PartialFn, obj>
      : never;
  }

  export type RequiredDeep<obj = unset> = PartialApply<RequiredDeepFn, [obj]>;

  interface RequiredDeepFn extends Fn {
    return: this["args"] extends [infer obj]
      ? Impl.TransformObjectDeep<RequiredFn, obj>
      : never;
  }

  export type ReadonlyDeep<obj = unset> = PartialApply<ReadonlyDeepFn, [obj]>;

  interface ReadonlyDeepFn extends Fn {
    return: this["args"] extends [infer obj]
      ? Impl.TransformObjectDeep<ReadonlyFn, obj>
      : never;
  }

  export type MutableDeep<obj = unset> = PartialApply<MutableDeepFn, [obj]>;

  interface MutableDeepFn extends Fn {
    return: this["args"] extends [infer obj]
      ? Impl.TransformObjectDeep<MutableFn, obj>
      : never;
  }

  export type Mutable<obj = unset> = PartialApply<MutableFn, [obj]>;

  interface MutableFn extends Fn {
    return: this["args"] extends [infer obj, ...any]
      ? { -readonly [key in keyof obj]: obj[key] }
      : never;
  }

  /**
   * Get a value within an object or a tuple type.
   * @description This function takes an object, a path to one of its properties,
   * and returns the property under that path.
   * @param path - the path to the property to get.
   * @param obj - the object to read from.
   * @returns The value under that path
   *
   * @example
   * ```ts
   * type T0 = Call<O.Get<'a'>, { a: 1, b: 1 }>; // 1
   * type T1 = Call<O.Get<'a[0]'>, { a: [1, 2, 3] }>; // 1
   * type T2 = Call<O.Get<'a.b'>, { a: { b: 1 }, c: '' }>; // 1
   * ```
   */
  export type Get<
    path extends string | number | _ | unset = unset,
    obj = unset
  > = PartialApply<GetFn, [path, obj]>;

  export interface GetFn extends Fn {
    return: this["args"] extends [
      infer path extends string | number,
      infer obj,
      ...any
    ]
      ? Impl.GetFromPath<obj, path>
      : never;
  }

  /**
   * Updates an object or a tuple type.
   * @description This function takes an object, a path to one of its properties,
   * a new value or a function to apply to this property, and returns a new version
   * of this object with this property updated.
   * @param path - the path to the property to update
   * @param valueOrFn - a value to set, or a function to apply on the target property
   * @param obj - the object to update.
   * @returns The updated object.
   *
   * @example
   * ```ts
   * type T0 = Call<O.Update<'a', Numbers.Add<1>>, { a: 1, b: 1 }>; // { a: 2, b: 1 }
   * type T1 = Call<O.Update<'a[0]', 4>, { a: [1, 2, 3] }>; // { a: [4, 2, 3] }
   * type T2 = Call<O.Update<'a.b', Numbers.Add<1>>, { a: { b: 1 }, c: '' }>; // { a: { b: 2 }, c: '' }
   * type T3 = Call<O.Update<'a.b', "Hello">, { a: { b: 1 } }>; // { a: { b: "Hello" } }
   * ```
   */
  export type Update<
    path extends string | number | _ | unset = unset,
    fnOrValue = unset,
    obj = unset
  > = PartialApply<UpdateFn, [path, fnOrValue, obj]>;

  export interface UpdateFn extends Fn {
    return: this["args"] extends [
      infer path extends string | number,
      infer fnOrValue,
      infer obj,
      ...any
    ]
      ? Impl.Update<obj, path, fnOrValue>
      : never;
  }

  /**
   * Create an object from parameters
   * @description This function is used to make an object from parameters
   * And allows to place the parameters in any object property
   * @param args - The parameters to make the object from
   * @returns The object made from the parameters
   *
   * @example
   * ```ts
   * type T0 = Apply<O.Create<{ a: arg0, b: arg1 }>, [1, 2]>; // { a: 1, b: 2 }
   * ```
   */
  interface CreateFn extends Fn {
    return: this["args"] extends [infer pattern, ...infer args]
      ? Impl.Create<pattern, args>
      : never;
  }

  export type Create<
    pattern = unset,
    arg0 = unset,
    arg1 = unset,
    arg2 = unset,
    arg3 = unset
  > = PartialApply<CreateFn, [pattern, arg0, arg1, arg2, arg3]>;

  interface RecordFn extends Fn {
    return: this["args"] extends [infer union extends string, infer value]
      ? Std._Record<union, value>
      : never;
  }

  /**
   * Create a record from a union of strings and a value type
   * @description This function is used to create a record from a union of strings
   * @param union - The union of strings to create the record from
   * @param value - The value to assign to each property
   * @returns The record created from the union of strings
   *
   * @example
   * ```ts
   * type T0 = Call<O.Record<'a' | 'b' | 'c'>, 1>; // { a: 1, b: 1, c: 1 }
   * ```
   */
  export type Record<
    union extends string | _ | unset = unset,
    value = unset
  > = PartialApply<RecordFn, [union, value]>;

  /**
   * Smarter version of keyof that also works with tuples
   * @params args[0] - The type to extract keys from
   * @returns An union of all the types's keys
   * @example
   * ```ts
   * type T0 = Call<O.Keys, ['a', 'b', 'c']>; // 0 | 1 | 2
   * ```
   */
  export interface Keys extends Fn {
    return: Impl.Keys<this["arg0"]>;
  }

  /**
   * Smarter version of Values that also works with tuples
   * @params args[0] - The type to extract values from
   * @returns An union of all the types's values
   * @example
   * ```ts
   * type T0 = Call<O.Values, ['a', 'b', 'c']>; // 'a' | 'b' | 'c'
   * ```
   */
  export interface Values extends Fn {
    return: Impl.Values<this["arg0"]>;
  }

  /**
   * Create a union of all deep paths the object has
   * @description This function is used to create a union from an object with keys
   * @param obj - The object from which the union will be generated
   * @returns An union with all the possible deep paths
   *
   * @example
   * ```ts
   * type T0 = Call<O.AllPaths, { a: { b: number } }>; // 'a' | 'a.b'
   * ```
   */
  export interface AllPaths extends Fn {
    return: Impl.AllPaths<this["arg0"]>;
  }
}
