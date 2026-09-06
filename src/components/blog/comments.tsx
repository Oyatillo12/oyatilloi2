"use client";

import { useEffect, useRef, useState } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

export function Comments() {
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // The giscus script and iframe are only fetched once the reader is near
  // the end of the post, so they never compete with the article itself.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Comments are optional: without the three giscus values the section is
  // simply absent, so the site runs before the Discussions repo exists.
  if (!repo || !repoId || !categoryId) {
    return null;
  }

  return (
    <div ref={ref} className="min-h-64">
      {visible ? (
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
        />
      ) : null}
    </div>
  );
}
