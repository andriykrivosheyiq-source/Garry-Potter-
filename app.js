/* На подарунок — конструктор, готові ідеї, кошик, оформлення. Без залежностей.
   Вироби й кольори — у garments.js (збирається tools/build-garments.py з мокапів Loomiq). */
(function () {
  'use strict';

  /* ---------- Налаштування магазину (заповнити) ---------- */
  var CONFIG = {
    telegram: 'your_manager',          // [username менеджера в Telegram, без @]
    productionDays: '3–5',             // [термін виготовлення, робочих днів]
    currency: '₴',
    base: 540                          // база за 1–2 шт, як у конструкторі Loomiq
  };

  var G = window.GARMENTS || {};

  /* ---------- Вироби ----------
     Розташування дизайну задано відносно меж виробу на фото (fx, fy — центр, fw — ширина, у частках),
     тому однаково працює для фото різного розміру й кадрування. */
  var APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  var PRODUCTS = {
    teeover: { surcharge: 0, sizes: APPAREL_SIZES, places: {
      chest: { fx: 0.64, fy: 0.22, fw: 0.13 }, center: { fx: 0.47, fy: 0.31, fw: 0.36 },
      back: { view: 'back', fx: 0.47, fy: 0.32, fw: 0.38 }, sleeve: { fx: 0.12, fy: 0.33, fw: 0.08, rot: -22 } } },
    tee: { surcharge: 0, sizes: APPAREL_SIZES, places: {
      chest: { fx: 0.64, fy: 0.21, fw: 0.13 }, center: { fx: 0.5, fy: 0.30, fw: 0.36 },
      back: { view: 'back', fx: 0.5, fy: 0.31, fw: 0.38 }, sleeve: { fx: 0.11, fy: 0.25, fw: 0.08, rot: -28 } } },
    hoodieover: { surcharge: 250, sizes: APPAREL_SIZES, places: {
      chest: { fx: 0.62, fy: 0.34, fw: 0.12 }, center: { fx: 0.5, fy: 0.37, fw: 0.24 },
      back: { view: 'back', fx: 0.5, fy: 0.44, fw: 0.36 }, sleeve: { fx: 0.09, fy: 0.56, fw: 0.07, rot: -5 } } },
    hoodieoverfleece: { surcharge: 300, sizes: APPAREL_SIZES, places: {
      chest: { fx: 0.62, fy: 0.33, fw: 0.12 }, center: { fx: 0.5, fy: 0.36, fw: 0.24 },
      back: { view: 'back', fx: 0.5, fy: 0.44, fw: 0.36 }, sleeve: { fx: 0.07, fy: 0.56, fw: 0.07, rot: -4 } } },
    hoodie: { surcharge: 250, sizes: APPAREL_SIZES, places: {
      chest: { fx: 0.62, fy: 0.33, fw: 0.12 }, center: { fx: 0.5, fy: 0.38, fw: 0.25 },
      back: { view: 'back', fx: 0.5, fy: 0.44, fw: 0.36 }, sleeve: { fx: 0.08, fy: 0.56, fw: 0.07, rot: -3 } } },
    hoodiezip: { surcharge: 300, sizes: APPAREL_SIZES, places: {
      chest: { fx: 0.68, fy: 0.33, fw: 0.11 }, sleeve: { fx: 0.08, fy: 0.56, fw: 0.07, rot: -3 } } },
    sweat: { surcharge: 200, sizes: APPAREL_SIZES, places: {
      chest: { fx: 0.63, fy: 0.21, fw: 0.12 }, center: { fx: 0.5, fy: 0.30, fw: 0.32 },
      back: { view: 'back', fx: 0.5, fy: 0.30, fw: 0.36 }, sleeve: { fx: 0.075, fy: 0.42, fw: 0.07, rot: -3 } } },
    cap: { surcharge: 90, sizes: null, places: {
      capfront: { fx: 0.5, fy: 0.37, fw: 0.30 }, capside: { view: 'left', fx: 0.56, fy: 0.52, fw: 0.18, rot: -8 } } },
    tote: { surcharge: 90, sizes: null, places: {
      tote: { fx: 0.5, fy: 0.72, fw: 0.48 } } }
  };
  var PRODUCT_ORDER = ['teeover', 'tee', 'hoodieover', 'hoodieoverfleece', 'hoodie', 'hoodiezip', 'sweat', 'cap', 'tote'];

  var PLACES = { chest: 'Груди ліворуч', center: 'Груди по центру', back: 'Спина', sleeve: 'Рукав', capfront: 'Спереду', capside: 'Збоку', tote: 'По центру' };
  var BIG = { center: 1, back: 2 };
  var TECH = { embroidery: 'Вишивка', print: 'Принт' };
  var TYPES = { text: 'Напис', initials: 'Ініціали', emblem: 'Емблема', hogwarts: 'Герб Гоґвортсу' };

  var FONTS = {
    classic: { name: 'Класичний', css: "'Cormorant Garamond', Georgia, serif", weight: 700, k: 0.5 },
    modern: { name: 'Сучасний', css: "'Montserrat', 'Helvetica Neue', Arial, sans-serif", weight: 600, k: 0.6 },
    script: { name: 'Рукописний', css: "'Marck Script', cursive", weight: 400, k: 0.48 },
    simple: { name: 'Книжковий', css: "'Lora', Georgia, serif", weight: 600, k: 0.55 }
  };
  var INITIAL_STYLES = { plain: 'Просто літери', circle: 'У колі', line: 'З лінією' };

  var THREADS = {
    white: { name: 'Білий', hex: '#F5F3EC' },
    black: { name: 'Чорний', hex: '#1C1A1F' },
    gold: { name: 'Золото', hex: '#D3A625' },
    silver: { name: 'Срібло', hex: '#C4C4C4' },
    bordo: { name: 'Бордо', hex: '#8E1B2B' },
    green: { name: 'Зелений', hex: '#2A6B45' },
    navy: { name: 'Темно-синій', hex: '#24345F' },
    powder: { name: 'Пудровий', hex: '#E5B7B5' }
  };

  var MOTIFS = {
    snowflake: 'Сніжинка', tree: 'Ялинка', heart: 'Серце', star: 'Зірка', garland: 'Гірлянда',
    coffee: 'Кава', note: 'Нота', sneaker: 'Кросівок', mountains: 'Гори', sun: 'Сонце'
  };

  var OCCASIONS = { love: 'Коханим', colleagues: 'Колегам', newyear: 'На Новий рік', xmas: 'На Різдво', hobby: 'Фанатам і хобі' };

  var IDEAS = [
    { o: 'love', title: 'Ініціали двох', desc: 'Дві літери через плюс маленькою вишивкою зліва на грудях.', s: { product: 'tee', color: 'white', tech: 'embroidery', place: 'chest', type: 'initials', initials: 'А + М', istyle: 'plain', thread: 'black' } },
    { o: 'love', title: 'Рік, коли все почалось', desc: 'Рік знайомства дрібним шрифтом над серцем.', s: { product: 'hoodieover', color: 'gray', tech: 'embroidery', place: 'chest', type: 'text', text: 'est. 2019', font: 'classic', thread: 'black' } },
    { o: 'love', title: 'Координати зустрічі', desc: 'Два рядки координат місця, де ви познайомились.', s: { product: 'sweat', color: 'graphite', tech: 'embroidery', place: 'chest', type: 'text', text: '50.4501° N\n30.5234° E', font: 'modern', thread: 'white' } },
    { o: 'love', title: 'Серце на кепці', desc: 'Одне маленьке серце збоку кепки, без тексту.', s: { product: 'cap', color: 'black', tech: 'embroidery', place: 'capside', type: 'emblem', motif: 'heart', caption: '', thread: 'white' } },
    { o: 'colleagues', title: 'Ваше місто', desc: 'Назва міста рядковими літерами по центру шопера.', s: { product: 'tote', color: 'beige', tech: 'print', place: 'tote', type: 'text', text: 'київ', font: 'modern', thread: 'black' } },
    { o: 'colleagues', title: 'Кава об одинадцятій', desc: 'Маленька чашка й час спільної перерви.', s: { product: 'tee', color: 'white', tech: 'embroidery', place: 'chest', type: 'emblem', motif: 'coffee', caption: '11:00', thread: 'black' } },
    { o: 'colleagues', title: 'Монограма на шопері', desc: 'Одна літера в колі — шопер, який не сплутаєш з іншим.', s: { product: 'tote', color: 'black', tech: 'print', place: 'tote', type: 'initials', initials: 'О', istyle: 'circle', thread: 'white' } },
    { o: 'colleagues', title: 'Ініціали на кепці', desc: 'Дві літери з крапками збоку кепки.', s: { product: 'cap', color: 'beige', tech: 'embroidery', place: 'capside', type: 'initials', initials: 'О.К.', istyle: 'plain', thread: 'navy' } },
    { o: 'newyear', title: 'Рік на рукаві', desc: 'Новий рік цифрами на рукаві.', s: { product: 'sweat', color: 'darkgreen', tech: 'embroidery', place: 'sleeve', type: 'text', text: '2027', font: 'modern', thread: 'white' } },
    { o: 'newyear', title: 'Одна сніжинка', desc: 'Невелика сніжинка на грудях, без тексту.', s: { product: 'hoodieoverfleece', color: 'blue', tech: 'embroidery', place: 'chest', type: 'emblem', motif: 'snowflake', caption: '', thread: 'white' } },
    { o: 'newyear', title: 'Набір для родини', desc: 'Однакова монограма родини на худі для кожного.', s: { product: 'hoodie', color: 'vanilla', tech: 'embroidery', place: 'chest', type: 'initials', initials: 'К', istyle: 'circle', thread: 'bordo' } },
    { o: 'newyear', title: 'Зимова кепка', desc: 'Короткий напис із сезоном спереду.', s: { product: 'cap', color: 'black', tech: 'embroidery', place: 'capfront', type: 'text', text: 'зима 26/27', font: 'modern', thread: 'white' } },
    { o: 'xmas', title: 'Ялинка й дата', desc: 'Маленька ялинка, під нею дата свята.', s: { product: 'sweat', color: 'bordo', tech: 'embroidery', place: 'chest', type: 'emblem', motif: 'tree', caption: '25.12', thread: 'gold' } },
    { o: 'xmas', title: 'Зірка на рукаві', desc: 'Одна золота зірка на рукаві.', s: { product: 'hoodiezip', color: 'navy', tech: 'embroidery', place: 'sleeve', type: 'emblem', motif: 'star', caption: '', thread: 'gold' } },
    { o: 'xmas', title: 'Вдома', desc: 'Тонка гірлянда й одне слово під нею.', s: { product: 'tote', color: 'beige', tech: 'print', place: 'tote', type: 'emblem', motif: 'garland', caption: 'вдома', thread: 'black' } },
    { o: 'hobby', title: 'Гоґвортс з ініціалами', desc: 'Герб Гоґвортсу на грудях, під ним ініціали.', s: { product: 'hoodieover', color: 'black', tech: 'embroidery', place: 'chest', type: 'hogwarts', caption: 'А.М.', thread: 'gold' } },
    { o: 'hobby', title: 'Гоґвортс на спині', desc: 'Великий герб Гоґвортсу на спині, спереду чисто.', s: { product: 'teeover', color: 'slate', tech: 'print', place: 'back', type: 'hogwarts', caption: '', thread: 'gold' } },
    { o: 'hobby', title: 'Гори', desc: 'Невеликі гори й назва хребта на грудях — для тих, хто ходить у походи.', s: { product: 'sweat', color: 'khaki', tech: 'embroidery', place: 'chest', type: 'emblem', motif: 'mountains', caption: 'Карпати', thread: 'white' } },
    { o: 'hobby', title: 'Дистанція', desc: 'Кросівок і довжина марафону збоку кепки.', s: { product: 'cap', color: 'cream', tech: 'embroidery', place: 'capside', type: 'emblem', motif: 'sneaker', caption: '42.195', thread: 'black' } },
    { o: 'hobby', title: 'Сторона B', desc: 'Маленька нота і два слова на грудях.', s: { product: 'teeover', color: 'black', tech: 'embroidery', place: 'chest', type: 'emblem', motif: 'note', caption: 'side B', thread: 'white' } }
  ];

  var DEFAULT = { product: 'hoodieover', color: 'black', tech: 'embroidery', place: 'chest', type: 'initials', initials: 'А + М', istyle: 'plain',
    text: 'est. 2019', font: 'classic', motif: 'heart', caption: '', thread: 'white', size: 'M' };

  /* ---------- Утиліти ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return n.toLocaleString('uk-UA') + ' ' + CONFIG.currency; }
  function assign(a) { for (var i = 1; i < arguments.length; i++) { var b = arguments[i]; if (b) for (var k in b) a[k] = b[k]; } return a; }
  function reduceMotion() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
  var uid = 0;

  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }

  function colorOf(product, id) {
    var cs = (G[product] || {}).colors || [];
    for (var i = 0; i < cs.length; i++) if (cs[i].id === id) return cs[i];
    return cs[0];
  }
  function productName(p) { return (G[p] || {}).name || p; }
  function firstPlace(p) { return Object.keys(PRODUCTS[p].places)[0]; }

  function techCost(s) {
    var big = BIG[s.place] || 0;
    if (s.tech === 'embroidery') return [120, 220, 350][big];
    return [0, 100, 150][big];
  }
  function priceOf(s) { return CONFIG.base + PRODUCTS[s.product].surcharge + techCost(s); }

  function lum(hex) {
    var c = [1, 3, 5].map(function (i) { var v = parseInt(hex.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

  /* ---------- Рендер дизайну у SVG ---------- */
  function defs(id, hex, tech) {
    if (tech !== 'embroidery') return '';
    // Гладь: діагональні «стібки» + легка тінь над тканиною.
    return '<defs>' +
      '<pattern id="st' + id + '" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">' +
      '<rect width="3" height="3" fill="' + hex + '"/>' +
      '<rect width="1.2" height="3" fill="#fff" opacity=".25"/>' +
      '<rect x="2.2" width=".6" height="3" fill="#000" opacity=".22"/></pattern>' +
      '<filter id="sh' + id + '" x="-10%" y="-10%" width="120%" height="130%">' +
      '<feDropShadow dx="0" dy="1" stdDeviation=".8" flood-color="#000" flood-opacity=".45"/></filter></defs>';
  }
  function paint(id, hex, tech) { return tech === 'embroidery' ? 'url(#st' + id + ')' : hex; }
  function fx(id, tech) { return tech === 'embroidery' ? ' filter="url(#sh' + id + ')"' : ''; }

  function textBlock(lines, font, width) {
    var longest = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    var fs = Math.min(64, width / Math.max(1, longest * font.k));
    var lh = fs * 1.18;
    var out = '';
    lines.forEach(function (l, i) { out += '<text x="' + (width / 2) + '" y="' + (fs * 0.92 + i * lh).toFixed(1) + '">' + esc(l) + '</text>'; });
    return { svg: out, height: Math.ceil(lh * (lines.length - 1) + fs * 1.15), fs: fs };
  }

  function textSVG(s, id) {
    var t = THREADS[s.thread] || THREADS.white;
    var f = FONTS[s.font] || FONTS.classic;
    var lines = String(s.text || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).slice(0, 3);
    if (!lines.length) lines = ['Ваш напис'];
    var b = textBlock(lines, f, 300);
    return '<svg viewBox="0 0 300 ' + b.height + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Напис: ' + esc(lines.join(' ')) + '">' + defs(id, t.hex, s.tech) +
      '<g' + fx(id, s.tech) + ' font-family="' + f.css.replace(/"/g, "'") + '" font-weight="' + f.weight + '" font-size="' + b.fs.toFixed(1) + '" text-anchor="middle" fill="' + paint(id, t.hex, s.tech) + '">' + b.svg + '</g></svg>';
  }

  function initialsSVG(s, id) {
    var t = THREADS[s.thread] || THREADS.white;
    var txt = String(s.initials || '').trim().slice(0, 7) || 'А';
    var c = paint(id, t.hex, s.tech);
    var serif = "'Cormorant Garamond', Georgia, serif";
    if (s.istyle === 'circle') {
      var fsC = Math.min(92, 118 / Math.max(1, txt.length * 0.62));
      return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Монограма ' + esc(txt) + '">' + defs(id, t.hex, s.tech) +
        '<g' + fx(id, s.tech) + '><circle cx="100" cy="100" r="88" fill="none" stroke="' + c + '" stroke-width="7"/><circle cx="100" cy="100" r="76" fill="none" stroke="' + c + '" stroke-width="2.5"/>' +
        '<text x="100" y="' + (100 + fsC * 0.33).toFixed(1) + '" text-anchor="middle" font-family="' + serif + '" font-weight="700" font-size="' + fsC.toFixed(1) + '" fill="' + c + '">' + esc(txt) + '</text></g></svg>';
    }
    var fs = Math.min(110, 300 / Math.max(1, txt.length * 0.62));
    var H = Math.ceil(fs * 1.05) + (s.istyle === 'line' ? 22 : 0);
    return '<svg viewBox="0 0 300 ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ініціали ' + esc(txt) + '">' + defs(id, t.hex, s.tech) +
      '<g' + fx(id, s.tech) + ' fill="' + c + '"><text x="150" y="' + (fs * 0.86).toFixed(1) + '" text-anchor="middle" font-family="' + serif + '" font-weight="700" font-size="' + fs.toFixed(1) + '" letter-spacing="2">' + esc(txt) + '</text>' +
      (s.istyle === 'line' ? '<rect x="95" y="' + (H - 10) + '" width="110" height="4" rx="2"/>' : '') + '</g></svg>';
  }

  // Межі мотиву по вертикалі — щоб підпис стояв одразу під ним.
  var MOTIF_BOX = { snowflake: [16, 184], tree: [10, 190], heart: [34, 172], star: [14, 180], garland: [40, 126], coffee: [22, 174], note: [16, 174], sneaker: [74, 144], mountains: [34, 164], sun: [16, 184] };
  function motifPaths(m, c) {
    var st = ' fill="none" stroke="' + c + '" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"';
    switch (m) {
      case 'snowflake': return '<path d="M100 20V180M30.7 60L169.3 140M30.7 140L169.3 60M100 46l-14-14M100 46l14-14M100 154l-14 14M100 154l14 14M53.5 73l-19 5M53.5 73l-5-19M146.5 127l19-5M146.5 127l5 19M53.5 127l-5 19M53.5 127l-19-5M146.5 73l5-19M146.5 73l19 5"' + st + '/>';
      case 'tree': return '<path d="M100 18L60 78H82L48 126H74L36 172H164L126 126H152L118 78H140Z"' + st + '/><path d="M100 172V186"' + st + '/>';
      case 'heart': return '<path d="M100 168C46 128 26 100 34 72C42 44 80 38 100 66C120 38 158 44 166 72C174 100 154 128 100 168Z"' + st + '/>';
      case 'star': return '<path d="M100 18L122 76L184 78L135 116L152 176L100 141L48 176L65 116L16 78L78 76Z"' + st + '/>';
      case 'garland': return '<path d="M14 46Q100 116 186 46"' + st + '/><g fill="' + c + '"><ellipse cx="44" cy="90" rx="9" ry="13"/><ellipse cx="78" cy="106" rx="9" ry="13"/><ellipse cx="122" cy="106" rx="9" ry="13"/><ellipse cx="156" cy="90" rx="9" ry="13"/></g>';
      case 'coffee': return '<path d="M40 80H140V122C140 150 118 170 90 170C62 170 40 150 40 122Z"' + st + '/><path d="M140 94H152C166 94 172 104 172 114C172 126 162 134 148 134H138"' + st + '/><path d="M70 30Q60 44 70 58M96 28Q86 42 96 56M122 30Q112 44 122 58"' + st + '/>';
      case 'note': return '<path d="M84 150V34L154 20V132"' + st + '/><ellipse cx="62" cy="152" rx="24" ry="18"' + st + '/><ellipse cx="132" cy="134" rx="24" ry="18"' + st + '/>';
      case 'sneaker': return '<path d="M20 140V96L56 78L72 92C90 104 112 108 132 108L172 114C182 116 186 124 184 140Z"' + st + '/><path d="M20 128H184M60 92L48 104M76 98L66 110M92 104L84 116"' + st + '/>';
      case 'mountains': return '<path d="M14 160L72 70L104 116L130 82L186 160Z"' + st + '/><circle cx="150" cy="54" r="16"' + st + '/>';
      case 'sun': return '<circle cx="100" cy="100" r="38"' + st + '/><path d="M100 20V40M100 160V180M20 100H40M160 100H180M43.4 43.4L57.6 57.6M142.4 142.4L156.6 156.6M43.4 156.6L57.6 142.4M142.4 57.6L156.6 43.4"' + st + '/>';
      default: return '';
    }
  }

  function captionText(cap, y, fill) {
    return '<text x="100" y="' + y + '" text-anchor="middle" font-family="\'Montserrat\', \'Helvetica Neue\', Arial, sans-serif" font-weight="600" font-size="' + Math.min(30, 300 / Math.max(1, cap.length)).toFixed(1) + '" letter-spacing="1" fill="' + fill + '">' + esc(cap) + '</text>';
  }

  function emblemSVG(s, id) {
    var t = THREADS[s.thread] || THREADS.white;
    var cap = (s.caption || '').trim().slice(0, 20);
    var box = MOTIF_BOX[s.motif] || [0, 200];
    var top = box[0] - 6, capY = box[1] + 34;
    var H = (cap ? capY + 10 : box[1] + 6) - top;
    var c = paint(id, t.hex, s.tech);
    return '<svg viewBox="0 ' + top + ' 200 ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(MOTIFS[s.motif] || 'Емблема') + '">' + defs(id, t.hex, s.tech) +
      '<g' + fx(id, s.tech) + '>' + motifPaths(s.motif, c) + (cap ? captionText(cap, capY, c) : '') + '</g></svg>';
  }

  function hogwartsSVG(s, id) {
    var t = THREADS[s.thread] || THREADS.gold;
    var cap = (s.caption || '').trim().slice(0, 20);
    var H = cap ? 280 : 234;
    var c = paint(id, t.hex, s.tech);
    return '<svg viewBox="0 0 200 ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Герб Гоґвортсу' + (cap ? ', ' + esc(cap) : '') + '">' + defs(id, t.hex, s.tech) +
      '<image href="images/crest/hogwarts.webp" x="0" y="0" width="200" height="234"' + (s.tech === 'embroidery' ? ' filter="url(#sh' + id + ')"' : '') + '/>' +
      (cap ? '<g' + fx(id, s.tech) + '>' + captionText(cap, 270, c) + '</g>' : '') + '</svg>';
  }

  function designSVG(s) {
    var id = 'd' + (++uid);
    if (s.type === 'text') return textSVG(s, id);
    if (s.type === 'emblem') return emblemSVG(s, id);
    if (s.type === 'hogwarts') return hogwartsSVG(s, id);
    return initialsSVG(s, id);
  }

  function placeOf(s) { return PRODUCTS[s.product].places[s.place] || PRODUCTS[s.product].places[firstPlace(s.product)]; }
  function viewOf(s) { return placeOf(s).view || 'front'; }
  function viewsOf(p) { var c = (G[p] || {}).colors; return c && c[0] ? Object.keys(c[0].shots) : ['front']; }

  /* Вставляє виріб + дизайн у контейнер .garment */
  function renderGarment(el, s, opts) {
    opts = opts || {};
    var col = colorOf(s.product, s.color);
    if (!col || !el) return;
    var view = opts.view || viewOf(s);
    var shot = col.shots[view] || col.shots.front;
    var pl = placeOf(s);
    var showDesign = (pl.view || 'front') === view;
    var alt = productName(s.product) + ', ' + col.name.toLowerCase() + (view === 'back' ? ', вигляд ззаду' : view === 'left' ? ', вигляд збоку' : '');
    // Кадр: квадрат, у якому виріб (його межі на фото) займає однакову частку —
    // тож різні кольори й моделі одного виробу не «стрибають» за розміром.
    var ratio = shot[0] / shot[1], fill = opts.fill || 0.86;
    var H = fill / Math.max(shot[4] / 100 * ratio, shot[5] / 100), W = H * ratio;
    var left = 0.5 - (shot[2] + shot[4] / 2) / 100 * W, top = 0.5 - (shot[3] + shot[5] / 2) / 100 * H;
    var html = '<div class="garment__frame" style="left:' + (left * 100).toFixed(2) + '%;top:' + (top * 100).toFixed(2) + '%;width:' + (W * 100).toFixed(2) + '%;height:' + (H * 100).toFixed(2) + '%">' +
      '<img src="images/g/' + s.product + '-' + col.id + '-' + view + '.webp" alt="' + esc(alt) + '" width="' + shot[0] + '" height="' + shot[1] + '"' + (opts.lazy ? ' loading="lazy"' : '') + ' decoding="async">';
    if (showDesign && !opts.noDesign) {
      html += '<div class="garment__design garment__design--' + s.tech + '" style="left:' + (shot[2] + pl.fx * shot[4]).toFixed(2) + '%;top:' + (shot[3] + pl.fy * shot[5]).toFixed(2) + '%;width:' + (pl.fw * shot[4]).toFixed(2) + '%;' +
        (pl.rot ? 'transform:translate(-50%,-50%) rotate(' + pl.rot + 'deg)' : '') + '">' + designSVG(s) + '</div>';
    }
    html += '</div>';
    // Вставка з дизайном крупним планом — для малих місць нанесення, де на мініатюрі його не видно.
    if (opts.closeup && showDesign && !opts.noDesign && !BIG[s.place] && s.place !== 'tote' && s.place !== 'capfront' && pl.fw * shot[4] / 100 * W < 0.25) {
      html += '<div class="garment__closeup" style="background:' + col.hex + '" aria-hidden="true">' + designSVG(s) + '</div>';
    }
    el.innerHTML = html;
  }

  /* ---------- Стан конструктора ---------- */
  var state = assign({}, DEFAULT);
  var previewView = 'front';

  function whatOf(s) {
    if (s.type === 'text') return 'напис «' + String(s.text || '').replace(/\n/g, ' / ') + '», шрифт ' + FONTS[s.font].name.toLowerCase();
    if (s.type === 'initials') return 'ініціали «' + (s.initials || '') + '», ' + INITIAL_STYLES[s.istyle].toLowerCase();
    if (s.type === 'hogwarts') return 'герб Гоґвортсу (повноколірний)' + (s.caption ? ', підпис «' + s.caption + '»' : '');
    return 'емблема «' + MOTIFS[s.motif] + '»' + (s.caption ? ', підпис «' + s.caption + '»' : '');
  }
  function describe(s) {
    var col = (s.type === 'hogwarts' && !(s.caption || '').trim()) ? '' : '; колір ' + (s.type === 'hogwarts' ? 'підпису' : '') + ' — ' + THREADS[s.thread].name.toLowerCase();
    return TECH[s.tech] + ': ' + whatOf(s) + col.replace('колір  —', 'колір —') + '; ' + PLACES[s.place].toLowerCase();
  }
  function sizeLabel(s) { return PRODUCTS[s.product].sizes ? s.size : 'універсальний'; }

  function swatches(container, items, name, label) {
    container.innerHTML = items.map(function (it) {
      return '<label class="swatch" title="' + esc(it.name) + '"><input type="radio" name="' + name + '" value="' + it.id + '"><span style="--c:' + it.hex + '" aria-hidden="true"></span><span class="sr-only">' + esc(label + it.name) + '</span></label>';
    }).join('');
  }
  function chips(container, items, name) {
    container.innerHTML = Object.keys(items).map(function (k) {
      return '<label class="chip"><input type="radio" name="' + name + '" value="' + k + '"><span>' + esc(items[k]) + '</span></label>';
    }).join('');
  }
  function setChecked(name, value) {
    $$('#builder input[name="' + name + '"]').forEach(function (i) { i.checked = i.value === value; });
  }

  var renderedProduct = null;
  function syncForm() {
    var form = $('#builder');
    if (!form) return;
    var P = PRODUCTS[state.product];
    state.color = colorOf(state.product, state.color).id;
    if (!P.places[state.place]) state.place = firstPlace(state.product);
    if (APPAREL_SIZES.indexOf(state.size) < 0) state.size = 'M';

    if (!renderedProduct) {
      var names = {}; PRODUCT_ORDER.forEach(function (p) { names[p] = productName(p); });
      chips($('#f-product'), names, 'product');
      chips($('#f-tech'), TECH, 'tech');
      chips($('#f-type'), TYPES, 'type');
      chips($('#f-size'), APPAREL_SIZES.reduce(function (o, s) { o[s] = s; return o; }, {}), 'size');
      chips($('#f-font'), Object.keys(FONTS).reduce(function (o, k) { o[k] = FONTS[k].name; return o; }, {}), 'font');
      chips($('#f-istyle'), INITIAL_STYLES, 'istyle');
      chips($('#f-motif'), MOTIFS, 'motif');
      swatches($('#f-thread'), Object.keys(THREADS).map(function (k) { return { id: k, name: THREADS[k].name, hex: THREADS[k].hex }; }), 'thread', 'Колір нанесення: ');
    }
    if (renderedProduct !== state.product) {
      swatches($('#f-color'), G[state.product].colors, 'color', 'Колір виробу: ');
      var pl = {}; Object.keys(P.places).forEach(function (k) { pl[k] = PLACES[k]; });
      chips($('#f-place'), pl, 'place');
      renderedProduct = state.product;
    }
    ['product', 'tech', 'type', 'place', 'size', 'font', 'istyle', 'motif', 'thread', 'color'].forEach(function (n) { setChecked(n, state[n]); });

    $('#size-field').hidden = !P.sizes;
    $('#f-initials').value = state.initials || '';
    $('#f-text').value = state.text || '';
    $('#f-caption').value = state.caption || '';
    $('#thread-label').textContent = state.type === 'hogwarts' ? 'Колір підпису' : state.tech === 'embroidery' ? 'Колір нитки' : 'Колір принта';
    $('#color-name').textContent = colorOf(state.product, state.color).name;
    $('#thread-name').textContent = THREADS[state.thread].name;
    $$('[data-for-type]').forEach(function (el) { el.hidden = el.getAttribute('data-for-type').split(' ').indexOf(state.type) < 0; });
    $('#caption-label').textContent = state.type === 'hogwarts' ? 'Підпис під гербом (необовʼязково)' : 'Підпис під емблемою (необовʼязково)';
    update();
  }

  function personalizationError(s) {
    if (s.type === 'initials' && !(s.initials || '').trim()) return { field: 'f-initials', box: 'initials-error', msg: 'Впишіть ініціали — хоча б одну літеру.' };
    if (s.type === 'text' && !String(s.text || '').trim()) return { field: 'f-text', box: 'text-error', msg: 'Впишіть текст напису.' };
    return null;
  }

  var lastPlaceKey = '';
  function update() {
    var key = state.product + '|' + state.place;
    if (key !== lastPlaceKey) { previewView = viewOf(state); lastPlaceKey = key; }
    if (viewsOf(state.product).indexOf(previewView) < 0) previewView = viewOf(state);
    renderGarment($('#preview'), state, { view: previewView });
    renderSides();
    var price = money(priceOf(state));
    $('#price').textContent = price;
    $('#price-sticky').textContent = price;
    $('#summary').textContent = productName(state.product) + ' · ' + colorOf(state.product, state.color).name.toLowerCase() + ' · ' + describe(state);
    if (!personalizationError(state)) {
      $$('#initials-error, #text-error, #personal-error').forEach(function (x) { x.hidden = true; });
      $$('#f-initials, #f-text').forEach(function (x) { x.removeAttribute('aria-invalid'); });
    }
    var small = !BIG[state.place];
    var longest = Math.max.apply(null, String(state.text || '').split('\n').map(function (l) { return l.trim().length; }));
    $('#text-long').hidden = !(state.type === 'text' && longest > (small ? 14 : 22));
    $('#text-long').textContent = small
      ? 'Для малих місць радимо до 14 символів у рядку — інакше літери будуть дрібні. Розбийте текст на рядки або оберіть «Груди по центру» чи «Спина».'
      : 'Довгий рядок вийде дрібним — радимо до 22 символів у рядку. Розбийте текст на 2–3 рядки.';
    var garmentHex = colorOf(state.product, state.color).hex;
    $('#thread-warn').hidden = (state.type === 'hogwarts' && !(state.caption || '').trim()) || contrast(garmentHex, THREADS[state.thread].hex) >= 3;
    var p3 = $('#preview-step3');
    if (p3 && getComputedStyle(p3).display !== 'none') renderGarment(p3, state, { view: viewOf(state), closeup: true });
    var mini = $('#sticky-preview');
    if (mini) { mini.style.background = garmentHex; mini.innerHTML = designSVG(state); }
  }

  function renderSides() {
    var box = $('#preview-sides');
    var views = viewsOf(state.product);
    var labels = { front: 'Спереду', back: 'Ззаду', left: 'Збоку' };
    box.hidden = views.length < 2;
    box.innerHTML = views.map(function (v) {
      return '<button type="button" class="seg" data-view="' + v + '" aria-pressed="' + (v === previewView) + '">' + labels[v] + '</button>';
    }).join('');
  }

  function setState(patch, scroll) {
    assign(state, patch);
    syncForm();
    if (scroll) {
      var el = $('#constructor');
      if (el) el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
      var h = $('#constructor-h');
      if (h) h.focus({ preventScroll: true });
    }
  }

  // Нитка, що зливається з виробом, — підбираємо контрастну.
  function autoThread(product, color, thread) {
    var hex = colorOf(product, color).hex;
    if (contrast(hex, THREADS[thread].hex) >= 3) return thread;
    return lum(hex) > 0.3 ? 'black' : 'white';
  }

  function bindBuilder() {
    var form = $('#builder');
    if (!form) return;
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t.type !== 'radio') return;
      var patch = {}; patch[t.name] = t.value;
      if (t.name === 'product') {
        // той самий колір, якщо він є в новому виробі; інакше перший
        var cur = colorOf(state.product, state.color);
        var match = G[t.value].colors.filter(function (c) { return c.name === cur.name || c.id === cur.id; })[0];
        patch.color = (match || G[t.value].colors[0]).id;
        if (!PRODUCTS[t.value].places[state.place]) patch.place = firstPlace(t.value);
        patch.thread = autoThread(t.value, patch.color, state.thread);
      }
      if (t.name === 'color') patch.thread = autoThread(state.product, t.value, state.thread);
      if (t.name === 'type' && t.value === 'hogwarts') patch.thread = autoThread(state.product, state.color, 'gold');
      setState(patch);
    });
    form.addEventListener('input', function (e) {
      var t = e.target;
      if (t.id === 'f-initials') { t.value = t.value.replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ.+& ]/g, '').slice(0, 7); state.initials = t.value; }
      else if (t.id === 'f-text') { state.text = t.value; }
      else if (t.id === 'f-caption') { state.caption = t.value; }
      else return;
      update();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = personalizationError(state);
      if (err) {
        var box = $('#' + err.box);
        box.textContent = err.msg; box.hidden = false;
        var pm = $('#personal-error');
        pm.textContent = 'Заповніть персоналізацію: ' + err.msg.charAt(0).toLowerCase() + err.msg.slice(1); pm.hidden = false;
        var f = $('#' + err.field);
        f.setAttribute('aria-invalid', 'true');
        f.scrollIntoView({ block: 'center' });
        f.focus({ preventScroll: true });
        return;
      }
      addToCart(assign({}, state));
    });
    $('#preview-sides').addEventListener('click', function (e) {
      var b = e.target.closest('[data-view]');
      if (!b) return;
      previewView = b.getAttribute('data-view');
      renderGarment($('#preview'), state, { view: previewView });
      $$('#preview-sides [data-view]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
    var sp = $('#sticky-preview');
    if (sp) sp.closest('button').addEventListener('click', function () { $('#constructor').scrollIntoView({ block: 'start' }); });
    $('#add-sticky').addEventListener('click', function () { form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true })); });
  }

  /* ---------- Приводи й готові ідеї ---------- */
  var ideaFilter = 'all', ideasExpanded = false, IDEAS_PREVIEW = 8;
  function renderIdeas() {
    var grid = $('#ideas-grid');
    if (!grid) return;
    var list = IDEAS.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) { return ideaFilter === 'all' || o.x.o === ideaFilter; });
    var more = $('#ideas-more');
    var cut = ideaFilter === 'all' && !ideasExpanded && list.length > IDEAS_PREVIEW;
    if (more) { more.hidden = !cut; more.textContent = 'Показати всі ' + list.length + ' ідей'; }
    if (cut) list = list.slice(0, IDEAS_PREVIEW);
    grid.innerHTML = list.map(function (o) {
      var s = assign({}, DEFAULT, o.x.s);
      return '<article class="design-card"><div class="design-card__media"><div class="garment garment--card" data-idea-preview="' + o.i + '"></div></div>' +
        '<div class="design-card__body"><p class="design-card__tag">' + esc(OCCASIONS[o.x.o]) + '</p><h3>' + esc(o.x.title) + '</h3><p>' + esc(o.x.desc) + '</p>' +
        '<p class="design-card__meta">' + esc(productName(s.product)) + ' · ' + esc(TECH[s.tech].toLowerCase()) + '</p>' +
        '<div class="design-card__foot"><span class="design-card__price">' + money(priceOf(s)) + '</span>' +
        '<button type="button" class="btn btn--ghost btn--sm" data-idea="' + o.i + '">Персоналізувати</button></div></div></article>';
    }).join('');
    list.forEach(function (o) {
      var s = assign({}, DEFAULT, o.x.s);
      renderGarment(grid.querySelector('[data-idea-preview="' + o.i + '"]'), s, { lazy: true, closeup: true });
    });
    $$('#idea-filter [data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === ideaFilter)); });
  }

  function bindIdeas() {
    var f = $('#idea-filter');
    if (f) {
      f.innerHTML = '<button type="button" class="filter" data-filter="all">Усі</button>' + Object.keys(OCCASIONS).map(function (k) {
        return '<button type="button" class="filter" data-filter="' + k + '">' + esc(OCCASIONS[k]) + '</button>';
      }).join('');
      f.addEventListener('click', function (e) {
        var b = e.target.closest('[data-filter]');
        if (!b) return;
        ideaFilter = b.getAttribute('data-filter');
        renderIdeas();
      });
    }
    var more = $('#ideas-more');
    if (more) more.addEventListener('click', function () {
      ideasExpanded = true;
      renderIdeas();
      var next = $$('#ideas-grid [data-idea]')[IDEAS_PREVIEW];
      if (next) next.focus();
    });
    $('#ideas-grid').addEventListener('click', function (e) {
      var b = e.target.closest('[data-idea]');
      if (!b) return;
      var idea = IDEAS[+b.getAttribute('data-idea')];
      setState(assign({}, DEFAULT, idea.s, { size: state.size }), true);
    });
    $$('[data-occasion]').forEach(function (card) {
      var icon = card.querySelector('.occasion__icon');
      if (icon) icon.innerHTML = '<svg viewBox="0 0 200 200" aria-hidden="true">' + motifPaths(icon.getAttribute('data-motif'), 'currentColor') + '</svg>';
      card.addEventListener('click', function () {
        ideaFilter = card.getAttribute('data-occasion');
        renderIdeas();
        $('#ideas').scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
        $('#ideas-h').focus({ preventScroll: true });
      });
    });
  }

  /* ---------- Каталог ---------- */
  var CATALOG_COLOR = { teeover: 'black', tee: 'white', hoodieover: 'brown', hoodieoverfleece: 'pink', hoodie: 'bordo', hoodiezip: 'navy', sweat: 'graphite', cap: 'black', tote: 'beige' };
  function renderCatalog() {
    var grid = $('#catalog-grid');
    if (!grid) return;
    grid.innerHTML = PRODUCT_ORDER.map(function (p) {
      var n = G[p].colors.length;
      return '<button type="button" class="pcard" data-product="' + p + '">' +
        '<span class="garment garment--card" data-pcard="' + p + '"></span>' +
        '<span class="pcard__body"><span class="pcard__name">' + esc(productName(p)) + '</span>' +
        '<span class="pcard__meta">' + n + ' ' + (n % 10 === 1 && n % 100 !== 11 ? 'колір' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'кольори' : 'кольорів') + '</span>' +
        '<span class="pcard__price">від ' + money(CONFIG.base + PRODUCTS[p].surcharge) + '</span></span></button>';
    }).join('');
    PRODUCT_ORDER.forEach(function (p) {
      renderGarment(grid.querySelector('[data-pcard="' + p + '"]'), assign({}, DEFAULT, { product: p, color: CATALOG_COLOR[p], place: firstPlace(p) }), { lazy: true, noDesign: true });
    });
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-product]');
      if (!b) return;
      var p = b.getAttribute('data-product');
      setState({ product: p, color: CATALOG_COLOR[p], place: firstPlace(p), thread: autoThread(p, CATALOG_COLOR[p], state.thread) }, true);
    });
  }

  /* ---------- Картки приводів: гортання ---------- */
  function bindOcards() {
    var box = $('#ocards'), dots = $('#ocards-dots');
    if (!box) return;
    var cards = $$('.ocard', box);
    if (dots) dots.innerHTML = cards.map(function () { return '<span></span>'; }).join('');
    function step() { return cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : box.clientWidth; }
    function sync() {
      var i = Math.round(box.scrollLeft / step());
      $$('span', dots).forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
    }
    $$('[data-ocards]').forEach(function (b) {
      b.addEventListener('click', function () {
        box.scrollBy({ left: step() * Number(b.getAttribute('data-ocards')), behavior: reduceMotion() ? 'auto' : 'smooth' });
      });
    });
    box.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });
    sync();
  }

  /* ---------- Банер: приклади змінюються ---------- */
  var HERO = [
    { label: 'Вишивка «А + М» на худі оверсайз', s: { product: 'hoodieover', color: 'black', tech: 'embroidery', place: 'center', type: 'initials', initials: 'А + М', istyle: 'plain', thread: 'white' } },
    { label: 'Вишивка «est. 2019» на світшоті', s: { product: 'sweat', color: 'graphite', tech: 'embroidery', place: 'center', type: 'text', text: 'est. 2019', font: 'classic', thread: 'white' } },
    { label: 'Принт «київ» на шопері', s: { product: 'tote', color: 'beige', tech: 'print', place: 'tote', type: 'text', text: 'київ', font: 'modern', thread: 'black' } },
    { label: 'Вишивка «зима 26/27» на кепці', s: { product: 'cap', color: 'black', tech: 'embroidery', place: 'capfront', type: 'text', text: 'зима 26/27', font: 'modern', thread: 'white' } }
  ];
  function heroLoop() {
    var el = $('#hero-garment');
    if (!el) return;
    var i = 0, cap = $('#hero-label');
    HERO.forEach(function (h) { var c = colorOf(h.s.product, h.s.color); var im = new Image(); im.src = 'images/g/' + h.s.product + '-' + c.id + '-front.webp'; });
    function show() {
      var h = HERO[i % HERO.length];
      renderGarment(el, assign({}, DEFAULT, h.s), { view: 'front' });
      if (cap) cap.textContent = h.label;
    }
    show();
    if (reduceMotion()) return;
    var timer = null, paused = false, btn = $('#hero-pause');
    function play() { if (!timer && !paused && !document.hidden) timer = setInterval(function () { i++; show(); }, 3400); }
    function stop() { clearInterval(timer); timer = null; }
    play();
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else play(); });
    if (btn) btn.addEventListener('click', function () {
      paused = !paused;
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? 'Продовжити показ прикладів' : 'Зупинити показ прикладів');
      if (paused) stop(); else play();
    });
  }

  /* ---------- Кошик ---------- */
  var cart = store('np-cart') || [];
  if (!Array.isArray(cart)) cart = [];
  cart = cart.filter(function (i) { return i && PRODUCTS[i.product] && colorOf(i.product, i.color); });

  function saveCart(focus) {
    store('np-cart', cart);
    renderCart();
    if (focus) {
      var el = focus.key && $('#cart-list [data-key="' + focus.key + '"] ' + focus.sel);
      (el || $(focus.fallback || '#cart-close')).focus();
    }
  }

  function addToCart(item) {
    item.qty = 1;
    item.price = priceOf(item);
    item.key = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    cart.push(item);
    saveCart();
    toast('Додано в кошик: ' + productName(item.product).toLowerCase());
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
        '<div class="cart-item__info"><strong>' + esc(productName(i.product)) + ', ' + esc(sizeLabel(i)) + '</strong>' +
        '<span>' + esc(colorOf(i.product, i.color).name) + ' · ' + esc(describe(i)) + '</span>' +
        '<div class="cart-item__row"><div class="qty" role="group" aria-label="Кількість">' +
        '<button type="button" data-qty="-1" aria-label="Менше">−</button><span aria-live="polite">' + i.qty + '</span><button type="button" data-qty="1" aria-label="Більше">+</button></div>' +
        '<span class="cart-item__price">' + money(i.price * i.qty) + '</span></div>' +
        '<button type="button" class="link-btn" data-remove>Видалити</button></div></li>';
    }).join('');
    cart.forEach(function (i) { renderGarment(list.querySelector('[data-thumb="' + i.key + '"]'), i); });
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
      if (!row) return;
      var it = cart.filter(function (x) { return x.key === row.getAttribute('data-key'); })[0];
      if (e.target.closest('[data-qty]')) {
        var dq = e.target.closest('[data-qty]').getAttribute('data-qty');
        it.qty = Math.max(1, Math.min(20, it.qty + Number(dq)));
        saveCart({ key: it.key, sel: '[data-qty="' + dq + '"]' });
      } else if (e.target.closest('[data-remove]')) {
        var idx = cart.indexOf(it);
        cart.splice(idx, 1);
        var next = cart[idx] || cart[idx - 1];
        saveCart(next ? { key: next.key, sel: '[data-remove]' } : { fallback: '#cart-empty .btn' });
        toast('Товар видалено з кошика', function () { cart.splice(idx, 0, it); saveCart({ key: it.key, sel: '[data-remove]' }); });
      }
    });
    document.addEventListener('keydown', function (e) {
      var d = $('#cart');
      if (d.hidden) return;
      if (e.key === 'Escape') closeCart();
      if (e.key === 'Tab') {
        var f = $$('button, [href], input, select, textarea', d).concat($('#toast').classList.contains('is-on') ? $$('#toast-undo:not([hidden])') : []).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
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
      var bad = [];
      $$('input[required]', f).forEach(function (x) {
        var fld = x.closest('.field'), err = fld.querySelector('.field__err');
        var v = x.value.trim(), msg = '';
        if (!v) msg = err.getAttribute('data-empty');
        else if (x.name === 'phone' && /[^\d\s()+\-]/.test(v)) msg = 'У номері можуть бути лише цифри, пробіли, «+», дужки й дефіс.';
        else if (x.name === 'phone' && v.replace(/\D/g, '').length < 10) msg = 'Номер закороткий — вкажіть 10 цифр, напр. 050 123 45 67.';
        fld.classList.toggle('field--error', !!msg);
        err.textContent = msg;
        if (msg) { x.setAttribute('aria-invalid', 'true'); bad.push(x); } else x.removeAttribute('aria-invalid');
      });
      if (bad.length) { bad[0].focus(); return; }
      var msg = orderText(f);
      $('#order-text').value = msg;
      $('#tg-link').href = 'https://t.me/' + CONFIG.telegram;
      showStep('done');
      var rest = 'Відкрийте Telegram, вставте текст замовлення й надішліть менеджеру — він покаже макет і підтвердить замовлення. Після вашого «так» почнемо виготовлення.';
      $('#done-copy').textContent = rest;
      copy(msg, true, function (ok) {
        $('#done-copy').textContent = (ok ? 'Ми скопіювали деталі замовлення. ' : 'Скопіюйте текст замовлення нижче. ') + rest;
      });
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
    var lines = ['Нове замовлення — На подарунок', ''];
    cart.forEach(function (i, n) {
      lines.push((n + 1) + '. ' + productName(i.product) + ', ' + colorOf(i.product, i.color).name.toLowerCase() + ', розмір ' + sizeLabel(i) + ' × ' + i.qty + ' — ' + money(i.price * i.qty));
      lines.push('   ' + describe(i));
    });
    lines.push('', 'Разом: ' + money(total()), '');
    lines.push('Імʼя: ' + v('name'), 'Телефон: ' + v('phone'), 'Нова Пошта: ' + v('city') + ', ' + v('branch'));
    lines.push('Оплата: ' + (f.elements.pay.value === 'card' ? 'передоплата на карту' : 'накладений платіж'));
    if (f.elements.gift.checked) lines.push('Подарунок, листівка: ' + (v('giftText') || 'без тексту'));
    if (v('comment')) lines.push('Коментар: ' + v('comment'));
    return lines.join('\n');
  }

  function copy(text, silent, cb) {
    var result = function (ok) {
      if (!silent) toast(ok ? 'Текст замовлення скопійовано' : 'Не вдалося скопіювати — виділіть текст і скопіюйте вручну');
      if (cb) cb(ok);
    };
    var fallback = function () {
      var ta = $('#order-text'); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      result(ok);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(function () { result(true); }, fallback); return; }
    } catch (e) { /* fallthrough */ }
    fallback();
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

  /* ---------- Меню, посилання, липка панель ---------- */
  function bindNav() {
    var btn = $('#menu-btn'), nav = $('#nav');
    function setMenu(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Закрити меню' : 'Меню');
      nav.classList.toggle('is-open', open);
    }
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !e.target.closest('#nav, #menu-btn')) setMenu(false);
    });
    $$('a[href="#faq-size"]').forEach(function (a) {
      a.addEventListener('click', function () { $('#faq-size').open = true; });
    });

    var bar = $('#sticky-buy'), sec = $('#constructor');
    if ('IntersectionObserver' in window && bar && sec) {
      var setBar = function (on) {
        bar.classList.toggle('is-on', on);
        document.body.classList.toggle('in-builder', on);
        if (on) bar.removeAttribute('inert'); else bar.setAttribute('inert', '');
      };
      setBar(false);
      new IntersectionObserver(function (en) { setBar(en[0].isIntersecting); }, { threshold: 0.05 }).observe(sec);
    }
  }

  // Рукописний шрифт потрібен лише для одного варіанта напису — вантажимо після сторінки.
  window.addEventListener('load', function () {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Marck+Script&display=swap';
    document.head.appendChild(l);
  });

  document.addEventListener('DOMContentLoaded', function () {
    $$('[data-days]').forEach(function (el) { el.textContent = CONFIG.productionDays; });
    $$('[data-tg]').forEach(function (el) { el.href = 'https://t.me/' + CONFIG.telegram; });
    $$('[data-base-price]').forEach(function (el) { el.textContent = money(CONFIG.base); });
    heroLoop();
    renderCatalog();
    bindOcards();
    bindIdeas();
    renderIdeas();
    bindBuilder();
    syncForm();
    bindCart();
    renderCart();
    bindNav();
    var gg = $('#gift-garment');
    if (gg) renderGarment(gg, assign({}, DEFAULT, { product: 'sweat', color: 'graphite', tech: 'embroidery', place: 'center', type: 'emblem', motif: 'tree', caption: '25.12', thread: 'white' }), { lazy: true });
    var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  });
})();
