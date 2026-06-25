/* TechNext × JR-Tech — shared sidebar. Single source of truth for the menu.
   Each page sets <body data-page="slug"> and includes this script + computes a relative root.
   Usage: place <script>window.SITE_ROOT="../../";</script> before this file on nested pages. */
(function () {
  var ROOT = window.SITE_ROOT || "";
  var MENU = [
    { group: "Overview", items: [
      { t: "Overview", href: "index.html", slug: "overview", root: true },
      { t: "Why AI is Important", href: "pages/overview/why-ai.html", slug: "why-ai" },
    ]},
    { group: "Executive", items: [
      { t: "Executive Summary", href: "pages/executive/executive-summary.html", slug: "executive-summary" },
      { t: "Due Diligence", href: "pages/executive/due-diligence.html", slug: "due-diligence" },
    ]},
    { group: "Company Profile", items: [
      { t: "Company Profile", href: "pages/company/company-profile.html", slug: "company-profile" },
      { t: "Product Catalog", href: "pages/company/product-catalog.html", slug: "product-catalog" },
      { t: "Founders & Leadership", href: "pages/company/founders-leadership.html", slug: "founders-leadership" },
      { t: "Staff & Org Analysis", href: "pages/company/staff-org.html", slug: "staff-org" },
      { t: "Digital & Web Presence", href: "pages/company/digital-presence.html", slug: "digital-presence" },
      { t: "Reviews & Reputation", href: "pages/company/reviews-reputation.html", slug: "reviews-reputation" },
    ]},
    { group: "Strategic Analysis", items: [
      { t: "PESTLE Analysis", href: "pages/strategy/pestle.html", slug: "pestle" },
      { t: "SWOT & TOWS", href: "pages/strategy/swot-tows.html", slug: "swot-tows" },
      { t: "Porter's Five Forces", href: "pages/strategy/porters.html", slug: "porters" },
      { t: "Competitor Deep-Dive", href: "pages/strategy/competitor-deepdive.html", slug: "competitor-deepdive" },
      { t: "Market & Industry", href: "pages/strategy/market-industry.html", slug: "market-industry" },
      { t: "Customer Personas", href: "pages/strategy/personas.html", slug: "personas" },
      { t: "Financial Snapshot & Valuation", href: "pages/strategy/financials.html", slug: "financials" },
      { t: "ESG & Sustainability", href: "pages/strategy/esg.html", slug: "esg" },
    ]},
    { group: "Operations", items: [
      { t: "Stakeholder Perspectives", href: "pages/operations/stakeholders.html", slug: "stakeholders" },
      { t: "Department Workflows", href: "pages/operations/dept-workflows.html", slug: "dept-workflows" },
      { t: "Pain → Solution Matrix", href: "pages/operations/pain-solution.html", slug: "pain-solution" },
      { t: "BPMN · Blueprint · UML", href: "pages/operations/bpmn-uml.html", slug: "bpmn-uml" },
      { t: "Value Chain & Capability Map", href: "pages/operations/value-chain.html", slug: "value-chain" },
    ]},
    { group: "Technology", items: [
      { t: "AI & Automation Catalog", href: "pages/technology/ai-catalog.html", slug: "ai-catalog" },
      { t: "AI in Action — Peer Story", href: "pages/technology/ai-peer-story.html", slug: "ai-peer-story" },
      { t: "Odoo 19 Architecture", href: "pages/technology/odoo-architecture.html", slug: "odoo-architecture" },
      { t: "Data Migration", href: "pages/technology/data-migration.html", slug: "data-migration" },
      { t: "Integration & API Map", href: "pages/technology/integration-map.html", slug: "integration-map" },
      { t: "Security, Compliance & MyInvois", href: "pages/technology/security-myinvois.html", slug: "security-myinvois" },
    ]},
    { group: "Delivery", items: [
      { t: "Implementation Roadmap", href: "pages/delivery/roadmap.html", slug: "roadmap" },
      { t: "Change Management", href: "pages/delivery/change-management.html", slug: "change-management" },
      { t: "Hypercare & Support", href: "pages/delivery/hypercare.html", slug: "hypercare" },
      { t: "Risk Register & RACI", href: "pages/delivery/risk-raci.html", slug: "risk-raci" },
      { t: "KPIs & Benefits", href: "pages/delivery/kpis-benefits.html", slug: "kpis-benefits" },
      { t: "Training & Enablement", href: "pages/delivery/training.html", slug: "training" },
    ]},
    { group: "Competitive Intel", items: [
      { t: "Top-3 Competitor Deep-Dive", href: "pages/intel/top3-competitors.html", slug: "top3-competitors" },
    ]},
    { group: "Growth & Strategy", items: [
      { t: "Pricing Strategy", href: "pages/growth/pricing.html", slug: "pricing" },
      { t: "Regional Expansion", href: "pages/growth/expansion.html", slug: "expansion" },
      { t: "Operations Strategy", href: "pages/growth/operations-strategy.html", slug: "operations-strategy" },
      { t: "Modern Alternative Services", href: "pages/growth/modern-services.html", slug: "modern-services" },
      { t: "Go-to-Market & Marketing", href: "pages/growth/gtm.html", slug: "gtm" },
    ]},
    { group: "Advisory", items: [
      { t: "Appendix & Sources", href: "pages/advisory/appendix.html", slug: "appendix" },
      { t: "Methodology & Assumptions", href: "pages/advisory/methodology.html", slug: "methodology" },
      { t: "Glossary", href: "pages/advisory/glossary.html", slug: "glossary" },
    ]},
    { group: "Tools & Documents", items: [
      { t: "AI Build Playbook", href: "tools/ai-build-playbook.html", slug: "ai-build-playbook", e: "📘" },
      { t: "Profit Estimator", href: "tools/profit-estimator.html", slug: "profit-estimator", e: "📊" },
      { t: "Owner FAQ", href: "tools/owner-faq.html", slug: "owner-faq", e: "💬" },
      { t: "Odoo Platform", href: "tools/odoo-platform.html", slug: "odoo-platform", e: "⚓" },
      { t: "Requirements (BRD)", href: "tools/brd.html", slug: "brd", e: "📑" },
      { t: "Quotation", href: "tools/quotation.html", slug: "quotation", e: "🧾" },
      { t: "Accounting Overhaul", href: "tools/accounting-overhaul.html", slug: "accounting-overhaul", e: "📒" },
      { t: "Demo Walkthrough", href: "tools/demo-walkthrough.html", slug: "demo-walkthrough", e: "🧭" },
      { t: "Staff Guides", href: "tools/staff-guides.html", slug: "staff-guides", e: "🛎" },
      { t: "Discovery Questions", href: "tools/discovery-questions.html", slug: "discovery-questions", e: "📋" },
      { t: "ROI / TCO Model", href: "tools/roi-tco.html", slug: "roi-tco", e: "🧮" },
      { t: "Project Gantt", href: "tools/gantt.html", slug: "gantt", e: "🗓" },
    ]},
    { group: "JR-Tech Properties", items: [
      { t: "Kitchen Estimator", href: "../../estimator/index.html", slug: "ext-estimator", e: "🍳", x: true },
      { t: "Marketing Website", href: "../../marketing/index.html", slug: "ext-marketing", e: "📣", x: true },
      { t: "Current Website", href: "../../website/index.html", slug: "ext-website", e: "🌐", x: true },
      { t: "Portal — all properties", href: "../../index.html", slug: "ext-portal", e: "🧭", x: true },
    ]},
  ];

  var active = document.body.getAttribute("data-page") || "";
  var html = '<div class="sb-brand"><div class="sb-logo"><span class="mark"></span>JR-TECH</div>'
    + '<div class="sb-sub">× TechNext · Odoo 19 Dossier</div></div>'
    + '<div class="sb-search"><input id="sbSearch" placeholder="Filter sections…" autocomplete="off"></div>';

  MENU.forEach(function (g) {
    html += '<div class="sb-group" data-group="1"><div class="sb-head">' + g.group + '</div>';
    g.items.forEach(function (it) {
      var href = ROOT + it.href;
      var cls = "sb-link" + (it.slug === active ? " active" : "");
      var emoji = it.e ? '<span class="emoji">' + it.e + "</span>" : "";
      var ext = it.x ? ' target="_blank" rel="noopener"' : "";
      html += '<a class="' + cls + '" href="' + href + '"' + ext + ' data-label="' + it.t.toLowerCase()
        + '">' + emoji + it.t + "</a>";
    });
    html += "</div>";
  });
  html += '<div class="sb-foot">Prepared by TechNext · Odoo Implementation Partner<br>'
    + 'Confidential — for JR-Tech Solution Sdn Bhd</div>';

  var sb = document.getElementById("sidebar");
  if (sb) { sb.innerHTML = html; }

  // mobile toggle
  var btn = document.createElement("button");
  btn.className = "sb-toggle"; btn.innerHTML = "☰";
  btn.onclick = function () { document.body.classList.toggle("nav-open"); };
  document.body.appendChild(btn);

  // filter
  var s = document.getElementById("sbSearch");
  if (s) s.addEventListener("input", function () {
    var q = this.value.toLowerCase();
    document.querySelectorAll("#sidebar .sb-link").forEach(function (a) {
      var hit = a.getAttribute("data-label").indexOf(q) > -1;
      a.style.display = hit ? "" : "none";
    });
    document.querySelectorAll("#sidebar .sb-group").forEach(function (gp) {
      var any = gp.querySelectorAll('.sb-link:not([style*="none"])').length;
      gp.querySelector(".sb-head").style.opacity = any ? "1" : ".3";
    });
  });

  // scroll active link into view
  var act = document.querySelector("#sidebar .sb-link.active");
  if (act) act.scrollIntoView({ block: "center" });
})();
