import type { Post } from "content-collections";
import { Link } from "@/i18n/navigation";
import { PostMeta } from "@/components/blog/post-meta";

/**
 * Bordered card for the blog listing. The title link is stretched over the
 * whole card with a pseudo-element, so the card is one click target while
 * the link's accessible name stays just the title.
 */
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="relative flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors hover:border-brand/40 hover:bg-muted/50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2">
      <h3 className="text-lg font-medium">
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors outline-none after:absolute after:inset-0 hover:text-brand"
        >
          {post.title}
        </Link>
      </h3>
      <PostMeta date={post.date} readingTime={post.readingTime} />
      <p className="text-muted-foreground">{post.description}</p>
    </article>
  );
}
