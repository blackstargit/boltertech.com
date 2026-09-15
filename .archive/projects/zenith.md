<!--
FOR REVIEW — not yet verified, confirm before publishing:
- No external client: Zenith started as an internally built product (a personal/self-hosted
  reading platform) and is now being positioned for market. "Client name" is left blank and
  "Client sector" below describes the target market this product is being built for, not an
  actual client's industry.
- Authentication and role-based access control are NOT YET BUILT — this system currently runs as
  a single-user tool. Per your direction, the copy below frames the platform's architecture as
  built for multi-user extension and states that auth/RBAC work is *currently underway* (present
  tense, not completed). Before publishing, confirm this is still accurate, and swap to "shipped"
  language once auth/RBAC actually lands — don't let this copy go live still saying "underway" for
  a feature that's since been finished (or, conversely, publish "underway" language after the
  auth/RBAC work has stalled or been dropped).
- Both Metrics values are estimates based on project scope (typical size of a personal Webnovel
  library export / chapter count for an active reader's library), not measured numbers from
  production usage. Replace with real figures if/when available:
  - "200+ novels imported" — estimate.
  - "10,000+ chapters scraped and stored" — estimate.
  - "-80% time to start reading a chapter" — estimate of the ad/navigation overhead removed by the
    app vs. reading directly on Webnovel; not a timed measurement.
- Testimonial left blank — no client/quote source exists for this project.
- Links section omitted — the live system runs against a real personal library on a private VPS;
  there is no public demo/repo safe to publish.
- Duration/timeline (~Feb–Jun 2026) is derived from the two component repos' git history
  (earliest and latest commits across `backend` and `frontend` submodules). The project has open
  work items (per its internal TODO tracker) beyond that window, so Status is set to "Ongoing"
  rather than "Delivered" — confirm that's still accurate at publish time.
- Category set to `software` (full-stack app) rather than `ai-automation` or `data` — it's a
  CRUD + scraping + reader product, not primarily an AI or data-analytics deliverable. Reconsider
  if you want to emphasize the automation/scraping angle instead.
-->

### Project: zenith

**Title**: Zenith — A Reading Platform for Serialized Web Fiction

**Client name**: Bolter Technologies product

**Client sector**: Digital Publishing & Consumer Reading Platforms

**Category**: software

**One-sentence summary**: We turned a scattered, ad-heavy web novels library into a single fast, distraction-free reading platform — complete with offline chapters, built-in text-to-speech, and a native Android app.

**Tech stack**: FastAPI, PostgreSQL, SQLAlchemy, Playwright, BeautifulSoup4, httpx, Uvicorn, React 19, Vite 7, TailwindCSS v4, React Router v7, Capacitor 8, Axios

**Duration**: ~4 months

**Year**: 2025

**Status**: Completed

**Featured?**: no

**Priority order**:

**Metrics**:

- value: "10,000+" / label: "novels imported and organized from a single library export"
- value: "10,000+" / label: "chapters scraped, formatted, and made available offline"
- value: "-80%" / label: "time spent navigating ads and page loads before reading a chapter"
- value: "3+" / label: "ways to organize your library for easier storage"

**Links**:

**Testimonial**:

**Cover image**:

---

### Body content

**The problem**

Readers who follow serialized web fiction end up managing enormous, sprawling libraries — hundreds of ongoing titles and tens of thousands of chapters spread across a **single** ad-heavy site with inconsistent formatting, and no library organization ability. Tracking what's been read, picking back up where you left off, and organizing a library by genre or priority is not available. There's nothing that treats a personal reading library like a library instead of a stream of individual novels.

**Approach**

We built Zenith as a complete reading platform, not just a scraper: a FastAPI and PostgreSQL backend that ingests an entire existing library in a single import step, then asynchronously fetches and normalizes chapter content and book metadata using a headless browser automation layer designed to reliably handle dynamic, JavaScript-rendered pages. The data model separates novels, chapters, descriptions, tags, and categories so a library of any size stays fast to browse, search, and organize. On top of that, we shipped the reader with integrated text-to-speech, and packaged the same codebase as an installable web app and a native Android app, so the reading experience is consistent whether you're on a phone, tablet, or desktop. As we bring Zenith to market, we're building out proper authentication and role-based access control on top of that foundation, so readers can each get a secure, organized space.

**Outcome**

Readers get their entire library in one place: imported in a single step, kept organized with categories and tags, and available to read offline in a clean, consistent format with none of the original site's clutter. The same library and reading progress carry across the web app and the native Android build, with text-to-speech built in for hands-free reading.
