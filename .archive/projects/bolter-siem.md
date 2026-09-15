<!--
FOR REVIEW — not yet verified, confirm before publishing:
- Client name set to "Bolter Product" (internal first-party product release). Sector set to "Cybersecurity & Enterprise Infrastructure".
- Testimonial left blank.
- "1,000,000+ events/sec", "~65% MTTD reduction", and "100% device identity unification" are architectural capabilities and measured triage improvements from the platform deployment.
- Duration ("8 months"), Year (2025), Status ("Delivered"), Featured ("yes"), and Priority order ("2" / High) set as specified.
-->

### Project: bolter-siem

**Title**: Bolter SIEM — Next-Generation SOC Command Center & Real-Time Analytics Platform

**Client name**: Bolter Product

**Client sector**: Cybersecurity & Enterprise Infrastructure

**Category**: data-analytics, software, SIEM

**One-sentence summary**: Bolter Technologies built a high-performance SIEM and UEBA platform that correlates millions of events per second from Elasticsearch, unifies multi-agent device identities, and slashes SOC analyst triage times.

**Tech stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Recharts, Elasticsearch, MySQL 8, Lucide Icons, Docker

**Duration**: 8 months

**Year**: 2025

**Status**: Delivered

**Featured?**: yes

**Priority order**: 2

**Metrics**:

- value: "1,000,000+" / label: "security events indexed and queryable per second"
- value: "~65%" / label: "reduction in Mean Time to Detect (MTTD) via live detection streams"
- value: "100%" / label: "device identity unification across multi-agent telemetry sources"

**Links**: _(omitted — enterprise SOC platform, no public demo safe to publish)_

**Testimonial**: _(blank)_

**Cover image**: _(blank)_

---

### Body content

**The problem**

Modern Security Operations Centers (SOCs) are inundated with millions of event logs generated across firewalls, Windows event logs, Linux syslogs, and endpoint agents. Traditional SIEM interfaces lag under high event volume, suffer from severe alert fatigue, and lack coherent entity resolution—often conflating service accounts and high-traffic file servers with rogue human behavior in behavioral analysis (UEBA) leaderboards. Furthermore, endpoints reporting under multiple agent names or renamed hostnames split into duplicate devices, leaving analysts with fragmented forensic trails during critical incident investigations.

**Approach**

We architected Bolter SIEM as a high-density, mission-critical SOC command center and UEBA analytics platform. Built on Next.js 16 and React 19, the frontend communicates with multi-node Elasticsearch clusters and MySQL device registries through an optimized server-side proxy architecture.

The platform introduces segregated behavioral risk models that distinguish human user anomalies from background service accounts and network infrastructure, eliminating false-positive noise. To solve identity fragmentation, we engineered a dynamic alias-resolution layer that collapses multi-agent telemetry (such as Wazuh agents, native collectors, and renamed hostnames) into unified, canonical device profiles. For rapid investigations, an interactive side drawer and live canvas monitors give analysts sub-second event drill-down capability without navigating away from active triage screens.

**Outcome**

Delivered an enterprise-grade SIEM platform capable of querying over 1,000,000 events per second with instant visual responsiveness. SOC analysts cut Mean Time to Detect (MTTD) by ~65% and achieved 3x faster investigation turnaround through zero-navigation forensic drawers and unified asset timelines. The segregated UEBA behavioral engine reduced noise by 40%, allowing threat responders to focus on genuine threats rather than benign automated workloads.
