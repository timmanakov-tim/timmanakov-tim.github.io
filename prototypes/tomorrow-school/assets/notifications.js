/* Колокольчик уведомлений для шапки всех страниц.
   Вставляется в .topbar-right перед аватаром. Прочитанные уведомления запоминаются
   в браузере (localStorage) и общие для всех страниц. */
(function () {
  var right = document.querySelector('.topbar-right');
  if (!right || document.getElementById('notif')) return;

  var page = location.pathname.split('/').pop() || 'index.html';
  var onLesson = page === 'lesson.html';
  // ссылки на уроки: на странице урока — переключение по #hash, с других страниц — переход с ?from=
  var lesson = function (hash) { return onLesson ? hash : 'lesson.html?from=' + page + hash; };

  // Карточки из набора Figma «Notification list»; ссылки — на подходящие страницы прототипа.
  // dot — цвет точки непрочитанного (как в варианте Chart=On), raid — карточка с командой и прогрессом.
  var NOTES = [
    { id: 'pool-deadline', type: 'Pool deadline', icon: 'assets/nt-flag.svg', bg: '#a3e635', title: 'Дедлайн проекта', text: 'Успей закрыть проекты', href: lesson('#quest-09') },
    { id: 'weekly-projects', type: 'Weekly projects', icon: 'assets/nt-terminal.svg', bg: '#fb923c', title: 'Проекты недели готовы', text: 'Новые появляются каждое воскресенье', href: 'program.html', dot: '#38abff' },
    { id: 'raid', type: 'Raid', icon: 'assets/nt-raid.svg', bg: '#facc15', title: 'Рейд недели стартовал', text: 'Времени до конца недели', href: 'program.html', raid: { team: ['assets/nt-av1.png', 'assets/nt-av2.png', 'assets/nt-av3.png'], progress: 0 } },
    { id: 'peer-review', type: 'Peer review', icon: 'assets/nt-review.svg', bg: '#6a78ff', title: 'Тебе выпала проверка', text: 'Оцени его в течение 3 дней', href: 'program.html' },
    { id: 'under-review', type: 'Under review', icon: 'assets/nt-search.svg', bg: '#e879f9', title: 'Твой проект на проверке', text: 'Результат придёт в течение 3 дней', href: lesson('#quest-09') },
    { id: 'exam', type: 'Exam', icon: 'assets/nt-exam.svg', bg: '#f87171', title: 'Завтра экзамен', text: 'Регистрация закроется через 24 часа', href: 'program.html' },
    { id: 'branch', type: 'Branch', icon: 'assets/nt-branch.svg', bg: '#34d399', title: 'Ветка активна', text: 'У тебя полгода, чтобы пройти ветку', href: 'skills.html' },
    { id: 'js-pool', type: 'JS pool', icon: 'assets/nt-pool.svg', bg: '#38abff', title: 'Открылся JS-бассейн', text: 'Регистрация закроется через 3 дня', href: 'index.html' }
  ];
  // уже прочитанные при первом открытии (вариант Chart=Off)
  var SEEN_BY_DEFAULT = ['branch', 'js-pool'];

  var css =
    '.topbar{z-index:10}' +
    '.notif{position:relative}' +
    '.notif .icon-btn{position:relative;width:40px;height:40px;padding:8px;border:0;border-radius:24px;cursor:pointer;background:rgba(94,129,151,.2);transition:background .2s}' +
    '.notif .icon-btn:hover,.notif .icon-btn[aria-expanded="true"]{background:rgba(94,129,151,.35)}' +
    '.notif .icon-btn img{display:block}' +
    '.notif-badge{position:absolute;top:-4px;right:-4px;z-index:2;min-width:20px;height:20px;padding:0 4px;border-radius:12px;background:#fb923c;color:#fff;box-shadow:0 0 0 2px #0b1d33;font:600 12px/20px Inter,system-ui,sans-serif;text-align:center}' +
    '.notif-badge[hidden]{display:none}' +
    '.notif-panel{position:absolute;top:52px;right:-60px;border-radius:16px;background:rgba(12,28,48,.94);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 16px 40px rgba(0,0,0,.35);transform-origin:top right;animation:notif-in .2s ease;text-align:left;color:#fafafa}' +
    '.notif-panel[hidden]{display:none}' +
    '@keyframes notif-in{from{opacity:0;transform:translateY(-6px) scale(.98)}}' +
    '.notif-head{display:flex;align-items:center;justify-content:space-between;padding:16px 16px 12px;border-bottom:1px solid rgba(250,250,250,.24);font:400 20px/28px Manrope,Inter,sans-serif}' +
    '.notif-readall{font:400 12px/16px "Open Sans",Inter,sans-serif;color:#97cfff;padding:4px 8px;border:0;border-radius:4px;background:none;cursor:pointer}' +
    '.notif-readall:hover{background:rgba(56,171,255,.12)}' +
    '.notif-readall:disabled{color:rgba(250,250,250,.4);background:none;cursor:default}' +
    '.notif-panel{width:380px}' +
    '.notif-list{list-style:none;margin:0;padding:16px;max-height:560px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;scrollbar-width:thin;scrollbar-color:rgba(250,250,250,.2) transparent}' +
    /* карточка: #5E8197 20% + стекло, радиус 20, отступы 16, между иконкой и текстом 12 */
    '.notif-item{position:relative;display:flex;align-items:center;gap:12px;padding:16px;border-radius:20px;background:rgba(94,129,151,.2);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);color:#fafafa;text-decoration:none;transition:background .2s,transform .2s}' +
    '.notif-item:hover{background:rgba(94,129,151,.3)}' +
    '.notif-item:active{transform:scale(.99)}' +
    '.notif-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:12px}' +
    '.notif-content{display:flex;align-items:flex-start;gap:12px}' +
    '.notif-icon{width:36px;height:36px;flex:none;border-radius:12px;padding:8px;box-sizing:border-box}' +
    '.notif-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}' +
    '.notif-title{font:400 16px/24px Manrope,Inter,sans-serif;color:#fafafa}' +
    '.notif-body{font:400 14px/20px Inter,system-ui,sans-serif;color:#b0b4ba}' +
    '.notif-dot{width:8px;height:8px;flex:none;border-radius:100px}' +
    '.notif-meta{display:flex;align-items:center;justify-content:space-between;gap:16px}' +
    '.notif-team{display:flex;align-items:center;gap:8px;font:400 16px/32px "Open Sans",Inter,sans-serif;letter-spacing:-.08px}' +
    '.notif-avatars{display:flex}' +
    '.notif-avatars img{width:20px;height:20px;border-radius:50%;box-shadow:-1px 0 1px rgba(0,0,0,.15),inset 0 0 0 .3px rgba(0,0,0,.08)}' +
    '.notif-avatars img+img{margin-left:-8px}' +
    '.notif-progress{display:flex;align-items:center;gap:8px;font:400 16px/24px Inter,system-ui,sans-serif;letter-spacing:-.08px}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.className = 'notif';
  wrap.id = 'notif';
  wrap.innerHTML =
    '<button class="icon-btn edge spin" id="notif-btn" type="button" aria-label="Уведомления" aria-haspopup="true" aria-expanded="false" aria-controls="notif-panel">' +
      '<img src="assets/ls-bell.svg" width="24" height="24" alt="">' +
      '<span class="notif-badge" id="notif-badge" hidden></span>' +
    '</button>' +
    '<div class="notif-panel edge" id="notif-panel" role="dialog" aria-label="Уведомления" hidden>' +
      '<div class="notif-head"><span>Уведомления</span>' +
      '<button type="button" class="notif-readall" id="notif-readall">Прочитать все</button></div>' +
      '<ul class="notif-list" id="notif-list"></ul>' +
    '</div>';
  var avatar = right.querySelector('.avatar-sm');
  right.insertBefore(wrap, avatar || null);

  var KEY = 'notif-read-v2';
  var read;
  try {
    var stored = localStorage.getItem(KEY);
    read = new Set(stored ? JSON.parse(stored) : SEEN_BY_DEFAULT);
  } catch (e) { read = new Set(SEEN_BY_DEFAULT); }
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(Array.from(read))); } catch (e) {} };

  var btn = document.getElementById('notif-btn');
  var panel = document.getElementById('notif-panel');
  var list = document.getElementById('notif-list');
  var badge = document.getElementById('notif-badge');
  var readAll = document.getElementById('notif-readall');

  function render() {
    list.innerHTML = '';
    NOTES.forEach(function (n) {
      var li = document.createElement('li');
      var unread = !read.has(n.id);
      var raid = n.raid ? (
        '<span class="notif-meta"><span class="notif-team">Команда<span class="notif-avatars">' +
        n.raid.team.map(function (src) { return '<img src="' + src + '" alt="">'; }).join('') + '</span></span>' +
        '<span class="notif-progress"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
        '<circle cx="10" cy="10" r="8" fill="none" stroke="rgba(250,250,250,.3)" stroke-width="4"/>' +
        (n.raid.progress ? '<circle cx="10" cy="10" r="8" fill="none" stroke="#b0b4ba" stroke-width="4" pathLength="100" stroke-dasharray="' + n.raid.progress + ' 100" transform="rotate(-90 10 10)"/>' : '') +
        '</svg>' + n.raid.progress + '%</span></span>') : '';
      li.innerHTML =
        '<a class="notif-item' + (unread ? ' unread' : '') + '" href="' + n.href + '" aria-label="' + n.title + '. ' + n.text + (unread ? ' (новое)' : '') + '">' +
        '<span class="notif-main"><span class="notif-content">' +
        '<img class="notif-icon" src="' + n.icon + '" alt="" style="background:' + n.bg + '">' +
        '<span class="notif-text"><span class="notif-title">' + n.title + '</span>' +
        '<span class="notif-body">' + n.text + '</span></span></span>' + raid + '</span>' +
        (unread ? '<span class="notif-dot" style="background:' + (n.dot || '#f87171') + '"></span>' : '') +
        '</a>';
      li.firstChild.addEventListener('click', function () { read.add(n.id); save(); render(); close(); });
      list.appendChild(li);
    });
    var unread = NOTES.filter(function (n) { return !read.has(n.id); }).length;
    badge.hidden = unread === 0;
    badge.textContent = unread;
    readAll.disabled = unread === 0;
    btn.setAttribute('aria-label', unread ? 'Уведомления: непрочитанных ' + unread : 'Уведомления');
  }
  function open() { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  function close() { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function (e) { e.stopPropagation(); panel.hidden ? open() : close(); });
  readAll.addEventListener('click', function () { NOTES.forEach(function (n) { read.add(n.id); }); save(); render(); });
  document.addEventListener('click', function (e) { if (!panel.hidden && !wrap.contains(e.target)) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); } });
  // отметки, сделанные на другой странице/вкладке
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    try { read = new Set(JSON.parse(e.newValue || '[]')); } catch (err) {}
    render();
  });
  render();
})();
