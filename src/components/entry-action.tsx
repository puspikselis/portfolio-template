import type { ReactNode } from "react";

import { AppLink } from "@/components/ui/app-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
export function EntryAction({
  company,
  external,
  href,
  icon,
  label,
}: EntryActionProps) {
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
      className={cn("relative z-10", icon && "w-9 px-0")}
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
}
