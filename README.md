# The Times layout system — typeset + ts-styleguide

Two halves of one system, originally authored and built by **Jaye Marshall**
while he worked at News UK & Ireland Ltd (The Times), recovered and preserved
here:

| Directory | Package | Role |
| --- | --- | --- |
| `.` (root) | `typeset` | geometry — flows text around arbitrary-shaped exclusions |
| `ts-styleguide/` | `ts-styleguide` | editorial design intent — the tokens that say what "looks right" is |

Together they turn "this is a style-magazine article" into actually typeset,
correctly-floated text. `ts-styleguide` supplies the design decision (fonts,
colours, line-heights, per section + template); `typeset` renders it around
drop-caps, images and pull-quotes.

---

## typeset — text layout with arbitrary shapes

`typeset` flows text around exclusion zones that may be **any polygon** — not
just rectangles. A drop cap, an inline image, or a pull quote is modelled as an
`Exclusion`, and the engine fills text into the remaining free space.

This is a standalone, buildable reference rebuild of
[`@times-components/typeset@0.1.1`](https://www.npmjs.com/package/@times-components/typeset) —
the last published release before Jaye Marshall left News UK in March 2020.
See [`ts-styleguide/`](./ts-styleguide) for the design-token half.

### How the engine works

Two cooperating pieces:

- **`TextContainer`** computes *where text is allowed to go*. For each baseline
  row it sweeps across the width and uses `point-in-polygon` to find where each
  exclusion blocks the row, chopping it into contiguous free `Span`s.
- **`LayoutManager`** decides *what goes where*. It greedily fits word tokens
  (from an `AttributedString`) into those spans, one container at a time, and
  emits `PositionedItem`s — a text chunk plus an absolute `x, y`.

Because placement is decided at the pixel/polygon level rather than against fixed
column rectangles, an exclusion can have an arbitrary contour and text flows
around its actual shape. `FontStorage` measures glyph advances via `opentype.js`.

> The exclusion/geometry machinery is the part this engine solves well. Line
> breaking is deliberately a separate concern: the type declarations in
> `src/types/externs.d.ts` stub out `tex-linebreak` (Knuth–Plass) and
> `hyphenation.en-gb`, but the shipped `LayoutManager` does greedy, ragged-right
> flow and never imports them. Justified layout was designed-for but not wired in
> here.

### Modules (typeset)

| File | Responsibility |
| --- | --- |
| `src/TextContainer.ts` | pixel-sweep of a row into free `Span`s, via `point-in-polygon` against exclusions |
| `src/LayoutManager.ts` | greedy flow of word tokens into spans, producing `PositionedItem`s |
| `src/AttributedString.ts` | string + per-character styling/attribute runs |
| `src/Span.ts` | a free x-range on a row within a container |
| `src/Point.ts` | `x, y` point |
| `src/PositionedItem.ts` | a placed text chunk (`AttributedString` + `Point`) |
| `src/Exclusion.ts` | interface: a polygon region text must avoid |
| `src/BoxExclusion.ts` | rectangular `Exclusion` |
| `src/FontStorage.ts` | font registry + `opentype.js` advance-width measurement |
| `src/index.ts` | public exports |

### Build

```sh
npm install
npm run build   # emits CommonJS + type declarations to dist/
npm run typecheck
```

Output lands in `dist/` (`main` = `dist/index.js`, `types` = `dist/index.d.ts`).

## ts-styleguide — the design system

See [`ts-styleguide/`](./ts-styleguide) — the editorial design tokens and
`themeFactory` (section + template → fonts / colour / headline case) that drive
the engine, with its own provenance and module breakdown.

## Provenance & license

BSD 3-Clause throughout. The two packages were originally authored by **Jaye
Marshall** at News UK; copyright is held by News UK & Ireland Ltd (Copyright
(c) 2017), which published them under BSD-3 on npm. See
[`PROVENANCE.md`](./PROVENANCE.md) (typeset) and
[`ts-styleguide/PROVENANCE.md`](./ts-styleguide/PROVENANCE.md) for full
attribution and history. [`provenance/`](./provenance) archives every published
version of `typeset`.
