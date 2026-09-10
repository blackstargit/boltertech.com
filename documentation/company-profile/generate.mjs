// Bolter Technologies — Company Profile generator.
// One-off generator for a single repo: paths are hardcoded on purpose.
// To run again: `npm i docx gray-matter` in this folder, then `node generate.mjs`.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, PageNumber, AlignmentType, BorderStyle,
  WidthType, HeightRule, VerticalAlign, ShadingType, PageBreak,
  ExternalHyperlink, convertMillimetersToTwip,
} from "docx";

const ROOT = "X:\\code\\personal\\boltertech.com";
const OUT = path.join(ROOT, "documentation", "company-profile", "Bolter-Technologies-Company-Profile.docx");

const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const company = readJSON("data/company.json");
const founders = readJSON("data/founders.json");
const services = readJSON("data/services.json").slice().sort((a, b) => (b.lead ? 1 : 0) - (a.lead ? 1 : 0));
const process_ = readJSON("data/process.json");
const commitments = readJSON("data/commitments.json");
const engagements = readJSON("data/engagements.json");
const faqs = readJSON("data/faqs.json");

const projectsDir = path.join(ROOT, "content", "projects");
const projects = fs.readdirSync(projectsDir)
  .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
  .map((f) => {
    const { data } = matter(fs.readFileSync(path.join(projectsDir, f), "utf8"));
    return data;
  })
  .filter((p) => p.draft !== true)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

const featured = projects.filter((p) => p.featured);
const sectors = [...new Set(projects.map((p) => p.clientSector).filter(Boolean))];

// ---------------------------------------------------------------- palette

const C = {
  ink: "14161A", inkMuted: "5B6066", inkFaint: "6F6A5F",
  rule: "DCD8D0", ruleFaint: "E9E5DE",
  darkBg: "0A0B0C", darkInk: "FFFFFF", darkMuted: "B6B7B8", darkFaint: "8B8D8F",
  accent: "8F5D0A", accentDark: "E8A33D", onAccent: "FFFFFF",
  bone: "F3F1ED",
};
const FONT = { display: "Space Grotesk", body: "IBM Plex Sans", mono: "IBM Plex Mono" };

// ---------------------------------------------------------------- page geometry

const PAGE_W = convertMillimetersToTwip(210);
const PAGE_H = convertMillimetersToTwip(297);
const MARGIN_TB = convertMillimetersToTwip(15);
const MARGIN_LR = convertMillimetersToTwip(14);
const CONTENT_H = PAGE_H - MARGIN_TB * 2;

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
};
const hairline = (color = C.rule) => ({
  top: { style: BorderStyle.SINGLE, size: 4, color },
  bottom: { style: BorderStyle.SINGLE, size: 4, color },
  left: { style: BorderStyle.SINGLE, size: 4, color },
  right: { style: BorderStyle.SINGLE, size: 4, color },
});

// ---------------------------------------------------------------- text helpers

const run = (text, opts = {}) => new TextRun({ text, font: FONT.body, size: 21, color: C.ink, ...opts });
const mono = (text, opts = {}) => new TextRun({ text, font: FONT.mono, size: 15, color: C.inkFaint, ...opts });
const ph = (text) => new TextRun({
  text: `[PLACEHOLDER: ${text}]`, font: FONT.mono, size: 15, bold: true, color: C.accent,
});

const para = (children, opts = {}) => new Paragraph({ spacing: { after: 160 }, ...opts, children });
const body = (text, opts = {}) => para([run(text, opts.runOpts)], opts);

const eyebrow = (text, color = C.accentDark) => new TextRun({
  text: text.toUpperCase(), font: FONT.mono, size: 15, bold: true, color, characterSpacing: 30,
});

