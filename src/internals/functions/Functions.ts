import { Apply, Fn, MergeArgs, placeholder } from "../core/Core";

export namespace Functions {
  export type _ = placeholder;

  export interface Identity extends Fn {
    output: this["args"][0];
  }

  interface PipeableApplyPartial<fn extends Fn, partialArgs extends any[]>
    extends Fn {
    output: Apply<fn, MergeArgs<this["args"], partialArgs>>;
  }

  export type ApplyPartial<
    fn extends Fn,
    args extends any[]
  > = PipeableApplyPartial<fn, args>;

  type ParametersImpl<fn> = fn extends (...args: infer args) => any
    ? args
    : never;

  export interface Parameters extends Fn {
    output: ParametersImpl<this["args"][0]>;
  }

  export interface Parameter<N extends number> extends Fn {
    output: ParametersImpl<this["args"][0]>[N];
  }

  type ReturnImpl<fn> = fn extends (...args: any[]) => infer ret ? ret : never;

  export interface Return extends Fn {
    output: ReturnImpl<this["args"][0]>;
  }
}
