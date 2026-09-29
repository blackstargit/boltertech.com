## Placeholders

Everything on the site that is not real yet — written placeholders, hatched
stand-ins, and the launch checklist — is inventoried in **`PLACEHOLDERS.md`**.
Includes the one hard blocker (`[JURISDICTION]` in `terms.mdx`) and the
production switch that turns the stand-ins off.

---

- Wire up GA4 key events `qualify_lead` (page_view on /contact) and `close_convert_lead`
  (approximate via form_submit, or exact via a code change on ContactForm success) —
  see CLAUDE.md locked decisions.
- Add the following as testimonials later on:

  - Hitachi Engineering
  - Logmate
  - AirOverflow
  - Centre for Countering Terrorism and Violent Extremism Studies CCTVES
  - Institute of Regional Studies IRS
  - Sigma Engineering
- Rewrite the case study for Eco Hunt. This time we will show that our project is focused on brands and the private information sector, like ARY News.
- SOAI, WAF, channel analytics to be added
- Places autocomplete address form (Google Places SDK / Places API). Needs a
  Google Cloud project with billing enabled (card on file); usage within the
  monthly free cap per SKU costs nothing. Use autocomplete sessions ending in a
  Place Details call, request only the address fields needed, restrict the API
  key to the app, and set a budget alert plus daily quota cap. Confirm current
  free caps on the Maps Platform pricing page before building.

1. Add images for founders.
2. Add images for the remaining projects without one. On the weekend
