import { site } from "@/config/site";

/**
 * Canonical URL and RSS feed link for a route. There is one language and one
 * feed, so there is no `hreflang` map: the feed link is only here so that a
 * reader discovers the feed from any page, since it is not linked in the
 * footer.
 */
export function alternates(path: string = "") {
  return {
    canonical: `${site.url}${path}`,
    types: {
      "application/rss+xml": [{ title: site.name, url: `${site.url}/rss.xml` }],
    },
  };
}
