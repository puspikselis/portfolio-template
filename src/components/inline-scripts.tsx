interface JsonLdObject {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

// React leaves <script> children unescaped, but that also means a "</script>"
// inside the data could break out of the tag — encoding "<" as < keeps
// the JSON valid and the payload inert.
const LT_RE = /</g;

/**
 * Renders schema.org structured data, one script tag per object (some
 * JSON-LD parsers choke on top-level arrays).
 */
export function JsonLd({ data }: { data: JsonLdObject[] }) {
  return data.map((entry) => (
    <script key={entry["@type"]} type="application/ld+json">
      {JSON.stringify(entry).replace(LT_RE, "\\u003c")}
    </script>
  ));
}

const THEME_INIT =
  "try{var t=localStorage.theme;if(t==='light'||t==='dark')document.documentElement.classList.add(t)}catch(e){}";

/**
 * Applies the saved theme before first paint to avoid a flash. Must be a
 * synchronous inline script: an external file (even next/script
 * beforeInteractive) executes too late and the class is lost to hydration.
 */
export function ThemeInitScript() {
  return <script>{THEME_INIT}</script>;
}
