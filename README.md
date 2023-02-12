# HOTScript!

Type-level madness.

```ts
// prettier-ignore
type result = Pipe<
  //  ^? 78
  [1, 2, 3, 4, 3, 4],
  [
    TupleMap<Add<3>>,
    Join<'.'>,
    Split<'.'>,
    TupleMap<ToNumber>,
    TupleMap<Add<10>>,
    Sum
  ]
>;
```

## TODO

- [ ] Composition
  - [x] Pipe
  - [x] PipeRight
  - [x] Call
  - [x] Apply
- [ ] Tuples
  - [x] Head
  - [x] Tail
  - [x] Last
  - [x] FlatMap
  - [x] Find
  - [x] Sum
  - [x] Drop n
  - [x] Take n
  - [x] TakeWhile
  - [ ] Zip
  - [ ] Partition
  - [x] Join separator
  - [x] Map
  - [x] Filter
  - [x] Reduce
  - [x] ReduceRight
- [ ] Object
  - [ ] Assign
  - [ ] FromEntries
  - [ ] Entries
  - [ ] Pick
  - [ ] PickBy
  - [ ] Omit
  - [ ] OmitBy
- [ ] Union
  - [ ] Assign
  - [ ] FromEntries
  - [ ] Entries
  - [ ] Extract
  - [ ] ExtractBy
  - [ ] Exclude
  - [ ] ExcludeBy
- [ ] String
  - [ ] Concat
  - [ ] Uppercase
  - [ ] Lowercase
  - [ ] Capitalize
  - [ ] Uncapitalize
  - [ ] Split separator
  - [ ] Words
  - [ ] Reduce
