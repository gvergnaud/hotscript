export namespace Std {
  export type _Pick<a, k extends keyof a> = Pick<a, k>;
  export type _Omit<a, k extends PropertyKey> = Omit<a, k>;
  export type _Extract<a, b> = Extract<a, b>;
  export type _Exclude<a, b> = Exclude<a, b>;
}
