# 5. 3D hero scene

Date: 2026-11-10

## Status

Accepted

Amends [0004. Single blue accent](0004-single-blue-accent.md): replaces
its home page background, and retints the dark neutrals.

## Context

The home page background from 0004 — an aurora, a dot grid, and a pointer
glow, all in the one accent hue and all capped at low opacity so text
could sit on top — was too faint to be noticed. The site is a personal
brand as much as a blog, and its home page had nothing a reader would
remember: one paragraph, and a background nobody saw.

## Decision

The home page hero carries a real-time 3D scene: one cloud of particles
that keeps rearranging itself into the things the site is about — a code
glyph, the React atom, a globe with Tashkent marked on it, a written
page. A caption under the scene names each one as it forms, so the scene
says who the author is instead of only decorating the page. It moves on
by itself; a click on the cloud sends it to the next shape, and a row of
dots picks one directly. The cloud also parts around the pointer. It is
drawn with three.js, the site's first dependency that exists purely for
looks.

The scene is allowed colours the interface is not. It walks pink, violet,
blue and cyan; 0004's single accent still governs every link, focus ring
and control. The two never meet, because **no text is drawn over the
scene**: it occupies its own block above the hero copy. That is what
removes the opacity caps 0004 needed.

The whole hero stays within one screen. Giving each shape its own
screen-tall section, with the scene pinned beside the text, was tried and
rejected: it turned a short page into a long one to say four short things.

It must not cost the reader anything they did not ask for:

- three.js is imported in exactly one module, reached only through
  `import()` once the browser is idle. It is a separate chunk (about
  135 KB gzipped) and never part of the initial JavaScript. The heading
  is still the largest contentful paint.
- Until the chunk arrives, and for good where WebGL is unavailable, a CSS
  glow in the same colours stands in its place.
- The render loop stops while the hero is scrolled out of view or the tab
  is hidden. Device pixel ratio is capped at 2, and touch devices get
  half the particles.
- Under `prefers-reduced-motion` the first shape is drawn as a still frame: no loop, no pointer tracking, and a picked shape simply replaces
  the last.

The dark theme's neutral surfaces move from zero chroma to a slight blue
tint. Pure grey looked like a switched-off screen beside the scene. The
contrast table in 0004 is updated to match.

Home only. Other pages keep a flat background.

## Consequences

The home page is recognisably this site's, in both themes.

The captions are copy that has to be kept true: a shape and its caption
are added, changed or removed together.

There is now GPU code to maintain, and it cannot be checked by the
typechecker or by reading a diff: a change to the shaders has to be
looked at, in both themes, at a phone width, and with reduced motion on.

The scene still runs entirely in the browser, so 0001 holds: nothing new
happens at request time.

Putting text over the scene, or using its colours anywhere in the
interface, requires a new ADR.
