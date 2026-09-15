<!--
FOR REVIEW — not yet verified, confirm before publishing:
- Client name left blank / withheld — client permission not confirmed. Sector set to "Cybersecurity & Defense".
- Testimonial left blank — no confirmed client permission.
- "80+ threat feeds" and "50,000+ IOCs/day" are documented pipeline capacity and feed integration specs from the platform architecture.
- Duration ("8 months"), Year (2025), Status ("Delivered"), Featured ("yes"), and Priority order ("1" / Top) set as specified.
-->

### Project: cyber-threat-intelligence

**Title**: Enterprise Cyber Threat Intelligence & Adversary Tracking Platform

**Client name**:

**Client sector**: Cybersecurity & Defense

**Category**: ai-automation, data-analytics

**One-sentence summary**: Bolter Technologies built an automated threat intelligence platform that ingests 80+ global feeds, scores and correlates 50,000+ indicators daily, and maps active campaigns to MITRE ATT&CK tactics in an interactive 3D command center.

**Tech stack**: Python 3.12, FastAPI, PostgreSQL, SQLAlchemy, React 19, Vite, Tailwind CSS, WebGL, Three.js, Lucide Icons, Docker, STIX/TAXII

**Duration**: 8 months

**Year**: 2025

**Status**: Delivered

**Featured?**: yes

**Priority order**: 1

**Metrics**:

- value: "80+" / label: "automated global OSINT and commercial threat intelligence feeds ingested"
- value: "50,000+" / label: "indicators of compromise (IOCs) normalized and scored daily"
- value: "3D WebGL" / label: "interactive geospatial command center for real-time adversary tracking"

**Links**: _(omitted — live cyber intelligence tooling, no public demo safe to publish)_

**Testimonial**: _(blank)_

**Cover image**: _(blank)_

---

### Body content

**The problem**

Enterprise Security Operations Centers (SOCs) and threat hunting teams are inundated with disconnected feeds of IP addresses, domain names, file hashes, and malware signatures. Manually pulling from dozens of open-source and proprietary threat lists leaves analysts drowning in false positives and stale data, with no automated way to connect an isolated malicious IP to an active threat actor campaign, a known malware family, or the MITRE ATT&CK techniques being leveraged. Correlating indicators across disjointed spreadsheets and threat portals wastes critical response time while high-risk threats slip through undetected.

**Approach**

We built a unified Cyber Threat Intelligence (CTI) platform with an automated ingestion and normalization pipeline capable of processing over 80 global OSINT, STIX/TAXII, and commercial intelligence feeds. The backend uses FastAPI and PostgreSQL with JSONB schema flexibility to continuously deduplicate, cross-reference, and calculate composite risk scores across indicators based on feed reliability, threat recency, and historical attribution.

The system automatically tags indicators with threat actor profiles (APT groups, malware strains) and maps observed behaviors directly to the MITRE ATT&CK matrix. On the frontend, a high-performance React application features an interactive 3D WebGL geospatial threat globe, real-time indicator filtering, and deep-dive entity correlation views that let analysts pivot from a single IP to an entire adversary infrastructure in seconds.

**Outcome**

The platform transformed raw, noisy threat feeds into an organized, actionable intelligence hub for security operations. Analysts replaced hours of manual indicator cross-referencing with automated risk scoring and instant campaign context, cutting triage time dramatically. Security teams gain immediate visibility into global adversary activity, high-risk emerging indicators, and relevant defense countermeasures through a centralized, high-density command center.
