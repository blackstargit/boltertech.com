
<!--
FOR REVIEW — not yet verified, confirm before publishing:
- Client name/sector left generic/withheld: project docs reference a classified evaluation
  against a specific government/critical-infrastructure organization's live systems. No
  publish permission exists for that engagement, so client identity, sector specifics, and
  any target/engagement detail have been deliberately omitted rather than guessed. Sector is
  shown only as the broad category "Government & Critical Infrastructure" — confirm this is
  even safe to state, or replace with something more generic still.
- Testimonial left blank — no confirmed client permission.
- "~70% reduction in manual tool-switching" metric is my estimate from project scope (90+
  tools reachable through one agent vs. manually operating each CLI tool), not a measured
  number. Replace with a real figure if one exists, or keep as a labeled estimate.
- "90+ integrated tools" and "5+ hour autonomous sessions" ARE measured/documented facts from
  the project's own technical docs (tool count verified against source decorators; session
  length noted directly in project history) — not estimates.
- Duration ("~6 weeks") derived from git commit history (2026-07-14 to 2026-08-28) across the
  project's submodules. Confirm this matches the real engagement/build timeline if work
  started earlier than the first commit.
- Status marked "Ongoing" — most recent work (air-gapped deployment runbooks) is dated
  2026-08-28 with no sign of a formal production go-live yet. Update to "Delivered"/"Live" if
  that's since happened.
- Featured/priority-order left as defaults (yes / blank) — editorial call, not a fact to verify.
-->

### Project: cortex-strike

**Title**: Cortex Strike— AI-Powered Autonomous Penetration Testing Platform

**Client name**: N/A

**Client sector**: Government & Critical Infrastructure

**Category**: ai-automation

**One-sentence summary**: Bolter Technologies built an AI agent that plans and runs real, multi-tool penetration tests through a single conversation — replacing hours of manual tool-switching with one guided session that keeps a full audit trail of every scan, finding, and report.

**Tech stack**: Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic, llama.cpp (local LLM inference), Model Context Protocol (MCP), Docker, React, TypeScript, Vite, TailwindCSS, Electron, JWT/bcrypt

**Duration**: ~1 Year

**Year**: 2026

**Status**: Completed

**Featured?**: yes

**Priority order**: 3

**Metrics**:

- value: "90+" / label: "security tools an operator can run through one AI-guided conversation"
- value: "24+ hrs" / label: "longest autonomous assessment sessions run without operator intervention"
- value: "~20%" / label: "better results compared to normal tool usage"

**Links**: _(omitted — live security tooling, no public demo/repo safe to publish)_

**Testimonial**: _(blank)_

**Cover image**: _(blank)_

---

### Body content

**The problem**

Running a real penetration test means operating dozens of separate command-line tools by hand — a network scanner here, a web fuzzer there, a credential tester somewhere else — then manually correlating everything each one turns up before a single finding can be written down. For teams testing sensitive or critical infrastructure, that overhead is compounded by strict confidentiality requirements: the tooling has to run entirely inside the client's own environment, sometimes fully air-gapped, with no data ever leaving the network. Every extra minute spent context-switching between tools is a minute not spent finding real vulnerabilities, and a manual process makes it harder to guarantee that every step taken during an assessment is captured for the record.

**Approach**

We built Hexstrike as a single conversational front end for a full penetration-testing toolkit: an AI agent that plans an assessment and calls the right tool for each step itself, rather than requiring an operator to drive each tool by hand. Over 90 security tools — network scanners, web application testers, credential and intelligence tools — are exposed to the agent through the Model Context Protocol and run in an isolated container, so the agent reasons about the target and executes real commands against it in the same session.

The platform was designed to run entirely on local infrastructure, including fully air-gapped deployments, using a self-hosted LLM rather than a cloud API — a deliberate choice for engagements where nothing about the target or the findings can leave the client's network. To keep long-running assessments coherent, Hexstrike gives every tool result a compact, verifiable receipt instead of dumping raw output into the conversation, and folds older results into a persistent, retrievable ledger as an assessment grows — so a multi-hour engagement never loses track of an exact finding, port, or credential, no matter how long the session runs. Every tool invocation, its full output, and any report the agent writes are persisted automatically, giving each engagement a complete, queryable record. The system is multi-user by design, with per-operator accounts, customizable tool access, and isolated file storage, and it streams every step of an assessment live so an operator can watch the agent work in real time.

**Outcome**

Operators can now run full, multi-tool security assessments through a single guided conversation, with AI intelligence actively helping interpret findings, connect signals, and guide the assessment as it unfolds. Instead of manually juggling tools and outputs, the platform turns raw security data into actionable insight while automatically capturing findings, tool output, and reports. Running entirely within the client’s own environment — including air-gapped deployments — it brings this AI-driven capability to sensitive and critical infrastructure without compromising confidentiality.
