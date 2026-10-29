// ---------------------------------------------------------
// Портфолио — интерактив: тема, появление секций, тень навбара
// ---------------------------------------------------------

(function () {
  "use strict";

  const root = document.documentElement;

  // --- Тема: запоминаем выбор, по умолчанию светлая ---
  const THEME_KEY = "portfolio-theme";
  const toggle = document.querySelector("[data-theme-toggle]");

  function storedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  applyTheme(storedTheme() || "light");

  if (toggle) {
    toggle.addEventListener("click", function () {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* приватный режим — просто пропускаем */
      }
    });
  }

  // --- Появление секций при скролле ---
  const revealables = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealables.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // лёгкий каскад для соседних элементов
            entry.target.style.transitionDelay = (i % 4) * 60 + "ms";
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealables.forEach(function (el) {
      io.observe(el);
    });
    // Подстраховка: то, что уже во вьюпорте при загрузке, показываем сразу.
    // При активном Lenis IntersectionObserver иногда не отдаёт первый колбэк,
    // и первый экран остаётся пустым до скролла — это её лечит.
    var revealInView = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      revealables.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      });
    };
    requestAnimationFrame(revealInView);
    setTimeout(revealInView, 180);
  } else {
    revealables.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // --- Зацикленный каскад для Miru-лендинга ---
  // Повторяем тот же каскад появления: показываем → держим → убираем → заново.
  // Крутится только пока блок во вьюпорте; при reduce-motion просто статично.
  var miru = document.querySelector(".miru2");
  if (
    miru &&
    !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {
    var MIRU_CYCLE = 9000; // полный цикл
    var MIRU_OUT_AT = 7000; // когда начинаем убирать элементы
    var miruTimer = null;
    var miruOut = null;
    var miruRun = function () {
      miru.classList.add("is-visible");
      clearTimeout(miruOut);
      miruOut = setTimeout(function () {
        miru.classList.remove("is-visible");
      }, MIRU_OUT_AT);
    };
    var miruStart = function () {
      if (miruTimer) return;
      // фон-фото проявляется один раз и остаётся — петля переигрывает только
      // линии и компоненты поверх него (без «моргания» в чёрный экран).
      miru.classList.add("is-seen");
      miruRun();
      miruTimer = setInterval(miruRun, MIRU_CYCLE);
    };
    var miruStop = function () {
      if (miruTimer) {
        clearInterval(miruTimer);
        miruTimer = null;
      }
      clearTimeout(miruOut);
    };
    if ("IntersectionObserver" in window) {
      var miruIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) miruStart();
            else miruStop();
          });
        },
        { threshold: 0.2 }
      );
      miruIo.observe(miru);
    } else {
      miruStart();
    }
  }

  // --- Тень/линия у шапки при скролле ---
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = function () {
      header.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // --- Год в подвале ---
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Lenis: плавный инерционный скролл ---
  var lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    // Плавный переход по якорям на этой же странице
    document.querySelectorAll('a[href*="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href") || "";
        var hash = href.slice(href.indexOf("#"));
        if (!hash || hash === "#") return;
        var target = document.querySelector(hash);
        if (!target) return; // цель на другой странице — обычный переход
        e.preventDefault();
        lenis.scrollTo(target, { offset: -90, duration: 1.1 });
        history.replaceState(null, "", hash);
      });
    });
  }

  // --- Кнопка «наверх» (только на страницах кейсов) ---
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    var toTopSync = function () {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      toTop.classList.toggle("is-visible", y > 480);
    };
    toTopSync();
    if (lenis) lenis.on("scroll", toTopSync);
    else window.addEventListener("scroll", toTopSync, { passive: true });
    toTop.addEventListener("click", function () {
      if (lenis) lenis.scrollTo(0, { duration: 1.0 });
      else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // --- Success-модалка «Изменение ИУП»: конфетти + поп-анимация ---
  var hssucc = document.querySelector("[data-hssucc]");
  if (hssucc) {
    var confettiHost = hssucc.querySelector(".hssucc__confetti");
    var confColors = ["#FACC15", "#22C55E", "#8B5CF6", "#EF4444", "#3B82F6", "#FB923C"];
    for (var ci = 0; ci < 22; ci++) {
      var piece = document.createElement("span");
      piece.className = "hssucc__piece";
      var ang = Math.random() * Math.PI * 2;
      var dist = 22 + Math.random() * 36;
      var tx = Math.cos(ang) * dist;
      var ty = Math.sin(ang) * dist * 0.5 + (16 + Math.random() * 28); // смещение вниз — «падают»
      piece.style.setProperty("--c", confColors[ci % confColors.length]);
      piece.style.setProperty("--tx", tx.toFixed(1) + "cqw");
      piece.style.setProperty("--ty", ty.toFixed(1) + "cqw");
      piece.style.setProperty("--rot", Math.round(Math.random() * 720 - 360) + "deg");
      piece.style.setProperty("--dur", (1.2 + Math.random() * 0.9).toFixed(2) + "s");
      piece.style.setProperty("--delay", (Math.random() * 0.18).toFixed(2) + "s");
      confettiHost.appendChild(piece);
    }
    var hssuccPlay = function () {
      hssucc.classList.remove("is-playing");
      void hssucc.offsetWidth; // reflow — перезапуск CSS-анимаций
      hssucc.classList.add("is-playing");
    };
    if ("IntersectionObserver" in window && !reduceMotion) {
      var hssuccTimer = null;
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              hssuccPlay();
              if (!hssuccTimer) hssuccTimer = setInterval(hssuccPlay, 4200);
            } else if (hssuccTimer) {
              clearInterval(hssuccTimer);
              hssuccTimer = null;
            }
          });
        },
        { threshold: 0.4 }
      ).observe(hssucc);
    } else {
      hssucc.classList.add("is-playing");
    }
    var hssuccBtn = hssucc.querySelector(".hssucc__btn");
    if (hssuccBtn) hssuccBtn.addEventListener("click", function (e) { e.preventDefault(); hssuccPlay(); });
  }

  // --- Hero с видео на экране ноутбука: проекция видео на 4 угла экрана (matrix3d) ---
  var heroLaptops = document.querySelectorAll("[data-hero-laptop]");
  if (heroLaptops.length) {
    // Общая 2D-проекция (homography) прямоугольника source → 4 точки dest
    var adj = function (m) {
      return [
        m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
        m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
        m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
      ];
    };
    var mmul = function (a, b) {
      var r = [];
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
        var s = 0; for (var k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j]; r[3 * i + j] = s;
      }
      return r;
    };
    var mvmul = function (m, v) {
      return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
    };
    var basis = function (p) {
      var m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1];
      var v = mvmul(adj(m), [p[3][0], p[3][1], 1]);
      return mmul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
    };
    var toMatrix3d = function (src, dst) {
      var H = mmul(basis(dst), adj(basis(src)));
      for (var i = 0; i < 9; i++) H[i] /= H[8];
      return [H[0], H[3], 0, H[6], H[1], H[4], 0, H[7], 0, 0, 1, 0, H[2], H[5], 0, H[8]];
    };
    Array.prototype.forEach.call(heroLaptops, function (fig) {
      var video = fig.querySelector(".hero-laptop__screen");
      var corners;
      try { corners = JSON.parse(fig.getAttribute("data-hero-laptop")); } catch (e) { return; }
      var place = function () {
        var W = fig.clientWidth, Hh = fig.clientHeight;
        if (!W || !Hh) return;
        video.style.width = W + "px";
        video.style.height = Hh + "px";
        var dst = corners.map(function (c) { return [c[0] / 100 * W, c[1] / 100 * Hh]; });
        var src = [[0, 0], [W, 0], [W, Hh], [0, Hh]]; // TL, TR, BR, BL — тот же порядок
        video.style.transform = "matrix3d(" + toMatrix3d(src, dst).join(",") + ")";
        video.classList.add("is-placed");
      };
      place();
      setTimeout(place, 80);
      setTimeout(place, 400);
      // Фрейм может получить размер позже (все дети absolute) — пересчитываем при изменении размера
      if (window.ResizeObserver) { new ResizeObserver(place).observe(fig); }
      window.addEventListener("resize", place, { passive: true });
      window.addEventListener("load", place);
      if (video.readyState < 1) video.addEventListener("loadedmetadata", place, { once: true });
    });
  }

  // --- Карусель страниц: нумерованные табы + горизонтальный скролл ---
  var carousels = document.querySelectorAll("[data-carousel]");
  Array.prototype.forEach.call(carousels, function (cz) {
    var track = cz.querySelector("[data-cz-track]");
    var tabs = cz.querySelectorAll(".cz__tab");
    var slides = track ? track.querySelectorAll(".cz__slide") : [];
    if (!track || !tabs.length) return;
    var setActive = function (idx) {
      Array.prototype.forEach.call(tabs, function (t, i) {
        t.classList.toggle("is-active", i === idx);
      });
    };
    Array.prototype.forEach.call(tabs, function (tab, i) {
      tab.addEventListener("click", function () {
        track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
        if (slides[i]) slides[i].scrollTop = 0;   // новый экран — сверху
        setActive(i);
      });
    });
    // при ручном горизонтальном скролле подсвечиваем нужный таб
    var raf = null;
    track.addEventListener("scroll", function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var idx = Math.round(track.scrollLeft / track.clientWidth);
        setActive(Math.max(0, Math.min(tabs.length - 1, idx)));
      });
    }, { passive: true });
  });

  // --- Scroll-fill интро-строк: слова затемняются по мере прокрутки ---
  var introLines = document.querySelectorAll(".intro__line");
  if (introLines.length && !reduceMotion) {
    var introFills = [];
    Array.prototype.forEach.call(introLines, function (line) {
      var text = (line.textContent || "").replace(/\s+/g, " ").trim();
      var words = text.split(" ");
      line.textContent = "";
      var wEls = [];
      words.forEach(function (w, i) {
        var s = document.createElement("span");
        s.className = "w";
        s.textContent = w;
        line.appendChild(s);
        if (i < words.length - 1) line.appendChild(document.createTextNode(" "));
        wEls.push(s);
      });
      introFills.push(wEls);
    });
    var fill = function () {
      var vh = window.innerHeight;
      var prog = Math.min(1, (window.scrollY + vh * 0.24) / (vh * 0.72));
      introFills.forEach(function (wEls) {
        var n = Math.ceil(prog * wEls.length);
        for (var i = 0; i < wEls.length; i++) wEls[i].classList.toggle("on", i < n);
      });
    };
    fill();
    if (lenis) lenis.on("scroll", fill);
    else window.addEventListener("scroll", fill, { passive: true });
    window.addEventListener("resize", fill, { passive: true });
  }

  // --- Хиро-леттеринг: перебор стилей folio с кросс-фейдом (PORT статичен).
  //     Крутится только во вьюпорте; при наведении курсора замирает на текущем. ---
  var lockEl = document.querySelector(".intro__lockup");
  if (lockEl) {
    var lockLayers = lockEl.querySelectorAll(".lk");
    if (lockLayers.length > 1 && !reduceMotion) {
      var li = 0;
      var lockTimer = null;
      var lockInView = false;
      var lockHover = false;
      var lockTick = function () {
        lockLayers[li].classList.remove("is-on");
        li = (li + 1) % lockLayers.length;
        lockLayers[li].classList.add("is-on");
      };
      // крутим только когда блок виден и на него не наведён курсор
      var lockSync = function () {
        var run = lockInView && !lockHover;
        if (run && !lockTimer) lockTimer = setInterval(lockTick, 750);
        else if (!run && lockTimer) { clearInterval(lockTimer); lockTimer = null; }
      };
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { lockInView = e.isIntersecting; });
          lockSync();
        }, { threshold: 0.2 }).observe(lockEl);
      } else {
        lockInView = true;
        lockSync();
      }
      lockEl.addEventListener("pointerenter", function () { lockHover = true; lockSync(); });
      lockEl.addEventListener("pointerleave", function () { lockHover = false; lockSync(); });
    }
  }



  // --- Before/After слайдер (Было/Стало) ---
  Array.prototype.forEach.call(document.querySelectorAll("[data-ba]"), function (ba) {
    var before = ba.querySelector("[data-ba-before]");
    var handle = ba.querySelector("[data-ba-handle]");
    var range = ba.querySelector(".ba__range");
    var labelBefore = ba.querySelector(".ba__label--before");
    var labelAfter = ba.querySelector(".ba__label--after");
    if (!before || !handle) return;
    var dragging = false;
    var cur = 50;

    var set = function (pct) {
      cur = Math.max(0, Math.min(100, pct));
      before.style.clipPath = "inset(0 " + (100 - cur) + "% 0 0)";
      handle.style.left = cur + "%";
      ba.setAttribute("aria-valuenow", Math.round(cur));
      // Метку прячем, когда её сторона почти скрыта
      if (labelBefore) labelBefore.style.opacity = cur < 8 ? "0" : "1";
      if (labelAfter) labelAfter.style.opacity = cur > 92 ? "0" : "1";
      if (range && +range.value !== Math.round(cur)) range.value = cur;
    };

    var pctFromX = function (clientX) {
      var r = ba.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    };

    var onMove = function (e) {
      if (!dragging) return;
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      set(pctFromX(x));
      if (e.cancelable) e.preventDefault();
    };
    var onDown = function (e) {
      dragging = true;
      ba.classList.add("is-dragging");
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      set(pctFromX(x));
    };
    var onUp = function () {
      dragging = false;
      ba.classList.remove("is-dragging");
    };

    ba.addEventListener("mousedown", onDown);
    ba.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    if (range) range.addEventListener("input", function () { set(+range.value); });

    // Доступность с клавиатуры
    ba.setAttribute("tabindex", "0");
    ba.setAttribute("role", "slider");
    ba.setAttribute("aria-label", "Сравнение: было и стало");
    ba.setAttribute("aria-valuemin", "0");
    ba.setAttribute("aria-valuemax", "100");
    ba.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { set(cur - 4); e.preventDefault(); }
      else if (e.key === "ArrowRight") { set(cur + 4); e.preventDefault(); }
      else if (e.key === "Home") { set(0); e.preventDefault(); }
      else if (e.key === "End") { set(100); e.preventDefault(); }
    });

    set(50);
  });

  // --- Переключатель работ: UX/UI ↔ Graphic Design ---
  var worksTabs = document.querySelectorAll(".works__tab");
  if (worksTabs.length) {
    var worksTiles = document.querySelectorAll(".works__grid .tile");
    var worksEmpty = document.querySelector(".works__empty");
    var introByCat = document.querySelectorAll(".intro__line[data-cat]");
    var applyCat = function (cat) {
      var shown = 0;
      Array.prototype.forEach.call(worksTiles, function (tile) {
        var show = (tile.getAttribute("data-cat") || "uxui") === cat;
        tile.classList.toggle("tile--hidden", !show);
        if (show) shown++;
      });
      if (worksEmpty) worksEmpty.hidden = shown > 0;
      Array.prototype.forEach.call(worksTabs, function (t) {
        var on = t.getAttribute("data-cat") === cat;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      // приветствие по теме выбранной вкладки
      Array.prototype.forEach.call(introByCat, function (line) {
        var on = line.getAttribute("data-cat") === cat;
        line.hidden = !on;
        if (on) line.classList.add("is-visible"); // reveal мог не сработать, пока скрыт
      });
    };
    Array.prototype.forEach.call(worksTabs, function (tab) {
      tab.addEventListener("click", function () {
        applyCat(tab.getAttribute("data-cat"));
      });
    });
    // применяем фильтр сразу при загрузке по активной вкладке,
    // чтобы графические работы не показывались в UX/UI
    var activeTab = document.querySelector(".works__tab.is-active") || worksTabs[0];
    if (activeTab) applyCat(activeTab.getAttribute("data-cat"));
  }

  // --- Карточки модалки Hero Study: выбор по клику ---
  document.addEventListener("click", function (e) {
    var opt = e.target.closest && e.target.closest(".hsmodal__opt");
    if (!opt) return;
    var group = opt.closest(".hsmodal__options");
    if (!group) return;
    Array.prototype.forEach.call(group.querySelectorAll(".hsmodal__opt"), function (b) {
      var on = b === opt;
      b.classList.toggle("is-selected", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });

  // --- Авто-демо модалки: подсветка карточек по кругу (как луп на главном экране) ---
  var hsGroup = document.querySelector(".hsmodal__options");
  if (hsGroup) {
    var hsOpts = Array.prototype.slice.call(hsGroup.querySelectorAll(".hsmodal__opt"));
    var hsReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hsOpts.length && !hsReduce) {
      var hsI = 0, hsTimer = null, hsHover = false, hsLocked = false;
      var hsClear = function () {
        hsOpts.forEach(function (o) { o.classList.remove("is-demo"); });
      };
      var hsTick = function () {
        hsClear();
        if (hsLocked || hsHover) return;
        hsOpts[hsI % hsOpts.length].classList.add("is-demo");
        hsI++;
      };
      var hsStop = function () { if (hsTimer) { clearInterval(hsTimer); hsTimer = null; } };
      hsGroup.addEventListener("mouseenter", function () { hsHover = true; hsClear(); });
      hsGroup.addEventListener("mouseleave", function () { hsHover = false; });
      hsOpts.forEach(function (o) {
        o.addEventListener("click", function () { hsLocked = true; hsStop(); hsClear(); });
      });
      hsTick();
      hsTimer = setInterval(hsTick, 1600);
    }
  }

  // --- Модалка 2: дропдаун со списком (раскрытие/схлопывание в рамках высоты модалки) ---
  var hsdd = document.querySelector(".hsdd[data-dd]");
  if (hsdd) {
    var ddTrigger = hsdd.querySelector(".hsdd__trigger");
    var ddList = hsdd.querySelector(".hsdd__list");
    var ddValue = hsdd.querySelector(".hsdd__value");
    var ddItems = Array.prototype.slice.call(hsdd.querySelectorAll(".hsdd__item"));
    var ddCell = hsdd.closest(".tl__gcell--modalui");

    var ddFit = function () {
      if (!ddCell) return;
      var cellR = ddCell.getBoundingClientRect();
      var listTop = ddList.getBoundingClientRect().top;
      var pad = Math.max(8, cellR.height * 0.05);
      var avail = cellR.bottom - listTop - pad;
      var content = ddList.scrollHeight; // полная высота списка
      ddList.style.maxHeight = Math.max(0, Math.min(avail, content)) + "px";
    };
    var ddOpen = function () {
      hsdd.classList.add("is-open");
      ddTrigger.setAttribute("aria-expanded", "true");
      ddFit();
    };
    var ddClose = function () {
      hsdd.classList.remove("is-open");
      ddTrigger.setAttribute("aria-expanded", "false");
      ddList.style.maxHeight = "0px";
    };
    ddTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (hsdd.classList.contains("is-open")) ddClose();
      else ddOpen();
    });
    ddItems.forEach(function (it) {
      it.addEventListener("click", function (e) {
        e.stopPropagation();
        ddItems.forEach(function (o) { o.classList.remove("is-active"); o.setAttribute("aria-selected", "false"); });
        it.classList.add("is-active");
        it.setAttribute("aria-selected", "true");
        ddValue.textContent = it.textContent;
        ddValue.classList.remove("is-empty");
        ddClose();
      });
    });
    document.addEventListener("click", function (e) {
      if (hsdd.classList.contains("is-open") && !hsdd.contains(e.target)) ddClose();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && hsdd.classList.contains("is-open")) ddClose();
    });
    window.addEventListener("resize", function () {
      if (hsdd.classList.contains("is-open")) ddFit();
    });

    // языки RU/EN/KZ/UZ
    var ddLangs = Array.prototype.slice.call(document.querySelectorAll(".hsdd__lang"));
    ddLangs.forEach(function (l) {
      l.addEventListener("click", function () {
        ddLangs.forEach(function (x) { x.classList.remove("is-on"); });
        l.classList.add("is-on");
      });
    });
  }

  // --- Модалка «Сохранить как шаблон»: авто-демо ввода и нажатия Сохранить ---
  var svModal = document.querySelector(".hssave-modal");
  if (svModal) {
    var svInput = svModal.querySelector(".hssave__input");
    var svBtn = svModal.querySelector(".hssave__btn--primary");
    var svReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (svInput && svBtn && !svReduce) {
      var svText = "Внутренняя медицина";
      var svSaveLabel = svBtn.innerHTML;
      var svCheck = '<span class="hssave__check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>Сохранено';
      var svStop = false;
      var svTimers = [];
      var svClear = function () { svTimers.forEach(clearTimeout); svTimers = []; };
      var svWait = function (ms) { return new Promise(function (res) { svTimers.push(setTimeout(res, ms)); }); };
      var svTakeOver = function () {
        if (svStop) return;
        svStop = true;
        svClear();
        svInput.classList.remove("is-typing");
        svBtn.classList.remove("is-press", "is-done");
        svBtn.innerHTML = svSaveLabel;
      };
      ["focus", "pointerdown", "keydown"].forEach(function (ev) {
        svInput.addEventListener(ev, svTakeOver);
      });
      svBtn.addEventListener("pointerdown", svTakeOver);

      var svLoop = function () {
        return (async function () {
          while (!svStop) {
            svInput.value = "";
            svInput.classList.add("is-typing");
            for (var i = 0; i < svText.length && !svStop; i++) {
              svInput.value = svText.slice(0, i + 1);
              await svWait(52 + Math.random() * 55);
            }
            if (svStop) break;
            await svWait(700);
            svInput.classList.remove("is-typing");
            // нажатие Сохранить
            svBtn.classList.add("is-press");
            await svWait(170);
            svBtn.classList.remove("is-press");
            if (svStop) break;
            svBtn.classList.add("is-done");
            svBtn.innerHTML = svCheck;
            await svWait(1300);
            svBtn.classList.remove("is-done");
            svBtn.innerHTML = svSaveLabel;
            if (svStop) break;
            await svWait(500);
            svInput.value = "";
            await svWait(800);
          }
        })();
      };
      svLoop();
    }
  }
})();
