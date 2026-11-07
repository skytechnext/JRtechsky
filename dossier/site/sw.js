/* JR-Tech dossier service worker — offline reading (plane mode). Auto-generated. */
var CACHE = "jr-dossier-202611070441";
var PRECACHE = ['assets/css/app.css', 'assets/js/nav.js', 'icons/icon.svg', 'index.html', 'manifest.json', 'pages/advisory/appendix.html', 'pages/advisory/glossary.html', 'pages/advisory/meeting-minutes.html', 'pages/advisory/methodology.html', 'pages/company/company-profile.html', 'pages/company/digital-presence.html', 'pages/company/founders-leadership.html', 'pages/company/product-catalog.html', 'pages/company/reviews-reputation.html', 'pages/company/staff-org.html', 'pages/delivery/change-management.html', 'pages/delivery/hypercare.html', 'pages/delivery/kpis-benefits.html', 'pages/delivery/risk-raci.html', 'pages/delivery/roadmap.html', 'pages/delivery/training.html', 'pages/executive/due-diligence.html', 'pages/executive/executive-summary.html', 'pages/growth/expansion.html', 'pages/growth/gtm.html', 'pages/growth/modern-services.html', 'pages/growth/operations-strategy.html', 'pages/growth/pricing.html', 'pages/intel/top3-competitors.html', 'pages/operations/bpmn-uml.html', 'pages/operations/department-atlas.html', 'pages/operations/dept-workflows.html', 'pages/operations/driver-incentive.html', 'pages/operations/pain-solution.html', 'pages/operations/stakeholders.html', 'pages/operations/value-chain.html', 'pages/overview/technext-services.html', 'pages/overview/why-ai.html', 'pages/strategy/competitor-deepdive.html', 'pages/strategy/esg.html', 'pages/strategy/financials.html', 'pages/strategy/market-industry.html', 'pages/strategy/personas.html', 'pages/strategy/pestle.html', 'pages/strategy/porters.html', 'pages/strategy/swot-tows.html', 'pages/technology/ai-catalog.html', 'pages/technology/ai-peer-story.html', 'pages/technology/current-systems.html', 'pages/technology/data-migration.html', 'pages/technology/integration-map.html', 'pages/technology/odoo-architecture.html', 'pages/technology/security-myinvois.html', 'pages/technology/why-odoo.html', 'pages/workflow/sample-blueprint.html', 'pages/workflow/sample-financials.html', 'pages/workflow/sample-handover.html', 'pages/workflow/sample-operations.html', 'pages/workflow/wf-approval.html', 'pages/workflow/wf-blueprint.html', 'pages/workflow/wf-financials.html', 'pages/workflow/wf-first-meeting.html', 'pages/workflow/wf-jrtech.html', 'pages/workflow/wf-operations.html', 'pages/workflow/wf-overview.html', 'reader.html', 'tools/accounting-overhaul.html', 'tools/ai-build-playbook.html', 'tools/brd.html', 'tools/demo-walkthrough.html', 'tools/discovery-questions.html', 'tools/driver-incentive.html', 'tools/gantt.html', 'tools/odoo-platform.html', 'tools/offline.html', 'tools/owner-faq.html', 'tools/profit-estimator.html', 'tools/quotation.html', 'tools/roi-tco.html', 'tools/staff-guides.html', 'tools/team-harness.html', '../downloads/AGL-Sample-02-Operations-Pack.pdf', '../downloads/AGL-Sample-01-Kitchen-Blueprint-Pack.pdf', '../downloads/AGL-Sample-04-JRTech-Pack-Handover.pdf', '../downloads/AGL-Sample-03-Financial-Pack.pdf', 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js', 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'];
self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    // best-effort: don't fail install if one file 404s
    return Promise.all(PRECACHE.map(function (u) {
      return c.add(u).catch(function () {});
    }));
  }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf("jr-dossier-") === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
/* stale-while-revalidate: serve cache instantly (offline-safe), refresh in background */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(e.request).then(function (res) {
        if (res && (res.status === 200 || res.type === "opaque")) c.put(e.request, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
/* message API for the Offline page */
self.addEventListener("message", function (e) {
  if (e.data === "precache-count") {
    caches.open(CACHE).then(function (c) { return c.keys(); }).then(function (ks) {
      e.source.postMessage({ cached: ks.length, target: PRECACHE.length });
    });
  }
});
