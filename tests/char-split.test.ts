import { describe, expect, test } from "bun:test";

import { displayChar, toCharItems } from "@/components/ui/char-split";

describe("char split", () => {
  test("spaces become non-breaking so they keep width", () => {
    expect(displayChar(" ")).toBe(" ");
    expect(displayChar("a")).toBe("a");
  });

  test("keys stay unique for repeated letters", () => {
    const ids = toCharItems("aa a").map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
