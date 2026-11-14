/* Навыки трека Go core. Навыки Quest 9 — единый источник для карточки Quest 9 («Программа обучения»)
   и правой колонки урока. Прогресс меняется только здесь, и обе страницы показывают одно и то же.
   Разметка: <div data-skills></div> — сюда рисуется список навыков. */
(function () {
  var SKILLS = [
    { title: 'Базовые типы данных, срезы (slices) и функции высшего порядка', progress: 25 },
    { title: 'Функциональные типы и литералы функций в Go', progress: 0 }
  ];

  // Уровни по компоненту Figma «Skills progress» (655:99405): цвет дуги, процента и метки
  var LEVELS = [
    { max: 0,   text: 'Не освоен',     cls: 'none' },
    { max: 49,  text: 'Начинающий',    cls: 'begin', ring: '#f97316' },
    { max: 74,  text: 'Развивающийся', cls: 'grow',  ring: '#38abff' },
    { max: 99,  text: 'Уверенный',     cls: 'sure',  ring: '#4ade80' },
    { max: 100, text: 'Эксперт',       cls: 'expert', ring: '#a58cfa' }
  ];
  function level(p) {
    for (var i = 0; i < LEVELS.length; i++) if (p <= LEVELS[i].max) return LEVELS[i];
    return LEVELS[LEVELS.length - 1];
  }

  // Кольцо 32×32: дорожка + дуга цвета уровня от 12 часов по часовой стрелке (у «Эксперта» — полный круг)
  function ring(p) {
    var l = level(p);
    return '<svg class="skill-ring" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">' +
      '<circle cx="16" cy="16" r="14" fill="none" stroke="rgba(250,250,250,' + (l.cls === 'expert' ? '.2' : '.3') + ')" stroke-width="4"/>' +
      (p > 0 ? '<circle cx="16" cy="16" r="14" fill="none" stroke="' + l.ring + '" stroke-width="4" pathLength="100" stroke-dasharray="' +
        Math.min(100, p) + ' 100" transform="rotate(-90 16 16)"/>' : '') +
      '</svg>';
  }

  var css =
    '.skills-list{display:flex;flex-direction:column;gap:24px}' +
    '.skill-item{display:flex;gap:16px}' +
    '.skill-ring{flex:none}' +
    '.skill-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:20px}' +
    '.skill-meta{display:flex;align-items:center;gap:8px}' +
    '.skill-pct{color:#a1a1aa}' +
    '.skill-badge{padding:4px 8px;border-radius:8px;font-size:12px;line-height:16px;' +
      'background:rgba(255,255,255,.05);color:#a1a1aa}' +
    '.skill-badge.begin{background:rgba(249,115,22,.1);color:#fb923c}.skill-pct.begin{color:#f97316}' +
    '.skill-badge.grow{background:rgba(59,130,246,.1);color:#60a5fa}.skill-pct.grow{color:#97cfff}' +
    '.skill-badge.sure{background:rgba(34,197,94,.1);color:#4ade80}.skill-pct.sure{color:#4ade80}' +
    '.skill-badge.expert{background:rgba(139,92,246,.1);color:#a78bfa}.skill-pct.expert{color:#a58cfa}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // opts.percent === false — вариант компонента «Процент=Нет»
  function render(list, opts) {
    var withPct = !(opts && opts.percent === false);
    return '<div class="skills-list">' + list.map(function (s) {
      var l = level(s.progress);
      return '<div class="skill-item">' + ring(s.progress) +
        '<div class="skill-body"><p>' + s.title + '</p>' +
        '<div class="skill-meta">' + (withPct ? '<span class="skill-pct ' + l.cls + '">' + s.progress + '%</span>' : '') +
        '<span class="skill-badge ' + l.cls + '">' + l.text + '</span></div></div></div>';
    }).join('') + '</div>';
  }

  // [data-skills] — навыки Quest 9 (урок и карточка); другие списки рисуются через window.TSSkills.render
  var targets = document.querySelectorAll('[data-skills]');
  for (var i = 0; i < targets.length; i++) targets[i].innerHTML = render(SKILLS);
  window.TSSkills = { quest09: SKILLS, render: render };
})();
