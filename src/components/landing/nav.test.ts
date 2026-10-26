import { describe, expect, it } from "vitest";
import { NAV, isCurrent } from "@/components/landing/nav";

describe("NAV", () => {
  it("exposes main public routes", () => {
    expect(NAV.map((item) => item.href)).toEqual(["/", "/o-grze", "/contact"]);
  });
});

describe("isCurrent", () => {
  it("matches home only on exact path", () => {
    expect(isCurrent("/", "/")).toBe(true);
    expect(isCurrent("/o-grze", "/")).toBe(false);
  });

  it("matches nested paths for non-home routes", () => {
    expect(isCurrent("/contact", "/contact")).toBe(true);
    expect(isCurrent("/contact/faq", "/contact")).toBe(true);
    expect(isCurrent("/o-grze", "/contact")).toBe(false);
  });
});
