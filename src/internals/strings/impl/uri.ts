import { Fn } from "../../core/Core";

type UriEncodingTable = {
  "0": "0";
  "1": "1";
  "2": "2";
  "3": "3";
  "4": "4";
  "5": "5";
  "6": "6";
  "7": "7";
  "8": "8";
  "9": "9";
  "\u0000": "%00";
  "\u0001": "%01";
  "\u0002": "%02";
  "\u0003": "%03";
  "\u0004": "%04";
  "\u0005": "%05";
  "\u0006": "%06";
  "\u0007": "%07";
  "\b": "%08";
  "\t": "%09";
  "\n": "%0A";
  "\u000b": "%0B";
  "\f": "%0C";
  "\r": "%0D";
  "\u000e": "%0E";
  "\u000f": "%0F";
  "\u0010": "%10";
  "\u0011": "%11";
  "\u0012": "%12";
  "\u0013": "%13";
  "\u0014": "%14";
  "\u0015": "%15";
  "\u0016": "%16";
  "\u0017": "%17";
  "\u0018": "%18";
  "\u0019": "%19";
  "\u001a": "%1A";
  "\u001b": "%1B";
  "\u001c": "%1C";
  "\u001d": "%1D";
  "\u001e": "%1E";
  "\u001f": "%1F";
  " ": "%20";
  "!": "!";
  '"': "%22";
  "#": "%23";
  $: "%24";
  "%": "%25";
  "&": "%26";
  "'": "'";
  "(": "(";
  ")": ")";
  "*": "*";
  "+": "%2B";
  ",": "%2C";
  "-": "-";
  ".": ".";
  "/": "%2F";
  ":": "%3A";
  ";": "%3B";
  "<": "%3C";
  "=": "%3D";
  ">": "%3E";
  "?": "%3F";
  "@": "%40";
  A: "A";
  B: "B";
  C: "C";
  D: "D";
  E: "E";
  F: "F";
  G: "G";
  H: "H";
  I: "I";
  J: "J";
  K: "K";
  L: "L";
  M: "M";
  N: "N";
  O: "O";
  P: "P";
  Q: "Q";
  R: "R";
  S: "S";
  T: "T";
  U: "U";
  V: "V";
  W: "W";
  X: "X";
  Y: "Y";
  Z: "Z";
  "[": "%5B";
  "\\": "%5C";
  "]": "%5D";
  "^": "%5E";
  _: "_";
  "`": "%60";
  a: "a";
  b: "b";
  c: "c";
  d: "d";
  e: "e";
  f: "f";
  g: "g";
  h: "h";
  i: "i";
  j: "j";
  k: "k";
  l: "l";
  m: "m";
  n: "n";
  o: "o";
  p: "p";
  q: "q";
  r: "r";
  s: "s";
  t: "t";
  u: "u";
  v: "v";
  w: "w";
  x: "x";
  y: "y";
  z: "z";
  "{": "%7B";
  "|": "%7C";
  "}": "%7D";
  "~": "~";
  "": "%7F";
  "": "%C2%80";
  "": "%C2%81";
  "": "%C2%82";
  "": "%C2%83";
  "": "%C2%84";
  "": "%C2%85";
  "": "%C2%86";
  "": "%C2%87";
  "": "%C2%88";
  "": "%C2%89";
  "": "%C2%8A";
  "": "%C2%8B";
  "": "%C2%8C";
  "": "%C2%8D";
  "": "%C2%8E";
  "": "%C2%8F";
  "": "%C2%90";
  "": "%C2%91";
  "": "%C2%92";
  "": "%C2%93";
  "": "%C2%94";
  "": "%C2%95";
  "": "%C2%96";
  "": "%C2%97";
  "": "%C2%98";
  "": "%C2%99";
  "": "%C2%9A";
  "": "%C2%9B";
  "": "%C2%9C";
  "": "%C2%9D";
  "": "%C2%9E";
  "": "%C2%9F";
  " ": "%C2%A0";
  "¡": "%C2%A1";
  "¢": "%C2%A2";
  "£": "%C2%A3";
  "¤": "%C2%A4";
  "¥": "%C2%A5";
  "¦": "%C2%A6";
  "§": "%C2%A7";
  "¨": "%C2%A8";
  "©": "%C2%A9";
  ª: "%C2%AA";
  "«": "%C2%AB";
  "¬": "%C2%AC";
  "­": "%C2%AD";
  "®": "%C2%AE";
  "¯": "%C2%AF";
  "°": "%C2%B0";
  "±": "%C2%B1";
  "²": "%C2%B2";
  "³": "%C2%B3";
  "´": "%C2%B4";
  µ: "%C2%B5";
  "¶": "%C2%B6";
  "·": "%C2%B7";
  "¸": "%C2%B8";
  "¹": "%C2%B9";
  º: "%C2%BA";
  "»": "%C2%BB";
  "¼": "%C2%BC";
  "½": "%C2%BD";
  "¾": "%C2%BE";
  "¿": "%C2%BF";
  À: "%C3%80";
  Á: "%C3%81";
  Â: "%C3%82";
  Ã: "%C3%83";
  Ä: "%C3%84";
  Å: "%C3%85";
  Æ: "%C3%86";
  Ç: "%C3%87";
  È: "%C3%88";
  É: "%C3%89";
  Ê: "%C3%8A";
  Ë: "%C3%8B";
  Ì: "%C3%8C";
  Í: "%C3%8D";
  Î: "%C3%8E";
  Ï: "%C3%8F";
  Ð: "%C3%90";
  Ñ: "%C3%91";
  Ò: "%C3%92";
  Ó: "%C3%93";
  Ô: "%C3%94";
  Õ: "%C3%95";
  Ö: "%C3%96";
  "×": "%C3%97";
  Ø: "%C3%98";
  Ù: "%C3%99";
  Ú: "%C3%9A";
  Û: "%C3%9B";
  Ü: "%C3%9C";
  Ý: "%C3%9D";
  Þ: "%C3%9E";
  ß: "%C3%9F";
  à: "%C3%A0";
  á: "%C3%A1";
  â: "%C3%A2";
  ã: "%C3%A3";
  ä: "%C3%A4";
  å: "%C3%A5";
  æ: "%C3%A6";
  ç: "%C3%A7";
  è: "%C3%A8";
  é: "%C3%A9";
  ê: "%C3%AA";
  ë: "%C3%AB";
  ì: "%C3%AC";
  í: "%C3%AD";
  î: "%C3%AE";
  ï: "%C3%AF";
  ð: "%C3%B0";
  ñ: "%C3%B1";
  ò: "%C3%B2";
  ó: "%C3%B3";
  ô: "%C3%B4";
  õ: "%C3%B5";
  ö: "%C3%B6";
  "÷": "%C3%B7";
  ø: "%C3%B8";
  ù: "%C3%B9";
  ú: "%C3%BA";
  û: "%C3%BB";
  ü: "%C3%BC";
  ý: "%C3%BD";
  þ: "%C3%BE";
  ÿ: "%C3%BF";
};

