import type { MetadataRoute } from "next";

import { caseStudies } from "@/data/projects";
import { getCommitISO } from "@/lib/commit-date";
import { SITE_URL } from "@/lib/constants";
import { caseStudyUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "monthly",
      lastModified: new Date(getCommitISO()),
      priority: 1,
      url: SITE_URL,
    },
    ...caseStudies.map((project) => ({
      changeFrequency: "yearly" as const,
      lastModified: new Date(project.lastModified),
      priority: 0.9,
      url: caseStudyUrl(project.slug),
    })),
  ];
}
