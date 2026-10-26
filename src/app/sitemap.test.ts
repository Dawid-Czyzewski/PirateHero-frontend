import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("lists public pages and excludes auth routes", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://freaklegends.pl");
    expect(urls).toContain("https://freaklegends.pl/o-grze");
    expect(urls).toContain("https://freaklegends.pl/contact");
    expect(urls).toContain("https://freaklegends.pl/privacy");
    expect(urls).toContain("https://freaklegends.pl/terms");
    expect(urls).toContain("https://freaklegends.pl/cookies");
    expect(urls.some((url) => url.includes("/login"))).toBe(false);
    expect(urls.some((url) => url.includes("/register"))).toBe(false);
  });

  it("gives homepage the highest priority", () => {
    const home = sitemap().find((entry) => entry.url === "https://freaklegends.pl");
    expect(home?.priority).toBe(1);
  });
});
