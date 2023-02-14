import { Call, Tuples, O, B, Pipe, T, S, Eval, Booleans, Fn } from "../src";
import { Equal, Expect } from "../src/internals/helpers";

describe("Objects", () => {
  it("FromEntries", () => {
    type res1 = Call<
      //   ^?
      O.FromEntries,
      ["a", string] | ["b", number]
    >;
    type tes1 = Expect<Equal<res1, { a: string; b: number }>>;
  });

  it("Entries", () => {
    type res1 = Call<
      //   ^?
      O.Entries,
      { a: string; b: number }
    >;
    type tes1 = Expect<Equal<res1, ["a", string] | ["b", number]>>;
  });

  it("Entries >> FromEntries identity", () => {
    type res1 = Pipe<{ a: string; b: number }, [O.Entries, O.FromEntries]>;
    //   ^?

    type tes1 = Expect<Equal<res1, { a: string; b: number }>>;
  });

  it("MapValues", () => {
    type res1 = Call<
      //   ^?
      O.MapValues<S.ToString>,
      { a: 1; b: true }
    >;
    type tes1 = Expect<Equal<res1, { a: "1"; b: "true" }>>;
  });

  it("MapKeys", () => {
    type res1 = Call<
      //   ^?
      O.MapKeys<S.Prepend<"get_">>,
      { a: 1; b: true }
    >;
    type tes1 = Expect<Equal<res1, { get_a: 1; get_b: true }>>;
  });

  it("Pick", () => {
    type res1 = Call<
      //   ^?
      O.Pick<"a">,
      { a: 1; b: true }
    >;
    type tes1 = Expect<Equal<res1, { a: 1 }>>;
  });

  it("Omit", () => {
    type res1 = Call<
      //   ^?
      O.Omit<"a">,
      { a: 1; b: true }
    >;
    type tes1 = Expect<Equal<res1, { b: true }>>;
  });

  it("PickBy", () => {
    type res1 = Call<
      //   ^?
      O.PickBy<B.Extends<1>>,
      { a: 1; b: true; c: 1 }
    >;
    type tes1 = Expect<Equal<res1, { a: 1; c: 1 }>>;
  });

  it("OmitBy", () => {
    type res1 = Call<
      //   ^?
      O.OmitBy<B.Extends<1>>,
      { a: 1; b: true; c: 1 }
    >;
    type tes1 = Expect<Equal<res1, { b: true }>>;
  });

  describe("Assign", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<
        //   ^?
        T.Reduce<O.Assign, {}>,
        [{ a: 1 }, { b: true }, { c: 1 }]
      >;
      type tes1 = Expect<Equal<res1, { a: 1; b: true; c: 1 }>>;

      type res2 = Call<
        //   ^?
        T.Reduce<O.Assign, {}>,
        [{ a: 2 }, { b: true }, { c: 2 }]
      >;
      type tes2 = Expect<Equal<res2, { a: 2; b: true; c: 2 }>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<
        //   ^?
        Tuples.Map<O.Assign<{ new: "new" }>>,
        [{ a: 2 }, { b: true }, { c: 2 }]
      >;

      type test1 = Expect<
        Equal<
          res1,
          [{ new: "new"; a: 2 }, { new: "new"; b: true }, { new: "new"; c: 2 }]
        >
      >;
    });

    it("can be called with 2 pre-filled arguments", () => {
      type res1 = Eval<O.Assign<{ a: string }, { b: number }>>;
      //    ^?
      type test1 = Expect<Equal<res1, { a: string; b: number }>>;
    });
  });

  it("KebabCase", () => {
    type res1 = Call<
      //   ^?
      O.KebabCase,
      { helloWorld: string; userName: string }
    >;

    type test1 = Expect<
      Equal<res1, { "hello-world": string; "user-name": string }>
    >;
  });

  it("SnakeCase", () => {
    type res1 = Call<
      //   ^?
      O.SnakeCase,
      { helloWorld: string; userName: string }
    >;

    type test1 = Expect<
      Equal<res1, { hello_world: string; user_name: string }>
    >;
  });

  it("CamelCase", () => {
    type res1 = Call<
      //   ^?
      O.CamelCase,
      { hello_world: string; user_name: string }
    >;

    type test1 = Expect<Equal<res1, { helloWorld: string; userName: string }>>;
  });

  it("KebabCaseDeep", () => {
    type res1 = Call<
      //   ^?
      O.KebabCaseDeep,
      {
        helloWorld: string;
        currentUser: { userName: string };
        friends: { userName: string }[];
      }
    >;

    type test1 = Expect<
      Equal<
        res1,
        {
          "hello-world": string;
          "current-user": {
            "user-name": string;
          };
          friends: {
            "user-name": string;
          }[];
        }
      >
    >;
  });

  it("SnakeCaseDeep", () => {
    type res1 = Call<
      //   ^?
      O.SnakeCaseDeep,
      {
        helloWorld: string;
        currentUser: { userName: string };
        friends: { userName: string }[];
      }
    >;

    type test1 = Expect<
      Equal<
        res1,
        {
          hello_world: string;
          current_user: {
            user_name: string;
          };
          friends: {
            user_name: string;
          }[];
        }
      >
    >;
  });

  it("CamelCaseDeep", () => {
    type res1 = Call<
      //   ^?
      O.CamelCaseDeep,
      {
        hello_world: string;
        current_user: {
          user_name: string;
        };
        friends: {
          user_name: string;
        }[];
      }
    >;

    type test1 = Expect<
      Equal<
        res1,
        {
          helloWorld: string;
          currentUser: {
            userName: string;
          };
          friends: {
            userName: string;
          }[];
        }
      >
    >;
  });

  describe("Get", () => {
    it("should retrieve a deep property", () => {
      type res1 = Eval<O.Get<"a.b.c.d", { a: { b: { c: { d: string } } } }>>;
      //   ^?
      type test1 = Expect<Equal<res1, string>>;

      type res2 = Pipe<
        //  ^?
        { a: { b: { c: { d: string } } } },
        [O.Get<"a.b.c.d">]
      >;
      type test2 = Expect<Equal<res2, string>>;
    });

    it("should support union of objects", () => {
      type input =
        | { a: { b: string | { c: { d: string } } } }
        | { a: { b: { c: { d: number } } } };

      type res1 = Eval<O.Get<"a.b.c.d", input>>;
      //    ^?
      type test1 = Expect<Equal<res1, string | number | undefined>>;

      type res2 = Pipe<input, [O.Get<"a.b.c.d">]>;
      //    ^?
      type test2 = Expect<Equal<res2, string | number | undefined>>;
    });

    it("should support arrays", () => {
      type res1 = Eval<O.Get<"a.b[0].d", { a: { b: { d: string }[] } }>>;
      //   ^?
      type test1 = Expect<Equal<res1, string>>;
    });

    it("should support tuples", () => {
      type input = { a: { b: [{ d: string }, "hello"] } };
      type res1 = Eval<O.Get<"a.b[0].d", input>>;
      //   ^?

      type test1 = Expect<Equal<res1, string>>;

      type res2 = Eval<O.Get<"a.b[1]", input>>;
      //   ^?
      type test2 = Expect<Equal<res2, "hello">>;
    });
  });

  describe("Composition", () => {
    type User = {
      id: symbol;
      firstName: string;
      lastName: string;
    };

    type APIUser = Pipe<
      //    ^?
      User,
      [
        O.OmitBy<Booleans.Equals<symbol>>,
        O.Assign<{ metadata: { newUser: true } }>,
        O.SnakeCaseDeep,
        O.Assign<{ id: string }>
      ]
    >;

    type test1 = Expect<
      Equal<
        APIUser,
        {
          id: string;
          metadata: {
            new_user: true;
          };
          first_name: string;
          last_name: string;
        }
      >
    >;
  });

  describe("GroupBy", () => {
    interface GetTypeKey extends Fn {
      output: this["args"][0] extends { type: infer Type } ? Type : never;
    }
    type res1 = Call<
      // ^?
      O.GroupBy<GetTypeKey>,
      [
        { type: "img"; src: string },
        { type: "video"; src: 1 },
        { type: "video"; src: 2 }
      ]
    >;
    type tes1 = Expect<
      Equal<
        res1,
        {
          img: [
            {
              type: "img";
              src: string;
            }
          ];
          video: [
            {
              type: "video";
              src: 1;
            },
            {
              type: "video";
              src: 2;
            }
          ];
        }
      >
    >;
  });
});
