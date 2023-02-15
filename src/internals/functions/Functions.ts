import { Apply, Fn } from "../core/Core";
import { MergeArgs } from "./impl/MergeArgs";

export namespace Functions {
  export interface Identity extends Fn {
    return: this["arg0"];
  }

  export interface Constant<T> extends Fn {
    return: T;
  }

  type ParametersImpl<fn> = fn extends (...args: infer args) => any
    ? args
    : never;

  export interface Parameters extends Fn {
    return: ParametersImpl<this["arg0"]>;
  }

  export interface Parameter<N extends number> extends Fn {
    return: ParametersImpl<this["arg0"]>[N];
  }

  type ReturnImpl<fn> = fn extends (...args: any[]) => infer ret ? ret : never;

  export interface Return extends Fn {
    return: ReturnImpl<this["arg0"]>;
  }

  type Head<xs> = xs extends [infer first, ...any] ? first : never;

  type ComposeImpl<fns extends Fn[], args extends any[]> = fns extends [
    ...infer rest extends Fn[],
    infer last extends Fn
  ]
    ? ComposeImpl<rest, [Apply<last, args>]>
    : Head<args>;

  export interface Compose<fns extends Fn[]> extends Fn {
    return: ComposeImpl<fns, this["args"]>;
  }

  type ComposeLeftImpl<fns extends Fn[], args extends any[]> = fns extends [
    infer first extends Fn,
    ...infer rest extends Fn[]
  ]
    ? ComposeLeftImpl<rest, [Apply<first, args>]>
    : Head<args>;

  export interface ComposeLeft<fns extends Fn[]> extends Fn {
    return: ComposeLeftImpl<fns, this["args"]>;
  }

  export interface PartialApply<fn extends Fn, partialArgs extends unknown[]>
    extends Fn {
    return: MergeArgs<
      this["args"],
      partialArgs
    > extends infer args extends unknown[]
      ? Apply<fn, args>
      : never;
  }
}
