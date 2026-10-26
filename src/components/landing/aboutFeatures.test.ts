import { describe, expect, it } from "vitest";
import { ABOUT_FEATURES } from "@/components/landing/aboutFeatures";

describe("ABOUT_FEATURES", () => {
  it("has four unique feature cards with images and copy", () => {
    expect(ABOUT_FEATURES).toHaveLength(4);

    const ids = ABOUT_FEATURES.map((feature) => feature.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const feature of ABOUT_FEATURES) {
      expect(feature.number).toMatch(/^\d{2}$/);
      expect(feature.title.length).toBeGreaterThan(0);
      expect(feature.text.length).toBeGreaterThan(0);
      expect(feature.image).toMatch(/^\/images\/about-card-.+\.jpg$/);
      expect(feature.imageAlt.length).toBeGreaterThan(0);
    }
  });
});
