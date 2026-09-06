# 4. Single blue accent

Date: 2026-09-07

## Status

Accepted

Supersedes [0002. Monochrome design system](0002-monochrome-design-system.md)

## Context

ADR 0002 chose an all-neutral palette so that no colour could be wrong in
either theme. The redesign review that followed the baseline audit found
the cost of that choice. Every link looks like every other piece of text
until the reader notices the underline, the header navigation has no
rest state that says "this can be clicked", and the site is
indistinguishable from a default template. A personal site is a brand,
and a brand that is only grey is hard to remember.

The maintenance cost that 0002 was worried about is real but bounded: it
is one hue, needing one light value and one dark value, checked once.

## Decision

One accent colour, blue, exposed as the `brand` token. It has a light
value and a dark value, both chosen so that accent-coloured text passes
WCAG AA (4.5:1) on the page background and on every neutral surface in
that theme. Ratios below are WCAG 2 relative-luminance contrast computed
in sRGB; `secondary` shares its value with `muted` in both themes.

| Theme | Value                  | On background | On card | On muted |
| ----- | ---------------------- | ------------- | ------- | -------- |
| Light | `oklch(0.52 0.19 258)` | 5.7:1         | 5.7:1   | 5.2:1    |
| Dark  | `oklch(0.75 0.14 250)` | 8.9:1         | 8.1:1   | 6.8:1    |

Where the accent is used:

- Link text, in the body and in MDX content, at rest. The underline
  stays, drawn in the accent at reduced opacity, and becomes solid on
  hover and while active.
- Focus rings. The `ring` token now points at `brand`, so every
  focus-visible outline on the site is blue. Rings are drawn at full
  opacity: the half-transparent ring the component library ships fails
  the 3:1 non-text contrast requirement in both themes once it is blue.
- Hover state of navigation links in the header, which are neutral at
  rest and take the accent when hovered.
- The `link` variant of Button and Badge.
- Hover state of the other small navigation controls: the language link
  in the header, the contact icons on the home page, and the title of a
  blog card. Like the header nav, these are neutral at rest.
- The name watermark behind the header: an outline stroke only, at an
  opacity low enough (0.10 light, 0.16 dark) that `foreground`,
  `muted-foreground`, and `brand` text laid over a stroke pixel still
  clear 4.5:1 in both themes. This is the one place the accent is
  drawn under text, and raising the opacity means re-checking those
  ratios.

Where the accent is not used:

- Body text, headings, and metadata. These remain `foreground` and
  `muted-foreground`.
- Surfaces. Backgrounds, cards, borders, code blocks, callouts, and the
  hover backgrounds of buttons and menu items stay neutral. The vendored
  component library's `accent` token is a neutral hover surface and is
  unrelated to `brand`; it keeps its grey value.
- The site name in the header. It is the brand mark, not a call to
  action, and stays `foreground`.
- Heading anchors in MDX, which inherit their heading's colour.
- Any second hue. Warnings, diffs, and tag categories are still carried
  by weight, border, or icon, as 0002 required.

## Consequences

Links are now visible without the underline doing all the work, and
focus is unmistakable in both themes. The site has one recognisable
colour.

Anything that renders text in the accent has to keep it on a neutral
surface. The accent is never a background for text and text is never
placed on an accent background, because none of the accent-on-accent
combinations have been checked. Adding a second hue, or using this one
for a surface, requires a new ADR.
