"use client";

import type { ReactNode } from "react";

import { useCursorPreview } from "@/components/features/cursor-preview";
import { AppLink } from "@/components/ui/app-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TagList } from "@/components/ui/tag-list";
import { YearLabel } from "@/components/ui/year-label";
import { DEFAULT_PREVIEW_COLOR } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface EntryPreview {
  height?: number;
  image: string;
  width?: number;
}

interface EntryCardProps {
  /** Right-side buttons or labels. */
  actions?: ReactNode;
  /** The whole card becomes a link to it. */
  cardHref?: string;
  className?: string;
  /** Logo tile and hover preview colour. */
  color?: string;
  company: string;
  /** `cardHref` is another site: open it in a new tab. */
  external?: boolean;
  /** Avatar fallback when there is no image. */
  fallback?: ReactNode;
  image?: string;
  /** Marks the year line as the floating label's alignment target. */
  isFirst?: boolean;
  /** Shown by the cursor while it is over the row. */
  preview?: EntryPreview;
  tags: readonly string[];
  title: string;
  /** Truncate title and tags to one line (employment history). */
  truncate?: boolean;
  year: string;
}

/** One row of the employment history or ventures list: year, logo, role, company and tags. */
export const EntryCard = ({
  actions,
  cardHref,
  className,
  color = DEFAULT_PREVIEW_COLOR,
  company,
  external,
  fallback = "?",
  image,
  isFirst,
  preview,
  tags,
  title,
  truncate,
  year,
}: EntryCardProps) => {
  const { hidePreview, showPreview } = useCursorPreview();
  const previewHandlers = preview
    ? {
        onPointerEnter: () =>
          showPreview(preview.image, preview.width, preview.height),
        onPointerLeave: hidePreview,
      }
    : {};

  return (
    <div className={cn("space-y-6", className)}>
      <YearLabel isAlignTarget={isFirst} year={year} />
      <div
        className={cn(
          "relative flex items-center gap-4",
          cardHref && "cursor-pointer"
        )}
        {...previewHandlers}
      >
        <Avatar className="size-12" color={color} shape="tile">
          <AvatarFallback tone="onColor">{fallback}</AvatarFallback>
          {image ? <AvatarImage alt={`${company} logo`} src={image} /> : null}
        </Avatar>
        <div className={cn("space-y-1", truncate && "min-w-0 flex-1")}>
          <h3
            className={cn(
              "text-15/6 font-semibold tracking-tight-2 text-ink",
              truncate && "truncate"
            )}
          >
            {title}
            <span className="sr-only"> at {company}</span>
          </h3>
          <TagList tags={[company, ...tags]} truncate={truncate} />
        </div>
        {cardHref ? (
          // Same target as the row's button, so keyboard users skip it.
          <AppLink external={external} href={cardHref} overlay tabIndex={-1}>
            <span className="sr-only">{company}</span>
          </AppLink>
        ) : null}
        {actions ? (
          <div className="ml-auto flex items-center gap-1">{actions}</div>
        ) : null}
      </div>
    </div>
  );
};
