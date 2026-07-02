/* ============================================================
   JR-Tech Solution — site interactivity (vanilla JS)
   No dependencies. Progressive enhancement: the page is fully
   usable if JS fails to load.
   ============================================================ */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var on = function (el, ev, fn) { if (el) el.addEventListener(ev, fn); };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Header shadow on scroll ---- */
  var header = $(".header");
  var setScrolled = function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); };
  on(window, "scroll", setScrolled, { passive: true });
  setScrolled();

  /* ---- Mobile nav ---- */
  var nav = $(".nav");
  var toggle = $(".nav__toggle");
  on(toggle, "click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$(".nav__links a").forEach(function (a) {
    on(a, "click", function () { nav && nav.classList.remove("is-open"); toggle && toggle.setAttribute("aria-expanded", "false"); });
  });

  /* ---- FAQ accordion ---- */
  $$(".acc").forEach(function (item) {
    var btn = $(".acc__q", item);
    var panel = $(".acc__a", item);
    on(btn, "click", function () {
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : 0;
    });
  });

  /* ---- Scroll reveal ---- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Animated counters ---- */
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dec = (target % 1 !== 0) ? 1 : 0;
    if (reduceMotion) { el.textContent = prefix + target.toFixed(dec) + suffix; return; }
    var start = null, dur = 1600;
    var tick = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toFixed(dec) + suffix;
    };
    requestAnimationFrame(tick);
  };
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---- Testimonial carousel ---- */
  $$(".tcarousel").forEach(function (root) {
    var track = $(".tslides", root);
    var slides = $$(".tslide", track);
    var dotsWrap = $(".tdots", root);
    if (!track || slides.length < 2) return;
    var i = 0, timer;
    slides.forEach(function (_, idx) {
      var d = document.createElement("button");
      d.className = "tdot" + (idx === 0 ? " is-active" : "");
      d.setAttribute("aria-label", "Show testimonial " + (idx + 1));
      on(d, "click", function () { go(idx); reset(); });
      dotsWrap.appendChild(d);
    });
    var dots = $$(".tdot", dotsWrap);
    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = "translateX(-" + i * 100 + "%)";
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === i); });
    }
    function reset() { if (reduceMotion) return; clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6000); }
    reset();
    on(root, "mouseenter", function () { clearInterval(timer); });
    on(root, "mouseleave", reset);
  });

  /* ---- Back to top ---- */
  var toTop = $(".to-top");
  on(window, "scroll", function () { if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 600); }, { passive: true });
  on(toTop, "click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });

  /* ---- Cookie consent ---- */
  var cookie = $(".cookie");
  if (cookie) {
    var KEY = "jrtech_cookie_ok";
    var stored;
    try { stored = localStorage.getItem(KEY); } catch (e) { stored = "1"; }
    if (!stored) setTimeout(function () { cookie.classList.add("is-visible"); }, 1200);
    on($(".cookie__accept", cookie), "click", function () {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      cookie.classList.remove("is-visible");
    });
  }

  /* ---- Form validation (lead + contact + newsletter) ---- */
  $$("form[data-validate]").forEach(function (form) {
    var success = $(".form-success", form);
    on(form, "submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function (field) {
        var wrap = field.closest(".field") || field.parentElement;
        var valid = field.value.trim() !== "";
        if (field.type === "email") valid = valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        wrap && wrap.classList.toggle("has-error", !valid);
        if (!valid && ok) { field.focus(); }
        ok = ok && valid;
      });
      if (!ok) return;
      form.reset();
      if (success) {
        success.classList.add("is-visible");
        success.setAttribute("role", "status");
        setTimeout(function () { success.classList.remove("is-visible"); }, 6000);
      }
    });
    $$("[required]", form).forEach(function (field) {
      on(field, "input", function () {
        var wrap = field.closest(".field") || field.parentElement;
        if (wrap.classList.contains("has-error") && field.value.trim() !== "") wrap.classList.remove("has-error");
      });
    });
  });

  /* ---- Inject current year ---- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
