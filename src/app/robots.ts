import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freaklegends.pl";

const allowPublic = {
  allow: "/",
  disallow: ["/api/", "/login", "/register"],
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", ...allowPublic },
      { userAgent: "GPTBot", ...allowPublic },
      { userAgent: "Google-Extended", ...allowPublic },
      { userAgent: "ClaudeBot", ...allowPublic },
      { userAgent: "PerplexityBot", ...allowPublic },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
