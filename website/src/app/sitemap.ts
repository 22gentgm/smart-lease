import type { MetadataRoute } from "next";

const BASE = "https://smartlease-sage.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/explore",
    "/quiz",
    "/map",
    "/reviews",
    "/roommates",
    "/subleases",
    "/lease-help",
    "/privacy",
    "/terms",
  ];

  const apartmentPages = Array.from({ length: 21 }, (_, i) => `/apartments/${i}`);

  return [...staticPages, ...apartmentPages].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/apartments") ? 0.7 : 0.8,
  }));
}
