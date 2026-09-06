import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PostCard } from "@/components/blog/post-card";
import { NameWatermark } from "@/components/layout/name-watermark";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/alternates";
import { getPosts, groupByYear } from "@/lib/posts";

export async function generateMetadata(
  props: PageProps<"/[locale]/blog">,
): Promise<Metadata> {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Blog" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale, "/blog"),
  };
}

export default async function BlogPage({
  params,
}: PageProps<"/[locale]/blog">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Blog" });
  const years = groupByYear(getPosts(locale));

  return (
    <div className="flex flex-col gap-10">
      <NameWatermark size="sm" />
      <h1 className="text-2xl font-medium">{t("title")}</h1>
      {years.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
      ) : (
        years.map(({ year, posts }) => (
          <section key={year} className="flex flex-col gap-4">
            <h2 className="text-sm font-medium text-muted-foreground tabular-nums">
              {year}
            </h2>
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
