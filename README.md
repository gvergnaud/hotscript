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

## API

- [x] Core
  - [x] `Pipe<Input, Fn[]>`
  - [x] `PipeRight<Fn[], Input>`
  - [x] `Call<Fn, ...Arg>`
  - [x] `Apply<Fn, Arg[]>`
  - [x] `PartialApply<Fn, Arg[]>`
  - [x] `Compose<Fn[]>`
  - [x] `ComposeLeft<Fn[]>`
- [x] Function
  - [x] `ReturnType<Fn>`
  - [x] `Parameters<Fn>`
  - [x] `Parameter<N, Fn>`
  - [x] `MapReturnType<Fn, FunctionType>`
  - [x] `MapParameters<Fn, FunctionType>`
- [ ] Tuples
  - [x] `Create<X> -> [X]`
  - [x] `Partition<Tuple>`
  - [x] `IsEmpty<Tuple>`
  - [x] `Zip<...Tuple[]>`
  - [x] `ZipWith<Fn, ...Tuple[]>`
  - [x] `Sort<Tuple>`
  - [x] `Head<Tuple>`
  - [x] `Tail<Tuple>`
  - [x] `At<N, Tuple>`
  - [x] `Last<Tuple>`
  - [x] `FlatMap<Fn, Tuple>`
  - [x] `Find<Fn, Tuple>`
  - [x] `Drop<N, Tuple>`
  - [x] `Take<N, Tuple>`
  - [x] `TakeWhile<Fn, Tuple>`
  - [x] `GroupBy<Fn, Tuple>`
  - [x] `Join<Str, Tuple>`
  - [x] `Map<Fn, Tuple>`
  - [x] `Filter<Fn, Tuple>`
  - [x] `Reduce<Fn, Init, Tuple>`
  - [x] `ReduceRight<Fn, Init, Tuple>`
  - [x] `Reverse<Tuple>`
  - [x] `Every<Fn, Tuple>`
  - [x] `Some<Fn, Tuple>`
  - [x] `SplitAt<N, Tuple>`
  - [x] `ToUnion<Tuple>`
  - [x] `ToIntersection<Tuple>`
  - [x] `Prepend<X, Tuple>`
  - [x] `Append<X, Tuple>`
  - [x] `Concat<T1, T2>`
  - [x] `Min<Tuple>`
  - [x] `Max<Tuple>`
  - [x] `Sum<Tuple>`
- [ ] Object
  - [x] `Readonly<Obj>`
  - [x] `Mutable<Obj>`
  - [x] `Required<Obj>`
  - [x] `Partial<Obj>`
  - [x] `ReadonlyDeep<Obj>`
  - [x] `MutableDeep<Obj>`
  - [x] `RequiredDeep<Obj>`
  - [x] `PartialDeep<Obj>`
  - [x] `Update<Path, Fn | V, Obj>`
  - [x] `Record<Key, Value>`
  - [x] `Keys<Obj>`
  - [x] `Values<Obj>`
  - [x] `AllPaths<Obj>`
  - [x] `Create<Pattern, X>`
  - [x] `Get<Path, Obj>`
  - [x] `FromEntries<[Key, Value]>`
  - [x] `Entries<Obj>`
  - [x] `MapValues<Fn, Obj>`
  - [x] `MapKeys<Fn, Obj>`
  - [x] `Assign<...Obj>`
  - [x] `Pick<Key, Obj>`
  - [x] `PickBy<Fn, Obj>`
  - [x] `Omit<Key, Obj>`
  - [x] `OmitBy<Fn, Obj>`
  - [x] `CamelCase<Obj>`
  - [x] `CamelCaseDeep<Obj>`
  - [x] `SnakeCase<Obj>`
  - [x] `SnakeCaseDeep<Obj>`
  - [x] `KebabCase<Obj>`
  - [x] `KebabCaseDeep<Obj>`
- [ ] Union
  - [x] `Map<Fn, U>`
  - [x] `Extract<T, U>`
  - [x] `ExtractBy<Fn, U>`
  - [x] `Exclude<T, U>`
  - [x] `ExcludeBy<Fn, U>`
  - [x] `NonNullable<U>`
  - [x] `ToTuple<U>`
  - [x] `ToIntersection<U>`
- [ ] String
  - [x] `Length<Str>`
  - [x] `TrimLeft<Str>`
  - [x] `TrimRight<Str>`
  - [x] `Trim<Str>`
  - [x] `Join<Sep, Str>`
  - [x] `Replace<From, To, Str>`
  - [x] `Slice<Start, End, Str>`
  - [x] `Split<Sep, Str>`
  - [x] `Repeat<N, Str>`
  - [x] `StartsWith<S, Str>`
  - [x] `EndsWith<E, Str>`
  - [x] `ToTuple<Str>`
  - [x] `ToNumber<Str>`
  - [x] `ToString<Str>`
  - [x] `Prepend<Start, Str>`
  - [x] `Append<End, Str>`
  - [x] `Uppercase<Str>`
  - [x] `Lowercase<Str>`
  - [x] `Capitalize<Str>`
  - [x] `Uncapitalize<Str>`
  - [x] `SnakeCase<Str>`
  - [x] `CamelCase<Str>`
  - [x] `KebabCase<Str>`
  - [x] `Compare<Str, Str>`
  - [x] `Equal<Str, Str>`
  - [x] `NotEqual<Str, Str>`
  - [x] `LessThan<Str, Str>`
  - [x] `LessThanOrEqual<Str, Str>`
  - [x] `GreaterThan<Str, Str>`
  - [x] `GreaterThanOrEqual<Str, Str>`
- [ ] Number
  - [x] `Add<N, M>`
  - [x] `Multiply<N, M>`
  - [x] `Subtract<N, M>`
  - [x] `Negate<N>`
  - [x] `Power<N, M>`
  - [x] `Div<N, M>`
  - [x] `Mod<N, M>`
  - [x] `Abs<N>`
  - [x] `Compare<N, M>`
  - [x] `GreaterThan<N, M>`
  - [x] `GreaterThanOrEqual<N, M>`
  - [x] `LessThan<N, M>`
  - [x] `LessThanOrEqual<N, M>`
- [ ] Boolean
  - [x] `And<Bool, Bool>`
  - [x] `Or<Bool, Bool>`
  - [x] `XOr<Bool, Bool>`
  - [x] `Not<Bool>`
  - [x] `Extends<A, B>`
  - [x] `Equals<A, B>`
  - [x] `DoesNotExtend<A, B>`
