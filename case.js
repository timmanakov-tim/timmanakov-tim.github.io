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

  // Проект не найден – показываем заглушку
  if (!data) {
    root.innerHTML =
      '<div class="container case__notfound reveal">' +
      "<h1>Кейс не найден</h1>" +
      "<p>Возможно, ссылка устарела.</p>" +
      '<a class="btn btn--ghost" href="index.html#work">← Ко всем работам</a>' +
      "</div>";
    return;
  }

  document.title = data.title + " – Тим Манаков";
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
          ? '<div class="case__media case__media--image reveal"><img src="' + s.image + '" alt="' + s.heading + " – " + data.title + '" loading="lazy" /></div>'
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
    // Массив ссылок на реальные экраны – плитки-картинки; число – тональные заглушки
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
      ? '<figure class="cs__cover reveal"><img src="' + data.cover + '" alt="' + data.title + ' – обложка" /></figure>'
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
    var inner = "";
    if (m.kind === "video")
      inner = '<video src="' + m.src + '" autoplay muted loop playsinline preload="metadata"></video>';
    else if (m.src)
      inner = '<img src="' + m.src + '" alt="' + data.title + '" loading="lazy" />';
    // без src — пустой тональный слот-плейсхолдер
    if (!inner) mod += " tl__frame--tint";
    var tone = m.tone ? ' data-tone="' + m.tone + '"' : "";
    var redact = (m.redact || [])
      .map(function (r) {
        return '<span class="tl__redact" style="top:' + r.top + ";left:" + r.left +
          ";width:" + r.width + ";height:" + r.height + '"></span>';
      })
      .join("");
    return '<div class="tl__frame' + mod + '"' + tone + ">" + inner + redact + "</div>";
  }

  // Success-модалка «Изменение ИУП» — один-в-один по макету (800×548), анимированная
  function hsSuccessHtml() {
    var icoClose = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    var icoThumb = '<svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M26 10C26 8.93913 25.5783 7.92202 24.8281 7.17188C24.3723 6.71602 23.8179 6.38172 23.2148 6.18945L16 22.4229V42H36.583C37.0651 42.0054 37.533 41.8366 37.9004 41.5244C38.2679 41.212 38.5107 40.7767 38.583 40.2998V40.2969L41.3428 22.2969C41.3857 22.0113 41.3666 21.7198 41.2861 21.4424C41.2053 21.164 41.0643 20.9063 40.874 20.6875C40.6839 20.4689 40.4489 20.2935 40.1846 20.1748C39.9201 20.0561 39.6326 19.9967 39.3428 20H28C26.8954 20 26 19.1046 26 18V10ZM6 40C6 40.5304 6.21086 41.039 6.58594 41.4141C6.96101 41.7891 7.46957 42 8 42H12V24H8C7.46957 24 6.96101 24.2109 6.58594 24.5859C6.21086 24.961 6 25.4696 6 26V40ZM30 16H39.3203C40.1822 15.9935 41.0357 16.1724 41.8223 16.5254C42.6157 16.8815 43.3219 17.4063 43.8926 18.0625C44.4633 18.7188 44.8844 19.4919 45.127 20.3271C45.3694 21.1624 45.4274 22.0405 45.2969 22.9004V22.9033L42.5371 40.9033L42.5361 40.9023C42.3187 42.332 41.5931 43.6356 40.4912 44.5723C39.3943 45.5046 37.9987 46.01 36.5596 45.999V46H8C6.4087 46 4.88303 45.3674 3.75781 44.2422C2.63259 43.117 2 41.5913 2 40V26C2 24.4087 2.63259 22.883 3.75781 21.7578C4.88303 20.6326 6.4087 20 8 20H12.7002L20.1729 3.1875L20.2373 3.05566C20.5834 2.40931 21.259 2 22 2C24.1217 2 26.1569 2.84248 27.6572 4.34277C29.1575 5.84306 30 7.87827 30 10V16Z"/></svg>';
    return '<div class="hssucc-wrap reveal">' +
      '<div class="hssucc" data-hssucc>' +
        '<div class="hssucc__head">' +
          '<button type="button" class="hssucc__close" aria-label="Закрыть">' + icoClose + "</button>" +
        "</div>" +
        '<div class="hssucc__body">' +
          '<div class="hssucc__confetti" aria-hidden="true"></div>' +
          '<div class="hssucc__badge"><span class="hssucc__thumb">' + icoThumb + "</span></div>" +
          '<p class="hssucc__title2">Успех!</p>' +
          '<p class="hssucc__text">Оценки успешно перенесены в новую дисциплину.</p>' +
          '<button type="button" class="hssucc__btn">На главную</button>' +
        "</div>" +
      "</div>" +
    "</div>";
  }

  function blocksHtml(blocks) {
    return blocks
      .map(function (b) {
        if (b.successModal) return hsSuccessHtml();
        if (b.heading) return '<h2 class="tl__h2 tl__h2--solo reveal">' + b.heading + "</h2>";
        if (b.section) {
          var s = b.section;
          var body = "";
          if (s.body) body += '<p class="tl__body reveal">' + s.body + "</p>";
          if (s.list)
            body +=
              '<ol class="tl__list reveal">' +
              s.list.map(function (it) { return "<li>" + it + "</li>"; }).join("") +
              "</ol>";
          return '<section class="tl__section">' + (s.heading ? '<h2 class="tl__h2 reveal">' + s.heading + "</h2>" : "") + body + "</section>";
        }
        if (b.subhead) {
          var st = b.subhead.text;
          var body = Array.isArray(st)
            ? st.map(function (p) { return '<p class="tl__text">' + p + "</p>"; }).join("")
            : '<p class="tl__text">' + st + "</p>";
          return '<div class="tl__sub reveal"><p class="tl__label">' + b.subhead.label + "</p>" + body + "</div>";
        }
        if (b.grid) {
          var gr = b.grid.ratio || "16 / 9";
          var icoClose = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
          var icoTemplate = '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 3C10.5304 3 11.0391 3.21071 11.4142 3.58579C11.7893 3.96086 12 4.46957 12 5V5.636L13.636 4C14.0111 3.62506 14.5197 3.41443 15.05 3.41443C15.5803 3.41443 16.0889 3.62506 16.464 4L20 7.536C20.3749 7.91106 20.5856 8.41967 20.5856 8.95C20.5856 9.48033 20.3749 9.98894 20 10.364L18.364 12H19C19.5304 12 20.0391 12.2107 20.4142 12.5858C20.7893 12.9609 21 13.4696 21 14V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H10ZM10 5H5V19H10V5ZM19 14H16.364L12 18.364V19H19V14ZM7.5 15C7.89782 15 8.27936 15.158 8.56066 15.4393C8.84196 15.7206 9 16.1022 9 16.5C9 16.8978 8.84196 17.2794 8.56066 17.5607C8.27936 17.842 7.89782 18 7.5 18C7.10218 18 6.72064 17.842 6.43934 17.5607C6.15804 17.2794 6 16.8978 6 16.5C6 16.1022 6.15804 15.7206 6.43934 15.4393C6.72064 15.158 7.10218 15 7.5 15ZM15.05 5.414L12 8.464V15.535L18.586 8.95L15.05 5.414Z"/></svg>';
          var icoHand = '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.9561 2.05005L18.9209 2.56958L18.791 3.56079L17.8857 10.4612H19.3896V14.1282C19.3895 16.0919 18.6079 17.9754 17.2178 19.3635C15.8277 20.7513 13.9426 21.5314 11.9775 21.5315C10.0123 21.5314 8.12645 20.7516 6.73633 19.3635C5.26622 17.8956 4.92837 15.9352 4.74805 14.2336V14.2297L3.81055 5.00317L3.71484 4.05591L4.65527 3.91333L7.76758 3.4397L8.76855 3.28735L8.9082 4.29028L9.50098 8.5354L12.6289 8.16724L13.8506 2.8186L14.0537 1.93188L14.9561 2.05005ZM5.89648 5.74634L6.73633 14.0227C6.91391 15.6983 7.21458 17.0151 8.14941 17.9485C9.16423 18.9617 10.5418 19.5314 11.9775 19.5315C13.4131 19.5314 14.7899 18.9614 15.8047 17.9485C16.8195 16.9352 17.3895 15.5604 17.3896 14.1282V12.4612H12.9775V13.0618C12.9778 13.2294 13.0498 13.3932 13.1846 13.5247C13.3277 13.6642 13.4866 13.7149 13.5801 13.7151H15.6494V15.7151H13.5801C12.6183 15.7148 11.6642 15.0976 11.2266 14.1682L9.30371 14.4211L8.32031 14.55L8.18359 13.5667L7.65625 9.78149L7.06738 5.5686L5.89648 5.74634ZM9.77832 10.5159L10.0273 12.3079L10.9775 12.1829V10.4612H12.1475L12.1934 10.2327L9.77832 10.5159ZM14.4268 9.27563L14.1885 10.4612H15.8691L16.6768 4.29224L15.5977 4.15063L14.4268 9.27563Z"/></svg>';
          var icoBack = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6 9 12l6 6"/></svg>';
          var icoChev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
          var choiceModalHtml =
            '<div class="tl__gcell tl__gcell--modalui" style="aspect-ratio:' + gr + '">' +
              '<div class="hsmodal">' +
                '<div class="hsmodal__head">' +
                  '<span class="hsmodal__title">Выберите способ создания</span>' +
                  '<button type="button" class="hsmodal__close" aria-label="Закрыть">' + icoClose + "</button>" +
                "</div>" +
                '<div class="hsmodal__options">' +
                  '<button type="button" class="hsmodal__opt" aria-pressed="false"><span class="hsmodal__ico">' + icoTemplate + '</span><span class="hsmodal__label">Шаблон</span></button>' +
                  '<button type="button" class="hsmodal__opt" aria-pressed="false"><span class="hsmodal__ico">' + icoHand + '</span><span class="hsmodal__label">В ручную</span></button>' +
                "</div>" +
              "</div>" +
            "</div>";
          var ddLangs = ["RU", "EN", "KZ", "UZ"];
          var ddCats = ["Лекционный курс", "Практический курс", "Лабораторный практикум", "Смешанный формат", "Пустой шаблон"];
          var dropdownModalHtml =
            '<div class="tl__gcell tl__gcell--modalui tl__gcell--mdd" style="aspect-ratio:' + gr + '">' +
              '<div class="hsmodal hsdd-modal">' +
                '<div class="hsdd__head">' +
                  '<button type="button" class="hsdd__iconbtn" aria-label="Назад">' + icoBack + "</button>" +
                  '<span class="hsdd__title">Шаблон</span>' +
                  '<button type="button" class="hsdd__iconbtn hsdd__x" aria-label="Закрыть">' + icoClose + "</button>" +
                "</div>" +
                '<div class="hsdd__body">' +
                  '<div class="hsdd__langs">' +
                    ddLangs.map(function (l, idx) {
                      return '<button type="button" class="hsdd__lang' + (idx === 0 ? " is-on" : "") + '"><span class="hsdd__radio"></span>' + l + "</button>";
                    }).join("") +
                  "</div>" +
                  '<div class="hsdd__field">' +
                    '<span class="hsdd__flabel">Выберите из списка</span>' +
                    '<div class="hsdd" data-dd>' +
                      '<button type="button" class="hsdd__trigger" aria-expanded="false" aria-haspopup="listbox">' +
                        '<span class="hsdd__value is-empty">Выберите из списка</span>' +
                        '<span class="hsdd__chev">' + icoChev + "</span>" +
                      "</button>" +
                      '<div class="hsdd__list" role="listbox">' +
                        ddCats.map(function (c) {
                          return '<button type="button" class="hsdd__item" role="option">' + c + "</button>";
                        }).join("") +
                      "</div>" +
                    "</div>" +
                  "</div>" +
                "</div>" +
                '<div class="hsdd__foot">' +
                  '<button type="button" class="hsdd__btn hsdd__btn--ghost">Отмена</button>' +
                  '<button type="button" class="hsdd__btn hsdd__btn--primary">Применить</button>' +
                "</div>" +
              "</div>" +
            "</div>";
          var saveModalHtml =
            '<div class="tl__gcell tl__gcell--modalui tl__gcell--msave" style="aspect-ratio:' + gr + '">' +
              '<div class="hsmodal hssave-modal">' +
                '<div class="hssave__head">' +
                  '<span class="hssave__title">Сохранить как шаблон</span>' +
                  '<button type="button" class="hsdd__iconbtn hssave__close" aria-label="Закрыть">' + icoClose + "</button>" +
                "</div>" +
                '<div class="hssave__body">' +
                  '<label class="hssave__field">' +
                    '<span class="hssave__label">Введите название шаблона</span>' +
                    '<input type="text" class="hssave__input" placeholder="Test" aria-label="Название шаблона" />' +
                  "</label>" +
                "</div>" +
                '<div class="hssave__foot">' +
                  '<button type="button" class="hssave__btn hssave__btn--ghost">Отмена</button>' +
                  '<button type="button" class="hssave__btn hssave__btn--primary">Сохранить</button>' +
                "</div>" +
              "</div>" +
            "</div>";
          return '<div class="tl__grid reveal">' +
            b.grid.items.map(function (it) {
              if (it && (it.modal === true || it.modal === "choice")) return choiceModalHtml;
              if (it && it.modal === "dropdown") return dropdownModalHtml;
              if (it && it.modal === "save") return saveModalHtml;
              if (it && it.src)
                return '<div class="tl__gcell" style="aspect-ratio:' + gr + '"><img src="' + it.src + '" alt="' + (it.label || data.title) + '" loading="lazy" /></div>';
              return '<div class="tl__gcell tl__gcell--empty" style="aspect-ratio:' + gr + '" aria-hidden="true"></div>';
            }).join("") + "</div>";
        }
        if (b.rows)
          return '<div class="tl__rows reveal">' +
            b.rows.map(function (r) {
              return '<div class="tl__row"><p class="tl__row-label">' + r.label +
                '</p><p class="tl__row-text">' + r.text + "</p></div>";
            }).join("") + "</div>";
        if (b.twocol)
          return '<div class="tl__twocol reveal">' +
            b.twocol.map(function (c) {
              return '<div class="tl__col"><p class="tl__label">' + c.label +
                '</p><p class="tl__text">' + c.text + "</p></div>";
            }).join("") + "</div>";
        if (b.compare)
          return '<div class="tl__compare reveal' + (b.plain ? " tl__media--plain" : "") + '">' +
            b.compare.map(function (c) {
              return '<figure class="tl__cmp">' +
                (c.label ? '<figcaption class="tl__label">' + c.label + "</figcaption>" : "") +
                tlMedia(c) + "</figure>";
            }).join("") + "</div>";
        if (b.pair)
          return '<div class="tl__pair reveal">' +
            '<figure class="tl__pair-d">' +
              (b.pair.labelD ? '<figcaption class="tl__label">' + b.pair.labelD + "</figcaption>" : "") +
              tlMedia({ kind: "image", src: b.pair.desktop }) + "</figure>" +
            '<figure class="tl__pair-m">' +
              (b.pair.labelM ? '<figcaption class="tl__label">' + b.pair.labelM + "</figcaption>" : "") +
              tlMedia({ kind: "image", src: b.pair.mobile }) + "</figure>" +
          "</div>";
        if (b.carousel) {
          var slides = b.carousel;
          var czTabs = slides.map(function (s, i) {
            var num = (i + 1 < 10 ? "0" : "") + (i + 1);
            return '<button type="button" class="cz__tab' + (i === 0 ? " is-active" : "") + '" data-cz-tab="' + i + '" aria-label="Экран ' + num + '">' + num + "</button>";
          }).join("");
          var czSlides = slides.map(function (s) {
            return '<div class="cz__slide" data-lenis-prevent>' +
              '<div class="cz__pair">' +
                '<figure class="cz__d">' + tlMedia({ kind: "image", src: s.desktop }) + "</figure>" +
                '<figure class="cz__m">' + tlMedia({ kind: "image", src: s.mobile }) + "</figure>" +
              "</div>" +
            "</div>";
          }).join("");
          return '<div class="cz reveal" data-carousel>' +
            '<div class="cz__bar"><div class="cz__tabs" role="tablist">' + czTabs + "</div></div>" +
            '<div class="cz__track" data-cz-track>' + czSlides + "</div>" +
          "</div>";
        }
        if (b.miru2) {
          var m2lines = [5.43, 20.19, 35.02, 49.85, 64.61, 79.44, 94.2]
            .map(function (l) { return '<span style="left:' + l + '%"></span>'; }).join("");
          var m2nav = ["Product", "How it works", "Stories", "About", "Pricing"]
            .map(function (x) { return "<span>" + x + "</span>"; }).join("");
          return '<div class="miru2 reveal" role="img" aria-label="Miru — Hear what goes unsaid">' +
            '<img class="miru2__bg" src="assets/miru-hero2-bg.jpg" alt="" loading="lazy" />' +
            '<div class="miru2__lines" aria-hidden="true">' + m2lines + "</div>" +
            '<img class="miru2__logo" src="assets/miru-hero2-logo.svg" alt="MIRU" />' +
            '<nav class="miru2__nav">' + m2nav + "</nav>" +
            '<span class="miru2__btn">Request access</span>' +
            '<div class="miru2__title"><h3 class="miru2__hero">Hear what goes unsaid.</h3>' +
              '<p class="miru2__lead">Miru reads the emotions and micro-expressions of the person in front of you, and quietly tells you how to connect. Empathy, worn as jewelry.</p></div>' +
            '<div class="miru2__t3"><p class="miru2__h">Sometimes what matters most lives between the words.</p>' +
              '<p class="miru2__body">We don’t lose connection because we can’t hear the words. We miss the pause, the glance, the tone that hides what’s real. For some, reading that comes easily. For others, it’s almost impossible.</p>' +
              '<p class="miru2__more">read more</p></div>' +
            '<div class="miru2__t2"><p class="miru2__h miru2__h--mid">Miru sees it with you.</p>' +
              '<p class="miru2__body">Reads emotions — picks up mood and micro-expressions in real time. Understands the unsaid — notices what hides behind the words and suggests how to get closer. Only for you — the cue arrives quietly, through a hidden earpiece. To everyone else, it’s just jewelry.</p></div>' +
            '<div class="miru2__ew"><p class="miru2__h miru2__h--big">Emotional Wearable</p><p class="miru2__year">2026</p></div>' +
            "</div>";
        }
        if (b.fan)
          return '<div class="fan reveal" role="group" aria-label="Miru — посты в Instagram (наведите, чтобы разложить в ряд)">' +
            '<img class="fan__frame" src="assets/miru-fan-frame.svg?v=1" alt="" aria-hidden="true" />' +
            '<img class="fan__card fan__card--a" src="assets/miru-fan-a.png?v=2" alt="Miru — пост в Instagram" loading="lazy" />' +
            '<img class="fan__card fan__card--b" src="assets/miru-fan-b.png?v=2" alt="Miru — пост в Instagram" loading="lazy" />' +
            '<img class="fan__card fan__card--c" src="assets/miru-fan-c.png?v=3" alt="Miru — пост в Instagram" loading="lazy" />' +
            "</div>";
        if (b.mirulogo)
          return '<div class="mlogo reveal" role="img" aria-label="MIRU — эмпатия как украшение">' +
            '<img class="mlogo__screen" src="assets/miru-hero.jpg?v=3" alt="" aria-hidden="true" loading="eager" />' +
            '<div class="mlogo__logo">' +
              '<img class="mlogo__sign" src="assets/miru-sign.png?v=2" alt="" aria-hidden="true" />' +
              '<img class="mlogo__word" src="assets/miru-word.png?v=1" alt="MIRU" />' +
            "</div>" +
          "</div>";
        if (b.laptop) {
          var lp = b.laptop;
          var screenInner;
          if (lp.layers) {
            screenInner = '<div class="hero-laptop__screen hero-laptop__screen--layers"' + (lp.screenBg ? ' style="background:' + lp.screenBg + '"' : "") + ">" +
              lp.layers.map(function (ly) {
                return '<img class="lap-layer lap-layer--' + (ly.from || "up") + '" src="' + ly.src + '" alt="" loading="lazy" style="left:' + ly.left + "%;top:" + ly.top + "%;width:" + ly.width + "%;height:" + ly.height + "%;--d:" + (ly.delay || 0) + 's" />';
              }).join("") +
              "</div>";
          } else {
            screenInner = '<img class="hero-laptop__screen hero-laptop__screen--img" src="' + lp.screen + '" alt="" loading="lazy" />';
          }
          return '<figure class="tl__media tl__media--plain reveal">' +
            (lp.label ? '<figcaption class="tl__label">' + lp.label + "</figcaption>" : "") +
            '<div class="hero-laptop" style="aspect-ratio:' + (lp.ratio || "1484 / 910") + '" data-hero-laptop=\'' + JSON.stringify(lp.corners) + '\'>' +
              '<img class="hero-laptop__bg" src="' + lp.bg + '" alt="' + data.title + ' — журнал оценок на ноутбуке" loading="lazy" />' +
              screenInner +
            "</div></figure>";
        }
        if (b.bleed)
          return '<img class="case__bleed-img" src="' + b.bleed + '" alt="' + (b.alt || "") + '" loading="lazy" />';
        if (b.bleedVideo)
          return '<video class="case__bleed-img" src="' + b.bleedVideo + '" autoplay muted loop playsinline preload="metadata"' + (b.poster ? ' poster="' + b.poster + '"' : "") + "></video>";
        if (b.swap)
          return '<figure class="tl__media reveal">' +
            (b.swap.label ? '<figcaption class="tl__label">' + b.swap.label + "</figcaption>" : "") +
            '<div class="tl__swap" style="aspect-ratio:' + (b.swap.ratio || "16 / 9") + '" role="img" aria-label="' + (b.swap.alt || data.title) + '">' +
              '<img class="tl__swap-img" src="' + b.swap.a + '" alt="" loading="lazy" />' +
              '<img class="tl__swap-img tl__swap-img--b" src="' + b.swap.b + '" alt="" loading="lazy" />' +
            "</div></figure>";
        if (b.media)
          return '<figure class="tl__media reveal' + (b.media.plain ? " tl__media--plain" : "") + (b.media.narrow ? " tl__media--narrow" : "") + (b.media.phone ? " tl__media--phone" : "") + (b.media.anim ? " tl__media--" + b.media.anim : "") + '">' +
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
        if (b.ba) {
          var ratio = b.ba.ratio || "16 / 10";
          return (
            '<div class="ba reveal" data-ba style="aspect-ratio:' + ratio + '">' +
            '<div class="ba__img ba__after"><img src="' + b.ba.after.src + '" alt="' + (b.ba.after.label || "") + '" loading="lazy" draggable="false" />' +
            '<span class="ba__label ba__label--after">' + b.ba.after.label + "</span></div>" +
            '<div class="ba__img ba__before" data-ba-before><img src="' + b.ba.before.src + '" alt="' + (b.ba.before.label || "") + '" loading="lazy" draggable="false" />' +
            '<span class="ba__label ba__label--before">' + b.ba.before.label + "</span></div>" +
            '<div class="ba__handle" data-ba-handle><span class="ba__grip" aria-hidden="true"></span></div>' +
            "</div>"
          );
        }
        return "";
      })
      .join("");
  }

  // Hero-визуал (обложка / девайс-мокап / анимация) — общий для обычного и таб-рендера
  function heroMediaHtml(d) {
    if (d.hideHero) return "";
    if (d.heroDevice) {
      var sc = d.heroDevice.screen || {};
      return '<figure class="case__cover case__cover--image hero-device reveal" style="aspect-ratio:' + (d.heroDevice.ratio || "1254 / 708") + '">' +
        '<img class="hero-device__bg" src="' + d.heroDevice.bg + '" alt="' + data.title + ' – обложка" />' +
        '<video class="hero-device__screen" style="left:' + sc.left + ";top:" + sc.top + ";width:" + sc.width + ";height:" + sc.height + '" src="' + d.heroDevice.video + '" autoplay muted loop playsinline preload="auto"></video>' +
        "</figure>";
    }
    if (d.heroAnim) {
      return '<figure class="hero-anim" style="aspect-ratio:' + (d.heroAnim.ratio || "1920 / 807") + '" role="img" aria-label="' + data.title + '">' +
        '<img class="hero-anim__bg" src="' + d.heroAnim.bg + '" alt="" />' +
        '<img class="hero-anim__mark" src="' + d.heroAnim.mark + '" alt="' + data.title + '" />' +
        '<span class="hero-anim__star" aria-hidden="true"></span>' +
        "</figure>";
    }
    if (d.cover) {
      return '<div class="case__cover case__cover--image reveal"' + (d.coverRatio ? ' style="aspect-ratio:' + d.coverRatio + '"' : "") + '><img src="' + d.cover + '" alt="' + data.title + ' – обложка" loading="lazy" /></div>';
    }
    if (d.heroThemeSwitch) {
      var ts = d.heroThemeSwitch;
      return '<figure class="case__cover case__cover--image hero-theme reveal" style="aspect-ratio:' + (ts.ratio || "16 / 9") + '" role="img" aria-label="' + data.title + ' — светлая и тёмная темы">' +
        '<img class="hero-theme__img" src="' + ts.light + '" alt="" loading="lazy" />' +
        '<img class="hero-theme__img hero-theme__img--dark" src="' + ts.dark + '" alt="" loading="lazy" />' +
        "</figure>";
    }
    if (d.heroEmpty) {
      return '<div class="case__cover case__cover--empty reveal" style="aspect-ratio:' + (d.heroEmpty.ratio || "1254 / 708") + '" aria-hidden="true"></div>';
    }
    if (d.heroLaptop) {
      var lp = d.heroLaptop;
      return '<figure class="case__cover case__cover--image hero-laptop reveal" style="aspect-ratio:' + (lp.ratio || "1020 / 665") + '" data-hero-laptop=\'' + JSON.stringify(lp.corners) + '\'>' +
        '<img class="hero-laptop__bg" src="' + lp.bg + '" alt="' + data.title + ' – обложка" />' +
        '<video class="hero-laptop__screen" src="' + lp.video + '" autoplay muted loop playsinline preload="auto"></video>' +
      "</figure>";
    }
    return '<div class="case__cover reveal" data-tone="' + (d.tone || data.tone) + '" aria-hidden="true"></div>';
  }

  var bodyHtml;
  if (data.caseStudy) {
    bodyHtml = caseStudyHtml(data.caseStudy);
  } else if (data.tabs) {
    // Hero с табами: контент (подзаголовок + визуал + мета + блоки) переключается.
    // Активный таб берём из URL-хэша, чтобы при обновлении страницы остаться на нём.
    var hashTab = (location.hash || "").replace(/^#/, "");
    var activeIdx = 0;
    for (var ti = 0; ti < data.tabs.length; ti++) {
      if (data.tabs[ti].id === hashTab) { activeIdx = ti; break; }
    }
    var tabBtns = data.tabs
      .map(function (t, i) {
        return '<button type="button" class="case__tab' + (i === activeIdx ? " is-active" : "") +
          '" data-case-tab="' + t.id + '" role="tab" aria-selected="' + (i === activeIdx ? "true" : "false") + '">' +
          t.label + "</button>";
      })
      .join("");
    var tabPanels = data.tabs
      .map(function (t, i) {
        var inner =
          '<p class="case__subtitle reveal">' + (t.subtitleHtml || t.subtitle || "") + "</p>" +
          (t.meta ? '<dl class="case__meta reveal">' + metaHtml(t.meta) + "</dl>" : "") +
          heroMediaHtml(t) +
          (t.overview ? '<p class="tl__lead reveal">' + t.overview + "</p>" : "") +
          (t.blocks && t.blocks.length
            ? blocksHtml(t.blocks)
            : (t.empty || '<p class="tl__lead tl__lead--muted reveal">Раздел готовится.</p>'));
        return '<div class="case__tab-panel' + (i === activeIdx ? " is-active" : "") +
          '" data-case-panel="' + t.id + '" role="tabpanel"' + (i === activeIdx ? "" : " hidden") + ">" + inner + "</div>";
      })
      .join("");
    bodyHtml =
      '<header class="case__hero">' +
      '<h1 class="case__title reveal">' + data.title + "</h1>" +
      '<div class="case__tabs reveal" role="tablist">' + tabBtns + "</div>" +
      "</header>" +
      tabPanels;
  } else if (data.blocks) {
    bodyHtml =
      '<header class="case__hero">' +
      '<h1 class="case__title reveal">' + data.title + "</h1>" +
      '<p class="case__subtitle reveal">' + (data.subtitleHtml || data.subtitle) + "</p>" +
      "</header>" +
      (data.meta ? '<dl class="case__meta reveal">' + metaHtml(data.meta) + "</dl>" : "") +
      heroMediaHtml(data) +
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
      (data.meta ? '<dl class="case__meta reveal">' + metaHtml(data.meta) + "</dl>" : "") +
      (data.heroVideo
        ? '<div class="case__cover case__cover--image case__cover--video reveal"' + (data.heroVideoRatio ? ' style="aspect-ratio:' + data.heroVideoRatio + '"' : "") + '><video src="' + data.heroVideo + '" autoplay muted loop playsinline preload="metadata"' + (data.heroPoster ? ' poster="' + data.heroPoster + '"' : "") + "></video></div>"
        : data.heroLaptop
        ? '<figure class="case__cover case__cover--image hero-laptop reveal" style="aspect-ratio:' + (data.heroLaptop.ratio || "1020 / 665") + '" data-hero-laptop=\'' + JSON.stringify(data.heroLaptop.corners) + '\'>' +
            '<img class="hero-laptop__bg" src="' + data.heroLaptop.bg + '" alt="' + data.title + ' – обложка" />' +
            '<video class="hero-laptop__screen" src="' + data.heroLaptop.video + '" autoplay muted loop playsinline preload="auto"></video>' +
          "</figure>"
        : data.cover
        ? '<div class="case__cover case__cover--image reveal"' + (data.coverRatio ? ' style="aspect-ratio:' + data.coverRatio + '"' : "") + '><img src="' + data.cover + '" alt="' + data.title + ' – обложка" loading="lazy" /></div>'
        : '<div class="case__cover reveal" data-tone="' + data.tone + '" aria-hidden="true"></div>') +
      (data.fullbleed
        ? '<div class="case__fullbleed reveal" style="background:' + (data.fullbleed.bg || "#070014") + '"><img class="case__fullbleed-img" src="' + data.fullbleed.src + '" alt="' + data.title + '" loading="lazy" /></div>'
        : "") +
      (data.article
        ? '<div class="art art--notoc"><div class="art__body">' +
            '<p class="art__lead reveal">' + data.overview + "</p>" +
            articleHtml(data.article, data.tone) +
          "</div></div>"
        : (data.overview ? '<p class="case__overview reveal">' + data.overview + "</p>" : "") +
          (data.sections ? sectionsHtml(data.sections) : "") +
          (data.gallery ? galleryHtml(data.gallery) : ""));
  }

  // Рекомендации: превью всех остальных работ
  var moreHtml = ids
    .filter(function (k) { return k !== id; })
    .map(function (k) {
      var d = projects[k];
      var media = d.card
        ? '<div class="tile__media tile__media--image"' + (d.tone ? ' data-tone="' + d.tone + '"' : "") + '><img src="' + d.card + '" alt="' + d.title + ' – обложка" loading="lazy" /></div>'
        : '<div class="tile__media" data-tone="' + (d.tone || 1) + '"></div>';
      return '<li class="tile reveal"><a class="tile__link" href="case.html?id=' + k + '" aria-label="Кейс: ' + d.title + '">' +
        media +
        '<div class="tile__cap"><h3 class="tile__title">' + d.title + '</h3><p class="tile__meta">' + (d.cardMeta || d.subtitle) + "</p></div>" +
        "</a></li>";
    })
    .join("");

  root.innerHTML =
    '<div class="container">' +
    '<a class="case__back reveal" href="index.html#work"><span aria-hidden="true">←</span> Работы</a>' +
    bodyHtml +
    '<section class="case__more reveal" aria-label="Другие работы">' +
    '<p class="case__more-label">Другие работы</p>' +
    '<ul class="case__more-track">' + moreHtml + "</ul>" +
    "</section>" +
    "</div>";

  // Содержание вынесено за сетку и появляется только после главного вижуала:
  // показываем рейл, когда обложка ушла вверх за пределы экрана, и прячем
  // у блока «Следующий проект» / футера снизу, чтобы ничего не перекрывать.
  if (data.article && "IntersectionObserver" in window) {
    var toc = document.querySelector(".art__toc");
    var cover = document.querySelector(".case__cover");
    var endEl = document.querySelector(".case__more");
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

  // Переключение табов в hero кейса
  var caseTabBtns = document.querySelectorAll("[data-case-tab]");
  if (caseTabBtns.length) {
    var casePanels = document.querySelectorAll("[data-case-panel]");
    Array.prototype.forEach.call(caseTabBtns, function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-case-tab");
        Array.prototype.forEach.call(caseTabBtns, function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        Array.prototype.forEach.call(casePanels, function (p) {
          var on = p.getAttribute("data-case-panel") === id;
          p.hidden = !on;
          p.classList.toggle("is-active", on);
          if (on) {
            // показываем reveal-элементы только что открытой панели
            Array.prototype.forEach.call(p.querySelectorAll(".reveal"), function (el) {
              el.classList.add("is-visible");
            });
          }
        });
        // запоминаем активный таб в URL, чтобы при обновлении вернуться на него
        try {
          if (history.replaceState) history.replaceState(null, "", "#" + id);
          else location.hash = id;
        } catch (e) { location.hash = id; }
      });
    });
  }
})();
