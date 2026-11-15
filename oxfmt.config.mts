import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  // AGENTS.md is rewritten by `next dev`; formatting it only creates churn.
  ignorePatterns: [...ultracite.ignorePatterns, "AGENTS.md"],
  sortTailwindcss: {
    ...ultracite.sortTailwindcss,
    // Read the theme so custom tokens (max-w-page, text-28/10…) sort like built-ins.
    stylesheet: "./src/app/globals.css",
  },
});
