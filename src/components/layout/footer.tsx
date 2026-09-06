import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { Container } from "@/components/layout/container";

export async function Footer() {
  const t = await getTranslations("Footer");
  const locale = await getLocale();

  return (
    <footer className="mt-16 border-t border-border py-8">
      <Container className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex items-center gap-4">
          <li>
            <a href={site.social.github} className="link">
              GitHub
            </a>
          </li>
          <li>
            <a href={site.social.linkedin} className="link">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={`/${locale}/rss.xml`} className="link">
              {t("rss")}
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
