import { describe, expect, test } from "bun:test";

import { getYear, getYears } from "@/lib/utils";

describe("getYear", () => {
  test("first year of a range", () => {
    expect(getYear("2018 - 2021")).toBe("2018");
  });
  test("year after a prefix", () => {
    expect(getYear("Since 2025")).toBe("2025");
  });
  test("no year", () => {
    expect(getYear("Ongoing")).toBeUndefined();
  });
  test("getYears returns every year", () => {
    expect(getYears("2013 - 2015")).toEqual(["2013", "2015"]);
  });
});
