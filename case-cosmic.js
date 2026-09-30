// ---------------------------------------------------------
// Tomorrow School — интерактив кейса:
// scrollspy (рейл + мобильная навигация), reveal-анимации,
// счётчик интервью, год в футере.
// ---------------------------------------------------------

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Год в футере
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  // --- Reveal при скролле ---
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var revObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            revObs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // --- Scrollspy: подсветка активного раздела ---
  var railLinks = {};
  document.querySelectorAll("[data-spy]").forEach(function (a) {
    railLinks[a.getAttribute("data-spy")] = a;
  });
  var mLinks = {};
  var mnav = document.querySelector(".mnav");
  document.querySelectorAll("[data-spy-m]").forEach(function (a) {
    mLinks[a.getAttribute("data-spy-m")] = a;
  });

  function setActive(id) {
    Object.keys(railLinks).forEach(function (k) {
      railLinks[k].classList.toggle("is-active", k === id);
    });
    Object.keys(mLinks).forEach(function (k) {
      mLinks[k].classList.toggle("is-active", k === id);
    });
    // подкрутить мобильную панель к активному чипу
    var mActive = mLinks[id];
    if (mnav && mActive) {
      var target = mActive.offsetLeft - mnav.clientWidth / 2 + mActive.clientWidth / 2;
      mnav.scrollTo({ left: Math.max(0, target), behavior: reduce ? "auto" : "smooth" });
    }
  }

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll(".sec").forEach(function (s) { spy.observe(s); });
  }

  // --- Счётчик интервью ---
  var counter = document.querySelector(".counter__num");
  if (counter && "IntersectionObserver" in window && !reduce) {
    var target = parseInt(counter.getAttribute("data-count"), 10) || 0;
    var run = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting) return;
        run.disconnect();
        var start = null, dur = 900;
        function step(t) {
          if (!start) start = t;
          var p = Math.min((t - start) / dur, 1);
          counter.textContent = Math.round(p * target);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );
    run.observe(counter);
  }
})();
