// Bolter Technologies — Company Profile deck generator.
// One-off generator for a single repo: paths are hardcoded on purpose.
// To run again: `npm i` in this folder, then `node generate.mjs`.
//
// Facts come from the website (data/, content/, messages/). Wording written
// for the deck lives in copy.mjs. Nothing here writes to the site.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import PptxGenJS from "pptxgenjs";
import { DECK } from "./copy.mjs";

const ROOT = "X:\\code\\personal\\boltertech.com";
const OUT = path.join(ROOT, "documentation", "company-profile", "Bolter-Technologies-Company-Profile.pptx");

const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const company = readJSON("data/company.json");
const founders = readJSON("data/founders.json");
const process_ = readJSON("data/process.json");
const commitments = readJSON("data/commitments.json");
const engagements = readJSON("data/engagements.json");
const faqs = readJSON("data/faqs.json");
const msg = readJSON("messages/en.json");

// ---------------------------------------------------------------- case studies

// Strip the markdown a case-study body uses: emphasis, inline code, links.
const plain = (s) =>
  s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();

const bodySections = (content) => {
  const out = {};
  for (const part of content.split(/^##\s+/m).slice(1)) {
    const nl = part.indexOf("\n");
    out[part.slice(0, nl).trim().toLowerCase()] = part.slice(nl + 1).trim();
  }
  return out;
};

const firstPara = (s) => plain((s ?? "").split(/\n\s*\n/)[0] ?? "");

// Trim to a sentence boundary so a slide never ends mid-clause.
const clamp = (s, n) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return end > n * 0.45 ? cut.slice(0, end + 1).trim() : `${cut.trim()}…`;
};

const projectsDir = path.join(ROOT, "content", "projects");
const projects = fs.readdirSync(projectsDir)
  .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
  .map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(projectsDir, f), "utf8"));
    const s = bodySections(content);
    return { ...data, problem: firstPara(s["the problem"]), outcome: firstPara(s["outcome"]) };
  })
  .filter((p) => p.draft !== true)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

