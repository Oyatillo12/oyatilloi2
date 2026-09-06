import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { z } from "zod";

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    // Authored as YYYY-MM-DD. Validated here so a malformed date fails the
    // build instead of silently breaking sorting and the RSS feed.
    date: z.iso.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    content: z.string(),
  }),
  transform: async (doc, ctx) => {
    const [slug, locale] = doc._meta.fileName.replace(/\.mdx$/, "").split(".");
    const body = await compileMDX(ctx, doc, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        [
          rehypePrettyCode,
          {
            // The plain github-light theme has orange tokens below 4.5:1.
            theme: { light: "github-light-high-contrast", dark: "github-dark" },
          },
        ],
      ],
    });

    return {
      ...doc,
      slug,
      locale,
      body,
      readingTime: Math.ceil(doc.content.split(/\s+/).length / 200),
    };
  },
});

export default defineConfig({
  content: [posts],
});
