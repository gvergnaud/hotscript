import { Fn, MergeArgs, placeholder } from "../core/Core";
import { Tuples } from "../tuples/Tuples";

export namespace Numbers {
  type Add2Impl<a, b> = [...Tuples.Range<a>, ...Tuples.Range<b>]["length"];

  export interface Add<
    n1 extends number | placeholder = placeholder,
    n2 extends number | placeholder = placeholder
  > extends Fn {
    output: MergeArgs<this["args"], [n1, n2]> extends [infer a, infer b, ...any]
      ? Add2Impl<a, b>
      : never;
  }
}
