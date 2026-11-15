import type { ReactNode } from "react";

import { AppLink } from "@/components/ui/app-link";
import { Button } from "@/components/ui/button";

interface EntryActionProps {
  /** Hidden from sight, read after the label: "View Centus". */
  company: string;
  /** Opens in a new tab. */
  external?: boolean;
  /** No href renders a non-interactive label. */
  href?: string;
  /** Icon-only pill; `label` becomes screen-reader text. */
  icon?: ReactNode;
  label: string;
}

/** The pill on the right of an employment or venture row. */
export const EntryAction = ({
  company,
  external,
  href,
  icon,
  label,
}: EntryActionProps) => {
  const content = (
    <>
      {icon ?? label}
      <span className="sr-only">
        {icon ? label : null} {company}
      </span>
    </>
  );

  return (
    <Button
      asChild
      className="relative z-10"
      size={icon ? "icon" : undefined}
      variant="pill"
    >
      {href ? (
        <AppLink external={external} href={href}>
          {content}
        </AppLink>
      ) : (
        <span data-inactive="">{content}</span>
      )}
    </Button>
  );
};
