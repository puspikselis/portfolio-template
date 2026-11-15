import { cn } from "@/lib/utils";

interface TagListProps {
  tags: readonly string[];
  truncate?: boolean;
}

export const TagList = ({ tags, truncate }: TagListProps) => (
  <ul className={cn("flex", truncate && "min-w-0")}>
    {tags.map((tag) => (
      <li
        className={cn(
          "flex items-center not-first:*:text-dim-gray-100 not-first:before:mx-2 not-first:before:block not-first:before:size-1 not-first:before:rounded-full not-first:before:bg-nero-100 not-first:before:content-['']",
          truncate && "min-w-0 not-first:before:shrink-0"
        )}
        key={tag}
      >
        <span
          className={cn("text-15/6 tracking-tight-2", truncate && "truncate")}
        >
          {tag}
        </span>
      </li>
    ))}
  </ul>
);
