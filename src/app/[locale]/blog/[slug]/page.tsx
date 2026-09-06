import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Comments } from "@/components/blog/comments";
import { PostMeta } from "@/components/blog/post-meta";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/alternates";
import { getPost, getPostTranslations, getPosts } from "@/lib/posts";

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  if (!hasLocale(routing.locales, params.locale)) {
    return [];
  }

  return getPosts(params.locale).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/blog/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const post = getPost(locale, slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: alternates(locale, `/blog/${slug}`, [
      locale,
      ...getPostTranslations(locale, slug),
    ]),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const post = getPost(locale, slug);

  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Blog" });
  const translations = getPostTranslations(locale, slug);

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-medium">{post.title}</h1>
        <PostMeta date={post.date} readingTime={post.readingTime} />
        {post.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="secondary">{tag}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
        {translations.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("alsoAvailable")}{" "}
            {translations.map((other) => (
              <Link
                key={other}
                href={`/blog/${slug}`}
                locale={other}
                className="link"
              >
                {t(`locale.${other}`)}
              </Link>
            ))}
          </p>
        ) : null}
      </header>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <MDXContent code={post.body} components={mdxComponents} />
      </div>
      <section className="mt-8 border-t border-border pt-8">
        <Comments />
      </section>
    </article>
  );
}
