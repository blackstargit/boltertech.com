<!--
FOR REVIEW — not yet verified, confirm before publishing:
- Client name left blank / withheld — client permission not confirmed. Sector set to "Telecommunications".
- Testimonial left blank — no confirmed client permission.
- "< 3 min" spin-up time and "100% software-defined" are defensible estimates based on container orchestration scope and OAI rfsim implementation.
- "7" automated 3GPP milestone verification suites (M1–M7) is a verified technical capability directly built into the platform testbed.
- Duration ("6 months"), Year (2026), Status ("Delivered"), Featured ("yes"), and Priority order ("3" / Mid) set as specified.
-->

### Project: lte-sim-cut

**Title**: LTE Trove — Virtual 4G LTE Network Lab & Orchestration Platform

**Client name**: 

**Client sector**: Telecommunications

**Category**: software

**One-sentence summary**: Bolter Technologies built a cloud-native 4G LTE simulation platform and virtual Network Operations Center that provisions multi-node EPC networks and validates 3GPP signaling in minutes without physical RF hardware.

**Tech stack**: React 19, Vite, TailwindCSS, Zustand, Node.js, Express, Docker Engine, Dockerode, OpenAirInterface (OAI), Cassandra, WebSocket, Server-Sent Events (SSE), Linux IPAM & TUN Networking

**Duration**: 6 months

**Year**: 2026

**Status**: Delivered

**Featured?**: yes

**Priority order**: 3

**Metrics**:

- value: "100%" / label: "software-defined RF simulation with zero physical hardware dependencies"
- value: "< 3 min" / label: "time to provision and orchestrate a full multi-node virtual EPC and RAN"
- value: "7" / label: "automated 3GPP milestone verification suites (M1–M7)"

**Links**: _(omitted — internal telecom simulation platform, no public demo safe to publish)_

**Testimonial**: _(blank)_

**Cover image**: _(blank)_

---

### Body content

**The problem**

Testing and validating cellular network protocols traditionally requires dedicated RF testbenches, physical eNodeB base stations, Software-Defined Radios (SDRs), RF shielding enclosures, and programmable USIM cards costing tens of thousands of dollars per test bench. Physical test rigs create constant contention across engineering teams, introduce hardware misconfigurations that are difficult to isolate, and require hours of manual wiring and flashing just to test a single core configuration or handover scenario. Organizations lacked a repeatable, software-defined way to spin up isolated cellular sandboxes for automated QA, protocol experimentation, and training.

**Approach**

We built LTE Trove as a cloud-native 4G LTE simulation platform and browser-managed virtual Network Operations Center (NOC) powered by OpenAirInterface (OAI) RF simulation (`rfsim`). The backend pairs Node.js with Dockerode to orchestrate containerized Evolved Packet Core (EPC) microservices—including Home Subscriber Server (HSS), Mobility Management Entity (MME), and Serving/Packet Gateways (SPGW-C/U)—alongside a Cassandra subscriber registry, isolated Linux bridges, and kernel TUN network interfaces.

On the frontend, a responsive React 19 single-page application with Zustand state management and WebSocket event streaming gives operators an interactive topology canvas, live 3GPP signaling waterfall inspection across S1AP, NAS, S6a, and X2AP protocols, virtual UE handset commissioning, and an automated milestone verification engine (M1–M7) for continuous regression testing.

**Outcome**

The platform eliminated the dependency on specialized lab hardware, enabling teams to spin up complete, isolated 4G LTE networks directly on standard compute workstations and CI environments. Protocol engineers and operators can configure multi-eNodeB topologies, simulate subscriber authentication, execute X2 handovers, and verify end-to-end data session flows through automated test suites in minutes rather than days. Network state and protocol captures are completely deterministic, making cellular regression testing, protocol debugging, and telecom training scalable and instantly accessible.
