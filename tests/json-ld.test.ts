import { describe, expect, test } from "bun:test";

import { businesses } from "@/data/businesses";
import { buildPersonJsonLd } from "@/lib/json-ld";

describe("Person JSON-LD", () => {
  const person = buildPersonJsonLd();
  const names = (orgs: { name: string }[]) => orgs.map((org) => org.name);

  test("sameAs lists only profiles", () => {
    expect(person.sameAs).toEqual([
      "https://www.linkedin.com/in/kristapskruze/",
      "https://github.com/puspikselis",
    ]);
  });

  test("worksFor: the current employer plus every venture with its URL", () => {
    expect(names(person.worksFor)).toEqual([
      "Ubiquiti",
      ...businesses.map((business) => business.company),
    ]);
    expect(person.worksFor).toContainEqual({
      "@type": "Organization",
      name: "Wisp",
      url: "https://heywisp.com",
    });
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
