# Writing a case study

Copy any existing `.mdx` file in this folder, rename it, and edit. The
filename becomes the URL: `dispatch-routing.mdx` serves at
`/en/work/dispatch-routing`. Use lowercase words separated by hyphens.

Files starting with `_` (like this one) and any `README` are ignored, so
you can leave notes in here safely.

## The rule that matters

**Optional fields render only when you fill them in.** Leave one empty and
its whole section disappears — no empty heading, no orphaned label, no
"coming soon". You never need to touch a component to hide something.

| Field         | Leave it empty and…                                                 |
| ------------- | ------------------------------------------------------------------- |
| `client`      | The title block shows `clientSector` marked "name withheld" instead |
| `metrics`     | The outcome band is not rendered at all                             |
| `links`       | No demo/repo buttons appear                                         |
| `testimonial` | The testimonial section is not rendered                             |
| `cover`       | No cover image                                                      |
| `duration`    | That field is dropped from the title block                          |

Live examples of each shape: `current-by-logmate` is a named client with a
live link and a testimonial, `cortex-strike` is an anonymous engagement with
metrics and neither, and `zenith` is an in-house product. Copy whichever is
closest.

## Frontmatter reference

```yaml
title: "Dispatch routing engine" # required
client: "" # "" = anonymous, see above
clientSector: "Logistics" # required, used when client is empty
category: "ai" # ai | automation | software | data
summary: "One sentence for the index card." # required
stack: ["Python", "FastAPI"]
duration: "6 weeks"
year: 2026 # required, a number not a string
status: "Live" # Live | Delivered | Ongoing | Archived
featured: true # shows on the homepage
order: 1 # lower sorts first
metrics:
  - value: "-73%"
    label: "time spent on manual dispatch"
links:
  - label: "Live demo"
    url: "https://dispatch.boltertech.com"
    type: "demo" # demo | repo | article | other
cover: ""
testimonial:
  quote: "Kept short. Two sentences beats a paragraph."
  author: "Name"
  role: "Head of Operations"
draft: false # true = visible in dev, hidden in production
```

## Two things that will bite you

**HTML comments do not work.** `<!-- like this -->` fails the build. MDX
uses `{/* like this */}` instead.

**A typo fails the build on purpose.** If you misspell a category or
forget a required field, the build stops and names the file and the field.
That is deliberate — it is better than a broken card appearing on the live
site. Read the error, fix the field, done.

## Body

Everything below the `---` is Markdown. Headings, lists, links, tables,
images and code blocks all work. Keep the three `##` sections — The
problem, Approach, Outcome — since the page is designed around them.

Do not repeat the metric figures in the Outcome prose; the tiles already
show them. Use that section for what the numbers do not capture.

## Images

Every project already has a folder at `public/work/<slug>/`. Drop images in
and set `cover: "/work/<slug>/filename.png"` for the image under the title
block, or reference them from the body as `![alt](/work/<slug>/name.png)`.
