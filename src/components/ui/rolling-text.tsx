import type { CSSProperties } from "react";

import { CharSlot, displayChar, toCharItems } from "@/components/ui/char-split";
import { cn } from "@/lib/utils";

interface RollingTextProps {
  className?: string;
  text: string;
}

// 0.3s on --ease-out-cubic with a 15ms/char stagger.
const CHAR_CLASSES =
  "inline-block transition-[translate,opacity,filter] duration-300 ease-out-cubic";

export function RollingText({ className, text }: RollingTextProps) {
  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      {/* Characters render twice for the roll effect; hide them from screen readers. */}
      <span aria-hidden="true">
        {toCharItems(text).map(({ char, id, position }) => {
          const shown = displayChar(char);
          const style: CSSProperties = {
            transitionDelay: `${position * 15}ms`,
          };
          return (
            <CharSlot key={id}>
              <span
                className={cn(
                  CHAR_CLASSES,
                  "group-hover:translate-y-full group-hover:opacity-0 group-hover:blur-[4px]"
                )}
                style={style}
              >
                {shown}
              </span>
              <span
                className={cn(
                  CHAR_CLASSES,
                  "absolute inset-0 -translate-y-full opacity-0 blur-[4px] group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-none"
                )}
                style={style}
              >
                {shown}
              </span>
            </CharSlot>
          );
        })}
      </span>
    </span>
  );
}
