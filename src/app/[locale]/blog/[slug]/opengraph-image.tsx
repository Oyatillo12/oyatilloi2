import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getPost, getPosts } from "@/lib/posts";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = hasLocale(routing.locales, locale)
    ? getPost(locale, slug)
    : undefined;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#0f0f0f",
        color: "#fafafa",
      }}
    >
      <div style={{ fontSize: 56, lineHeight: 1.2 }}>
        {post?.title ?? site.name}
      </div>
      <div style={{ display: "flex", fontSize: 28, color: "#a1a1a1" }}>
        {site.name}
      </div>
    </div>,
    size,
  );
}
