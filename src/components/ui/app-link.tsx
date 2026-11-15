import Link from "next/link";
import type { ComponentProps } from "react";

type AppLinkProps = ComponentProps<"a"> & {
  /** Another site or a file: opens in a new tab. */
  external?: boolean;
  href: string;
};

/** The one link element: in-app routes go through next/link, the rest open in a new tab. */
export function AppLink({ external, href, ...props }: AppLinkProps) {
  if (external) {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank" {...props} />
    );
  }
  return <Link href={href} {...props} />;
}
