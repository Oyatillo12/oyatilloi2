import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PostCard } from "@/components/blog/post-card";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/alternates";
import { getPosts } from "@/lib/posts";

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
  const posts = getPosts(locale);

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-medium">{t("title")}</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="flex flex-col gap-10">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
