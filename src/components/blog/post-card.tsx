import type { Post } from "content-collections";
import { Link } from "@/i18n/navigation";
import { PostMeta } from "@/components/blog/post-meta";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col gap-2">
      <h2 className="text-lg font-medium">
        <Link href={`/blog/${post.slug}`} className="link">
          {post.title}
        </Link>
      </h2>
      <PostMeta date={post.date} readingTime={post.readingTime} />
      <p className="text-muted-foreground">{post.description}</p>
    </article>
  );
}
