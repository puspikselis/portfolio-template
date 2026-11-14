import type { ReactNode } from "react";

/** One entry per character, keyed by position so repeated letters stay unique. */
export function toCharItems(text: string) {
  return Array.from(text, (char, position) => ({
    char,
    id: `${position}-${char}`,
    position,
  }));
}

/** A space as a non-breaking space, so it keeps its width inside an inline-block. */
export function displayChar(char: string) {
  return char === " " ? "\u00A0" : char;
}

/** Clipping box for one animated character. */
export function CharSlot({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      {children}
    </span>
  );
}
