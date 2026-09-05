import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // `locale` is only set when it is passed explicitly, e.g.
  // `getTranslations({locale: "en"})` in a route handler, where
  // `next/root-params` is not available yet.
  const requested = locale ?? (await rootLocale());
  const resolved = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale: resolved,
    messages: (await import(`../../messages/${resolved}.json`)).default,
  };
});
