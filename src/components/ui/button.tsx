import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-semibold outline-none transition-all disabled:cursor-not-allowed [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      variant: "unstyled",
    },
    variants: {
      variant: {
        link: "text-12 text-nobel-100 hover:text-ink",
        pill: "inset-shadow-0-1-0 inset-shadow-highlight/8 h-9 rounded-full bg-nero-100 px-4 text-12 text-ink hover:bg-nero-200 disabled:bg-nero-300 disabled:text-dim-gray-100",
        pillLg:
          "inset-shadow-0-1-0 inset-shadow-highlight/8 h-12 rounded-full bg-ink px-6 text-13/4 text-nero-100 hover:bg-ink/90 disabled:bg-nero-300 disabled:text-dim-gray-100 disabled:opacity-50",
        unstyled: "",
      },
    },
  }
);

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;

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

export { Button, type ButtonVariant, buttonVariants };
