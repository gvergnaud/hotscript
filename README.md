# PipeScript

Type-level madness.


```ts
type result = Pipe<
  //  ^? 78
  [1, 2, 3, 4, 3, 4],
  [
    MapAdd<3>,
    Join<'.'>,
    Split<'.'>,
    MapToNumber,
    MapAdd<10>,
    Sum
  ]
>;
```
