import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";
import { Container } from "@/components/layout/container";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export async function Header() {
  const t = await getTranslations("Nav");

  // The background is translucent at all times; the blur only becomes
  // visible once content scrolls beneath the bar. The bottom border fades
  // in with scroll position through `site-header` (globals.css) so the bar
  // sits flush on the page at the top.
  return (
    <header className="site-header sticky top-0 z-40 bg-background/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-3">
        <Link
          href="/"
          className="truncate rounded-sm py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {site.name}
        </Link>
        <nav className="flex shrink-0 items-center gap-1">
          <Link
            href="/blog"
            className="rounded-sm px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t("blog")}
          </Link>
          <ThemeToggle />
          <LocaleSwitcher />
        </nav>
      </Container>
    </header>
  );
}
