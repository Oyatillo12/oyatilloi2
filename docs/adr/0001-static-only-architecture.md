# 1. Static-only architecture

Date: 2026-09-07

## Status

Accepted

## Context

The site is a personal blog with a small audience. Earlier planning
assumed a database, authentication, an admin editor, and a newsletter
sender. None of that has a reader yet, and every piece of it would have
to be maintained, secured, and paid for before the first post is
published.

Content is written by one person, in an editor, on a laptop. The
publishing act is a git commit either way.

## Decision

Every route is prerendered at build time. No database, no
authentication, no request-time route handlers. Comments come from
GitHub Discussions through giscus. The RSS feed and Open Graph images
are generated during the build. Deployment is Vercel.

## Consequences

There is no runtime state to lose, no migration to run, and no login to
protect. Hosting fits in a free tier and a cold start cannot happen.

Publishing requires a deploy, so a post cannot be scheduled to appear on
its own: a future-dated post is treated as a typo, not as scheduling.
Any feature that needs to remember something about a reader — a view
counter, a subscriber list, a saved draft — is out of reach until this
decision is revisited.
