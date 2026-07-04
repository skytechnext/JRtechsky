# JR-Tech Solution — Consolidated Digital Portfolio

Everything built for **JR-Tech Solution Sdn Bhd** (SSM 200901013633) — Malaysia's
one-stop commercial kitchen partner in Gelugor, Penang — gathered into a single,
zero-build static site. A portal at the root routes to four properties, and the whole
repository deploys together to GitHub Pages.

## 🔗 Preview (one click)

- **Instant preview — works now, no setup:**
  **https://raw.githack.com/skytechnext/JRtechsky/claude/pensive-einstein-dlerlg/index.html**
- **Permanent home (GitHub Pages):** https://skytechnext.github.io/JRtechsky/
  — enable once at **Settings → Pages → Deploy from a branch → `claude/pensive-einstein-dlerlg` → `/ (root)`**,
  or set **Source: GitHub Actions** to use [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
- **Locally:** open `index.html` — no build step.

## What's inside

| # | Property | Folder | What it is |
|---|----------|--------|------------|
| 01 | **JR Tech Analysis (dossier)** | [`dossier/`](dossier/) | The flagship: 65-page analysis + Odoo 19 plan — Start Here/Pitch, Kitchen Workflow (JR-Tech Method), strategy, operations, technology, delivery, tools, plus the `dossier/odoo/` demo-data build kit. |
| 02 | **Kitchen Estimator** | [`estimator/`](estimator/) | Live kitchen-economics tool — KPIs, consumables, equipment life plan, depreciation, dual profit estimators. |
| 03 | **Sales Kit** | [`sales/`](sales/) | Presentation-ready sales material for owner meetings. |
| 04 | **Marketing Website** | [`marketing/`](marketing/) | Bespoke, conversion-focused site with full SEO + marketing plan. |
| 05 | **Current Website (archive)** | [`website/`](website/) | Static capture of the live `jrtech.com.my` — catalog, projects, about, contact. |

The portal page is [`index.html`](index.html) at the root.

## How the branches were combined

Five Claude working branches each produced a separate deliverable for the same client.
This branch consolidates them so they serve as **one site under one URL**:

- The four built deliverables were moved into their own top-level folders (above), each
  self-contained with relative paths, so links and assets keep working in place.
- A new **portal** (`index.html`) introduces JR-Tech and links to all four.
- `lucid-mendel` is used as the canonical site archive (the most complete mirror, 225
  catalog pages); `peaceful-goodall` was an earlier, partial mirror whose *portal idea* is
  carried forward and upgraded here, so nothing of value is lost.
- A single [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publishes the
  whole repo; `.nojekyll` keeps every path (including `_research/`) served verbatim.

## Layout

```
index.html              ← portal / front door
.nojekyll               ← serve every path as-is on Pages
.github/workflows/      ← deploy whole repo to Pages
estimator/              ← 02 · kitchen estimator (index.html, styles.css, app.js)
marketing/              ← 01 · bespoke marketing site + MARKETING-PLAN.md
dossier/                ← 03 · Odoo 19 dossier (site/) + demo-data kit (odoo/)
website/                ← 04 · static archive of jrtech.com.my
```

---

*Static, zero-build. Assembled by JR Tech / TechNext (technext.asia). Estimates and
projections are illustrative, not financial advice.*
