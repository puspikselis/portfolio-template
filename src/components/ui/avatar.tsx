"use client";

import {
  Fallback as AvatarFallbackPrimitive,
  Image as AvatarImagePrimitive,
  Root as AvatarRootPrimitive,
} from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
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

type AvatarProps = ComponentProps<typeof AvatarRootPrimitive> &
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
  <AvatarRootPrimitive
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

const AvatarImage = ({
  className,
  ...props
}: ComponentProps<typeof AvatarImagePrimitive>) => (
  <AvatarImagePrimitive
    className={cn("aspect-square size-full", className)}
    data-slot="avatar-image"
    {...props}
  />
);

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
}: ComponentProps<typeof AvatarFallbackPrimitive> &
  VariantProps<typeof avatarFallbackVariants>) => (
  <AvatarFallbackPrimitive
    className={cn(avatarFallbackVariants({ tone }), className)}
    data-slot="avatar-fallback"
    {...props}
  />
);

export { Avatar, AvatarFallback, AvatarImage };
