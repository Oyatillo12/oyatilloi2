import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: new Date() },
    { url: `${site.url}/blog`, lastModified: new Date() },
    ...getPosts().map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ];
}
