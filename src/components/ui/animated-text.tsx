"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  className?: string;
  text: string;
}

const DURATION_MS = 250;
const STAGGER_MS = 8;
const EASE = "cubic-bezier(0.33,1,0.68,1)";

interface Leaving {
  text: string;
  width?: number;
}

function toCharItems(text: string) {
  return Array.from(text, (char, position) => ({
    char,
    id: `${position}-${char}`,
    position,
  }));
}

function Chars({ anim, text }: { anim: "in" | "none" | "out"; text: string }) {
  return toCharItems(text).map((item) => {
    const style: CSSProperties | undefined =
      anim === "none"
        ? undefined
        : {
            animation: `char-${anim} ${DURATION_MS}ms ${EASE} ${item.position * STAGGER_MS}ms both`,
          };
    return (
      <span
        className="relative inline-block overflow-hidden align-bottom"
        key={item.id}
      >
        <span className="inline-block" style={style}>
          {item.char === " " ? "\u00A0" : item.char}
        </span>
      </span>
    );
  });
}

export function AnimatedText({ text, className }: AnimatedTextProps) {
  const [leaving, setLeaving] = useState<Leaving | null>(null);
  const outerRef = useRef<HTMLSpanElement>(null);
  const prevTextRef = useRef(text);
  const prevWidthRef = useRef<number | undefined>(undefined);
  const hasChangedRef = useRef(false);

  // Render-phase derived state: when text changes, keep the old text around to animate out,
  // pinned to the width it was laid out at (so it doesn't rewrap over the new text).
  if (prevTextRef.current !== text) {
    if (prevTextRef.current && text) {
      setLeaving({ text: prevTextRef.current, width: prevWidthRef.current });
    }
    prevTextRef.current = text;
    hasChangedRef.current = true;
  }

  // Track the rendered width of the current text after every commit.
  // ceil: offsetWidth truncates subpixels, which rewraps the last character.
  useEffect(() => {
    const rect = outerRef.current?.getBoundingClientRect();
    prevWidthRef.current = rect ? Math.ceil(rect.width) : undefined;
  });

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
    <span className={cn("relative inline-block", className)} ref={outerRef}>
      <span className="inline-block" key={text}>
        <Chars anim={hasChangedRef.current ? "in" : "none"} text={text} />
      </span>
      {leaving ? (
        <span
          aria-hidden="true"
          className="absolute top-0 left-0"
          key={leaving.text}
          style={{ width: leaving.width }}
        >
          <Chars anim="out" text={leaving.text} />
        </span>
      ) : null}
    </span>
  );
}
