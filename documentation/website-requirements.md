# Bolter Technologies — Company Website Requirements

_Compiled Aug 2026 — verified against current web development, legal, and SEO/AEO guidance_

## 0. Framing — this is different from the other 13 documents

Every platform so far had a form to fill in with defined fields. The website has no form — you're defining the fields yourselves. This document is organized as: **infrastructure → site structure/pages → per-page content data → legal → technical/SEO → open decisions.** Where something was already flagged as a gap in the master consolidation document, it's addressed here directly.

---

## 1. Infrastructure Prerequisites (do these first — they block everything else)

- [x] **Domain name** — register under the final confirmed company name; this single decision also unblocks LinkedIn Page creation and the business email requirement flagged across nearly every other platform document
- [x] **Business email** on that domain (e.g., hello@boltertechnologies.com, contact@boltertechnologies.com) — needed for LinkedIn, and for a credible "Contact" page
- [x] **Hosting provider** — decide based on your stack (see Section 5)
- [x] **SSL certificate** — non-negotiable in 2026; most hosts include this by default, but confirm rather than assume
- [x] Decision: build in-house (React/Next.js, etc.) vs. a managed platform (Webflow, WordPress) — this affects almost every downstream technical decision, worth resolving before any content work starts

## 2. Site Structure — pages needed

Based on current guidance for professional-services/agency sites, the standard structure that balances SEO crawlability with a "flat enough to demonstrate expertise" hierarchy:

- [ ] **Home** — value proposition, service overview, featured projects, primary CTA
- [ ] **Services** (likely three sub-pages or filterable sections matching your three lines: Software Development, AI Automation, Data Analytics) — current guidance for professional-services sites specifically warns against a flat, undifferentiated site; a pillar page per service area with supporting content clustered underneath performs better for both traditional SEO and the newer "AI answer engine" visibility (see Section 6)
- [ ] **Portfolio / Case Studies** — this is your stated centerpiece; needs its own section, not a subsection of "About"
- [ ] **About / Team** — company narrative + individual founder bios (this is the one place with no character limit, unlike every other platform)
- [ ] **Blog / Insights** (optional but recommended — connects to your Medium content strategy; content can be cross-posted or written natively here first)
- [ ] **Contact** — form, not just a listed email (flagged as a gap in the master document; every directory platform only needed an email/phone, but the website needs an actual intake mechanism)
- [ ] **Careers** (optional — add once you're hiring; not needed at launch)
- [ ] Legal pages — see Section 7 (separate documents, not folded into other pages)

## 3. Per-Page Content Data

### Home

- [ ] Headline value proposition (one sentence, specific — not generic "we build software")
- [ ] 3–5 featured project highlights with visuals (pull from your Portfolio dataset — see master document Section 4)
- [ ] Service line summary with links to full Service pages
- [ ] Trust signals — client logos (if permitted), review/rating badges from Clutch/GoodFirms once those are live (both platforms explicitly support embeddable widgets for this)
- [ ] Primary call-to-action (likely "Start a project" → Contact form)

### Services (per service line)

- [ ] What the service includes
- [ ] Typical engagement process/timeline
- [ ] Relevant case studies linked from this page specifically (not just the general portfolio)
- [ ] Technologies/tools used
- [ ] FAQ section — current SEO/AEO guidance specifically calls out FAQPage schema as one of the highest-value additions for surfacing in AI-generated answers (ChatGPT, Perplexity, Google AI Overviews), which is directly relevant given your AI-automation positioning

### Portfolio / Case Studies

- [ ] Full project write-ups using the same data structure defined in the master document (title, brief, approach, outcome, visuals, category tag)
- [ ] Filterable by service category
- [ ] This is the highest-value page on the entire site given your stated strategy — worth allocating the most content-production time here relative to other pages

### About / Team

- [ ] Company origin/founding story
- [ ] Mission/values (optional but common)
- [ ] Individual founder profiles — photo, bio, role, and (worth considering) a direct link to each founder's LinkedIn personal profile, since that's where the actual engagement is happening per the LinkedIn research
- [ ] Company milestones, if any exist yet

### Contact

- [ ] Contact form (name, email, project type dropdown, message field, budget range optional)
- [ ] Direct business email as a fallback
- [ ] Response-time expectation stated (builds trust, costs nothing)
- [ ] Social/platform links (LinkedIn, GitHub if pursued, Clutch/GoodFirms profiles once live)

## 4. Legal Pages — genuinely required, not optional

Current guidance is consistent across multiple current sources: **a privacy policy is effectively mandatory for any site collecting data via a contact form, analytics, or cookies** — which yours will. Terms of Service is not universally legally mandated but is standard practice and protects the business.

- [ ] **Privacy Policy** — must disclose what data is collected, why, how it's used, who it's shared with, and how users can exercise rights. Since you'll likely have EU clients (consistent with the Fiverr DSA compliance requirement already flagged in the master document), drafting this to GDPR standard from the start is the more defensible default rather than a bare-minimum version, even though Pakistan's own data protection law is still in draft/bill form and not yet enacted as of this research — worth treating this as "meet the stricter standard you're likely to actually face" rather than the local minimum
- [ ] **Terms of Service** — acceptance of terms, intellectual property rights, liability limitations, dispute resolution, governing law (worth deciding explicitly whether this is Pakistani law, given your SECP registration, or a jurisdiction more familiar to international clients — this is a real decision, not a formality, and may be worth a brief conversation with whoever finalizes your SHA)
- [ ] **Cookie Policy/Consent** — separate from the privacy policy per current guidance (regulators expect distinct documents); needs a functioning consent banner if you use analytics/cookies, which you almost certainly will

**Open flag worth stating plainly:** none of these should be treated as boilerplate copy-paste. A generated template is a reasonable starting draft, but given you're already being careful about legal exposure in the SHA (per your existing work on the equity-stripping/oppression risk), it's worth having these reviewed rather than assuming a free generator's output is sufficient — this is a genuine legal question, not just a data-gathering one, and outside what I can resolve with confidence here.

## 5. Technical / Performance Requirements

Current 2026 guidance converges on a consistent set of baseline standards:

- [ ] Mobile-first design — over 60% of traffic is mobile, and Google indexes the mobile version first; a site that works on desktop but breaks on mobile is actively penalized in rankings
- [ ] Core Web Vitals targets — specifically Largest Contentful Paint (LCP), Interaction to Next Paint (INP — replaced First Input Delay as the standard metric), and Cumulative Layout Shift (CLS); these are direct Google ranking inputs, not just nice-to-haves
- [ ] Semantic HTML structure — proper heading hierarchy, correct use of nav/button/article tags — improves both accessibility and how search/AI systems parse your content
- [ ] Accessibility baseline (WCAG 2.2) — keyboard navigability, 4.5:1 minimum color contrast for body text, ARIA labels on dynamic elements
- [ ] All critical content crawlable — no key text hidden behind JavaScript that search engines can't render

## 6. SEO / AEO (Answer Engine Optimization) — worth taking seriously given your niche

Current guidance flags a real shift: AI tools (ChatGPT, Perplexity, Google AI Overviews) now sit between users and search results, and sites without structured data are losing significant click share to competitors who have it. Given your AI-automation focus, being well-optimized here is also a credibility signal in itself.

- [ ] Schema markup (JSON-LD) — specifically:
  - **Organization schema** on the homepage
  - **Article schema** on blog posts (author, date published/modified)
  - **FAQPage schema** on Service pages
  - **BreadcrumbList schema** site-wide for navigation clarity to both search engines and AI crawlers
- [ ] Keyword mapping per page — H1 tags, body content, and meta descriptions aligned to what prospective clients actually search for in your three service areas
- [ ] Meta titles/descriptions for every page (not just homepage)
- [ ] XML sitemap submitted to Google Search Console
- [ ] Content clustering — pillar pages (your three service lines) linking out to and being linked from supporting content (case studies, blog posts) — current guidance specifically recommends this structure for professional-services sites over a flat page list

## 7. Analytics & Tracking Setup

- [ ] Google Analytics (or equivalent) — note this triggers the cookie consent requirement in Section 4
- [ ] Google Search Console
- [ ] UTM parameter convention — useful given you'll be linking to the website from ~13 other platforms; worth a simple naming convention now so you can later tell which platform (Clutch vs. LinkedIn vs. GoodFirms) is actually driving traffic

## 8. Visual/Brand Assets Needed

Cross-referenced from the master document — nothing new here, just confirming the website is what actually requires the brand guidelines gap flagged there:

- [ ] Finalized logo (multiple formats)
- [ ] **Color palette / brand guidelines** — this is the one asset no platform required but the website absolutely needs, since it touches every page rather than a single profile field
- [ ] Typography choices
- [ ] Photography/imagery style (stock vs. custom, illustration style if used)

## Open Questions to Resolve Internally

- Build approach: in-house custom build vs. managed platform (Webflow/WordPress) — affects timeline, cost, and who on the team owns maintenance
- Governing law/jurisdiction for Terms of Service — worth aligning with whoever is finalizing the SHA, since both touch legal exposure
- Whether to have legal pages professionally reviewed rather than generator-drafted, given the stricter GDPR-standard approach recommended above
- Content production plan for the Portfolio section specifically — this connects directly back to the still-open decision in the master document about seeding with sample/spec projects vs. waiting for real completed work
- Blog/Insights: native to the site, cross-posted from Medium, or skipped entirely at launch and added later
