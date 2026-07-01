# Working notes for this repo (JR-Tech × TechNext dossier)

## Response convention (always)
- **End every response with a "🔗 Links" section** listing all relevant links for what was just done:
  - The live 1-click preview(s) via raw.githack.com for any page created/edited.
  - The GitHub branch/commit link when something was pushed.
  - Deep-links to the specific page(s) touched this turn.
- Preview URL pattern (branch `claude/wizardly-mayer-ocjx0y`):
  `https://raw.githack.com/skytechnext/JRtechsky/claude/wizardly-mayer-ocjx0y/<path>`
- Permanent (once GitHub Pages is enabled): `https://skytechnext.github.io/JRtechsky/dossier/site/<path>`

## Project shape
- Static site (no build) in `dossier/site/` — shared sidebar in `assets/js/nav.js`, design tokens in
  `assets/css/app.css`. One HTML file per sidebar item; tools in `dossier/site/tools/`.
- Odoo 19 build kit in `odoo/` (`plan/`, `seed/`, `playbook/`).
- Develop/push on branch `claude/wizardly-mayer-ocjx0y`. Commit + push after each change.
- After edits, run the QA check: 0 broken internal links, every `<canvas>` has a matching Chart init,
  one `<body>` + nav include + correct `data-page` per page.
