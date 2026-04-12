import { describe, it, expect } from "vitest";
import { formatPrice, formatCount, formatDuration, formatKey } from "../format";

describe("formatPrice", () => {
  it("returns 'Free' for 0", () => {
    expect(formatPrice(0)).toBe("Free");
  });

  it("formats a decimal price", () => {
    expect(formatPrice(29.99)).toBe("$29.99");
  });

  it("formats a string price", () => {
    expect(formatPrice("49.99")).toBe("$49.99");
  });
});

describe("formatCount", () => {
  it("formats thousands with K suffix", () => {
    expect(formatCount(1250)).toBe("1.3K");
  });

  it("formats millions with M suffix", () => {
    expect(formatCount(1_200_000)).toBe("1.2M");
  });

  it("returns as-is for small numbers", () => {
    expect(formatCount(999)).toBe("999");
  });
});

describe("formatDuration", () => {
  it("formats minutes and seconds", () => {
    expect(formatDuration(185)).toBe("3:05");
  });

  it("formats with hours", () => {
    expect(formatDuration(3665)).toBe("1:01:05");
  });
});

describe("formatKey", () => {
  it("formats C# Major", () => {
    expect(formatKey("c_sharp_major")).toBe("C#Major");
  });
});
