import { Call2 } from "../../core/Core";
import { Numbers } from "../../numbers/Numbers";
import { StringToTuple } from "./split";
import { Equal as _Equal } from "../../helpers";

// prettier-ignore
type ascii = {
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
  é: 130; â: 131; ä: 132; à: 133; å: 134; ç: 135; ê: 136; ë: 137; è: 138; ï: 139;
  î: 140; ì: 141; Ä: 142; Å: 143; É: 144; æ: 145; Æ: 146; ô: 147; ö: 148; ò: 149;
  û: 150; ù: 151; ÿ: 152; Ö: 153; Ü: 154; ø: 155; "£": 156; Ø: 157; "×": 158; ƒ: 159;
  á: 160; í: 161; ó: 162; ú: 163; ñ: 164; Ñ: 165; ª: 166; º: 167; "¿": 168; "®": 169;
  "½": 171; "¼": 172; "¡": 173; "«": 174; "»": 175; "░": 176; "▒": 177; "▓": 178; "│": 179;
  "┤": 180; Á: 181; Â: 182; À: 183; "©": 184; "╣": 185; "║": 186; "╗": 187; "╝": 188; "¢": 189;
  "¥": 190; "┐": 191; "└": 192; "┴": 193; "┬": 194; "├": 195; "─": 196; "┼": 197; ã: 198; Ã: 199;
  "╚": 200; "╔": 201; "╩": 202; "╦": 203; "╠": 204; "═": 205; "╬": 206; "¤": 207; ð: 208; Ð: 209;
  Ê: 210; Ë: 211; È: 212; ı: 213; Í: 214; Î: 215; Ï: 216; "┘": 217; "┌": 218; "█": 219;
  "▄": 220; "¦": 221; Ì: 222; "▀": 223; Ó: 224; ß: 225; Ô: 226; Ò: 227; õ: 228; Õ: 229;
  µ: 230; þ: 231; Þ: 232; Ú: 233; Û: 234; Ù: 235; ý: 236; Ý: 237; "¯": 238; "´": 239;
  "¬": 240; "±": 241; "‗": 242; "¾": 243; "¶": 244; "§": 245; "÷": 246; "¸": 247; "°": 248; "¨": 249;
  "•": 250; "¹": 251; "³": 252; "²": 253; "■": 254;
};

type CharacterCompare<
  Char1 extends string,
  Char2 extends string
> = Char1 extends Char2
  ? 0
  : Char1 extends keyof ascii
  ? Char2 extends keyof ascii
    ? Call2<Numbers.Compare, ascii[Char1], ascii[Char2]>
    : 1
  : -1;

type CharactersCompare<T extends string[], U extends string[]> = T extends [
  infer N1 extends string,
  ...infer R1 extends string[]
]
  ? U extends [infer N2 extends string, ...infer R2 extends string[]]
    ? CharacterCompare<N1, N2> extends 0
      ? CharactersCompare<R1, R2>
      : CharacterCompare<N1, N2>
    : 1
  : U extends [string, ...string[]]
  ? -1
  : 0;

export type Compare<T extends string, U extends string> = _Equal<
  T,
  U
> extends true
  ? 0
  : CharactersCompare<StringToTuple<T>, StringToTuple<U>>;

export type LessThan<T extends string, U extends string> = Compare<
  T,
  U
> extends -1
  ? true
  : false;

export type LessThanOrEqual<T extends string, U extends string> = Compare<
  T,
  U
> extends 1
  ? false
  : true;

export type Equal<T extends string, U extends string> = _Equal<T, U>;

export type NotEqual<T extends string, U extends string> = _Equal<
  T,
  U
> extends true
  ? false
  : true;

export type GreaterThan<T extends string, U extends string> = Compare<
  T,
  U
> extends 1
  ? true
  : false;

export type GreaterThanOrEqual<T extends string, U extends string> = Compare<
  T,
  U
> extends -1
  ? false
  : true;
