import { Call, Encodings } from "../src/index";
import { Equal, Expect } from "../src/internals/helpers";

describe("Encodings", () => {
  describe("Btoa", () => {
    it("works with hello world", () => {
      type res1 = Call<Encodings.Btoa, "hello world">;
      type test1 = Expect<Equal<res1, "aGVsbG8gd29ybGQ=">>;
    });

    it("works with no input", () => {
      type res1 = Call<Encodings.Btoa, "">;
      type test1 = Expect<Equal<res1, "">>;
    });

    it("works with 1 input", () => {
      type res1 = Call<Encodings.Btoa, "v">;
      type test1 = Expect<Equal<res1, "dg==">>;
    });

    it("works with 2 inputs", () => {
      type res1 = Call<Encodings.Btoa, "vO">;
      type test1 = Expect<Equal<res1, "dk8=">>;
    });

    it("works with 3 inputs", () => {
      type res1 = Call<Encodings.Btoa, "vOx">;
      type test1 = Expect<Equal<res1, "dk94">>;
    });

    it("works for various random inputs", () => {
      type res1 = Call<Encodings.Btoa, "?YGy5&~qFUH?8;LEL[(jJjNEWP-p">;
      type test1 = Expect<
        Equal<res1, "P1lHeTUmfnFGVUg/ODtMRUxbKGpKak5FV1AtcA==">
      >;
      type res2 = Call<Encodings.Btoa, "N:2CFL!S>76T_B+$o3vm']">;
      type test2 = Expect<Equal<res2, "TjoyQ0ZMIVM+NzZUX0IrJG8zdm0nXQ==">>;
      type res3 = Call<Encodings.Btoa, "iL^D0">;
      type test3 = Expect<Equal<res3, "aUxeRDA=">>;
      type res4 = Call<Encodings.Btoa, "$0d%8`<">;
      type test4 = Expect<Equal<res4, "JDBkJThgPA==">>;
      type res5 = Call<Encodings.Btoa, "'G&X(Q)>~i,|KF?KAu!Q/Dtv">;
      type test5 = Expect<Equal<res5, "J0cmWChRKT5+aSx8S0Y/S0F1IVEvRHR2">>;
      type res6 = Call<Encodings.Btoa, "Z(J3~">;
      type test6 = Expect<Equal<res6, "WihKM34=">>;
      type res7 = Call<Encodings.Btoa, "R*S.ShYLy">;
      type test7 = Expect<Equal<res7, "UipTLlNoWUx5">>;
      type res8 = Call<Encodings.Btoa, "e*6HCB-z">;
      type test8 = Expect<Equal<res8, "ZSo2SENCLXo=">>;
      type res9 = Call<Encodings.Btoa, "T|+2vw$N">;
      type test9 = Expect<Equal<res9, "VHwrMnZ3JE4=">>;
      type res10 = Call<Encodings.Btoa, "AIx f9rAQiO6(">;
      type test10 = Expect<Equal<res10, "QUl4IGY5ckFRaU82KA==">>;
      type res11 = Call<Encodings.Btoa, "XWYT>4' ]">;
      type test11 = Expect<Equal<res11, "WFdZVD40JyBd">>;
      type res12 = Call<Encodings.Btoa, "LNk[E5b9C#pRUEW ">;
      type test12 = Expect<Equal<res12, "TE5rW0U1YjlDI3BSVUVXIA==">>;
      type res13 = Call<Encodings.Btoa, "Pk62De<7\\6?`K$.F0yZsX">;
      type test13 = Expect<Equal<res13, "UGs2MkRlPDdcNj9gSyQuRjB5WnNY">>;
      type res14 = Call<Encodings.Btoa, "Jzg8K2g).LKl%ZT!G*U">;
      type test14 = Expect<Equal<res14, "SnpnOEsyZykuTEtsJVpUIUcqVQ==">>;
      type res15 = Call<Encodings.Btoa, "YB\\nS_i)8h>[tW">;
      type test15 = Expect<Equal<res15, "WUJcblNfaSk4aD5bdFc=">>;
      type res16 = Call<Encodings.Btoa, "<-'E)+E.">;
      type test16 = Expect<Equal<res16, "PC0nRSkrRS4=">>;
      type res17 = Call<Encodings.Btoa, "O.UZ0a&}">;
      type test17 = Expect<Equal<res17, "Ty5VWjBhJn0=">>;
      type res18 = Call<Encodings.Btoa, "!:">;
      type test18 = Expect<Equal<res18, "ITo=">>;
      type res19 = Call<Encodings.Btoa, "nD:$K?L]5?sV!FAb">;
      type test19 = Expect<Equal<res19, "bkQ6JEs/TF01P3NWIUZBYg==">>;
      type res20 = Call<Encodings.Btoa, "rD?Fy*8?9G3>;G&Ng[&l&cYL&|">;
      type test20 = Expect<
        Equal<res20, "ckQ/RnkqOD85RzM+O0cmTmdbJmwmY1lMJnw=">
      >;
      type res21 = Call<Encodings.Btoa, "qV&#EA,UD9`1-vJ^4 K83">;
      type test21 = Expect<Equal<res21, "cVYmI0VBLFVEOWAxLXZKXjQgSzgz">>;
      type res22 = Call<Encodings.Btoa, "'ZEn2k9_qr%j19dJ$ ">;
      type test22 = Expect<Equal<res22, "J1pFbjJrOV9xciVqMTlkSiQg">>;
      type res23 = Call<Encodings.Btoa, "aCh2lM8:,V8axvZQ+KiJ)P`3(!4O(TY">;
      type test23 = Expect<
        Equal<res23, "YUNoMmxNODosVjhheHZaUStLaUopUGAzKCE0TyhUWQ==">
      >;
      type res24 = Call<Encodings.Btoa, "$pyKewrh'|fARD[0zYXr">;
      type test24 = Expect<Equal<res24, "JHB5S2V3cmgnfGZBUkRbMHpZWHI=">>;
      type res25 = Call<Encodings.Btoa, "&5-:7<Nh!U">;
      type test25 = Expect<Equal<res25, "JjUtOjc8TmghVQ==">>;
      type res26 = Call<Encodings.Btoa, "D!(CM+INR]M*">;
      type test26 = Expect<Equal<res26, "RCEoQ00rSU5SXU0q">>;
      type res27 = Call<Encodings.Btoa, "M)jvl@>BJc]/l$0V8^HP">;
      type test27 = Expect<Equal<res27, "TSlqdmxAPkJKY10vbCQwVjheSFA=">>;
      type res28 = Call<Encodings.Btoa, "U>(_{`Uxb@<[7&THROI%">;
      type test28 = Expect<Equal<res28, "VT4oX3tgVXhiQDxbNyZUSFJPSSU=">>;
      type res29 = Call<Encodings.Btoa, "V6C.CR]N">;
      type test29 = Expect<Equal<res29, "VjZDLkNSXU4=">>;
      type res30 = Call<Encodings.Btoa, "@E3EH^}Xm">;
      type test30 = Expect<Equal<res30, "QEUzRUhefVht">>;
      type res31 = Call<Encodings.Btoa, "^UI274<ZUvVZm_BR:_{I:">;
      type test31 = Expect<Equal<res31, "XlVJMjc0PFpVdlZabV9CUjpfe0k6">>;
      type res32 = Call<Encodings.Btoa, "ATa_ZNC#:<P5<">;
      type test32 = Expect<Equal<res32, "QVRhX1pOQyM6PFA1PA==">>;
    });
  });
});
