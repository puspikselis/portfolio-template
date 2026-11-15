import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import type { CSSProperties } from "react";

import { CharSlot, displayChar, toCharItems } from "@/components/ui/char-split";
import { cn } from "@/lib/utils";

const rollingTextVariants = cva("inline-block", {
  variants: {
    tone: {
      /** 13px semibold ink, for the site name in the header. */
      title: "text-13/4 font-semibold text-ink",
    },
  },
});

interface RollingTextProps extends VariantProps<typeof rollingTextVariants> {
  className?: string;
  text: string;
}

const STAGGER_MS = 15;
// 0.3s on --ease-out-cubic, staggered STAGGER_MS per character (--char-delay).
const CHAR_CLASSES =
  "inline-block transition-roll delay-(--char-delay) duration-300 ease-out-cubic";

export const RollingText = ({ className, text, tone }: RollingTextProps) => (
  <span className={cn(rollingTextVariants({ tone }), className)}>
    <span className="sr-only">{text}</span>
    {/* Characters render twice for the roll effect; hide them from screen readers. */}
    <span aria-hidden="true">
      {toCharItems(text).map(({ char, id, position }) => {
        const shown = displayChar(char);
        const style = {
          "--char-delay": `${position * STAGGER_MS}ms`,
        } as CSSProperties;
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
