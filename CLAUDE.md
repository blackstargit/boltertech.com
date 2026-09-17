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

**The `rtk` CLI proxy is removed (2026-09-16)** — it filtered command output,
hid build errors, and silently reported zero grep matches for patterns that did
exist. Run `pnpm build` and `grep` plainly. Do not re-introduce it.

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

### Theme — bands are theme scopes

`<html>` carries `data-theme="dark"`; any section can carry
`data-theme="light"` to flip the ground beneath it. Both token blocks in
`globals.css` are complete and both are live. The `Band` primitive sets the
attribute, so a page alternates dark and bone by passing `tone`.

**Colour is inherited as a computed value, not as the `var()` that produced
it.** `body { color: var(--ink) }` resolves once and every descendant
inherits that literal colour, whatever `--ink` means further down the tree.
That is why `globals.css` re-declares `color` on `[data-theme]` — without it
a light band paints dark-theme ink on bone paper at 1.12:1. If you add an
inherited colour property (`caret-color`, say), declare it there too.

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

- `src/components/primitives/` — `Band` (the only structural container),
  `PageHero`, `Field`/`FieldRow`, `SectionHead`, `Cta`, `Chip`/`ChipRow`,
  `MetricTile`/`MetricRow`/`SeriesChart`, `Placeholder`, `Label`, `PulseDot`,
  `Arrow`, `Prose`. Pages are composed from these; new pages should need no
  new CSS. (`TitleBlock`, `DimensionRule`, `NodeTrace` and `Bracketed` were
  the pre-redesign drafting devices and are gone.)

- `src/components/sections/` — reusable page sections (`FaqList`,
  `ProcessGrid`, `OutcomeTabs`, `WorkTable`, `CtaBand`, `Ticker`). If a block
  appears on a second page, extract it here.
- **Not everything is a card.** Border, fill and shadow each say "separate
  object". Prefer a band change or a hairline grid (`gap-px` over a
  rule-coloured ground) to stamping a bordered box on everything.

**Spacing and size are props, never `className` overrides.** Tailwind orders
utilities by value, not by their position in the class string, so a `px-5`
passed in as an override loses to a `px-6` baked into the component and
silently does nothing — no error, no warning. `Cta` takes `size`,
`SectionHead` takes `spacing`, `Band` takes `flush`/`joinNext`, `Placeholder`
takes `pad`. Add a prop rather than passing a smaller utility and hoping.

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

| Decision                                          | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **One service page**, not separate pages per line | Co-equal pages read as "we do everything" for a 5–10 person firm. The five lines (AI, Automation, Software development, Data analytics, Cyber security) are depths of one practice, AI leading. Split from AI automation into AI + Automation 2026-09-07 on request. Cyber security added 2026-09-15 on request, with six existing case studies (`bolter-siem`, `cortex-strike`, `cyber-complaint-dashboard`, `cyber-threat-intelligence`, `pknvd`, `website-analysis-dashboard`) recategorised from their prior `category` into it. |
| **No fixed rates; indicative ranges only** (2026-09-09) | The $15/hr and $200 minimum still stay off the site — a published rate card contradicts the brand. Amended on request: `/estimate` computes an **indicative range** from `data/estimator.json` (all weights placeholder until launch), captioned "not a quote", and posts the breakdown through the existing `/api/contact` endpoint as a pre-scoped lead. Entry points: a secondary CTA in `CtaBand`, a callout on `/contact`, and a CSS-only sticky launcher on the homepage (`EstimateLauncher`, server-rendered so the homepage still ships zero JS). The range renders in `--ink`, not `--accent` — amber stays reserved for measured figures. |
| **No blog at launch**                             | An abandoned blog with three old posts damages credibility more than no blog. Infrastructure is ready when there is a real commitment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **GA4 added, gated behind consent** (2026-09-07)  | Reversed on request. Vercel Analytics stays for baseline cookieless numbers; GA4's `gtag.js` only loads after `ConsentBanner` (`src/components/analytics/ConsentBanner.tsx`) gets an accept, tracked in `localStorage`, not a cookie, so declining sets nothing. `content/legal/en/privacy.mdx` documents this. Measurement ID is `NEXT_PUBLIC_GA_MEASUREMENT_ID` — unset in preview/local keeps that traffic out of GA. **Verified live in production 2026-09-07**: `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in Vercel, accept flow confirmed sending real hits (`google-analytics.com/g/collect` returns 204), traffic showing in GA4 Realtime. Key events `qualify_lead` and `close_convert_lead` still need wiring in the GA4 UI — see `TODO.md`. |
| **Dark-first, alternating bands** (2026-09-08)    | Reverses "light theme at launch" on request, implementing the approved Claude Design mockup (`documentation/claude-design/design_0/`). Near-black ground with warm bone (`#f3f1ed`) bands; amber accent replaces the cyanotype cyan; Space Grotesk / IBM Plex Sans / IBM Plex Mono replace Chivo / Plex Sans / Martian Mono; radii replace the deliberate zero. The amber inverts per band — `#e8a33d` on dark, `#8f5d0a` on bone, because the bright value measures 2.2:1 there. `--on-accent` inverts with it. |
| **Phone and address published**                   | Confirmed wanted. Real contact details are a legitimacy signal directory reviewers check.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Logo sits on the page ground**                  | Reversed 2026-09-07 on request: the dark plate behind the header mark is gone. `public/logo-mark.png` is transparent and used as-is. Watch the near-white stroke interiors on light backgrounds; `public/logo-flat.svg` is still a placeholder for a real flat mark.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

