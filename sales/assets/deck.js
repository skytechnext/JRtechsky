/* TechNext sales deck — keyboard/click navigable slides.
   Markup: a .deck containing .slide elements. This builds the
   bottom control bar (progress, counter, prev/next, dots) and
   wires ← → Space Home End + click + URL hash (#3). */
(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".deck .slide"));
  if (!slides.length) return;
  var i = 0;

  var bar = document.createElement("div");
  bar.className = "deckbar";
  bar.innerHTML =
    '<a class="deckbar__home" href="../index.html">‹ Sales kit</a>' +
    '<div class="deck-dots" id="dots"></div>' +
    '<div class="deckbar__prog"><i id="prog"></i></div>' +
    '<div class="deckbar__count" id="count"></div>' +
    '<div class="deckbar__btns">' +
      '<button class="deckbtn" id="prev" aria-label="Previous slide">‹</button>' +
      '<button class="deckbtn" id="next" aria-label="Next slide">›</button>' +
    "</div>";
  document.body.appendChild(bar);

  var dots = document.getElementById("dots");
  slides.forEach(function (s, n) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Go to slide " + (n + 1));
    b.addEventListener("click", function () { go(n); });
    dots.appendChild(b);
  });
  var dotEls = Array.prototype.slice.call(dots.children);
  var prog = document.getElementById("prog");
  var count = document.getElementById("count");

  function render() {
    slides.forEach(function (s, n) { s.classList.toggle("is-active", n === i); });
    dotEls.forEach(function (d, n) { d.classList.toggle("is-active", n === i); });
    prog.style.width = ((i + 1) / slides.length * 100) + "%";
    count.textContent = (i + 1) + " / " + slides.length;
    if (location.hash !== "#" + (i + 1)) history.replaceState(null, "", "#" + (i + 1));
  }
  function go(n) { i = Math.max(0, Math.min(slides.length - 1, n)); render(); window.scrollTo(0, 0); }

  document.getElementById("prev").addEventListener("click", function () { go(i - 1); });
  document.getElementById("next").addEventListener("click", function () { go(i + 1); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(i + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(i - 1); }
    else if (e.key === "Home") { go(0); }
    else if (e.key === "End") { go(slides.length - 1); }
  });

  var start = parseInt((location.hash || "").replace("#", ""), 10);
  if (start >= 1 && start <= slides.length) i = start - 1;
  render();
})();
