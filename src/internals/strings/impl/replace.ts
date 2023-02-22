import { Fn } from "../../core/Core";

export type Replace<
  Str,
  From extends string,
  To extends string
> = Str extends string
  ? Str extends `${infer Before}${From}${infer After}`
    ? Replace<`${Before}${To}${After}`, From, To>
    : Str
  : Str;

export interface ReplaceReducer<To extends string> extends Fn {
  return: this["args"] extends [
    infer Str extends string,
    infer From extends string,
    ...any
  ]
    ? Replace<Str, From, To>
    : never;
}
