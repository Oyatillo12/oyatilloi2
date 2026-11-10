import { allPosts, type Post } from "content-collections";

/**
 * Languages a post may be written in. The interface is English only, so this
 * is not a site locale: it is metadata about the article, used for the `lang`
 * attribute on the page and nowhere else. Posts of every language share one
 * listing and one feed.
 */
export const postLanguages = ["en", "uz"] as const;

export type PostLanguage = (typeof postLanguages)[number];

const isPostLanguage = (value: string): value is PostLanguage =>
  (postLanguages as readonly string[]).includes(value);

// The language comes from the filename (`<slug>.<language>.mdx`), which no
// schema can validate. Fail the build loudly rather than dropping a post
// silently. The slug alone identifies a post now that every language shares
// one listing, so a slug reused in two languages is a collision, not a
// translation: `/blog/<slug>` could only ever serve one of them.
const seen = new Map<string, string>();

for (const post of allPosts) {
  if (!isPostLanguage(post.language)) {
    throw new Error(
      `Post "${post._meta.filePath}" is missing a valid language suffix. ` +
        `Expected <slug>.(${postLanguages.join("|")}).mdx`,
    );
  }

  const duplicate = seen.get(post.slug);

  if (duplicate) {
    throw new Error(
      `Posts "${duplicate}" and "${post._meta.filePath}" share the slug ` +
        `"${post.slug}". Slugs must be unique across every language.`,
    );
  }

  seen.set(post.slug, post._meta.filePath);
}

// Drafts are visible while writing and hidden everywhere else.
const isVisible = (post: Post) =>
  process.env.NODE_ENV === "development" || !post.draft;

const byNewestFirst = (a: Post, b: Post) => b.date.localeCompare(a.date);

export function getPosts(): Post[] {
  return allPosts.filter(isVisible).sort(byNewestFirst);
}

export function getPost(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug && isVisible(post));
}

/** Posts bucketed by publication year, newest year first, order preserved. */
export function groupByYear(posts: Post[]): { year: string; posts: Post[] }[] {
  const groups = new Map<string, Post[]>();

  for (const post of posts) {
    const year = post.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }

  return [...groups].map(([year, posts]) => ({ year, posts }));
}