const testimonials = projects.filter((p) => p.testimonial);
const shortTitle = (p) => p.title.split(" — ")[0].trim();
const subTitle = (p) => {
  const t = p.title.split(" — ")[1]?.trim() ?? "";
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const inHouse = (p) => /in-house/i.test(p.client ?? "");
const clientLine = (p) =>
  inHouse(p) ? "In-house product" : p.client ? p.client : `${p.clientSector} — ${msg.common.clientWithheld}`;
const coverPath = (p) => (p.cover ? path.join(ROOT, "public", p.cover) : null);
const pad = (n) => String(n).padStart(2, "0");

const practices = DECK.practiceOrder.map((id) => ({
  id,
  ...DECK.practices[id],
  work: projects.filter((p) => p.category === id),
}));

// The FAQ that repeats the last process step word for word adds nothing here.
const processText = new Set(process_.map((p) => p.detail));
const deckFaqs = faqs.filter((f) => !processText.has(f.a)).slice(0, 6);

// ---------------------------------------------------------------- tokens (src/app/globals.css)

const DARK = {
  bg: "0A0B0C", sheet: "0E1011", ink: "FFFFFF", muted: "B6B7B8", faint: "8B8D8F",
  rule: "2E3033", ruleFaint: "191B1C", accent: "E8A33D", accentSoft: "2A1F0D", bar: "3A3C3F",
};
const BONE = {
  bg: "F3F1ED", sheet: "FFFFFF", ink: "14161A", muted: "5B6066", faint: "6F6A5F",
  rule: "DCD8D0", ruleFaint: "E9E5DE", accent: "8F5D0A", accentSoft: "F0E2C8", bar: "D3CEC4",
};
const F = { display: "Space Grotesk", body: "IBM Plex Sans", mono: "IBM Plex Mono" };

const W = 13.333, MX = 0.7, CW = W - 2 * MX, BOTTOM = 6.9;

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.company = company.legalName;
pptx.author = company.legalName;
pptx.title = `${company.name} — Company Profile`;
pptx.theme = { headFontFace: F.display, bodyFontFace: F.body };

// ---------------------------------------------------------------- primitives

const text = (s, t, o) => s.addText(t, { margin: 0, valign: "top", fontFace: F.body, ...o });
const line = (s, x, y, w, h, color, width = 0.75) =>
  s.addShape(pptx.ShapeType.line, { x, y, w, h, line: { color, width } });
const rect = (s, x, y, w, h, o) => s.addShape(pptx.ShapeType.rect, { x, y, w, h, line: { type: "none" }, ...o });
const label = (s, c, t, x, y, w, o = {}) =>
  text(s, t.toUpperCase(), { x, y, w, h: 0.2, fontFace: F.mono, fontSize: 8, color: c.faint, charSpacing: 1.5, ...o });

function eyebrow(s, c, t, x = MX, y = 0.55) {
  rect(s, x, y + 0.075, 0.24, 0.035, { fill: { color: c.accent } });
  text(s, t.toUpperCase(), { x: x + 0.36, y, w: 9, h: 0.2, fontFace: F.mono, fontSize: 9, bold: true, color: c.accent, charSpacing: 2 });
}

function title(s, c, t, o = {}) {
  text(s, t, { x: MX, y: 0.85, w: CW, h: 0.75, fontFace: F.display, fontSize: 34, bold: true, color: c.ink, ...o });
}

function tag(s, c, t, x, y, w = 1.35) {
  s.addText(t.toUpperCase(), {
    shape: pptx.ShapeType.roundRect, rectRadius: 0.04, x, y, w, h: 0.26,
    fill: { color: c.accentSoft }, line: { color: c.accent, width: 0.5 }, margin: 0,
    align: "center", valign: "middle", fontFace: F.mono, fontSize: 7.5, bold: true, charSpacing: 1, color: c.accent,
  });
}

// Paragraphs with space between them, in one text box.
function paras(s, c, list, o) {
  text(s, list.map((t, i) => ({ text: t, options: { breakLine: i < list.length - 1, paraSpaceAfter: 10 } })), {
    color: c.muted, lineSpacingMultiple: 1.3, ...o,
  });
}

// Rough height of a wrapped paragraph, used to place the block beneath it.
const linesFor = (t, w, size) => Math.ceil(t.length / Math.max(1, Math.floor(w / ((size * 0.5) / 72))));
const blockH = (t, w, size, spacing = 1.25) => linesFor(t, w, size) * ((size * spacing) / 72);

function seriesChart(s, c, p, x, y, w, h) {
  const data = p.series;
  const turn = Math.floor(data.length * 0.6);
  const first = data[0], last = data[data.length - 1];
  const pct = Math.round(((last - first) / first) * 100);
  label(s, c, p.seriesLabel, x, y, w - 2.1, { h: 0.4, fontSize: 7.5, charSpacing: 1 });
  text(s, `${first} → ${last}`, { x: x + w - 1.95, y: y - 0.02, w: 1.1, h: 0.24, fontFace: F.mono, fontSize: 9, color: c.muted, align: "right", valign: "middle" });
  s.addText(`${pct > 0 ? "+" : ""}${pct}%`, {
    shape: pptx.ShapeType.roundRect, rectRadius: 0.04, x: x + w - 0.75, y: y - 0.02, w: 0.75, h: 0.24,
    fill: { color: c.accentSoft }, line: { color: c.accent, width: 0.5 }, margin: 0,
    align: "center", valign: "middle", fontFace: F.mono, fontSize: 9, bold: true, color: c.accent,
  });
  const labels = data.map((_, i) => (i === 0 ? "Baseline" : i === turn ? "Automated" : i === data.length - 1 ? "Steady-state" : ""));
  s.addChart(pptx.ChartType.bar, [
    { name: "Before", labels, values: data.map((v, i) => (i < turn ? v : 0)) },
    { name: "After", labels, values: data.map((v, i) => (i >= turn ? v : 0)) },
  ], {
    x: x - 0.08, y: y + 0.42, w: w + 0.16, h: h - 0.42,
    barDir: "col", barGrouping: "stacked", barGapWidthPct: 45,
    chartColors: [c.bar, c.accent], showLegend: false, showValue: false,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 100,
    valGridLine: { color: c.rule, style: "dash", size: 0.5 },
    catAxisLabelColor: c.faint, catAxisLabelFontFace: F.mono, catAxisLabelFontSize: 8,
    catAxisLineShow: true, catAxisLineColor: c.rule, catGridLine: { style: "none" },
    plotArea: { fill: { color: c.bg } }, fill: c.bg,
  });
}

function metricGrid(s, c, metrics, x, y, w, h) {
  const cols = 2, cw = w / cols, rows = Math.ceil(metrics.length / cols), rh = h / rows;
  metrics.forEach((m, k) => {
    const mx = x + (k % cols) * cw, my = y + Math.floor(k / cols) * rh;
    line(s, mx, my, cw - 0.25, 0, c.rule);
    text(s, m.value, { x: mx, y: my + 0.12, w: cw - 0.25, h: 0.45, fontFace: F.display, fontSize: 24, bold: true, color: c.accent });
    text(s, m.label, { x: mx, y: my + 0.6, w: cw - 0.3, h: rh - 0.65, fontSize: 9.5, color: c.muted, lineSpacingMultiple: 1.1 });
  });
}

// ---------------------------------------------------------------- slides

const slides = [];
const add = (tone, build) => slides.push({ tone, build });

// ================================================================== 1. COVER

add(DARK, (s, c) => {
  s.addImage({ path: path.join(ROOT, "public", "yellow-logo.png"), x: 8.45, y: 1.2, w: 4.1, h: 4.1 * (1303 / 1207) });
  eyebrow(s, c, `Company profile  ·  ${new Date().getFullYear()}`, MX, 1.7);
  text(s, company.name.replace(" ", "\n"), { x: MX, y: 2.05, w: 7.4, h: 2.3, fontFace: F.display, fontSize: 66, bold: true, color: c.ink, lineSpacingMultiple: 0.88 });
  text(s, company.tagline, { x: MX, y: 4.45, w: 7.4, h: 0.9, fontSize: 20, color: c.muted, lineSpacingMultiple: 1.15 });
  line(s, MX, 6.05, CW, 0, c.rule);
  const fields = [
    ["Established", String(company.founded)],
    ["Headquarters", `${company.address.city}, ${company.address.countryName}`],
    ["Website", "boltertech.com"],
    ["Contact", company.email],
  ];
  const fw = CW / fields.length;
  fields.forEach(([l, v], i) => {
    label(s, c, l, MX + i * fw, 6.25, fw);
    text(s, v, { x: MX + i * fw, y: 6.5, w: fw, h: 0.3, fontSize: 13, color: c.ink });
  });
});

// ================================================================== 2. AT A GLANCE

add(BONE, (s, c) => {
  eyebrow(s, c, "01  At a glance");
  title(s, c, company.name);
  text(s, company.tagline, { x: MX, y: 1.8, w: 7.2, h: 1.0, fontFace: F.display, fontSize: 25, color: c.ink, lineSpacingMultiple: 1.1 });
  text(s, company.description, { x: MX, y: 3.0, w: 7.2, h: 1.8, fontSize: 13, color: c.muted, lineSpacingMultiple: 1.3 });

  const fields = [
    ["Legal name", company.legalName],
    ["Company type", company.companyType],
    ["Industry", company.industry],
    ["Client focus", company.clientFocus],
    ["Headquarters", `${company.address.city}, ${company.address.countryName}`],
  ];
  const fx = 8.75, fwid = W - MX - fx;
  fields.forEach(([l, v], i) => {
    const y = 1.8 + i * 0.6;
    line(s, fx, y, fwid, 0, c.rule);
    label(s, c, l, fx, y + 0.1, fwid);
    text(s, v, { x: fx, y: y + 0.3, w: fwid, h: 0.26, fontSize: 12, color: c.ink });
  });

  const stats = [
    [String(company.founded), "Bolter founded, in Islamabad"],
    ["2008", "Sigma Engineering, our sister company"],
    [company.teamSize.replace("-", "–"), "People on the team"],
    [String(projects.length), "Projects built and delivered"],
  ];
  const sy = 5.1, sw = CW / stats.length;
  line(s, MX, sy, CW, 0, c.rule);
  stats.forEach(([v, l], i) => {
    const x = MX + i * sw;
    if (i) line(s, x, sy, 0, BOTTOM - sy, c.rule);
    const ix = x + (i ? 0.3 : 0);
    text(s, v, { x: ix, y: sy + 0.25, w: sw - 0.3, h: 0.85, fontFace: F.display, fontSize: 50, bold: true, color: c.accent });
    text(s, l, { x: ix, y: sy + 1.2, w: sw - 0.35, h: 0.5, fontSize: 12, color: c.muted, lineSpacingMultiple: 1.1 });
  });
});

// ================================================================== 3. WHO WE ARE

add(DARK, (s, c) => {
  const d = DECK.statement;
  eyebrow(s, c, d.eyebrow);
  title(s, c, d.heading);
  paras(s, c, d.body, { x: MX, y: 1.85, w: 7.0, h: 4.6, fontSize: 14 });

  const x = 8.6, w = W - MX - x;
  label(s, c, d.companiesLabel, x, 1.85, w);
  d.companies.forEach((co, i) => {
    const y = 2.2 + i * 0.95;
    line(s, x, y, w, 0, c.rule);
    text(s, co.name, { x, y: y + 0.18, w, h: 0.32, fontFace: F.display, fontSize: 17, bold: true, color: c.ink });
    label(s, c, co.note, x, y + 0.55, w, { fontSize: 7.5, charSpacing: 1 });
  });
  line(s, x, 2.2 + d.companies.length * 0.95, w, 0, c.rule);
});

// ================================================================== 4. VISION

add(BONE, (s, c) => {
  const d = DECK.vision;
  eyebrow(s, c, d.eyebrow);
  title(s, c, d.heading);
  paras(s, c, d.body, { x: MX, y: 1.9, w: 6.2, h: 4.4, fontSize: 15, color: c.ink });

  const x = 7.6, w = W - MX - x, y = 1.9, h = 4.7;
  s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.05, fill: { color: c.sheet }, line: { type: "none" } });
  rect(s, x, y + 0.4, 0.05, h - 0.8, { fill: { color: c.accent } });
  text(s, "“", { x: x + 0.42, y: y + 0.35, w: 1, h: 0.8, fontFace: F.display, fontSize: 60, bold: true, color: c.accent });
  text(s, d.quote.text, { x: x + 0.5, y: y + 1.15, w: w - 1.0, h: h - 2.1, fontFace: F.display, fontSize: 14, color: c.ink, lineSpacingMultiple: 1.2 });
  line(s, x + 0.5, y + h - 0.9, w - 1.0, 0, c.rule);
  text(s, d.quote.author, { x: x + 0.5, y: y + h - 0.76, w: w - 1.0, h: 0.28, fontSize: 12, bold: true, color: c.ink });
  label(s, c, d.quote.role, x + 0.5, y + h - 0.46, w - 1.0);
});

