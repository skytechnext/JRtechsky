# Kitchen Estimator — Auntie Gaik Lean × JR Tech

A single-page, zero-dependency **kitchen economics estimator** built by **JR Tech**
for **Auntie Gaik Lean's Old School Eatery** (a Michelin-starred Peranakan restaurant
in George Town, Penang).

Everything recalculates live as you type. Nothing is sent anywhere — your inputs are
saved only in your own browser (`localStorage`).

## 🔗 Preview the site (one click)

- **Live site (GitHub Pages):** **https://skytechnext.github.io/JRtechsky/**
  — published automatically by [`.github/workflows/pages.yml`](.github/workflows/pages.yml) on every push.
- **Instant preview, no setup** (renders this branch straight from GitHub):
  [open the estimator »](https://htmlpreview.github.io/?https://github.com/skytechnext/JRtechsky/blob/claude/pensive-einstein-dlerlg/index.html)
- **Locally:** just open `index.html` in any browser — no build step.

---

## What it does

The tool flows as six numbered "stations", in dependency order — each one feeds the
profit roll-ups at the end.

| # | Station | What it gives you |
|---|---------|-------------------|
| **01** | **Kitchen metrics & KPIs** | Monthly revenue, covers, average check, food cost, **prime cost** (with healthy/amber/over-budget tinting), revenue per seat, revenue per labour ringgit, gross profit & margin, seat turns/day. |
| **02** | **Monthly detergent & disposables** | An editable line-item table for cleaning chemicals and single-use service items — pack cost × units/month → monthly spend, each item's share, and cost per cover / per day. |
| **03** | **Equipment life plan & replacement** | For every asset: install date, cost, useful life → **replacement date**, a monthly **sinking-fund reserve**, and an *On plan / Due / Replace now* status. |
| **04** | **Inventory depreciation** | Straight-line book value across the **same** assets: salvage %, age, annual & accumulated depreciation, current **book value**, and remaining-life bars. Feeds a non-cash depreciation charge into the F&B P&L. |
| **05** | **Profit estimator — F&B operator** | The eatery's monthly P&L: revenue less food, payroll, rent, utilities, consumables (02), depreciation (04) and overheads → **net profit**, net margin, annual profit, and **break-even covers/day**. |
| **06** | **Profit estimator — JR Tech** | The vendor's side of the same account: recurring revenue (subscription + support + hardware lease) less cost-to-serve → **net recurring profit**, recurring margin, one-time setup margin, account value over the contract, and the **client's ROI** (net saving, payback on setup, first-year return). |

### Two profit estimators, one kitchen
- **Station 05 (gold)** answers *"is the restaurant making money?"*
- **Station 06 (cobalt)** answers *"is JR Tech making money on this account — and is the client getting their money back?"*

---

## How to use it

- **Edit any field** — every input recalculates the whole page instantly.
- **Add / remove rows** in the consumables and equipment tables with the `+ Add` buttons and the `×` on each row.
- **Currency** — switch between RM / S$ / $ / € in the top bar (symbol only; no FX conversion).
- **Print / PDF** — the top-bar button opens a clean print layout (controls hidden) for sharing an estimate.
- **Reset** — restores the seeded figures and clears saved data.
- **Your data stays local** — saved to this browser only, never uploaded.

The figures shipped in the tool are realistic placeholders for a ~44-seat operation;
edit them to match the real account.

---

## The formulas (so the numbers are auditable)

```
Covers / month        = covers/day × operating days/month
Revenue               = covers/month × average check
Food cost             = revenue × food-cost %
Prime cost            = food cost + payroll          (healthy < 65% of revenue)
Consumables / month   = Σ (pack cost × units/month)

Equipment reserve/mo  = cost ÷ (life in years × 12)        — full replacement sinking fund
Replacement date      = install date + useful life
Annual depreciation   = (cost − salvage value) ÷ useful life   — straight line
Accumulated dep.      = annual depreciation × age   (capped at cost − salvage)
Book value            = cost − accumulated depreciation
Monthly dep. charge   = total annual depreciation ÷ 12        — flows into the F&B P&L

F&B net profit        = revenue − food − payroll − rent − utilities
                                − consumables − depreciation − overheads
Break-even covers/day = fixed costs ÷ contribution per cover ÷ operating days

JR recurring revenue  = subscription + support retainer + hardware lease
JR cost to serve      = infrastructure + (support hours × hourly cost)
                                + hardware amortisation + payment processing
JR net recurring      = recurring revenue − cost to serve
Account value         = setup margin + (JR net recurring × contract months)

Client net saving/mo  = estimated saving − JR recurring fee
Payback on setup      = setup fee ÷ client net saving
```

> **Depreciation vs reserve** are shown separately and never double-counted: depreciation
> is the *non-cash* cost of assets wearing out (it sits in the P&L); the reserve is *real
> cash* set aside to replace them (a cash-flow item).

---

## Deploy to GitHub Pages

This is a static site — no build step. Deployment is automated:

- [`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs on every push to
  this branch (and on demand via **Actions → Run workflow**). It enables Pages on the
  first run and publishes the site to **https://skytechnext.github.io/JRtechsky/**.
- The first run needs Actions to be allowed to manage Pages. If it doesn't appear,
  set **Settings → Pages → Source: GitHub Actions** once, then re-run the workflow.

## Customising the seeded numbers

All defaults live in the `DEFAULTS` object at the top of [`app.js`](app.js) — kitchen
assumptions, the consumables list, the equipment register, and the JR Tech commercials.
Edit them there to change what every visitor sees on first load.

## Project files

```
index.html   structure & content
styles.css   design system (Peranakan jade / brass / cobalt, porcelain panels)
app.js       state, live computation (pure compute()), persistence, rendering
```

---

*Estimates only — not financial advice. Built by JR Tech.*
