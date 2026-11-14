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

function organization(name: string, url?: string) {
  return url
    ? { "@type": "Organization", name, url }
    : { "@type": "Organization", name };
}

/** schema.org Person for the site owner, derived from the projects and ventures data. */
export function buildPersonJsonLd() {
  const current = projects.filter((project) => isCurrentRole(project.year));
  const past = projects.filter((project) => !isCurrentRole(project.year));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
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
    nationality: "Latvian",
    sameAs: [LINKEDIN_URL, GITHUB_PROFILE_URL],
    url: SITE_URL,
    worksFor: [
      ...current.map((project) => organization(project.company)),
      ...businesses.map((business) =>
        organization(business.company, business.cardHref)
      ),
    ],
  };
}
