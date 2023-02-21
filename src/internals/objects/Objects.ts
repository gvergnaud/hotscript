import { IsArrayStrict, Prettify } from "../helpers";
import { Call, Call2, Fn, PartialApply, unset, _ } from "../core/Core";
import { Std } from "../std/Std";
import { Strings } from "../strings/Strings";
import * as Impl from "./impl/objects";

export namespace Objects {
  export interface FromEntries extends Fn {
    return: Impl.FromEntries<Extract<this["arg0"], [PropertyKey, any]>>;
  }

  export interface Entries extends Fn {
    return: Impl.Entries<this["arg0"]>;
  }

  type MapValuesImpl<T, fn extends Fn> = {
    [K in keyof T]: Call2<fn, T[K], K>;
  };

  export interface MapValues<fn extends Fn> extends Fn {
    return: MapValuesImpl<this["arg0"], fn>;
  }

  type MapKeysImpl<T, fn extends Fn> = {
    [K in keyof T as Extract<Call<fn, K>, PropertyKey>]: T[K];
  };

  export interface MapKeys<fn extends Fn> extends Fn {
    return: MapKeysImpl<this["arg0"], fn>;
  }

  export interface KebabCase extends Fn {
    return: Call<MapKeys<Strings.KebabCase>, this["arg0"]>;
  }

  export interface SnakeCase extends Fn {
    return: Call<MapKeys<Strings.SnakeCase>, this["arg0"]>;
  }

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

  export interface MapKeysDeep<fn extends Fn> extends Fn {
    return: MapKeysDeepImpl<this["arg0"], fn>;
  }

  export interface KebabCaseDeep extends Fn {
    return: Call<MapKeysDeep<Strings.KebabCase>, this["arg0"]>;
  }

  export interface SnakeCaseDeep extends Fn {
    return: Call<MapKeysDeep<Strings.SnakeCase>, this["arg0"]>;
  }

  export interface CamelCaseDeep extends Fn {
    return: Call<MapKeysDeep<Strings.CamelCase>, this["arg0"]>;
  }

  type PickImpl<obj, keys> = {
    [key in Extract<keyof obj, keys>]: obj[key];
  };

  export type Pick<key = unset, obj = unset> = PartialApply<PickFn, [key, obj]>;

  interface PickFn extends Fn {
    return: PickImpl<this["arg1"], this["arg0"]>;
  }

  type OmitImpl<obj, keys> = {
    [key in Exclude<keyof obj, keys>]: obj[key];
  };

  export type Omit<key = unset, obj = unset> = PartialApply<OmitFn, [key, obj]>;

  interface OmitFn extends Fn {
    return: OmitImpl<this["arg1"], this["arg0"]>;
  }

  type PickEntriesImpl<
    entries extends [PropertyKey, any],
    fn extends Fn
  > = entries extends any
    ? Call2<fn, entries[1], entries[0]> extends true
      ? entries
      : never
    : never;

  type PickByImpl<T, fn extends Fn> = Impl.FromEntries<
    PickEntriesImpl<Impl.Entries<T>, fn>
  >;

  export interface PickBy<fn extends Fn> extends Fn {
    return: PickByImpl<this["arg0"], fn>;
  }

  type OmitEntriesImpl<
    entries extends [PropertyKey, any],
    fn extends Fn
  > = entries extends any
    ? Call2<fn, entries[1], entries[0]> extends true
      ? never
      : entries
    : never;

  type OmitByImpl<T, fn extends Fn> = Impl.FromEntries<
    OmitEntriesImpl<Impl.Entries<T>, fn>
  >;

  export interface OmitBy<fn extends Fn> extends Fn {
    return: OmitByImpl<this["arg0"], fn>;
  }

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

  export interface GroupBy<fn extends Fn> extends Fn {
    return: Impl.GroupBy<this["arg0"], fn>;
  }

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
