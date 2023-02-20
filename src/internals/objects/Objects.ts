import {
  GetFromPath,
  IsArrayStrict,
  Prettify,
  Primitive,
  UnionToIntersection,
} from "../helpers";
import { Apply, arg, Call, Call2, Fn, unset, _ } from "../core/Core";
import { Std } from "../std/Std";
import { Strings } from "../strings/Strings";
import { Functions } from "../functions/Functions";

export namespace Objects {
  type FromEntriesImpl<entries extends [PropertyKey, any]> = {
    [entry in entries as entry[0]]: entry[1];
  };

  export interface FromEntries extends Fn {
    return: FromEntriesImpl<Extract<this["arg0"], [PropertyKey, any]>>;
  }

  type EntriesImpl<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T];

  export interface Entries extends Fn {
    return: EntriesImpl<this["arg0"]>;
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

  export type Pick<key = unset, obj = unset> = Functions.PartialApply<
    PickFn,
    [key, obj]
  >;

  interface PickFn extends Fn {
    return: PickImpl<this["arg1"], this["arg0"]>;
  }
  type ReadonlyImpl<obj> = {
    readonly [key in keyof obj]: obj[key];
  };

  export interface Readonly extends Fn {
    return: ReadonlyImpl<this["arg0"]>;
  }

  type OmitImpl<obj, keys> = {
    [key in Exclude<keyof obj, keys>]: obj[key];
  };

  export type Omit<key = unset, obj = unset> = Functions.PartialApply<
    OmitFn,
    [key, obj]
  >;

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

  type PickByImpl<T, fn extends Fn> = FromEntriesImpl<
    PickEntriesImpl<EntriesImpl<T>, fn>
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

  type OmitByImpl<T, fn extends Fn> = FromEntriesImpl<
    OmitEntriesImpl<EntriesImpl<T>, fn>
  >;

  export interface OmitBy<fn extends Fn> extends Fn {
    return: OmitByImpl<this["arg0"], fn>;
  }

  type AssignImpl<xs extends readonly any[]> = Prettify<
    UnionToIntersection<xs[number]>
  >;

  export type Assign<
    arg1 = unset,
    arg2 = unset,
    arg3 = unset,
    arg4 = unset,
    arg5 = unset
  > = Functions.PartialApply<AssignFn, [arg1, arg2, arg3, arg4, arg5]>;

  interface AssignFn extends Fn {
    return: AssignImpl<this["args"]>;
  }

  type GroupByImplRec<xs, fn extends Fn, acc = {}> = xs extends [
    infer first,
    ...infer rest
  ]
    ? Call<fn, first> extends infer key extends PropertyKey
      ? GroupByImplRec<
          rest,
          fn,
          Std._Omit<acc, key> & {
            [K in key]: [
              ...(key extends keyof acc
                ? Extract<acc[key], readonly any[]>
                : []),
              first
            ];
          }
        >
      : never
    : acc;

  type GroupByImpl<xs, fn extends Fn> = Prettify<GroupByImplRec<xs, fn>>;

  export interface GroupBy<fn extends Fn> extends Fn {
    return: GroupByImpl<this["arg0"], fn>;
  }

  export type Get<
    path extends string | number | _ | unset = unset,
    obj = unset
  > = Functions.PartialApply<GetFn, [path, obj]>;

  export interface GetFn extends Fn {
    return: this["args"] extends [
      infer path extends string | number,
      infer obj,
      ...any
    ]
      ? GetFromPath<obj, path>
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
      ? CreateImpl<pattern, args>
      : never;
  }

  type CreateImpl<pattern, args extends unknown[]> = pattern extends arg<
    infer N extends number
  >
    ? args[N]
    : pattern extends Primitive
    ? pattern
    : pattern extends [any, ...any]
    ? { [key in keyof pattern]: CreateImpl<pattern[key], args> }
    : pattern extends (infer V)[]
    ? CreateImpl<V, args>[]
    : pattern extends object
    ? { [key in keyof pattern]: CreateImpl<pattern[key], args> }
    : pattern;

  export type Create<
    pattern = unset,
    arg0 = unset,
    arg1 = unset,
    arg2 = unset,
    arg3 = unset
  > = Functions.PartialApply<CreateFn, [pattern, arg0, arg1, arg2, arg3]>;

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
  > = Functions.PartialApply<RecordFn, [union, value]>;
}
