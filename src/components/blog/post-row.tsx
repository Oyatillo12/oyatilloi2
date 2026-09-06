import type { Post } from "content-collections";
import { getFormatter } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** Compact title-and-date row used for the latest posts on the home page. */
export async function PostRow({ post }: { post: Post }) {
  const format = await getFormatter();

  return (
    <li className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <Link href={`/blog/${post.slug}`} className="link">
        {post.title}
      </Link>
      <time
        dateTime={post.date}
        className="shrink-0 text-sm text-muted-foreground tabular-nums"
      >
        {format.dateTime(new Date(post.date), {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </time>
    </li>
  );
}
