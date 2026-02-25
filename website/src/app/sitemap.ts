import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/data/blog";

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
    "/blog",
  ];

  const apartmentPages = Array.from({ length: 21 }, (_, i) => `/apartments/${i}`);

  const blogPages = BLOG_POSTS.map((post) => `/blog/${post.slug}`);

  const allPages = [...staticPages, ...apartmentPages, ...blogPages];

  return allPages.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/blog" ? "weekly" : "monthly",
    priority: path === ""
      ? 1
      : path === "/blog"
        ? 0.9
        : path.startsWith("/blog/")
          ? 0.8
          : path.startsWith("/apartments")
            ? 0.7
            : 0.8,
  }));
}
