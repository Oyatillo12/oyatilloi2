# 3. English interface, language per post

Date: 2026-09-07

## Status

Accepted

## Context

The site is written and maintained by one person, and the audience it is
meant to reach — junior and middle developers, and employers reading a
CV — reads English. Running the interface in two languages meant a
locale segment in every URL, a locale switcher, two message catalogues,
two feeds, an `hreflang` map, and a routing middleware in front of an
otherwise fully static site. All of that existed to serve a second
interface language that nobody had asked for.

Articles are a separate question. Writing is easier in whichever
language the subject suits, and translating each article doubles the
work for no reader.

## Decision

The interface is English and is not translated. There is no locale
segment: the site is served from `/`, `/blog`, `/blog/<slug>`, with no
routing middleware. `next-intl` stays for the message catalogue and for
date formatting, both under a single fixed locale.

An article carries its own language, taken from its filename
(`<slug>.<language>.mdx`). Articles of every language share one listing
and one feed, in date order, with nothing marking the language in the
interface. Each article page carries the language in the `lang`
attribute.

## Consequences

Every route is prerendered with no request-time work at all, which is
what ADR 0001 wanted in the first place.

A slug now identifies an article on its own, so the same slug cannot be
used for two languages: `/blog/<slug>` could only serve one of them. The
build fails on a collision rather than picking a winner.

An English-speaking reader will meet Uzbek titles in the listing and can
open an article they cannot read. That is accepted: the alternative was
hiding articles from the readers they were written for.

The feed is single-language at the feed level even though its items are
not, because RSS 2.0 carries no per-item language. Feed readers will
treat every item as English.