---

## Verifying work

**Don't reach for the browser (Chrome DevTools MCP, screenshots, resizing
viewports) to verify small or low-risk changes** — a spacing tweak, a class
change, a copy edit — unless the user explicitly asks for that verification.
Reserve it for larger UI/feature work where visual regression is a real risk.

Type-checking and linting are not enough — several real defects this session
passed both. Build, serve, and probe:

```bash
pnpm build && pnpm start -p 3300 &
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3300/en
curl -s http://localhost:3300/en | grep -F "some expected string"
```

Lighthouse runs through the chrome-devtools MCP (`new_page`, then
`lighthouse_audit`). Verified 2026-09-08 on `/en`, `/en/services`,
`/en/about`, `/en/contact` and a case study, mobile:
**Accessibility 100, SEO 100, Agentic Browsing 100, Best Practices 96.**

**Restart the server on a fresh build before auditing.** `pnpm start` fails
with `EADDRINUSE` if the previous one is still up, and the stale process
keeps serving — which produces phantom 500s and layout failures that are not
in the build you just made. Kill it by PID first:
`netstat -ano | grep ':3300.*LISTENING'`, then `taskkill //PID <pid> //F`.

The one expected failure is `errors-in-console`: `/_vercel/insights/script.js`
404s on localhost because those scripts only exist on Vercel's edge. Not a bug.

To confirm content validation still works, deliberately break a frontmatter
field and check the build fails naming the file — then restore it.

---

## Things that cost time this session

- **Tailwind orders utilities by value, not by class-string position.** A
  `px-5` passed to a component that hardcodes `px-6` loses, silently. Four
  such overrides shipped before anyone noticed. See "Spacing and size are
  props" above; check the built CSS with
  `grep -o '\.px-5\|\.px-6' .next/static/chunks/*.css` if in doubt.
- **Inherited colour does not re-resolve across a theme scope.** `color`
  inherits as a computed value, so a nested `[data-theme]` needs `color`
  re-declared on it or it paints the parent theme's ink. Cost a 1.12:1
  contrast failure across every bone band.
- **A stale `pnpm start` keeps serving after `EADDRINUSE`.** The failed
  restart is easy to miss, and the old process serves a build whose chunks
  no longer exist — phantom 500s and layout failures that are not real.
  Always kill by PID and confirm the port is free.
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
- **10 `PLACEHOLDER` markers** left in `data/` — founders, three FAQ answers,
  and the process handover step. `grep -r PLACEHOLDER data content public`
  finds them all. (`content/projects/` is clear: the four seed case studies
  were replaced by eleven real ones on 2026-09-07, sourced from
  `documentation/projects/`.)
- **Case-study screenshots.** Every project has an empty
  `public/work/<slug>/` folder; `cover` is `""` on all eleven, so no image
  renders until one is dropped in and the field is set.
- Whether the legal drafts get a lawyer's review before launch.
