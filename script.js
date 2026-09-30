// ---------------------------------------------------------
// Портфолио — интерактив: тема, появление секций, тень навбара
// ---------------------------------------------------------

(function () {
  "use strict";

  const root = document.documentElement;

  // --- Тема: запоминаем выбор, стартуем от системной ---
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

  applyTheme(storedTheme());

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
  } else {
    revealables.forEach(function (el) {
      el.classList.add("is-visible");
    });
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

  // --- Форма связи (без бэкенда: собираем mailto) ---
  const form = document.getElementById("contact-form");
  if (form) {
    const status = form.querySelector(".form__status");
    const RECIPIENT = "tim.manakov@gmail.com";

    const setStatus = function (text, type) {
      if (!status) return;
      status.textContent = text;
      status.dataset.type = type || "";
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.elements["name"].value.trim();
      const email = form.elements["email"].value.trim();
      const message = form.elements["message"].value.trim();

      // Базовая валидация
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !message || !emailOk) {
        setStatus("Заполните имя, корректный email и сообщение.", "error");
        const firstInvalid = !name
          ? form.elements["name"]
          : !emailOk
          ? form.elements["email"]
          : form.elements["message"];
        if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
        return;
      }

      const subject = "Сообщение с портфолио — " + name;
      const body =
        "Имя: " + name + "\nEmail: " + email + "\n\n" + message;
      const mailto =
        "mailto:" +
        RECIPIENT +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      setStatus("Открываю почтовый клиент…", "ok");
      window.location.href = mailto;
    });
  }
})();
