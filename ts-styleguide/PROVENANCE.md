# ts-styleguide — provenance

`@times-components/ts-styleguide` is the design-system / styleguide package of
The Times React codebase — the design tokens and primitives that sit on top of
the `typeset` layout engine. It was **originally authored and built by Jaye
Marshall** while he worked at News UK & Ireland Ltd (The Times).

The code here is the latest published source (`1.56.41`, which ships its
uncompiled `src/`), reproduced as a standalone reference alongside `typeset`
because the two packages are two halves of one layout system:
`ts-styleguide` supplies the editorial design intent, `typeset` renders it.

- npm: `https://www.npmjs.com/package/@times-components/ts-styleguide`
- license: BSD 3-Clause, Copyright (c) 2017 News UK & Ireland Ltd (see [`LICENSE`](./LICENSE))

## What's in it

- **Design tokens** — `src/styleguide/colours/` (brand + per-section colours),
  `src/styleguide/fonts/` (families, sizes, styles, fallbacks),
  `src/styleguide/lineHeight.tsx` (the editorial line-height map by typographic
  role), `spacing.tsx`, `breakpoints.tsx`, `scales.tsx`.
- **`themeFactory.tsx`** — the editorial decision layer: given a section +
  template, returns the drop-cap/headline/pull-quote fonts, section colour, and
  headline case.
- **Primitives** — `TsTcText`, `TsTcView`, `Animations`.

## Copyright vs authorship

As with `typeset` (see [`../PROVENANCE.md`](../PROVENANCE.md)): the code was
authored by Jaye Marshall at News UK; copyright is held by News UK & Ireland
Ltd under BSD 3-Clause. This is a permitted BSD-3 redistribution for reference,
claiming neither News UK endorsement nor author ownership of the code.
