# Company profile

`Bolter-Technologies-Company-Profile.pptx` — a 23-slide, 16:9 deck built from
the live site content (`data/*.json`, `content/projects/*.mdx`,
`messages/en.json`), in the site's dark / bone band palette and type. For
cold-outbound attachments and investor / hiring conversations. Not for
directory submissions (GoodFirms, Clutch) — that needs a different fact set
(rate bands, service-split percentages).

Slides: cover · at a glance · commitments · practice overview · one slide per
practice · process · engagement models · work overview · the featured case
studies (screenshot where `cover` is set, outcome chart from `series`) · full
portfolio table · client quotes · founders · FAQ · contact.

## Fonts

The deck uses Space Grotesk, IBM Plex Sans and IBM Plex Mono — the same three
fonts as the website. PowerPoint cannot embed them from this generator, so a
machine without them substitutes a fallback and the layout shifts. **Send a
PDF, not the .pptx**: install the fonts, open the deck, File → Export → PDF.
The PDF carries the fonts with it.

- Space Grotesk — https://fonts.google.com/specimen/Space+Grotesk
- IBM Plex Sans — https://fonts.google.com/specimen/IBM+Plex+Sans
- IBM Plex Mono — https://fonts.google.com/specimen/IBM+Plex+Mono

## Missing facts

Nothing is shown as a placeholder. Empty fields are left out, the same way the
site handles them. These would strengthen the deck once they exist:

- Founder headshots (founders show as monograms until `photo` is set)
- CEO LinkedIn URL
- Company LinkedIn / GitHub / Clutch / GoodFirms URLs (`company.json` → `social`)
- SECP registration number, NTN, postal code
- Screenshots for featured case studies without a `cover`

## Regenerating

The `.pptx` is generated, not hand-edited. The repo's `data/`, `content/` and
`messages/` are the source of truth. To rebuild after content changes:

```bash
npm i
node generate.mjs
```

This folder has its own `package.json`, so `npm i` installs into
`documentation/company-profile/node_modules` only and does not touch the root
`package.json` or `pnpm-lock.yaml`.

Paths inside `generate.mjs` are hardcoded to this repo (`X:\code\personal\...`).
It's a one-off generator for this one profile, not a reusable tool. If the repo
moves, update the `ROOT` constant at the top of the file.
