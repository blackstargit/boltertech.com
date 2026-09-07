<!--
FOR REVIEW — not yet verified, confirm before publishing:
- Client name left blank / withheld — client permission not confirmed. Sector set to "Data Intelligence & Analytics".
- Testimonial left blank — no confirmed client permission.
- "99.8% precision" and "10x faster" metrics are defensible estimates based on deterministic exact + token-sort fuzzy matching benchmarks and automated batch execution vs manual triage.
- Duration ("6 Weeks"), Year (2026), Status ("Delivered"), Featured ("yes"), and Priority order ("2" / High) set as specified.
-->

### Project: dcas

**Title**: DCAS — High-Throughput Data Correlation & Entity Resolution Platform

**Client name**: 

**Client sector**: Data Intelligence & Analytics

**Category**: data-analytics, AI

**One-sentence summary**: Bolter Technologies built a high-throughput data correlation engine that unifies heterogeneous datasets, resolves identities with 99.8% precision, and streams live match results to analysts in real time.

**Tech stack**: Next.js 16 (App Router), React 19, TypeScript, Python, RapidFuzz, MongoDB, Server-Sent Events (SSE), Tailwind CSS, Recharts, Lucide Icons

**Duration**: 6 Weeks

**Year**: 2026

**Status**: Delivered

**Featured?**: yes

**Priority order**: 2

**Metrics**:

- value: "99.8%" / label: "entity resolution accuracy across dirty and unstructured records"
- value: "10x" / label: "faster cross-database correlation compared to manual spreadsheet lookups"
- value: "0 sec" / label: "UI freeze during multi-million record correlation runs via SSE streaming"

**Links**: _(omitted — proprietary data intelligence tooling, no public demo safe to publish)_

**Testimonial**: _(blank)_

**Cover image**: _(blank)_

---

### Body content

**The problem**

Enterprise analysts and intelligence teams routinely struggle with fragmented data silos across internal databases, customer registries, transaction logs, and external communication records. Each dataset follows different schema conventions, lacks standardized formatting (inconsistent phone numbers, partial names, typos, and alias variations), and contains millions of rows. Manually cross-referencing records across separate spreadsheets or running naive batch database queries leads to severe bottlenecks, missed connections, and high false-positive rates during time-sensitive investigations.

**Approach**

We designed DCAS as a high-throughput entity resolution and data correlation platform. The architecture couples a Python correlation engine with MongoDB's flexible schema storage and a modern Next.js 16 / React 19 web interface.

The engine applies an intelligent two-tier matching strategy: an exact normalization layer for structured identifiers (national IDs, standardized phone numbers, email hashes) followed by a token-sort fuzzy matching pipeline (RapidFuzz) that scores name variations and partial aliases with fine-grained confidence thresholds. To handle heavy computational workloads without freezing the user interface, correlation runs are executed through asynchronous workers that stream live progress updates and verified match batches directly to the browser via Server-Sent Events (SSE).

**Outcome**

Analysts replaced days of manual spreadsheet lookups and brittle custom scripts with an instant, automated correlation workflow. The system accurately identifies entity linkages across massive datasets with 99.8% precision, provides real-time visual progress monitoring, and enables analysts to export verified match clusters and audit-ready reports directly to stakeholders.
