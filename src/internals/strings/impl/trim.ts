/**
 * Trim the left side of a string.
 * @param Str - The string to trim.
 * @param Sep - The separator to trim.
 * @returns The trimmed string.
 */
export type TrimLeft<
  Str,
  Sep extends string
> = Str extends `${Sep}${infer Rest}` ? TrimLeft<Rest, Sep> : Str;

/**
 * Trim the right side of a string.
 * @param Str - The string to trim.
 * @param Sep - The separator to trim.
 * @returns The trimmed string.
 */
export type TrimRight<
  Str,
  Sep extends string
> = Str extends `${infer Rest}${Sep}` ? TrimRight<Rest, Sep> : Str;

/**
 * Trim a string.
 * @param Str - The string to trim.
 * @param Sep - The separator to trim.
 * @returns The trimmed string.
 */
export type Trim<Str, Sep extends string> = TrimLeft<TrimRight<Str, Sep>, Sep>;
