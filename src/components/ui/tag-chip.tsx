import { TEXT_CAPTION_BASE } from "@/lib/typography";
import { cn } from "@/lib/utils";

export const TagChip = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    className={cn(
      "flex h-9 items-center rounded-full bg-nero-300 px-5 text-ink inset-highlight-soft",
      TEXT_CAPTION_BASE,
      className
    )}
    {...props}
  />
);
