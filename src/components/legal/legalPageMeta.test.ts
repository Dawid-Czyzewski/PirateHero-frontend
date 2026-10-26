import { describe, expect, it } from "vitest";
import {
  PRIVACY_PAGE,
  TERMS_PAGE,
  COOKIES_PAGE,
  buildLegalJsonLd,
  buildLegalMetadata,
} from "@/components/legal/legalPageMeta";

describe("buildLegalMetadata", () => {
  it("builds indexable metadata with canonical and social tags", () => {
    const meta = buildLegalMetadata(PRIVACY_PAGE);

    expect(meta.title).toBe("Polityka prywatności");
    expect(meta.description).toContain("RODO");
    expect(meta.alternates).toMatchObject({
      canonical: "/privacy",
      languages: {
        "pl-PL": "/privacy",
        "x-default": "/privacy",
      },
    });
    expect(meta.robots).toMatchObject({ index: true, follow: true });
    expect(meta.openGraph).toMatchObject({
      url: "/privacy",
      siteName: "Freak Legends",
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Polityka prywatności | Freak Legends",
    });
  });
});

describe("buildLegalJsonLd", () => {
  it("builds WebPage + BreadcrumbList graph for legal pages", () => {
    const jsonLd = buildLegalJsonLd(TERMS_PAGE);
    const graph = jsonLd["@graph"] as Array<Record<string, unknown>>;

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(graph).toHaveLength(2);
    expect(graph[0]).toMatchObject({
      "@type": "WebPage",
      about: { "@type": "TermsOfService" },
    });
    expect(graph[1]).toMatchObject({
      "@type": "BreadcrumbList",
    });
  });

  it("keeps cookies page typed as DigitalDocument", () => {
    const jsonLd = buildLegalJsonLd(COOKIES_PAGE);
    const page = (jsonLd["@graph"] as Array<Record<string, unknown>>)[0];
    const about = page.about as Record<string, unknown>;

    expect(about["@type"]).toBe("DigitalDocument");
  });
});
