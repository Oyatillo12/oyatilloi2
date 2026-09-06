# 3. Locale-scoped content with no fallback

Date: 2026-09-07

## Status

Accepted

## Context

The site runs in Uzbek and English. Posts are written for one audience
at a time, and translating each one doubles the writing work. The
question is what an English reader sees when a post exists only in
Uzbek.

Two familiar answers: fall back to the other language, or require every
post in every language.

## Decision

Listings, feeds, and post pages are scoped to the reader's locale. A
post that does not exist in that locale is not shown at all. When the
same slug does exist in another locale, the post links to it.

## Consequences

A reader is never served a language they did not ask for, and writing a
post in one language is never blocked on translating it.

The two language versions of the site therefore hold different content,
and an English reader can follow a link from elsewhere to an Uzbek post
and land on a page they cannot read — the locale switcher is their only
recovery. Search engines are told which locales each post exists in, so
they are not asked to index a translation that was never written.
