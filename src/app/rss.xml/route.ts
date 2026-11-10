import { Feed } from "feed";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { getPosts } from "@/lib/posts";

// Nothing here depends on the request, so the feed is written at build time.
export const dynamic = "force-static";

export async function GET() {
  const t = await getTranslations("Site");

  // One feed for the whole site. A post written in Uzbek appears in it like
  // any other; the feed language describes the site, not each item, because
  // RSS 2.0 has no per-item language and `feed` emits none.
  const feed = new Feed({
    id: site.url,
    link: site.url,
    title: site.name,
    description: t("description"),
    language: site.locale,
    copyright: `© ${new Date().getFullYear()} ${site.name}`,
    feedLinks: { rss2: `${site.url}/rss.xml` },
    author: { name: site.name, link: site.url },
  });

  for (const post of getPosts()) {
    const url = `${site.url}/blog/${post.slug}`;

    feed.addItem({
      id: url,
      link: url,
      title: post.title,
      description: post.description,
      date: new Date(post.date),
      category: post.tags.map((tag) => ({ name: tag })),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
