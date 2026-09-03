# boltertech.com

Company website for **Bolter Technologies Private Limited** (Islamabad, founded
2024, 5–10 engineers). Next.js 16 App Router, React 19, Tailwind v4, deployed
to Vercel. Static by default — the contact form is the only runtime endpoint.

This site is the hub of the company's online presence. It is also a
**dependency for other platforms**: GoodFirms will not list a company without a
live website, and DesignRush reviews the site before accepting a submission.
Design decisions lean toward credibility for a sceptical first-time visitor
arriving from a directory listing or a cold outbound message.

`CONTENT.md` is the guide for non-developers editing copy. This file is for
whoever is writing code.

---

## Commands

**pnpm is the package manager.** Do not run `npm install` — it will create a
`package-lock.json` alongside `pnpm-lock.yaml` and the two will drift.

```bash
pnpm install
pnpm dev             # dev server; drafts are visible
pnpm build           # production build — content validation runs here
pnpm lint
pnpm typecheck
pnpm format          # prettier --write .
pnpm format:check    # verify without writing
```

`pnpm-workspace.yaml` carries `allowBuilds: unrs-resolver` — pnpm blocks
postinstall scripts by default, and that package needs one. If a new dependency
warns about a blocked build script, add it there rather than disabling the
protection globally.

**The `rtk` hook filters command output and hides build errors.** When a build
fails with a bare error count and no detail, re-run it unfiltered:

```bash
rtk proxy pnpm build > /tmp/b.log 2>&1; grep -iA8 error /tmp/b.log
```

The same hook breaks `grep` in some shells (`Failed to resolve 'rg' via PATH`),
which silently reports **zero matches for patterns that do exist**. Do not
trust a negative grep result from Bash — use the Grep tool to confirm.

## Formatting

Prettier runs with `prettier-plugin-tailwindcss`, configured in `.prettierrc`
to read `./src/app/globals.css`. That means it knows this project's custom
tokens and sorts utility classes in canonical order. Run `pnpm format` before
committing; do not hand-order class names, the plugin will rewrite them.

**The build summary line lies.** Next 16 prints something like
`2 routes (1 static, 1 dynamic)` regardless of how many pages exist. To see
what actually got prerendered:

```bash
node -e "console.log(Object.keys(require('./.next/prerender-manifest.json').routes))"
```

---

## Architecture

### There is no `app/layout.tsx`

The root layout is **`src/app/[locale]/layout.tsx`**. It renders `<html>` and
`<body>` and sets `lang` / `dir` from the locale. This is intentional — the
locale lives in the URL from day one so no published URL has to change when a
second language ships.

Two consequences that will bite you:

- **404s need `app/global-not-found.tsx`**, enabled by
  `experimental.globalNotFound` in `next.config.ts`. Next replaces the root
  `<html>` with its own error shell when the root layout sits under a dynamic
  segment, so a normal `not-found.tsx` renders with **no stylesheet and no
  `lang` attribute**. `global-not-found.tsx` must return a complete HTML
  document, including its own font imports and `globals.css`.
- **`src/proxy.ts` redirects unprefixed paths** to the default locale
  (`/services` → `/en/services`). Next 16 renamed the `middleware` convention
  to `proxy`; the exported function must be named `proxy`.

### Content pipeline

`content/**/*.mdx` → `gray-matter` → **Zod validation** → `next-mdx-remote/rsc`.

- `src/lib/content.ts` — `getCollection(name, schema)` is **generic on
  purpose**. Adding the blog is a `content/posts/` folder, a schema, and two
  route files. Do not write a posts-specific reader.
- `src/lib/schemas.ts` — one schema per collection. Validation failures fail
  the build naming the file and the field. This is deliberate: these files are
  edited by people who are not reading component code.
- Files starting with `_` and any `README` are skipped, so notes can live
  beside content.

### Data

