import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PostCard } from "@/components/blog/post-card";
import { site } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getPosts } from "@/lib/posts";

const LATEST_COUNT = 3;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "HomePage" });
  const posts = getPosts(locale).slice(0, LATEST_COUNT);

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{site.name}</h1>
        <p className="text-muted-foreground">{t("bio")}</p>
      </section>

      {posts.length > 0 ? (
        <section className="flex flex-col gap-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            {t("latest")}
          </h2>
          <div className="flex flex-col gap-8">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <p>
            <Link href="/blog" className="text-sm link">
              {t("viewAll")}
            </Link>
          </p>
        </section>
      ) : null}
    </div>
  );
}