const h2 = (text, color = C.ink) => new Paragraph({
  spacing: { after: 220 },
  children: [new TextRun({ text, font: FONT.display, bold: true, size: 34, color })],
});
const h3 = (text, color = C.accent) => new Paragraph({
  spacing: { before: 60, after: 100 },
  children: [new TextRun({ text, font: FONT.display, bold: true, size: 26, color })],
});
const h4 = (text, color = C.ink) => new Paragraph({
  spacing: { after: 40 },
  children: [new TextRun({ text, font: FONT.display, bold: true, size: 22, color })],
});

const bullet = (text) => new Paragraph({
  spacing: { after: 90 },
  indent: { left: 260, hanging: 200 },
  children: [new TextRun({ text: "—  ", font: FONT.mono, size: 19, color: C.accent }), run(text, { size: 19, color: C.inkMuted })],
});

const rule = (color = C.rule) => new Paragraph({
  spacing: { before: 120, after: 220 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color } },
  children: [new TextRun({ text: "" })],
});

const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const link = (label_, url) => new Paragraph({
  spacing: { after: 160 },
  children: [new ExternalHyperlink({
    link: url,
    children: [new TextRun({ text: `${label_} → ${url}`, font: FONT.mono, size: 17, color: C.accent, underline: {} })],
  })],
});

// A single-row, single-cell table used as a coloured content band (page bleed).
function band({ eyebrowText, heading, note, dark = true, minHeightMm = 40, align = AlignmentType.LEFT }) {
  const fg = dark ? C.darkInk : C.ink;
  const children = [];
  if (eyebrowText) children.push(new Paragraph({ alignment: align, spacing: { after: 80 }, children: [eyebrow(eyebrowText, dark ? C.accentDark : C.accent)] }));
  children.push(new Paragraph({
    alignment: align,
    children: [new TextRun({ text: heading, font: FONT.display, bold: true, size: 40, color: fg })],
  }));
  if (note) children.push(new Paragraph({ alignment: align, spacing: { before: 100 }, children: [new TextRun({ text: note, font: FONT.body, size: 19, color: dark ? C.darkMuted : C.inkMuted })] }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [new TableRow({
      height: { value: convertMillimetersToTwip(minHeightMm), rule: HeightRule.ATLEAST },
      children: [new TableCell({
        shading: dark ? { fill: C.darkBg, type: ShadingType.CLEAR, color: "auto" } : undefined,
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 260, bottom: 260, left: 260, right: 260 },
        borders: noBorders,
        children,
      })],
    })],
  });
}

// A hairline field grid: label above value, N columns.
function fieldRow(fields) {
  const n = fields.length;
  const w = Math.floor(10000 / n);
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: hairline(),
    rows: [new TableRow({
      children: fields.map(({ label: l, value }) => new TableCell({
        width: { size: w, type: WidthType.PCT },
        margins: { top: 140, bottom: 160, left: 180, right: 180 },
        borders: hairline(),
        children: [
          new Paragraph({ spacing: { after: 60 }, children: [mono(l.toUpperCase(), { characterSpacing: 20 })] }),
          new Paragraph({ children: Array.isArray(value) ? value : [value] }),
        ],
      })),
    })],
  });
}

// A metric strip: figure, caption, and a small proportion bar.
function metricRow(metrics) {
  const n = metrics.length;
  const w = Math.floor(10000 / n);
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [new TableRow({
      children: metrics.map((m) => new TableCell({
        width: { size: w, type: WidthType.PCT },
        margins: { top: 60, bottom: 60, left: 0, right: 260 },
        borders: noBorders,
        children: [
          new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: m.value, font: FONT.display, bold: true, size: 44, color: C.accent })] }),
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: m.label, font: FONT.body, size: 17, color: C.inkMuted })] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: noBorders,
            rows: [new TableRow({
              height: { value: 40, rule: HeightRule.EXACT },
              children: [
                new TableCell({ width: { size: m.bar ?? 50, type: WidthType.PCT }, shading: { fill: C.accent }, borders: noBorders, children: [new Paragraph({ children: [] })] }),
                new TableCell({ width: { size: 100 - (m.bar ?? 50), type: WidthType.PCT }, shading: { fill: C.ruleFaint }, borders: noBorders, children: [new Paragraph({ children: [] })] }),
              ],
            })],
          }),
        ],
      })),
    })],
  });
}

