import "server-only";

import { execSync } from "node:child_process";
import { RollingText } from "@/components/ui/rolling-text";

const GITHUB_URL = "https://github.com/puspikselis/portfolio";

function getCommitISO(): string {
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

const commitISO = getCommitISO();
const lastUpdated = {
  dateTime: commitISO.slice(0, 10),
  label: new Date(commitISO).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }),
};

export function Footer() {
  return (
    <footer className="flex items-center justify-between px-8 pt-5 pb-30 font-medium text-12 text-dim-gray-100 md:px-12 md:pt-8 md:pb-12">
      <p>
        Updated <time dateTime={lastUpdated.dateTime}>{lastUpdated.label}</time>
      </p>
      <p>
        Built with AI — grab the code{" "}
        <a
          aria-label="View source code on GitHub"
          className="group text-nobel-100 transition-colors hover:text-ink"
          href={GITHUB_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <RollingText text="on GitHub" />
        </a>
      </p>
    </footer>
  );
}
