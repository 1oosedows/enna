import { describe, it, expect } from "vitest";
import { getCategoryColorScheme } from "./category-colors";

describe("getCategoryColorScheme", () => {
  it('returns "caution" for dual-use', () => {
    expect(getCategoryColorScheme("dual-use")).toBe("caution");
  });

  it('returns "danger" for offensive-ops', () => {
    expect(getCategoryColorScheme("offensive-ops")).toBe("danger");
  });

  it('returns "danger" for container-security', () => {
    expect(getCategoryColorScheme("container-security")).toBe("danger");
  });

  it('returns "brand" for all other categories', () => {
    expect(getCategoryColorScheme("network-recon")).toBe("brand");
    expect(getCategoryColorScheme("forensics")).toBe("brand");
    expect(getCategoryColorScheme("crypto-tracing")).toBe("brand");
  });
});
