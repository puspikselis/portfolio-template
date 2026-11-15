"use client";

import { EntryAction } from "@/components/entry-action";
import { EntryCard } from "@/components/entry-card";
import { AppStoreIcon, PlayStoreIcon } from "@/components/icons/store-icons";
import { Section } from "@/components/ui/section";
import { businesses } from "@/data/businesses";
import type { Platform } from "@/data/businesses";
import { MD_BREAKPOINT_QUERY } from "@/lib/constants";
import { useMediaQuery } from "@/lib/use-media-query";

const STORE_ICONS = {
  appStore: AppStoreIcon,
  playStore: PlayStoreIcon,
};

const IOS_RE = /iphone|ipad|ipod/u;
const ANDROID_RE = /android/u;

const detectPlatform = (): Platform | null => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (IOS_RE.test(ua)) {
    return "ios";
  }
  if (ANDROID_RE.test(ua)) {
    return "android";
  }
  return null;
};

// Below `md`, phones only see their own store's button. The server and the
// hydrating client (isDesktop null) render every button; the filter applies
// right after hydration.
const usePlatform = (): Platform | null => {
  const isDesktop = useMediaQuery(MD_BREAKPOINT_QUERY);
  return isDesktop === false ? detectPlatform() : null;
};

const BusinessCard = ({
  business,
  isFirst,
}: {
  business: (typeof businesses)[number];
  isFirst?: boolean;
}) => {
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
      color={business.color}
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
};

export const Businesses = () => (
  <Section
    className="mx-auto max-w-152"
    headingId="businesses-heading"
    title="Ventures"
    variant="panel"
  >
    {businesses.map((business, index) => (
      <BusinessCard
        business={business}
        isFirst={index === 0}
        key={business.id}
      />
    ))}
  </Section>
);
