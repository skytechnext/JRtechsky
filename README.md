# JR-Tech × TechNext — Odoo 19 ERP Engagement Dossier

A comprehensive due-diligence, strategy and **Odoo 19 ERP implementation** dossier for
**JR-Tech Solution Sdn Bhd** (SSM 200901013633), prepared by **TechNext**. Plus a ready-to-run
Odoo 19 demo-data blueprint a future AI agent can load via MCP / XML-RPC.

## ▶ 1-click website preview (no setup)

Live preview of the current branch via raw.githack.com (reflects the latest push):

**👉 https://raw.githack.com/skytechnext/JRtechsky/claude/wizardly-mayer-ocjx0y/dossier/site/index.html**

> Tip: githack serves the whole branch tree with correct content-types, so all sidebar links,
> CSS, charts and Mermaid diagrams work. It updates a few minutes after each push.

### Optional: permanent GitHub Pages URL
Settings → Pages → Build from branch → `claude/wizardly-mayer-ocjx0y` → `/ (root)` → Save.
The root `index.html` redirects to `dossier/site/index.html`. Your URL will be
`https://skytechnext.github.io/JRtechsky/dossier/site/index.html`.

## Structure
- `dossier/site/` — the static dossier (no build step): `index.html`, `assets/` (design system + shared
  sidebar `nav.js`), `pages/<group>/` (43 section pages), `tools/` (12 interactive tools & docs).
- `odoo/` — Odoo 19 build kit: `plan/` (implementation plan), `seed/` (30+ CSV/JSON demo-data
  files + `SCHEMA.md`), `playbook/load-order.md` (MCP/XML-RPC load sequence).

## View locally
Open `dossier/site/index.html` in a browser, or `cd dossier/site && python3 -m http.server` then visit
`http://localhost:8000`.
