import { describe, expect, test } from "bun:test";

import { caseStudies } from "@/data/projects";
import { SITE_TITLE } from "@/lib/constants";
import { caseStudyMetadata, pageMetadata } from "@/lib/metadata";

describe("pageMetadata", () => {
  const meta = pageMetadata({
    description: "A description.",
    path: "/projects/x",
    title: "X | Site",
  });

  test("social tags use the page's own title, description and URL", () => {
    expect(meta.openGraph).toMatchObject({
      description: "A description.",
      title: "X | Site",
      type: "website",
      url: "/projects/x",
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      description: "A description.",
      title: "X | Site",
    });
    expect(meta.alternates?.canonical).toBe("/projects/x");
  });

  test("keeps the shared site name", () => {
    expect(meta.openGraph?.siteName).toBe(SITE_TITLE);
  });
});

describe("case study metadata", () => {
  test("every case study gets its own og:url and title", () => {
    for (const { company, slug } of caseStudies) {
      const meta = caseStudyMetadata(slug);
      expect(meta.openGraph?.url).toBe(`/projects/${slug}`);
      expect(String(meta.openGraph?.title)).toStartWith(company);
      expect(meta.openGraph?.title).not.toBe(SITE_TITLE);
    }
  });

  test("descriptions are 140-155 characters and have no em dash", () => {
    for (const { description } of caseStudies) {
      expect(description.length).toBeGreaterThanOrEqual(140);
      expect(description.length).toBeLessThanOrEqual(155);
      expect(description).not.toContain("—");
    }
  });

  test("site title names the role", () => {
    expect(SITE_TITLE).toBe("Kristaps Krūze — Product Designer");
  });
});
