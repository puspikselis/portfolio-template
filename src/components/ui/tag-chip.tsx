import { cn } from "@/lib/utils";

export function TagChip({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "inset-shadow-0-1-0 inset-shadow-highlight/4 flex h-9 items-center rounded-full bg-nero-300 px-5 font-medium text-12/4 text-ink -tracking-[0.03em]",
        className
      )}
      {...props}
    />
  );
}
