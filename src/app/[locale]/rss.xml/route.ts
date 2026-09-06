import { Feed } from "feed";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getPosts } from "@/lib/posts";

// Nothing here depends on the request, so the feed is written at build time.
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/[locale]/rss.xml">,
) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return new Response("Not found", { status: 404 });
  }

  const t = await getTranslations({ locale, namespace: "Site" });
  const posts = getPosts(locale);

  const feed = new Feed({
    id: `${site.url}/${locale}`,
    link: `${site.url}/${locale}`,
    title: site.name,
    description: t("description"),
    language: locale,
    copyright: `© ${new Date().getFullYear()} ${site.name}`,
    feedLinks: { rss2: `${site.url}/${locale}/rss.xml` },
    author: { name: site.name, link: site.url },
  });

  for (const post of posts) {
    const url = `${site.url}/${locale}/blog/${post.slug}`;

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
