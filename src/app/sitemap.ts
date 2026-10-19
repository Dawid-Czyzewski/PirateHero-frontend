import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freaklegends.pl";
const defaultModified = new Date("2026-10-18");
const legalModified = new Date("2026-10-19");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/o-grze", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/aktualnosci", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/rankingi", priority: 0.7, changeFrequency: "weekly" as const },
    {
      path: "/contact",
      priority: 0.6,
      changeFrequency: "monthly" as const,
      lastModified: legalModified,
    },
    {
      path: "/privacy",
      priority: 0.5,
      changeFrequency: "yearly" as const,
      lastModified: legalModified,
    },
    {
      path: "/terms",
      priority: 0.5,
      changeFrequency: "yearly" as const,
      lastModified: legalModified,
    },
    {
      path: "/cookies",
      priority: 0.4,
      changeFrequency: "yearly" as const,
      lastModified: legalModified,
    },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: route.lastModified ?? defaultModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
