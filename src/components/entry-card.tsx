import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TagList } from "@/components/ui/tag-list";
import { cn, getYear } from "@/lib/utils";

interface EntryCardProps {
  /** Right-side buttons or labels. */
  actions?: ReactNode;
  /** The whole card becomes a link to it. */
  cardHref?: string;
  className?: string;
  color: string;
  company: string;
  /** `cardHref` is another site: open it in a new tab. */
  external?: boolean;
  /** Avatar fallback when there is no image. */
  fallback?: ReactNode;
  image?: string;
  /** Marks the year line as the floating label's alignment target. */
  isFirst?: boolean;
  tags: readonly string[];
  title: string;
  /** Truncate title and tags to one line (employment history). */
  truncate?: boolean;
  year: string;
}

/** One row of the employment history or ventures list: year, logo, role, company and tags. */
export function EntryCard({
  actions,
  cardHref,
  className,
  color,
  company,
  external,
  fallback = "?",
  image,
  isFirst,
  tags,
  title,
  truncate,
  year,
}: EntryCardProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <p
        className="font-medium text-13/4 text-dim-gray-100"
        data-align-target={isFirst ? "true" : undefined}
      >
        <time dateTime={getYear(year)}>{year}</time>
      </p>
      <div
        className={cn(
          "relative flex items-center gap-4",
          cardHref && "cursor-pointer"
        )}
      >
        <Avatar
          className="size-12 rounded-xl bg-(--color)"
          style={{ "--color": color } as CSSProperties}
        >
          <AvatarImage alt={`${company} logo`} src={image} />
          <AvatarFallback className="bg-transparent text-15 text-ink/20 -tracking-[0.02em]">
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div className={cn("space-y-1", truncate && "min-w-0 flex-1")}>
          <h3
            className={cn(
              "font-semibold text-15/6 text-ink -tracking-[0.02em]",
              truncate && "truncate"
            )}
          >
            {title}
            <span className="sr-only"> at {company}</span>
          </h3>
          <TagList tags={[company, ...tags]} truncate={truncate} />
        </div>
        {cardHref && external ? (
          <a
            className="link-overlay"
            href={cardHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="sr-only">Visit {company} website</span>
          </a>
        ) : null}
        {cardHref && !external ? (
          <Link className="link-overlay" href={cardHref} tabIndex={-1}>
            <span className="sr-only">{company}</span>
          </Link>
        ) : null}
        {actions ? (
          <div className="ml-auto flex items-center gap-1">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
