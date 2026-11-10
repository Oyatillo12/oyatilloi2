import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { Badge } from "@/components/ui/badge";
import { Comments } from "@/components/blog/comments";
import { PostMeta } from "@/components/blog/post-meta";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { alternates } from "@/lib/alternates";
import { getPost, getPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: alternates(`/blog/${slug}`),
    openGraph: {
      type: "article",
      locale: post.language,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  // The interface is English, but a post may be written in Uzbek. `lang` on
  // the article is what tells a screen reader which voice to use and a search
  // engine what it is indexing; nothing about it is visible.
  return (
    <article lang={post.language} className="flex flex-col gap-6">
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
