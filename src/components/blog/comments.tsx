"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

export function Comments() {
  const { resolvedTheme } = useTheme();

  // Comments are optional: without the three giscus values the section is
  // simply absent, so the site runs before the Discussions repo exists.
  if (!repo || !repoId || !categoryId) {
    return null;
  }

  return (
    <Giscus
      id="comments"
      repo={repo as `${string}/${string}`}
      repoId={repoId}
      categoryId={categoryId}
      mapping="pathname"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      lang="en"
      loading="lazy"
    />
  );
}
