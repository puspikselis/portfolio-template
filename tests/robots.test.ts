import { describe, expect, test } from "bun:test";

import robots from "@/app/robots";
import { absoluteUrl } from "@/lib/constants";

describe("robots", () => {
  test("points at the sitemap on SITE_URL and keeps images crawlable", () => {
    const result = robots();
    expect(result.sitemap).toBe(absoluteUrl("/sitemap.xml"));
    expect(JSON.stringify(result.rules)).not.toContain("/images/");
  });
});
