import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { z } from "zod";

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
  transform: async (doc, ctx) => {
    const [slug, locale] = doc._meta.fileName.replace(/\.mdx$/, "").split(".");
    const body = await compileMDX(ctx, doc, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          { theme: { light: "github-light", dark: "github-dark" } },
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
  collections: [posts],
});
