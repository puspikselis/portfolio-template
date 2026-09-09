"use client";

import { type CSSProperties, useState } from "react";

import { useCursorPreview } from "@/components/features/cursor-preview";
import { AppStoreIcon, PlayStoreIcon } from "@/components/icons/store-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RollingText } from "@/components/ui/rolling-text";
import { TagList } from "@/components/ui/tag-list";
import { businesses, type Platform } from "@/data/businesses";
import { DEFAULT_PREVIEW_COLOR } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STORE_ICONS = {
  appStore: AppStoreIcon,
  playStore: PlayStoreIcon,
};

const IOS_RE = /iphone|ipad|ipod/;
const ANDROID_RE = /android/;
const YEAR_RE = /\d{4}/;

function detectPlatform(): Platform | null {
  if (typeof window === "undefined" || window.innerWidth >= 768) {
    return null;
  }
  const ua = window.navigator.userAgent.toLowerCase();
  if (IOS_RE.test(ua)) {
    return "ios";
  }
  if (ANDROID_RE.test(ua)) {
    return "android";
  }
  return null;
}

function buttonContent(
  Icon: typeof AppStoreIcon | null,
  variant: string,
  label: string
) {
  if (Icon) {
    return (
      <>
        <Icon className="size-3.5" />
        <span className="sr-only">{label}</span>
      </>
    );
  }
  return variant === "link" ? <RollingText text={label} /> : label;
}

function BusinessCard({
  business,
  isFirst,
}: {
  business: (typeof businesses)[number];
  isFirst?: boolean;
}) {
  const { hidePreview, showPreview } = useCursorPreview();
  const previewColor = business.color || DEFAULT_PREVIEW_COLOR;

  const [platform] = useState(detectPlatform);
  const irrelevant: Platform | null =
    platform && (platform === "ios" ? "android" : "ios");
  const filteredButtons = business.buttons.filter(
    (btn) => btn.platform !== irrelevant
  );

  const [primaryButton] = filteredButtons;
  const isCardInteractive = Boolean(business.cardHref);

  const handleCardPointerEnter = () => {
    if (!(business.previewOnCardHover && primaryButton?.preview)) {
      return;
    }
    const { image, width, height } = primaryButton.preview;
    showPreview(previewColor, image, width, height);
  };

  const yearMatch = business.year.match(YEAR_RE);
  const dateTime = yearMatch ? yearMatch[0] : undefined;

  return (
    <div className="space-y-6 not-first-of-type:before:my-7 not-first-of-type:before:block not-first-of-type:before:h-px not-first-of-type:before:w-full not-first-of-type:before:bg-nero-400 not-first-of-type:before:content-['']">
      <p
        className="font-medium text-13/4 text-dim-gray-100"
        data-align-target={isFirst ? "true" : undefined}
      >
        <time dateTime={dateTime}>{business.year}</time>
      </p>
      <div
        className={cn(
          "relative flex items-center gap-4",
          isCardInteractive && "cursor-pointer"
        )}
        onPointerEnter={
          business.previewOnCardHover ? handleCardPointerEnter : undefined
        }
        onPointerLeave={business.previewOnCardHover ? hidePreview : undefined}
      >
        <Avatar
          className="size-12 rounded-xl bg-(--color)"
          style={{ "--color": previewColor } as CSSProperties}
        >
          <AvatarImage alt={`${business.title} logo`} src={business.image} />
          <AvatarFallback className="bg-transparent text-15 text-ink/20 -tracking-[0.02em]">
            ?
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="font-semibold text-15/6 text-ink -tracking-[0.02em]">
            {business.title}
          </h3>
          <TagList tags={business.tags} />
        </div>
        {isCardInteractive && business.cardHref ? (
          <a
            className="link-overlay"
            href={business.cardHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="sr-only">
              Visit {business.tags[0] || business.title} website
            </span>
          </a>
        ) : null}
        {filteredButtons.length > 0 && (
          <div className="ml-auto flex items-center gap-1">
            {filteredButtons.map((button) => {
              const { preview } = button;
              const Icon = button.icon ? STORE_ICONS[button.icon] : null;
              const variant = button.variant ?? "pill";
              const onPointerEnter = preview
                ? () =>
                    showPreview(
                      previewColor,
                      preview.image,
                      preview.width,
                      preview.height
                    )
                : undefined;
              const onPointerLeave =
                preview && !business.previewOnCardHover
                  ? hidePreview
                  : undefined;

              return (
                <Button
                  asChild
                  className={cn("group relative z-10", Icon && "w-9 px-0")}
                  key={button.label}
                  variant={variant}
                >
                  <a
                    href={button.href}
                    onPointerEnter={onPointerEnter}
                    onPointerLeave={onPointerLeave}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {buttonContent(Icon, variant, button.label)}
                  </a>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function Businesses() {
  return (
    <section
      aria-labelledby="businesses-heading"
      className="inset-shadow-0-1-0 inset-shadow-highlight/4 mx-auto max-w-152 bg-nero-300 px-8 py-8 md:rounded-3xl md:px-8"
      data-color="var(--color-orange-100)"
      data-title="Ventures"
    >
      <h2 className="sr-only" id="businesses-heading">
        Ventures
      </h2>
      {businesses.map((business, index) => (
        <BusinessCard
          business={business}
          isFirst={index === 0}
          key={business.id}
        />
      ))}
    </section>
  );
}
