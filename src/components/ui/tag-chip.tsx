import { TEXT_CAPTION_BASE } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function TagChip({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "inset-shadow-0-1-0 inset-shadow-highlight/4 flex h-9 items-center rounded-full bg-nero-300 px-5 text-ink",
        TEXT_CAPTION_BASE,
        className
      )}
      {...props}
    />
  );
}
