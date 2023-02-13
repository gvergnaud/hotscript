export type Negate<T extends number | bigint> =
  `${T}` extends `-${infer U extends number | bigint}`
    ? U
    : `-${T}` extends `${infer U extends number | bigint}`
    ? U
    : never;
