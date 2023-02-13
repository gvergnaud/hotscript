import { Apply, Fn, MergeArgs, placeholder } from "../core/Core";

export namespace Functions {
  export type _ = placeholder;

  interface PipeableApplyPartial<fn extends Fn, partialArgs extends any[]>
    extends Fn {
    output: Apply<fn, MergeArgs<this["args"], partialArgs>>;
  }

  export type ApplyPartial<
    fn extends Fn,
    args extends any[]
  > = PipeableApplyPartial<fn, args>;
}