// ================================================================== 5. LEADERSHIP

add(DARK, (s, c) => {
  eyebrow(s, c, DECK.team.leadershipEyebrow);
  title(s, c, DECK.team.leadershipHeading);
  const gap = 0.45, cw = (CW - gap * (founders.length - 1)) / founders.length, y = 2.0;
  founders.forEach((f, i) => {
    const x = MX + i * (cw + gap);
    const parts = f.name.split(" ");
    const initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    s.addText(initials, {
      shape: pptx.ShapeType.roundRect, rectRadius: 0.08, x, y, w: 1.1, h: 1.1, margin: 0,
      fill: { color: c.sheet }, line: { color: c.rule, width: 0.75 },
      align: "center", valign: "middle", fontFace: F.display, fontSize: 30, bold: true, color: c.accent,
    });
    text(s, f.name, { x, y: y + 1.4, w: cw, h: 0.45, fontFace: F.display, fontSize: 20, bold: true, color: c.ink });
    text(s, f.role.toUpperCase(), { x, y: y + 1.88, w: cw, h: 0.22, fontFace: F.mono, fontSize: 9, bold: true, charSpacing: 1.5, color: c.accent });
    text(s, DECK.team.experience[f.id] ?? f.focus, { x, y: y + 2.2, w: cw, h: 0.3, fontSize: 12, color: c.ink });
    text(s, f.bio, { x, y: y + 2.65, w: cw, h: 1.5, fontSize: 12.5, color: c.muted, lineSpacingMultiple: 1.3 });
    line(s, x, y + 4.15, cw, 0, c.rule);
    text(s, [
      { text: f.email, options: { hyperlink: { url: `mailto:${f.email}` }, color: c.ink, breakLine: true } },
      ...(f.linkedin ? [{ text: f.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), options: { hyperlink: { url: f.linkedin }, color: c.muted } }] : []),
    ], { x, y: y + 4.3, w: cw, h: 0.55, fontFace: F.mono, fontSize: 10, lineSpacingMultiple: 1.4 });
  });
});

