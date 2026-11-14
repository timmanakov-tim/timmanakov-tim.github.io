/* Таймер учебного времени за сегодня (в прототипе сегодня — пятница).
   При каждой загрузке страницы стартует с 0:00:00 и идёт вверх каждую секунду. Время сверх дневной нормы
   (4 ч, пунктир на графике) тоже засчитывается: таймер, подсказка пятницы, столбик и сумма за неделю продолжают расти.
   Полный столбик = 8 ч. Заодно обновляет время пятницы в графике «Неделя» на главной. */
(function () {
  var origin = Date.now(); // отсчёт с нуля при каждом открытии/обновлении страницы

  var timeEls = document.querySelectorAll('.timer-time');
  var today = document.querySelector('.day.today');
  var tip = today && today.querySelector('.day-tip');
  var MAX_H = 8 * 3600; // полный столбик = 8 ч
  var sum = document.querySelector('.week-sum');

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var s = Math.floor((Date.now() - origin) / 1000);
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    var text = h + ':' + pad(m) + ':' + pad(sec);
    for (var i = 0; i < timeEls.length; i++) {
      timeEls[i].textContent = text;
      timeEls[i].setAttribute('datetime', 'PT' + h + 'H' + m + 'M' + sec + 'S');
    }
    if (today) {
      var label = h ? (m ? h + 'ч ' + m + 'м' : h + 'ч') : m + 'м';
      if (tip.textContent !== label) {
        tip.textContent = label;
        today.setAttribute('aria-label', 'Пятница, сегодня: ' + label);
      }
      today.style.setProperty('--h', Math.min(100, s / MAX_H * 100).toFixed(1) + 'px');
    }
    if (sum) {
      var total = Number(sum.dataset.baseMin) + Math.floor(s / 60);
      var sumText = Math.floor(total / 60) + ' ч' + (total % 60 ? ' ' + total % 60 + ' мин' : '') + ' / ' + sum.dataset.goalH + ' ч';
      if (sum.textContent !== sumText) sum.textContent = sumText;
    }
  }
  // ── Поповер «Таймер дня» при наведении на таймер в шапке (макет Figma 951:55795) ──
  // Норма: 20 ч в неделю / 5 учебных дней (Пн–Пт) = 4 ч в день. Шкала — 8 делений по 30 мин.
  // Геймификация: досидел норму — «Поток» (серия дней) растёт на 1, время сверх нормы идёт в копилку недели.
  var NORM = 4 * 3600;
  var STREAK = 3; // текущий поток в профиле; после нормы за сегодня станет 4
  var timerEl = document.querySelector('.timer');
  var pop, popTime, popSegs, popBody, streakEl;
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  }
  if (timerEl) {
    var font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap';
    document.head.appendChild(font);
    var css =
      '.timer{cursor:default;outline:none}' +
      '.timer:focus-visible{box-shadow:0 0 0 2px rgba(56,171,255,.6)}' +
      '.day-pop{position:absolute;top:calc(100% + 12px);right:0;z-index:20;width:520px;padding:24px;border-radius:20px;' +
        'display:flex;flex-direction:column;gap:16px;text-align:left;color:#fafafa;' +
        'background:rgba(94,129,151,.2);-webkit-backdrop-filter:blur(24px) saturate(140%);backdrop-filter:blur(24px) saturate(140%);' +
        'box-shadow:0 16px 40px rgba(3,16,38,.35);opacity:0;visibility:hidden;transform:translateY(-4px);' +
        'transition:opacity .2s ease,transform .2s ease,visibility .2s;pointer-events:none}' +
      '.timer:hover .day-pop,.timer:focus-visible .day-pop{opacity:1;visibility:visible;transform:none}' +
      '.day-pop-title{font:500 24px/32px Roboto,Inter,sans-serif}' +
      '.day-pop-main{display:flex;flex-direction:column;gap:12px}' +
      '.day-pop-row{display:flex;justify-content:space-between;gap:8px;font:400 16px/24px Inter,system-ui,sans-serif}' +
      '.day-pop-row span:last-child{font-variant-numeric:tabular-nums}' +
      '.day-pop-segs{display:flex;gap:2px;height:16px;padding:2px;border-radius:4px;background:rgba(250,250,250,.16)}' +
      '.day-pop-segs i{flex:1;border-radius:4px;background:rgba(3,16,38,.2);overflow:hidden}' +
      '.day-pop-segs b{display:block;height:100%;border-radius:4px;background:#a3e635}' +
      '.day-pop-body{font:400 16px/24px Roboto,Inter,sans-serif;letter-spacing:.5px;color:#b0b4ba}' +
      '.day-pop-body .hl{color:#a3e635}' +
      '.day-pop-body .big{display:block;font-size:20px;line-height:28px;letter-spacing:0;color:#fafafa}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    pop = document.createElement('div');
    pop.className = 'day-pop edge spin';
    pop.id = 'day-pop';
    pop.setAttribute('role', 'tooltip');
    pop.innerHTML =
      '<div class="day-pop-title">Таймер дня</div>' +
      '<div class="day-pop-main"><div class="day-pop-row"><span>Время за день</span><span class="day-pop-time"></span></div>' +
      '<div class="day-pop-segs">' + new Array(9).join('<i><b></b></i>') + '</div></div>' +
      '<p class="day-pop-body"></p>';
    timerEl.appendChild(pop);
    timerEl.tabIndex = 0;
    timerEl.setAttribute('aria-describedby', 'day-pop');
    popTime = pop.querySelector('.day-pop-time');
    popSegs = pop.querySelectorAll('.day-pop-segs b');
    popBody = pop.querySelector('.day-pop-body');
    // «Поток» в карточке профиля на главной
    document.querySelectorAll('.stat').forEach(function (el) {
      if (/Поток/.test(el.textContent)) streakEl = el.lastElementChild;
    });
  }
  function popTick() {
    if (!pop) return;
    var s = Math.floor((Date.now() - origin) / 1000);
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
    popTime.textContent = pad(h) + ' ч ' + pad(m) + ' мин / 4 ч';
    for (var i = 0; i < popSegs.length; i++) {
      var part = Math.max(0, Math.min(1, s / (NORM / 8) - i));
      popSegs[i].style.width = (part * 100).toFixed(1) + '%';
    }
    var done = s >= NORM;
    var streak = STREAK + (done ? 1 : 0);
    // две строки: итог и мотивация; время в тексте выделено зелёным (.hl)
    var dur = function (min) {
      var hh = Math.floor(min / 60), mm = min % 60;
      return '<span class="hl">' + [hh ? hh + ' ч' : '', mm ? mm + ' мин' : ''].filter(Boolean).join(' ') + '</span>';
    };
    var html;
    if (done) {
      var extra = Math.floor((s - NORM) / 60);
      html = '<span class="big">Норма дня выполнена.</span>' +
        (extra ? dur(extra) + ' ушли в копилку недели.' : 'Всё, что сверху, идёт в копилку недели.');
    } else {
      html = 'До нормы <span class="hl">4 ч</span> осталось ' + dur(Math.ceil((NORM - s) / 60)) +
        '.<br>Досидите — и поток вырастет до ' + (STREAK + 1) + ' ' + plural(STREAK + 1, 'дня', 'дней', 'дней') + '.';
    }
    if (popBody.innerHTML !== html) popBody.innerHTML = html;
    if (streakEl) streakEl.textContent = String(streak);
  }

  tick();
  popTick();
  setInterval(function () { tick(); popTick(); }, 1000);
})();
