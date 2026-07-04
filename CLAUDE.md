# Working notes for this repo

## Response preferences

- **Always show the relevant links in every response.** At the end of each
  reply, include a short **Links** list with:
  - the repository — https://github.com/skytechnext/JRtechsky
  - the current working branch (link to its tree on GitHub)
  - the live website / preview URL. Until GitHub Pages is enabled, use the
    instant githack preview (works now, no setup):
    https://raw.githack.com/skytechnext/JRtechsky/claude/pensive-einstein-dlerlg/index.html
    Once Pages is on, the permanent URL is https://skytechnext.github.io/JRtechsky/
  Keep the links clickable so the site can be previewed in one click.

## Project

This repo is the **consolidated digital portfolio of JR-Tech Solution Sdn Bhd**
(Penang commercial-kitchen provider). A static portal at the root (`index.html`)
links to four self-contained properties, all deployed together to GitHub Pages via
`.github/workflows/deploy.yml` (`.nojekyll` keeps every path served as-is).

- Live site: https://skytechnext.github.io/JRtechsky/
- Folders: `dossier/` (flagship JR Tech Analysis: 65-page dossier + `dossier/odoo/` data
  kit; sidebar order = narrative arc defined in `dossier/site/assets/js/nav.js`, which also
  drives every page's prev/next pagenav — regenerate pagenavs after reordering the menu),
  `estimator/` (kitchen estimator tool), `sales/` (sales kit), `marketing/` (bespoke
  marketing site), `website/` (static archive of jrtech.com.my). Each property is
  self-contained with relative paths.
- When combining work from sibling `claude/*` branches, import each into its own
  top-level folder and route to it from the portal — keep the pieces self-contained.