// ================================================================== 6. SENIOR TEAM

add(BONE, (s, c) => {
  const t = DECK.team;
  eyebrow(s, c, t.seniorEyebrow);
  title(s, c, t.seniorHeading, { w: 5.0 });
  text(s, t.seniorLede, { x: MX, y: 1.75, w: CW * 0.62, h: 0.8, fontSize: 14, color: c.ink, lineSpacingMultiple: 1.25 });
  const gap = 0.45, cw = (CW - gap * (t.senior.length - 1)) / t.senior.length, y = 2.9;
  t.senior.forEach((m, i) => {
    const x = MX + i * (cw + gap);
    line(s, x, y, cw, 0, c.rule);
    line(s, x, y, 0.7, 0, c.accent, 2.25);
    text(s, m.name, { x, y: y + 0.35, w: cw, h: 0.4, fontFace: F.display, fontSize: 20, bold: true, color: c.ink });
    text(s, `${m.role}  ·  ${m.focus}`.toUpperCase(), { x, y: y + 0.8, w: cw, h: 0.22, fontFace: F.mono, fontSize: 9, bold: true, charSpacing: 1.5, color: c.accent });
    text(s, m.years, { x, y: y + 1.15, w: cw, h: 0.55, fontFace: F.display, fontSize: 26, bold: true, color: c.ink });
    text(s, m.bio, { x, y: y + 1.85, w: cw, h: 1.9, fontSize: 12.5, color: c.muted, lineSpacingMultiple: 1.3 });
  });
});

