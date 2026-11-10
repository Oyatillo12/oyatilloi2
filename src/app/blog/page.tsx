import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PostCard } from "@/components/blog/post-card";
import { alternates } from "@/lib/alternates";
import { getPosts, groupByYear } from "@/lib/posts";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Blog");

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates("/blog"),
  };
}

export default async function BlogPage() {
  const t = await getTranslations("Blog");
  const years = groupByYear(getPosts());

  return (
    <div className="flex flex-col gap-10">
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
