import * as H from "../../../helpers";

type ConcatSplits<
  Parts extends string[],
  Seps extends string[],
  Acc extends string[] = []
> = Parts extends [infer First extends string, ...infer Rest extends string[]]
  ? ConcatSplits<Rest, Seps, [...Acc, ...SplitManySep<First, Seps>]>
  : Acc;

type SplitManySep<
  Str extends string,
  Sep extends string[],
  Acc extends string[] = []
> = Sep extends [
  infer FirstSep extends string,
  ...infer RestSep extends string[]
]
  ? ConcatSplits<H.Split<Str, FirstSep>, RestSep>
  : [Str, ...Acc];

/**
 * Split a string into a tuple.
 * @param Str - The string to split.
 * @param Sep - The separator to split on, can be a union of strings of more than one character.
 * @returns The tuple of each split. if sep is an empty string, returns a tuple of each character.
 */
export type Split<
  Str,
  Sep extends string,
  Seps = H.UnionToTuple<Sep>
> = Seps extends string[]
  ? Str extends string
    ? SplitManySep<Str, Seps>
    : []
  : [];

/**
 * Split a string into a tuple with each character.
 * @param Str - The string to split.
 * @returns The tuple of each character.
 */
export type StringToTuple<Str, Acc extends string[] = []> = Str extends string
  ? Str extends `${infer First}${infer Rest}`
    ? StringToTuple<Rest, [...Acc, First]>
    : Acc
  : [];
