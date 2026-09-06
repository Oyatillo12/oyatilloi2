import type { Locale } from "next-intl";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";

/**
 * Canonical URL, the `hreflang` map, and the RSS feed for a route. `locales`
 * is narrowed for posts, which usually exist in one language only. The feed
 * link is what lets feed readers discover the feed from any page, since it
 * is no longer linked in the footer.
 */
export function alternates(
  locale: Locale,
  path: string = "",
  locales: readonly Locale[] = routing.locales,
) {
  return {
    canonical: `${site.url}/${locale}${path}`,
    languages: Object.fromEntries(
      locales.map((other) => [other, `${site.url}/${other}${path}`]),
    ),
    types: {
      "application/rss+xml": `${site.url}/${locale}/rss.xml`,
    },
  };
}
