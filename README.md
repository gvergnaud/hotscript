# Higher-Order TypeScript (HOTScript)

A library of composable functions for the type level!

Transform your TypeScript types in any way you want using functions you already know.

![image](https://user-images.githubusercontent.com/9265418/223854503-b54f6a62-9f21-4953-aaa3-5d54699516a7.png)

## Features

- Type-level higher-order functions (`Tuples.Map`, `Tuples.Filter`, `Objects.MapValues`, etc).
- Type-level pattern matching with `Match`.
- Performant math operations (`Numbers.Add`, `Numbers.Sub`, `Numbers.Mul`, `Numbers.Div`, etc).
- Custom "lambda" functions.

🚧 work in progress 🚧

## Installation

You can find HotScript on npm:

```ts
npm install -D hotscript
```

HotScript is a work-in-progress library, so expect **breaking changes** in its API.

## Examples

#### Transforming a list

[Run this as a TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgBWGApgGjgFQK5gA26AztgMoxTAB2A5mXAHJ4gBG6UJcAvnAGZQIIOACIAFhBgkAxtTAxRAbgBQKmAE8McKKQCMcALwo06ADwq4cAPTWrAPQD8cAGwAmS3ADae7G+wAzNgALAC6mJ5enlb4RKQAdACyAIZgZizsnCTxAIIAJnlmAQB8xdhWFTZ2XsHYAKzYLtgA7KHRuATE2QBSELRmovGiZZWjY1a2YsHxdfEu8c2i7ZTU9NnkRMAwA0Mj4+OTXqLBotiidadiLpeii22VsV1JqWYrtAzxyLoYNIWiesMRod-icznoLmDrmC7u1HgkUmk3mt4jgIBkOFA9hVDnpanBwdg9E18a1YZ0EuRWPtqQc7O5PG1ikogA)

<!-- prettier-ignore -->
```ts
import { Pipe, Tuples, Strings, Numbers } from "hotscript";

type res1 = Pipe<
  //  ^? 62
  [1, 2, 3, 4],
  [
    Tuples.Map<Numbers.Add<3>>,       // [4, 5, 6, 7]
    Tuples.Join<".">,                 // "4.5.6.7"
    Strings.Split<".">,               // ["4", "5", "6", "7"]
    Tuples.Map<Strings.Prepend<"1">>, // ["14", "15", "16", "17"]
    Tuples.Map<Strings.ToNumber>,     // [14, 15, 16, 17]
    Tuples.Sum                        // 62
  ]
>;
```

#### Defining a first-class function

[Run this as a TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgYQIYBt0Bo4DEB2OAKgK5joCmAznAL5wBmUEIcARABYQxUDGUwMDDYBuAFBiA9JLhEOwGgrio4MAJ5gKAWkoA3CunbpUIAEYATVGwCEY4PhgUoDVLwpwAImXTBeqR3AUAB6O+OY0BIhicHBQFDAkUPgAXHAA2jDyVGlsqFAA5gAMbAC6OJkKOXlFpSXitBLqmrHUJOgwAIxwALwoGOgAPKTk1AB0ALKoYANe5L7+FAB8OGkdOABMOADMOAAsJYvi0jEnAHoA-I0a7nFUbTDrPX2YQ95juMYwk9OzPn6Oy3SazgmzgOzg+0OUhkJzgFyAA)

```ts
import { Call, Fn, Tuples } from "hotscript";

// This is a type-level "lambda"!
interface Duplicate extends Fn {
  return: [this["arg0"], this["arg0"]];
}

type result1 = Call<Tuples.Map<Duplicate>, [1, 2, 3, 4]>;
//     ^? [[1, 1], [2, 2], [3, 3], [4, 4]]

type result2 = Call<Tuples.FlatMap<Duplicate>, [1, 2, 3, 4]>;
//     ^? [1, 1, 2, 2, 3, 3, 4, 4]
```

#### Transforming an object type

[Run this as a TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgBWGApgGjgeQEYBW6AxjAM7YBCEEANugIYB2ZcAvnAGZQQhwBEACwjliUNDH4BuAFAyA9PLgAZdDADkrYr0hl0cMr32cArk1LAILODAg2ozMp2h9mcCIRLwYATwwAuGV8MOAAVCABBZABJZAYfWggGABMAHlCAPjgAXhQ0dFSZODDMIrgAbTLi-CJSMgA6HBBgGEofVOo6RhZ6gFEARxMGWjJUsh8QPDoMjNLi6s86+oiyMmAAcyZUpBA1FIYYBn9EOCZ0AHcAVT0oY5goE30ONlmq3EXyeoBlJgYAa3QAGEGHoACLodBgObzGpeBorNabbZwYDJY5ke7AJjrdgZMoAXRkGVkwX0UWi13QUByYUiMTiCSSaQQZUU8wAegB+Mqo9ETKa0WTFTjAKAYgByDF26Mx2KFcFoIJgkulBll61kL1kbIASmoTFAWIFSWEaSziry1eI5WVdodkgcjiczucAPomG53B5PeUisUwV2-VUY60asqKjGBqXoGWhzVSIA)

```ts
import { Pipe, Objects, Booleans } from "hotscript";

// Let's compose some functions to transform an object type:
type ToAPIPayload<T> = Pipe<
  T,
  [
    Objects.OmitBy<Booleans.Equals<symbol>>,
    Objects.Assign<{ metadata: { newUser: true } }>,
    Objects.SnakeCaseDeep,
    Objects.Assign<{ id: string }>
  ]
>;
type T = ToAPIPayload<{
  id: symbol;
  firstName: string;
  lastName: string;
}>;
// Returns:
type T = {
  id: string;
  metadata: { new_user: true };
  first_name: string;
  last_name: string;
};
```

#### Parsing a route path

[Run this as a TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgBWGApgGjgeQEYBW6AxjAM7YDKMUwAdgOYVwDCE4EZ6AMugGYxsAFQCuYADbpmAWQCGMYgAs4AXzh8o7OACJFEcsVpgY2gNwAoczACeGOFCkBWOAF4UadAB5zcOAHo-X18APQB+Hx0-ES4oMj9PYAATAC4yGnoGAD4-SDS4hLpE9AAPZLoREDx0KEztTAiAbQjfalpGMgA6SglgGE9tP21M+qC4UQkpDoAxYHEYas9WjM7qWVgyAHVexX7+zOHmsbFJTrkwb1HfNg4uXgFPJsugpfaOoVoQXe04AB8dWoOTxa6Ve3XEvX6ySGI0uAF1ModAUFxic3hAAKp0YAQOgw3z4IikTpTTQgACidHSUjxuEIJHIHTOADVZOIRFILpc5Aodo8gdylB0tjAdto0m0GHU4OKMkingLFELtv1ypVqlLVVUaodfPDERFYeZMqYgA)

https://user-images.githubusercontent.com/2315749/222081717-96217cd2-ac89-4e06-a942-17fbda717cd2.mp4

```ts
import { Pipe, Objects, Strings, ComposeLeft, Tuples, Match } from "hotscript";

type res5 = Pipe<
  //    ^? { id: string, index: number }
  "/users/<id:string>/posts/<index:number>",
  [
    Strings.Split<"/">,
    Tuples.Filter<Strings.StartsWith<"<">>,
    Tuples.Map<ComposeLeft<[Strings.Trim<"<" | ">">, Strings.Split<":">]>>,
    Tuples.ToUnion,
    Objects.FromEntries,
    Objects.MapValues<
      Match<[Match.With<"string", string>, Match.With<"number", number>]>
    >
  ]
>;
```
### Make querySelector typesafe

[Run this as a TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAKjgQwM5wBJwGZQiOAcgAsIZUBjKYMGQgKHoBMBTCgG2ShZwFcA7CjGAR+cAI68WUAJ4BlFuzYxoAHgAqcFgA8YLfk3SoY1fgHMAfAApUi5dABccdQEonAUSUh9MAGJ4QBSUhNXULOAAfOH5ednZGYH49KGxkCh51agIdPQN0DAA6XzEAb3o4CrhuGF4ofgdyyphiYFQAbQAiLjMABg6AXS1dfUM4AAMAEhLE7Gk4AAVuADcAXzgAGimZuYA5HJWxuAB+RorCiY0s9fGpxZZVzZK93QPwhsq4ZtbO7r7BnJG6Em034sygC2WK2uW1Bu32hxOH3Ol1A12BdweU2eMFecHeTRa7S6UF6AyGuVGwO24IxKwcrSsMLBcE8KxcTLmACUWMYDsdTpgChdMqibiVaVNWVNubyxm8BV8ib8yQC8mLqRD7nSAO7EaQsRkg5ms9lGrk8nEIgXIkUgNG3SGS9graUW3H4iqKn4kv7kwHq2Hg1mG4ymMxsjngmWW-lIoUou1iqUlaPuhWE72k-7DNVUwMs51tKahxLh-qRuCpq1x4VXJPO12y+UfL3ErP0FaMGAyMA8TwsbxJfz4IL2KAacIAXkF8xoLA01zaAtt62tBTkJlLqHXYHYwBgqkIRAsq7j6l4u55BQAMmgYKfKoUN2Ht3Jd-vD+tCCe1+fL9v1AgABVfgRH4B8znXTdzFfd8Dw6BwOkiOAOk6ZCOgKJCog6ABiDofzPC8lG3ABBA8egIx8CgAWWQGAKGIVQlw+ONaPo4gCgAdX3RiAGsWBkCBsEwdRqOvftBxgdRkDMHZkG8WiwGuQoAHkACMACtlG3ABxFgD0KAB9ZTRPErwfGk2T5JYRSLEoljBTYhiuJ41RkH4GQTLEiSfAsAV+j8gLGHoChRGMKoeR6OBp0kaR5DsEIoCsDoEA6FwAG56AAeiyliAD0TlC-hwu4VAAEZookKRZFHRLkrANLMpy-LCrC+BSoAJkq2KaoSlQko6JhgCWAoODQVA5O8Rrstyj4CpCtqItQABmbrqvi4J+uSoaljgcJkGm5q5ta4r2p5AAWNa4tqraOjANo6JMfpDtmyp5qKkqeQAViu3rNugbbhrgMACj0XQUDaYhuGwSdCBwwhnoymaWoW06loANl+jax2SnDgCYF6UY+s7UAAdixm6AcG4aHpgJ6HGINArDAPa4FDUQzBcQnjtRz7UAADgpvqqfpVArB22mnuuMAuaRo63pOvmAE4hf+gaJceqB+mlyWtYZpmWfCdnzFlprXoqd7FtKsqopi9bKfVoG3kZsXkFZ0WrDU64KBcWXkZ54L6CAA)
```ts
import * as H from 'hotscript'

declare function querySelector<T extends string>(selector: T): ElementFromSelector<T> | null

interface Trim extends H.Fn {
    return:
    this["arg0"] extends `${infer Prev} ,${infer Next}` ?
    H.$<Trim, `${Prev},${Next}`> :
    this["arg0"] extends `${infer Prev}, ${infer Next}` ?
    H.$<Trim, `${Prev},${Next}`> :
    this["arg0"] extends `${infer Prev}:is(${infer El})${infer Rest}` ?
    H.$<Trim, `${Prev}${El}${Rest}`> :
    this["arg0"] extends `${infer Prev}:where(${infer El})${infer Rest}` ?
    H.$<Trim, `${Prev}${El}${Rest}`> :
    this["arg0"] extends `${infer El}(${string})${infer Rest}` ?
    H.$<Trim, `${El}${Rest}`> :
    this["arg0"] extends `${infer El}[${string}]${infer Rest}` ?
    H.$<Trim, `${El}${Rest}`> :
    this["arg0"]
}

type ElementFromSelector<T> = H.Pipe<T, [
    Trim,
    H.Strings.Split<' '>,
    H.Tuples.Last,
    H.Strings.Split<','>,
    H.Tuples.ToUnion,
    H.Strings.Split<":" | "[" | "." | "#">,
    H.Tuples.At<0>,
    H.Match<[
        H.Match.With<keyof HTMLElementTagNameMap, H.Objects.Get<H._, HTMLElementTagNameMap>>,
        H.Match.With<any, HTMLElement>
    ]>
]>
```
![image](https://github.com/gvergnaud/hotscript/assets/633115/d75fe58e-e677-4ead-9cd2-b82a32d0cec7)


## API

- [x] Core
  - [x] `Pipe<Input, Fn[]>`: Pipes a type through several functions.
  - [x] `PipeRight<Fn[], Input>`: Pipe a type from right to left.
  - [x] `Call<Fn, ...Arg>`: Call a type level `Fn` function.
  - [x] `Apply<Fn, Arg[]>`: Apply several arguments to an `Fn` function.
  - [x] `PartialApply<Fn, Arg[]>`: Make an `Fn` partially applicable.
  - [x] `Compose<Fn[]>`: Compose `Fn` functions from right to left.
  - [x] `ComposeLeft<Fn[]>`: Compose `Fn` functions from left to right.
  - [x] `args`, `arg0`, `arg1`, `arg2`, `arg3`: Access piped parameters (Useful in combination with `Objects.Create`).
  - [x] `_`: Placeholder to partially apply any built-in functions, or functions created with `PartialApply`.
- [x] Function
  - [x] `ReturnType<FunctionType>`: Extract the return type from a function type.
  - [x] `Parameters<FunctionType>`: Extract the parameters from a function type as a tuple.
  - [x] `Parameter<N, FunctionType>`: Extract the parameter at index `N` from a function type.
  - [x] `MapReturnType<Fn, FunctionType>`: Transform the return type of a function type using an `Fn`.
  - [x] `MapParameters<Fn, FunctionType>`: Transform the tuple of parameters of a function type using an `Fn`.
- [x] Tuples
  - [x] `Create<X> -> [X]`: Create a unary tuple from a type.
  - [x] `Partition<Fn, Tuple>`: Using a predicate `Fn`, turn a list of types into two lists `[Passing[], Rejected[]]`.
  - [x] `IsEmpty<Tuple>`: Check if a tuple is empty.
  - [x] `Zip<...Tuple[]>`: Zips several tuples together. For example. it would turn `[[a,b,c], [1,2,3]]` into `[[a, 1], [b, 2], [c, 3]]`.
  - [x] `ZipWith<Fn, ...Tuple[]>`: Zip several tuples by calling a zipper `Fn` with one argument per input tuple.
  - [x] `Sort<Tuple>`: Sorts a tuple of number literals.
  - [x] `Head<Tuple>`: Returns the first element from a tuple type.
  - [x] `Tail<Tuple>`: Drops the first element from a tuple type.
  - [x] `At<N, Tuple>`: Returns the `N`th element from a tuple.
  - [x] `Last<Tuple>`: Returns the last element from a tuple.
  - [x] `FlatMap<Fn, Tuple>`: Calls an `Fn` function returning a tuple on each element of the input tuple, and flattens all of the returned tuples into a single one.
  - [x] `Find<Fn, Tuple>`: Finds an element from a tuple using a predicate `Fn`.
  - [x] `Drop<N, Tuple>`: Drops the `N` first elements from a tuple.
  - [x] `Take<N, Tuple>`: Takes the `N` first elements from a tuple.
  - [x] `TakeWhile<Fn, Tuple>`: Take elements while the `Fn` predicate returns `true`.
  - [x] `GroupBy<Fn, Tuple>`: Transform a list into an object containing lists. The `Fn` function takes each element and returns the key it should be added to.
  - [x] `Join<Str, Tuple>`: Joins several strings together using the `Str` separator string.
  - [x] `Map<Fn, Tuple>`: Transforms each element in a tuple.
  - [x] `Filter<Fn, Tuple>`: Removes elements from a tuple if the `Fn` predicate function doesn't return `true`.
  - [x] `Reduce<Fn, Init, Tuple>`: Iterates over a tuple a reduce it to a single function using a reducer `Fn`.
  - [x] `ReduceRight<Fn, Init, Tuple>`: like `Reduce`, but starting from the end of the list.
  - [x] `Reverse<Tuple>`: Reverses the tuple.
  - [x] `Every<Fn, Tuple>`: Checks if all element passes the `Fn` predicate.
  - [x] `Some<Fn, Tuple>`: Checks if at least one element passes the `Fn` predicate.
  - [x] `SplitAt<N, Tuple>`: Split a tuple into a left and a right tuple using an index.
  - [x] `ToUnion<Tuple>`: Turns a tuple into a union of elements.
  - [x] `ToIntersection<Tuple>`: Turns a tuple into an intersection of elements.
  - [x] `Prepend<X, Tuple>`: Adds a type at the beginning of a tuple.
  - [x] `Append<X, Tuple>`: Adds a type at the end of a tuple.
  - [x] `Concat<T1, T2>`: Merges two tuples together.
  - [x] `Min<Tuple>`: Returns the minimum number in a list of number literal types.
  - [x] `Max<Tuple>`: Returns the maximum number in a list of number literal types.
  - [x] `Sum<Tuple>`: Add all numbers in a list of number literal types together.
- [x] Object
  - [x] `Readonly<Obj>`: Makes all object keys `readonly`.
  - [x] `Mutable<Obj>`: Removes `readonly` from all object keys.
  - [x] `Required<Obj>`: Makes all keys required.
  - [x] `Partial<Obj>`: Makes all keys optional.
  - [x] `ReadonlyDeep<Obj>`: Recursively makes all object keys `readonly`.
  - [x] `MutableDeep<Obj>`: Recursively removes `readonly` from all object keys.
  - [x] `RequiredDeep<Obj>`: Recursively makes all keys required.
  - [x] `PartialDeep<Obj>`: Recursively makes all keys optional.
  - [x] `Update<Path, Fn | V, Obj>`: Immutably update an object's field under a certain path. Paths are dot-separated strings: `a.b.c`.
  - [x] `Record<Key, Value>`: Creates an object type with keys of type `Key` and values of type `Value`.
  - [x] `Keys<Obj>`: Extracts the keys from an object type `Obj`.
  - [x] `Values<Obj>`: Extracts the values from an object type `Obj`.
  - [x] `AllPaths<Obj>`: Extracts all possible paths of an object type `Obj`.
  - [x] `Create<Pattern, X>`: Creates an object of type Pattern with values of type X.
  - [x] `Get<Path, Obj>`: Gets the value at the specified path `Path` in the object `Obj`.
  - [x] `FromEntries<[Key, Value]>`: Creates an object from a union of key-value pairs.
  - [x] `Entries<Obj>`: Extracts the union of key-value pairs from an object type `Obj`.
  - [x] `MapValues<Fn, Obj>`: Transforms the values of an object type `Obj` using a mapper function `Fn`.
  - [x] `MapKeys<Fn, Obj>`: Transforms the keys of an object type `Obj` using a mapper function `Fn`.
  - [x] `Assign<...Obj>`: Merges multiple objects together.
  - [x] `Pick<Key, Obj>`: Picks specific keys `Key` from an object type `Obj`.
  - [x] `PickBy<Fn, Obj>`: Picks keys from an object type `Obj` based on a predicate function `Fn`.
  - [x] `Omit<Key, Obj>`: Omits specific keys `Key` from an object type `Obj`.
  - [x] `OmitBy<Fn, Obj>`: Omits keys from an object type `Obj` based on a predicate function `Fn`.
  - [x] `CamelCase<Obj>`: Converts the keys of an object type `Obj` to camelCase.
  - [x] `CamelCaseDeep<Obj>`: Recursively converts the keys of an object type `Obj` to camelCase.
  - [x] `SnakeCase<Obj>`: Converts the keys of an object type `Obj` to snake_case.
  - [x] `SnakeCaseDeep<Obj>`: Recursively converts the keys of an object `type` Obj to snake_case.
  - [x] `KebabCase<Obj>`: Converts the keys of an object type `Obj` to kebab-case.
  - [x] `KebabCaseDeep<Obj>`: Recursively converts the keys of an object type Obj to kebab-case.
- [x] Union
  - [x] `Map<Fn, U>`: Transforms each member of a union type `U` using a mapper function `Fn`.
  - [x] `Extract<T, U>`: Extracts the subset of a union type `U` that is assignable to type `T`.
  - [x] `ExtractBy<Fn, U>`: Extracts the subset of a union type`U`that satisfies the predicate function `Fn`.
  - [x] `Exclude<T, U>`: Excludes the subset of a union type`U`that is assignable to type `T`.
  - [x] `ExcludeBy<Fn, U>`: Excludes the subset of a union type`U`that satisfies the predicate function `Fn`.
  - [x] `NonNullable<U>`: Removes null and undefined from a union type `U`.
  - [x] `ToTuple<U>`: Converts a union type`U`to a tuple type.
  - [x] `ToIntersection<U>`: Converts a union type`U`to an intersection type.
- [x] String
  - [x] `Length<Str>`: Returns the length of a string type `Str`.
  - [x] `TrimLeft<Char, Str>`: Removes the specified character from the left side of a string type `Str`.
  - [x] `TrimRight<Char, Str>`: Removes the specified character from the right side of a string type `Str`.
  - [x] `Trim<Char, Str>`: Removes the specified character from both sides of a string type `Str`.
  - [x] `Join<Sep, Str>`: Joins multiple string type `Str` with a separator `Sep`.
  - [x] `Replace<From, To, Str>`: Replaces all occurrences of a substring `From` with another substring `To` in a string type `Str`.
  - [x] `Slice<Start, End, Str>`: Extracts a portion of a string type `Str` from index `Start` to index `End`.
  - [x] `Split<Sep, Str>`: Splits a string type `Str` into a tuple of substrings using a separator `Sep`.
  - [x] `Repeat<N, Str>`: Repeats a string type `Str` `N` times.
  - [x] `StartsWith<S, Str>`: Checks if a string type `Str` starts with a substring `S`.
  - [x] `EndsWith<E, Str>`: Checks if a string type `Str` ends with a substring `E`.
  - [x] `ToTuple<Str>`: Converts a string type `Str` to a tuple type.
  - [x] `ToNumber<Str>`: Converts a string type `Str` to a number type.
  - [x] `ToString<T>`: Converts any literal type `T` to a string literal type.
  - [x] `Prepend<Start, Str>`: Prepends a string type `Start` to the beginning of a string type `Str`.
  - [x] `Append<End, Str>`: Appends a string type `End` to the end of a string type `Str`.
  - [x] `Uppercase<Str>`: Converts a string type `Str` to uppercase.
  - [x] `Lowercase<Str>`: Converts a string type `Str` to lowercase.
  - [x] `Capitalize<Str>`: Capitalizes the first letter of a string type `Str`.
  - [x] `Uncapitalize<Str>`: Converts the first letter of a string type `Str` to lowercase.
  - [x] `SnakeCase<Str>`: Converts a string type `Str` to snake_case.
  - [x] `CamelCase<Str>`: Converts a string type `Str` to camelCase.
  - [x] `KebabCase<Str>`: Converts a string type `Str` to kebab-case.
  - [x] `Compare<Str1, Str2>`: Compares two string types `Str1` and `Str2` and returns a number indicating their relative order.
  - [x] `Equal<Str1, Str2>`: Checks if two string types `Str1` and `Str2` are equal.
  - [x] `NotEqual<Str1, Str2>`: Checks if two string types `Str1` and `Str2` are not equal.
  - [x] `LessThan<Str1, Str2>`: Checks if `Str1` is less than `Str2` in lexicographical order.
  - [x] `LessThanOrEqual<Str1, Str2>`: Checks if `Str1` is less than or equal to `Str2` in lexicographical order.
  - [x] `GreaterThan<Str1, Str2>`: Checks if `Str1` is greater than `Str2` in lexicographical order.
  - [x] `GreaterThanOrEqual<Str1, Str2>`: Checks if `Str1` is greater than or equal to `Str2` in lexicographical order.
- [x] Number
  - [x] `Add<N, M>`: Adds two number types `N` and `M`.
  - [x] `Multiply<N, M>`: Multiplies two number types `N` and `M`.
  - [x] `Subtract<N, M>`: Subtracts the number type `M` from `N`.
  - [x] `Negate<N>`: Negates a number type `N` by changing its sign.
  - [x] `Power<N, M>`: Raises a number type `N` to the power of `M`.
  - [x] `Div<N, M>`: Divides a number type `N` by `M`.
  - [x] `Mod<N, M>`: Calculates the remainder of dividing a number type `N` by `M`.
  - [x] `Abs<N>`: Returns the absolute value of a number type `N`.
  - [x] `Compare<N, M>`: Compares two number types `N` and `M` and returns a number indicating their relative order.
  - [x] `GreaterThan<N, M>`: Checks if the number type `N` is greater than `M`.
  - [x] `GreaterThanOrEqual<N, M>`: Checks if the number type `N` is greater than or equal to `M`.
  - [x] `LessThan<N, M>`: Checks if the number type `N` is less than `M`.
  - [x] `LessThanOrEqual<N, M>`: Checks if the number type `N` is less than or equal to `M`.
- [x] Boolean
  - [x] `And<Bool1, Bool2>`: Performs a logical AND operation between two boolean types `Bool1` and `Bool2`.
  - [x] `Or<Bool1, Bool2>`: Performs a logical OR operation between two boolean types `Bool1` and `Bool2`.
  - [x] `XOr<Bool1, Bool2>`: Performs a logical XOR (exclusive OR) operation between two boolean types `Bool1` and `Bool2`.
  - [x] `Not<Bool>`: Performs a logical NOT operation on a boolean type `Bool`.
  - [x] `Extends<A, B>`: Checks if type `A` extends or is equal to type `B`.
  - [x] `Equals<A, B>`: Checks if type `A` is equal to type `B`.
  - [x] `DoesNotExtend<A, B>`: Checks if type `A` does not extend type `B`.
