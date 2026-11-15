import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Must list every --text-* and --inset-shadow-* token in globals.css
// (tests/utils.test.ts checks), or tailwind-merge misreads them as colours.
export const FONT_SIZE_TOKENS = ["12", "13", "15", "28"];
export const INSET_SHADOW_TOKENS = ["0-1-0"];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: FONT_SIZE_TOKENS,
        },
      ],
      "inset-shadow": [
        {
          "inset-shadow": INSET_SHADOW_TOKENS,
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FILE_EXT_RE = /(\.[a-z0-9]+)$/i;

/** srcSet for an image with hand-made @2x/@3x siblings next to the 1x file. */
export function densitySrcSet(src: string): string {
  const at = (scale: string) => src.replace(FILE_EXT_RE, `@${scale}$1`);
  return `${src} 1x, ${at("2x")} 2x, ${at("3x")} 3x`;
}

const YEAR_RE = /\d{4}/g;

/** Every four-digit year in a label such as "2018 - 2021" or "Since 2025". */
export function getYears(text: string): string[] {
  return text.match(YEAR_RE) ?? [];
}

/** The first four-digit year in a label, for `<time dateTime>`. */
export function getYear(text: string): string | undefined {
  return getYears(text)[0];
}
