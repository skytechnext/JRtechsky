# PAGE BUILD KIT — read before building any page

Every page is a standalone static HTML file. **No build step.** Follow this skeleton EXACTLY so
the shared sidebar, design system, breadcrumbs and active-state all work.

## Skeleton for a page under `site/pages/<group>/<slug>.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PAGE TITLE — JR-Tech × TechNext</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>window.SITE_ROOT="../../";</script>   <!-- pages are 2 dirs deep -->
<link rel="stylesheet" href="../../assets/css/app.css">
</head>
<body data-page="SLUG">   <!-- SLUG must match nav.js exactly -->
<div class="app">
  <aside id="sidebar"></aside>
  <div class="content">
    <div class="topbar"><div class="wrap">
      <div class="crumb"><b>GROUP</b> · PAGE TITLE</div>
      <div class="cobrand">TechNext <span class="x">×</span> JR-Tech</div>
    </div></div>
    <header class="hero"><div class="wrap">
      <span class="eyebrow">GROUP</span>
      <h1>PAGE H1</h1>
      <p>One-paragraph framing of what this page proves and why it matters to the engagement.</p>
    </div></header>
    <main class="wrap">
      <!-- SECTIONS: use <section class="section">, cards, .grid g2/g3/g4, table.tbl,
           .kpi, .callout, .steps, .chartbox (Chart.js), .mermaid (diagrams) -->
      <div class="pagenav">
        <a href="PREV.html">← Prev</a>
        <a href="NEXT.html">Next →</a>
      </div>
      <footer class="site"><div>© 2026 TechNext · Confidential — JR-Tech Solution Sdn Bhd.</div></footer>
    </main>
  </div>
</div>
<script src="../../assets/js/nav.js"></script>
<script>mermaid.initialize({startOnLoad:true, theme:'neutral'});</script>
<!-- page-specific Chart.js init here -->
</body>
</html>
```

## Path rules (CRITICAL)
- `site/pages/<group>/<slug>.html` → `SITE_ROOT="../../"`, css/js at `../../assets/...`
- `site/tools/<slug>.html` → `SITE_ROOT="../"`, css/js at `../assets/...`
- `site/index.html` → no SITE_ROOT, css/js at `assets/...`
- `data-page` MUST equal the `slug` in `nav.js` or the active highlight breaks.

## Design system (from app.css — DO NOT invent new CSS unless necessary)
- Components available: `.hero .eyebrow`, `.section`, `.card`/`.card.pad-lg`, `.kpi`(.num/.lbl/.delta up|down),
  `.grid.g2|g3|g4`, `table.tbl`, `.tag`(.green|.warn|.red), `.callout`(.tn|.warn), `.steps`(ol),
  `.chartbox`(canvas), `.mermaid`, `.pagenav`.
- Brand: navy `#0B1F3A`, blue `#7FA9DE`, TechNext green `#16C098`. Premium consulting tone.
- Use Chart.js for quantitative visuals and Mermaid for BPMN/flow/SWOT/UML/Gantt. Aim for
  2–4 visuals per page. No leftover "Lorem", "TODO", "TBD".

## Quality bar
- Each page = a genuinely comprehensive consulting artifact: tight narrative + tables + visuals +
  a "so what for the Odoo build" tie-in. Cross-link to related pages. Write in confident, specific
  prose grounded in CLIENT_FACTS.md and the research pack — no generic filler.
