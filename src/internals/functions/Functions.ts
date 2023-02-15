import { Apply, Fn } from "../core/Core";
import { MergeArgs } from "./impl/MergeArgs";

export namespace Functions {
  export interface Identity extends Fn {
    return: Fn.arg0<this>;
  }

  export interface Constant<T> extends Fn {
    return: T;
  }

  type ParametersImpl<fn> = fn extends (...args: infer args) => any
    ? args
    : never;

  export interface Parameters extends Fn {
    return: ParametersImpl<Fn.arg0<this>>;
  }

  export interface Parameter<N extends number> extends Fn {
    return: ParametersImpl<Fn.arg0<this>>[N];
  }

  type ReturnImpl<fn> = fn extends (...args: any[]) => infer ret ? ret : never;

  export interface Return extends Fn {
    return: ReturnImpl<Fn.arg0<this>>;
  }

  type Head<xs> = xs extends [infer first, ...any] ? first : never;

  type ComposeImpl<fns extends Fn[], args extends any[]> = fns extends [
    ...infer rest extends Fn[],
    infer last extends Fn
  ]
    ? ComposeImpl<rest, [Apply<last, args>]>
    : Head<args>;

  export interface Compose<fns extends Fn[]> extends Fn {
    return: ComposeImpl<fns, Fn.args<this>>;
  }

  type ComposeLeftImpl<fns extends Fn[], args extends any[]> = fns extends [
    infer first extends Fn,
    ...infer rest extends Fn[]
  ]
    ? ComposeLeftImpl<rest, [Apply<first, args>]>
    : Head<args>;

  export interface ComposeLeft<fns extends Fn[]> extends Fn {
    return: ComposeLeftImpl<fns, Fn.args<this>>;
  }

  export interface PartialApply<fn extends Fn, partialArgs extends unknown[]>
    extends Fn {
    return: MergeArgs<
      Fn.args<this>,
      partialArgs
    > extends infer args extends unknown[]
      ? Apply<fn, args>
      : never;
  }
}
