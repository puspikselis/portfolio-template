import { execSync } from "node:child_process";

/**
 * ISO timestamp of the last git commit, read once at build time. Shared by
 * the footer's "Updated" label and the sitemap so both report the same date.
 */
export function getCommitISO(): string {
  try {
    const iso = execSync("git log -1 --format=%cI", {
      encoding: "utf8",
    }).trim();
    if (iso) {
      return iso;
    }
  } catch {
    // git not available (CI without history, edge runtime); fall through
  }
  return new Date().toISOString();
}
