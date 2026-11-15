import { describe, expect, test } from "bun:test";

import { toLines } from "@/components/ui/testimonial";

describe("toLines", () => {
  test("a line equal to the last one still gets its break", () => {
    expect(
      toLines("Thanks\nGreat work\nThanks").map((l) => l.breakAfter)
    ).toEqual([true, true, false]);
  });

  test("keys are unique for repeated lines", () => {
    const keys = toLines("Hi\nHi").map((l) => l.key);
    expect(new Set(keys).size).toBe(2);
  });

  test("single line has no break", () => {
    expect(toLines("One")).toEqual([
      { breakAfter: false, key: "0-One", text: "One" },
    ]);
  });
});
