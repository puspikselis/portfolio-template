import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const sectionVariants = cva("", {
  variants: {
    variant: {
      /** The reading column most sections sit in. */
      narrow: "narrow-container",
      /** A raised dark panel with a soft top edge, square on phones. */
      panel: "bg-nero-300 px-8 py-8 inset-highlight-soft md:rounded-3xl",
    },
  },
});

interface SectionProps
  extends
    Omit<ComponentProps<"section">, "title">,
    VariantProps<typeof sectionVariants> {
  /** `data-color` for the floating label while this section is in view; the orange accent by default. */
  color?: string;
  /** Renders `title` as a visually hidden h2 with this id and labels the section with it. */
  headingId?: string;
  /** `data-title` for the floating label. */
  title: string;
}

/** A page section the floating label tracks, optionally with a screen-reader heading. */
export const Section = ({
  children,
  className,
  color = "var(--color-orange-100)",
  headingId,
  title,
  variant,
  ...props
}: SectionProps) => (
  <section
    aria-labelledby={headingId}
    className={cn(sectionVariants({ variant }), className) || undefined}
    data-color={color}
    data-title={title}
    {...props}
  >
    {headingId ? (
      <h2 className="sr-only" id={headingId}>
        {title}
      </h2>
    ) : null}
    {children}
  </section>
);
