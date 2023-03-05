import { Equal, Expect } from "../src/internals/helpers";
import { Parser as P } from "../src/internals/parser/Parser";
import { Objects } from "../src/internals/objects/Objects";
import { Tuples } from "../src/internals/tuples/Tuples";
import { Eval } from "../src/internals/core/Core";

describe("Parser", () => {
  describe("P.Literal", () => {
    it("should parse a literal", () => {
      type res1 = Eval<P.Parse<P.Literal<"hello">, "hello">>;
      //   ^?
      type test1 = Expect<Equal<res1, "hello">>;
    });
  });

  describe("P.Parse", () => {
    it("should parse complex grammar and allow to transform it", () => {
      type res1 = Eval<
        //  ^?
        P.Parse<
          P.Map<
            P.Sequence<
              [
                P.Skip<P.Literal<"function">>,
                P.Trim<P.Word>,
                P.Between<
                  P.Literal<"(">,
                  P.SepBy<P.Trim<P.Word>, P.Literal<",">>,
                  P.Literal<")">
                >,
                P.Skip<P.Literal<";">>,
                P.EndOfInput
              ]
            >,
            Objects.Create<{
              type: "function";
              name: Tuples.At<0>;
              parameters: Tuples.Drop<1>;
            }>
          >,
          `function test ( aaaaa, hello_  ,  allo  );`
        >
      >;
      type test1 = Expect<
        Equal<
          res1,
          {
            type: "function";
            name: "test";
            parameters: ["aaaaa", "hello_", "allo"];
          }
        >
      >;
    });
  });
});
