import type { ComponentProps } from "react";
import { cn } from "cn";
import { Callout } from "@/components/mdx/callout";
import { Figure } from "@/components/mdx/figure";

// Heading anchors are <a> elements too, injected by rehype-autolink-headings
// around the heading text, so headings opt their links out of the underline.
const headingLink = "[&_a]:no-underline [&_a]:text-inherit";

export const mdxComponents = {
  Callout,
  Figure,
  a: ({ className, ...props }: ComponentProps<"a">) => (
    <a className={cn("link", className)} {...props} />
  ),
  h2: ({ className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={cn(
        "mt-10 scroll-mt-20 text-xl font-medium",
        headingLink,
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-8 scroll-mt-20 text-lg font-medium",
        headingLink,
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: ComponentProps<"h4">) => (
    <h4
      className={cn(
        "mt-6 scroll-mt-20 text-base font-medium",
        headingLink,
        className,
      )}
      {...props}
    />
  ),
};
