"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { CharSlot, displayChar, toCharItems } from "@/components/ui/char-split";

interface AnimatedTextProps {
  text: string;
}

const DURATION_MS = 250;
const STAGGER_MS = 8;
// animate-char-* (globals.css) read the duration and per-character delay.
const DURATION_STYLE = {
  "--char-duration": `${DURATION_MS}ms`,
} as CSSProperties;
const ANIM_CLASSES = { in: "animate-char-in", out: "animate-char-out" };

interface Leaving {
  text: string;
  width?: number;
}

const Chars = ({ anim, text }: { anim: "in" | "none" | "out"; text: string }) =>
  toCharItems(text).map((item) => (
    <CharSlot key={item.id}>
      {anim === "none" ? (
        <span className="inline-block">{displayChar(item.char)}</span>
      ) : (
        <span
          className={`inline-block ${ANIM_CLASSES[anim]}`}
          style={
            {
              "--char-delay": `${item.position * STAGGER_MS}ms`,
            } as CSSProperties
          }
        >
          {displayChar(item.char)}
        </span>
      )}
    </CharSlot>
  ));

export const AnimatedText = ({ text }: AnimatedTextProps) => {
  const [leaving, setLeaving] = useState<Leaving | null>(null);
  const [prevText, setPrevText] = useState(text);
  const [hasChanged, setHasChanged] = useState(false);
  // The laid-out width of the current text; undefined while nothing renders.
  const [width, setWidth] = useState<number | undefined>(undefined);

  // Render-phase derived state: when text changes, keep the old text around to animate out,
  // pinned to the width it was laid out at (so it doesn't rewrap over the new text).
  if (prevText !== text) {
    if (prevText && text) {
      setLeaving({ text: prevText, width });
    }
    setPrevText(text);
    setHasChanged(true);
  }

  // Track the rendered width of the current text whenever it lays out anew.
  // ceil: offsetWidth truncates subpixels, which rewraps the last character.
  const measureRef = useCallback((el: HTMLSpanElement | null) => {
    if (!el) {
      return;
    }
    const measure = () => setWidth(Math.ceil(el.getBoundingClientRect().width));
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      observer.disconnect();
      setWidth(undefined);
    };
  }, []);

  useEffect(() => {
    if (!leaving) {
      return;
    }
    const timeout = setTimeout(
      () => setLeaving(null),
      DURATION_MS + leaving.text.length * STAGGER_MS
    );
    return () => clearTimeout(timeout);
  }, [leaving]);

  if (!text) {
    return null;
  }

  return (
    <span
      className="relative inline-block"
      ref={measureRef}
      style={DURATION_STYLE}
    >
      <span className="inline-block" key={text}>
        <Chars anim={hasChanged ? "in" : "none"} text={text} />
      </span>
      {leaving ? (
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 w-(--leaving-width)"
          key={leaving.text}
          style={
            {
              "--leaving-width":
                leaving.width === undefined ? undefined : `${leaving.width}px`,
            } as CSSProperties
          }
        >
          <Chars anim="out" text={leaving.text} />
        </span>
      ) : null}
    </span>
  );
};
