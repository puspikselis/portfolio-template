import { describe, expect, test } from "bun:test";

import robots from "@/app/robots";
import { SITE_URL } from "@/lib/constants";

describe("robots", () => {
  test("points at the sitemap on SITE_URL and keeps images crawlable", () => {
    const result = robots();
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    expect(JSON.stringify(result.rules)).not.toContain("/images/");
  });
});
