import { Add } from "../../numbers/impl/addition";
import { Mul } from "../../numbers/impl/multiply";

export namespace StringIterator {
  type Iter = [string, number | bigint];
  /**
   * Iterator over the string is a linked list of [string, number] pairs
   * where the string is the pattern to match any character in the string 'N' times
   * and the number is the value 'N' of the pattern
   * the linked list allows to easily add iterate and reverse iterate
   */
  export type Iterator = [Iter, ...Iter[]];
  /**
   * The initial iterator is a list of one element
   *
   * @description we need to prefix the pattern with '$'
   *
   * to avoid typescript to merge multiple patterns into one
   */
  export type Init = [[`$${string}`, 1]];
  /**
   * The string is the pattern to match any character in the string 'N' times
   *
   * @param It - the iterator to get the string from
   * @returns the string
   */
  export type String<It extends Iterator> = It[0][0];
  /**
   * The value is the number 'N' of the pattern
   *
   * @param It - the iterator to get the value from
   * @returns the value
   */
  export type Value<It extends Iterator> = It[0][1];
  /**
   * The size is the number of elements in the linked list
   *
   * @param It - the iterator to get the size from
   * @returns the size
   */
  export type Size<It extends Iterator> = It["length"];
  /**
   * Get the next iterator
   *
   * @param It - the iterator to get the next iterator from
   * @returns the next iterator
   */
  export type Next<It extends Iterator> = [
    [`${String<It>}${string}`, Add<Value<It>, 1>],
    ...It
  ];
  /**
   * Get the previous iterator
   * @param It - the iterator to get the previous iterator from
   * @returns the previous iterator
   */
  export type Prev<It extends Iterator> = It extends [
    unknown,
    ...infer Rest extends Iterator
  ]
    ? Rest
    : undefined;
  /**
   * Double the iterator to match any character in the string '2N' times
   * This allows the algorithm to be O(log(N)) instead of O(N)
   *
   * @description we need to prefix the pattern with '$' and suffix it with '_'
   * to avoid typescript to merge multiple patterns into one
   *
   * @param It - the iterator to double
   * @returns the doubled iterator
   */
  export type Double<It extends Iterator> =
    `${String<It>}_` extends `$${infer pattern}`
      ? `${String<It>}${pattern}` extends `${infer double}_`
        ? [[double, Mul<Value<It>, 2>], ...It]
        : never
      : never;

  /**
   * Cut the string at the iterator
   *
   * @param T - the string to cut
   * @param It - the iterator to cut at
   * @returns the rest of the string
   */
  export type CutAt<
    T extends string,
    It extends Iterator
  > = `$${T}` extends `${String<It>}${infer $Rest}` ? $Rest : undefined;
}
