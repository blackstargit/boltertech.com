## Launch blocker — turn the placeholders off

Set `NEXT_PUBLIC_SHOW_PLACEHOLDERS=0` in the **Vercel production** environment
(leave it unset in preview and local). Until then, every unwritten optional
field renders a hatched, dashed, captioned stand-in instead of nothing:

| Slot                  | What is missing today                             |
| --------------------- | ------------------------------------------------- |
| Case study cover      | all 11 — `cover: ""`                              |
| Outcome chart         | all 11 — no `series:` on any project              |
| Metric proportion bar | all 38 metrics — no `bar:` on any                 |
| Client testimonial    | 10 of 11 — only `current-by-logmate` has one      |
| Founder portrait      | all 3 — `photo: ""` and names still `PLACEHOLDER` |

Switching the flag off restores absent-by-default: the slot renders nothing
at all, with no empty heading and no orphaned label. Filling a field in makes
its real version appear whether the flag is on or off — the flag only governs
the stand-in. See `src/lib/placeholders.ts`.

---

- Wire up GA4 key events `qualify_lead` (page_view on /contact) and `close_convert_lead`
  (approximate via form_submit, or exact via a code change on ContactForm success) —
  see CLAUDE.md locked decisions.
- Add a Google Maps API that shows us the location of the office on the Contact Us page.
- Remove Islamabad from top name
- Remove top 4 small boxes in hero
- Add scroller line from hero
- Add the following as testimonials later on:

  - Hitachi Engineering
  - Logmate
  - AirOverflow
  - Centre for Countering Terrorism and Violent Extremism Studies CCTVES
  - Institute of Regional Studies IRS
  - Sigma Engineering
