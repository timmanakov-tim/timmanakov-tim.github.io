/* Карточки навыков в «Книге навыков»: о чём навык и за что получен (или как получить).
   Стиль — как у карточек квестов, но без прогресса и навыков. Данные по каждому навыку — здесь. */
(function () {
  // ветки = ряды книги (branch у навыка — номер ряда)
  var BRANCH = [
    'Основы языка Go',
    'Ввод-вывод и системное программирование',
    'Конкурентность',
    'Веб-разработка'
  ];
  // radar — оси радара «Навыки» на главной (Алгоритмы, Императивное, ООП, Web/Backend, Безопасность, Графика, Групповая работа)
  // status: got — получен, locked — не получен, reward — награда ветки (финальный значок)
  var S = [
    // Ветка 1 — Основы языка Go
    { title: 'Основы синтаксиса', status: 'got', branch: 0, radar: ['Императивное'],
      about: 'Пишешь программы на Go с нуля: пакеты, переменные и типы, условия, циклы и функции. Понимаешь, как устроен файл с программой и как её запустить.',
      how: ['Quest 02 — первые программы и вывод символов', 'Quest 03 — функции, вложенные циклы, комбинаторика', 'Checkpoint 1 — задачи недели без подсказок'] },
    { title: 'Манипуляция памятью', status: 'got', branch: 0, radar: ['Императивное', 'Алгоритмы'],
      about: 'Понимаешь, где хранятся данные: указатели и адреса, передача по ссылке, срезы и их вместимость. Меняешь значения на месте без лишних копий.',
      how: ['Quest 04 — указатели: PointOne, DivMod, Swap', 'Quest 08 — срезы: AppendRange, MakeRange'] },
    { title: 'Интерфейсы', status: 'locked', branch: 0, radar: ['ООП'],
      about: 'Описываешь поведение через интерфейсы и пишешь код, который работает с разными типами одинаково. Основа гибкой архитектуры в Go.',
      how: ['Модуль «Интерфейсы» после бассейна', 'Проект с несколькими реализациями одного интерфейса'] },
    { title: 'Обработка ошибок', status: 'locked', branch: 0, radar: ['Императивное'],
      about: 'Возвращаешь и проверяешь ошибки по правилам Go, оборачиваешь их с контекстом и не теряешь причину сбоя.',
      how: ['Модуль «Ошибки в Go»', 'Проекты, где ошибки ввода нужно обрабатывать явно'] },
    { title: 'Тестирование', status: 'locked', branch: 0, radar: ['Безопасность'],
      about: 'Пишешь тесты на пакет testing: табличные тесты, проверка граничных случаев, запуск через go test.',
      how: ['Модуль «Тестирование»', 'Покрытие тестами своего проекта на ревю'] },
    { title: 'Сертификат Качества Кода', status: 'reward', branch: 0, radar: ['Императивное', 'ООП'],
      about: 'Награда за всю ветку «Основы языка Go»: чистый, понятный и проверенный тестами код.',
      how: ['Получить все навыки ветки: от «Основ синтаксиса» до «Тестирования»'] },

    // Ветка 2 — Ввод-вывод и системное программирование
    { title: 'Ввод-Вывод', status: 'got', branch: 1, radar: ['Императивное'],
      about: 'Читаешь аргументы программы и стандартный ввод, выводишь результат в нужном формате и запускаешь другие программы из своей.',
      how: ['Quest 07 — аргументы командной строки через os.Args', 'Quadchecker — чтение stdin и запуск процессов через os/exec'] },
    { title: 'Консольные утилиты', status: 'locked', branch: 1, radar: ['Императивное'],
      about: 'Делаешь полноценные утилиты командной строки: флаги, подсказки по использованию, коды завершения.',
      how: ['Модуль «CLI-утилиты»', 'Проект — своя консольная утилита'] },
    { title: 'Файловая система', status: 'locked', branch: 1, radar: ['Императивное', 'Безопасность'],
      about: 'Читаешь и пишешь файлы, обходишь каталоги, работаешь с путями и правами доступа.',
      how: ['Модуль «Файлы и каталоги»'] },
    { title: 'Управление конфигурацией', status: 'locked', branch: 1, radar: ['Web/Backend'],
      about: 'Выносишь настройки из кода: файлы конфигурации, переменные окружения, значения по умолчанию.',
      how: ['Модуль «Конфигурация приложения»'] },
    { title: 'Логирование и Окружение', status: 'locked', branch: 1, radar: ['Web/Backend'],
      about: 'Пишешь понятные логи с уровнями и контекстом, настраиваешь поведение программы через окружение.',
      how: ['Модуль «Логирование»'] },
    { title: 'Ключ от Ядра Системы', status: 'reward', branch: 1, radar: ['Императивное', 'Web/Backend'],
      about: 'Награда за всю ветку «Ввод-вывод и системное программирование»: уверенная работа с ОС из Go.',
      how: ['Получить все навыки ветки: от «Ввода-Вывода» до «Логирования и Окружения»'] },

    // Ветка 3 — Конкурентность
    { title: 'Горутины', status: 'locked', branch: 2, radar: ['Алгоритмы'],
      about: 'Запускаешь задачи параллельно с помощью горутин и понимаешь, как их дожидаться.',
      how: ['Модуль «Горутины»'] },
    { title: 'Каналы передачи данных', status: 'locked', branch: 2, radar: ['Алгоритмы'],
      about: 'Передаёшь данные между горутинами через каналы: буферизованные и нет, select, закрытие каналов.',
      how: ['Модуль «Каналы»'] },
    { title: 'Синхронизация потоков', status: 'locked', branch: 2, radar: ['Алгоритмы', 'Безопасность'],
      about: 'Защищаешь общие данные: sync.Mutex, WaitGroup, атомарные операции, поиск гонок данных.',
      how: ['Модуль «Синхронизация»'] },
    { title: 'Контексты управления', status: 'locked', branch: 2, radar: ['Web/Backend'],
      about: 'Отменяешь долгие операции и задаёшь тайм-ауты через context.Context.',
      how: ['Модуль «Context»'] },
    { title: 'Паттерны конкурентности', status: 'locked', branch: 2, radar: ['Алгоритмы', 'Групповая работа'],
      about: 'Собираешь пулы воркеров, конвейеры и fan-in/fan-out из горутин и каналов.',
      how: ['Модуль «Паттерны»', 'Командный проект с параллельной обработкой'] },
    { title: 'Кристалл Бесконечных Потоков', status: 'reward', branch: 2, radar: ['Алгоритмы'],
      about: 'Награда за всю ветку «Конкурентность»: пишешь быстрый и безопасный параллельный код.',
      how: ['Получить все навыки ветки: от «Горутин» до «Паттернов конкурентности»'] },

    // Ветка 4 — Веб-разработка
    { title: 'Базовый HTTP', status: 'locked', branch: 3, radar: ['Web/Backend'],
      about: 'Поднимаешь HTTP-сервер на net/http, обрабатываешь запросы и отдаёшь ответы с правильными кодами.',
      how: ['Модуль «HTTP-сервер»'] },
    { title: 'Маршрутизация и Middleware', status: 'locked', branch: 3, radar: ['Web/Backend', 'Безопасность'],
      about: 'Разводишь запросы по обработчикам и добавляешь общую логику: авторизацию, логирование, CORS.',
      how: ['Модуль «Маршрутизация»'] },
    { title: 'Обмен данными', status: 'locked', branch: 3, radar: ['Web/Backend'],
      about: 'Принимаешь и отдаёшь JSON, валидируешь входные данные, проектируешь понятное API.',
      how: ['Модуль «JSON и API»'] },
    { title: 'Работа с базами данных', status: 'locked', branch: 3, radar: ['Web/Backend'],
      about: 'Подключаешься к SQL-базе, пишешь запросы, миграции и транзакции.',
      how: ['Модуль «Базы данных»', 'Проект с хранением данных'] },
    { title: 'Веб-архитектура', status: 'locked', branch: 3, radar: ['Web/Backend', 'ООП'],
      about: 'Делишь приложение на слои, настраиваешь зависимости и готовишь сервис к развёртыванию.',
      how: ['Модуль «Архитектура веб-приложений»'] },
    { title: 'Орден Микросервисной Архитектуры', status: 'reward', branch: 3, radar: ['Web/Backend', 'Групповая работа'],
      about: 'Награда за всю ветку «Веб-разработка»: проектируешь и собираешь сервисы из нескольких частей.',
      how: ['Получить все навыки ветки: от «Базового HTTP» до «Веб-архитектуры»'] }
  ];
  var STATUS = { got: ['Получен', 'got'], locked: ['Не получен', 'locked'], reward: ['Награда ветки', 'reward'] };

  var card = document.getElementById('sk-card');
  var stage = document.getElementById('stage');
  var nodes = document.querySelectorAll('.sk-row .skill');
  if (!card || nodes.length !== S.length) return;
  var el = function (sel) { return card.querySelector(sel); };

  function fill(s) {
    var st = STATUS[s.status];
    el('.qcard-title').textContent = s.title;
    el('.qcard-status').textContent = st[0];
    el('.qcard-status').className = 'qcard-status ' + st[1];
    el('.sk-about').textContent = s.about;
    el('.sk-how-title').textContent = s.status === 'got' ? 'За что получен' : 'Как получить';
    // названия квестов и чекпоинтов в начале пункта — зелёным
    el('.sk-how').innerHTML = s.how.map(function (t) {
      return '<li>' + t.replace(/^(Quest \d+|Checkpoint \d+|Quadchecker)/, '<span class="sk-quest">$1</span>') + '</li>';
    }).join('');
  }

  // справа от навыка, а если не помещается — слева; по вертикали напротив иконки
  function place(node) {
    var k = stage.getBoundingClientRect().width / 1440;
    var sr = stage.getBoundingClientRect(), nr = node.getBoundingClientRect();
    var nl = (nr.left - sr.left) / k, nw = nr.width / k;
    var left = nl + nw + 16 + 536 <= 1408 ? nl + nw + 16 : nl - 16 - 536;
    var h = card.offsetHeight;
    var top = Math.max(88, Math.min(1024 - 16 - h, (nr.top - sr.top) / k + 20 - h / 2));
    card.style.left = Math.round(left / 4) * 4 + 'px';
    card.style.top = Math.round(top / 4) * 4 + 'px';
  }

  var current;
  function show(node, i) {
    var fresh = card.hidden || current !== node;
    fill(S[i]);
    card.hidden = false;
    place(node);
    if (fresh) { card.classList.remove('show'); void card.offsetWidth; card.classList.add('show'); }
    current = node;
  }
  // скрывается сразу, как только курсор ушёл с иконки
  function hide() { card.hidden = true; current = null; }

  nodes.forEach(function (node, i) {
    if (node.tagName !== 'A') node.tabIndex = 0;
    node.setAttribute('aria-describedby', 'sk-card');
    // поповер открывается только при наведении на иконку, не на подпись
    var icon = node.querySelector('img') || node;
    icon.addEventListener('mouseenter', function () { show(node, i); });
    icon.addEventListener('mouseleave', hide);
    node.addEventListener('focus', function () { show(node, i); });
    node.addEventListener('blur', hide);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { card.hidden = true; current = null; } });
  // skills.html?skill=N — переход из модалки «Новый навык получен»: после анимации появления открываем карточку навыка
  var want = Number(new URLSearchParams(location.search).get('skill'));
  if (location.search.indexOf('skill=') !== -1 && nodes[want]) {
    setTimeout(function () { show(nodes[want], want); }, 1400);
    // открытая так карточка закрывается кликом в любом месте (курсор на ней не был — mouseleave не сработает)
    document.addEventListener('click', function (e) { if (!card.contains(e.target)) hide(); });
  }
})();
