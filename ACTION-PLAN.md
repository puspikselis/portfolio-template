# Action plan (review of 2026-11-14)

Pick by number. Nothing here is fixed yet. Evidence: served HTML from the local dev server and the cited source lines.

## SEO and content

| # | Finding | Evidence | Fix | Size |
|---|---------|----------|-----|------|
| 1 | Project pages share the home page's social tags | `/projects/*` serve `og:title` "Kristaps Krūze — Designer", `og:url` = home, home description | Per-page `openGraph` + `twitter` built from the page's own title, description and URL | 15 min |
| 2 | `robots.txt` blocks every image | `Disallow: /images/` and `/originals/`; the `Person` schema image is `/images/KK.avif` | Remove the `/images/` rule (keep `/originals/`, `/audio/`) | 2 min |
| 3 | Title and schema say "Designer", not "Product Designer" | `<title>Kristaps Krūze — Designer</title>`, `jobTitle: "Designer"` | "Kristaps Krūze — Product Designer" in title, OG and `jobTitle` | 5 min |
| 4 | Headings carry roles, not company names | Home `h3`s: "Lead Designer" x4, "Product Designer" x4, "Co-Founder" x3; companies only in tag chips | Put the company in the heading ("Lead Designer, Centus") or swap heading and tag | 15 min |
| 5 | Project image descriptions are written but never shown | 25 `description` fields in `src/app/projects/*/data.ts`; `project-page.tsx` never reads them. Chip page has 221 words | Render them as `<figcaption>` | 15 min |
| 6 | Meta descriptions too long | Centus 259 chars, Chip 195, Paynt 164 (shown limit is about 155) | Rewrite to 140–155 chars | 10 min |
| 7 | `Person` schema is thin and partly wrong | `sameAs` lists heywisp.com and datreal.com (companies, not profiles); only Ubiquiti in `worksFor`; no founder or past-employer data | Move the companies to `founder`/`worksFor`, add `alumniOf`, keep `sameAs` for LinkedIn and GitHub | 15 min |
| 8 | Sitemap is hand-written | `src/app/sitemap.ts` hard-codes the base URL and three project URLs; home `lastModified` is the build time | Build it from `SITE_URL` and the projects data | 10 min |
| 9 | `keywords` meta tag | `layout.tsx:38`; Google ignores it | Delete | 1 min |
| 10 | No `llms.txt` | `/llms.txt` returns 404 | Add a short one (name, role, links to the three case studies) | 10 min |

## Code

| # | Finding | Where | Fix |
|---|---------|-------|-----|
| 11 | Hydration mismatch on phones: server renders both store buttons, client hides one | `businesses.tsx:24,64` | Detect the platform in an effect after mount |
| 12 | Logo alt text names the role ("Lead Designer logo") | `projects.tsx:67`, `businesses.tsx:107` | Use the company name |
| 13 | Spotify widget throws when a podcast episode plays (no `artists`) | `api/spotify/route.ts:24` | Handle episodes |
| 14 | Keyboard focus is lost after "Show earlier roles" (button unmounts) | `projects.tsx:149` | Move focus to the first revealed role |
| 15 | Testimonial drops a line break when an earlier line equals the last one | `ui/testimonial.tsx:46` | Compare indexes |
| 16 | Project card and business card are the same markup twice (year, avatar, title, tags) | `projects.tsx:47`, `businesses.tsx:82` | One shared entry card |
| 17 | Year regex declared three times | `projects.tsx:13`, `businesses.tsx:22`, `project-page.tsx:11` | One helper in `lib/utils` |
| 18 | Disabled `<button>` used as a label ("Under NDA", "Archive") | `projects.tsx:82` | Plain `<span>` |
| 19 | Screen readers announce the section label on every scroll change | `floating-thingy.tsx:261` | Remove `aria-live` |
| 20 | Two adjacent links to `/` in the header | `header.tsx:33`, `spotify-status.tsx:66` | Keep one |
| 21 | Dead code: section description path | `floating-thingy.tsx:137,278` | Delete |
| 22 | Dead code: `link` button variant branch in businesses | `businesses.tsx:51`, `businesses.ts:17` | Delete |
| 23 | Dead code: `className` prop, `buttonVariants` export, `scroll-behavior: auto` | `animated-text.tsx:50`, `button.tsx:52`, `globals.css:145` | Delete |
| 24 | Needless wrappers | `testimonial.tsx:28`, `toast.tsx:72`, `floating-thingy.tsx:259` | Merge into parent |
| 25 | Contact email and phone repeated inline | `contact-dialog.tsx:68,86,136,143` | Constants |
| 26 | Easing curve defined twice | `rolling-text.tsx:12`, `animated-text.tsx:14` | One CSS variable |
| 27 | `768` breakpoint hard-coded in JS | `businesses.tsx:25` | `matchMedia` with the Tailwind value |
| 28 | Footer date: `dateTime` is UTC, label is server-local | `footer.tsx:22` | Format both in UTC |

Rejected after checking: "space collapses in rolling text" (the source already uses a non-breaking space).
