import { businesses } from "@/data/businesses";
import { isCurrentRole, projects } from "@/data/projects";
import {
  GITHUB_PROFILE_URL,
  LINKEDIN_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ROLE,
  SITE_URL,
} from "@/lib/constants";

/** A top-level schema.org node: adds the shared @context. */
export function schemaNode<T extends Record<string, unknown>>(
  type: string,
  props: T
) {
  return { "@context": "https://schema.org", "@type": type, ...props };
}

/** The site owner as a schema.org author reference. */
export const AUTHOR = { "@type": "Person", name: SITE_NAME } as const;

function organization(name: string, url?: string) {
  return url
    ? { "@type": "Organization", name, url }
    : { "@type": "Organization", name };
}

/** schema.org Person for the site owner, derived from the projects and ventures data. */
export function buildPersonJsonLd() {
  const current = projects.filter((project) => isCurrentRole(project.year));
  const past = projects.filter((project) => !isCurrentRole(project.year));

  return schemaNode("Person", {
    alumniOf: past.map((project) => organization(project.company)),
    description: SITE_DESCRIPTION,
    image: `${SITE_URL}/images/KK.avif`,
    jobTitle: SITE_ROLE,
    knowsAbout: [
      "Product Design",
      "UX Design",
      "UI Design",
      "Digital Product Design",
    ],
    name: SITE_NAME,
    nationality: { "@type": "Country", name: "Latvia" },
    sameAs: [LINKEDIN_URL, GITHUB_PROFILE_URL],
    url: SITE_URL,
    worksFor: [
      ...current.map((project) => organization(project.company)),
      ...businesses.map((business) =>
        organization(business.company, business.website)
      ),
    ],
  });
}
