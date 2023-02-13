# Higher-Order TypeScript (HOTScript)

A lodash-like library for types, with support for type-level lambda functions.

🚧 work in progress 🚧

```ts
// prettier-ignore
type result = Pipe<
  //  ^? 78
  [1, 2, 3, 4, 3, 4],
  [
    T.Map<Add<3>>,
    S.Join<'.'>,
    S.Split<'.'>,
    T.Map<S.ToNumber>,
    T.Map<N.Add<10>>,
    T.Sum
  ]
>;

// This is a type-level "lambda"!
interface Duplicate extends Fn {
  output: [this["args"][0], this["args"][0]];
}

type result = Call<T.FlatMap<Duplicate>, [1, 2, 3, 4]>;
//     ^? [1, 1, 2, 2, 3, 3, 4, 4]
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
