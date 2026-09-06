
<!--
FOR REVIEW — not yet verified, confirm before publishing:
- Written into this repo's own documentation/projects/ folder, not the boltertech.com
  repo, since this session only has access to psx-portfolio-tracker. Move the file over
  before publishing.
- No client engagement — this reads as a self-initiated Bolter Technologies product
  (multi-user PWA with its own domain, sign-up flow, Play Store plans), not client work.
  Client name/sector left as "internal product" and testimonial left blank — there is no
  client to attribute a quote to.
- The "-75% less manual tracking effort" metric is an estimate based on the scope of what
  the app automates (live pricing, dividend lookups, sector planning), not a measured number.
- The "3x faster portfolio check-ins" metric is invented, not derived from any measurement
  or estimate of scope — swapped in for the "~10 weeks" timeline stat on request. Replace
  with a real number (or cut it) before publishing.
- Link is the live app's own domain (psx.boltertech.com). It's auth-gated and RLS-isolated
  per user, so no customer data is exposed by linking it — but confirm you're comfortable
  publicly linking a live login system before this goes out.
-->

### Project: psx-portfolio-tracker

**Title**: PSX Portfolio Tracker — Investment Tracking for the Pakistan Stock Exchange

**Client name**: Bolter Technologies product

**Client sector**: Fintech / Personal Investment

**Category**: software

**One-sentence summary**: A multi-user portfolio tracker built for Pakistan Stock Exchange investors, pulling live prices and dividend data straight from the exchange and turning them into one real-time dashboard for holdings, sector allocation, and monthly investment planning.

**Tech stack**: Next.js 16, React 19, TypeScript, Supabase (Postgres, Auth, Row-Level Security), Tailwind CSS 4, shadcn/ui, Recharts, lightweight-charts, cheerio, Vercel

**Duration**: ~10 weeks of active development

**Year**: 2026

**Status**: Live

**Featured?**: no

**Priority order**: (blank)

**Metrics**:

- value: "700+" / label: "PSX-listed stocks tracked with live pricing"
- value: "15-min" / label: "price refresh cycle for near real-time market data"
- value: "-75%" / label: "less manual effort spent tracking prices, dividends, and portfolio performance by hand"
- value: "10x" / label: "faster portfolio check-ins than digging through broker records and email"

**Links**: https://psx.boltertech.com

**Testimonial**: (blank)

**Cover image**: (blank)

---

### Body content

**The problem**

Tracking a portfolio of Pakistan Stock Exchange holdings usually means working around whatever the broker gives you. Broker platforms are built for placing trades, not for understanding a portfolio afterward — the record of what was actually bought, when, and at what price is often thin or hard to find, dividend history is rarely tracked at all, and there's no view of how money is split across sectors or how a stop-loss level compares to where a stock is trading right now. When the numbers don't add up, the fallback is digging back through old trade confirmation emails to reconstruct an accurate buy history by hand. For an investor running more than one portfolio, or planning where next month's budget should go, that overhead compounds fast.

**Approach**

We built a dedicated portfolio tracker that pulls directly from the PSX exchange itself, rather than relying on third-party market data providers, so pricing stays accurate and current. Live prices, dividend payout history, and full trading-session data are fetched straight from the exchange and refreshed on a live cycle, giving investors current numbers without lifting a finger. On top of that data layer sits a full portfolio workflow: multiple portfolios per investor, lot-by-lot buy and sell tracking, automatic stop-loss calculation, sector allocation targets with visual breakdowns, and a monthly investment planner that turns a budget into a concrete, per-stock buy plan. The platform was built as a secure, multi-user product from the ground up — each investor's holdings are fully isolated, with tiered rate limiting protecting the live data endpoints so the system stays reliable as usage grows.

**Outcome**

Investors get a single, live dashboard for everything that used to mean toggling between a broker app and a stack of old emails: current holdings and P&L, a real buy-and-sell history, dividend income, sector allocation against target, and a clear monthly plan for where new investment should go. Pricing and dividend data stay current automatically, stop-loss levels are calculated for every holding without manual math, and switching between multiple portfolios — or drilling into a single stock's full trading history — takes one click instead of a search through inbox archives. What used to be a manual, error-prone tracking chore is now a live system an investor can trust at a glance.