`data/*.json` is the single source for company facts, founders, services, FAQs
and process steps. Components import from `src/lib/site.ts`, never from
`data/` directly.

**No component contains user-facing copy.** All UI strings live in
`messages/en.json` and reach components through `getMessages(locale)`. This is
the one thing that makes adding a language cheap rather than a rewrite — if you
find yourself typing a visible string into JSX, put it in the messages file.

---

## Conventions

### Tokens — no raw values in components

Every colour, size, font and spacing value is declared in
`src/app/globals.css`. Tailwind maps to them via `@theme inline`, which is what
lets the theme swap at runtime rather than build time.

Never write a hex code, a raw px value, or a `font-family` in a component.
Use `bg-sheet`, `text-ink`, `border-rule`, `font-display`, `text-lede`.

**Naming gotcha:** `--text-*` (font size) and `--color-*` both generate `text-`
utilities. `--text-metric` and `--color-metric` would collide, which is why the
font-size token is `--text-figure`. Check for collisions when adding tokens.

### Theme

Light is the launch theme. **The complete dark palette is already defined**
under `[data-theme="dark"]` in `globals.css`. Shipping dark mode means setting
that attribute on `<html>` in the layout plus a toggle component — no component
changes. Nothing currently sets it.

### RTL is on the roadmap (Urdu, Arabic)

**Use logical properties, always.** `ps-`/`pe-` not `pl-`/`pr-`, `ms-`/`me-`,
`border-s`/`border-e`, `start-0`/`end-0`, `margin-block`. Retrofitting this is
a full-CSS rewrite; doing it from the start costs nothing.

Directional glyphs need the `mirror-x` class or the `Arrow` primitive — a
literal `→` points the wrong way in RTL.

Verified working: uncommenting a locale in `src/lib/i18n.ts` and adding a
`messages/<code>.json` generates the whole tree with `dir="rtl"`.

### Motion — native CSS only

Scroll-driven animations (`animation-timeline: view()` / `scroll(root block)`)
and `@view-transition`. **Do not install GSAP, Framer Motion, or any animation
library.** JS animation is a named INP offender, and a company selling
engineering should not ship 46KB to fade in a heading. Reduced-motion is
handled globally in `globals.css`.

### Components

- `src/components/primitives/` — the drafting devices (`TitleBlock`, `Field`,
  `DimensionRule`, `NodeTrace`, `Bracketed`, `MetricTile`, `SectionHead`,
  `Cta`, `Label`, `Arrow`). Pages are composed from these; new pages should
  need no new CSS.
- `src/components/sections/` — reusable page sections (`FaqList`,
  `ProcessGrid`). If a block appears on a second page, extract it here.
- **Not everything is a card.** Border, fill and shadow each say "separate
  object". `Bracketed` (corner crop marks) exists so blocks can be separated
  without stamping a bordered box on everything.

### Optional fields are absent-by-default

This is the rule the whole content model rests on. An empty `client`,
`testimonial`, `metrics`, `links` or `cover` renders **nothing** — no empty
heading, no orphaned label, no "coming soon". `FieldRow` drops fields whose
value is empty. Preserve this when adding fields.

`client: ""` specifically means the client is not named: the title block falls
back to `clientSector` marked "name withheld".

### Data fetching

Global standard is RTK Query. On this site there is almost nothing to fetch —
everything is read from disk at build time. RTK Query is used **only** for the
contact form POST, and `StoreProvider` is mounted **only** around that form, so
the other pages ship no Redux. Keep it that way.

---

## Email

The contact form posts to `src/app/api/contact/route.ts`, which sends via
**Resend**. Everything provider-specific is in that one file; the form has no
idea what is behind `/api/contact`.

**Cloudflare cannot replace this.** The domain is on Cloudflare, but Email
Routing is inbound-only, MailChannels' free Workers sending API was terminated
in June 2024, and Cloudflare's own docs now redirect to Resend. Do not go
looking for a Cloudflare-native path — this was investigated and settled.

