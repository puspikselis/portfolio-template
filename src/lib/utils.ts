import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Must list every --text-*, --inset-shadow-*, --shadow-* and --tracking-* token
// in globals.css (tests/utils.test.ts checks), or tailwind-merge misreads them
// as colours or leaves conflicting classes in place.
export const FONT_SIZE_TOKENS = ["12", "13", "15", "28"];
export const INSET_SHADOW_TOKENS = ["0-1-0"];
export const SHADOW_TOKENS = ["input"];
export const TRACKING_TOKENS = ["tight-1", "tight-2", "tight-3"];

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
      shadow: [{ shadow: SHADOW_TOKENS }],
      tracking: [{ tracking: TRACKING_TOKENS }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const FILE_EXT_RE = /(?<ext>\.[a-z0-9]+)$/iu;

/** srcSet for an image with hand-made @2x/@3x siblings next to the 1x file. */
export const densitySrcSet = (src: string): string => {
  const at = (scale: string) => src.replace(FILE_EXT_RE, `@${scale}$<ext>`);
  return `${src} 1x, ${at("2x")} 2x, ${at("3x")} 3x`;
};

const YEAR_RE = /\d{4}/gu;

/** Every four-digit year in a label such as "2018 - 2021" or "Since 2025". */
export const getYears = (text: string): string[] => text.match(YEAR_RE) ?? [];

/** The first four-digit year in a label, for `<time dateTime>`. */
export const getYear = (text: string): string | undefined => getYears(text)[0];
