# Placeholders — what is not real yet

Every unwritten thing on this site, in one place. Nothing here is a bug; it
is all deliberately marked so it cannot ship by accident. Work down the
tables and delete rows as they are filled in.

There are **two kinds**, and they behave differently:

- **Written placeholders** — real text sitting in a data or content file
  that starts with `PLACEHOLDER`. It renders as-is. Find them all with
  `grep -r PLACEHOLDER data content` (use ripgrep or your editor — the
  `rtk` shell hook silently reports zero matches for patterns that exist).
- **Rendered placeholders** — a hatched, dashed, captioned frame drawn by a
  component when an _optional_ field is empty. There is no text to grep;
  the frame appears because the data is absent. Controlled by one switch,
  `NEXT_PUBLIC_SHOW_PLACEHOLDERS`, see the bottom of this file.

Last audited: 2026-09-07.

---

## 1. Written placeholders — text that ships as-is

### `data/founders.json` — all three founders

The About page renders however many entries are in this array, so an entry
can be deleted outright rather than filled in.

| Field      | State                                   | Needed                                                                                 |
| ---------- | --------------------------------------- | -------------------------------------------------------------------------------------- |
| `name`     | `"PLACEHOLDER - Founder One/Two/Three"` | Real names                                                                             |
| `bio`      | `PLACEHOLDER` prose, ×3                 | 2–4 sentences each. Specific beats impressive — name a system, a scale or a constraint |
| `photo`    | `""` ×3                                 | 4:5 headshot, plain background, into `public/`                                         |
| `linkedin` | `""` ×3                                 | Profile URL, or leave empty and the link is not rendered                               |
| `email`    | `""` ×3                                 | Optional                                                                               |

**Shows on:** `/en/about`, founders grid. `role` and `focus` are already real.

### `data/faqs.json` — 3 of 6 answers

| Question                                                 | Why it matters                                                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| "What happens after launch?"                             | The answer that most separates you from a cheaper bid. Needs a concrete support period                    |
| "How do you scope and price a project?"                  | Describe the real process. Do **not** publish hourly rates — locked decision                              |
| "Do you use AI to write our code, and will you tell us?" | You sell AI automation, so you will be asked. A vague answer costs credibility. Needs a real house policy |

**Shows on:** `/en` FAQ band and `/en/services` FAQ band. Also feeds the
`FAQPage` JSON-LD on `/services`, so placeholder text is currently being
offered to search engines as an answer.

The other three answers (IP ownership, timezone overlap, NDA/MSA) are real.

### `data/process.json` — step 4 of 4

`"Handover and after"` → detail begins `PLACEHOLDER - state the real support
commitment.` Needs a real number in it; this is the step that makes the
tagline true.

**Shows on:** `/en`, `/en/services`, `/en/about` — the process grid appears
on all three, so this one string is visible in three places.

### `data/engagements.json` — all three, every field

How a client can buy: kind, name, summary, terms. Added with the redesign;
nothing in it is real yet.

Because there is no pricing anywhere on the site (locked decision), this
section carries the whole "what does working with you actually look like"
question on its own — it is the highest-value writing left on the list
after the FAQ answers.

**Shows on:** `/en/services`, "How you can engage us" band. Delete an entry
to show two; the grid renders however many are in the array.

### `data/commitments.json` — all four, every field

What we promise in writing. Added with the redesign.

Three of the four overlap with things that need settling elsewhere — the
support commitment (also `process.json` step 4 and one FAQ answer), the
pricing process (also one FAQ answer), and IP ownership (the FAQ answer for
this one **is** already real, so reuse its substance rather than writing a
second, subtly different version).

**Shows on:** `/en/about`, above the founders.

### `content/legal/en/terms.mdx` — `[JURISDICTION]` ×2

Governing law and exclusive jurisdiction. **The one hard launch blocker** —
a business decision (Pakistani law vs. a jurisdiction familiar to
international clients), tied to the shareholders' agreement. Not a writing
task.