// ================================================================== 7. WHAT WE DO

add(DARK, (s, c) => {
  const d = DECK.practiceOverview;
  eyebrow(s, c, d.eyebrow);
  title(s, c, d.heading, { w: 5.2, h: 1.4 });
  text(s, d.lede, { x: MX, y: 2.3, w: 4.8, h: 1.8, fontSize: 15, color: c.muted, lineSpacingMultiple: 1.3 });

  const counts = practices.map((p) => p.work.length);
  const max = Math.max(...counts);
  const x = 5.9, w = W - MX - x, rowH = 0.96, y0 = 1.3;
  practices.forEach((p, i) => {
    const y = y0 + i * rowH;
    line(s, x, y, w, 0, c.rule);
    text(s, pad(i + 1), { x, y: y + 0.3, w: 0.5, h: 0.3, fontFace: F.mono, fontSize: 10, color: c.accent });
    text(s, p.name, { x: x + 0.6, y: y + 0.24, w: 4.2, h: 0.4, fontFace: F.display, fontSize: 21, bold: true, color: c.ink });
    if (p.lead) text(s, "LEAD PRACTICE", { x: x + 0.6, y: y + 0.62, w: 4.2, h: 0.2, fontFace: F.mono, fontSize: 7.5, bold: true, charSpacing: 1.5, color: c.accent });
    const bx = x + 4.9, bw = w - 4.9 - 1.0;
    rect(s, bx, y + 0.45, bw, 0.07, { fill: { color: c.ruleFaint } });
    rect(s, bx, y + 0.45, Math.max(0.05, bw * (p.work.length / max)), 0.07, { fill: { color: c.accent } });
    text(s, pad(p.work.length), { x: x + w - 0.75, y: y + 0.18, w: 0.75, h: 0.45, fontFace: F.display, fontSize: 24, bold: true, color: c.ink, align: "right" });
    text(s, "CASE STUDIES", { x: x + w - 1.3, y: y + 0.62, w: 1.3, h: 0.2, fontFace: F.mono, fontSize: 7, charSpacing: 1.5, color: c.faint, align: "right" });
  });
  line(s, x, y0 + practices.length * rowH, w, 0, c.rule);
});

// ================================================================== 8+. PRACTICE + ITS WORK

let tone = BONE;
const flip = () => (tone = tone === BONE ? DARK : BONE);

