/* ============================================================
   Kitchen Estimator · Auntie Gaik Lean × JR Tech
   Live kitchen economics: KPIs, consumables, equipment life
   planning, straight-line depreciation, and dual profit
   estimators (F&B operator + JR Tech vendor).

   compute() is a pure function of (state, now) and is exported
   for tests; all DOM code is guarded so this file loads in Node.
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------- defaults ----------------------- *
   * Seeded with plausible figures for a ~44-seat Michelin
   * Peranakan eatery in George Town. Everything is editable.   */
  const DEFAULTS = {
    currency: "RM",

    // kitchen scalars
    seats: 44,
    coversPerDay: 70,
    daysPerMonth: 20,
    avgCheck: 120,
    foodCostPct: 32,
    labour: 38000,
    rent: 12000,
    utilities: 6500,
    fnbOther: 4500,

    // JR Tech scalars
    jrSetupFee: 18000,
    jrSetupCost: 9500,
    jrSubscription: 650,
    jrSupportFee: 450,
    jrHardwareLease: 380,
    jrInfraCost: 95,
    jrSupportHours: 3,
    jrHourlyCost: 110,
    jrHardwareCapital: 9000,
    jrTermMonths: 36,
    jrProcessingPct: 0.9,
    jrClientSaving: 3200,

    consumables: [
      { name: "Commercial dishwasher detergent", unit: 95, qty: 8 },
      { name: "Rinse aid & sanitiser", unit: 78, qty: 5 },
      { name: "Heavy-duty degreaser", unit: 62, qty: 6 },
      { name: "Grease-trap treatment", unit: 120, qty: 2 },
      { name: "Floor & surface cleaner", unit: 45, qty: 6 },
      { name: "Hand soap & sanitiser refills", unit: 38, qty: 6 },
      { name: "Nitrile gloves (box of 100)", unit: 32, qty: 14 },
      { name: "Takeaway containers & lids", unit: 110, qty: 9 },
      { name: "Paper napkins & serviettes", unit: 48, qty: 12 },
      { name: "Kitchen roll & wiping cloths", unit: 42, qty: 10 },
      { name: "Cling film & aluminium foil", unit: 55, qty: 5 },
      { name: "Bin liners (heavy duty)", unit: 36, qty: 14 },
      { name: "Scourers & sponges", unit: 18, qty: 8 },
    ],

    // name, install date, cost, useful life (yrs), salvage (% of cost)
    equipment: [
      { name: "6-burner range + oven", date: "2020-03-01", cost: 18500, life: 12, salvage: 8 },
      { name: "High-pressure wok burner", date: "2021-06-01", cost: 9200, life: 8, salvage: 5 },
      { name: "Walk-in chiller", date: "2019-09-01", cost: 32000, life: 12, salvage: 10 },
      { name: "Upright twin freezer", date: "2022-01-01", cost: 11500, life: 10, salvage: 8 },
      { name: "Hood-type dishwasher", date: "2018-11-01", cost: 21000, life: 9, salvage: 8 },
      { name: "Exhaust hood + ductwork", date: "2018-08-01", cost: 16800, life: 15, salvage: 5 },
      { name: "Refrigerated prep counter", date: "2021-04-01", cost: 8600, life: 10, salvage: 8 },
      { name: "Rempah grinder & blender", date: "2023-02-01", cost: 4200, life: 7, salvage: 5 },
      { name: "Planetary stand mixer", date: "2022-07-01", cost: 5400, life: 10, salvage: 8 },
      { name: "Commercial rice cookers (×3)", date: "2023-05-01", cost: 3600, life: 6, salvage: 5 },
      { name: "Kitchen water heater", date: "2019-03-01", cost: 4800, life: 8, salvage: 5 },
    ],
  };

  const DAY = 86400000;
  const YEAR_MS = 365.25 * DAY;
  const MONTH_MS = YEAR_MS / 12;

  const num = (v) => {
    const n = typeof v === "number" ? v : parseFloat(v);
    return isFinite(n) ? n : 0;
  };
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  /* ----------------------- compute ------------------------ */
  function compute(state, now) {
    now = now || new Date();
    const s = state;

    /* — kitchen / KPIs — */
    const coversMonth = num(s.coversPerDay) * num(s.daysPerMonth);
    const revenue = coversMonth * num(s.avgCheck);
    const foodCost = revenue * (num(s.foodCostPct) / 100);
    const labour = num(s.labour);
    const prime = foodCost + labour;
    const grossProfit = revenue - foodCost;
    const turnsPerDay = s.seats > 0 ? num(s.coversPerDay) / num(s.seats) : 0;

    /* — consumables — */
    let consTotal = 0, consUnits = 0;
    const consRows = (s.consumables || []).map((r) => {
      const cost = num(r.unit) * num(r.qty);
      consTotal += cost;
      consUnits += num(r.qty);
      return { cost };
    });
    consRows.forEach((r) => (r.share = consTotal > 0 ? r.cost / consTotal : 0));
    const consPerCover = coversMonth > 0 ? consTotal / coversMonth : 0;
    const consPerDay = num(s.daysPerMonth) > 0 ? consTotal / num(s.daysPerMonth) : 0;

    /* — equipment: life plan + depreciation (shared assets) — */
    let equipCost = 0, equipReserve = 0, depAnnual = 0, depAccum = 0, depBook = 0, depSalvage = 0;
    let dueCount = 0, soonCount = 0;
    const equipRows = (s.equipment || []).map((e) => {
      const cost = num(e.cost);
      const life = Math.max(num(e.life), 0.01);
      const salvageVal = cost * (num(e.salvage) / 100);
      const depBase = Math.max(cost - salvageVal, 0);

      const pd = new Date((e.date || "") + "T00:00:00");
      const validDate = !isNaN(pd.getTime());
      const ageYears = validDate ? Math.max((now - pd) / YEAR_MS, 0) : 0;

      const rd = validDate ? new Date(pd) : null;
      if (rd) rd.setFullYear(pd.getFullYear() + Math.round(life));
      const monthsToReplace = rd ? (rd - now) / MONTH_MS : Infinity;

      const reserve = cost / (life * 12);
      const annual = depBase / life;
      const accum = clamp(annual * ageYears, 0, depBase);
      const book = cost - accum;
      const remainFrac = clamp(1 - ageYears / life, 0, 1);

      let status = "ok";
      if (rd && now > rd) { status = "due"; dueCount++; }
      else if (monthsToReplace <= 12) { status = "soon"; soonCount++; }

      equipCost += cost;
      equipReserve += reserve;
      depAnnual += annual;
      depAccum += accum;
      depBook += book;
      depSalvage += salvageVal;

      return {
        name: e.name, cost, salvageVal, ageYears, reserve, annual, accum, book,
        remainFrac, status, replaceDate: rd, monthsToReplace,
      };
    });
    const depMonthly = depAnnual / 12;
    const retainedPct = equipCost > 0 ? depBook / equipCost : 0;

    /* — F&B profit — */
    const fnbOther = num(s.fnbOther);
    const fnbCosts = foodCost + labour + num(s.rent) + num(s.utilities) + consTotal + depMonthly + fnbOther;
    const fnbNet = revenue - fnbCosts;
    const fnbMargin = revenue > 0 ? fnbNet / revenue : 0;
    const primePct = revenue > 0 ? prime / revenue : 0;
    const grossPct = revenue > 0 ? grossProfit / revenue : 0;

    // break-even covers/day: fixed costs ÷ contribution per cover
    const fixedMonthly = labour + num(s.rent) + num(s.utilities) + consTotal + depMonthly + fnbOther;
    const contribPerCover = num(s.avgCheck) * (1 - num(s.foodCostPct) / 100);
    const breakevenMonth = contribPerCover > 0 ? fixedMonthly / contribPerCover : Infinity;
    const breakevenDay = num(s.daysPerMonth) > 0 ? breakevenMonth / num(s.daysPerMonth) : Infinity;

    /* — JR Tech profit — */
    const jrRecurRev = num(s.jrSubscription) + num(s.jrSupportFee) + num(s.jrHardwareLease);
    const jrInfra = num(s.jrInfraCost);
    const jrLabour = num(s.jrSupportHours) * num(s.jrHourlyCost);
    const jrHwAmort = num(s.jrTermMonths) > 0 ? num(s.jrHardwareCapital) / num(s.jrTermMonths) : 0;
    const jrProcessing = jrRecurRev * (num(s.jrProcessingPct) / 100);
    const jrCosts = jrInfra + jrLabour + jrHwAmort + jrProcessing;
    const jrNet = jrRecurRev - jrCosts;
    const jrMargin = jrRecurRev > 0 ? jrNet / jrRecurRev : 0;
    const jrSetupMargin = num(s.jrSetupFee) - num(s.jrSetupCost);
    const jrLtv = jrSetupMargin + jrNet * num(s.jrTermMonths);
    const jrShare = revenue > 0 ? jrRecurRev / revenue : 0;

    /* — client ROI on the JR system — */
    const roiNetSaving = num(s.jrClientSaving) - jrRecurRev;
    const roiPayback = roiNetSaving > 0 ? num(s.jrSetupFee) / roiNetSaving : Infinity;
    const roiFirstYear = num(s.jrClientSaving) * 12 - jrRecurRev * 12 - num(s.jrSetupFee);

    return {
      coversMonth, revenue, foodCost, prime, primePct, grossProfit, grossPct,
      turnsPerDay,
      consTotal, consUnits, consPerCover, consPerDay, consRows,
      equipCost, equipReserve, depAnnual, depAccum, depBook, depSalvage,
      depMonthly, retainedPct, dueCount, soonCount, equipRows,
      fnbOther, fnbNet, fnbMargin, fixedMonthly, contribPerCover, breakevenDay,
      jrRecurRev, jrInfra, jrLabour, jrHwAmort, jrProcessing, jrCosts,
      jrNet, jrMargin, jrSetupMargin, jrLtv, jrShare,
      roiNetSaving, roiPayback, roiFirstYear,
    };
  }

  /* ------------- export for Node tests ------------- */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { compute, DEFAULTS };
  }
  if (typeof document === "undefined") return; // node: stop here

  /* ===================== browser app ===================== */
  const STORE_KEY = "agl-kitchen-estimator-v1";
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clone = (o) => JSON.parse(JSON.stringify(o));
  let state = loadState();
  let interacted = false;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign(clone(DEFAULTS), JSON.parse(raw));
    } catch (e) { /* ignore */ }
    return clone(DEFAULTS);
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  /* ----------------------- formatting ----------------------- */
  function money(n, dp) {
    dp = dp || 0;
    const sym = state.currency || "RM";
    const neg = n < 0;
    const abs = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
    const space = sym.length > 1 ? " " : "";
    return (neg ? "−" : "") + sym + space + abs;
  }
  const expense = (v) => (v > 0 ? "−" + money(v) : money(0));
  const pct = (frac, dp) => (frac * 100).toFixed(dp == null ? 1 : dp) + "%";
  const intFmt = (n) => Math.round(n).toLocaleString("en-US");
  function months(m) {
    if (!isFinite(m) || m <= 0) return "—";
    if (m < 12) return m.toFixed(1) + " mo";
    return (m / 12).toFixed(1) + " yr";
  }

  /* ----------------------- table builders ----------------------- */
  function buildConsumables() {
    const body = $("#consBody");
    body.innerHTML = "";
    state.consumables.forEach((r, i) => {
      const tr = document.createElement("tr");
      tr.dataset.arr = "consumables";
      tr.dataset.i = i;
      tr.innerHTML =
        '<td class="has-in"><input class="cell-in cell-in--name" data-f="name" value="' + esc(r.name) + '" aria-label="Item name" /></td>' +
        '<td class="has-in num"><input class="cell-in cell-in--num" type="number" min="0" step="1" data-f="unit" value="' + num(r.unit) + '" aria-label="Unit cost" /></td>' +
        '<td class="has-in num"><input class="cell-in cell-in--num" type="number" min="0" step="1" data-f="qty" value="' + num(r.qty) + '" aria-label="Units per month" /></td>' +
        '<td class="num" data-rowout="cost">—</td>' +
        '<td class="num" data-rowout="share">—</td>' +
        '<td class="act"><button type="button" class="row-del" data-del aria-label="Remove item">×</button></td>';
      body.appendChild(tr);
    });
  }

  function buildEquipment() {
    const body = $("#equipBody");
    body.innerHTML = "";
    state.equipment.forEach((e, i) => {
      const tr = document.createElement("tr");
      tr.dataset.arr = "equipment";
      tr.dataset.i = i;
      tr.innerHTML =
        '<td class="has-in"><input class="cell-in cell-in--name" data-f="name" value="' + esc(e.name) + '" aria-label="Asset name" /></td>' +
        '<td class="has-in num"><input class="cell-in cell-in--num" type="date" data-f="date" value="' + esc(e.date) + '" aria-label="Install date" /></td>' +
        '<td class="has-in num"><input class="cell-in cell-in--num" type="number" min="0" step="100" data-f="cost" value="' + num(e.cost) + '" aria-label="Cost" /></td>' +
        '<td class="has-in num"><input class="cell-in cell-in--num" type="number" min="0.5" step="0.5" data-f="life" value="' + num(e.life) + '" aria-label="Useful life years" /></td>' +
        '<td class="num" data-rowout="replace">—</td>' +
        '<td class="num" data-rowout="reserve">—</td>' +
        '<td data-rowout="status">—</td>' +
        '<td class="act"><button type="button" class="row-del" data-del aria-label="Remove asset">×</button></td>';
      body.appendChild(tr);
    });
  }

  function buildDepreciation() {
    const body = $("#depBody");
    body.innerHTML = "";
    state.equipment.forEach((e, i) => {
      const tr = document.createElement("tr");
      tr.dataset.arr = "equipment";
      tr.dataset.i = i;
      tr.innerHTML =
        '<th scope="row" data-rowout="name">—</th>' +
        '<td class="num" data-rowout="cost">—</td>' +
        '<td class="has-in num"><span class="cell-pct"><input class="cell-in cell-in--num" type="number" min="0" max="100" step="1" data-f="salvage" value="' + num(e.salvage) + '" aria-label="Salvage percent" /><span class="cell-suffix">%</span></span></td>' +
        '<td class="num" data-rowout="age">—</td>' +
        '<td class="num" data-rowout="annual">—</td>' +
        '<td class="num" data-rowout="accum">—</td>' +
        '<td class="num" data-rowout="book">—</td>' +
        '<td class="bar-col" data-rowout="bar"></td>';
      body.appendChild(tr);
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  /* ----------------------- paint (outputs only) ----------------------- */
  const out = {};
  function cacheOutputs() {
    $$("[data-out]").forEach((el) => { (out[el.dataset.out] = out[el.dataset.out] || []).push(el); });
  }
  function set(key, text, cls) {
    (out[key] || []).forEach((el) => {
      el.textContent = text;
      if (cls !== undefined) { el.classList.remove("is-bad"); if (cls) el.classList.add(cls); }
    });
  }

  function paint() {
    const d = compute(state, new Date());

    /* header + hero */
    set("hdrFnbNet", money(d.fnbNet));
    set("hdrJrNet", money(d.jrNet));
    if (interacted || reduced) {
      set("heroFnbNet", money(d.fnbNet));
      set("heroJrNet", money(d.jrNet));
    }
    set("heroFnbMargin", pct(d.fnbMargin));
    set("heroJrMargin", pct(d.jrMargin));
    set("heroRevenue", money(d.revenue));
    set("heroCovers", intFmt(d.coversMonth));
    set("heroPrime", pct(d.primePct));

    /* 01 KPIs */
    set("kpiRevenue", money(d.revenue));
    set("kpiRevenueHint", money(d.revenue * 12) + " / yr");
    set("kpiCovers", intFmt(d.coversMonth));
    set("kpiTurns", d.turnsPerDay.toFixed(2) + " turns / day");
    set("kpiAvgCheck", money(num(state.avgCheck)));
    set("kpiFoodCost", money(d.foodCost));
    set("kpiFoodPct", pct(num(state.foodCostPct) / 100) + " of revenue");
    set("kpiPrime", money(d.prime), d.primePct > 0.75 ? "is-bad" : null);
    set("kpiPrimePct", pct(d.primePct) + " of revenue",
      d.primePct > 0.75 ? "is-bad" : d.primePct > 0.65 ? "is-warn" : null);
    set("kpiRevPerSeat", money(state.seats > 0 ? d.revenue / num(state.seats) : 0));
    set("kpiSeats", intFmt(num(state.seats)) + " seats");
    set("kpiLabourEff", (num(state.labour) > 0 ? d.revenue / num(state.labour) : 0).toFixed(2) + "×");
    set("kpiGross", money(d.grossProfit));
    set("kpiGrossPct", pct(d.grossPct) + " gross margin");

    /* 02 consumables rows + totals */
    paintRows("#consBody", d.consRows, (r, cells) => {
      cells.cost.textContent = money(r.cost);
      cells.share.textContent = pct(r.share, 0);
    });
    set("consTotal", money(d.consTotal));
    set("consUnits", intFmt(d.consUnits));
    set("consPerCover", money(d.consPerCover, 2));
    set("consPerDay", money(d.consPerDay));

    /* 03 equipment life plan rows */
    paintRows("#equipBody", d.equipRows, (r, cells) => {
      cells.replace.textContent = r.replaceDate ? fmtMonthYear(r.replaceDate) : "—";
      cells.reserve.textContent = money(r.reserve);
      cells.status.innerHTML = statusPill(r);
    });
    set("equipCost", money(d.equipCost));
    set("equipReserve", money(d.equipReserve));
    set("equipReserve2", money(d.equipReserve));
    set("equipDueCount", d.dueCount + " due · " + d.soonCount + " soon");

    /* 04 depreciation rows */
    paintRows("#depBody", d.equipRows, (r, cells) => {
      cells.name.textContent = r.name;
      cells.cost.textContent = money(r.cost);
      cells.age.textContent = r.ageYears.toFixed(1) + " yr";
      cells.annual.textContent = money(r.annual);
      cells.accum.textContent = money(r.accum);
      cells.book.textContent = money(r.book);
      cells.bar.innerHTML = bar(r.remainFrac);
    });
    set("depCost", money(d.equipCost));
    set("depAnnual", money(d.depAnnual));
    set("depAccum", money(d.depAccum));
    set("depBook", money(d.depBook));
    set("depMonthly", money(d.depMonthly));
    set("depRetainedPct", pct(d.retainedPct, 0));

    /* 05 F&B profit */
    set("pfRevenue", money(d.revenue));
    set("pfFood", expense(d.foodCost));
    set("pfLabour", expense(num(state.labour)));
    set("pfRent", expense(num(state.rent)));
    set("pfUtil", expense(num(state.utilities)));
    set("pfCons", expense(d.consTotal));
    set("pfDep", expense(d.depMonthly));
    set("pfNet", money(d.fnbNet), d.fnbNet < 0 ? "is-bad" : null);
    set("pfMargin", pct(d.fnbMargin), d.fnbNet < 0 ? "is-bad" : null);
    set("pfYear", money(d.fnbNet * 12));
    set("pfBreakeven", isFinite(d.breakevenDay) ? intFmt(Math.ceil(d.breakevenDay)) + " / day" : "—");
    set("pfReserve", money(d.equipReserve));

    /* 06 JR Tech profit */
    set("jrRecurRev", money(d.jrRecurRev));
    set("jrInfra", expense(d.jrInfra));
    set("jrLabour", expense(d.jrLabour));
    set("jrHwAmort", expense(d.jrHwAmort));
    set("jrProcessing", expense(d.jrProcessing));
    set("jrNet", money(d.jrNet), d.jrNet < 0 ? "is-bad" : null);
    set("jrMargin", pct(d.jrMargin), d.jrNet < 0 ? "is-bad" : null);
    set("jrSetupMargin", money(d.jrSetupMargin));
    set("jrLtv", money(d.jrLtv));
    set("jrShare", pct(d.jrShare, 1) + " of kitchen revenue");
    set("roiNetSaving", money(d.roiNetSaving), d.roiNetSaving < 0 ? "is-bad" : null);
    set("roiPayback", months(d.roiPayback));
    set("roiFirstYear", money(d.roiFirstYear), d.roiFirstYear < 0 ? "is-bad" : null);
  }

  function paintRows(bodySel, rows, fn) {
    const trs = $$(bodySel + " > tr");
    trs.forEach((tr) => {
      const i = +tr.dataset.i;
      const r = rows[i];
      if (!r) return;
      const cells = {};
      $$("[data-rowout]", tr).forEach((c) => (cells[c.dataset.rowout] = c));
      fn(r, cells);
    });
  }

  function statusPill(r) {
    if (r.status === "due") return '<span class="pill pill--due">Replace now</span>';
    if (r.status === "soon") return '<span class="pill pill--soon">Due ' + (r.replaceDate ? fmtMonthYear(r.replaceDate) : "soon") + "</span>";
    return '<span class="pill pill--ok">On plan</span>';
  }
  function bar(frac) {
    const w = Math.round(clamp(frac, 0, 1) * 100);
    const lbl = w === 0 ? "0% · due" : w + "% life left";
    return '<div class="dbar"><div class="dbar__fill" style="width:' + w + '%"></div></div><span class="dbar__lbl">' + lbl + "</span>";
  }
  function fmtMonthYear(dt) {
    return dt.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  /* ----------------------- input sync ----------------------- */
  function syncScalarInputs() {
    $$("[data-k]").forEach((el) => { el.value = state[el.dataset.k]; });
    $("#currency").value = state.currency;
  }

  function onInput(e) {
    const el = e.target;
    interacted = true;
    if (el.dataset.k != null) {
      state[el.dataset.k] = el.type === "number" ? num(el.value) : el.value;
      saveState(); paint(); return;
    }
    if (el.dataset.f != null) {
      const tr = el.closest("tr");
      if (!tr) return;
      const arr = state[tr.dataset.arr];
      const row = arr && arr[+tr.dataset.i];
      if (!row) return;
      const f = el.dataset.f;
      row[f] = (f === "name" || f === "date") ? el.value : num(el.value);
      saveState(); paint(); return;
    }
    if (el.id === "currency") { state.currency = el.value; saveState(); paint(); }
  }

  function onClick(e) {
    const add = e.target.closest("[data-add]");
    if (add) {
      interacted = true;
      if (add.dataset.add === "cons") {
        state.consumables.push({ name: "New item", unit: 0, qty: 0 });
        buildConsumables();
      } else if (add.dataset.add === "equip") {
        const today = new Date().toISOString().slice(0, 10);
        state.equipment.push({ name: "New asset", date: today, cost: 0, life: 10, salvage: 8 });
        buildEquipment(); buildDepreciation();
      }
      saveState(); paint();
      return;
    }
    if (e.target.closest("[data-del]")) {
      interacted = true;
      const tr = e.target.closest("tr");
      const arrName = tr.dataset.arr;
      state[arrName].splice(+tr.dataset.i, 1);
      if (arrName === "consumables") buildConsumables();
      else { buildEquipment(); buildDepreciation(); }
      saveState(); paint();
    }
  }

  /* ----------------------- count-up (one orchestrated moment) ----------------------- */
  function countUp(key, to, fmt) {
    const els = out[key] || [];
    if (!els.length) return;
    if (reduced || !isFinite(to)) { set(key, fmt(to)); return; }
    const dur = 1000, start = performance.now();
    function tick(t) {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const v = to * e;
      els.forEach((el) => (el.textContent = fmt(v)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ----------------------- boot ----------------------- */
  function boot() {
    cacheOutputs();
    buildConsumables();
    buildEquipment();
    buildDepreciation();
    syncScalarInputs();
    paint();

    // orchestrated entrance for the two hero figures only
    const d = compute(state, new Date());
    countUp("heroFnbNet", d.fnbNet, (v) => money(v));
    countUp("heroJrNet", d.jrNet, (v) => money(v));

    document.addEventListener("input", onInput);
    document.addEventListener("change", onInput);
    document.addEventListener("click", onClick);

    $("#printBtn").addEventListener("click", () => window.print());
    $("#resetBtn").addEventListener("click", () => {
      if (!confirm("Reset every figure back to the seeded estimate?")) return;
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      state = clone(DEFAULTS);
      interacted = true;
      buildConsumables(); buildEquipment(); buildDepreciation();
      syncScalarInputs(); paint();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
