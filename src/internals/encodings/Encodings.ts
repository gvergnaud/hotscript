import { Fn, unset, _ } from "../core/Core";
import * as Impl from "./impl/encodings";
import { Functions } from "../functions/Functions";

export namespace Encodings {
  export type Btoa<s extends string | _ | unset = unset> =
    Functions.PartialApply<BtoaFn, [s]>;

  interface BtoaFn extends Fn {
    return: this["args"] extends [infer s extends string, ...any]
      ? Impl.Btoa<s>
      : never;
  }
}
