# Company profile

`Bolter-Technologies-Company-Profile.docx` — a Word document built from the
live site content (`data/*.json`, `content/projects/*.mdx`), styled with the
site's own palette and type. For cold-outbound attachments and investor /
hiring conversations. Not for directory submissions (GoodFirms, Clutch) — that
needs a different fact set (rate bands, service-split percentages).

## Fonts

The document specifies Space Grotesk, IBM Plex Sans and IBM Plex Mono — the
same three fonts as the website. They are **not bundled here** (that's ~1.5 MB
of font files for a two-minute install). Word substitutes a fallback
(Segoe UI / Consolas) if they're missing, and **exporting to PDF does not fix
this** — Word renders with whatever font is installed *before* it makes the
PDF, so the substitution gets baked in. Install once, on whichever machine
does the PDF export:

- Space Grotesk — https://fonts.google.com/specimen/Space+Grotesk
- IBM Plex Sans — https://fonts.google.com/specimen/IBM+Plex+Sans
- IBM Plex Mono — https://fonts.google.com/specimen/IBM+Plex+Mono

## Placeholders

Search the document for **PLACEHOLDER** (Ctrl+F) — every fact that doesn't
exist anywhere in the repo is marked inline, amber and bold, and collected as
a checklist in the document's last section ("Information to complete").
Fill each one in and delete the checklist page before sending.

## Regenerating

The `.docx` is generated, not hand-edited — the source of truth is the repo's
`data/` and `content/projects/`. To rebuild after content changes:

```bash
npm i docx gray-matter
node generate.mjs
```

This does **not** touch `package.json` or `pnpm-lock.yaml` at the repo root —
`generate.mjs` is a standalone script with its own two dependencies, installed
locally in this folder. `npm i` here creates `node_modules/` and
`package-lock.json` inside `documentation/company-profile/` only.

Paths inside `generate.mjs` are hardcoded to this repo (`X:\code\personal\...`)
— it's a one-off generator for this one company profile, not a reusable tool.
If the repo moves, update the `ROOT` constant at the top of the file.
