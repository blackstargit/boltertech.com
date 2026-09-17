# Company profile

`Bolter-Technologies-Company-Profile.pptx` — a 32-slide, 16:9 deck. Facts come
from the live site (`data/*.json`, `content/projects/*.mdx`, `messages/en.json`);
anything written specifically for the deck lives in `copy.mjs`. Nothing here
edits the website.

## Replace before sending

**Two people on the "Senior team" slide are invented.** `copy.mjs` →
`team.senior[1]` ("Bilal Ahmed") and `team.senior[2]` ("Hina Rauf") are
placeholders standing in for real staff. Replace both with real people, or
delete them, before this deck goes to anyone.

## Order

1. Cover
2. At a glance — the company in facts and four numbers
3. Who we are — company statement, and the four companies we run the technology for
4. Vision — where we are going, with a Bill Gates quote on automation
5. Leadership — the three founders
6. Senior team — Naaim plus the two placeholders above
7. What we do — the five practices, automation first
8. Then, for each practice in turn: the practice, followed by one slide per
   case study in it (14 case studies, each with the problem and the outcome in
   the website's own words, the measured numbers, and a screenshot or chart)
9. Client quotes, how we work, engagement models, commitments, FAQ, contact

## Editing the wording

`copy.mjs` holds the company statement, the vision, the team, the practice
descriptions and the "how we help" lists. Change a line there and re-run the
generator. Practice order is `DECK.practiceOrder`.

Case-study text is pulled from each `content/projects/*.mdx` body: the first
paragraph of "The problem" and of "Outcome", trimmed at a sentence boundary.
To change what a slide says, edit the case study on the website.

## Fonts

The deck uses Space Grotesk, IBM Plex Sans and IBM Plex Mono — the website's
fonts. PowerPoint cannot embed them from this generator, so a machine without
them substitutes a fallback and the layout shifts. **Send a PDF, not the
.pptx**: install the fonts, open the deck, File → Export → PDF.

- Space Grotesk — https://fonts.google.com/specimen/Space+Grotesk
- IBM Plex Sans — https://fonts.google.com/specimen/IBM+Plex+Sans
- IBM Plex Mono — https://fonts.google.com/specimen/IBM+Plex+Mono

## Missing facts

Nothing is shown as a placeholder marker. Empty fields are left out, the way
the site handles them. These would strengthen the deck:

- Founder and senior-team photos (they show as monograms)
- CEO LinkedIn URL
- Company LinkedIn / GitHub / Clutch / GoodFirms URLs (`company.json` → `social`)
- Screenshots for the case studies that have no `cover` set

## Regenerating

```bash
npm i
node generate.mjs
```

This folder has its own `package.json`, so `npm i` installs into
`documentation/company-profile/node_modules` only and does not touch the root
`package.json` or `pnpm-lock.yaml`.

Re-saving the deck in PowerPoint recompresses the images and roughly halves the
file size; regenerating restores the larger original. Both open identically.

Paths inside `generate.mjs` are hardcoded to this repo (`X:\code\personal\...`).
If the repo moves, update the `ROOT` constant at the top of the file.
