import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const appLinkVariants = cva("", {
  variants: {
    /** Keyboard focus ring, for links that are not inside a Button. */
    focusRing: { true: "focus-ring" },
    /** Stretches the link over its positioned parent (a whole-row click target). */
    overlay: { true: "link-overlay" },
    tone: {
      /** Dims slightly on hover. */
      fade: "hover-fade",
      /** Body grey that brightens to ink on hover. */
      quiet: "text-nobel-100 transition-colors hover:text-ink",
      /** The now-playing status: icon and title in one faded row. */
      status: "flex items-center gap-1.5 hover-fade",
    },
  },
});

type AppLinkProps = ComponentProps<"a"> &
  VariantProps<typeof appLinkVariants> & {
    /** Another site or a file: opens in a new tab. */
    external?: boolean;
    href: string;
  };

/** The one link element: in-app routes go through next/link, the rest open in a new tab. */
export const AppLink = ({
  children,
  className,
  external,
  focusRing,
  href,
  overlay,
  tone,
  ...props
}: AppLinkProps) => {
  const classes =
    cn(appLinkVariants({ focusRing, overlay, tone }), className) || undefined;
  if (external) {
    return (
      <a
        className={classes}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <Link className={classes} href={href} {...props}>
      {children}
    </Link>
  );
};
