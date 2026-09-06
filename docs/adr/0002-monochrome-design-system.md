# 2. Monochrome design system

Date: 2026-09-07

## Status

Accepted

## Context

The vendored component library ships a neutral colour scale plus slots
for an accent, chart colours, and sidebar colours. A personal site needs
to be recognisable, and the usual move is to pick a brand hue.

Every accent colour also has to be maintained: it needs a light value
and a dark value, both passing contrast, and every component that uses
it has to be checked in both themes.

## Decision

No accent colour. The neutral scale is the entire palette. Links are
foreground-coloured with a persistent underline. Focus rings use the
existing ring token. The unused chart and sidebar tokens are deleted.

## Consequences

There is no colour to get wrong in either theme, and adding a component
never raises the question of which hue it should use.

Because nothing is coloured, the underline is the only thing marking a
link, so it cannot be hover-only — a link that reveals itself on hover
would be invisible to a reader who never hovers, and invisible on touch
devices entirely. Any future state that would conventionally be carried
by colour — a warning, a diff, a tag category — has to be carried by
weight, border, or icon instead.
