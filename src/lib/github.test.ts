import { describe, it, expect } from "vitest";
import { formatStars, timeAgo } from "./github";

describe("formatStars", () => {
  it("returns raw number below 1000", () => {
    expect(formatStars(0)).toBe("0");
    expect(formatStars(999)).toBe("999");
  });

  it("formats thousands with one decimal", () => {
    expect(formatStars(1000)).toBe("1.0k");
    expect(formatStars(1500)).toBe("1.5k");
    expect(formatStars(12345)).toBe("12.3k");
    expect(formatStars(53200)).toBe("53.2k");
  });
});

describe("timeAgo", () => {
  it('returns "today" for recent dates', () => {
    const now = new Date().toISOString();
    expect(timeAgo(now)).toBe("today");
  });

  it("returns days for dates within a month", () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString();
    expect(timeAgo(fiveDaysAgo)).toBe("5d ago");
  });

  it("returns months for dates within a year", () => {
    const threeMonthsAgo = new Date(Date.now() - 90 * 86400000).toISOString();
    expect(timeAgo(threeMonthsAgo)).toBe("3mo ago");
  });

  it("returns years for old dates", () => {
    const twoYearsAgo = new Date(Date.now() - 730 * 86400000).toISOString();
    expect(timeAgo(twoYearsAgo)).toBe("2y ago");
  });
});
