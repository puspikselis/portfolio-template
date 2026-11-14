import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["12", "13", "15", "28"],
        },
      ],
      "inset-shadow": [
        {
          "inset-shadow": ["0-1-0"],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