**Shows on:** `/en/terms`.

### `public/logo-flat.svg` — 636 bytes, not a real mark

A stand-in for a flat single-colour logo. Wanted for the favicon, print,
16px contexts and LinkedIn's square. `logo-mark.png` is real and is what
the site uses today.

**Shows on:** nothing yet — nothing references it.

---

## 2. Rendered placeholders — hatched frames where data is absent

These draw because the field is empty. Fill the field and the real version
appears immediately, whether or not the switch below is on.

| What                  | Missing on            | Field to set                                      | Where it shows                                                 |
| --------------------- | --------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| Cover image           | **14 of 14** projects | `cover:` in frontmatter                           | Case study, under the hero                                     |
| Outcome chart         | **0 of 14** (Done)    | `series: [...]` — 12 numbers, 0–100, oldest first | Home hero snapshot, home outcome tabs, case study outcome band |
| Metric proportion bar | **0 of 14** (Done)    | `bar:` on a metric, 0–100                         | Anywhere a figure appears                                      |
| Client testimonial    | **13 of 14** projects | `testimonial:` block                              | Case study, before the next-project link                       |
| Founder portrait      | **3 of 3** founders   | `photo:` in `founders.json`                       | About, founders grid                                           |

All 14 projects now carry real `series` and `bar` metrics, so outcome charts across the site are fully populated.

**Cover images** go in `public/work/<slug>/` — the folders already exist
with `.gitkeep` files. 1600×900, screenshot or architecture diagram.

**A note on `series` and `bar`:** these are the two fields that would let
someone publish an invented trend. They are optional and absent-by-default
for exactly that reason. Only add a number you can point to a source for.
A case study without numbers is better than one with invented ones.

---

## 3. Empty but not placeholder — no action needed

These are legitimately absent and the site handles them correctly. Listed
so nobody "fixes" them.

| Field                      | State                            | Behaviour                                                                                     |
| -------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| `client`                   | Empty on 6 of 11 projects        | Renders `clientSector` marked "name withheld". Deliberate — an anonymous case study is normal |
| `links`                    | None on 8 of 11 projects         | No demo/repo buttons render. Correct: a dead button is worse than no button                   |
| `social` in `company.json` | All four empty                   | Nothing references them yet. Fill in when Clutch/GoodFirms listings exist                     |
| Dark palette               | Complete, and now the live theme | Was unreachable pre-redesign                                                                  |

---

## 4. The switch

```
NEXT_PUBLIC_SHOW_PLACEHOLDERS=0
```

Set this in the **Vercel production environment** before launch. Leave it
unset in preview and local, so the team keeps seeing what is unwritten.

- **On** (default): section 2 draws hatched, dashed, monochrome, captioned
  frames. They never take the accent colour, which belongs to measured
  figures alone, so a wireframe cannot be misread as data.
- **Off**: absent-by-default. The slot renders nothing at all — no empty
  heading, no orphaned label, no "coming soon".

The switch does **not** affect section 1. Written placeholders are real
strings in real content files and will ship as-is until someone edits them.

Implementation: `src/lib/placeholders.ts`,
`src/components/primitives/Placeholder.tsx`, and the `placeholders` block in
`messages/en.json`.

---

## Checklist before launch

- [ ] Three founder names, bios and headshots — or delete the entries
- [ ] Three FAQ answers (support, pricing process, AI disclosure)
- [ ] Process step 4 — the real support commitment, with a number
- [ ] Three engagement models — the only place the "how do we buy" question
      gets answered, since there is no pricing on the site
- [ ] Four written commitments (three depend on decisions above)
- [ ] `[JURISDICTION]` in `terms.mdx` — **hard blocker, business decision**
- [ ] Cover images for the case studies you want to lead with
- [ ] `NEXT_PUBLIC_SHOW_PLACEHOLDERS=0` in Vercel production
- [ ] Decide whether the legal drafts get a lawyer's review
