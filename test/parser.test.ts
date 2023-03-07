import {
  Call,
  Tuples,
  P,
  Objects,
  Compose,
  Identity,
  arg0,
  arg1,
  Constant,
} from "../src/index";
import { Equal, Expect } from "../src/internals/helpers";

describe("Parser", () => {
  describe("JSON", () => {
    it("Object parser", () => {
      type StrLit = P.Do<
        [
          P.Literal<'"'>,
          P.Let<"key", P.Word>,
          P.Literal<'"'>,
          P.Ap<Identity, ["key"]>
        ]
      >;

      type Obj = P.Do<
        [
          P.Literal<"{">,
          P.Optional<P.WhiteSpaces>,
          P.Let<"key", StrLit>,
          P.Optional<P.WhiteSpaces>,
          P.Literal<":">,
          P.Optional<P.WhiteSpaces>,
          P.Let<"value", StrLit>,
          P.Optional<P.WhiteSpaces>,
          P.Literal<"}">,
          P.Ap<
            Compose<[Objects.FromEntries, Objects.Create<[arg0, arg1]>]>,
            ["key", "value"]
          >
        ]
      >;

      type res1 = Call<Obj, '{ "key": "hello" }'>;
      //    ^?
      type test1 = Expect<Equal<res1, ["", P.Ok<{ key: "hello" }>]>>;
    });

    it("Full JSON parser", () => {
      type JSON = P.OneOf<[NullLit, StrLit, NumLit, Obj, Arr]>;

      type NumLit = P.Number;

      type NullLit = P.Do<[P.Literal<"null">, P.Ap<Constant<null>, []>]>;

      type StrLit = P.Do<
        [
          P.Literal<'"'>,
          P.Let<"key", P.Word>,
          P.Literal<'"'>,
          P.Ap<Identity, ["key"]>
        ]
      >;

      type Obj = P.Do<
        [
          P.Literal<"{">,
          P.Optional<P.WhiteSpaces>,
          P.Let<"key", StrLit>,
          P.Optional<P.WhiteSpaces>,
          P.Literal<":">,
          P.Optional<P.WhiteSpaces>,
          P.Let<"value", JSON>,
          P.Optional<P.WhiteSpaces>,
          P.Literal<"}">,
          P.Ap<
            Compose<[Objects.FromEntries, Objects.Create<[arg0, arg1]>]>,
            ["key", "value"]
          >
        ]
      >;

      type CSV = P.Do<
        [
          P.Let<"first", JSON>,
          P.Optional<P.WhiteSpaces>,
          P.Let<
            "rest",
            P.Optional<
              P.Do<[P.Literal<",">, P.Optional<P.WhiteSpaces>, P.Return<CSV>]>,
              []
            >
          >,
          P.Ap<Tuples.Prepend, ["first", "rest"]>
        ]
      >;

      type Arr = P.Do<
        [
          P.Literal<"[">,
          P.Optional<P.WhiteSpaces>,
          P.Let<"values", CSV>,
          P.Optional<P.WhiteSpaces>,
          P.Literal<"]">,
          P.Ap<Identity, ["values"]>
        ]
      >;

      type res1 = Call<JSON, '[{ "key": "hello" }]'>;
      //    ^?
      type test1 = Expect<Equal<res1, ["", P.Ok<[{ key: "hello" }]>]>>;

      type res2 = Call<JSON, '["a", "b"]'>;
      //    ^?
      type test2 = Expect<Equal<res2, ["", P.Ok<["a", "b"]>]>>;

      type res3 = Call<JSON, '["a", null]'>;
      //    ^?
      type test3 = Expect<Equal<res3, ["", P.Ok<["a", null]>]>>;

      type res4 = Call<JSON, "null">;
      //    ^?
      type test4 = Expect<Equal<res4, ["", P.Ok<null>]>>;

      type res5 = Call<
        //  ^?
        Arr,
        "[null]"
      >;
      type test5 = Expect<Equal<res5, ["", P.Ok<[null]>]>>;

      type res6 = Call<
        //  ^?
        CSV,
        "1 ,2  ,  3"
      >;
      type test6 = Expect<Equal<res6, ["", P.Ok<[1, 2, 3]>]>>;

      type res7 = Call<
        //  ^?
        CSV,
        "1 ,null  ,  3"
      >;
      type test7 = Expect<Equal<res7, ["", P.Ok<[1, null, 3]>]>>;

      type res8 = Call<
        //  ^?
        CSV,
        '1 ,null  ,  "str"'
      >;
      type test8 = Expect<Equal<res8, ["", P.Ok<[1, null, "str"]>]>>;

      type res9 = Call<
        //  ^?
        JSON,
        '[1 ,null  ,  "str"]'
      >;
      type test9 = Expect<Equal<res9, ["", P.Ok<[1, null, "str"]>]>>;

      type res10 = Call<
        //  ^?
        JSON,
        '[1, { "a": { "b": "hello" } },  "str"]'
      >;
      type test10 = Expect<
        Equal<res10, ["", P.Ok<[1, { a: { b: "hello" } }, "str"]>]>
      >;
    });
  });

  describe("max depth", () => {
    it("Recursive parser", () => {
      type CommaSep = P.Do<
        [
          P.Let<"first", P.Word>,
          P.Let<
            "rest",
            P.Optional<P.Do<[P.Literal<",">, P.Return<CommaSep>]>, []>
          >,
          P.Ap<Tuples.Prepend, ["first", "rest"]>
        ]
      >;

      type res1 = Call<CommaSep, `a,b,c,d,e,f,g,h,i,j,k`>;
      //    ^?
      type test1 = Expect<
        Equal<
          res1,
          ["", P.Ok<["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"]>]
        >
      >;
    });

    it("Non recursive parser — let bindings", () => {
      type CommaSepFix = P.Do<
        [
          P.Let<"first", P.Word>,
          P.Literal<",">,
          P.Let<"2", P.Word>,
          P.Literal<",">,
          P.Let<"3", P.Word>,
          P.Literal<",">,
          P.Let<"4", P.Word>,
          P.Literal<",">,
          P.Let<"5", P.Word>,
          P.Literal<",">,
          P.Let<"6", P.Word>,
          P.Literal<",">,
          P.Let<"7", P.Word>,
          P.Literal<",">,
          P.Let<"8", P.Word>,
          P.Literal<",">,
          P.Let<"9", P.Word>,
          P.Literal<",">,
          P.Let<"10", P.Word>,
          P.Literal<",">,
          P.Let<"11", P.Word>,
          P.Literal<",">,
          P.Let<"12", P.Word>,
          P.Literal<",">,
          P.Let<"13", P.Word>,
          P.Literal<",">,
          P.Let<"14", P.Word>,
          P.Literal<",">,
          P.Let<"16", P.Word>,
          P.Literal<",">,
          P.Let<"17", P.Word>,
          P.Literal<",">,
          P.Let<"18", P.Word>,
          P.Literal<",">,
          P.Let<"19", P.Word>,
          P.Literal<",">,
          P.Let<"20", P.Word>,
          P.Literal<",">,
          P.Let<"21", P.Word>,
          P.Literal<",">,
          P.Let<"22", P.Word>,
          P.Literal<",">,
          P.Let<"23", P.Word>,
          P.Literal<",">,
          P.Let<"24", P.Word>,
          P.Literal<",">,
          P.Let<"25", P.Word>,
          P.Literal<",">,
          P.Let<"26", P.Word>,
          P.Literal<",">,
          P.Let<"27", P.Word>,
          P.Literal<",">,
          P.Let<"28", P.Word>,
          P.Literal<",">,
          P.Let<"29", P.Word>,
          P.Literal<",">,
          P.Let<"30", P.Word>,
          P.Literal<",">,
          P.Let<"31", P.Word>,
          P.Literal<",">,
          P.Let<"32", P.Word>,
          P.Literal<",">,
          P.Let<"33", P.Word>,
          P.Literal<",">,
          P.Let<"34", P.Word>,
          P.Literal<",">,
          P.Let<"35", P.Word>,
          P.Literal<",">,
          P.Let<"36", P.Word>,
          P.Literal<",">,
          P.Let<"37", P.Word>,
          P.Literal<",">,
          P.Let<"38", P.Word>,
          P.Literal<",">,
          P.Let<"39", P.Word>,
          P.Literal<",">,
          P.Let<"40", P.Word>,
          P.Literal<",">,
          P.Let<"41", P.Word>,
          P.Literal<",">,
          P.Let<"42", P.Word>,
          P.Literal<",">,
          P.Let<"43", P.Word>,
          P.Literal<",">,
          P.Let<"44", P.Word>,
          P.Literal<",">,
          P.Let<"45", P.Word>,
          P.Literal<",">,
          P.Let<"46", P.Word>,
          P.Literal<",">,
          P.Let<"47", P.Word>
        ]
      >;

      type res1 = Call<
        //   ^?
        CommaSepFix,
        `a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,ab,ac,ad,ae,af,ag,ah,ai,aj,ak,al,am,an,ao,ap,aq,ar,as,at,au`
      >;
    });

    it("No let bindinds", () => {
      type As = P.Do<
        [
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>,
          P.Optional<P.Literal<"a">>
        ]
      >;

      type res3 = Call<
        //   ^?
        As,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
      >;
    });
  });
});
