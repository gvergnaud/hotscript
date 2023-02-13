import { Fn } from "../core/Core";
import { Std } from "../std/Std";

export namespace Unions {
  export interface Extract<key> extends Fn {
    output: Std._Extract<this["args"][0], key>;
  }

  export interface Exclude<key> extends Fn {
    output: Std._Exclude<this["args"][0], key>;
  }
}
