import * as H from "../../helpers";

export type Repeat<
  str,
  n extends any[],
  acc extends string = ""
> = H.Iterator.Get<n> extends 0
  ? acc
  : str extends string
  ? Repeat<str, H.Iterator.Prev<n>, `${str}${acc}`>
  : never;
