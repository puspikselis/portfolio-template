import "server-only";

import { RollingText } from "@/components/ui/rolling-text";
import { getCommitISO } from "@/lib/commit-date";
import { GITHUB_REPO_URL } from "@/lib/constants";

// Both the attribute and the label are the UTC calendar date of the commit.
const commitDate = new Date(getCommitISO());
const lastUpdated = {
  dateTime: commitDate.toISOString().slice(0, 10),
  label: commitDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
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
          href={GITHUB_REPO_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <RollingText text="on GitHub" />
        </a>
      </p>
    </footer>
  );
}
