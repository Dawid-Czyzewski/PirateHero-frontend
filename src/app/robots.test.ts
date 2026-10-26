import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots", () => {
  it("disallows auth and api routes while keeping public crawlable", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

    expect(result.host).toBe("https://freaklegends.pl");
    expect(result.sitemap).toBe("https://freaklegends.pl/sitemap.xml");

    for (const rule of rules) {
      expect(rule.allow).toBe("/");
      expect(rule.disallow).toEqual(["/api/", "/login", "/register"]);
    }
  });
});