practices.forEach((practice, pi) => {
  // -- the practice itself
  add(tone, (s, c) => {
    eyebrow(s, c, `05  What we do  ·  ${pad(pi + 1)} / ${pad(practices.length)}`);
    title(s, c, practice.name, { w: 6.6 });
    if (practice.lead) tag(s, c, "Lead practice", MX, 1.72);
    const sy = practice.lead ? 2.2 : 1.85;
    text(s, practice.summary, { x: MX, y: sy, w: 5.5, h: 2.3, fontSize: 14, color: c.ink, lineSpacingMultiple: 1.3 });

    if (practice.work.length) {
      const wy = sy + blockH(practice.summary, 5.5, 14, 1.3) + 0.45;
      label(s, c, DECK.caseStudy.worksLabel, MX, wy, 5.5);
      text(s, practice.work.map((p, i) => ({ text: shortTitle(p), options: { breakLine: i < practice.work.length - 1 } })), {
        x: MX, y: wy + 0.3, w: 5.5, h: 0.34 * practice.work.length, fontFace: F.display, fontSize: 13, bold: true, color: c.accent, lineSpacingMultiple: 1.3,
      });
    }

    const x = 6.85, w = W - MX - x, y0 = 1.8;
    label(s, c, "How we help", x, y0 - 0.02, w);
    const rowH = Math.min(0.72, (BOTTOM - y0 - 0.3) / practice.helps.length);
    practice.helps.forEach((h, k) => {
      const y = y0 + 0.3 + k * rowH;
      line(s, x, y, w, 0, c.rule);
      text(s, pad(k + 1), { x, y, w: 0.45, h: rowH, fontFace: F.mono, fontSize: 9, color: c.accent, valign: "middle" });
      text(s, h, { x: x + 0.5, y, w: w - 0.5, h: rowH, fontSize: 12, color: c.ink, valign: "middle" });
    });
    line(s, x, y0 + 0.3 + practice.helps.length * rowH, w, 0, c.rule);
  });
  flip();

  // -- one slide per project in this practice
  practice.work.forEach((p, i) => {
    add(tone, (s, c) => {
      eyebrow(s, c, `05  ${practice.name}  ·  case study ${pad(i + 1)} / ${pad(practice.work.length)}`);
      const main = shortTitle(p), sub = subTitle(p), long = main.length > 28;
      const lw = 5.6;
      text(s, main, { x: MX, y: 0.85, w: lw, h: long ? 0.95 : 0.6, fontFace: F.display, fontSize: long ? 23 : 32, bold: true, color: c.ink, lineSpacingMultiple: 0.95 });
      if (sub) text(s, sub, { x: MX, y: 1.52, w: lw, h: 0.35, fontSize: 15, color: c.muted });

      line(s, MX, 1.98, lw, 0, c.rule);
      text(s, [clientLine(p), String(p.year), p.duration, p.status].join("   ·   ").toUpperCase(), {
        x: MX, y: 2.1, w: lw, h: 0.4, fontFace: F.mono, fontSize: 8, charSpacing: 1, color: c.faint, lineSpacingMultiple: 1.3,
      });
      line(s, MX, 2.55, lw, 0, c.rule);

      const problem = clamp(p.problem, 520), outcome = clamp(p.outcome, 520);
      label(s, c, DECK.caseStudy.problemLabel, MX, 2.75, lw, { color: c.accent, bold: true });
      text(s, problem, { x: MX, y: 3.02, w: lw, h: 1.9, fontSize: 11.5, color: c.ink, lineSpacingMultiple: 1.25 });

      const oy = Math.min(3.02 + blockH(problem, lw, 11.5) + 0.42, BOTTOM - 0.3 - blockH(outcome, lw, 11.5));
      label(s, c, DECK.caseStudy.outcomeLabel, MX, oy, lw, { color: c.accent, bold: true });
      text(s, outcome, { x: MX, y: oy + 0.27, w: lw, h: BOTTOM - oy - 0.27, fontSize: 11.5, color: c.ink, lineSpacingMultiple: 1.25 });

      const x = 6.85, w = W - MX - x;
      const cover = coverPath(p);
      const metrics = (p.metrics ?? []).slice(0, 4);
      if (cover && fs.existsSync(cover)) {
        const ih = w * 9 / 16;
        s.addImage({ path: cover, x, y: 0.55, w, h: ih });
        rect(s, x, 0.55, w, ih, { fill: { type: "none" }, line: { color: c.rule, width: 0.75 } });
        metricGrid(s, c, metrics, x, 0.55 + ih + 0.45, w, BOTTOM - (0.55 + ih + 0.45));
      } else {
        seriesChart(s, c, p, x, 0.6, w, 3.1);
        metricGrid(s, c, metrics, x, 4.2, w, BOTTOM - 4.2);
      }
    });
    flip();
  });
});

// ================================================================== CLIENT VOICES

