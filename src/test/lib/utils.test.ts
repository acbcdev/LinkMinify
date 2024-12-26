import { describe, it, expect } from "vitest";
import { IsValidUrl, randomNum } from "@/lib/utils";

describe("IsValidUrl", () => {
  // Valid URLs
  it("should return true for valid HTTPS URL", () => {
    expect(IsValidUrl("https://www.example.com")).toBe(true);
  });

  it("should return true for valid HTTP URL", () => {
    expect(IsValidUrl("http://example.com")).toBe(true);
  });

  it("should return true for URL without protocol", () => {
    expect(IsValidUrl("example.com")).toBe(true);
  });

  it("should return true for URL with path", () => {
    expect(IsValidUrl("https://example.com/path/to/resource")).toBe(true);
  });

  it("should return true for URL with query parameters", () => {
    expect(IsValidUrl("https://example.com/search?q=test&page=1")).toBe(true);
  });

  // Invalid URLs
  it("should return false for empty string", () => {
    expect(IsValidUrl("")).toBe(false);
  });

  it("should return false for invalid protocol", () => {
    expect(IsValidUrl("ftp://example.com")).toBe(false);
  });

  it("should return false for missing domain", () => {
    expect(IsValidUrl("https://")).toBe(false);
  });

  it("should return false for invalid characters", () => {
    expect(IsValidUrl("https://example.com/path with spaces")).toBe(false);
  });

  it("should return false for plain text", () => {
    expect(IsValidUrl("not a url")).toBe(false);
  });
});
describe("randomNum", () => {
  it("should return a number between 5 and 8 inclusive", () => {
    for (let i = 0; i < 100; i++) {
      const result = randomNum();
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(8);
    }
  });

  it("should only return integers", () => {
    for (let i = 0; i < 50; i++) {
      const result = randomNum();
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it("should be able to generate all possible values", () => {
    const results = new Set();
    for (let i = 0; i < 1000; i++) {
      results.add(randomNum());
    }
    expect(results.size).toBe(4); // Should generate 5,6,7,8
    expect(Array.from(results).sort()).toEqual([5, 6, 7, 8]);
  });

  it("should provide relatively even distribution", () => {
    const counts = { 5: 0, 6: 0, 7: 0, 8: 0 };
    const iterations = 10000;

    for (let i = 0; i < iterations; i++) {
      counts[randomNum()]++;
    }

    // Each number should appear roughly 25% of the time (±5%)
    Object.values(counts).forEach((count) => {
      const percentage = count / iterations;
      expect(percentage).toBeGreaterThan(0.2);
      expect(percentage).toBeLessThan(0.3);
    });
  });
});
