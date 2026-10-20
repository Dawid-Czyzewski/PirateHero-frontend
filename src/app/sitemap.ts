import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freaklegends.pl";
const homeModified = new Date("2026-10-18");
const legalModified = new Date("2026-10-19");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
    lastModified?: Date;
  }[] = [
    {
      path: "",
      priority: 1,
      changeFrequency: "weekly",
      lastModified: homeModified,
    },
    {
      path: "/o-grze",
      priority: 0.9,
      changeFrequency: "monthly",
    },
    {
      path: "/contact",
      priority: 0.6,
      changeFrequency: "monthly",
      lastModified: legalModified,
    },
    {
      path: "/privacy",
      priority: 0.5,
      changeFrequency: "yearly",
      lastModified: legalModified,
    },
    {
      path: "/terms",
      priority: 0.5,
      changeFrequency: "yearly",
      lastModified: legalModified,
    },
    {
      path: "/cookies",
      priority: 0.4,
      changeFrequency: "yearly",
      lastModified: legalModified,
    },
  ];

  return routes.map(({ path, priority, changeFrequency, lastModified }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency,
    priority,
    ...(lastModified ? { lastModified } : {}),
  }));
}
