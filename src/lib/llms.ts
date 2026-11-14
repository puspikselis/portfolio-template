import { caseStudies } from "@/data/projects";
import {
  GITHUB_PROFILE_URL,
  LINKEDIN_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ROLE,
  SITE_URL,
} from "@/lib/constants";
import { caseStudyPath } from "@/lib/metadata";

/** Plain-text summary for /llms.txt (https://llmstxt.org), built from the site's data. */
export function buildLlmsTxt(): string {
  const studies = caseStudies.map(
    (project) =>
      `- [${project.company}: ${project.title}, ${project.year}](${SITE_URL}${caseStudyPath(project.slug)}): ${project.description}`
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
