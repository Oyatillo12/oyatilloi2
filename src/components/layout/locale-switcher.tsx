"use client";

import { useLocale, useTranslations } from "next-intl";
import { LanguagesIcon } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * With two locales a switcher is a single link to the other one. Rendered
 * on the client only because the current pathname is needed to keep the
 * reader on the same page after the switch.
 */
export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const other = routing.locales.find((l) => l !== locale) ?? locale;

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      aria-label={t("switchTo", { language: t(other) })}
      className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <LanguagesIcon className="size-4" aria-hidden="true" />
      <span className="uppercase">{other}</span>
    </Link>
  );
}
