import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PostRow } from "@/components/blog/post-row";
import { Profile } from "@/components/home/profile";
import { getPosts } from "@/lib/posts";

const LATEST_COUNT = 3;

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const posts = getPosts().slice(0, LATEST_COUNT);

  return (
    <div className="flex flex-col gap-16">
      <Profile />

      {posts.length > 0 ? (
        <section
          className="reveal flex flex-col gap-4"
          style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
        >
          <h2 className="text-sm font-medium text-muted-foreground">
            {t("latest")}
          </h2>
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ul>
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
