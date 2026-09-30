// ---------------------------------------------------------
// Сборка страницы кейса из window.PROJECTS по ?id=...
// Выполняется до script.js, чтобы reveal-наблюдатель
// увидел уже вставленные элементы.
// ---------------------------------------------------------

(function () {
  "use strict";

  var root = document.getElementById("case-root");
  var projects = window.PROJECTS || {};
  var ids = Object.keys(projects);

  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var data = id && projects[id];

  // Проект не найден — показываем заглушку
  if (!data) {
    root.innerHTML =
      '<div class="container case__notfound reveal">' +
      "<h1>Кейс не найден</h1>" +
      "<p>Возможно, ссылка устарела.</p>" +
      '<a class="btn btn--ghost" href="index.html#work">← Ко всем работам</a>' +
      "</div>";
    return;
  }

  document.title = data.title + " — Тим Манаков";
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", data.subtitle);

  // порядковый номер и следующий проект
  var index = ids.indexOf(id);
  var nextId = ids[(index + 1) % ids.length];
  var nextData = projects[nextId];

  function metaHtml(meta) {
    return Object.keys(meta)
      .map(function (key) {
        var v = meta[key];
        var val = Array.isArray(v)
          ? '<ul class="case__meta-list">' +
            v.map(function (x) { return "<li>" + x + "</li>"; }).join("") +
            "</ul>"
          : v;
        return (
          '<div class="case__meta-item">' +
          '<dt class="case__meta-key">' + key + "</dt>" +
          '<dd class="case__meta-val">' + val + "</dd>" +
          "</div>"
        );
      })
      .join("");
  }

  function sectionsHtml(sections) {
    return sections
      .map(function (s) {
        var media = s.image
          ? '<div class="case__media case__media--image reveal"><img src="' + s.image + '" alt="' + s.heading + " — " + data.title + '" loading="lazy" /></div>'
          : s.media
          ? '<div class="case__media reveal" data-tone="' + data.tone + '" aria-hidden="true"></div>'
          : "";
        return (
          '<section class="case__section">' +
          '<div class="case__section-head reveal">' +
          '<h2 class="case__section-title">' + s.heading + "</h2>" +
          "</div>" +
          '<p class="case__section-body reveal">' + s.body + "</p>" +
          media +
          "</section>"
        );
      })
      .join("");
  }

  function galleryHtml(gallery) {
    if (!gallery) return "";
    // Массив ссылок на реальные экраны — плитки-картинки; число — тональные заглушки
    if (Array.isArray(gallery)) {
      if (!gallery.length) return "";
      var imgTiles = gallery
        .map(function (src) {
          return '<div class="case__tile case__tile--image reveal"><img src="' + src + '" alt="' + data.title + '" loading="lazy" /></div>';
        })
        .join("");
      return '<div class="case__gallery case__gallery--image">' + imgTiles + "</div>";
    }
    var tiles = "";
    for (var i = 0; i < gallery; i++) {
      tiles += '<div class="case__tile reveal" data-tone="' + data.tone + '" aria-hidden="true"></div>';
    }
    return '<div class="case__gallery">' + tiles + "</div>";
  }

  // --- Рич-статья с содержанием ---
  function radialSvg() {
    var cx = 200, cy = 120, r = 82, n = 8, i, a, pts = [];
    for (i = 0; i < n; i++) {
      a = ((-90 + (i * 360) / n) * Math.PI) / 180;
      pts.push([+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)]);
    }
    var spokes = pts
      .map(function (p) { return '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0] + '" y2="' + p[1] + '" />'; })
      .join("");
    var chords = [[0, 3], [1, 5], [2, 6], [4, 7], [3, 6]]
      .map(function (c) {
        return '<line class="chord" x1="' + pts[c[0]][0] + '" y1="' + pts[c[0]][1] + '" x2="' + pts[c[1]][0] + '" y2="' + pts[c[1]][1] + '" />';
      })
      .join("");
    var nodes = pts
      .map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" />'; })
      .join("");
    return (
      '<svg class="art__radial" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<g class="art__radial-lines">' + spokes + chords + "</g>" +
      '<g class="art__radial-nodes">' + nodes + '<circle class="hub" cx="' + cx + '" cy="' + cy + '" r="12" /></g>' +
      "</svg>"
    );
  }

  function figureHtml(f, tone) {
    var inner = f.kind === "radial"
      ? '<div class="art__figure-art">' + radialSvg() + "</div>"
      : '<div class="art__figure-ph" data-tone="' + (f.tone || tone) + '" aria-hidden="true"></div>';
    return (
      '<figure class="art__figure reveal">' + inner +
      (f.caption ? "<figcaption>" + f.caption + "</figcaption>" : "") +
      "</figure>"
    );
  }

  function blockHtml(b, tone) {
    if (b.p) return '<p class="art__p reveal">' + b.p + "</p>";
    if (b.h) return '<h3 class="art__h reveal">' + b.h + "</h3>";
    if (b.list)
      return (
        '<ul class="art__list reveal">' +
        b.list.map(function (it) { return "<li><strong>" + it[0] + ":</strong> " + it[1] + "</li>"; }).join("") +
        "</ul>"
      );
    if (b.cards)
      return (
        '<div class="art__cards">' +
        b.cards
          .map(function (c, i) {
            return (
              '<div class="art__card reveal">' +
              '<span class="art__card-num">' + (i + 1 < 10 ? "0" : "") + (i + 1) + "</span>" +
              '<div class="art__card-body">' +
              (c.label ? '<span class="art__card-label">' + c.label + "</span>" : "") +
              '<h4 class="art__card-title">' + c.title + "</h4>" +
              (c.text ? '<p class="art__card-text">' + c.text + "</p>" : "") +
              "</div></div>"
            );
          })
          .join("") +
        "</div>"
      );
    if (b.figure) return figureHtml(b.figure, tone);
    return "";
  }

  function articleHtml(article, tone) {
    return article
      .map(function (sec) {
        return (
          '<section class="art__section" id="' + sec.id + '">' +
          '<header class="art__head reveal">' +
          '<span class="art__num">' + sec.num + "</span>" +
          '<h2 class="art__title">' + sec.title +
          (sec.en ? ' <span class="art__en">' + sec.en + "</span>" : "") +
          "</h2></header>" +
          sec.blocks.map(function (b) { return blockHtml(b, tone); }).join("") +
          "</section>"
        );
      })
      .join("");
  }

  function tocHtml(article) {
    return (
      '<nav class="art__toc" aria-label="Содержание">' +
      '<p class="art__toc-label">Содержание</p>' +
      '<ol class="art__toc-list">' +
      article
        .map(function (sec) {
          return (
            '<li><a href="#' + sec.id + '" data-toc="' + sec.id + '">' +
            '<span class="art__toc-num">' + sec.num + "</span>" +
            "<span>" + sec.title + "</span></a></li>"
          );
        })
        .join("") +
      "</ol></nav>"
    );
  }

  // --- Кейс по архитектуре pamidordesign.co/work/rise ---
  function kicker(text, reveal) {
    return '<p class="cs__kicker' + (reveal === false ? "" : " reveal") + '">(' + text + ")</p>";
  }

  function csMedia(f, cls) {
    var tone = f.tone || data.tone;
    var mod = f.portrait ? " cs__media--portrait" : "";
    var inner = "";
    if (f.kind === "radial") inner = '<div class="cs__fig">' + radialSvg() + "</div>";
    else if (f.kind === "image" && f.src)
      inner = '<img src="' + f.src + '" alt="' + (f.caption || data.title) + '" loading="lazy" />';
    return (
      '<div class="' + cls + mod + '" data-tone="' + tone + '"' +
      (inner ? "" : ' aria-hidden="true"') + ">" + inner + "</div>"
    );
  }

  function csFrame(f, i) {
    return (
      '<figure class="cs__frame reveal">' +
      '<figcaption class="cs__frame-label">[ ' + (i + 1 < 10 ? "0" : "") + (i + 1) + " ] " + f.label + "</figcaption>" +
      csMedia(f, "cs__frame-media") +
      (f.caption ? '<p class="cs__frame-cap">' + f.caption + "</p>" : "") +
      "</figure>"
    );
  }

  function csSystem(sys) {
    return (
      '<section class="cs__system">' +
      kicker(sys.label) +
      '<h3 class="cs__system-title reveal">' + sys.title + "</h3>" +
      '<p class="cs__system-desc reveal">' + sys.desc + "</p>" +
      (sys.statements && sys.statements.length
        ? '<div class="cs__statements">' +
          sys.statements
            .map(function (s) {
              return (
                '<div class="cs__statement reveal">' +
                '<p class="cs__statement-label">(' + s.label + ")</p>" +
                '<p class="cs__statement-text">' + s.text + "</p></div>"
              );
            })
            .join("") +
          "</div>"
        : "") +
      (sys.scope && sys.scope.length
        ? '<div class="cs__scope reveal">' +
          kicker("Объём", false) +
          '<div class="cs__stats">' +
          sys.scope
            .map(function (st) {
              return (
                '<div class="cs__stat"><span class="cs__stat-n">' + st.n + "</span>" +
                '<span class="cs__stat-cap">' + st.cap + "</span></div>"
              );
            })
            .join("") +
          "</div></div>"
        : "") +
      (sys.process && sys.process.length
        ? '<div class="cs__process">' + sys.process.map(csFrame).join("") + "</div>"
        : "") +
      (sys.visual
        ? '<figure class="cs__visual reveal">' + csMedia(sys.visual, "cs__visual-media") +
          (sys.visual.caption ? "<figcaption>" + sys.visual.caption + "</figcaption>" : "") +
          "</figure>"
        : "") +
      "</section>"
    );
  }

  function csPart(part) {
    return (
      '<section class="cs__part">' +
      kicker(part.label) +
      '<h2 class="cs__part-title reveal">' + part.title + "</h2>" +
      (part.intro ? '<p class="cs__part-intro reveal">' + part.intro + "</p>" : "") +
      (part.systems ? part.systems.map(csSystem).join("") : "") +
      (part.blocks
        ? part.blocks
            .map(function (b) {
              return (
                '<section class="cs__vsub reveal">' +
                '<h3 class="cs__vsub-title">' + b.title + "</h3>" +
                (b.caption ? '<p class="cs__vsub-cap">' + b.caption + "</p>" : "") +
                csMedia(b, "cs__vsub-media") +
                "</section>"
              );
            })
            .join("")
        : "") +
      "</section>"
    );
  }

  function caseStudyHtml(cs) {
    var cover = data.cover
      ? '<figure class="cs__cover reveal"><img src="' + data.cover + '" alt="' + data.title + ' — обложка" /></figure>'
      : '<figure class="cs__cover cs__cover--tint reveal" data-tone="' + data.tone + '" aria-hidden="true"></figure>';
    return (
      '<h1 class="cs__title reveal">' + data.title + "</h1>" +
      (cs.tags && cs.tags.length
        ? '<ul class="cs__tags reveal">' +
          cs.tags.map(function (t) { return "<li>" + t + "</li>"; }).join("") +
          "</ul>"
        : "") +
      cover +
      '<p class="cs__lead reveal">' + data.overview + "</p>" +
      (data.link
        ? '<div class="cs__actions reveal"><a class="btn btn--ghost" href="' + data.link + '" target="_blank" rel="noopener">Смотреть проект <span aria-hidden="true">↗</span></a></div>'
        : "") +

      '<dl class="cs__meta reveal">' + metaHtml(data.meta) + "</dl>" +

      (cs.myRole && cs.myRole.length
        ? '<section class="cs__block">' + kicker("Моя роль") +
          '<ul class="cs__role reveal">' +
          cs.myRole.map(function (r) { return "<li>" + r + "</li>"; }).join("") +
          "</ul></section>"
        : "") +

      (cs.approach && cs.approach.length
        ? '<section class="cs__approach">' +
          '<h2 class="cs__h2 reveal">Подход</h2>' +
          '<div class="cs__steps">' +
          cs.approach
            .map(function (a, i) {
              return (
                '<div class="cs__step reveal">' +
                '<span class="cs__step-num">' + (i + 1 < 10 ? "0" : "") + (i + 1) + "</span>" +
                '<div class="cs__step-body"><h3 class="cs__step-title">' + a.title + "</h3>" +
                '<p class="cs__step-text">' + a.text + "</p></div></div>"
              );
            })
            .join("") +
          "</div></section>"
        : "") +

      (cs.parts ? cs.parts.map(csPart).join("") : "")
    );
  }

  // --- Блочный рендер: страница точно по макету Figma (data.blocks) ---
  function tlMedia(m) {
    var mod = m.portrait ? " tl__frame--portrait" : "";
    if (m.kind === "video")
      return '<div class="tl__frame' + mod + '"><video src="' + m.src +
        '" autoplay muted loop playsinline preload="metadata"></video></div>';
    return '<div class="tl__frame' + mod + '"><img src="' + m.src +
      '" alt="' + data.title + '" loading="lazy" /></div>';
  }

  function blocksHtml(blocks) {
    return blocks
      .map(function (b) {
        if (b.heading) return '<h2 class="tl__h2 tl__h2--solo reveal">' + b.heading + "</h2>";
        if (b.section) {
          var s = b.section;
          var body = s.list
            ? '<ol class="tl__list reveal">' +
              s.list.map(function (it) { return "<li>" + it + "</li>"; }).join("") +
              "</ol>"
            : '<p class="tl__body reveal">' + s.body + "</p>";
          return '<section class="tl__section"><h2 class="tl__h2 reveal">' + s.heading + "</h2>" + body + "</section>";
        }
        if (b.subhead)
          return '<div class="tl__sub reveal"><p class="tl__label">' + b.subhead.label +
            '</p><p class="tl__text">' + b.subhead.text + "</p></div>";
        if (b.twocol)
          return '<div class="tl__twocol reveal">' +
            b.twocol.map(function (c) {
              return '<div class="tl__col"><p class="tl__label">' + c.label +
                '</p><p class="tl__text">' + c.text + "</p></div>";
            }).join("") + "</div>";
        if (b.compare)
          return '<div class="tl__compare reveal">' +
            b.compare.map(function (c) {
              return '<figure class="tl__cmp">' +
                (c.label ? '<figcaption class="tl__label">' + c.label + "</figcaption>" : "") +
                tlMedia(c) + "</figure>";
            }).join("") + "</div>";
        if (b.media)
          return '<figure class="tl__media reveal">' +
            (b.media.label ? '<figcaption class="tl__label">' + b.media.label + "</figcaption>" : "") +
            tlMedia(b.media) + "</figure>";
        if (b.plus)
          return '<div class="tl__plus reveal">' +
            '<div class="tl__plus-item"><div class="tl__plus-media"><img src="' + b.plus.left.src +
            '" alt="" loading="lazy" /></div><span class="tl__label">' + b.plus.left.label + "</span></div>" +
            '<span class="tl__plus-sign" aria-hidden="true">+</span>' +
            '<div class="tl__plus-item"><div class="tl__plus-media tl__plus-media--logo"><img src="' + b.plus.right.src +
            '" alt="" loading="lazy" /></div><span class="tl__label">' + b.plus.right.label + "</span></div>" +
            "</div>";
        return "";
      })
      .join("");
  }

  var bodyHtml;
  if (data.caseStudy) {
    bodyHtml = caseStudyHtml(data.caseStudy);
  } else if (data.blocks) {
    bodyHtml =
      '<header class="case__hero">' +
      '<h1 class="case__title reveal">' + data.title + "</h1>" +
      '<p class="case__subtitle reveal">' + (data.subtitleHtml || data.subtitle) + "</p>" +
      "</header>" +
      '<dl class="case__meta reveal">' + metaHtml(data.meta) + "</dl>" +
      (data.cover
        ? '<div class="case__cover case__cover--image reveal"><img src="' + data.cover + '" alt="' + data.title + ' — обложка" loading="lazy" /></div>'
        : '<div class="case__cover reveal" data-tone="' + data.tone + '" aria-hidden="true"></div>') +
      (data.overview ? '<p class="tl__lead reveal">' + data.overview + "</p>" : "") +
      blocksHtml(data.blocks);
  } else {
    bodyHtml =
      '<header class="case__hero">' +
      '<h1 class="case__title reveal">' + data.title + "</h1>" +
      '<p class="case__subtitle reveal">' + (data.subtitleHtml || data.subtitle) + "</p>" +
      (data.link
        ? '<div class="case__actions reveal"><a class="btn btn--primary" href="' + data.link + '" target="_blank" rel="noopener">Смотреть проект <span aria-hidden="true">↗</span></a></div>'
        : "") +
      "</header>" +
      '<dl class="case__meta reveal">' + metaHtml(data.meta) + "</dl>" +
      (data.cover
        ? '<div class="case__cover case__cover--image reveal"><img src="' + data.cover + '" alt="' + data.title + ' — обложка" loading="lazy" /></div>'
        : '<div class="case__cover reveal" data-tone="' + data.tone + '" aria-hidden="true"></div>') +
      (data.article
        ? '<div class="art art--notoc"><div class="art__body">' +
            '<p class="art__lead reveal">' + data.overview + "</p>" +
            articleHtml(data.article, data.tone) +
          "</div></div>"
        : '<p class="case__overview reveal">' + data.overview + "</p>" +
          sectionsHtml(data.sections) +
          galleryHtml(data.gallery));
  }

  root.innerHTML =
    '<div class="container">' +
    '<a class="case__back reveal" href="index.html#work"><span aria-hidden="true">←</span> Работы</a>' +
    bodyHtml +
    '<a class="case__next reveal" href="case.html?id=' + nextId + '">' +
    '<span class="case__next-label">Следующий проект</span>' +
    '<span class="case__next-title">' + nextData.title + ' <span aria-hidden="true">→</span></span>' +
    "</a>" +
    "</div>";

  // Содержание вынесено за сетку и появляется только после главного вижуала:
  // показываем рейл, когда обложка ушла вверх за пределы экрана, и прячем
  // у блока «Следующий проект» / футера снизу, чтобы ничего не перекрывать.
  if (data.article && "IntersectionObserver" in window) {
    var toc = document.querySelector(".art__toc");
    var cover = document.querySelector(".case__cover");
    var endEl = document.querySelector(".case__next");
    if (toc && cover) {
      var pastCover = false;
      var nearEnd = false;
      var syncToc = function () {
        toc.classList.toggle("is-shown", pastCover && !nearEnd);
      };
      new IntersectionObserver(
        function (entries) {
          var e = entries[0];
          pastCover = !e.isIntersecting && e.boundingClientRect.top < 0;
          syncToc();
        },
        { threshold: 0 }
      ).observe(cover);
      if (endEl) {
        new IntersectionObserver(
          function (entries) { nearEnd = entries[0].isIntersecting; syncToc(); },
          { rootMargin: "0px 0px -10% 0px" }
        ).observe(endEl);
      }
    }
  }

  // Подсветка активного раздела в содержании
  if (data.article && "IntersectionObserver" in window) {
    var links = {};
    Array.prototype.forEach.call(document.querySelectorAll("[data-toc]"), function (a) {
      links[a.getAttribute("data-toc")] = a;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          Object.keys(links).forEach(function (k) { links[k].classList.remove("is-active"); });
          if (links[e.target.id]) links[e.target.id].classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    Array.prototype.forEach.call(document.querySelectorAll(".art__section"), function (s) {
      spy.observe(s);
    });
  }
})();
