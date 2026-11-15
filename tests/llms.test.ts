import { describe, expect, test } from "bun:test";

import { caseStudies } from "@/data/projects";
import {
  GITHUB_PROFILE_URL,
  LINKEDIN_URL,
  SITE_NAME,
  SITE_ROLE,
} from "@/lib/constants";
import { buildLlmsTxt } from "@/lib/llms";
import { caseStudyUrl } from "@/lib/metadata";

describe("llms.txt", () => {
  const text = buildLlmsTxt();

  test("starts with the name as H1 and states the role", () => {
    expect(text.startsWith(`# ${SITE_NAME}\n`)).toBe(true);
    expect(text).toContain(SITE_ROLE);
  });

  test("links every case study and both profiles", () => {
    expect(caseStudies.length).toBe(3);
    for (const { slug } of caseStudies) {
      expect(text).toContain(caseStudyUrl(slug));
    }
    expect(text).toContain(LINKEDIN_URL);
    expect(text).toContain(GITHUB_PROFILE_URL);
  });
});
