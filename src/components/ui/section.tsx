import type { ComponentProps } from "react";

interface SectionProps extends Omit<ComponentProps<"section">, "title"> {
  /** `data-color` for the floating label while this section is in view; the orange accent by default. */
  color?: string;
  /** Renders `title` as a visually hidden h2 with this id and labels the section with it. */
  headingId?: string;
  /** `data-title` for the floating label. */
  title: string;
}

/** A page section the floating label tracks, optionally with a screen-reader heading. */
export function Section({
  children,
  color = "var(--color-orange-100)",
  headingId,
  title,
  ...props
}: SectionProps) {
  return (
    <section
      aria-labelledby={headingId}
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
}
