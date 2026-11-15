import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      // Full-size source images and audio files stay out of search results.
      disallow: ["/originals/", "/audio/"],
      userAgent: "*",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
