// We store the data as pre-computed hashes - saves computation.

import { Add } from "../../numbers/impl/addition";
import {
  BitAnd,
  BitOr,
  BitShiftLeft,
  BitShiftRight,
} from "../../numbers/impl/bitwise";
import { Div, Mod } from "../../numbers/impl/division";
import { Mul } from "../../numbers/impl/multiply";

// prettier-ignore
type latin = {
	" ": 32; "!": 33; '"': 34; "#": 35; $: 36; "%": 37; "&": 38; "'": 39;
	"(": 40; ")": 41; "*": 42; "+": 43; ",": 44; "-": 45; ".": 46; "/": 47; "0": 48; "1": 49;
	"2": 50; "3": 51; "4": 52; "5": 53; "6": 54; "7": 55; "8": 56; "9": 57; ":": 58; ";": 59;
	"<": 60; "=": 61; ">": 62; "?": 63; "@": 64; A: 65; B: 66; C: 67; D: 68; E: 69;
	F: 70; G: 71; H: 72; I: 73; J: 74; K: 75; L: 76; M: 77; N: 78; O: 79;
	P: 80; Q: 81; R: 82; S: 83; T: 84; U: 85; V: 86; W: 87; X: 88; Y: 89;
	Z: 90; "[": 91; "\\": 92; "]": 93; "^": 94; _: 95; "`": 96; a: 97; b: 98; c: 99;
	d: 100; e: 101; f: 102; g: 103; h: 104; i: 105; j: 106; k: 107; l: 108; m: 109;
	n: 110; o: 111; p: 112; q: 113; r: 114; s: 115; t: 116; u: 117; v: 118; w: 119;
	x: 120; y: 121; z: 122; "{": 123; "|": 124; "}": 125; "~": 126;
} & {[_:number]:0} & {[_: string]: 0};

// prettier-ignore
type enc = {
	A:0; B:1; C:2; D:3; E:4; F:5; G:6; H:7; I:8; J:9; K:10; L:11; M:12; N:13; O:14; P:15; Q:16; R:17; S:18; T:19; U:20; V:21; W:22; X:23; Y:24; Z:25; a:26; b:27; c:28; d:29; e:30; f:31; g:32; h:33; i:34; j:35; k:36; l:37; m:38; n:39; o:40; p:41; q:42; r:43; s:44; t:45; u:46; v:47; w:48; x:49; y:50; z:51; 0:52; 1:53; 2:54; 3:55; 4:56; 5:57; 6:58; 7:59; 8:60; 9:61; '+':62; '/':63;
}
type dec = { [K in keyof enc as `${enc[K]}`]: K } & { [_: string]: 0 } & {
  [_: number]: 0;
};

// We need to split the bits up on the boundaries. However, we are better at
// decimal-based arithemetic. Therefore, we will use multiplication and division
// to compose each of the octets instead of summing all of the octets and using
// bitwise operations.
//
// |---------------------------------------|
// | 8 bytes    |  8 bytes    |    8 bytes |
// | 6 bytes | 6 bytes | 6 bytes | 6 bytes |
// |---------------------------------------|
//
// h1 = o1 * 2^2
// h2 = (o2 * 2^2) + (o3 / 2^2)
// h3 = (o3 * 2^2) + (o4 / 2^2)
// h4 = o4 / 2^2

type D<S extends string> = D extends keyof dec ? dec[D] : never;

export type Btoa<S extends string, $Acc extends string = ""> =
  //
  S extends `${infer $C1}${infer $C2}${infer $C3}${infer $Rest}`
    ? Btoa<
        $Rest,
        `${$Acc}${D<BitShiftRight<latin[$C1], 2>]}${dec[BitAnd<
          BitOr<BitShiftLeft<latin[$C1], 4>, BitShiftRight<latin[$C2], 4>>,
          63
        >>}${D<BitAnd<
          BitOr<BitShiftLeft<latin[$C2], 2>, BitShiftRight<latin[$C3], 6>>,
          63
        >>}${dec[BitAnd<latin[$C3], 63>]}`
      >
    : S extends `${infer $C1}${infer $C2}`
    ? `${$Acc}${D<BitShiftRight<latin[$C1], 2>]}${dec[BitAnd<
        BitOr<BitShiftLeft<latin[$C1], 4>, BitShiftRight<latin[$C2], 4>>,
        63
      >>}${D<BitAnd<BitShiftLeft<latin[$C2], 2>, 63>>}=`
    : S extends `${infer $C1}${infer $Rest}`
    ? `${$Acc}${D<BitShiftRight<latin[$C1], 2>>}${D<BitAnd<
        BitShiftLeft<latin[$C1], 4>,
        63
      >>}==`
    : $Acc;
