# Editing the website without a developer

Everything a non-developer needs to change lives in `data/`, `content/` and
`messages/`. No component contains copy, colours, or contact details.

Edit a file, commit, push. Vercel rebuilds and the site updates.

---

## Where things live

| You want to change                                    | Edit this                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| Phone, email, address, tagline, company description   | `data/company.json`                                             |
| Founder names, roles, bios, photos, LinkedIn links    | `data/founders.json`                                            |
| The four service descriptions and their tech lists    | `data/services.json`                                            |
| FAQ questions and answers                             | `data/faqs.json`                                                |
| The four "How we work" steps                          | `data/process.json`                                             |
| Cost estimator questions and price weights            | `data/estimator.json` — see "Tuning the cost estimator" below   |
| Case studies                                          | `content/projects/*.mdx` — see `content/projects/_AUTHORING.md` |
| Privacy policy, terms                                 | `content/legal/en/*.mdx`                                        |
| Button labels, headings, form labels — any UI wording | `messages/en.json`                                              |
| Colours, fonts, spacing                               | `src/app/globals.css`                                           |

Images go in `public/`. A project's screenshots belong in
`public/work/<project-slug>/`, headshots in `public/team/`.

---

## Adding a case study

Copy any file in `content/projects/`, rename it, edit. The filename becomes
the URL. Full field reference is in `content/projects/_AUTHORING.md`.

**Optional fields render only when filled in.** Leave `testimonial` empty and
that section does not appear — no empty heading, no placeholder. Same for
metrics, demo links, cover images, and the client name.

**Leaving `client` empty is deliberate, not incomplete.** The page shows the
sector marked "name withheld" instead. Only fill it in when the client has
agreed to be named.

---

## Adding a founder

Add an object to the array in `data/founders.json`. The About page renders
however many are in the list — two, three or five all lay out correctly.

Leave `photo` empty until you have a headshot; the card falls back to
initials on a dark plate rather than a broken image.

---

## Tuning the cost estimator

`/estimate` asks a few questions and shows an indicative price range. All of
it — the questions, the answers and the numbers behind them — lives in
`data/estimator.json`. No code change is needed to retune it.

The top of the file sets the shape of every estimate:

| Key        | What it does                                                     |
| ---------- | --------------------------------------------------------------- |
| `base`     | The floor every project starts from, before any answer is added |
| `spread`   | How wide the range is. `0.3` means the range is ±30%            |
| `roundTo`  | Both ends of the range are rounded to this (e.g. `500`)        |
| `minimum`  | The low end never drops below this                              |
| `currency` / `symbol` | Shown next to every figure (`"USD"` / `"$"`)       |
| `disclaimer` | The "not a quote" line under the range                        |

Each entry in `groups` is one question. Each option under it carries:

- `add` — how much this answer adds to the total.
- `mult` — multiplies the running total instead of adding (used for
  "Accelerated" timeline). Leave it off for normal options.
- `weeks` — optional. If **no** option anywhere has a `weeks` value, the
  "Rough timeline" line disappears entirely.

To change a price, edit a number. To add an answer, copy an option object.
To add a question, copy a whole group. `type` is `"single"` (pick one) or
`"multi"` (pick any). The build fails and names the field if a number is
missing or negative.

**These are placeholder numbers.** Replace them with real figures before
launch — search the repo for `PLACEHOLDER`.

---

## If the build fails

That is usually deliberate. Content is validated on every build, so a typo
stops the deploy instead of putting a broken page live. The error names the
file and the field:

```
Invalid frontmatter in content/projects/dispatch-routing.mdx
  · category: Invalid option: expected one of "ai"|"automation"|"software"|"data"
```

Fix the named field and push again.

---

## Still to be filled in before launch

Search the repo for `PLACEHOLDER` to find everything at once.

- [ ] **`content/legal/en/terms.mdx`** — the governing law clause still says
      `[JURISDICTION]`. A business decision, and a launch blocker.
- [ ] **`data/founders.json`** — all three entries are placeholders.
- [ ] **`data/faqs.json`** — three answers are placeholders: post-launch
      support terms, how you scope and price, and your AI-disclosure policy.
      The last one matters most; you sell AI automation, so you will be asked.
- [ ] **`data/estimator.json`** — every price weight is a placeholder. Set
      real figures, or the estimator quotes numbers you did not choose.
- [ ] **`data/process.json`** — the "Handover and after" step needs a real
      support commitment.
- [ ] **`content/projects/*.mdx`** — four seeded projects, all placeholder
      copy. They are deliberately different shapes so you can see how each
      optional field renders.
- [ ] **`public/logo-flat.svg`** — placeholder hexagon. Replace with the real
      flat single-colour mark for the favicon, LinkedIn's square, and print.
- [ ] **`data/company.json`** — the `social` links are all empty.

## Environment variables

Set these in Vercel (and in `.env.local` for local work) — see `.env.example`:

- `RESEND_API_KEY` — **the contact form cannot deliver without it.** It fails
  honestly with an error rather than pretending to send.
- `CONTACT_TO_EMAIL` — defaults to `contact@boltertech.com`.
- `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, sitemap and social cards.

---

## Adding a language

1. Uncomment the locale in `src/lib/locales` (`src/lib/i18n.ts`).
2. Copy `messages/en.json` to `messages/<code>.json` and translate it.
3. Copy `content/legal/en/` to `content/legal/<code>/` and translate.

The whole site generates in that language, and right-to-left languages get
`dir="rtl"` automatically — the layout was built with logical properties, so
it mirrors without a second stylesheet.