add(tone, (s, c) => {
  eyebrow(s, c, DECK.clients.eyebrow);
  title(s, c, DECK.clients.heading);
  const cols = Math.min(2, testimonials.length), rows = Math.ceil(testimonials.length / cols);
  const gap = 0.3, cw = (CW - gap * (cols - 1)) / cols, y0 = 1.8, ch = (BOTTOM - y0 - gap * (rows - 1)) / rows;
  testimonials.forEach((p, i) => {
    const x = MX + (i % cols) * (cw + gap), y = y0 + Math.floor(i / cols) * (ch + gap);
    const t = p.testimonial, px = x + 0.4, pw = cw - 0.8;
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: cw, h: ch, rectRadius: 0.05, fill: { color: c.sheet }, line: { type: "none" } });
    rect(s, x, y + 0.3, 0.05, ch - 0.6, { fill: { color: c.accent } });
    text(s, shortTitle(p).toUpperCase(), { x: px, y: y + 0.28, w: pw, h: 0.2, fontFace: F.mono, fontSize: 7.5, bold: true, charSpacing: 1.2, color: c.accent });
    const len = t.quote.length;
    text(s, `“${t.quote}”`, { x: px, y: y + 0.56, w: pw, h: ch - 1.2, fontFace: F.display, fontSize: len > 250 ? 11.5 : len > 150 ? 12 : 17, color: c.ink, lineSpacingMultiple: 1.12 });
    text(s, t.author, { x: px, y: y + ch - 0.62, w: pw, h: 0.24, fontSize: 11, bold: true, color: c.ink });
    label(s, c, t.role, px, y + ch - 0.36, pw, { fontSize: 7.5, charSpacing: 1 });
  });
});
flip();

// ================================================================== HOW WE WORK

add(tone, (s, c) => {
  eyebrow(s, c, "07  Method");
  title(s, c, msg.about.processHeading);
  const gap = 0.4, cw = (CW - gap * (process_.length - 1)) / process_.length, y = 2.0;
  line(s, MX, y, CW, 0, c.rule);
  process_.forEach((p, i) => {
    const x = MX + i * (cw + gap);
    s.addShape(pptx.ShapeType.ellipse, { x: x - 0.001, y: y - 0.08, w: 0.16, h: 0.16, fill: { color: c.accent }, line: { color: c.bg, width: 3 } });
    text(s, pad(i + 1), { x, y: y + 0.35, w: cw, h: 0.8, fontFace: F.display, fontSize: 48, bold: true, color: c.accent });
    text(s, p.step, { x, y: y + 1.25, w: cw, h: 0.8, fontFace: F.display, fontSize: 20, bold: true, color: c.ink });
    text(s, p.detail, { x, y: y + 2.1, w: cw, h: 2.6, fontSize: 12, color: c.muted, lineSpacingMultiple: 1.3 });
  });
});
flip();

// ================================================================== ENGAGEMENT MODELS

add(tone, (s, c) => {
  eyebrow(s, c, "07  Engagement models");
  title(s, c, msg.services.engagementHeading);
  const gap = 0.3, cw = (CW - gap * (engagements.length - 1)) / engagements.length, y = 1.85, h = 5.05, padX = 0.32;
  engagements.forEach((e, i) => {
    const x = MX + i * (cw + gap);
    const hero = i === 1;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: cw, h, rectRadius: 0.06,
      fill: { color: hero ? c.sheet : c.bg }, line: { color: hero ? c.accent : c.rule, width: hero ? 1.25 : 0.75 },
    });
    text(s, e.kind.toUpperCase(), { x: x + padX, y: y + 0.32, w: cw - 2 * padX, h: 0.2, fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1.5, color: c.accent });
    const twoLine = e.name.length > 16;
    text(s, e.name, { x: x + padX, y: y + 0.6, w: cw - 2 * padX, h: twoLine ? 0.9 : 0.5, fontFace: F.display, fontSize: 24, bold: true, color: c.ink });
    text(s, e.summary, { x: x + padX, y: y + (twoLine ? 1.55 : 1.25), w: cw - 2 * padX, h: 2.8, fontSize: 11, color: c.muted, lineSpacingMultiple: 1.25 });
    line(s, x + padX, y + 4.1, cw - 2 * padX, 0, c.rule);
    label(s, c, msg.services.termsLabel, x + padX, y + 4.22, cw - 2 * padX);
    text(s, e.terms, { x: x + padX, y: y + 4.45, w: cw - 2 * padX, h: 0.5, fontSize: 11, color: c.ink });
  });
});
flip();

// ================================================================== COMMITMENTS

