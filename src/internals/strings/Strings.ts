import { Fn } from "../core/Core";
import { Std } from "../std/Std";
import { Tuples } from "../tuples/Tuples";
import * as H from "../../helpers";

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

  export interface Join<sep extends string> extends Fn {
    output: Tuples.ReduceImpl<this["args"][0], "", JoinReducer<sep>>;
  }

  export interface Split<sep extends string> extends Fn {
    output: H.Split<this["args"][0], sep>;
  }

  export interface ToNumber extends Fn {
    output: this["args"][0] extends `${infer n extends number | bigint}`
      ? n
      : never;
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

  export interface Uppercase extends Fn {
    output: Std._Uppercase<Extract<this["args"][0], string>>;
  }

  export interface Lowercase extends Fn {
    output: Std._Lowercase<Extract<this["args"][0], string>>;
  }

  export interface Capitalize extends Fn {
    output: Std._Capitalize<Extract<this["args"][0], string>>;
  }

  export interface Uncapitalize extends Fn {
    output: Std._Uncapitalize<Extract<this["args"][0], string>>;
  }

  export interface SnakeCase extends Fn {
    output: H.SnakeCase<this["args"][0]>;
  }

  export interface CamelCase extends Fn {
    output: H.CamelCase<this["args"][0]>;
  }

  export interface KebabCase extends Fn {
    output: H.KebabCase<this["args"][0]>;
  }
}
