"use client";

import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  'relative flex size-8 shrink-0 overflow-hidden rounded-full after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:inset-highlight after:content-[""]',
  {
    variants: {
      /** Dims slightly on hover. */
      fade: { true: "hover-fade" },
      shape: {
        circle: "",
        /** Rounded square, for logos and the header photo. */
        tile: "rounded-xl",
      },
    },
  }
);

type AvatarProps = ComponentProps<"span"> &
  VariantProps<typeof avatarVariants> & {
    /** Background colour behind the image (any CSS colour, e.g. from data). */
    color?: string;
  };

const Avatar = ({
  className,
  color,
  fade,
  shape,
  style,
  ...props
}: AvatarProps) => (
  <span
    className={cn(
      avatarVariants({ fade, shape }),
      color && "bg-(--color)",
      className
    )}
    data-slot="avatar"
    style={color ? ({ "--color": color, ...style } as CSSProperties) : style}
    {...props}
  />
);

// The image sits on top of the fallback: while it loads it is transparent, and
// if it fails it is removed, so the fallback shows.
// Logos and photos are already exported at 3x, so they skip the optimizer.
const AvatarImage = ({
  alt,
  className,
  src,
}: {
  alt: string;
  className?: string;
  src: string;
}) => {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // A failure before hydration fires no onError, so check once on mount.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) {
    return null;
  }
  return (
    <Image
      alt={alt}
      className={cn("object-cover", className)}
      data-slot="avatar-image"
      fill
      onError={() => setFailed(true)}
      ref={ref}
      sizes="48px"
      src={src}
      unoptimized
    />
  );
};

const avatarFallbackVariants = cva(
  "flex size-full items-center justify-center rounded-full bg-nero-100",
  {
    variants: {
      tone: {
        /** Faint initials straight on the Avatar's own `color`. */
        onColor: "bg-transparent text-15 tracking-tight-2 text-ink/20",
      },
    },
  }
);

const AvatarFallback = ({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof avatarFallbackVariants>) => (
  <span
    className={cn(avatarFallbackVariants({ tone }), className)}
    data-slot="avatar-fallback"
    {...props}
  />
);

export { Avatar, AvatarFallback, AvatarImage };
