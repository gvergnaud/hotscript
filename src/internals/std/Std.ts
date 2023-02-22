export namespace Std {
  export type _Pick<a, k extends keyof a> = Pick<a, k>;
  export type _Omit<a, k extends PropertyKey> = Omit<a, k>;
  export type _Extract<a, b> = Extract<a, b>;
  export type _Exclude<a, b> = Exclude<a, b>;
  export type _Uppercase<a extends string> = Uppercase<a>;
  export type _Lowercase<a extends string> = Lowercase<a>;
  export type _Capitalize<a extends string> = Capitalize<a>;
  export type _Uncapitalize<a extends string> = Uncapitalize<a>;
  export type _Record<k extends PropertyKey, v> = Record<k, v>;
  export type _Readonly<a> = Readonly<a>;
  export type _Required<a> = Required<a>;
}
