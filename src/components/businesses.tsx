"use client";

import { useSyncExternalStore } from "react";

import { EntryCard } from "@/components/entry-card";
import { useCursorPreview } from "@/components/features/cursor-preview";
import { AppStoreIcon, PlayStoreIcon } from "@/components/icons/store-icons";
import { Button } from "@/components/ui/button";
import { businesses, type Platform } from "@/data/businesses";
import { DEFAULT_PREVIEW_COLOR, MD_BREAKPOINT_QUERY } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STORE_ICONS = {
  appStore: AppStoreIcon,
  playStore: PlayStoreIcon,
};

const IOS_RE = /iphone|ipad|ipod/;
const ANDROID_RE = /android/;

function subscribeToBreakpoint(onChange: () => void) {
  const mql = window.matchMedia(MD_BREAKPOINT_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

// Below `md`, phones only see their own store's button.
function detectPlatform(): Platform | null {
  if (window.matchMedia(MD_BREAKPOINT_QUERY).matches) {
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

// The server and the hydrating client both render every button; the
// platform filter applies right after hydration.
function noPlatform(): Platform | null {
  return null;
}

function usePlatform() {
  return useSyncExternalStore(
    subscribeToBreakpoint,
    detectPlatform,
    noPlatform
  );
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

  const platform = usePlatform();
  const irrelevant: Platform | null =
    platform && (platform === "ios" ? "android" : "ios");
  const filteredButtons = business.buttons.filter(
    (btn) => btn.platform !== irrelevant
  );

  const [primaryButton] = filteredButtons;

  const handleCardPointerEnter = () => {
    if (!(business.previewOnCardHover && primaryButton?.preview)) {
      return;
    }
    const { image, width, height } = primaryButton.preview;
    showPreview(previewColor, image, width, height);
  };

  const actions =
    filteredButtons.length > 0 ? (
      <div className="ml-auto flex items-center gap-1">
        {filteredButtons.map((button) => {
          const { preview } = button;
          const Icon = button.icon ? STORE_ICONS[button.icon] : null;
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
            preview && !business.previewOnCardHover ? hidePreview : undefined;

          return (
            <Button
              asChild
              className={cn("group relative z-10", Icon && "w-9 px-0")}
              key={button.label}
              variant="pill"
            >
              <a
                href={button.href}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                rel="noopener noreferrer"
                target="_blank"
              >
                {Icon ? (
                  <>
                    <Icon className="size-3.5" />
                    <span className="sr-only">{button.label}</span>
                  </>
                ) : (
                  button.label
                )}
              </a>
            </Button>
          );
        })}
      </div>
    ) : null;

  return (
    <EntryCard
      actions={actions}
      cardHref={business.cardHref}
      className="not-first-of-type:before:my-7 not-first-of-type:before:block not-first-of-type:before:h-px not-first-of-type:before:w-full not-first-of-type:before:bg-nero-400 not-first-of-type:before:content-['']"
      color={previewColor}
      company={business.company}
      image={business.image}
      isFirst={isFirst}
      onPointerEnter={
        business.previewOnCardHover ? handleCardPointerEnter : undefined
      }
      onPointerLeave={business.previewOnCardHover ? hidePreview : undefined}
      tags={business.tags}
      title={business.title}
      year={business.year}
    />
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
