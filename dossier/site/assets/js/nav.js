/* TechNext × JR-Tech — shared sidebar. Single source of truth for the menu.
   Each page sets <body data-page="slug"> and includes this script + computes a relative root.
   Usage: place <script>window.SITE_ROOT="../../";</script> before this file on nested pages. */
(function () {
  var ROOT = window.SITE_ROOT || "";
  var MENU = [
    { group: "Start Here", items: [
      { t: "Overview", href: "index.html", slug: "overview", root: true },
      { t: "The Pitch — Owner to Owner", href: "pages/technology/why-odoo.html", slug: "why-odoo", e: "🤝" },
      { t: "Why AI is Important", href: "pages/overview/why-ai.html", slug: "why-ai" },
      { t: "TechNext Services & Roadmap", href: "pages/overview/technext-services.html", slug: "technext-services", e: "🛠" },
      { t: "Read Everything — Scroll Mode", href: "reader.html", slug: "reader", e: "📜" },
    ]},
    { group: "Executive", items: [
      { t: "Executive Summary", href: "pages/executive/executive-summary.html", slug: "executive-summary" },
      { t: "Due Diligence", href: "pages/executive/due-diligence.html", slug: "due-diligence" },
    ]},
    { group: "Kitchen Workflow — JR-Tech Method", items: [
      { t: "Reimagined Workflow", href: "pages/workflow/wf-overview.html", slug: "wf-overview", e: "🔄" },
      { t: "The First Meeting", href: "pages/workflow/wf-first-meeting.html", slug: "wf-first-meeting", e: "🤝" },
      { t: "Kitchen Blueprint Pack", href: "pages/workflow/wf-blueprint.html", slug: "wf-blueprint", e: "📐" },
      { t: "Blueprint Approval", href: "pages/workflow/wf-approval.html", slug: "wf-approval", e: "✅" },
      { t: "Operations Pack", href: "pages/workflow/wf-operations.html", slug: "wf-operations", e: "👨‍🍳" },
      { t: "Financial Pack", href: "pages/workflow/wf-financials.html", slug: "wf-financials", e: "💹" },
      { t: "JR-Tech Pack & Handover", href: "pages/workflow/wf-jrtech.html", slug: "wf-jrtech", e: "📦" },
      { t: "Sample — Blueprint (AGL)", href: "pages/workflow/sample-blueprint.html", slug: "smp-blueprint", e: "📄" },
      { t: "Sample — Operations (AGL)", href: "pages/workflow/sample-operations.html", slug: "smp-operations", e: "📄" },
      { t: "Sample — Financials (AGL)", href: "pages/workflow/sample-financials.html", slug: "smp-financials", e: "📄" },
      { t: "Sample — Handover (AGL)", href: "pages/workflow/sample-handover.html", slug: "smp-handover", e: "📄" },
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
      { t: "Market & Industry", href: "pages/strategy/market-industry.html", slug: "market-industry" },
      { t: "PESTLE Analysis", href: "pages/strategy/pestle.html", slug: "pestle" },
      { t: "SWOT & TOWS", href: "pages/strategy/swot-tows.html", slug: "swot-tows" },
      { t: "Porter's Five Forces", href: "pages/strategy/porters.html", slug: "porters" },
      { t: "Competitor Deep-Dive", href: "pages/strategy/competitor-deepdive.html", slug: "competitor-deepdive" },
      { t: "Top-3 Competitor Battlecards", href: "pages/intel/top3-competitors.html", slug: "top3-competitors" },
      { t: "Customer Personas", href: "pages/strategy/personas.html", slug: "personas" },
      { t: "Financial Snapshot & Valuation", href: "pages/strategy/financials.html", slug: "financials" },
      { t: "ESG & Sustainability", href: "pages/strategy/esg.html", slug: "esg" },
    ]},
    { group: "Operations", items: [
      { t: "Stakeholder Perspectives", href: "pages/operations/stakeholders.html", slug: "stakeholders" },
      { t: "Department Workflows", href: "pages/operations/dept-workflows.html", slug: "dept-workflows" },
      { t: "Department & Workflow Atlas", href: "pages/operations/department-atlas.html", slug: "department-atlas", e: "🗺" },
      { t: "Pain → Solution Matrix", href: "pages/operations/pain-solution.html", slug: "pain-solution" },
      { t: "BPMN · Blueprint · UML", href: "pages/operations/bpmn-uml.html", slug: "bpmn-uml" },
      { t: "Value Chain & Capability Map", href: "pages/operations/value-chain.html", slug: "value-chain" },
      { t: "Driver Incentive Scheme", href: "pages/operations/driver-incentive.html", slug: "driver-incentive", e: "🚛" },
    ]},
    { group: "Technology — The Odoo Solution", items: [
      { t: "Current Systems (SQL Account)", href: "pages/technology/current-systems.html", slug: "current-systems" },
      { t: "Odoo 19 Architecture", href: "pages/technology/odoo-architecture.html", slug: "odoo-architecture" },
      { t: "AI & Automation Catalog", href: "pages/technology/ai-catalog.html", slug: "ai-catalog" },
      { t: "AI in Action — Peer Story", href: "pages/technology/ai-peer-story.html", slug: "ai-peer-story" },
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
    { group: "Growth & Strategy", items: [
      { t: "Pricing Strategy", href: "pages/growth/pricing.html", slug: "pricing" },
      { t: "Regional Expansion", href: "pages/growth/expansion.html", slug: "expansion" },
      { t: "Operations Strategy", href: "pages/growth/operations-strategy.html", slug: "operations-strategy" },
      { t: "Modern Alternative Services", href: "pages/growth/modern-services.html", slug: "modern-services" },
      { t: "Go-to-Market & Marketing", href: "pages/growth/gtm.html", slug: "gtm" },
    ]},
    { group: "Advisory", items: [
      { t: "Meeting Minutes — 7 Nov 2026", href: "pages/advisory/meeting-minutes.html", slug: "meeting-minutes", e: "📝" },
      { t: "Appendix & Sources", href: "pages/advisory/appendix.html", slug: "appendix" },
      { t: "Methodology & Assumptions", href: "pages/advisory/methodology.html", slug: "methodology" },
      { t: "Glossary", href: "pages/advisory/glossary.html", slug: "glossary" },
    ]},
    { group: "Tools & Documents", items: [
      { t: "Profit Estimator", href: "tools/profit-estimator.html", slug: "profit-estimator", e: "📊" },
      { t: "ROI / TCO Model", href: "tools/roi-tco.html", slug: "roi-tco", e: "🧮" },
      { t: "Quotation", href: "tools/quotation.html", slug: "quotation", e: "🧾" },
      { t: "Requirements (BRD)", href: "tools/brd.html", slug: "brd", e: "📑" },
      { t: "Discovery Questions", href: "tools/discovery-questions.html", slug: "discovery-questions", e: "📋" },
      { t: "Owner FAQ", href: "tools/owner-faq.html", slug: "owner-faq", e: "💬" },
      { t: "Demo Walkthrough", href: "tools/demo-walkthrough.html", slug: "demo-walkthrough", e: "🧭" },
      { t: "Staff Guides", href: "tools/staff-guides.html", slug: "staff-guides", e: "🛎" },
      { t: "Accounting Overhaul", href: "tools/accounting-overhaul.html", slug: "accounting-overhaul", e: "📒" },
      { t: "Project Gantt", href: "tools/gantt.html", slug: "gantt", e: "🗓" },
      { t: "Odoo Platform", href: "tools/odoo-platform.html", slug: "odoo-platform", e: "⚓" },
      { t: "AI Build Playbook", href: "tools/ai-build-playbook.html", slug: "ai-build-playbook", e: "📘" },
      { t: "Team Harness — Run the Method", href: "tools/team-harness.html", slug: "team-harness", e: "🧠" },
      { t: "Offline & Install", href: "tools/offline.html", slug: "offline", e: "📥" },
    ]},
    { group: "JR-Tech Properties", items: [
      { t: "Kitchen Estimator", href: "../../estimator/index.html", slug: "ext-estimator", e: "🍳", x: true },
      { t: "Current Website", href: "../../website/index.html", slug: "ext-website", e: "🌐", x: true },
      { t: "Portal — all properties", href: "../../index.html", slug: "ext-portal", e: "🧭", x: true },
    ]},
  ];

  window.JR_MENU = MENU; window.JR_ROOT = ROOT;
  var l=document.createElement("link"); l.rel="manifest"; l.href=ROOT+"manifest.json"; document.head.appendChild(l);
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

  // show/hide toggle (mobile: slide-over; desktop: collapse, remembered)
  var isDesk = function () { return window.innerWidth > 1024; };
  var btn = document.createElement("button");
  btn.className = "sb-toggle"; btn.innerHTML = "\u2630";
  btn.setAttribute("aria-label", "Show menu");
  btn.onclick = function () {
    if (isDesk()) { document.body.classList.remove("nav-collapsed"); try{localStorage.setItem("jrNavHidden","0");}catch(e){} }
    else { document.body.classList.toggle("nav-open"); }
  };
  document.body.appendChild(btn);
  var brand = document.querySelector("#sidebar .sb-brand");
  if (brand) {
    var hide = document.createElement("button");
    hide.className = "sb-hide"; hide.innerHTML = "\u276E";
    hide.title = "Hide sidebar"; hide.setAttribute("aria-label", "Hide sidebar");
    hide.onclick = function () {
      if (isDesk()) { document.body.classList.add("nav-collapsed"); try{localStorage.setItem("jrNavHidden","1");}catch(e){} }
      else { document.body.classList.remove("nav-open"); }
    };
    brand.appendChild(hide);
  }
  try { if (localStorage.getItem("jrNavHidden") === "1" && isDesk()) document.body.classList.add("nav-collapsed"); } catch(e){}

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


  // ---- visual enhancements: reading progress + scroll reveal ----
  var bar = document.createElement("div"); bar.id = "readbar"; document.body.appendChild(bar);
  var onScroll = function () {
    var d = document.documentElement;
    var max = d.scrollHeight - d.clientHeight;
    bar.style.width = (max > 0 ? (d.scrollTop / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    var sel = ".content .card, .content .kpi, .content .chartbox, .content .mermaid, .content table.tbl, .content .callout";
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.classList.add("rv");
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      io.observe(el);
      // safety: reveal anything already in view after load
    });
    setTimeout(function () {
      document.querySelectorAll(".rv:not(.in)").forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
      });
    }, 600);
    // final safety net: never leave content invisible
    setTimeout(function () {
      document.querySelectorAll(".rv:not(.in)").forEach(function (el) { el.classList.add("in"); });
    }, 4000);
  }


  // ================= PROVENANCE BADGES =================
  // Every page declares where its content comes from, per the owner's requirement
  // to distinguish human / document / website / AI-modelled information.
  var PROV_DEFS = {
    human: ["🧑", "Human source", "Owner meetings, SKY first-party input, owner-provided specs"],
    doc:   ["📘", "Client documents", "JR-Tech 2024 brand book & business card"],
    web:   ["🌐", "Website", "jrtech.com.my and public web"],
    ai:    ["🤖", "AI-modelled", "AI analysis / estimates — validate in discovery"]
  };
  function provFor(slug, href) {
    var o = {
      "meeting-minutes": ["human", "ai"], "technext-services": ["human"],
      "why-odoo": ["human"], "driver-incentive": ["human", "ai"],
      "department-atlas": ["human", "ai"], "overview": ["doc", "ai"],
      "company-profile": ["doc", "web", "ai"], "product-catalog": ["doc", "web", "ai"],
      "founders-leadership": ["doc", "ai"], "staff-org": ["human", "ai"],
      "digital-presence": ["web", "ai"], "reviews-reputation": ["web", "ai"],
      "current-systems": ["human", "ai"], "reader": [], "offline": [],
      "team-harness": ["human", "ai"], "appendix": ["human", "doc", "web", "ai"],
      "methodology": ["human", "doc", "web", "ai"]
    };
    if (o[slug]) return o[slug];
    if (href.indexOf("pages/workflow/sample-") === 0) return ["ai", "doc"];
    if (href.indexOf("pages/workflow/") === 0) return ["human", "ai"];
    if (href.indexOf("tools/") === 0) return ["ai"];
    if (href.indexOf("pages/executive/") === 0 || href.indexOf("pages/strategy/") === 0 ||
        href.indexOf("pages/intel/") === 0 || href.indexOf("pages/growth/") === 0) return ["doc", "ai"];
    return ["doc", "ai"];
  }
  (function () {
    var me = null;
    MENU.forEach(function (g) { g.items.forEach(function (it) { if (it.slug === active) me = it; }); });
    if (!me) return;
    var codes = provFor(me.slug, me.href);
    if (!codes.length) return;
    var tb = document.querySelector(".content .topbar");
    if (!tb) return;
    var chips = codes.map(function (c) {
      var d = PROV_DEFS[c];
      return '<span title="' + d[2] + '" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;' +
        'font-weight:700;color:#3F5A7E;background:#EEF4FC;border:1px solid #D9E5F4;border-radius:999px;' +
        'padding:3px 10px;cursor:help">' + d[0] + " " + d[1] + "</span>";
    }).join(" ");
    var bar = document.createElement("div");
    bar.className = "provbar";
    bar.innerHTML = '<div class="wrap" style="display:flex;gap:7px;align-items:center;padding:7px 28px;flex-wrap:wrap">' +
      '<span style="font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#8295AC;font-weight:800">Sources</span>' +
      chips + '<a href="' + ROOT + 'pages/advisory/methodology.html" style="font-size:11px;margin-left:auto">How to read sources →</a></div>';
    bar.style.cssText = "background:#FAFCFF;border-bottom:1px solid #E2E9F3";
    tb.parentNode.insertBefore(bar, tb.nextSibling);
  })();

  // ================= FEEDBACK / COMMENTS =================
  // Team members leave comments on any page; export them for the AI to read & improve,
  // or file straight to GitHub Issues (which the AI monitors).
  (function () {
    var FKEY = "jrFeedback";
    function fload() { try { return JSON.parse(localStorage.getItem(FKEY) || "[]"); } catch (e) { return []; } }
    function fsave(a) { try { localStorage.setItem(FKEY, JSON.stringify(a)); } catch (e) {} }
    var pageTitle = document.title.split("·")[0].trim();
    var btn = document.createElement("button");
    btn.id = "fbBtn"; btn.title = "Comment on this page";
    btn.innerHTML = "💬";
    btn.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:70;width:52px;height:52px;border-radius:50%;" +
      "border:none;background:#0B1F3A;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 10px 26px -10px rgba(11,31,58,.65)";
    var panel = document.createElement("div");
    panel.style.cssText = "position:fixed;right:18px;bottom:80px;z-index:70;width:min(380px,92vw);display:none;" +
      "background:#fff;border:1px solid #E2E9F3;border-radius:16px;box-shadow:0 24px 60px -20px rgba(11,31,58,.45);" +
      "font-family:Inter,system-ui,sans-serif;overflow:hidden";
    panel.innerHTML =
      '<div style="background:#0B1F3A;color:#fff;padding:12px 16px;font-weight:800;font-size:14px">💬 Page feedback' +
      '<span style="float:right;cursor:pointer" id="fbClose">✕</span>' +
      '<div style="font-weight:500;font-size:11px;color:#9FB4D0;margin-top:2px">Comments feed the AI improvement loop</div></div>' +
      '<div style="padding:14px 16px">' +
      '<div id="fbQuote" style="display:none;font-size:11.5px;background:#FEF6E9;border:1px solid #F0E2B6;border-radius:8px;padding:7px 10px;margin-bottom:8px;color:#7a5e12"></div>' +
      '<textarea id="fbText" rows="3" placeholder="What should be fixed, added or improved on this page?" style="width:100%;box-sizing:border-box;border:1px solid #E2E9F3;border-radius:9px;padding:9px 11px;font-size:13px;font-family:inherit"></textarea>' +
      '<div style="display:flex;gap:7px;margin-top:8px;flex-wrap:wrap">' +
      '<button id="fbSave" style="background:#16C098;color:#fff;border:none;border-radius:8px;padding:8px 14px;font-weight:800;font-size:12.5px;cursor:pointer">Save comment</button>' +
      '<button id="fbGrab" style="background:#fff;color:#5A6B82;border:1px solid #E2E9F3;border-radius:8px;padding:8px 12px;font-size:12px;cursor:pointer" title="Select text on the page first">+ Quote selection</button>' +
      '</div>' +
      '<div id="fbList" style="margin-top:12px;max-height:180px;overflow:auto"></div>' +
      '<div style="border-top:1px solid #E2E9F3;margin-top:12px;padding-top:10px;display:flex;gap:7px;flex-wrap:wrap">' +
      '<button id="fbCopy" style="background:#0B1F3A;color:#fff;border:none;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:700;cursor:pointer">Copy ALL for AI</button>' +
      '<a id="fbIssue" target="_blank" rel="noopener" style="background:#fff;color:#3F6FB0;border:1px solid #CBD9EC;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:700;text-decoration:none">File to GitHub →</a>' +
      '</div>' +
      '<div style="font-size:10.5px;color:#8295AC;margin-top:8px">Saved in this browser. "Copy ALL" → paste to Claude to action; GitHub issues are read by the AI on the next improvement pass.</div>' +
      '</div>';
    document.body.appendChild(btn); document.body.appendChild(panel);
    var curQuote = "";
    function mdAll() {
      var a = fload(); if (!a.length) return "No feedback recorded.";
      var out = "# Dossier feedback (" + a.length + " comments)\n";
      a.forEach(function (c) {
        out += "\n## " + c.title + "\n- page: " + c.page + "\n- when: " + c.ts + "\n";
        if (c.quote) out += "- quoted text: \"" + c.quote + "\"\n";
        out += "- comment: " + c.text + "\n";
      });
      return out;
    }
    function renderList() {
      var host = panel.querySelector("#fbList"); var a = fload();
      var mine = a.filter(function (c) { return c.slug === active; });
      host.innerHTML = mine.length ? "" : '<div style="font-size:12px;color:#8295AC">No comments on this page yet. ' + (a.length ? "(" + a.length + " site-wide)" : "") + "</div>";
      mine.forEach(function (c) {
        var d = document.createElement("div");
        d.style.cssText = "border:1px solid #E2E9F3;border-radius:9px;padding:8px 10px;margin-bottom:7px;font-size:12.5px";
        d.innerHTML = (c.quote ? '<div style="color:#B5781A;font-size:11px">❝' + c.quote.slice(0, 90) + '❞</div>' : "") +
          '<div>' + c.text + '</div><div style="color:#8295AC;font-size:10.5px;margin-top:3px">' + c.ts +
          ' · <span style="cursor:pointer;color:#C13B33" data-del="' + c.ts + '">delete</span></div>';
        host.appendChild(d);
      });
      host.querySelectorAll("[data-del]").forEach(function (el) {
        el.onclick = function () { fsave(fload().filter(function (c) { return c.ts !== el.getAttribute("data-del"); })); renderList(); };
      });
      var issueBody = "Page: " + location.pathname + "\n\n" + mdAll();
      panel.querySelector("#fbIssue").href = "https://github.com/skytechnext/JRtechsky/issues/new?title=" +
        encodeURIComponent("Dossier feedback: " + pageTitle) + "&body=" + encodeURIComponent(issueBody.slice(0, 5500));
    }
    btn.onclick = function () { panel.style.display = panel.style.display === "none" ? "block" : "none"; renderList(); };
    panel.querySelector("#fbClose").onclick = function () { panel.style.display = "none"; };
    panel.querySelector("#fbGrab").onclick = function () {
      var s = String(window.getSelection() || "").trim();
      if (s) { curQuote = s.slice(0, 300); var q = panel.querySelector("#fbQuote"); q.style.display = "block"; q.textContent = "❝" + curQuote + "❞"; }
    };
    panel.querySelector("#fbSave").onclick = function () {
      var t = panel.querySelector("#fbText").value.trim(); if (!t) return;
      var a = fload();
      a.push({ slug: active, page: location.pathname, title: pageTitle, text: t, quote: curQuote, ts: new Date().toISOString() });
      fsave(a); panel.querySelector("#fbText").value = ""; curQuote = ""; panel.querySelector("#fbQuote").style.display = "none";
      renderList();
    };
    panel.querySelector("#fbCopy").onclick = function () {
      var t = mdAll(); var done = function () { panel.querySelector("#fbCopy").textContent = "Copied ✓"; setTimeout(function(){panel.querySelector("#fbCopy").textContent = "Copy ALL for AI";},1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function(){});
    };
  })();

  // ================= OFFLINE (service worker) =================
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "127.0.0.1" || location.hostname === "localhost")) {
    navigator.serviceWorker.register(ROOT + "sw.js").catch(function () {});
  }

  // scroll active link into view
  var act = document.querySelector("#sidebar .sb-link.active");
  if (act) act.scrollIntoView({ block: "center" });
})();
