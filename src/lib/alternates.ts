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
      // Every locale's feed, current locale first, so a reader on either
      // language learns that the other feed exists.
      "application/rss+xml": [
        locale,
        ...routing.locales.filter((other) => other !== locale),
      ].map((feedLocale) => ({
        title: `${site.name} (${feedLocale})`,
        url: `${site.url}/${feedLocale}/rss.xml`,
      })),
    },
  };
}
