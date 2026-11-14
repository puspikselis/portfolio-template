import { describe, expect, test } from "bun:test";

import sitemap from "@/app/sitemap";
import { caseStudies } from "@/data/projects";
import { getCommitISO } from "@/lib/commit-date";
import { SITE_URL } from "@/lib/constants";

describe("sitemap", () => {
  const entries = sitemap();

  test("home plus one entry per case study, all on SITE_URL", () => {
    expect(entries.map((entry) => entry.url)).toEqual([
      SITE_URL,
      ...caseStudies.map((project) => `${SITE_URL}/projects/${project.slug}`),
    ]);
  });

  test("home lastModified is the commit date, not the build time", () => {
    expect(new Date(entries[0].lastModified ?? "").toISOString()).toBe(
      new Date(getCommitISO()).toISOString()
    );
  });

  test("case study dates come from the data", () => {
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));
    expect(
      new Date(byUrl.get(`${SITE_URL}/projects/centus`)?.lastModified ?? "")
        .toISOString()
        .slice(0, 10)
    ).toBe("2025-01-15");
  });
});
