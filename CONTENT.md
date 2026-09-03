# Editing the website without a developer

Everything a non-developer needs to change lives in `data/`, `content/` and
`messages/`. No component contains copy, colours, or contact details.

Edit a file, commit, push. Vercel rebuilds and the site updates.

---

## Where things live

| You want to change | Edit this |
| --- | --- |
| Phone, email, address, tagline, company description | `data/company.json` |
| Founder names, roles, bios, photos, LinkedIn links | `data/founders.json` |
| The three service descriptions and their tech lists | `data/services.json` |
| FAQ questions and answers | `data/faqs.json` |
| The four "How we work" steps | `data/process.json` |
| Case studies | `content/projects/*.mdx` — see `content/projects/_AUTHORING.md` |
| Privacy policy, terms | `content/legal/en/*.mdx` |
| Button labels, headings, form labels — any UI wording | `messages/en.json` |
| Colours, fonts, spacing | `src/app/globals.css` |

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

## If the build fails

That is usually deliberate. Content is validated on every build, so a typo
stops the deploy instead of putting a broken page live. The error names the
file and the field:

```
Invalid frontmatter in content/projects/dispatch-routing.mdx
  · category: Invalid option: expected one of "ai-automation"|"software"|"data"
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
- [ ] **`data/process.json`** — the "Handover and after" step needs a real
      support commitment.
- [ ] **`content/projects/*.mdx`** — three seeded projects, all placeholder
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
