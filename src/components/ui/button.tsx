import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

// `inactive:` (globals.css) matches :disabled and [data-inactive], so a
// non-interactive <span> label can share the disabled look.
const PILL =
  "inset-highlight rounded-full inactive:bg-nero-300 inactive:text-dim-gray-100";

const buttonVariants = cva(
  "focus-ring inline-flex cursor-pointer inactive:cursor-not-allowed items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        link: "text-12 text-nobel-100 hover:text-ink",
        outline:
          "h-12 rounded-full border border-nero-400 px-6 text-13/4 text-nobel-100 hover:bg-nero-300 hover:text-ink focus-visible:bg-nero-300 focus-visible:text-ink",
        pill: `${PILL} h-9 bg-nero-100 px-4 text-12 text-ink hover:bg-nero-200`,
        pillLg: `${PILL} h-12 bg-ink px-6 text-13/4 text-nero-100 inactive:opacity-50 hover:bg-ink/90`,
      },
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  asChild = false,
  className,
  variant,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ className, variant }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button };
