import { caseStudies } from "@/data/projects";
import {
  GITHUB_PROFILE_URL,
  LINKEDIN_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ROLE,
} from "@/lib/constants";
import { caseStudyUrl } from "@/lib/metadata";

/** Plain-text summary for /llms.txt (https://llmstxt.org), built from the site's data. */
export function buildLlmsTxt(): string {
  const studies = caseStudies.map(
    (project) =>
      `- [${project.company}: ${project.title}, ${project.year}](${caseStudyUrl(project.slug)}): ${project.description}`
  );

  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_ROLE}. ${SITE_DESCRIPTION}`,
    "",
    "## Case studies",
    "",
    ...studies,
    "",
    "## Profiles",
    "",
    `- [LinkedIn](${LINKEDIN_URL})`,
    `- [GitHub](${GITHUB_PROFILE_URL})`,
    "",
  ].join("\n");
}