function quote(text, attribution) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      ...noBorders,
      left: { style: BorderStyle.SINGLE, size: 24, color: C.accent },
    },
    rows: [new TableRow({
      children: [new TableCell({
        shading: { fill: C.bone },
        margins: { top: 260, bottom: 260, left: 320, right: 320 },
        borders: {
          ...noBorders,
          left: { style: BorderStyle.SINGLE, size: 24, color: C.accent },
        },
        children: [
          new Paragraph({ spacing: { after: attribution ? 140 : 0 }, children: [new TextRun({ text: `“${text}”`, font: FONT.display, italics: true, size: 24, color: C.ink })] }),
          ...(attribution ? [new Paragraph({ children: [mono(attribution.toUpperCase(), { characterSpacing: 20 })] })] : []),
        ],
      })],
    })],
  });
}

// ---------------------------------------------------------------- section helper

const sections = [];
function section(eyebrowText, heading, blocks, { first = false } = {}) {
  if (!first) sections.push(pageBreak());
  sections.push(band({ eyebrowText, heading, dark: true, minHeightMm: 26 }));
  sections.push(new Paragraph({ spacing: { after: 260 }, children: [] }));
  sections.push(...blocks);
}

// ================================================================== COVER

const logo = fs.readFileSync(path.join(ROOT, "public", "yellow-logo.png"));
sections.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: noBorders,
  rows: [new TableRow({
    height: { value: CONTENT_H, rule: HeightRule.EXACT },
    children: [new TableCell({
      shading: { fill: C.darkBg },
      verticalAlign: VerticalAlign.CENTER,
      borders: noBorders,
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, children: [new ImageRun({ type: "png", data: logo, transformation: { width: 130, height: 140 } })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "BOLTER TECHNOLOGIES", font: FONT.mono, size: 19, bold: true, color: C.darkInk, characterSpacing: 40 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 700 }, children: [new TextRun({ text: "Company Profile", font: FONT.display, bold: true, size: 64, color: C.accentDark })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 900 }, children: [new TextRun({ text: company.tagline, font: FONT.body, italics: true, size: 24, color: C.darkMuted })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${company.address.city}, ${company.address.countryName}  ·  boltertech.com  ·  ${company.email}`, font: FONT.mono, size: 15, color: C.darkFaint, characterSpacing: 10 })] }),
      ],
    })],
  })],
}));
sections.push(pageBreak());

// ================================================================== CONTENTS

sections.push(h2("Contents"));
[
  "At a glance", "Who we are", "What we do", "How we work", "Selected work",
  "Portfolio at a glance", "Proof", "Leadership", "Traction & outlook",
  "Working with us", "Contact", "Information to complete",
].forEach((t, i) => sections.push(body(`${String(i + 1).padStart(2, "0")}   ${t}`, { runOpts: { size: 23, font: FONT.display } })));
sections.push(pageBreak());

// ================================================================== 1. AT A GLANCE

section("Bolter Technologies", "At a glance", [
  fieldRow([
    { label: "Legal name", value: run(company.legalName, { size: 19 }) },
    { label: "Founded", value: run(String(company.founded), { size: 19 }) },
    { label: "Team size", value: run(company.teamSize, { size: 19 }) },
    { label: "Company type", value: run(company.companyType, { size: 19 }) },
  ]),
  fieldRow([
    { label: "Industry", value: run(company.industry, { size: 19 }) },
    { label: "Client focus", value: run(company.clientFocus, { size: 19 }) },
    { label: "Response time", value: run(company.responseTime, { size: 19 }) },
    { label: "Headquarters", value: run(`${company.address.city}, ${company.address.countryName}`, { size: 19 }) },
  ]),
  new Paragraph({ spacing: { before: 260, after: 60 }, children: [mono("REGISTERED ADDRESS", { characterSpacing: 20 })] }),
  para([run(`${company.address.line1}, ${company.address.line2}, ${company.address.city}, ${company.address.region}`, { size: 20 })]),
  para([run(`${company.address.countryName}  ·  postal code `, { size: 20 }), ph("postal / ZIP code")]),
  new Paragraph({ spacing: { before: 220, after: 60 }, children: [mono("REGISTRATION", { characterSpacing: 20 })] }),
  para([run("SECP registration no.  ", { size: 20 }), ph("SECP registration number")]),
  para([run("NTN  ", { size: 20 }), ph("tax / NTN number")]),
  para([run("Incorporation date  ", { size: 20 }), ph("exact incorporation date, within 2024")]),
], { first: true });

// ================================================================== 2. WHO WE ARE

section("Company", "Who we are", [
  para([run(company.description, { size: 21, color: C.ink })], { spacing: { after: 320 } }),
  h3("What we commit to in writing"),
  ...commitments.flatMap((c) => [
    h4(c.name, C.ink),
    body(c.detail, { runOpts: { size: 19, color: C.inkMuted } }),
  ]),
]);

// ================================================================== 3. WHAT WE DO

section("Practice", "What we do", services.flatMap((s, i) => [
  h3(`${s.name}${s.lead ? "  —  lead practice" : ""}`),
  body(s.summary, { runOpts: { size: 20, color: C.inkMuted } }),
  ...s.includes.map(bullet),
  new Paragraph({ spacing: { before: 60, after: i < services.length - 1 ? 300 : 0 }, children: [mono(s.stack.join("  ·  "), { size: 15, color: C.inkFaint })] }),
  ...(i < services.length - 1 ? [rule(C.ruleFaint)] : []),
]));

// ================================================================== 4. HOW WE WORK

section("Method", "How we work", [
  ...process_.flatMap((p, i) => [
    h4(`${i + 1}. ${p.step}`),
    body(p.detail, { runOpts: { size: 19, color: C.inkMuted } }),
  ]),
  rule(C.ruleFaint),
  h3("Engagement models"),
  ...engagements.flatMap((e) => [
    new Paragraph({ spacing: { after: 40 }, children: [mono(e.kind.toUpperCase(), { characterSpacing: 20, color: C.accent })] }),
    h4(e.name),
    body(e.summary, { runOpts: { size: 19, color: C.inkMuted } }),
    para([new TextRun({ text: e.terms, font: FONT.mono, size: 16, italics: true, color: C.inkFaint })], { spacing: { after: 260 } }),
  ]),
]);

// ================================================================== 5. SELECTED WORK

// One case study per section() page was leaving mostly-empty pages for the
// shorter ones (title + meta + metrics + one paragraph, nothing else). Flow
// them continuously instead — Word paginates on actual overflow, so short
// ones share a page and only the longer ones (quote, link) run past one.
const caseStudyBlocks = (p, isLast) => [
  h3(p.title, C.ink),
  para([mono([
    p.client ? p.client : `${p.clientSector} — name withheld`,
    p.category,
    String(p.year),
    p.duration,
    p.status,
  ].filter(Boolean).join("   ·   "), { size: 16, color: C.inkFaint })], { spacing: { after: 220 } }),
  ...(p.metrics?.length ? [metricRow(p.metrics), new Paragraph({ spacing: { after: 220 }, children: [] })] : []),
  body(p.summary, { runOpts: { size: 21, color: C.ink } }),
  ...(p.testimonial ? [quote(p.testimonial.quote, `${p.testimonial.author}${p.testimonial.role ? `, ${p.testimonial.role}` : ""}`)] : []),
  ...(p.links?.length ? p.links.map((l) => link(l.label, l.url)) : []),
  ...(p.stack?.length ? [new Paragraph({ spacing: { before: 140, after: 0 }, children: [mono(`TECHNOLOGY   ${p.stack.join("  ·  ")}`, { size: 15, color: C.inkFaint })] })] : []),
  ...(isLast ? [] : [rule(C.ruleFaint)]),
];

section("Case studies", "Selected work", [
  body(`Six representative engagements, drawn from a delivered portfolio of ${projects.length}. The complete list follows in the next section.`, { runOpts: { size: 19, color: C.inkMuted } }),
  ...featured.flatMap((p, i) => caseStudyBlocks(p, i === featured.length - 1)),
]);

// ================================================================== 6. PORTFOLIO TABLE

function portfolioTable() {
  const headerRow = ["Project", "Sector", "Category", "Year", "Duration", "Status"];
  const widths = [3200, 3000, 1400, 800, 1200, 1400];
  const headCell = (text, w) => new TableCell({
    width: { size: w, type: WidthType.PCT },
    shading: { fill: C.darkBg },
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    borders: hairline(C.darkBg),
    children: [new Paragraph({ children: [mono(text.toUpperCase(), { color: C.accentDark, characterSpacing: 10 })] })],
  });
  const cell = (text, w) => new TableCell({
    width: { size: w, type: WidthType.PCT },
    margins: { top: 90, bottom: 90, left: 120, right: 120 },
    borders: hairline(),
    children: [new Paragraph({ children: [run(text, { size: 16, color: C.inkMuted })] })],
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: hairline(),
    rows: [
      new TableRow({ children: headerRow.map((h, i) => headCell(h, widths[i])) }),
      ...projects.map((p) => new TableRow({
        children: [
          cell(p.title.split("—")[0].trim(), widths[0]),
          cell(p.client ? p.client : `${p.clientSector} (name withheld)`, widths[1]),
          cell(p.category, widths[2]),
          cell(String(p.year), widths[3]),
          cell(p.duration, widths[4]),
          cell(p.status, widths[5]),
        ],
      })),
    ],
  });
}

section("Full portfolio", "Portfolio at a glance", [portfolioTable()]);

// ================================================================== 7. PROOF

const testimonialProject = projects.find((p) => p.testimonial);
section("Track record", "Proof", [
  ...(testimonialProject ? [quote(testimonialProject.testimonial.quote, `${testimonialProject.testimonial.author}, ${testimonialProject.testimonial.role || ""} — ${testimonialProject.client}`), new Paragraph({ spacing: { after: 300 }, children: [] })] : []),
  h3("Sectors delivered into"),
  para([mono(sectors.join("   ·   "), { size: 17, color: C.inkMuted })]),
]);

// ================================================================== 8. LEADERSHIP

section("People", "Leadership", founders.flatMap((f) => [
  h4(`${f.name}  —  ${f.role}`),
  body(f.bio, { runOpts: { size: 19, color: C.inkMuted } }),
  fieldRow([
    { label: "Focus", value: run(f.focus, { size: 17 }) },
    { label: "Email", value: run(f.email, { size: 17 }) },
    { label: "LinkedIn", value: f.linkedin ? run(f.linkedin, { size: 17 }) : ph("LinkedIn URL") },
    { label: "Headshot", value: ph("photo") },
  ]),
  new Paragraph({ spacing: { after: 300 }, children: [] }),
]));

// ================================================================== 9. TRACTION

section("Investor & hiring", "Traction & outlook", [
  body("The figures below are not yet published and are marked for completion.", { runOpts: { size: 19, color: C.inkMuted } }),
  ...[
    "revenue or growth figures for the past 12 months",
    "headcount plan for the next 12 months",
    "notable clients beyond those named in this document",
    "product roadmap or platform investments",
    "certifications or compliance posture",
  ].map((t) => new Paragraph({
    spacing: { after: 90 }, indent: { left: 260, hanging: 200 },
    children: [new TextRun({ text: "—  ", font: FONT.mono, size: 19, color: C.accent }), ph(t)],
  })),
]);

// ================================================================== 10. FAQ

section("Working together", "Working with us", faqs.flatMap((f) => [
  h4(f.q, C.ink),
  body(f.a, { runOpts: { size: 19, color: C.inkMuted } }),
]));

// ================================================================== 11. CONTACT

section("Get in touch", "Contact", [
  fieldRow([
    { label: "Email", value: run(company.email, { size: 19 }) },
    { label: "Phone", value: run(company.phone, { size: 19 }) },
  ]),
  fieldRow([
    { label: "Website", value: run("boltertech.com", { size: 19 }) },
    { label: "Response time", value: run(company.responseTime, { size: 19 }) },
  ]),
  new Paragraph({ spacing: { before: 260, after: 60 }, children: [mono("OFFICE HOURS", { characterSpacing: 20 })] }),
  para([ph("office hours, local time")]),
  new Paragraph({ spacing: { before: 260, after: 60 }, children: [mono("ADDRESS", { characterSpacing: 20 })] }),
  body(`${company.address.line1}, ${company.address.line2}, ${company.address.city}, ${company.address.countryName}`, { runOpts: { size: 20 } }),
  new Paragraph({ spacing: { before: 220, after: 60 }, children: [mono("ELSEWHERE ONLINE", { characterSpacing: 20 })] }),
  para([run("LinkedIn  ", { size: 19 }), ph("LinkedIn company page")]),
  para([run("GitHub  ", { size: 19 }), ph("GitHub organisation")]),
  para([run("Clutch  ", { size: 19 }), ph("Clutch profile")]),
  para([run("GoodFirms  ", { size: 19 }), ph("GoodFirms profile")]),
]);

// ================================================================== 12. CHECKLIST

section("Before you send this", "Information to complete", [
  body("Every item below has a matching [PLACEHOLDER] marker earlier in this document — search for \u201cPLACEHOLDER\u201d to find and replace each one.", { runOpts: { size: 19, color: C.inkMuted } }),
  ...[
    "Postal / ZIP code for the registered address",
    "SECP registration number and exact incorporation date",
    "NTN / tax registration number",
    "LinkedIn, GitHub, Clutch and GoodFirms profile URLs",
    "Tariq Mehmood's LinkedIn profile",
    "Founder headshots — all three",
    "Revenue, growth and traction figures",
    "Headcount plan and product roadmap",
    "Certifications or compliance posture",
    "Named clients and logos beyond Logmate",
    "Office hours",
    "Governing jurisdiction for contracts (still open in the site's Terms of Service)",
  ].map((t) => new Paragraph({
    spacing: { after: 100 }, indent: { left: 260, hanging: 200 },
    children: [new TextRun({ text: "☐  ", font: FONT.mono, size: 20, color: C.accent }), run(t, { size: 19, color: C.inkMuted })],
  })),
]);

// ================================================================== BUILD

const doc = new Document({
  styles: { default: { document: { run: { font: FONT.body, size: 21, color: C.ink } } } },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN_TB, bottom: MARGIN_TB, left: MARGIN_LR, right: MARGIN_LR },
      },
      titlePage: true,
    },
    headers: { first: new Header({ children: [new Paragraph({ children: [] })] }) },
    footers: {
      first: new Footer({ children: [new Paragraph({ children: [] })] }),
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 3, color: C.ruleFaint } },
          spacing: { before: 120 },
          tabStops: [{ type: "right", position: convertMillimetersToTwip(210 - 14 - 14) }],
          children: [
            new TextRun({ text: "BOLTER TECHNOLOGIES PRIVATE LIMITED  ·  BOLTERTECH.COM", font: FONT.mono, size: 13, color: C.inkFaint, characterSpacing: 10 }),
            new TextRun({ text: "\t", font: FONT.mono, size: 13, color: C.inkFaint }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT.mono, size: 13, color: C.inkFaint }),
          ],
        })],
      }),
    },
    children: sections,
  }],
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
const buf = await Packer.toBuffer(doc);
fs.writeFileSync(OUT, buf);
console.log("Wrote", OUT, buf.length, "bytes");
console.log("Projects found:", projects.length, "featured:", featured.length);
console.log("Sectors:", sectors);
