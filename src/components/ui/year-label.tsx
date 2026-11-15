import { getYear } from "@/lib/utils";

interface YearLabelProps {
  /** Marks the line as the floating label's alignment target. */
  isAlignTarget?: boolean;
  /** A label such as "2018 - 2021" or "Since 2025". */
  year: string;
}

/** The small year line above an entry or case study title. */
export const YearLabel = ({ isAlignTarget, year }: YearLabelProps) => (
  <p
    className="text-13/4 font-medium text-dim-gray-100"
    data-align-target={isAlignTarget ? "true" : undefined}
  >
    <time dateTime={getYear(year)}>{year}</time>
  </p>
);
