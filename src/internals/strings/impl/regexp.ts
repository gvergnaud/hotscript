declare const RegExpSymbol: unique symbol;
type RegExpSymbol = typeof RegExpSymbol;
export type SupportedRegExpFlags = "i" | "g";

export type RegExp<
  Pattern extends string,
  Flags extends SupportedRegExpFlags = never
> = {
  type: RegExpSymbol;
  pattern: Pattern;
  flags: Flags;
};