Without `RESEND_API_KEY` the endpoint returns 503 with an honest error rather
than pretending to send.

**The honeypot must not fail validation.** `website` accepts any string; the
route handler drops the submission and replies `200`. Rejecting it in Zod
returns a field error naming `website`, which tells a bot exactly what caught
it. This was a real bug — do not "tidy" the schema.

---

## Locked decisions

Reasoned choices with stated trade-offs. If a change would reverse one, say so
before doing it.

| Decision                          | Why                                                                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **One service page**, not three   | Three co-equal pages read as "we do everything" for a 5–10 person firm. The three lines are depths of one practice, AI automation leading.                                                 |
| **No pricing anywhere**           | The $15/hr and $200 minimum live on Upwork/Clutch where buyers expect a rate card. Publishing them contradicts the brand.                                                                  |
| **No blog at launch**             | An abandoned blog with three old posts damages credibility more than no blog. Infrastructure is ready when there is a real commitment.                                                     |
| **Cookieless analytics** (Vercel) | Chosen specifically to avoid a consent banner and a cookie policy document. Adding GA4 reintroduces both.                                                                                  |
| **Light theme at launch**         | Dark tokens defined and ready; nothing enables them yet.                                                                                                                                   |
| **Phone and address published**   | Confirmed wanted. Real contact details are a legitimacy signal directory reviewers check.                                                                                                  |
| **Logo sits on a dark plate**     | The mark is a glow drawn for black grounds; on white its strokes land within a few percent of the background and dissolve. `public/logo-flat.svg` is a placeholder for the real flat mark. |

---

## Verifying work

Type-checking and linting are not enough — several real defects this session
passed both. Build, serve, and probe:

```bash
pnpm build && pnpm start -p 3300 &
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3300/en
curl -s http://localhost:3300/en | grep -F "some expected string"
```

Lighthouse runs through the chrome-devtools MCP (`new_page`, then
`lighthouse_audit`). Current scores on `/en` and a case study, mobile:
**Accessibility 100, SEO 100, Agentic Browsing 100, Best Practices 96.**

The one expected failure is `errors-in-console`: `/_vercel/insights/script.js`
404s on localhost because those scripts only exist on Vercel's edge. Not a bug.

To confirm content validation still works, deliberately break a frontmatter
field and check the build fails naming the file — then restore it.

---

## Things that cost time this session

- **MDX has no HTML comments.** `<!-- -->` fails the build. Use `{/* */}`.
- **Removing a route leaves stale generated types** in `.next/dev/types`,
  producing confusing `TS1128` errors. `rm -rf .next` before rebuilding.
- **`react-hooks/refs`**: do not read `ref.current` during render. For a
  once-per-mount value use `useState` with a lazy initialiser.
- **`aria-label` that does not contain the visible text** fails Lighthouse's
  `label-content-name-mismatch` — a voice-control user saying what they see
  will not match. Only label an element that has no visible text.
- **`create-next-app` refuses a non-empty directory.** Scaffold into a
  subfolder and move files up.
- **Next 16 deprecated `middleware.ts`** in favour of `proxy.ts`; the codemod
  (`npx @next/codemod@canary middleware-to-proxy .`) requires a clean git tree.
  The change is just the filename and the exported function name.

---

## Outstanding before launch

- **`[JURISDICTION]` in `content/legal/en/terms.mdx`** — a business decision
  (Pakistani law vs. a jurisdiction familiar to international clients), tied to
  the shareholders' agreement. The only hard blocker.
- **`RESEND_API_KEY`** in Vercel, plus three DNS records in Cloudflare to
  verify the sending domain.
- **26 `PLACEHOLDER` markers** across `data/` and `content/` — founders, three
  FAQ answers, the process handover step, and three seeded case studies.
  `grep -r PLACEHOLDER data content public` finds them all.
- Whether the legal drafts get a lawyer's review before launch.
