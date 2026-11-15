"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useCursorPreview } from "@/components/features/cursor-preview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EntryPreview {
  height?: number;
  image: string;
  width?: number;
}

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
  preview?: EntryPreview;
  previewColor: string;
}

/**
 * The one pill on the right of an employment or venture row. It is the only
 * hover target for the cursor preview, in both lists.
 */
export function EntryAction({
  company,
  external,
  href,
  icon,
  label,
  preview,
  previewColor,
}: EntryActionProps) {
  const { hidePreview, showPreview } = useCursorPreview();
  const previewHandlers = preview
    ? {
        onPointerEnter: () =>
          showPreview(
            previewColor,
            preview.image,
            preview.width,
            preview.height
          ),
        onPointerLeave: hidePreview,
      }
    : {};

  const content = (
    <>
      {icon ?? label}
      <span className="sr-only">
        {icon ? label : null} {company}
      </span>
    </>
  );

  let child: ReactNode;
  if (!href) {
    child = (
      <span data-inactive="" {...previewHandlers}>
        {content}
      </span>
    );
  } else if (external) {
    child = (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        {...previewHandlers}
      >
        {content}
      </a>
    );
  } else {
    child = (
      <Link href={href} {...previewHandlers}>
        {content}
      </Link>
    );
  }

  return (
    <Button
      asChild
      className={cn("relative z-10", icon && "w-9 px-0")}
      variant="pill"
    >
      {child}
    </Button>
  );
}
