import { Args } from "../../args/Args";
import { unset } from "../../core/Core";
import { IsNever, RemoveUnknownArrayConstraint } from "../../helpers";

type ExcludePlaceholders<xs, output extends any[] = []> = xs extends [
  infer first,
  ...infer rest
]
  ? first extends Args._
    ? ExcludePlaceholders<rest, output>
    : ExcludePlaceholders<rest, [...output, first]>
  : output;

type MergeArgsRec<
  pipedArgs extends any[],
  partialArgs extends any[],
  output extends any[] = []
> = partialArgs extends [infer partialFirst, ...infer partialRest]
  ? [partialFirst] extends [never]
    ? MergeArgsRec<pipedArgs, partialRest, [...output, partialFirst]>
    : [partialFirst] extends [Args._]
    ? pipedArgs extends [infer pipedFirst, ...infer pipedRest]
      ? MergeArgsRec<pipedRest, partialRest, [...output, pipedFirst]>
      : [...output, ...ExcludePlaceholders<partialRest>]
    : MergeArgsRec<pipedArgs, partialRest, [...output, partialFirst]>
  : [...output, ...pipedArgs];

type EmptyIntoPlaceholder<x> = IsNever<x> extends true
  ? never
  : [x] extends [unset]
  ? Args._
  : x;

type MapEmptyIntoPlaceholder<xs, output extends any[] = []> = xs extends [
  infer first,
  ...infer rest
]
  ? MapEmptyIntoPlaceholder<rest, [...output, EmptyIntoPlaceholder<first>]>
  : output;

export type MergeArgs<
  pipedArgs extends any[],
  partialArgs extends any[]
> = MergeArgsRec<
  RemoveUnknownArrayConstraint<pipedArgs>,
  MapEmptyIntoPlaceholder<partialArgs>
>;
