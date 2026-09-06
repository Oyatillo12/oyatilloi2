import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) => {
    const posts = getPosts(locale);

    return [
      { url: `${site.url}/${locale}`, lastModified: new Date() },
      { url: `${site.url}/${locale}/blog`, lastModified: new Date() },
      ...posts.map((post) => ({
        url: `${site.url}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
      })),
    ];
  });
}
