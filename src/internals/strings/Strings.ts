import { Fn } from "../core/Core";
import { Tuples } from "../tuples/Tuples";

export namespace Strings {
  export type Stringifiable =
    | string
    | number
    | boolean
    | bigint
    | null
    | undefined;

  type SplitImpl<
    str,
    sep extends string,
    output extends any[] = []
  > = str extends `${infer first}${sep}${infer rest}`
    ? SplitImpl<rest, sep, [...output, first]>
    : [...output, str];

  interface JoinReducer<sep extends string> extends Fn {
    output: this["args"] extends [
      infer acc extends Strings.Stringifiable,
      infer item extends Strings.Stringifiable
    ]
      ? `${acc extends "" ? "" : `${acc}${sep}`}${item}`
      : never;
  }

  export interface Join<sep extends string> extends Fn {
    output: Tuples.ReduceImpl<this["args"][0], "", JoinReducer<sep>>;
  }

  export interface Split<sep extends string> extends Fn {
    output: SplitImpl<this["args"][0], sep>;
  }

  export interface ToNumber extends Fn {
    output: this["args"][0] extends `${infer n extends number}` ? n : never;
  }

  export interface ToString extends Fn {
    output: `${Extract<this["args"][0], Strings.Stringifiable>}`;
  }

  export interface Prepend<str extends string> extends Fn {
    output: `${str}${Extract<this["args"][0], Strings.Stringifiable>}`;
  }

  export interface Append<str extends string> extends Fn {
    output: `${Extract<this["args"][0], Strings.Stringifiable>}${str}`;
  }
}
