
I need you to fill in a project intake form for a public case study on our company website

> (Bolter Technologies), for the project in `Xai-dr-detection`.
>
> **This is marketing copy for our own website, not an internal report.** Write it the way we'd
> want a prospective client to read it: confident, proud, and specific. We built something real —
> say so plainly. Do not undersell the work, hedge every sentence, or write like you're worried
> about being caught exaggerating.
>
> Pull real facts from the project's actual history — git log, code, config, docs — for anything
> checkable: scale (users/tenants/sites/records), tech stack, timeline, what the system actually
> does. Get those right; they're easy to verify and getting them wrong looks worse than any
> marketing language would.
>
> For results/impact numbers you can't point to a measured source for, don't leave them blank and
> don't refuse to guess — give your best reasonable estimate based on the scope of what was built,
> and mark it clearly as a placeholder in the "For review" note (see Output below), not inside the
> published copy itself. I will correct these against real data before anything goes live. The
> template's "must be a number you can point to a source for" instinct is right for the *record*
> we keep internally — it is wrong for what you hand back to me here. Guess, flag, move on.
>
> **Keep internal build narrative out of the public sections entirely.** The problem/approach/
> outcome sections are what a visitor or prospective client reads. Nothing about: bugs hit,
> vendors/tools that didn't work out and had to be replaced, things that are "unproven" or "not yet
> deployed," internal disagreements, or how the sausage got made. If a real constraint shaped a
> decision, present it as a deliberate design choice ("built to handle X reliably" not "we had to
> rebuild this because Y broke"). If a capability isn't finished or isn't live yet, either leave it
> out of the copy or describe only the part that *is* done — don't narrate the gap.
>
> Only include a client name or testimonial quote if you can confirm we have the client's
> permission to publish it. If unsure, leave both blank and say so **in your reply to me**, not in
> the document itself — the document should read as finished, publish-ready copy with no internal
> caveats embedded in it.
>
> Write the filled-in template to a new file under `<PROJECT>`'s own `documentation/projects/`
> directory (create that folder if it doesn't exist) — see Output below for the exact path and
> format. Other than adding that one new file, don't touch or modify anything else in `<PROJECT>`'s
> codebase or existing docs — this is a data-gathering and writing exercise, not a coding task.

---

## Template

Fill in one copy of this block per project.

---

### Project: `<short internal name>`

**Title** (required): One line, how the project should be named on the site.

**Client name**: Blank if the client must stay anonymous or permission isn't confirmed — sector
shows instead, client marked "name withheld."

**Client sector** (required): e.g. "Logistics", "Healthcare", "E-commerce".

**Category** (required): exactly one of `ai-automation`, `software`, `data`.

**One-sentence summary** (required): The problem and the result, confidently stated, no hedging.
This is the index-card line — it should make someone want to click in.

**Tech stack**: Comma-separated, actually used.

**Duration**: How long the engagement took.

**Year** (required): Delivery/launch year.

**Status**: one of `Live`, `Delivered`, `Ongoing`, `Archived`. Default `Delivered` if unsure.

**Featured?**: yes/no.

**Priority order**: Lower = shown first. Blank for default ordering.

**Metrics**: Value + label pairs. Fill these in — use a real measured number when one exists,
otherwise your best defensible estimate from project scope. Never leave this section empty just
because nothing was formally measured.

- value: "-73%" / label: "time spent on manual dispatch"
- value: "4.2x" / label: "jobs handled per planner"

**Links**: Public URLs only (demo/repo/writeup) — omit entirely if none are safe to publish (e.g. a
live client system with real customer data isn't a "demo link").

**Testimonial**: Quote + author name + role, only with confirmed permission. Otherwise blank.

**Cover image**: Blank unless an image file is provided alongside.

---

### Body content (required)

Three sections, plain prose, written as finished website copy:

**The problem** — What this was costing the client, framed the way a prospective client would
recognize their own situation: scale, stakes, what was at risk or what kept breaking. This is
about the client's world, not our build process.

**Approach** — What we built, described as a confident set of product/technical decisions. Real
constraints can and should inform *why* something was built a certain way, but frame them as
engineering judgment ("designed for X"), never as trouble we ran into.

**Outcome** — What changed for the client, in words (numbers live in Metrics, don't repeat them
here). State it as accomplished fact. Do not mention anything still in progress, unproven, or
pending — if it's not done and confirmed, it doesn't belong in outcome copy.

---

## Output

**Write the filled block(s) to a markdown file** — one file per project, saved at
`documentation/projects/<short-internal-name>.md` **inside `<PROJECT>` itself** (create the
`documentation/projects/` folder if it doesn't exist) — do not just return the filled template as
chat text, and do not look for or write into any separate website repo (there isn't one involved
in this task).

At the top of that file, before the `### Project:` block, include an HTML-comment "For review"
note (so it never accidentally renders on the live site) listing: any estimated/placeholder
metrics and why, any blank client name/testimonial and why, and any other fact you weren't able to
verify. Example:

```markdown
<!--
FOR REVIEW — not yet verified, confirm before publishing:
- "-70% less manual effort" metric is an estimate, not a measured number.
- Client name/testimonial left blank — permission not confirmed.
-->

### Project: dispatch-routing-engine
...
```

Then reply in chat with a short (2-3 sentence) summary of what you wrote and what's flagged for
review — don't paste the whole document back into the conversation.
