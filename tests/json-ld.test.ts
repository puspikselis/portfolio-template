import { describe, expect, test } from "bun:test";

import { businesses } from "@/data/businesses";
import { GITHUB_PROFILE_URL, LINKEDIN_URL } from "@/lib/constants";
import { buildPersonJsonLd } from "@/lib/json-ld";

describe("Person JSON-LD", () => {
  const person = buildPersonJsonLd();
  const names = (orgs: { name: string }[]) => orgs.map((org) => org.name);

  test("sameAs lists only profiles", () => {
    expect(person.sameAs).toEqual([LINKEDIN_URL, GITHUB_PROFILE_URL]);
  });

  test("worksFor: the current employer plus every venture with its URL", () => {
    expect(names(person.worksFor)).toEqual([
      "Ubiquiti",
      ...businesses.map((business) => business.company),
    ]);
    for (const business of businesses) {
      expect(person.worksFor).toContainEqual({
        "@type": "Organization",
        name: business.company,
        url: business.website,
      });
    }
  });

  test("alumniOf: past employers only", () => {
    const alumni = names(person.alumniOf);
    expect(alumni).toContain("Centus");
    expect(alumni).toContain("Draugiem Group");
    expect(alumni).not.toContain("Ubiquiti");
  });

  test("jobTitle names the role", () => {
    expect(person.jobTitle).toBe("Product Designer");
  });
});

describe("schemaNode", () => {
  test("every node carries the schema.org context", async () => {
    const { schemaNode } = await import("@/lib/json-ld");
    expect(schemaNode("WebSite", { name: "x" })).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "x",
    });
  });
});

describe("Person nationality", () => {
  test("is a typed Country, not a plain string", () => {
    expect(buildPersonJsonLd().nationality).toEqual({
      "@type": "Country",
      name: "Latvia",
    });
  });
});
