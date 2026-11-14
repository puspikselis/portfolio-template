# Review report (2026-11-14)

Scope: home and the three project pages as served by the local dev server, plus all of `src/` (about 3.7k lines). Numbered findings and fixes are in `ACTION-PLAN.md`; this file records method and limits only.

## What passed
- One `h1` per page, canonical on every page, `lang="en"`, index/follow robots meta.
- Sitemap lists all four pages; `robots.txt` points to it.
- JSON-LD present: `Person`, `WebSite`, and `BreadcrumbList` + `CreativeWork` on project pages.
- All 25 project images have alt text.

## Method
- SEO: fetched the four pages from `localhost:3000` and extracted title, description, canonical, Open Graph, headings, word count, images and JSON-LD types.
- Code: one read-only reviewer over `src/`; each finding was checked against the cited lines before listing. One was rejected.

## Limits
- Not measured: Core Web Vitals, security headers, redirects, broken links and backlinks. These need the deployed site, and the branch is not deployed.
- The skill's `parse_html.py` failed locally, so extraction used a short script instead.
- The Cursor reviewer hit its usage limit (resets 2026-11-15); a Haiku reviewer was used instead.
- Word counts: home 254, Centus 411, Paynt 370, Chip 221.
