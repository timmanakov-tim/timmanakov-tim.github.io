/* Плавное появление компонентов при загрузке страницы.
   Страница задаёт порядок в window.REVEAL: [селектор, старт мс, шаг мс, вариант].
   Варианты: rise — подъём снизу, pop — рост из центра, wipe — прорисовка слева направо,
   grow — рост снизу вверх (столбики). Анимируются opacity/translate/scale/clip-path,
   поэтому ховер-эффекты на transform продолжают работать. */
(function () {
  var groups = window.REVEAL || [];
  // PACE растягивает все задержки из window.REVEAL: один множитель для подстройки темпа всех страниц
  var PACE = 1.5;
  var STAGGER_MAX = 360;
  if (!groups.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var css =
    // Средний темп: 550 мс и мягкий ease-out (quart). Быстрее — похоже на перемотку, медленнее — утомляет
    '.rv{animation:rv-rise .55s cubic-bezier(.25,1,.5,1) both;animation-delay:var(--rd,0ms)}' +
    '.rv.rv-pop{animation-name:rv-pop}' +
    '.rv.rv-wipe{animation-name:rv-wipe;animation-duration:.7s}' +
    '.rv.rv-grow{animation-name:rv-grow;transform-origin:bottom}' +
    '@keyframes rv-rise{from{opacity:0;translate:0 12px}to{opacity:1;translate:0 0}}' +
    '@keyframes rv-pop{from{opacity:0;scale:.94}to{opacity:1;scale:1}}' +
    '@keyframes rv-wipe{from{opacity:0;clip-path:inset(0 100% 0 0)}20%{opacity:1}to{opacity:1;clip-path:inset(0 0 0 0)}}' +
    '@keyframes rv-grow{from{opacity:0;scale:1 0}to{opacity:1;scale:1 1}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  groups.forEach(function (g) {
    var els = document.querySelectorAll(g[0]);
    var start = g[1] || 0, step = g[2] || 0, variant = g[3];
    Array.prototype.forEach.call(els, function (el, i) {
      // разброс внутри группы ограничен STAGGER_MAX: длинные ряды не растягивают появление
      el.style.setProperty('--rd', Math.round((start + Math.min(i * step, STAGGER_MAX / PACE)) * PACE) + 'ms');
      el.classList.add('rv');
      if (variant) el.classList.add('rv-' + variant);
      // снимаем класс после анимации, чтобы не мешать ховерам и backdrop-filter
      el.addEventListener('animationend', function done(e) {
        if (e.target !== el) return;
        el.classList.remove('rv', 'rv-' + variant);
        el.style.removeProperty('--rd');
        el.removeEventListener('animationend', done);
      });
    });
  });
})();
