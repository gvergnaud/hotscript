import {
  GetFromPath,
  IsArrayStrict,
  Prettify,
  UnionToIntersection,
} from "../helpers";
import { Call, Call2, Fn, MergeArgs, placeholder } from "../core/Core";
import { Std } from "../std/Std";
import { Strings } from "../strings/Strings";

export namespace Objects {
  type FromEntriesImpl<entries extends [PropertyKey, any]> = {
    [entry in entries as entry[0]]: entry[1];
  };

  export interface FromEntries extends Fn {
    output: FromEntriesImpl<Extract<this["args"][0], [PropertyKey, any]>>;
  }

  type EntriesImpl<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T];

  export interface Entries extends Fn {
    output: EntriesImpl<this["args"][0]>;
  }

  type MapValuesImpl<T, fn extends Fn> = {
    [K in keyof T]: Call2<fn, T[K], K>;
  };

  export interface MapValues<fn extends Fn> extends Fn {
    output: MapValuesImpl<this["args"][0], fn>;
  }

  type MapKeysImpl<T, fn extends Fn> = {
    [K in keyof T as Extract<Call<fn, K>, PropertyKey>]: T[K];
  };

  export interface MapKeys<fn extends Fn> extends Fn {
    output: MapKeysImpl<this["args"][0], fn>;
  }

  export interface KebabCase extends Fn {
    output: Call<MapKeys<Strings.KebabCase>, this["args"][0]>;
  }

  export interface SnakeCase extends Fn {
    output: Call<MapKeys<Strings.SnakeCase>, this["args"][0]>;
  }

  export interface CamelCase extends Fn {
    output: Call<MapKeys<Strings.CamelCase>, this["args"][0]>;
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
    output: MapKeysDeepImpl<this["args"][0], fn>;
  }

  export interface KebabCaseDeep extends Fn {
    output: Call<MapKeysDeep<Strings.KebabCase>, this["args"][0]>;
  }

  export interface SnakeCaseDeep extends Fn {
    output: Call<MapKeysDeep<Strings.SnakeCase>, this["args"][0]>;
  }

  export interface CamelCaseDeep extends Fn {
    output: Call<MapKeysDeep<Strings.CamelCase>, this["args"][0]>;
  }

  type PickImpl<obj, keys> = {
    [key in Extract<keyof obj, keys>]: obj[key];
  };

  export interface Pick<key> extends Fn {
    output: PickImpl<this["args"][0], key>;
  }

  type OmitImpl<obj, keys> = {
    [key in Exclude<keyof obj, keys>]: obj[key];
  };

  export interface Omit<key> extends Fn {
    output: OmitImpl<this["args"][0], key>;
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
    output: PickByImpl<this["args"][0], fn>;
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
    output: OmitByImpl<this["args"][0], fn>;
  }

  type AssignImpl<xs extends readonly any[]> = Prettify<
    UnionToIntersection<xs[number]>
  >;

  export interface Assign<
    arg1 = placeholder,
    arg2 = placeholder,
    arg3 = placeholder
  > extends Fn {
    output: AssignImpl<MergeArgs<this["args"], [arg1, arg2, arg3]>>;
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
    output: GroupByImpl<this["args"][0], fn>;
  }

  export interface Get<
    _path extends string | placeholder = placeholder,
    _obj = placeholder
  > extends Fn {
    output: MergeArgs<this["args"], [_obj, _path]> extends [
      infer obj,
      infer path extends string,
      ...any
    ]
      ? GetFromPath<obj, path>
      : never;
  }
}
