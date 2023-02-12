# HOTScript

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
