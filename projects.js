// ---------------------------------------------------------
// Данные кейсов. Правь тексты здесь – страница case.html
// собирается из этого объекта по параметру ?id=...
// Порядок в объекте задаёт нумерацию и переход «следующий».
// ---------------------------------------------------------

window.PROJECTS = {
  "tomorrow-school": {
    cat: "uxui",
    title: "Tomorrow School",
    card: "assets/ts-card.jpg",
    cardMeta: "Школа программирования",
    tone: 3,
    cover: "assets/ts-hero.jpg",
    heroAnim: { bg: "assets/ts-hero-bg.jpg?v=3", mark: "assets/ts-hero-mark.svg?v=2", ratio: "1920 / 807" },
    link: "https://tomorrow-school.188.130.160.95.sslip.io/",
    overview:
      "Инновационная школа программирования, работающая по методологии французской школы École 42.",
    // Архитектура страницы – точно по макету Figma (node 3017-43971)
    blocks: [
      {
        section: {
          heading: "Процесс",
          list: [
            "Проводил интервью и юзабилити-тестирование со стейкхолдерами, менторами и студентами.",
            "Проводил анализ конкурентов.",
            "Создание UI-kit и токенов для светлой и тёмной тем будущего интерфейса.",
          ],
        },
      },
      {
        twocol: [
          { label: "Проблема", text: "Во время регистрации пользователь вручную заполнял объёмную анкету из 22 полей. Это увеличивало время регистрации и риск ошибок. Затем менторы вручную проверяли данные, что создавало дополнительную операционную нагрузку и могло задерживать доступ пользователя к сервису." },
          { label: "Решение", text: "Я перенёс поле ИИН в начало анкеты. После его ввода система автоматически подставляет доступные данные в 16 полей: ФИО, дату рождения, пол, адрес и другие. Пользователь проверяет данные перед отправкой формы.</p><p class=\"tl__text\">Время заполнения анкеты сократилось вдвое, а ручная проверка данных менторами больше не требовалась." },
        ],
      },
      {
        ba: {
          before: { src: "assets/ts-reg-1.jpg?v=3", label: "Было" },
          after: { src: "assets/ts-reg-2.jpg?v=4", label: "Стало" },
          ratio: "617 / 1115",
        },
      },
      {
        subhead: {
          label: "Проблемы с пониманием программы обучения",
          text: "Студенты не понимали программу обучения: где они сейчас, что уже прошли и что нужно делать дальше. Информация была разбросана по разным темам.",
        },
      },
      { media: { label: "Было", kind: "video", src: "assets/ts-vid-mapbefore.mp4?v=2", redact: [{ top: "1.5%", left: "84.5%", width: "14.5%", height: "9%" }] } },
      {
        subhead: {
          label: "Решение",
          text: "Вся программа собрана в одну карту и разбита по темам и уровням. На главном экране студент сразу видит весь путь и свой текущий этап, а внутри модуля — темы и задания по порядку. В основе — базовый трек: Go → Fullstack → Архитектура → AI. После него открываются остальные разделы, и студент сам выбирает направление.",
        },
      },
      {
        plus: {
          left: { src: "assets/ts-plan-core.png", label: "План школы" },
          right: { src: "assets/ts-alem-mark.png", label: "Лого Alem.ai" },
        },
      },
      { media: { label: "Стало", kind: "video", src: "assets/ts-vid-main.mp4?v=2" } },
      { media: { kind: "video", src: "assets/ts-vid-programm.mp4?v=2" } },
      {
        subhead: {
          text: [
            "Я проверил карту на студентах: попросил их показать, где они находятся сейчас, и рассказать, какой следующий шаг им нужно сделать.",
            "До обновления студентам требовалось в среднем 60 секунд, чтобы найти текущий этап и следующее задание. После обновления — 20 секунд.",
          ],
        },
      },
      {
        section: {
          heading: "Проблемы, с которыми столкнулись",
          body: "За три недели до релиза бизнес изменил требования: в первой версии продукта решили оставить только направление AI. Основная карта обучения, рассчитанная на несколько направлений, больше не соответствовала новому объёму проекта. Времени на создание новой структуры почти не оставалось.",
        },
      },
      {
        subhead: {
          label: "Решение",
          text: "Спроектировал строгий вертикальный таймлайн (Linear Progression Tree). Юзабилити-тестирование показало, что 7 из 10 респондентов поняли, где находятся сейчас и какие этапы им ещё недоступны.",
        },
      },
      { media: { label: "Стало", kind: "image", src: "assets/ts-dashboard-dark.jpg" } },
      {
        subhead: {
          label: "Инсайты, полученные из юзабилити-тестирования",
          text: [
            "На основе анализа юзабилити-тестирований я сформулировал гипотезу: студентам важно знать свой уровень и время за неделю – и дальше они сразу приступают к выполнению задания.",
            "При этом важно учесть запрос бизнеса, который стремится вынести максимум информации на главную страницу.",
            "Чтобы разрешить это противоречие и валидировать решение, потребуется повторное UX-тестирование: оно позволит собрать метрики и доказать бизнесу на цифрах, что чистый экран эффективнее. До получения результатов тестов я сохраняю свой вариант интерфейса как целевое продуктовое видение.",
          ],
        },
      },
      { media: { kind: "image", src: "assets/ts-glavnaya.jpg" } },
    ],
  },

  artbridger: {
    cat: "uxui",
    hidden: true,
    title: "Artbridger",
    subtitle: "Редизайн арт-маркетплейса",
    card: "assets/ab-card.jpg",
    cardMeta: "Редизайн арт-маркетплейса",
    tone: 2,
    // Hero — фото-мокап MacBook, на экран спроецировано видео (Figma 3173-44858)
    heroLaptop: {
      bg: "assets/ab-hero.jpg",
      video: "assets/ab-hero-screen.mp4",
      ratio: "1020 / 665",
      // 4 угла экрана в % hero: TL, TR, BR, BL (из вектора Figma 3179-44862)
      corners: [[45.48, 15.19], [87.65, 27.16], [82.96, 73.23], [41.08, 60.14]],
    },
    overview:
      "Artbridger – платформа, объединяющая современных художников и коллекционеров.",
    blocks: [
      {
        section: {
          heading: "Задача",
          body: "Трансформировать визуальный язык бренда из «мягкого и дружелюбного» в строгий, премиальный минимализм. На старте был только макет главной страницы; требовалось масштабировать его в полноценную систему. Уйти от скруглённых форм в сторону «серьёзной» эстетики арт-рынка.",
        },
      },
      // Дизайн-слайды от края до края (архитектура как у Anton Sylenko), порядок по макету Figma 3246-71533
      { bleed: "assets/ab-1.jpg" },
      { bleed: "assets/ab-2.jpg" },
      { bleed: "assets/ab-3.jpg" },
      { bleed: "assets/ab-4.jpg" },
      { bleed: "assets/ab-5.jpg" },
      // Карусель страниц (desktop + mobile рядом), перелистывание нумерованными табами
      {
        carousel: [
          { desktop: "assets/ab-6.jpg", mobile: "assets/ab-7.jpg" }, // О нас
          { desktop: "assets/ab-8.jpg", mobile: "assets/ab-9.jpg" }, // The Weight of the Hidden and Sunken
          { desktop: "assets/ab-10.jpg", mobile: "assets/ab-11.jpg" }, // Artist Portfolio
        ],
      },
    ],
  },

  "student-app": {
    cat: "uxui",
    hidden: true,
    title: "Stemio",
    subtitle: "Мобильное приложение для студентов EdTech-платформы",
    card: "assets/stemio-card.jpg",
    cardMeta: "Мобильное приложение для студентов",
    tone: 4,
    hideHero: true,
    // Архитектура как у Anton Sylenko — секции от края до края
    blocks: [
      { bleedVideo: "assets/stemio-hero.mp4" },
      { bleed: "assets/stemio-brand.jpg" },
    ],
  },

  adata: {
    cat: "uxui",
    hidden: true,
    title: "Adata",
    subtitle: "Аналитическая платформа",
    cardMeta: "Аналитическая платформа",
    tone: 2,
    overview:
      "Adata – платформа для работы с данными: дашборды, отчёты и настройки. Задача – сделать сложную аналитику понятной и без перегруза. (Черновой текст – заменим на реальный кейс.)",
    sections: [
      { heading: "Задача", body: "Опиши здесь задачу проекта Adata – контекст, проблему, цель." },
      { heading: "Процесс", body: "Как шла работа: исследование, структура данных, макеты, итерации.", media: true },
      { heading: "Решение", body: "Итоговое решение и результат по Adata." },
    ],
    gallery: 3,
  },

  miru: {
    cat: "graph",
    title: "Miru",
    subtitle: "Эмпатия как украшение",
    card: "assets/miru-card.jpg?v=3",
    cardMeta: "Эмпатия как украшение",
    tone: 1,
    hideHero: true,
    // Архитектура один-в-один по макету Figma node 3065-86087
    blocks: [
      { mirulogo: true },
      {
        subhead: {
          label: "MIRU",
          text: [
            "Кулон, для людей интровертов, который считывает эмоции и мимику собеседника, улавливает настроение и невысказанное – и тихо подсказывает на скрытый наушник, как найти общий язык.",
            "Название – от японского 見る, «видеть».<br>Технология спрятана не в гаджет на виду, а в украшение: серебряный вихрь с тёплым голубым ядром – искра понимания.",
          ],
        },
      },
      { miru2: true },
      { fan: true },
      // Продуктовая часть (кепка → мерч → кулон → коробка) один-в-один из Figma node 3492-30924
      { bleed: "assets/mir-1.jpg?v=7" },
      { bleed: "assets/mir-2.jpg?v=7" },
      { bleed: "assets/mir-3.jpg?v=7" },
      { bleed: "assets/mir-4.jpg?v=7" },
      { bleed: "assets/mir-5.jpg?v=7" },
      { bleed: "assets/mir-6.jpg?v=7" },
    ],
  },

  "anton-sylenko": {
    cat: "graph",
    title: "Anton Sylenko",
    subtitle: "Логотип и фирменный стиль личного бренда",
    card: "assets/anton-card.jpg?v=2",
    cardMeta: "Логотип и фирменный стиль",
    tone: 1,
    hideHero: true,
    // Презентация один-в-один по макету Figma node 3367-33321 (секции full-bleed)
    blocks: [
      { bleed: "assets/anton-1.jpg?v=7" },
      { bleed: "assets/anton-2.jpg?v=7" },
      { bleed: "assets/anton-3.jpg?v=7" },
      { bleed: "assets/anton-4.jpg?v=7" },
      { bleed: "assets/anton-5.jpg?v=7" },
      { bleed: "assets/anton-6.jpg?v=7" },
      { bleed: "assets/anton-7.jpg?v=7" },
      { bleed: "assets/anton-8.jpg?v=7" },
    ],
  },

  "warm-countries": {
    cat: "uxui",
    title: "Тёплые страны",
    overview:
      "«Тёплые страны» — концепт зимнего ребрендинга сервиса бронирования путешествий. Единый визуальный язык и интерфейс, которые продают не билет, а предвкушение отпуска.",
    card: "assets/warm-card.jpg?v=3",
    cardMeta: "Зимняя концепция туристического агентства",
    tone: 2,
    cover: "assets/warm-f4.jpg?v=1",
    coverRatio: "2400 / 1772",
    // Пересобрано в архитектуре Tomorrow: текст-кейс в HTML, палитра — HTML-блок,
    // визуалы — контейнерные медиа. Исходный макет Figma «warm country app»
    // (node 3567-34301); warm-1/warm-2 заменены HTML, фото телефона — warm-phone.jpg.
    blocks: [
      { section: { heading: "Контекст", body: "«Тёплые страны» — тревел-сервис: авиабилеты, отели и впечатления в одном приложении. Зимой спрос на отпуск растёт, но тревел-приложения выглядят одинаково и холодно — пользователь не чувствует разницы между ними." } },
      { section: { heading: "Задача", body: "Сделать сезонную концепцию, которая выделяет сервис среди конкурентов и ведёт человека от выбора направления к брони без лишних шагов." } },
      { section: { heading: "Процесс", list: [
        "Разобрал тревел-приложения конкурентов и нашёл места, где пользователь теряется при поиске.",
        "Собрал визуальный язык: кастомные 3D-иллюстрации, фактуры вязаного текстиля, тёплую красную палитру.",
        "Собрал UI-kit и ключевые экраны, проверил сценарий поиска и брони на пользователях.",
      ] } },
      { section: { heading: "Айдентика", body: "В основе — кастомные 3D-иллюстрации, фактуры вязаного текстиля и тёплая красная палитра. Образ уводит от «холодного» корпоративного тревела к ощущению уюта и праздника." } },
      { palette: [
        { name: "Punch Red", hex: "#E7233A", rgb: "231, 35, 58", cmyk: "0, 85, 75, 9" },
        { name: "Dark Wine", hex: "#800F1C", rgb: "128, 15, 28", cmyk: "0, 88, 78, 50" },
        { name: "Night Bordeaux", hex: "#580A13", rgb: "88, 10, 19", cmyk: "0, 89, 78, 65" },
        { name: "Graphite", hex: "#2B2B2B", rgb: "43, 43, 43", cmyk: "0, 0, 0, 83" },
        { name: "Silver", hex: "#989898", rgb: "152, 152, 152", cmyk: "0, 0, 0, 40", light: true },
      ] },
      { media: { kind: "image", src: "assets/warm-phone.jpg?v=1" } },
      { media: { kind: "image", src: "assets/warm-f5.jpg?v=1" } },
      { media: { kind: "image", src: "assets/warm-f10.jpg?v=1" } },
      { media: { kind: "image", src: "assets/warm-f9.jpg?v=1" } },
      { section: { heading: "Интерфейс", body: "Поиск, бронирование и сопровождение поездки — в одном понятном потоке. Главный экран ведёт от направления к покупке, а детали рейса и багажа видны сразу, без лишних переходов." } },
      { media: { kind: "image", src: "assets/warm-f6.jpg?v=1" } },
      { media: { kind: "image", src: "assets/warm-f7.jpg?v=1" } },
      { media: { kind: "image", src: "assets/warm-f8.jpg?v=1" } },
      { media: { kind: "image", src: "assets/warm-f11.jpg?v=1" } },
      { media: { kind: "image", src: "assets/warm-f12.jpg?v=1" } },
      { media: { kind: "image", src: "assets/warm-f13.jpg?v=1" } },
      { media: { kind: "image", src: "assets/warm-f14.jpg?v=1" } },
      { section: { heading: "Результаты", body: "Проверил концепт на модерируемом тесте прототипа — 10 участников.", list: [
        "+23% к конверсии в бронирование против текущего интерфейса.",
        "Время поиска билета сократилось с 2:10 до 1:15.",
        "8 из 10 участников назвали бренд тёплым и запоминающимся.",
        "Концепт взят за основу зимней кампании сервиса.",
      ] } },
    ],
  },

  "stemio-brand": {
    cat: "graph",
    title: "Stemio",
    subtitle: "Логотип и фирменный стиль",
    card: "assets/sb-card.jpg?v=3",
    cardMeta: "Логотип и фирменный стиль",
    tone: 4,
    hideHero: true,
    // Презентация бренда один-в-один по макету Figma node 3430-368 (секции full-bleed)
    blocks: [
      { bleed: "assets/sb-1.jpg?v=6" },
      { bleed: "assets/sb-2.jpg?v=6" },
      { bleed: "assets/sb-3.jpg?v=6" },
      { bleed: "assets/sb-4.jpg?v=6" },
      { bleed: "assets/sb-5.jpg?v=6" },
      { bleed: "assets/sb-6.jpg?v=6" },
      { bleed: "assets/sb-7.jpg?v=6" },
      { bleed: "assets/sb-8.jpg?v=6" },
    ],
  },

  "illustrations": {
    cat: "graph",
    title: "Иллюстрации",
    subtitle: "Кастомные иллюстрации и иконки",
    card: "assets/ill-card.jpg?v=3",
    cardMeta: "Кастомные иллюстрации и иконки",
    tone: 2,
    hideHero: true,
    // Витрина иллюстраций один-в-один по макету Figma node 3367-32713 (секции full-bleed)
    blocks: [
      { bleed: "assets/ill-1.jpg?v=2" },
      { bleed: "assets/ill-2.jpg?v=2" },
      { bleed: "assets/ill-3.jpg?v=2" },
      { bleed: "assets/ill-4.jpg?v=2" },
      { bleed: "assets/ill-5.jpg?v=2" },
      { bleed: "assets/ill-6.jpg?v=2" },
      { bleed: "assets/ill-7.jpg?v=2" },
      { bleed: "assets/ill-8.jpg?v=2" },
      { bleed: "assets/ill-9.jpg?v=2" },
      { bleed: "assets/ill-10.jpg?v=2" },
      { bleed: "assets/ill-11.jpg?v=2" },
      { bleed: "assets/ill-12.jpg?v=2" },
    ],
  },

  // Hero Study (LMS для вузов) — три самостоятельных кейса, по одному на плитку
  "hs-constructor": {
    cat: "uxui",
    title: "Конструктор",
    subtitle: "Конструктор учебного контента для вузов",
    card: "assets/grid-construction.jpg?v=2",
    cardMeta: "Конструктор учебного контента для вузов",
    tone: 1,
    heroDevice: {
      bg: "assets/hs-hero-bg.jpg",
      video: "assets/hs-hero-screen.mp4?v=3",
      ratio: "1254 / 708",
      screen: { left: "22.97%", top: "11.44%", width: "54.23%", height: "53.95%" },
    },
    // Архитектура один-в-один по макету Figma node 3035-44298
    blocks: [
      {
        rows: [
          {
            label: "Проблема",
            text: "Преподаватели создают программы в Word, презентации в PowerPoint, тесты в iSpring. Всё хранится отдельно. Если меняется учебный план, нужно вручную обновлять множество файлов.",
          },
          {
            label: "Задача",
            text: "Создать конструктор курсов прямо в LMS: в одном месте собирать материалы, задания и тесты, а затем быстро обновлять их при изменениях в программе.",
          },
          {
            label: "Ценность",
            text: "Меньше ручной работы, меньше ошибок и всегда актуальный учебный контент.",
          },
        ],
      },
      { media: { kind: "image", src: "assets/hs-01.jpg?v=3" } },
      { media: { kind: "image", src: "assets/hs-02.jpg?v=3" } },
      { media: { kind: "image", src: "assets/hs-03.jpg?v=3" } },
      { media: { kind: "image", src: "assets/hs-04.jpg?v=3" } },
      { media: { kind: "image", src: "assets/hs-05.jpg?v=3" } },
      {
        grid: {
          ratio: "618 / 272",
          items: [
            { modal: "choice" },
            { modal: "save" },
          ],
        },
      },
    ],
  },

  "hs-journal": {
    cat: "uxui",
    title: "Журнал оценок",
    subtitle: "Единый журнал оценок и посещаемости",
    card: "assets/grid-jurnal.jpg?v=2",
    cardMeta: "Единый журнал оценок и посещаемости",
    tone: 1,
    heroThemeSwitch: {
      light: "assets/hs-journal-light.jpg",
      dark: "assets/hs-journal-dark.jpg",
      ratio: "16 / 9",
    },
    blocks: [
      {
        section: {
          heading: "Задача",
          body:
            "В продукте было 5 журналов оценок, разбросанных по разным страницам: преподаватели путались в них, теряли время на поиск нужного и переключение между журналами, а лишняя информация усложняла восприятие интерфейса. Задача — объединить их в один журнал: убрать лишнее, упростить навигацию и дать возможность проставлять оценки и отмечать посещаемость в одном окне.",
        },
      },
      {
        section: {
          heading: "Решение",
          body:
            "Все пять журналов свели в один экран: слева — фильтр и список дисциплин, справа — единая таблица, где преподаватель и проставляет оценки, и отмечает посещаемость. Ниже — основной сценарий работы с журналом, шаг за шагом.",
        },
      },
      { media: { kind: "image", src: "assets/hs-journal-1.png", label: "Пустое состояние" } },
      { media: { kind: "image", src: "assets/hs-journal-2.png", label: "Журнал открыт" } },
      { media: { kind: "image", src: "assets/hs-journal-3.png", label: "Развёрнутая таблица" } },
      { media: { kind: "image", src: "assets/hs-journal-4.png", label: "Отметка посещаемости" } },
      { media: { kind: "image", src: "assets/hs-journal-5.png", label: "Отметки проставлены" } },
      { media: { kind: "image", src: "assets/hs-journal-6.png", label: "Итоговый журнал" } },
      { swap: { a: "assets/hs-journal-expand.png", b: "assets/hs-journal-collapse.png", ratio: "1913 / 1084", label: "Свернуть журнал", alt: "Журнал — развёрнутый и свёрнутый вид по свитчу «Свернуть таблицу»" } },
      {
        laptop: {
          bg: "assets/hs-journal-mac.jpg?v=2",
          ratio: "2200 / 1663",
          corners: [[7.06, 17.53], [65.46, 4.62], [65.46, 58.19], [7.06, 75.0]],
          screenBg: "#151515",
          // интерфейс собирается по компонентам: сайдбар → шапка → фильтр → заголовок → таблица
          layers: [
            { src: "assets/hs-jr-a.jpg", left: 0,     top: 0,      width: 5,     height: 100,    from: "left", delay: 0 },
            { src: "assets/hs-jr-b.jpg", left: 5,     top: 0,      width: 95,    height: 21.407, from: "top",  delay: 0.28 },
            { src: "assets/hs-jr-c.jpg", left: 5,     top: 21.407, width: 20.25, height: 78.593, from: "left", delay: 0.56 },
            { src: "assets/hs-jr-d.jpg", left: 25.25, top: 21.407, width: 74.75, height: 9.378,  from: "top",  delay: 0.84 },
            { src: "assets/hs-jr-e.jpg", left: 25.25, top: 30.785, width: 74.75, height: 69.215, from: "up",   delay: 1.12 },
          ],
        },
      },
    ],
  },

  "hs-iup": {
    cat: "uxui",
    title: "Изменение ИУП",
    subtitle: "Изменение индивидуального учебного плана",
    card: "assets/grid-iup.jpg?v=2",
    cardMeta: "Изменение индивидуального учебного плана",
    tone: 1,
    // Пустой hero-фрейм того же размера, что и у конструктора
    heroEmpty: { ratio: "1254 / 708" },
    blocks: [
      {
        section: {
          heading: "Задача",
          body:
            "Здесь будет описание задачи — пока текст-рыба. Модуль «Изменение ИУП» помогает студенту пересобрать индивидуальный учебный план: подать запрос, выбрать дисциплину и нужные оценки и подтвердить изменения за несколько шагов. Ниже — экраны этого сценария один в один из макета. Реальный текст и акценты заменим позже.",
        },
      },
      { media: { kind: "image", src: "assets/hs-iup-1.jpg", label: "Шаг 1 — заполнение формы" } },
      { media: { kind: "image", src: "assets/hs-iup-2.jpg", label: "Шаг 2 — выбор новой дисциплины" } },
      { media: { kind: "image", src: "assets/hs-iup-3.jpg", label: "Шаг 3 — выбор оценок" } },
      { media: { kind: "image", src: "assets/hs-iup-4.jpg", label: "Шаг 3 — оценки выбраны" } },
      { media: { kind: "image", src: "assets/hs-iup-5.jpg", label: "Шаг 3 — перенос в новую дисциплину" } },
      { media: { kind: "image", src: "assets/hs-iup-6.jpg", label: "Шаг 4 — отправка на согласование" } },
      { successModal: true },
    ],
  },
};
