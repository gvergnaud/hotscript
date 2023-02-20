import { Booleans } from "../src/internals/booleans/Booleans";
import {
  Apply,
  arg0,
  arg1,
  arg2,
  arg3,
  Call,
  Eval,
  Fn,
  Pipe,
  _,
} from "../src/internals/core/Core";
import { Functions } from "../src/internals/functions/Functions";
import { Strings } from "../src/internals/strings/Strings";
import { Objects } from "../src/internals/objects/Objects";
import { Unions } from "../src/internals/unions/Unions";
import { Tuples } from "../src/internals/tuples/Tuples";
import { Equal, Expect } from "../src/internals/helpers";
import { Match } from "../src/internals/match/Match";

describe("Objects", () => {
  it("Create", () => {
    type res1 = Call<
      //   ^?
      Objects.Create,
      { a: string; b: number }
    >;
    type tes1 = Expect<Equal<res1, { a: string; b: number }>>;
    type res2 = Apply<
      //   ^?
      Objects.Create<{ a: arg0; b: arg1 }>,
      [1, 2]
    >;
    type tes2 = Expect<Equal<res2, { a: 1; b: 2 }>>;
    type res3 = Apply<
      //   ^?
      Objects.Create<{ a: arg0; b: [arg1, arg2]; c: { d: arg3 } }>,
      [1, 2, 3, 4]
    >;
    type tes3 = Expect<Equal<res3, { a: 1; b: [2, 3]; c: { d: 4 } }>>;
  });

  it("FromEntries", () => {
    type res1 = Call<
      //   ^?
      Objects.FromEntries,
      ["a", string] | ["b", number]
    >;
    type tes1 = Expect<Equal<res1, { a: string; b: number }>>;
  });

  it("Entries", () => {
    type res1 = Call<
      //   ^?
      Objects.Entries,
      { a: string; b: number }
    >;
    type tes1 = Expect<Equal<res1, ["a", string] | ["b", number]>>;
  });

  it("Entries >> FromEntries identity", () => {
    type res1 = Pipe<
      { a: string; b: number },
      [Objects.Entries, Objects.FromEntries]
    >;
    //   ^?

    type tes1 = Expect<Equal<res1, { a: string; b: number }>>;
  });

  it("MapValues", () => {
    type res1 = Call<
      //   ^?
      Objects.MapValues<Strings.ToString>,
      { a: 1; b: true }
    >;
    type tes1 = Expect<Equal<res1, { a: "1"; b: "true" }>>;
  });

  it("MapKeys", () => {
    type res1 = Call<
      //   ^?
      Objects.MapKeys<Strings.Prepend<"get_">>,
      { a: 1; b: true }
    >;
    type tes1 = Expect<Equal<res1, { get_a: 1; get_b: true }>>;
  });

  it("Pick", () => {
    type res1 = Call<
      //   ^?
      Objects.Pick<"a">,
      { a: 1; b: true }
    >;
    type tes1 = Expect<Equal<res1, { a: 1 }>>;
  });

  it("Omit", () => {
    type res1 = Call<
      //   ^?
      Objects.Omit<"a">,
      { a: 1; b: true }
    >;
    type tes1 = Expect<Equal<res1, { b: true }>>;
  });

  it("PickBy", () => {
    type res1 = Call<
      //   ^?
      Objects.PickBy<Booleans.Extends<1>>,
      { a: 1; b: true; c: 1 }
    >;
    type tes1 = Expect<Equal<res1, { a: 1; c: 1 }>>;
  });

  it("OmitBy", () => {
    type res1 = Call<
      //   ^?
      Objects.OmitBy<Booleans.Extends<1>>,
      { a: 1; b: true; c: 1 }
    >;
    type tes1 = Expect<Equal<res1, { b: true }>>;
  });

  describe("Assign", () => {
    it("can be called without any pre-filled arguments", () => {
      type res1 = Call<
        //   ^?
        Tuples.Reduce<Objects.Assign, {}>,
        [{ a: 1 }, { b: true }, { c: 1 }]
      >;
      type tes1 = Expect<Equal<res1, { a: 1; b: true; c: 1 }>>;

      type res2 = Call<
        //   ^?
        Tuples.Reduce<Objects.Assign, {}>,
        [{ a: 2 }, { b: true }, { c: 2 }]
      >;
      type tes2 = Expect<Equal<res2, { a: 2; b: true; c: 2 }>>;
    });

    it("can be called with one pre-filled argument", () => {
      type res1 = Call<
        //   ^?
        Tuples.Map<Objects.Assign<{ new: "new" }>>,
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
      type res1 = Eval<Objects.Assign<{ a: string }, { b: number }>>;
      //    ^?
      type test1 = Expect<Equal<res1, { a: string; b: number }>>;
    });
  });

  it("KebabCase", () => {
    type res1 = Call<
      //   ^?
      Objects.KebabCase,
      { helloWorld: string; userName: string }
    >;

    type test1 = Expect<
      Equal<res1, { "hello-world": string; "user-name": string }>
    >;
  });

  it("SnakeCase", () => {
    type res1 = Call<
      //   ^?
      Objects.SnakeCase,
      { helloWorld: string; userName: string }
    >;

    type test1 = Expect<
      Equal<res1, { hello_world: string; user_name: string }>
    >;
  });

  it("CamelCase", () => {
    type res1 = Call<
      //   ^?
      Objects.CamelCase,
      { hello_world: string; user_name: string }
    >;

    type test1 = Expect<Equal<res1, { helloWorld: string; userName: string }>>;
  });

  it("KebabCaseDeep", () => {
    type res1 = Call<
      //   ^?
      Objects.KebabCaseDeep,
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
      Objects.SnakeCaseDeep,
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
      Objects.CamelCaseDeep,
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
      type res1 = Eval<
        //   ^?
        Objects.Get<"a.b.c.d", { a: { b: { c: { d: string } } } }>
      >;
      type test1 = Expect<Equal<res1, string>>;

      type res2 = Pipe<
        //  ^?
        { a: { b: { c: { d: string } } } },
        [Objects.Get<"a.b.c.d">]
      >;
      type test2 = Expect<Equal<res2, string>>;
    });

    it("should support union of objects", () => {
      type input =
        | { a: { b: string | { c: { d: string } } } }
        | { a: { b: { c: { d: number } } } };

      type res1 = Eval<Objects.Get<"a.b.c.d", input>>;
      //    ^?
      type test1 = Expect<Equal<res1, string | number | undefined>>;

      type res2 = Pipe<input, [Objects.Get<"a.b.c.d">]>;
      //    ^?
      type test2 = Expect<Equal<res2, string | number | undefined>>;
    });

    it("should support arrays", () => {
      type res1 = Eval<Objects.Get<"a.b[0].d", { a: { b: { d: string }[] } }>>;
      //   ^?
      type test1 = Expect<Equal<res1, string>>;
    });

    it("should support tuples", () => {
      type input = { a: { b: [{ d: string }, "hello"] } };
      type res1 = Eval<Objects.Get<"a.b[0].d", input>>;
      //   ^?

      type test1 = Expect<Equal<res1, string>>;

      type res2 = Eval<Objects.Get<"a.b[1]", input>>;
      //   ^?
      type test2 = Expect<Equal<res2, "hello">>;
    });
  });

  it("Record", () => {
    type res1 = Call<
      //   ^?
      Objects.Record<"a" | "b">,
      number
    >;
    type tes1 = Expect<Equal<res1, { a: number; b: number }>>;
    type res2 = Eval<
      //   ^?
      Objects.Record<"a" | "b", number>
    >;
    type tes2 = Expect<Equal<res2, { a: number; b: number }>>;
    type res3 = Apply<
      //   ^?
      Objects.Record,
      ["a" | "b", number]
    >;
    type tes3 = Expect<Equal<res3, { a: number; b: number }>>;
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
        Objects.OmitBy<Booleans.Equals<symbol>>,
        Objects.Assign<{ metadata: { newUser: true } }>,
        Objects.SnakeCaseDeep,
        Objects.Assign<{ id: string }>
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

    // prettier-ignore
    type res5 = Pipe<
      //    ^?
      "/users/<id:string>/posts/<index:number>",
      [
        Strings.Split<"/">,
        Tuples.Filter<Strings.StartsWith<"<">>,
        Tuples.Map<
          Functions.ComposeLeft<[
            Strings.Replace<"<", "">,
            Strings.Replace<">", "">,
            Strings.Split<":">
          ]>
        >,
        Tuples.ToUnion,
        Objects.FromEntries,
        Objects.MapValues<
          Match<[
            Match.With<"string", Functions.Constant<string>>,
            Match.With<"number", Functions.Constant<number>>
          ]>
        >
      ]
    >;
    type test5 = Expect<
      Equal<
        res5,
        {
          id: string;
          index: number;
        }
      >
    >;
  });

  describe("GroupBy", () => {
    interface GetTypeKey extends Fn {
      return: this["arg0"] extends { type: infer Type } ? Type : never;
    }
    type res1 = Call<
      // ^?
      Objects.GroupBy<GetTypeKey>,
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