/**
 * Encodes a single ASCII character.
 * @param T The character to encode.
 * @returns The encoded character.
 * Notes:
 * - Only works for ASCII characters.
 * - Characters that are not in the table are returned as-is.
 */
type EncodeAsciiChar<T extends string> = T extends keyof UriEncodingTable
  ? UriEncodingTable[T]
  : T;

export interface EncodeAsciiCharFn extends Fn {
  return: this["arg0"] extends string ? EncodeAsciiChar<this["arg0"]> : never;
}

/**
 * Decodes a URI component.
 * @param T The URI component to decode.
 * @param Agg The accumulator for the decoded string.
 * @returns The decoded string.
 * Notes:
 * - Only works for ASCII characters.
 * - For performance reasons, there is no table lookup for the characters.
 *
 */
//prettier-ignore
export type DecodeURIComponent<T extends string,Agg extends string = ""> = 
  T extends `%C3%BF${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ÿ`>
: T extends `%C3%BE${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}þ`>
: T extends `%C3%BD${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ý`>
: T extends `%C3%BC${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ü`>
: T extends `%C3%BB${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}û`>
: T extends `%C3%BA${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ú`>
: T extends `%C3%B9${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ù`>
: T extends `%C3%B8${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ø`>
: T extends `%C3%B7${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}÷`>
: T extends `%C3%B6${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ö`>
: T extends `%C3%B5${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}õ`>
: T extends `%C3%B4${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ô`>
: T extends `%C3%B3${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ó`>
: T extends `%C3%B2${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ò`>
: T extends `%C3%B1${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ñ`>
: T extends `%C3%B0${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ð`>
: T extends `%C3%AF${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ï`>
: T extends `%C3%AE${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}î`>
: T extends `%C3%AD${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}í`>
: T extends `%C3%AC${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ì`>
: T extends `%C3%AB${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ë`>
: T extends `%C3%AA${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ê`>
: T extends `%C3%A9${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}é`>
: T extends `%C3%A8${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}è`>
: T extends `%C3%A7${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ç`>
: T extends `%C3%A6${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}æ`>
: T extends `%C3%A5${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}å`>
: T extends `%C3%A4${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ä`>
: T extends `%C3%A3${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ã`>
: T extends `%C3%A2${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}â`>
: T extends `%C3%A1${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}á`>
: T extends `%C3%A0${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}à`>
: T extends `%C3%9F${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ß`>
: T extends `%C3%9E${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Þ`>
: T extends `%C3%9D${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ý`>
: T extends `%C3%9C${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ü`>
: T extends `%C3%9B${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Û`>
: T extends `%C3%9A${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ú`>
: T extends `%C3%99${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ù`>
: T extends `%C3%98${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ø`>
: T extends `%C3%97${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}×`>
: T extends `%C3%96${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ö`>
: T extends `%C3%95${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Õ`>
: T extends `%C3%94${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ô`>
: T extends `%C3%93${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ó`>
: T extends `%C3%92${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ò`>
: T extends `%C3%91${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ñ`>
: T extends `%C3%90${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ð`>
: T extends `%C3%8F${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ï`>
: T extends `%C3%8E${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Î`>
: T extends `%C3%8D${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Í`>
: T extends `%C3%8C${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ì`>
: T extends `%C3%8B${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ë`>
: T extends `%C3%8A${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ê`>
: T extends `%C3%89${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}É`>
: T extends `%C3%88${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}È`>
: T extends `%C3%87${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ç`>
: T extends `%C3%86${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Æ`>
: T extends `%C3%85${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Å`>
: T extends `%C3%84${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ä`>
: T extends `%C3%83${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Ã`>
: T extends `%C3%82${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Â`>
: T extends `%C3%81${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}Á`>
: T extends `%C3%80${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}À`>
: T extends `%C2%BF${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¿`>
: T extends `%C2%BE${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¾`>
: T extends `%C2%BD${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}½`>
: T extends `%C2%BC${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¼`>
: T extends `%C2%BB${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}»`>
: T extends `%C2%BA${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}º`>
: T extends `%C2%B9${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¹`>
: T extends `%C2%B8${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¸`>
: T extends `%C2%B7${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}·`>
: T extends `%C2%B6${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¶`>
: T extends `%C2%B5${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}µ`>
: T extends `%C2%B4${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}´`>
: T extends `%C2%B3${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}³`>
: T extends `%C2%B2${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}²`>
: T extends `%C2%B1${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}±`>
: T extends `%C2%B0${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}°`>
: T extends `%C2%AF${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¯`>
: T extends `%C2%AE${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}®`>
: T extends `%C2%AD${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}­`>
: T extends `%C2%AC${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¬`>
: T extends `%C2%AB${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}«`>
: T extends `%C2%AA${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}ª`>
: T extends `%C2%A9${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}©`>
: T extends `%C2%A8${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¨`>
: T extends `%C2%A7${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}§`>
: T extends `%C2%A6${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¦`>
: T extends `%C2%A5${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¥`>
: T extends `%C2%A4${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¤`>
: T extends `%C2%A3${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}£`>
: T extends `%C2%A2${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¢`>
: T extends `%C2%A1${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}¡`>
: T extends `%C2%A0${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg} `>
: T extends `%C2%9F${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%9E${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%9D${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%9C${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%9B${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%9A${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%99${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%98${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%97${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%96${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%95${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%94${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%93${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%92${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%91${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%90${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%8F${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%8E${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%8D${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%8C${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%8B${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%8A${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%89${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%88${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%87${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%86${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%85${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%84${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%83${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%82${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%81${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%C2%80${infer Rest extends string}`  ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%7F${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%7e${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}~`>
: T extends `%7D${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}}`>
: T extends `%7C${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}|`>
: T extends `%7B${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}{`>
: T extends `%7a${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}z`>
: T extends `%79${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}y`>
: T extends `%78${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}x`>
: T extends `%77${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}w`>
: T extends `%76${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}v`>
: T extends `%75${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}u`>
: T extends `%74${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}t`>
: T extends `%73${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}s`>
: T extends `%72${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}r`>
: T extends `%71${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}q`>
: T extends `%70${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}p`>
: T extends `%6f${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}o`>
: T extends `%6e${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}n`>
: T extends `%6d${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}m`>
: T extends `%6c${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}l`>
: T extends `%6b${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}k`>
: T extends `%6a${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}j`>
: T extends `%69${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}i`>
: T extends `%68${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}h`>
: T extends `%67${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}g`>
: T extends `%66${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}f`>
: T extends `%65${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}e`>
: T extends `%64${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}d`>
: T extends `%63${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}c`>
: T extends `%62${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}b`>
: T extends `%61${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}a`>
: T extends `%60${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}\``>
: T extends `%5f${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}_`>
: T extends `%5E${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}^`>
: T extends `%5D${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}]`>
: T extends `%5C${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}\\`>
: T extends `%5B${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}[`>
: T extends `%5a${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}Z`>
: T extends `%59${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}Y`>
: T extends `%58${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}X`>
: T extends `%57${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}W`>
: T extends `%56${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}V`>
: T extends `%55${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}U`>
: T extends `%54${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}T`>
: T extends `%53${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}S`>
: T extends `%52${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}R`>
: T extends `%51${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}Q`>
: T extends `%50${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}P`>
: T extends `%4f${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}O`>
: T extends `%4e${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}N`>
: T extends `%4d${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}M`>
: T extends `%4c${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}L`>
: T extends `%4b${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}K`>
: T extends `%4a${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}J`>
: T extends `%49${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}I`>
: T extends `%48${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}H`>
: T extends `%47${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}G`>
: T extends `%46${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}F`>
: T extends `%45${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}E`>
: T extends `%44${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}D`>
: T extends `%43${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}C`>
: T extends `%42${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}B`>
: T extends `%41${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}A`>
: T extends `%40${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}@`>
: T extends `%3F${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}?`>
: T extends `%3E${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}>`>
: T extends `%3D${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}=`>
: T extends `%3C${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}<`>
: T extends `%3B${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg};`>
: T extends `%3A${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}:`>
: T extends `%39${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}9`>
: T extends `%38${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}8`>
: T extends `%37${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}7`>
: T extends `%36${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}6`>
: T extends `%35${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}5`>
: T extends `%34${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}4`>
: T extends `%33${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}3`>
: T extends `%32${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}2`>
: T extends `%31${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}1`>
: T extends `%30${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}0`>
: T extends `%2F${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}/`>
: T extends `%2e${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}.`>
: T extends `%2d${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}-`>
: T extends `%2C${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg},`>
: T extends `%2B${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}+`>
: T extends `%2a${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}*`>
: T extends `%29${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg})`>
: T extends `%28${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}(`>
: T extends `%27${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}'`>
: T extends `%26${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}&`>
: T extends `%25${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}%`>
: T extends `%24${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}$`>
: T extends `%23${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}#`>
: T extends `%22${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}"`>
: T extends `%21${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}!`>
: T extends `%20${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg} `>
: T extends `%1F${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%1E${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%1E${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%1D${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%1C${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%1B${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%1A${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%19${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%18${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%17${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%16${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%15${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%14${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%13${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%12${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%11${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%10${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%0F${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%0E${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%0D${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}
`>
: T extends `%0C${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%0B${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%0A${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}
`>
: T extends `%09${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}	`>
: T extends `%08${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%07${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%06${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%05${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%04${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%03${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%02${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%01${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg}`>
: T extends `%00${infer Rest extends string}`     ? DecodeURIComponent<Rest,`${Agg} `>
: T extends `${infer Char}${infer Rest extends string}` ? DecodeURIComponent<Rest,`${Agg}${Char}`>
: Agg;

export interface DecodeURIComponentFn extends Fn {
  return: this["arg0"] extends string
    ? DecodeURIComponent<this["arg0"]>
    : never;
}
