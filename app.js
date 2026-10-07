/* Чарівна Нитка — конструктор, кошик, оформлення. Без залежностей. */
(function () {
  'use strict';

  /* ---------- Налаштування магазину (заповнити) ---------- */
  var CONFIG = {
    telegram: 'your_manager',          // [username менеджера в Telegram, без @]
    productionDays: '5–7',             // [термін виготовлення]
    currency: '₴'
  };

  /* ---------- Дані ---------- */
  var HOUSES = {
    gryffindor: { name: 'Ґрифіндор', primary: '#7F0909', secondary: '#D3A625', thread: 'gold', garment: { tee: 'wine', sweat: 'bordo', hoodie: 'bordo' } },
    slytherin: { name: 'Слизерин', primary: '#1A472A', secondary: '#AAAAAA', thread: 'silver', garment: { tee: 'green', sweat: 'darkgreen', hoodie: 'darkgreen' } },
    ravenclaw: { name: 'Рейвенклов', primary: '#0E1A40', secondary: '#946B2D', thread: 'bronze', garment: { tee: 'navy', sweat: 'navy', hoodie: 'royalblue' } },
    hufflepuff: { name: 'Гафелпаф', primary: '#ECB939', secondary: '#372E29', thread: 'black', garment: { tee: 'yellow', sweat: 'yellow', hoodie: 'sunyellow' } }
  };

  var THREADS = {
    gold: { name: 'Золото', hex: '#D3A625' },
    silver: { name: 'Срібло', hex: '#C4C4C4' },
    bronze: { name: 'Бронза', hex: '#B07A3A' },
    white: { name: 'Білий', hex: '#F5F3EC' },
    black: { name: 'Чорний', hex: '#1C1A1F' },
    red: { name: 'Червоний', hex: '#A51D1D' },
    green: { name: 'Зелений', hex: '#2A7A45' },
    blue: { name: 'Синій', hex: '#2B4A9B' }
  };

  // x, y — центр нанесення у % від зображення; w — ширина у % від зображення.
  var PRODUCTS = {
    tee: {
      name: 'Футболка', price: 690,
      colors: { white: ['Білий', '#F1F1F3'], lgray: ['Сірий меланж', '#A7A6A9'], black: ['Чорний', '#1D1D1D'], wine: ['Бордо', '#48222B'], green: ['Темно-зелений', '#222F24'], navy: ['Темно-синій', '#171E2B'], yellow: ['Гірчичний', '#D79F29'] },
      img: function (c, side) { return 'images/tee-' + c + '-' + side + '.webp'; },
      ratio: 900 / 817,
      places: { chest: { x: 61, y: 30, w: 13 }, center: { x: 50, y: 36, w: 30 }, back: { x: 50, y: 33, w: 36, side: 'back' }, sleeve: { x: 17, y: 30, w: 9, rot: -28 } }
    },
    sweat: {
      name: 'Світшот', price: 1190,
      colors: { white: ['Білий', '#EEEEEE'], gray: ['Сірий', '#CBCECD'], black: ['Чорний', '#252525'], bordo: ['Бордо', '#511C29'], darkgreen: ['Темно-зелений', '#385343'], navy: ['Темно-синій', '#25293A'], yellow: ['Жовтий', '#EDD148'] },
      img: function (c, side) { return 'images/sweat-' + c + '-' + side + '.webp'; },
      ratio: 1,
      places: { chest: { x: 60, y: 25, w: 12 }, center: { x: 50, y: 32, w: 28 }, back: { x: 50, y: 30, w: 34, side: 'back' }, sleeve: { x: 13, y: 40, w: 7, rot: -6 } }
    },
    hoodie: {
      name: 'Худі', price: 1490,
      colors: { white: ['Білий', '#F3F3F3'], gray: ['Сірий', '#D8D1CD'], black: ['Чорний', '#2D2928'], bordo: ['Бордо', '#531D27'], darkgreen: ['Темно-зелений', '#385343'], royalblue: ['Синій', '#4F5F95'], sunyellow: ['Жовтий', '#F3D75F'] },
      img: function (c, side) {
        var over = c === 'black' || c === 'gray';
        return 'images/' + (over ? 'hoodieover-' : 'hoodie-') + c + '-' + side + '.webp';
      },
      ratio: 1,
      places: { chest: { x: 60, y: 36, w: 11 }, center: { x: 50, y: 44, w: 24 }, back: { x: 50, y: 43, w: 34, side: 'back' }, sleeve: { x: 12, y: 52, w: 6, rot: -4 } }
    }
  };

  var PLACES = { chest: 'Груди ліворуч', center: 'Груди по центру', back: 'Спина', sleeve: 'Рукав' };
  var TECH = { embroidery: 'Вишивка', print: 'Принт' };
  var TYPES = { crest: 'Ініціали в гербі', text: 'Напис', emblem: 'Емблема' };
  // Ціна нанесення: [принт, вишивка]. [Орієнтовні ціни — уточнити.]
  var PLACE_PRICE = { chest: [150, 250], center: [250, 450], back: [350, 750], sleeve: [150, 250] };
  var SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  var FONTS = {
    classic: { name: 'Класичний', css: "'Cormorant Garamond', Georgia, serif", weight: 700 },
    script: { name: 'Рукописний', css: "'Marck Script', cursive", weight: 400 },
    fairy: { name: 'Казковий', css: "'Ruslan Display', 'Cormorant Garamond', serif", weight: 400 },
    simple: { name: 'Простий', css: "'Lora', Georgia, serif", weight: 600 }
  };

  var MOTIFS = {
    hallows: 'Смертельні реліквії',
    glasses: 'Окуляри й шрам',
    snitch: 'Золотий снич',
    castle: 'Замок школи',
    letter: 'Лист із печаткою',
    platform: 'Платформа 9¾'
  };

  var PRESETS = [
    { id: 'crest-g', title: 'Ініціали в гербі Ґрифіндору', desc: 'Ваші ініціали золотом на бордовому щиті.', state: { product: 'hoodie', color: 'bordo', tech: 'embroidery', type: 'crest', house: 'gryffindor', thread: 'gold', place: 'chest', initials: 'ГП' } },
    { id: 'quidditch', title: '«Квідич»', desc: 'Прізвище й номер на спині — як у гравця команди факультету.', state: { product: 'hoodie', color: 'black', tech: 'print', type: 'text', font: 'fairy', thread: 'gold', place: 'back', text: 'ПОТТЕР\n7' } },
    { id: 'platform', title: 'Платформа 9¾', desc: 'Для тих, хто досі чекає на свій потяг.', state: { product: 'tee', color: 'white', tech: 'print', type: 'emblem', motif: 'platform', thread: 'black', place: 'center', caption: 'Кінгз-Крос · Лондон' } },
    { id: 'mischief', title: '«Я урочисто присягаюся…»', desc: 'Цитата з Мапи мародерів — для пустунів.', state: { product: 'hoodie', color: 'black', tech: 'print', type: 'text', font: 'script', thread: 'gold', place: 'back', text: 'Я урочисто присягаюся,\nщо нічого доброго\nне замислюю' } },
    { id: 'letter', title: '«Лист з Гоґвортсу»', desc: 'Конверт із сургучем — лист, якого чекали з 11 років.', state: { product: 'sweat', color: 'gray', tech: 'embroidery', type: 'emblem', motif: 'letter', thread: 'bronze', place: 'center', caption: '' } },
    { id: 'glasses', title: 'Окуляри й шрам', desc: 'Мінімалістичний символ, який впізнає кожен фанат.', state: { product: 'tee', color: 'black', tech: 'embroidery', type: 'emblem', motif: 'glasses', thread: 'gold', place: 'chest', caption: '' } },
    { id: 'always', title: '«Завжди»', desc: 'Одне слово для тих, хто любить назавжди. Ідеально для пар.', state: { product: 'sweat', color: 'navy', tech: 'embroidery', type: 'text', font: 'script', thread: 'silver', place: 'chest', text: 'Завжди' } },
    { id: 'hallows', title: 'Смертельні реліквії', desc: 'Трикутник, коло й риска — стриманий знак для знавців.', state: { product: 'hoodie', color: 'white', tech: 'print', type: 'emblem', motif: 'hallows', thread: 'black', place: 'center', caption: '' } }
  ];

  var DEFAULT = { product: 'hoodie', color: 'bordo', tech: 'embroidery', type: 'crest', house: 'gryffindor', thread: 'gold', place: 'chest', initials: 'ГП', text: 'Завжди', font: 'classic', motif: 'snitch', caption: '', size: 'M' };

  /* ---------- Утиліти ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return n.toLocaleString('uk-UA') + ' ' + CONFIG.currency; }
  function assign(a) { for (var i = 1; i < arguments.length; i++) { var b = arguments[i]; if (b) for (var k in b) a[k] = b[k]; } return a; }
  var uid = 0;

  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }

  function priceOf(s) {
    return PRODUCTS[s.product].price + PLACE_PRICE[s.place][s.tech === 'embroidery' ? 1 : 0];
  }

  /* ---------- Рендер дизайну у SVG ---------- */
  function defs(id, hex, tech) {
    if (tech !== 'embroidery') return '';
    // Гладь: діагональні «стібки» + легка тінь над тканиною.
    return '<defs>' +
      '<pattern id="st' + id + '" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">' +
      '<rect width="3" height="3" fill="' + hex + '"/>' +
      '<rect width="1.2" height="3" fill="#fff" opacity=".28"/>' +
      '<rect x="2.2" width=".6" height="3" fill="#000" opacity=".22"/></pattern>' +
      '<filter id="sh' + id + '" x="-10%" y="-10%" width="120%" height="125%">' +
      '<feDropShadow dx="0" dy="1.2" stdDeviation=".9" flood-color="#000" flood-opacity=".45"/></filter></defs>';
  }

  function paint(id, hex, tech) { return tech === 'embroidery' ? 'url(#st' + id + ')' : hex; }
  function fx(id, tech) { return tech === 'embroidery' ? ' filter="url(#sh' + id + ')"' : ''; }

  function crestSVG(s, id) {
    var h = HOUSES[s.house] || HOUSES.gryffindor;
    var t = THREADS[s.thread] || THREADS.gold;
    var ini = (s.initials || '').toUpperCase().slice(0, 3) || '★';
    var fs = ini.length > 2 ? 54 : ini.length > 1 ? 70 : 92;
    var shield = 'M100 14 L178 40 L178 112 C178 170 140 204 100 226 C60 204 22 170 22 112 L22 40 Z';
    var inner = 'M100 30 L164 51 L164 112 C164 160 132 189 100 208 C68 189 36 160 36 112 L36 51 Z';
    return '<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Герб з ініціалами ' + esc(ini) + '">' +
      defs(id, t.hex, s.tech) +
      '<g' + fx(id, s.tech) + '>' +
      '<path d="' + shield + '" fill="' + paint(id, t.hex, s.tech) + '"/>' +
      '<path d="' + inner + '" fill="' + h.primary + '"/>' +
      '<path d="M100 44 l4 9 10 1 -8 6 3 10 -9 -6 -9 6 3 -10 -8 -6 10 -1z" fill="' + paint(id, t.hex, s.tech) + '"/>' +
      '<text x="100" y="' + (138 + fs * 0.12) + '" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="' + fs + '" fill="' + paint(id, t.hex, s.tech) + '">' + esc(ini) + '</text>' +
      '<path d="M62 176 Q100 194 138 176" fill="none" stroke="' + paint(id, t.hex, s.tech) + '" stroke-width="5" stroke-linecap="round"/>' +
      '</g></svg>';
  }

  function textSVG(s, id) {
    var t = THREADS[s.thread] || THREADS.gold;
    var f = FONTS[s.font] || FONTS.classic;
    var lines = String(s.text || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).slice(0, 3);
    if (!lines.length) lines = ['Ваш напис'];
    var longest = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    var fs = Math.min(64, 300 / Math.max(1, longest * 0.5));
    var lh = fs * 1.15;
    var H = Math.ceil(lh * lines.length + fs * 0.4);
    var out = '<svg viewBox="0 0 300 ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Напис: ' + esc(lines.join(' ')) + '">' + defs(id, t.hex, s.tech) +
      '<g' + fx(id, s.tech) + ' font-family="' + f.css.replace(/"/g, "'") + '" font-weight="' + f.weight + '" font-size="' + fs.toFixed(1) + '" text-anchor="middle" fill="' + paint(id, t.hex, s.tech) + '">';
    lines.forEach(function (l, i) { out += '<text x="150" y="' + (fs + i * lh).toFixed(1) + '">' + esc(l) + '</text>'; });
    return out + '</g></svg>';
  }

  function motifPaths(m, c) {
    var st = ' fill="none" stroke="' + c + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"';
    switch (m) {
      case 'hallows': return '<path d="M100 20 L178 160 L22 160 Z"' + st + '/><circle cx="100" cy="113" r="45"' + st + '/><path d="M100 20 V160"' + st + '/>';
      case 'glasses': return '<path d="M104 18 L86 52 H108 L92 84"' + st + '/><circle cx="62" cy="128" r="34"' + st + '/><circle cx="138" cy="128" r="34"' + st + '/><path d="M96 122 Q100 114 104 122 M28 122 L10 112 M172 122 L190 112"' + st + '/>';
      case 'snitch': return '<circle cx="100" cy="112" r="28" fill="' + c + '"/><path d="M72 104 C48 70 18 72 8 84 C30 86 40 98 46 110 C30 108 22 116 18 126 C40 120 58 120 72 116 M128 104 C152 70 182 72 192 84 C170 86 160 98 154 110 C170 108 178 116 182 126 C160 120 142 120 128 116"' + st + '/>';
      case 'castle': return '<path d="M20 180 V110 H40 V96 H52 V110 H64 V70 L82 44 L100 70 V90 L118 40 L136 90 V70 L154 44 L172 70 V110 H180 V180 Z"' + st + '/><path d="M86 180 V148 Q100 132 114 148 V180"' + st + '/><path d="M100 22 l3 7 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1z" fill="' + c + '"/>';
      case 'letter': return '<rect x="18" y="50" width="164" height="108" rx="6"' + st + '/><path d="M18 56 L100 116 L182 56"' + st + '/><circle cx="100" cy="116" r="22" fill="' + c + '"/><path d="M92 106 V126 M108 106 V126 M92 116 H108" stroke="#fff" stroke-opacity=".55" stroke-width="4" fill="none"/>';
      case 'platform': return '<rect x="14" y="44" width="172" height="112" rx="14"' + st + '/><text x="100" y="128" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="72" fill="' + c + '">9¾</text>';
      default: return '';
    }
  }

  function emblemSVG(s, id) {
    var t = THREADS[s.thread] || THREADS.gold;
    var cap = (s.caption || '').trim().slice(0, 28);
    var H = cap ? 236 : 200;
    return '<svg viewBox="0 0 200 ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(MOTIFS[s.motif] || 'Емблема') + '">' + defs(id, t.hex, s.tech) +
      '<g' + fx(id, s.tech) + '>' + motifPaths(s.motif, paint(id, t.hex, s.tech)) +
      (cap ? '<text x="100" y="222" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="' + Math.min(26, 360 / cap.length) + '" fill="' + paint(id, t.hex, s.tech) + '">' + esc(cap) + '</text>' : '') +
      '</g></svg>';
  }

  function designSVG(s) {
    var id = 'd' + (++uid);
    if (s.type === 'text') return textSVG(s, id);
    if (s.type === 'emblem') return emblemSVG(s, id);
    return crestSVG(s, id);
  }

  /* Вставляє виріб + дизайн у контейнер .garment */
  function renderGarment(el, s, opts) {
    opts = opts || {};
    var p = PRODUCTS[s.product];
    var place = p.places[s.place];
    var side = opts.side || place.side || 'front';
    var showDesign = (place.side || 'front') === side;
    var alt = p.name + ', колір ' + p.colors[s.color][0].toLowerCase() + (side === 'back' ? ', вигляд ззаду' : '');
    var w = opts.width || 900;
    var h = Math.round(w / p.ratio);
    el.style.setProperty('--ratio', p.ratio);
    el.innerHTML = '<img src="' + p.img(s.color, side) + '" alt="' + esc(alt) + '" width="' + w + '" height="' + h + '"' + (opts.lazy ? ' loading="lazy"' : '') + ' decoding="async">' +
      (showDesign ? '<div class="garment__design garment__design--' + s.tech + '" style="left:' + place.x + '%;top:' + place.y + '%;width:' + place.w + '%;' + (place.rot ? 'transform:translate(-50%,-50%) rotate(' + place.rot + 'deg)' : '') + '">' + designSVG(s) + '</div>' : '');
  }

  /* ---------- Стан конструктора ---------- */
  var state = assign({}, DEFAULT);
  var previewSide = 'front';

  function describe(s) {
    var what = s.type === 'crest' ? 'герб ' + HOUSES[s.house].name + ', ініціали «' + (s.initials || '').toUpperCase() + '»'
      : s.type === 'text' ? 'напис «' + String(s.text || '').replace(/\n/g, ' ') + '», шрифт ' + FONTS[s.font].name.toLowerCase()
      : 'емблема «' + MOTIFS[s.motif] + '»' + (s.caption ? ', підпис «' + s.caption + '»' : '');
    return TECH[s.tech] + ': ' + what + '; нитка/фарба — ' + THREADS[s.thread].name.toLowerCase() + '; ' + PLACES[s.place].toLowerCase();
  }

  function swatches(container, items, current, name, label) {
    container.innerHTML = Object.keys(items).map(function (k) {
      var it = items[k];
      return '<label class="swatch" title="' + esc(it[0]) + '"><input type="radio" name="' + name + '" value="' + k + '"' + (k === current ? ' checked' : '') + '><span style="--c:' + it[1] + '" aria-hidden="true"></span><span class="sr-only">' + esc(label + it[0]) + '</span></label>';
    }).join('');
  }

  function chips(container, items, current, name) {
    container.innerHTML = Object.keys(items).map(function (k) {
      return '<label class="chip"><input type="radio" name="' + name + '" value="' + k + '"' + (k === current ? ' checked' : '') + '><span>' + esc(items[k]) + '</span></label>';
    }).join('');
  }

  function syncForm() {
    var form = $('#builder');
    if (!form) return;
    var p = PRODUCTS[state.product];
    if (!p.colors[state.color]) state.color = Object.keys(p.colors)[0];

    chips($('#f-product'), { tee: 'Футболка', sweat: 'Світшот', hoodie: 'Худі' }, state.product, 'product');
    swatches($('#f-color'), p.colors, state.color, 'color', 'Колір: ');
    chips($('#f-tech'), TECH, state.tech, 'tech');
    chips($('#f-type'), TYPES, state.type, 'type');
    chips($('#f-place'), PLACES, state.place, 'place');
    chips($('#f-size'), SIZES.reduce(function (o, s) { o[s] = s; return o; }, {}), state.size, 'size');
    chips($('#f-house'), Object.keys(HOUSES).reduce(function (o, k) { o[k] = HOUSES[k].name; return o; }, {}), state.house, 'house');
    chips($('#f-font'), Object.keys(FONTS).reduce(function (o, k) { o[k] = FONTS[k].name; return o; }, {}), state.font, 'font');
    chips($('#f-motif'), MOTIFS, state.motif, 'motif');
    swatches($('#f-thread'), Object.keys(THREADS).reduce(function (o, k) { o[k] = [THREADS[k].name, THREADS[k].hex]; return o; }, {}), state.thread, 'thread', (state.tech === 'embroidery' ? 'Нитка: ' : 'Фарба: '));

    $('#f-initials').value = state.initials || '';
    $('#f-text').value = state.text || '';
    $('#f-caption').value = state.caption || '';
    $('#thread-label').textContent = state.tech === 'embroidery' ? 'Колір нитки' : 'Колір принта';
    $('#color-name').textContent = p.colors[state.color][0];
    $('#thread-name').textContent = THREADS[state.thread].name;

    $$('[data-for-type]').forEach(function (el) { el.hidden = el.getAttribute('data-for-type') !== state.type; });
    update();
  }

  function update() {
    var place = PRODUCTS[state.product].places[state.place];
    var needSide = place.side || 'front';
    if (previewSide !== needSide) previewSide = needSide;
    renderGarment($('#preview'), state, { side: previewSide });
    $$('[data-side]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-side') === previewSide)); });
    var price = money(priceOf(state));
    $('#price').textContent = price;
    $('#price-sticky').textContent = price;
    $('#summary').textContent = PRODUCTS[state.product].name + ' · ' + PRODUCTS[state.product].colors[state.color][0].toLowerCase() + ' · ' + describe(state);
    $('#add-btn').disabled = !state.size;
  }

  function setState(patch, scroll) {
    assign(state, patch);
    syncForm();
    if (scroll) {
      var el = $('#constructor');
      if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function bindBuilder() {
    var form = $('#builder');
    if (!form) return;
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t.type !== 'radio') return;
      var patch = {}; patch[t.name] = t.value;
      if (t.name === 'house') {
        var h = HOUSES[t.value];
        patch.thread = h.thread;
        patch.color = h.garment[state.product];
      }
      if (t.name === 'product') {
        var house = HOUSES[state.house];
        if (state.type === 'crest' && house) patch.color = house.garment[t.value];
      }
      setState(patch);
    });
    form.addEventListener('input', function (e) {
      var t = e.target;
      if (t.id === 'f-initials') { t.value = t.value.replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ]/g, '').slice(0, 3); state.initials = t.value; }
      else if (t.id === 'f-text') { state.text = t.value; }
      else if (t.id === 'f-caption') { state.caption = t.value; }
      else return;
      update();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      addToCart(assign({}, state));
    });
    $$('[data-side]').forEach(function (b) {
      b.addEventListener('click', function () {
        previewSide = b.getAttribute('data-side');
        renderGarment($('#preview'), state, { side: previewSide });
        $$('[data-side]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
    });
    $('#add-sticky').addEventListener('click', function () { form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true })); });
  }

  /* ---------- Будинки, готові дизайни, hero ---------- */
  function bindHouses() {
    $$('[data-house]').forEach(function (card) {
      var k = card.getAttribute('data-house');
      var crest = card.querySelector('.house__crest');
      if (crest) crest.innerHTML = crestSVG({ house: k, thread: HOUSES[k].thread, tech: 'print', initials: 'АБ' }, 'h' + k);
      card.addEventListener('click', function () {
        setState({ type: 'crest', house: k, thread: HOUSES[k].thread, color: HOUSES[k].garment[state.product], place: state.place === 'back' ? 'chest' : state.place }, true);
      });
    });
  }

  function renderPresets() {
    var grid = $('#designs-grid');
    if (!grid) return;
    grid.innerHTML = PRESETS.map(function (p) {
      var s = assign({}, DEFAULT, p.state);
      return '<article class="design-card"><div class="garment garment--card" data-preset-preview="' + p.id + '"></div>' +
        '<div class="design-card__body"><h3>' + esc(p.title) + '</h3><p>' + esc(p.desc) + '</p>' +
        '<div class="design-card__foot"><span class="design-card__price">від ' + money(priceOf(s)) + '</span>' +
        '<button type="button" class="btn btn--ghost btn--sm" data-preset="' + p.id + '">Персоналізувати</button></div></div></article>';
    }).join('');
    PRESETS.forEach(function (p) {
      var s = assign({}, DEFAULT, p.state);
      var el = grid.querySelector('[data-preset-preview="' + p.id + '"]');
      renderGarment(el, s, { side: PRODUCTS[s.product].places[s.place].side || 'front', lazy: true, width: 900 });
    });
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-preset]');
      if (!b) return;
      var p = PRESETS.filter(function (x) { return x.id === b.getAttribute('data-preset'); })[0];
      setState(assign({}, DEFAULT, p.state, { size: state.size }), true);
    });
  }

  function heroLoop() {
    var el = $('#hero-garment');
    if (!el) return;
    var keys = Object.keys(HOUSES);
    var i = 0;
    var cap = $('#hero-house');
    // Попередньо вантажимо всі кольори, щоб зміна не блимала.
    keys.forEach(function (k) { var im = new Image(); im.src = PRODUCTS.hoodie.img(HOUSES[k].garment.hoodie, 'front'); });
    function show() {
      var k = keys[i % keys.length];
      var h = HOUSES[k];
      renderGarment(el, { product: 'hoodie', color: h.garment.hoodie, tech: 'embroidery', type: 'crest', house: k, thread: h.thread, place: 'center', initials: 'ГП' }, { side: 'front' });
      el.querySelector('.garment__design').style.width = '30%';
      if (cap) cap.textContent = h.name;
    }
    show();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var timer = null, paused = false, btn = $('#hero-pause');
    function play() { if (!timer && !paused && !document.hidden) timer = setInterval(function () { i++; show(); }, 3200); }
    function stop() { clearInterval(timer); timer = null; }
    play();
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else play(); });
    if (btn) btn.addEventListener('click', function () {
      paused = !paused;
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? 'Продовжити зміну факультетів' : 'Зупинити зміну факультетів');
      if (paused) stop(); else play();
    });
  }

  /* ---------- Кошик ---------- */
  var cart = store('cn-cart') || [];
  if (!Array.isArray(cart)) cart = [];

  function saveCart() { store('cn-cart', cart); renderCart(); }

  function addToCart(item) {
    item.qty = 1;
    item.price = priceOf(item);
    item.key = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    cart.push(item);
    saveCart();
    toast('Додано в кошик: ' + PRODUCTS[item.product].name.toLowerCase() + ', ' + item.size);
    openCart();
  }

  function total() { return cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0); }

  function renderCart() {
    var count = cart.reduce(function (s, i) { return s + i.qty; }, 0);
    $$('.cart-count').forEach(function (el) { el.textContent = count; el.hidden = !count; });
    var list = $('#cart-list');
    if (!list) return;
    $('#cart-empty').hidden = !!cart.length;
    $('#cart-foot').hidden = !cart.length;
    list.innerHTML = cart.map(function (i) {
      return '<li class="cart-item" data-key="' + i.key + '">' +
        '<div class="garment garment--thumb" data-thumb="' + i.key + '"></div>' +
        '<div class="cart-item__info"><strong>' + esc(PRODUCTS[i.product].name) + ', ' + esc(i.size) + '</strong>' +
        '<span>' + esc(PRODUCTS[i.product].colors[i.color][0]) + ' · ' + esc(describe(i)) + '</span>' +
        '<div class="cart-item__row"><div class="qty" role="group" aria-label="Кількість">' +
        '<button type="button" data-qty="-1" aria-label="Менше">−</button><span aria-live="polite">' + i.qty + '</span><button type="button" data-qty="1" aria-label="Більше">+</button></div>' +
        '<span class="cart-item__price">' + money(i.price * i.qty) + '</span></div>' +
        '<button type="button" class="link-btn" data-remove>Видалити</button></div></li>';
    }).join('');
    cart.forEach(function (i) { renderGarment(list.querySelector('[data-thumb="' + i.key + '"]'), i, { side: PRODUCTS[i.product].places[i.place].side || 'front', width: 900 }); });
    $('#cart-total').textContent = money(total());
    $('#checkout-total').textContent = money(total());
  }

  var lastFocus = null;
  function openCart() {
    var d = $('#cart');
    lastFocus = document.activeElement;
    showStep('cart');
    d.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(function () { d.classList.add('is-open'); $('#cart-close').focus(); });
  }
  function closeCart() {
    var d = $('#cart');
    d.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { d.hidden = true; }, 250);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function showStep(name) {
    $$('[data-step]').forEach(function (el) { el.hidden = el.getAttribute('data-step') !== name; });
    var titles = { cart: 'Кошик', checkout: 'Оформлення', done: 'Майже готово' };
    $('#cart-title').textContent = titles[name];
  }

  function bindCart() {
    $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
    $('#cart-close').addEventListener('click', closeCart);
    $$('[data-close-cart]').forEach(function (a) { a.addEventListener('click', closeCart); });
    $('#cart').addEventListener('click', function (e) {
      if (e.target.id === 'cart') return closeCart();
      var row = e.target.closest('.cart-item');
      if (row) {
        var it = cart.filter(function (x) { return x.key === row.getAttribute('data-key'); })[0];
        if (e.target.closest('[data-qty]')) {
          it.qty = Math.max(1, Math.min(20, it.qty + Number(e.target.closest('[data-qty]').getAttribute('data-qty'))));
          saveCart();
        } else if (e.target.closest('[data-remove]')) {
          var idx = cart.indexOf(it);
          cart.splice(idx, 1);
          saveCart();
          toast('Товар видалено з кошика', function () { cart.splice(idx, 0, it); saveCart(); });
        }
      }
    });
    document.addEventListener('keydown', function (e) {
      var d = $('#cart');
      if (d.hidden) return;
      if (e.key === 'Escape') closeCart();
      if (e.key === 'Tab') {
        var f = $$('button, [href], input, select, textarea', d).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    $('#to-checkout').addEventListener('click', function () { showStep('checkout'); $('#c-name').focus(); });
    $('#back-to-cart').addEventListener('click', function () { showStep('cart'); });
    $('#c-gift').addEventListener('change', function (e) { $('#gift-text-wrap').hidden = !e.target.checked; });
    $('#checkout').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target;
      var bad = $$('input[required]', f).filter(function (x) { return !x.checkValidity(); });
      $$('.field', f).forEach(function (x) { x.classList.remove('field--error'); });
      if (bad.length) {
        bad.forEach(function (x) { x.closest('.field').classList.add('field--error'); });
        bad[0].focus();
        return;
      }
      var msg = orderText(f);
      $('#order-text').value = msg;
      $('#tg-link').href = 'https://t.me/' + CONFIG.telegram;
      showStep('done');
      copy(msg, true);
      $('#cart-title').focus();
    });
    $('#copy-order').addEventListener('click', function () { copy($('#order-text').value); });
    $('#tg-link').addEventListener('click', function () {
      copy($('#order-text').value, true);
      cart = []; saveCart();
    });
  }

  function orderText(f) {
    var v = function (n) { return (f.elements[n].value || '').trim(); };
    var lines = ['Нове замовлення — Чарівна Нитка', ''];
    cart.forEach(function (i, n) {
      lines.push((n + 1) + '. ' + PRODUCTS[i.product].name + ', ' + PRODUCTS[i.product].colors[i.color][0].toLowerCase() + ', розмір ' + i.size + ' × ' + i.qty + ' — ' + money(i.price * i.qty));
      lines.push('   ' + describe(i));
    });
    lines.push('', 'Разом: ' + money(total()), '');
    lines.push('Імʼя: ' + v('name'), 'Телефон: ' + v('phone'), 'Нова Пошта: ' + v('city') + ', ' + v('branch'));
    lines.push('Оплата: ' + (f.elements.pay.value === 'card' ? 'передоплата на карту' : 'накладений платіж'));
    if (f.elements.gift.checked) lines.push('Подарунок, листівка: ' + (v('giftText') || 'без тексту'));
    if (v('comment')) lines.push('Коментар: ' + v('comment'));
    return lines.join('\n');
  }

  function copy(text, silent) {
    var done = function () { if (!silent) toast('Текст замовлення скопійовано'); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, function () {}); return; }
    } catch (e) { /* ignore */ }
    var ta = $('#order-text'); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
  }

  var toastTimer;
  function toast(text, undo) {
    var t = $('#toast'), u = $('#toast-undo');
    $('#toast-text').textContent = text;
    u.hidden = !undo;
    u.onclick = undo ? function () { undo(); t.classList.remove('is-on'); } : null;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, undo ? 5000 : 2600);
  }

  /* ---------- Мобільне меню й липка панель ---------- */
  function bindNav() {
    var btn = $('#menu-btn'), nav = $('#nav');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { btn.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
    var bar = $('#sticky-buy'), sec = $('#constructor');
    if ('IntersectionObserver' in window && bar && sec) {
      new IntersectionObserver(function (en) { bar.classList.toggle('is-on', en[0].isIntersecting); }, { threshold: 0.05 }).observe(sec);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    $$('[data-days]').forEach(function (el) { el.textContent = CONFIG.productionDays; });
    $$('[data-tg]').forEach(function (el) { el.href = 'https://t.me/' + CONFIG.telegram; });
    heroLoop();
    bindHouses();
    renderPresets();
    bindBuilder();
    syncForm();
    bindCart();
    renderCart();
    bindNav();
    var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  });
})();
