interface JsonLdObject {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

// React leaves <script> children unescaped, but that also means a "</script>"
// inside the data could break out of the tag — encoding "<" as < keeps
// the JSON valid and the payload inert.
const LT_RE = /</gu;

/**
 * Renders schema.org structured data, one script tag per object (some
 * JSON-LD parsers choke on top-level arrays).
 */
export const JsonLd = ({ data }: { data: JsonLdObject[] }) =>
  data.map((entry) => (
    <script key={entry["@type"]} type="application/ld+json">
      {JSON.stringify(entry).replaceAll(LT_RE, "\\u003c")}
    </script>
  ));
