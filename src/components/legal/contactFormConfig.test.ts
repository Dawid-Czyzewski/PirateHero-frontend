import { describe, expect, it } from "vitest";
import { CONTACT_TOPICS } from "@/components/legal/contactFormConfig";

describe("CONTACT_TOPICS", () => {
  it("lists unique topic values used by the contact form", () => {
    expect(CONTACT_TOPICS.length).toBeGreaterThanOrEqual(4);

    const values = CONTACT_TOPICS.map((topic) => topic.value);
    expect(new Set(values).size).toBe(values.length);

    for (const topic of CONTACT_TOPICS) {
      expect(topic.label.trim().length).toBeGreaterThan(0);
    }
  });
});
