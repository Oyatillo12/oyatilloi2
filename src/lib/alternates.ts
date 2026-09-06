import type { Locale } from "next-intl";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";

/**
 * Canonical URL plus the `hreflang` map for a route. `locales` is narrowed for
 * posts, which usually exist in one language only.
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
  };
}
