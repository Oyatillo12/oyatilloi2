# Context

Shared vocabulary for this site. Definitions only — no implementation
details, no plans.

## Post

A single article. Written by hand, one file per article. A Post always
has exactly one Post Language.

## Slug

The stable identifier for a Post. It is unique across the whole site: no
two Posts share one, whatever language they are written in. The Slug is
part of the URL and must not change once a Post is published.

## Post Language

The language a Post is written in. It is a property of the article, not
of the site: the interface is English and is never translated. Every
Post appears in the same listing and the same feed regardless of its
Post Language, and nothing on the page announces it — a reader tells
from the title.

## Draft

A Post that is not ready to be read. Drafts are visible while writing
and absent everywhere else — they do not appear in listings, feeds, or
at their own URL once published to the live site.

## Fixture

A Post that exists only to exercise rendering. It is never committed and
never published; it is a development tool that happens to be shaped like
a Post.
