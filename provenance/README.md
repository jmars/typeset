# provenance/ — full published history of `@times-components/typeset`

Archival snapshot of **every published version** of
`@times-components/typeset`, pulled from the public npm registry as an
independent record in case the original package is ever removed.

Each subdirectory `provenance/<version>/` contains the exact contents of that
npm release, unmodified: `src/*.ts` (uncompiled TypeScript source), `__tests__/`,
`LICENSE` (BSD-3, © News UK & Ireland Ltd 2017), `package.json`, tsconfigs, etc.

## Timeline

The engine was originally authored by **Jaye Marshall** at News UK & Ireland
Ltd. He left The Times in **March 2020**; `0.1.1` (published 2020-03-03) is the
last release he worked on. Releases after that date were made by the Times team
who maintained the package.

| Version | Published | Notes |
| --- | --- | --- |
| 0.0.2 | 2019-10-23 | earliest published |
| 0.0.10 | 2020-01-10 | |
| **0.1.0** | 2020-02-24 | nested styling + arbitrary newlines (REPLAT-12170) |
| **0.1.1** | **2020-03-03** | **last release authored by Jaye Marshall** |
| 0.1.2 | 2020-04-15 | after departure |
| 0.1.3 | 2020-05-26 | after departure |
| 0.2.x | 2021–2022 | after departure |
| 0.3.x | 2022–2024 | after departure |
| 0.3.3 | 2024-04-19 | last published |

## What changed after Jaye left

Structurally, almost nothing. Comparing `0.1.1` (Mar 2020) to the final `0.3.3`
(Apr 2024) shows **only one file changed**: `AttributedString.ts` gained a
`splitByDifferenceInAttributes()` helper and its `split()` was simplified (+9
lines). Every other core file — `LayoutManager`, `TextContainer`, the exclusion
system, `FontStorage`, etc. — is byte-identical. The engine that shipped in 2024
is essentially the engine authored in 2020.

## License

Each snapshot retains its BSD 3-Clause license (© News UK & Ireland Ltd). This
archival reproduction is itself a permitted BSD-3 redistribution. See the repo
root [`LICENSE`](../LICENSE) and [`PROVENANCE.md`](../PROVENANCE.md).
