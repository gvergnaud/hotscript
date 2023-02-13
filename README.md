# Higher-Order TypeScript (HOTScript)

A lodash-like library for types, with support for type-level lambda functions.

🚧 work in progress 🚧

```ts
// prettier-ignore
type res1 = Pipe<
  //  ^? 95
  [1, 2, 3, 4, 3, 4],
  [
    Tuples.Map<Numbers.Add<3>>,
    Strings.Join<".">,
    Strings.Split<".">,
    Tuples.Map<Strings.ToNumber>,
    Tuples.Map<Numbers.Add<10>>,
    Tuples.Sum
  ]
>;

// This is a type-level "lambda"!
interface Duplicate extends Fn {
  output: [this["args"][0], this["args"][0]];
}

type result1 = Call<Tuples.Map<Duplicate>, [1, 2, 3, 4]>;
//     ^? [[1, 1], [2, 2], [3, 3], [4, 4]]

type result2 = Call<Tuples.FlatMap<Duplicate>, [1, 2, 3, 4]>;
//     ^? [1, 1, 2, 2, 3, 3, 4, 4]

// Let's compose some functions to turn a type

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

## TODO

- [ ] Function
  - [x] Pipe
  - [x] PipeRight
  - [x] Call
  - [x] Apply
  - [x] ApplyPartial
  - [x] Compose
  - [x] ComposeLeft
- [ ] Tuples
  - [ ] Zip
  - [ ] Partition
  - [x] Head
  - [x] Tail
  - [x] Last
  - [x] FlatMap
  - [x] Find
  - [x] Sum
  - [x] Drop n
  - [x] Take n
  - [x] TakeWhile
  - [x] Join separator
  - [x] Map
  - [x] Filter
  - [x] Reduce
  - [x] ReduceRight
- [ ] Object
  - [x] FromEntries
  - [x] Entries
  - [x] MapValues
  - [x] MapKeys
  - [x] GroupBy
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
- [ ] String
  - [x] ToString
  - [x] ToNumber
  - [x] Append
  - [x] Prepend
  - [x] Uppercase
  - [x] Lowercase
  - [x] Capitalize
  - [x] Uncapitalize
  - [x] SnakeCase
  - [x] CamelCase
  - [x] KebabCase
  - [x] Split separator
  - [ ] Words
- [ ] Number
  - [x] Add
  - [ ] Multiply
  - [ ] Subtract
  - [ ] GreaterThan
  - [ ] GreaterThanOrEqual
  - [ ] LessThan
  - [ ] LessThanOrEqual
- [ ] Boolean
  - [x] And
  - [x] Or
  - [x] Not
  - [x] Extends
  - [x] Equals
  - [x] DoesNotExtends
