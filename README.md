# Higher-Order TypeScript (HOTScript)

A library of composable functions for the type-level! Transform your TypeScript types in any way you want using functions you already know.

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

[Run this as a TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgBWGApgGjgFQK5gA26AztgMoxTAB2A5mXAHJ4gBG6UJcAvnAGZQIIOACIAFhBgkAxtTAxRAbgBQKgPTq4YKOhgxgnALTA6NaOhUwAnhji6SARjgBeFGnQAeFXDibfAHoA-D5wANqO2ABM2ADM2AAscYkAupihYaG++ESkAHQAsgCGYJ4s7JwkeQCCACa1nrEAfE3pvtkExFUAUhC0nqJ5oq1ZcJTU9FXkRMAwA0Mj7bid+cWl47QMeTgQ5RxQi+05XYUlZaz7VXUNjgAMLW1HK1OsoSkqTUpAA)

<!-- prettier-ignore -->
```ts
import { Pipe, Tuples, Strings, Numbers } from "hotscript";

type res1 = Pipe<
  //  ^? 62
  [1, 2, 3, 4],
  [
    Tuples.Map<Numbers.Add<3>>,       //  [4, 5, 6, 7]
    Tuples.Join<".">,                 //  "4.5.6.7"
    Strings.Split<".">,               //  ["4", "5", "6", "7"]
    Tuples.Map<Strings.Prepend<"1">>, //  ["14", "15", "16", "17"]
    Tuples.Map<Strings.ToNumber>,     //  [14, 15, 16, 17]
    Tuples.Sum                        //  62
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

## TODO

- [ ] Core
  - [x] Pipe
  - [x] PipeRight
  - [x] Call
  - [x] Apply
  - [x] PartialApply
  - [x] Compose
  - [x] ComposeLeft
- [ ] Function
  - [x] ReturnType
  - [x] Parameters
  - [x] Parameter n
- [ ] Tuples
  - [x] Create
  - [x] Partition
  - [x] IsEmpty
  - [x] Zip
  - [x] ZipWith
  - [x] Sort
  - [x] Head
  - [x] At
  - [x] Tail
  - [x] Last
  - [x] FlatMap
  - [x] Find
  - [x] Drop n
  - [x] Take n
  - [x] TakeWhile
  - [x] GroupBy
  - [x] Join separator
  - [x] Map
  - [x] Filter
  - [x] Reduce
  - [x] ReduceRight
  - [x] Every
  - [x] Some
  - [x] ToUnion
  - [x] ToIntersection
  - [x] Prepend
  - [x] Append
  - [x] Concat
  - [x] Min
  - [x] Max
  - [x] Sum
- [ ] Object
  - [x] Readonly
  - [x] Mutable
  - [x] Required
  - [x] Partial
  - [x] ReadonlyDeep
  - [x] MutableDeep
  - [x] RequiredDeep
  - [x] PartialDeep
  - [x] Update
  - [x] Record
  - [x] Keys
  - [x] Values
  - [x] AllPaths
  - [x] Create
  - [x] Get
  - [x] FromEntries
  - [x] Entries
  - [x] MapValues
  - [x] MapKeys
  - [x] Assign
  - [x] Pick
  - [x] PickBy
  - [x] Omit
  - [x] OmitBy
  - [x] CamelCase
  - [x] CamelCaseDeep
  - [x] SnakeCase
  - [x] SnakeCaseDeep
  - [x] KebabCase
  - [x] KebabCaseDeep
- [ ] Union
  - [x] Map
  - [x] Extract
  - [x] ExtractBy
  - [x] Exclude
  - [x] ExcludeBy
  - [x] NonNullable
  - [x] ToTuple
  - [x] ToIntersection
- [ ] String
  - [x] Length
  - [x] TrimLeft
  - [x] TrimRight
  - [x] Trim
  - [x] Join
  - [x] Replace
  - [x] Slice
  - [x] Split
  - [x] Repeat
  - [x] StartsWith
  - [x] EndsWith
  - [x] ToTuple
  - [x] ToNumber
  - [x] ToString
  - [x] Prepend
  - [x] Append
  - [x] Uppercase
  - [x] Lowercase
  - [x] Capitalize
  - [x] Uncapitalize
  - [x] SnakeCase
  - [x] CamelCase
  - [x] KebabCase
  - [x] Compare
  - [x] Equal
  - [x] NotEqual
  - [x] LessThan
  - [x] LessThanOrEqual
  - [x] GreaterThan
  - [x] GreaterThanOrEqual
- [ ] Number
  - [x] Add
  - [x] Multiply
  - [x] Subtract
  - [x] Negate
  - [x] Power
  - [x] Div
  - [x] Mod
  - [x] Abs
  - [x] Compare
  - [x] GreaterThan
  - [x] GreaterThanOrEqual
  - [x] LessThan
  - [x] LessThanOrEqual
- [ ] Boolean
  - [x] And
  - [x] Or
  - [x] XOr
  - [x] Not
  - [x] Extends
  - [x] Equals
  - [x] DoesNotExtend
