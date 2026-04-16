import { describe, it, expect } from "vitest";
import { LAUNCH_TOOL_COUNT, PAGE_SIZE } from "./constants";

describe("constants", () => {
  it("LAUNCH_TOOL_COUNT is a positive number", () => {
    expect(LAUNCH_TOOL_COUNT).toBeGreaterThan(0);
    expect(LAUNCH_TOOL_COUNT).toBe(251);
  });

  it("PAGE_SIZE is a reasonable pagination size", () => {
    expect(PAGE_SIZE).toBeGreaterThan(0);
    expect(PAGE_SIZE).toBeLessThanOrEqual(100);
  });
});
