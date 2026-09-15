### Project: narrative-monitoring

**Title**: EchoHunt - Digital discourse monitoring platform

**Client name**: N/A

**Client sector**: Government / Public Sector Communications

**Category**: ai-automation

**One-sentence summary**: We built an AI platform that watches Twitter, Instagram, YouTube, and Facebook for emerging narratives in real time and hands communications teams a ready-to-execute counter-narrative strategy for it.

**Tech stack**: Python 3.12, FastAPI, React 19, TypeScript, Redux Toolkit, Tailwind CSS, Selenium, CrewAI, PaddleOCR-VL, Whisper, NLLB-200, GLiNER, XLM-RoBERTa, mDeBERTa-v3, Sentence-Transformers, llama.cpp

**Duration**: ~10 months for Version 1, with ongoing enhancement

**Year**: 2025

**Status**: Completed

**Featured?**: yes

**Priority order**: 2

**Metrics**:

- value: "180,000+" / label: "posts analyzed"
- value: "4" / label: "social platforms monitored simultaneously (Twitter, Instagram, YouTube, Facebook)"
- value: "6-stage" / label: "NLP pipeline from raw post to labeled, clustered narrative"
- value: "100%" / label: "core pipeline runs on local infrastructure, no cloud dependency required"

**Links**:

**Testimonial**:

**Cover image**:

---

### Body content

**The problem**

Narratives move fast across social media, and by the time a harmful or misleading story is obvious to a communications team, it has often already spread across multiple platforms and languages. Manually tracking thousands of posts across Twitter, Instagram, YouTube, and Facebook — in multiple languages, including text baked into images and spoken in videos — isn't something a human team can do at scale or in real time. Worse, once a narrative is spotted, teams are typically starting a response from scratch: figuring out who's driving it, how credible those sources are, which platforms need the most attention, and what to actually say — all under time pressure while the story keeps moving.

**Approach**

We built an end-to-end platform that takes a topic, hashtag, or account and turns raw social media activity into a ranked map of the narratives forming around it, then drafts a response. Posts are collected across all four platforms and enriched so nothing is missed because it wasn't in English or wasn't in the caption: on-image and on-video text is extracted via OCR, spoken audio is transcribed, and everything is translated to a common language before analysis. From there, a multilingual NLP pipeline detects entities, sentiment, and stance toward a chosen target, then clusters posts into distinct narrative storylines — weighted by credibility signals like account verification and official-source status rather than raw engagement, so a narrative pushed by a handful of credible accounts doesn't get lost under noise from viral but low-credibility posts. Each resulting cluster is scored for influence using a transparent, weighted framework so analysts can see exactly why a narrative ranked where it did. A three-agent AI crew — analyst, strategist, and tactician — then reads the clusters and produces a platform-by-platform counter-narrative plan: what to say, in which language, on which platform, and how urgently. The pipeline was designed to run entirely on local GPU infrastructure by default, so sensitive monitoring data never has to leave the client's own environment, with cloud LLMs available as an opt-in, bring-your-own-key choice rather than a requirement.

**Outcome**

Communications and analyst teams get a single workflow that replaces hours of manual, multi-platform monitoring with an automated pipeline: scrape, enrich, detect, review, and respond. Instead of discovering a narrative after it has already spread and then starting a response cold, teams see narratives ranked by real credibility and influence signals and receive a drafted, platform-specific counter-narrative strategy they can act on immediately. The system handles the full multilingual, multi-platform picture — including content that never appears in searchable text — so narratives can't hide in images, video, or a language the team wasn't watching for.
