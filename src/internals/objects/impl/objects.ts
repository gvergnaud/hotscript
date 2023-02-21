import { Apply, Call, Fn } from "../../core/Core";
import { Equal, Prettify, Primitive, UnionToIntersection } from "../../helpers";
import { Std } from "../../std/Std";

export type FromEntries<entries extends [PropertyKey, any]> = {
  [entry in entries as entry[0]]: entry[1];
};

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

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
            ...(key extends keyof acc ? Extract<acc[key], readonly any[]> : []),
            first
          ];
        }
      >
    : never
  : acc;

export type GroupBy<xs, fn extends Fn> = Prettify<GroupByImplRec<xs, fn>>;

export type Assign<xs extends readonly any[]> = Prettify<
  UnionToIntersection<xs[number]>
>;

export type GetFromPath<Obj, path> = RecursiveGet<Obj, ParsePath<path>>;

type ParsePath<
  path,
  output extends string[] = [],
  currentChunk extends string = ""
> = path extends number
  ? [`${path}`]
  : path extends `${infer first}${infer rest}`
  ? first extends "." | "[" | "]"
    ? ParsePath<
        rest,
        [...output, ...(currentChunk extends "" ? [] : [currentChunk])],
        ""
      >
    : ParsePath<rest, output, `${currentChunk}${first}`>
  : [...output, ...(currentChunk extends "" ? [] : [currentChunk])];

type RecursiveGet<Obj, pathList> = Obj extends any
  ? pathList extends [infer first, ...infer rest]
    ? first extends keyof Obj
      ? RecursiveGet<Obj[first], rest>
      : [first, Obj] extends [`${number}` | "number", any[]]
      ? RecursiveGet<Extract<Obj, any[]>[number], rest>
      : undefined
    : Obj
  : never;

export type Update<obj, path, fnOrValue> = RecursiveUpdate<
  obj,
  ParsePath<path>,
  fnOrValue
>;

type RecursiveUpdate<obj, pathList, fnOrValue> = obj extends any
  ? pathList extends [infer first, ...infer rest]
    ? first extends keyof obj
      ? {
          [K in keyof obj]: Equal<first, K> extends true
            ? RecursiveUpdate<obj[K], rest, fnOrValue>
            : obj[K];
        }
      : [first, obj] extends ["number", any[]]
      ? RecursiveUpdate<Extract<obj, any[]>[number], rest, fnOrValue>[]
      : undefined
    : fnOrValue extends Fn
    ? Call<Extract<fnOrValue, Fn>, obj>
    : fnOrValue
  : never;

export type Create<
  pattern,
  args extends unknown[]
> = pattern extends infer p extends Fn
  ? Apply<p, args>
  : pattern extends Primitive
  ? pattern
  : pattern extends [any, ...any]
  ? { [key in keyof pattern]: Create<pattern[key], args> }
  : pattern extends (infer V)[]
  ? Create<V, args>[]
  : pattern extends object
  ? { [key in keyof pattern]: Create<pattern[key], args> }
  : pattern;
