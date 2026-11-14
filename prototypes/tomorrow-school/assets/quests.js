/* Карточки квестов на «Программе обучения» (шаблон Figma SkillsSection 1186:87562).
   Данные по каждому узлу карты — здесь; карточка появляется при наведении или фокусе на узел.
   Навыки Quest 9 берутся из assets/skills.js — те же, что в уроке. */
(function () {
  var REQ = ['Соответствие функциональным требованиям', 'Чистый, читаемый код', 'Прохождение обязательных тестов', 'Защита на ревю-линии'];
  var REQ_RAID = ['Соответствие функциональным требованиям', 'Работа в команде и распределение задач', 'Прохождение обязательных тестов', 'Защита проекта всей командой'];
  var REQ_EXAM = ['Решение задач без подсказок и интернета', 'Ограниченное время', 'Прохождение автоматических тестов'];

  // status: done — пройден, now — в процессе, locked — закрыт; done — выполнено заданий из total
  var Q = {
    'quest-01': { title: 'Quest 01 · Shell и Git', status: 'done', done: 8, total: 8,
      learn: ['Работать в терминале: <code>ls</code>, <code>cd</code>, <code>pwd</code>, <code>mkdir</code>', 'Создавать и редактировать файлы из командной строки', 'Разбираться с правами доступа к файлам', 'Сохранять работу в Git: <code>add</code>, <code>commit</code>, <code>push</code>'],
      skills: [{ title: 'Командная строка Unix', progress: 75 }, { title: 'Контроль версий в Git', progress: 75 }], req: REQ },
    'quest-02': { title: 'Quest 02 · Основы Go', status: 'done', done: 6, total: 6,
      learn: ['Устройство программы: <code>package main</code> и <code>func main</code>', 'Выводить символы через <code>z01.PrintRune</code>', 'Писать циклы <code>for</code> и условия <code>if</code>', 'Печатать алфавит и цифры в прямом и обратном порядке'],
      skills: [{ title: 'Синтаксис Go: пакеты, переменные, циклы', progress: 75 }, { title: 'Работа с рунами и символами', progress: 75 }], req: REQ },
    'quest-03': { title: 'Quest 03 · Функции и циклы', status: 'done', done: 5, total: 5,
      learn: ['Объявлять функции с параметрами', 'Писать вложенные циклы', 'Выводить числа по цифрам: <code>PrintNbr</code>', 'Перебирать комбинации: <code>PrintComb</code>, <code>PrintCombN</code>'],
      skills: [{ title: 'Функции и параметры в Go', progress: 75 }, { title: 'Комбинаторика и вложенные циклы', progress: 75 }], req: REQ },
    'quad': { title: 'Quad · Рейд недели', status: 'done', done: 5, total: 5,
      learn: ['Рисовать прямоугольники символами: <code>QuadA</code>–<code>QuadE</code>', 'Обрабатывать граничные размеры фигур', 'Делить задачу на части внутри команды'],
      skills: [{ title: 'Командная работа в рейде', progress: 75 }, { title: 'Алгоритмы вывода фигур', progress: 75 }], req: REQ_RAID },
    'checkpoint-1': { title: 'Checkpoint 1 · Экзамен', status: 'done', done: 4, total: 4,
      learn: ['Решать задачи недели самостоятельно', 'Укладываться в отведённое время', 'Проверять решение до отправки'],
      skills: [{ title: 'Решение задач на время', progress: 75 }, { title: 'Самопроверка кода', progress: 75 }], req: REQ_EXAM },
    'quadchecker-1': { title: 'Quadchecker · Проверка фигур', status: 'done', done: 1, total: 1,
      learn: ['Читать данные из стандартного ввода', 'Запускать другие программы через <code>os/exec</code>', 'Сравнивать вывод и определять, какой Quad нарисовал фигуру'],
      skills: [{ title: 'Ввод-вывод и запуск процессов', progress: 75 }, { title: 'Командная работа в рейде', progress: 75 }], req: REQ_RAID },

    'quest-04': { title: 'Quest 04 · Указатели', status: 'done', done: 10, total: 10,
      learn: ['Понимать указатели и адреса: <code>PointOne</code>, <code>UltimatePointOne</code>', 'Возвращать несколько значений через указатели: <code>DivMod</code>', 'Менять значения на месте: <code>Swap</code>, <code>StrRev</code>', 'Переводить строку в число: <code>BasicAtoi</code>, <code>Atoi</code>'],
      skills: [{ title: 'Указатели и передача по ссылке', progress: 75 }, { title: 'Преобразование строк в числа', progress: 75 }], req: REQ },
    'quest-05': { title: 'Quest 05 · Рекурсия и математика', status: 'done', done: 9, total: 9,
      learn: ['Писать итеративные и рекурсивные функции: факториал, степень', 'Считать числа Фибоначчи и квадратный корень', 'Проверять и искать простые числа', 'Решать задачу восьми ферзей перебором с возвратом'],
      skills: [{ title: 'Рекурсия', progress: 75 }, { title: 'Базовые математические алгоритмы', progress: 75 }], req: REQ },
    'quest-06': { title: 'Quest 06 · Строки и руны', status: 'done', done: 12, total: 12,
      learn: ['Доставать руны из строки: <code>FirstRune</code>, <code>NRune</code>, <code>LastRune</code>', 'Искать и сравнивать строки: <code>Index</code>, <code>Compare</code>', 'Менять регистр: <code>ToUpper</code>, <code>ToLower</code>, <code>Capitalize</code>', 'Склеивать строки: <code>BasicJoin</code>, <code>Join</code>'],
      skills: [{ title: 'Работа со строками и рунами', progress: 75 }, { title: 'Базовые типы данных в Go', progress: 75 }], req: REQ },
    'quest-07': { title: 'Quest 07 · Аргументы программы', status: 'done', done: 4, total: 4,
      learn: ['Читать аргументы командной строки через <code>os.Args</code>', 'Выводить имя программы и её параметры', 'Разворачивать и сортировать параметры'],
      skills: [{ title: 'Аргументы командной строки', progress: 75 }, { title: 'Сортировка', progress: 75 }], req: REQ },
    'sudoku': { title: 'Sudoku · Рейд недели', status: 'done', done: 1, total: 1,
      learn: ['Проверять входные данные на корректность', 'Решать судоку перебором с возвратом', 'Выводить единственное решение или ошибку'],
      skills: [{ title: 'Алгоритм перебора с возвратом', progress: 75 }, { title: 'Командная работа в рейде', progress: 75 }], req: REQ_RAID },

    'quest-08': { title: 'Quest 08 · Срезы и структуры', status: 'done', done: 9, total: 9,
      learn: ['Создавать и расширять срезы: <code>AppendRange</code>, <code>MakeRange</code>', 'Разбивать строки на слова: <code>SplitWhiteSpaces</code>, <code>Split</code>', 'Переводить числа между системами счисления: <code>ConvertBase</code>', 'Описывать данные структурами: <code>struct Point</code>'],
      skills: [{ title: 'Срезы (slices) в Go', progress: 75 }, { title: 'Структуры', progress: 75 }], req: REQ },
    'quest-09': { title: 'Quest 09 · Функции', status: 'now', done: 2, total: 9,
      learn: ['Передавать функции как аргументы и возвращать их из других функций', 'Писать функциональные литералы — анонимные функции', 'Применять функцию к каждому элементу среза: <code>ForEach</code>, <code>Map</code>', 'Проверять элементы среза условием: <code>Any</code>, <code>CountIf</code>, <code>IsSorted</code>', 'Сортировать срезы строк своей функцией сравнения: <code>SortWordArr</code>'],
      skills: 'quest09', req: REQ },
    'hakathon': { title: 'Hakathon · Командный проект', status: 'locked', done: 0, total: 1,
      learn: ['Придумывать и собирать проект командой за ограниченное время', 'Распределять роли и договариваться о структуре кода', 'Презентовать результат'],
      skills: [{ title: 'Командная разработка', progress: 0 }, { title: 'Планирование проекта', progress: 0 }], req: REQ_RAID },
    'quadchecker-3': { title: 'Quadchecker · Итоговая проверка', status: 'locked', done: 0, total: 1,
      learn: ['Повторить работу со вводом-выводом и процессами', 'Покрыть решение тестами', 'Защитить проект на ревю'],
      skills: [{ title: 'Ввод-вывод и запуск процессов', progress: 0 }, { title: 'Тестирование', progress: 0 }], req: REQ_RAID },

    'quest-11': { title: 'Quest 11 · Связные списки', status: 'locked', done: 0, total: 8,
      learn: ['Описывать узлы списка структурами и указателями', 'Добавлять элементы: <code>ListPushBack</code>, <code>ListPushFront</code>', 'Обходить и измерять список: <code>ListSize</code>, <code>ListLast</code>, <code>ListAt</code>', 'Разворачивать и очищать список: <code>ListReverse</code>, <code>ListClear</code>'],
      skills: [{ title: 'Связные списки', progress: 0 }, { title: 'Указатели и структуры', progress: 0 }], req: REQ },
    'quest-12': { title: 'Quest 12 · Бинарные деревья', status: 'locked', done: 0, total: 7,
      learn: ['Вставлять данные в дерево: <code>BTreeInsertData</code>', 'Обходить дерево по порядку: <code>BTreeApplyInorder</code>', 'Искать элемент и считать уровни: <code>BTreeSearchItem</code>, <code>BTreeLevelCount</code>', 'Находить минимум и максимум'],
      skills: [{ title: 'Бинарные деревья поиска', progress: 0 }, { title: 'Рекурсивный обход структур', progress: 0 }], req: REQ }
  };
  var STATUS = { done: ['Пройден', 'done'], now: ['В процессе', 'now'], locked: ['Закрыт', 'locked'] };

  var card = document.getElementById('q-card');
  var stage = document.getElementById('stage');
  if (!card) return;
  var el = function (sel) { return card.querySelector(sel); };

  function fill(q) {
    var st = STATUS[q.status];
    var pct = Math.round(q.done / q.total * 100);
    el('.qcard-title').textContent = q.title;
    el('.qcard-status').textContent = st[0];
    el('.qcard-status').className = 'qcard-status ' + st[1];
    el('.qcard-pct').textContent = pct + ' / 100%';
    // шкала одинаковая у всех: 10 делений по 10%, неполное деление заполняется частично
    var segs = '';
    for (var i = 0; i < 10; i++) {
      var f = Math.max(0, Math.min(1, pct / 10 - i));
      segs += '<i>' + (f ? '<b style="width:' + Math.round(f * 100) + '%"></b>' : '') + '</i>';
    }
    el('.qcard-segs').innerHTML = segs;
    el('.qcard-segs').setAttribute('aria-label', 'Выполнено ' + pct + '%: заданий ' + q.done + ' из ' + q.total);
    el('.qcard-list').innerHTML = q.learn.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    var skills = q.skills === 'quest09' ? window.TSSkills.quest09 : q.skills;
    el('.qcard-skills').innerHTML = window.TSSkills.render(skills);
    el('.qcard-req').innerHTML = q.req.map(function (t) { return '<li>' + t + '</li>'; }).join('');
  }

  // Карточка слева от узла; по вертикали — центр на узле, но в пределах холста
  function place(node) {
    var k = stage.getBoundingClientRect().width / 1440;
    var sr = stage.getBoundingClientRect(), nr = node.getBoundingClientRect();
    var left = (nr.left - sr.left) / k - 16 - 536;
    var h = card.offsetHeight;
    var center = (nr.top - sr.top) / k + 22;
    var top = Math.max(88, Math.min(1024 - 16 - h, center - h / 2));
    card.style.left = Math.round(left / 4) * 4 + 'px';
    card.style.top = Math.round(top / 4) * 4 + 'px';
  }

  var current;
  function show(node) {
    var q = Q[node.dataset.q];
    if (!q) return;
    var fresh = card.hidden || current !== node;
    fill(q);
    card.hidden = false;
    place(node);
    node.setAttribute('aria-describedby', 'q-card');
    if (fresh) { card.classList.remove('show'); void card.offsetWidth; card.classList.add('show'); }
    current = node;
  }
  // скрывается сразу, как только курсор ушёл с иконки
  function hide() { card.hidden = true; current = null; }

  document.querySelectorAll('.node[data-q]').forEach(function (node) {
    // поповер открывается только при наведении на иконку, не на подпись
    var icon = node.querySelector('img') || node;
    icon.addEventListener('mouseenter', function () { show(node); });
    icon.addEventListener('mouseleave', hide);
    node.addEventListener('focus', function () { show(node); });
    node.addEventListener('blur', hide);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { card.hidden = true; current = null; } });
})();
