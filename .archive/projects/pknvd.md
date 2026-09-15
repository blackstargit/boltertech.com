<!--
FOR REVIEW — not yet verified, confirm before publishing:
- Client name left blank / withheld — client permission not confirmed. Sector set to "Public Sector & Cybersecurity".
- Testimonial left blank — no confirmed client permission.
- "200,000+ CVE records" and "< 50ms query response time" reflect tested database scale and index optimization benchmarks.
- "100% automated weaponization tracking" refers to automated cross-referencing with CISA KEV and public exploit feeds.
- Duration ("9 Weeks"), Year (2026), Status ("Delivered"), Featured ("no"), and Priority order ("6" / Low) set as specified.
-->

### Project: pknvd

**Title**: PKNVD — National Cyber Vulnerability Database & Intelligence Platform

**Client name**:

**Client sector**: Public Sector & Cybersecurity

**Category**: data-analytics

**One-sentence summary**: Bolter Technologies built a high-performance cyber vulnerability intelligence platform that unifies 200,000+ CVE records with live exploit registries and delivers sub-50ms search and triage for security analysts.

**Tech stack**: React 19, Vite, Tailwind CSS, Recharts, Python 3.12, FastAPI, PostgreSQL (Async psycopg-pool), NIST NVD 2.0 API, CISA KEV, Vulners API, Docker

**Duration**: 9 Weeks

**Year**: 2026

**Status**: Delivered

**Featured?**: no

**Priority order**: 6

**Metrics**:

- value: "200,000+" / label: "global CVE records indexed and cross-referenced with exploit registries"
- value: "< 50ms" / label: "multi-facet query response time across full vulnerability catalog"
- value: "100%" / label: "automated weaponization tracking across CISA KEV and public exploit sources"

**Links**: _(omitted — national security data infrastructure, no public demo safe to publish)_

**Testimonial**: _(blank)_

**Cover image**: _(blank)_

---

### Body content

**The problem**

Security teams and national CERTs are overwhelmed by thousands of Common Vulnerabilities and Exposures (CVEs) published each month. Relying solely on base CVSS severity scores leaves analysts in the dark: a theoretical CVSS 9.8 flaw with no known exploit often monopolizes emergency patching cycles while an actively weaponized CVSS 7.5 vulnerability is overlooked. Disconnected feeds across NIST NVD, CISA Known Exploited Vulnerabilities (KEV), and exploit repositories forced analysts to cross-reference data by hand, slowing response times and leaving critical infrastructure exposed to live exploits.

**Approach**

We architected PKNVD as a unified, high-throughput vulnerability intelligence database and triage platform. The backend uses FastAPI and asynchronous PostgreSQL connection pooling (`psycopg-pool`) to ingest, parse, and synchronize global feeds from NIST NVD 2.0, CISA KEV, and active exploit databases. We designed optimized composite and GIN database indexes to power sub-50ms filtering across CVE IDs, CVSS v2/v3/v4 metrics, Common Platform Enumerations (CPE), and weaponization flags.

On the frontend, a React 19 single-page application provides a high-density triage dashboard with multi-facet filters, real-time severity distribution analytics via Recharts, and automated vulnerability advisory generation.

**Outcome**

Delivered a centralized vulnerability intelligence platform that enables security teams to instantly isolate critical vulnerabilities with active, public exploit code. Analysts replaced hours of manual multi-tab research with single-click triage and contextual severity scoring, significantly accelerating patch prioritization and threat response across national and enterprise environments.
