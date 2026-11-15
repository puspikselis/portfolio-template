"use client";

import { useSyncExternalStore } from "react";

import { EntryAction } from "@/components/entry-action";
import { EntryCard } from "@/components/entry-card";
import { AppStoreIcon, PlayStoreIcon } from "@/components/icons/store-icons";
import { businesses, type Platform } from "@/data/businesses";
import { DEFAULT_PREVIEW_COLOR, MD_BREAKPOINT_QUERY } from "@/lib/constants";

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
  const previewColor = business.color || DEFAULT_PREVIEW_COLOR;

  const platform = usePlatform();
  const irrelevant: Platform | null =
    platform && (platform === "ios" ? "android" : "ios");
  const buttons = business.buttons.filter(
    (btn) => !btn.hidden && btn.platform !== irrelevant
  );
  const actions = buttons.map((button) => {
    const Icon = button.icon ? STORE_ICONS[button.icon] : null;
    return (
      <EntryAction
        company={business.company}
        external
        href={button.href ?? business.website}
        icon={Icon ? <Icon className="size-3.5" /> : undefined}
        key={button.label}
        label={button.label}
      />
    );
  });

  return (
    <EntryCard
      actions={actions.length > 0 ? actions : null}
      cardHref={business.website}
      className="not-first-of-type:before:my-7 not-first-of-type:before:block not-first-of-type:before:h-px not-first-of-type:before:w-full not-first-of-type:before:bg-nero-400 not-first-of-type:before:content-['']"
      color={previewColor}
      company={business.company}
      external
      image={business.image}
      isFirst={isFirst}
      preview={buttons.find((button) => button.preview)?.preview}
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
