import type { ReactNode } from "react";

/** One entry per character, keyed by position so repeated letters stay unique. */
export const toCharItems = (text: string) =>
  Array.from(text, (char, position) => ({
    char,
    id: `${position}-${char}`,
    position,
  }));

/** A space as a non-breaking space, so it keeps its width inside an inline-block. */
export const displayChar = (char: string) => (char === " " ? "\u00A0" : char);

/** Clipping box for one animated character. */
export const CharSlot = ({ children }: { children: ReactNode }) => (
  <span className="relative inline-block overflow-hidden align-bottom">
    {children}
  </span>
);
