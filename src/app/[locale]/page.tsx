import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PostRow } from "@/components/blog/post-row";
import { Profile } from "@/components/home/profile";
import { NameWatermark } from "@/components/layout/name-watermark";
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
      <NameWatermark size="lg" />
      <Profile />

      {posts.length > 0 ? (
        <section className="flex flex-col gap-4">
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
