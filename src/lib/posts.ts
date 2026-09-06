import { allPosts, type Post } from "content-collections";
import type { Locale } from "next-intl";
import { routing } from "@/i18n/routing";

const knownLocales: readonly string[] = routing.locales;

// The locale comes from the filename (`<slug>.<locale>.mdx`), which no schema
// can validate. Fail the build loudly rather than dropping a post silently.
for (const post of allPosts) {
  if (!knownLocales.includes(post.locale)) {
    throw new Error(
      `Post "${post._meta.filePath}" is missing a valid locale suffix. ` +
        `Expected <slug>.(${routing.locales.join("|")}).mdx`,
    );
  }
}

// Drafts are visible while writing and hidden everywhere else.
const isVisible = (post: Post) =>
  process.env.NODE_ENV === "development" || !post.draft;

const byNewestFirst = (a: Post, b: Post) => b.date.localeCompare(a.date);

export function getPosts(locale: Locale): Post[] {
  return allPosts
    .filter((post) => post.locale === locale && isVisible(post))
    .sort(byNewestFirst);
}

export function getPost(locale: Locale, slug: string): Post | undefined {
  return allPosts.find(
    (post) => post.locale === locale && post.slug === slug && isVisible(post),
  );
}

/**
 * Locales this post also exists in. Posts are not translated by default, so
 * this is empty for most of them.
 */
export function getPostTranslations(locale: Locale, slug: string): Locale[] {
  return routing.locales.filter(
    (other) => other !== locale && getPost(other, slug) !== undefined,
  );
}