add(tone, (s, c) => {
  eyebrow(s, c, "07  What you get");
  title(s, c, msg.about.commitmentsHeading);
  const gap = 0.4, cw = (CW - gap * (commitments.length - 1)) / commitments.length, y = 2.25;
  commitments.forEach((m, i) => {
    const x = MX + i * (cw + gap);
    line(s, x, y, cw, 0, c.rule);
    line(s, x, y, 0.6, 0, c.accent, 2.25);
    text(s, pad(i + 1), { x, y: y + 0.3, w: cw, h: 0.3, fontFace: F.mono, fontSize: 11, color: c.accent });
    text(s, m.name, { x, y: y + 0.75, w: cw, h: 0.8, fontFace: F.display, fontSize: 20, bold: true, color: c.ink, lineSpacingMultiple: 1.0 });
    text(s, m.detail, { x, y: y + 1.7, w: cw, h: 2.9, fontSize: 12, color: c.muted, lineSpacingMultiple: 1.3 });
  });
});
flip();

// ================================================================== FAQ

add(tone, (s, c) => {
  eyebrow(s, c, DECK.faq.eyebrow);
  title(s, c, msg.home.faqHeading);
  const cols = 2, rows = Math.ceil(deckFaqs.length / cols), gap = 0.5;
  const cw = (CW - gap) / cols, y0 = 1.65, rh = (BOTTOM - y0) / rows;
  deckFaqs.forEach((f, i) => {
    const x = MX + (i % cols) * (cw + gap), y = y0 + Math.floor(i / cols) * rh;
    line(s, x, y, cw, 0, c.rule);
    const qh = f.q.length > 58 ? 0.48 : 0.26;
    text(s, f.q, { x, y: y + 0.14, w: cw, h: qh, fontFace: F.display, fontSize: 13, bold: true, color: c.ink });
    text(s, f.a, { x, y: y + 0.22 + qh, w: cw, h: rh - 0.3 - qh, fontSize: 10, color: c.muted, lineSpacingMultiple: 1.2 });
  });
});

// ================================================================== CONTACT

add(DARK, (s, c) => {
  s.addImage({ path: path.join(ROOT, "public", "yellow-logo.png"), x: 9.35, y: 1.25, w: 3.2, h: 3.2 * (1303 / 1207) });
  eyebrow(s, c, DECK.contact.eyebrow, MX, 1.3);
  text(s, msg.contact.heading, { x: MX, y: 1.65, w: 8.2, h: 1.1, fontFace: F.display, fontSize: 64, bold: true, color: c.ink });
  text(s, msg.contact.metaDescription, { x: MX, y: 2.95, w: 7.2, h: 0.9, fontSize: 20, color: c.muted, lineSpacingMultiple: 1.2 });

  const a = company.address;
  const fields = [
    [msg.contact.emailLabel, [{ text: company.email, options: { hyperlink: { url: `mailto:${company.email}` } } }]],
    ["Phone", [{ text: company.phone, options: { hyperlink: { url: `tel:${company.phoneHref}` } } }]],
    ["Website", [{ text: "boltertech.com", options: { hyperlink: { url: "https://boltertech.com" } } }]],
    ["Office", [{ text: `${a.line1}, ${a.line2}, ${a.city}, ${a.countryName}`, options: { hyperlink: { url: a.googleMapsUrl } } }]],
  ];
  const fw = 4.0, fh = 1.05, y0 = 4.5;
  fields.forEach(([l, v], i) => {
    const x = MX + (i % 2) * (fw + 0.4), y = y0 + Math.floor(i / 2) * fh;
    line(s, x, y, fw, 0, c.rule);
    label(s, c, l, x, y + 0.14, fw);
    text(s, v, { x, y: y + 0.4, w: fw, h: 0.6, fontSize: i === 3 ? 11 : 15, color: c.ink, lineSpacingMultiple: 1.15 });
  });
});

// ================================================================== BUILD

slides.forEach(({ tone: c, build }, i) => {
  const s = pptx.addSlide();
  s.background = { color: c.bg };
  build(s, c);
  if (i > 0) {
    text(s, `${company.legalName}  ·  Company profile`.toUpperCase(), { x: MX, y: 7.08, w: 7, h: 0.18, fontFace: F.mono, fontSize: 7, charSpacing: 1.5, color: c.faint });
    text(s, `${pad(i + 1)} / ${pad(slides.length)}`, { x: W - MX - 2, y: 7.08, w: 2, h: 0.18, fontFace: F.mono, fontSize: 7, charSpacing: 1.5, color: c.faint, align: "right" });
  }
});

await pptx.writeFile({ fileName: OUT });
console.log("Wrote", OUT);
console.log("Slides:", slides.length, "| projects:", projects.length, "| testimonials:", testimonials.length);
practices.forEach((p) => console.log(`  ${p.name}: ${p.work.length} case studies`));
