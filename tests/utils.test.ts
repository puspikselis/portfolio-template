import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { TEXT_CAPTION, TEXT_DISPLAY } from "@/lib/typography";
import {
  cn,
  FONT_SIZE_TOKENS,
  getYear,
  getYears,
  INSET_SHADOW_TOKENS,
  SHADOW_TOKENS,
  TRACKING_TOKENS,
} from "@/lib/utils";

describe("getYear", () => {
  test("first year of a range", () => {
    expect(getYear("2018 - 2021")).toBe("2018");
  });
  test("year after a prefix", () => {
    expect(getYear("Since 2025")).toBe("2025");
  });
  test("no year", () => {
    expect(getYear("Ongoing")).toBeUndefined();
  });
  test("getYears returns every year", () => {
    expect(getYears("2013 - 2015")).toEqual(["2013", "2015"]);
  });
});

describe("densitySrcSet", () => {
  test("maps 1x, 2x and 3x to the matching files", async () => {
    const { densitySrcSet } = await import("@/lib/utils");
    expect(densitySrcSet("/images/wisp/website.avif")).toBe(
      "/images/wisp/website.avif 1x, /images/wisp/website@2x.avif 2x, /images/wisp/website@3x.avif 3x"
    );
  });
});

describe("absoluteUrl", () => {
  test("puts a site path on SITE_URL", async () => {
    const { absoluteUrl, SITE_URL } = await import("@/lib/constants");
    expect(absoluteUrl("/sitemap.xml")).toBe(`${SITE_URL}/sitemap.xml`);
    expect(absoluteUrl("/projects/chip")).toStartWith("https://");
  });
});

describe("tailwind-merge token lists", () => {
  const css = readFileSync(
    fileURLToPath(new URL("../src/app/globals.css", import.meta.url)),
    "utf-8"
  );
  const tokens = (prefix: string) =>
    [...css.matchAll(new RegExp(`--${prefix}-(?<name>[\\w-]+):`, "gu"))].map(
      (match) => match.groups?.name
    );

  test("lists every --text-* token in globals.css", () => {
    const fontSizes = tokens("text");
    expect(FONT_SIZE_TOKENS.toSorted()).toEqual(fontSizes.toSorted());
  });

  test("lists every --inset-shadow-* token in globals.css", () => {
    const shadows = tokens("inset-shadow");
    expect(INSET_SHADOW_TOKENS.toSorted()).toEqual(shadows.toSorted());
  });

  test("lists every --shadow-* token in globals.css", () => {
    expect(SHADOW_TOKENS.toSorted()).toEqual(tokens("shadow").toSorted());
  });

  test("lists every --tracking-* token in globals.css", () => {
    expect(TRACKING_TOKENS.toSorted()).toEqual(tokens("tracking").toSorted());
  });

  test("tracking tokens merge with each other", () => {
    expect(cn("tracking-tight-1", "tracking-tight-3")).toBe("tracking-tight-3");
  });
});

describe("shared type styles survive cn", () => {
  test("display style keeps every class next to not-first variants", () => {
    const merged = cn(
      TEXT_DISPLAY,
      "not-first:text-15/7 not-first:text-nobel-100"
    );
    for (const cls of TEXT_DISPLAY.split(" ")) {
      expect(merged.split(" ")).toContain(cls);
    }
  });

  test("caption style keeps every class next to layout classes", () => {
    const merged = cn(TEXT_CAPTION, "col-start-2 row-start-1 self-end");
    for (const cls of TEXT_CAPTION.split(" ")) {
      expect(merged.split(" ")).toContain(cls);
    }
  });

  test("an override colour replaces the display ink", () => {
    const withoutInk = TEXT_DISPLAY.split(" ").filter((c) => c !== "text-ink");
    expect(cn(TEXT_DISPLAY, "text-nobel-100")).toBe(
      [...withoutInk, "text-nobel-100"].join(" ")
    );
  });
});
