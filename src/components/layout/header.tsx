import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";
import { Container } from "@/components/layout/container";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export async function Header() {
  const t = await getTranslations("Nav");

  return (
    <header className="border-b border-border">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link href="/" className="text-sm font-medium">
          {site.name}
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/blog"
            className="px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
