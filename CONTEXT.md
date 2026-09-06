# Context

Shared vocabulary for this site. Definitions only — no implementation
details, no plans.

## Post

A single article. Written by hand, one file per language version. A Post
always belongs to exactly one Locale; it is never language-neutral.

## Slug

The stable identifier for a Post, shared across every language version of
it. Two Posts with the same Slug in different Locales are the same article
in two languages. The Slug is part of the URL and must not change once a
Post is published.

## Locale

A language the site is available in. Currently Uzbek (the default) and
English. A Locale applies both to the interface and to Posts, but the two
are independent: a reader on the English interface may find that a given
Post exists only in Uzbek.

## Translation

Another Locale that the same Slug exists in. Translations are the
exception, not the rule — most Posts exist in one Locale only. A Post is
never shown in a Locale it was not written for, so a reader is never
served a language they did not ask for.

## Draft

A Post that is not ready to be read. Drafts are visible while writing and
absent everywhere else — they do not appear in listings, feeds, or at
their own URL once published to the live site.

## Fixture

A Post that exists only to exercise rendering. It is never committed and
never published; it is a development tool that happens to be shaped like
a Post.
