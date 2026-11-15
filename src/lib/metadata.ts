import type { Metadata } from "next";

import { getCaseStudy } from "@/data/projects";
import {
  absoluteUrl,
  OG_IMAGE_SIZE,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/constants";

// A page that sets its own `openGraph`/`twitter` replaces the root ones, which
// drops the root file-based social card, so the card is listed here explicitly.
const socialCard = (url: string) => [
  { alt: SITE_TITLE, ...OG_IMAGE_SIZE, type: "image/png", url },
];

/** Open Graph fields every page shares; pages add their own title, description and URL. */
const OPEN_GRAPH_BASE = {
  images: socialCard("/opengraph-image"),
  locale: "en_US",
  siteName: SITE_TITLE,
  type: "website",
} as const;

const TWITTER_BASE = {
  card: "summary_large_image",
  images: socialCard("/twitter-image"),
} as const;

interface SocialInput {
  description: string;
  title: string;
  /** og:url; a path is resolved against metadataBase. */
  url: string;
}

/** Open Graph and Twitter tags, the one place social fields are built. */
export const socialMetadata = ({
  description,
  title,
  url,
}: SocialInput): Pick<Metadata, "openGraph" | "twitter"> => ({
  openGraph: { ...OPEN_GRAPH_BASE, description, title, url },
  twitter: { ...TWITTER_BASE, description, title },
});

interface PageMetadataInput {
  description: string;
  /** Site-relative path, e.g. "/projects/centus"; resolved against metadataBase. */
  path: string;
  title: string;
}

/** Title, description, canonical and social tags for one page, all from the same values. */
export const pageMetadata = ({
  description,
  path,
  title,
}: PageMetadataInput): Metadata => ({
  alternates: { canonical: path },
  description,
  title,
  ...socialMetadata({ description, title, url: path }),
});

export const caseStudyPath = (slug: string): string => `/projects/${slug}`;

/** Absolute URL of a case study page. */
export const caseStudyUrl = (slug: string): string =>
  absoluteUrl(caseStudyPath(slug));

const caseStudyTitle = (slug: string): string => {
  const { company, title } = getCaseStudy(slug);
  return `${company} - ${title} | ${SITE_NAME}`;
};

/** Metadata for a /projects/[slug] page, from the projects data. */
export const caseStudyMetadata = (slug: string): Metadata =>
  pageMetadata({
    description: getCaseStudy(slug).description,
    path: caseStudyPath(slug),
    title: caseStudyTitle(slug),
  });
