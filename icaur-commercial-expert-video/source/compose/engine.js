// =====================================================================
// Motor de composición iCAUR Commercial Expert (9:16, 1080x1920, 30 fps)
// Cada fotograma se dibuja con renderFrame(n). Los elementos se crean una
// vez y se actualizan por fotograma, así el render es determinista.
// =====================================================================
const W = window.STAGE_W || 1080, H = window.STAGE_H || 1920, FPS = 30;
const C = { ocre: '#D58D0F', arena: '#C5A57B', cafe: '#5B3629', naranja: '#E86B22', noche: '#1B1F28', negro: '#272421', oliva: '#4D6047', blanco: '#FFFFFF', fondo: '#F8F7F4' };

// ---------- utilidades de animación
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const EZ = {
  lin: t => t,
  io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,          // cúbica entrada/salida
  io5: t => t < .5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2,            // quíntica (zooms de cámara)
  o: t => 1 - Math.pow(1 - t, 3),
  o5: t => 1 - Math.pow(1 - t, 5),
  i: t => t * t * t,
  back: t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  expo: t => t === 0 ? 0 : t === 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
};
// Interpolación por fotogramas clave: keys = [[t, valor, easing?], ...]
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0, e] = keys[i], [t1, v1] = keys[i + 1];
    if (t <= t1) {
      const p = (EZ[e || 'io'])(clamp((t - t0) / (t1 - t0)));
      return Array.isArray(v0) ? v0.map((x, k) => lerp(x, v1[k], p)) : lerp(v0, v1, p);
    }
  }
  return keys[keys.length - 1][1];
}
const prog = (t, t0, d, e = 'o') => (EZ[e])(clamp((t - t0) / d));
const win01 = (t, t0, t1, fi = .35, fo = .35) => Math.min(prog(t, t0, fi, 'o'), 1 - prog(t, t1 - fo, fo, 'i'));

// ---------- DOM
const stage = document.getElementById('stage');
const POOL = {}; let USED = new Set();
function el(id, tag = 'div', cls = '', parent = stage, html = null) {
  let e = POOL[id];
  if (!e) { e = tag === 'svg' ? document.createElementNS('http://www.w3.org/2000/svg', 'svg') : document.createElement(tag); e.id = id; if (cls) e.setAttribute('class', cls); if (html != null) e.innerHTML = html; parent.appendChild(e); POOL[id] = e; }
  USED.add(id); e.style.display = '';
  return e;
}
const PENDING = [];
function setSrc(img, src) { if (img.dataset.src !== src) { img.dataset.src = src; img.src = src; PENDING.push(img.decode().catch(() => { })); } }

// ---------- fondo animado (negro cálido / azul noche con resplandores ocre y café)
function background(t, opts = {}) {
  const b = el('bg', 'div', 'bg');
  const a = t * 0.12;
  const g1x = 50 + 28 * Math.sin(a), g1y = 30 + 12 * Math.cos(a * 1.3);
  const g2x = 50 - 30 * Math.cos(a * .8), g2y = 78 + 8 * Math.sin(a * 1.1);
  const k = opts.glow ?? 1;
  b.style.background = `radial-gradient(60% 38% at ${g1x}% ${g1y}%, rgba(213,141,15,${.30 * k}) 0%, rgba(213,141,15,0) 70%),
    radial-gradient(70% 40% at ${g2x}% ${g2y}%, rgba(91,54,41,${.55 * k}) 0%, rgba(91,54,41,0) 70%),
    radial-gradient(120% 70% at 50% 50%, #23252d 0%, #15171c 60%, #0e0f12 100%)`;
  const grid = el('grid', 'div', 'grid');
  grid.style.opacity = opts.grid ?? .55;
  grid.style.backgroundPosition = `0 ${(t * 14) % 90}px`;
}

// ---------- ventana de navegador flotante con cámara
// cam: { fx, fy } punto de foco en px CSS de la grabación; s = escala (px de escenario por px CSS);
//      px, py = posición del foco en el escenario. tilt: { rx, ry, rz } en grados.
const CLIPS = window.CLIPS || {};
function frameSrc(clip, ct) {
  const c = CLIPS[clip]; const n = clamp(Math.round(ct * FPS), 0, c.frames - 1);
  return `clips/${clip}/${String(n + 1).padStart(6, '0')}.jpg`;
}
function browserWin(id, clip, ct, o) {
  const c = CLIPS[clip];
  if (!c) return { root: null, ovl: document.createElement('div'), map: () => [0, 0], s: 1, id };
  const cw = c.cssW, ch = c.cssH;
  const root = el(id, 'div', 'winroot');
  const tilt = el(id + '_tilt', 'div', 'wintilt', root);
  const fr = el(id + '_fr', 'div', 'winframe', tilt,
    `<div class="chrome"><span class="dots"><i></i><i></i><i></i></span><span class="url"><b>🔒</b> ${o.url || 'icaur.commercialexpert.denivodigital.com'}</span></div><div class="content"><img class="shot"><div class="ovl"></div></div>`);
  const content = fr.querySelector('.content'); const img = fr.querySelector('.shot');
  const urlTxt = '<b>🔒</b> ' + (o.url || 'icaur.commercialexpert.denivodigital.com');
  const ue = fr.querySelector('.url'); if (ue.dataset.u !== urlTxt) { ue.innerHTML = urlTxt; ue.dataset.u = urlTxt; }
  content.style.width = cw + 'px'; content.style.height = ch + 'px';
  img.style.width = cw + 'px'; img.style.height = ch + 'px';
  setSrc(img, frameSrc(clip, ct));
  const { fx, fy, s, px, py } = o.cam;
  const chromeH = o.chrome === false ? 0 : 46;
  fr.querySelector('.chrome').style.display = o.chrome === false ? 'none' : '';
  fr.style.width = cw + 'px'; fr.style.height = (ch + chromeH) + 'px';
  fr.style.borderRadius = (o.radius ?? 22) + 'px';
  fr.style.transform = `translate(${px - fx * s}px, ${py - (fy + chromeH) * s}px) scale(${s})`;
  const tl = o.tilt || { rx: 0, ry: 0, rz: 0 };
  tilt.style.transformOrigin = `${px}px ${py}px`;
  tilt.style.transform = `perspective(2600px) rotateX(${tl.rx || 0}deg) rotateY(${tl.ry || 0}deg) rotateZ(${tl.rz || 0}deg)`;
  root.style.opacity = o.opacity ?? 1;
  const blur = o.blur || 0; fr.style.filter = blur > .3 ? `blur(${blur}px)` : 'none';
  fr.style.boxShadow = `0 ${60 / s}px ${140 / s}px rgba(0,0,0,.55), 0 0 0 ${1 / s}px rgba(255,255,255,.10)`;
  root.style.zIndex = o.z ?? 10;
  const ovl = content.querySelector('.ovl');
  // conversión de coordenadas de la grabación a escenario (sin inclinación)
  const map = (x, y) => [px + (x - fx) * s, py + (y - fy) * s];
  return { root, ovl, map, s, id };
}

// Resaltado animado sobre un rectángulo de la grabación (coordenadas CSS de la página)
function highlight(win, hid, rect, t, t0, t1, o = {}) {
  const e = el(win.id + '_hl_' + hid, 'div', 'hl', win.ovl, '<svg><rect pathLength="1"/></svg><span class="fill"></span>');
  if (t < t0 || t > t1) { e.style.display = 'none'; return; }
  const pad = o.pad ?? 8; const [x, y, w, h] = rect;
  const sw = (o.stroke ?? 4) / win.s; const r = (o.r ?? 14);
  e.style.left = (x - pad) + 'px'; e.style.top = (y - pad) + 'px';
  e.style.width = (w + 2 * pad) + 'px'; e.style.height = (h + 2 * pad) + 'px';
  const svg = e.querySelector('svg'); svg.setAttribute('width', w + 2 * pad); svg.setAttribute('height', h + 2 * pad);
  const rc = e.querySelector('rect');
  rc.setAttribute('x', sw / 2); rc.setAttribute('y', sw / 2); rc.setAttribute('rx', r); rc.setAttribute('width', w + 2 * pad - sw); rc.setAttribute('height', h + 2 * pad - sw);
  rc.setAttribute('stroke-width', sw);
  const d = prog(t, t0, o.draw ?? .55, 'io');
  rc.style.strokeDashoffset = 1 - d;
  e.style.opacity = 1 - prog(t, t1 - .3, .3, 'i');
  e.querySelector('.fill').style.opacity = (o.fill ?? .16) * d;
  e.style.filter = `drop-shadow(0 0 ${10 / win.s}px rgba(213,141,15,.9))`;
}
// Subrayado de texto tipo marcador (para frases de respuestas del chat)
function marker(win, hid, rects, t, t0, t1, o = {}) {
  rects.forEach((rc, k) => {
    const e = el(win.id + '_mk_' + hid + '_' + k, 'div', 'marker', win.ovl);
    if (t < t0 || t > t1) { e.style.display = 'none'; return; }
    const [x, y, w, h] = rc; const st = t0 + k * (o.stagger ?? .18);
    const p = prog(t, st, o.dur ?? .45, 'io');
    e.style.left = (x - 3) + 'px'; e.style.top = (y + h * .08) + 'px'; e.style.height = (h * .9) + 'px';
    e.style.width = ((w + 6) * p) + 'px';
    e.style.opacity = 1 - prog(t, t1 - .3, .3, 'i');
  });
}

// ---------- texto cinético (palabra por palabra), en coordenadas del escenario
function kinetic(id, html, t, t0, t1, o = {}) {
  if (window.NO_TEXT) return;
  const e = el(id, 'div', 'kin ' + (o.cls || ''));
  if (!e.dataset.built) {
    e.innerHTML = html.split(/(<br>)/).map(part => part === '<br>' ? '<br>' : part.split(' ').filter(Boolean).map(w => `<span class="w"><span class="wi">${w}</span></span>`).join(' ')).join('');
    e.dataset.built = 1;
  }
  if (t < t0 - .01 || t > t1 + .6) { e.style.display = 'none'; return; }
  Object.assign(e.style, { left: (o.x ?? 90) + 'px', top: (o.y ?? 300) + 'px', width: (o.w ?? 900) + 'px', textAlign: o.align || 'left', fontSize: (o.size ?? 92) + 'px' });
  const ws = e.querySelectorAll('.wi'); const st = o.stagger ?? .07; const d = o.dur ?? .55;
  ws.forEach((w, i) => {
    const pi = prog(t, o.times ? (o.times[i] ?? o.times[o.times.length - 1]) : t0 + i * st, d, 'o5');
    const po = prog(t, t1 + i * .035, .4, 'i');
    w.style.transform = `translateY(${(1 - pi) * 105 - po * 60}%)`;
    w.style.opacity = Math.min(pi * 1.4, 1 - po);
    w.style.filter = `blur(${(1 - pi) * 10 + po * 8}px)`;
  });
}
// Etiqueta tipo "chip" de vidrio con punto ocre
function chip(id, text, t, t0, t1, o = {}) {
  if (window.NO_TEXT) return;
  const e = el(id, 'div', 'chip ' + (o.cls || ''), stage, `<i></i><span></span>`);
  if (t < t0 || t > t1 + .5) { e.style.display = 'none'; return; }
  e.querySelector('span').innerHTML = text;
  const pi = prog(t, t0, .55, 'back'), po = prog(t, t1, .35, 'i');
  const dx = (o.from === 'right' ? 1 : o.from === 'left' ? -1 : 0) * 80, dy = (o.from === 'bottom' ? 1 : o.from === 'top' ? -1 : 0) * 60;
  Object.assign(e.style, { left: o.x + 'px', top: o.y + 'px', fontSize: (o.size ?? 36) + 'px' });
  e.style.transform = `translate(${o.anchor === 'center' ? '-50%' : o.anchor === 'right' ? '-100%' : '0'}, 0) translate(${dx * (1 - pi)}px, ${dy * (1 - pi)}px) scale(${.85 + .15 * pi})`;
  e.style.opacity = clamp(pi * 1.5) * (1 - po);
}
// Flecha curva animada (escenario) que apunta a un punto
function arrow(id, from, to, t, t0, t1, o = {}) {
  if (window.NO_TEXT) return;
  const e = el(id, 'svg', 'arrow', stage);
  if (!e.dataset.b) { e.setAttribute('width', W); e.setAttribute('height', H); e.innerHTML = '<path class="ap" pathLength="1"/><path class="ah"/><circle class="ring"/><circle class="dot"/>'; e.dataset.b = 1; }
  if (t < t0 || t > t1 + .4) { e.style.display = 'none'; return; }
  const [x0, y0] = from, [x1, y1] = to; const bend = o.bend ?? .25;
  const mx = (x0 + x1) / 2 - (y1 - y0) * bend, my = (y0 + y1) / 2 + (x1 - x0) * bend;
  const p = prog(t, t0, .6, 'io'); const po = prog(t, t1, .35, 'i');
  const ap = e.querySelector('.ap'); ap.setAttribute('d', `M${x0},${y0} Q${mx},${my} ${x1},${y1}`);
  ap.style.strokeDashoffset = 1 - p;
  // punta de flecha orientada con la tangente final
  const ang = Math.atan2(y1 - my, x1 - mx); const L = 30;
  const ah = e.querySelector('.ah');
  const tip = [x1 - Math.cos(ang) * 6, y1 - Math.sin(ang) * 6];
  ah.setAttribute('d', `M${tip[0] - Math.cos(ang - .5) * L},${tip[1] - Math.sin(ang - .5) * L} L${tip[0]},${tip[1]} L${tip[0] - Math.cos(ang + .5) * L},${tip[1] - Math.sin(ang + .5) * L}`);
  ah.style.opacity = clamp((p - .85) / .15);
  const ring = e.querySelector('.ring'), dot = e.querySelector('.dot');
  const rp = ((t - t0 - .5) % 1.1) / 1.1;
  ring.setAttribute('cx', x1); ring.setAttribute('cy', y1); ring.setAttribute('r', 14 + 40 * Math.max(0, rp));
  ring.style.opacity = t > t0 + .5 ? (1 - rp) * .9 : 0;
  dot.setAttribute('cx', x1); dot.setAttribute('cy', y1); dot.setAttribute('r', 9 * clamp((p - .8) / .2));
  e.style.opacity = 1 - po;
}
// Onda de clic (escenario)
function ping(id, x, y, t, t0) {
  const e = el(id, 'div', 'ping');
  const p = (t - t0) / .7;
  if (p < 0 || p > 1) { e.style.display = 'none'; return; }
  Object.assign(e.style, { left: x + 'px', top: y + 'px', transform: `translate(-50%,-50%) scale(${.3 + 2.2 * EZ.o(p)})`, opacity: 1 - p });
}
// Destello / barrido de luz para transiciones
function sweep(t, t0, d = .6) {
  const e = el('sweep', 'div', 'sweep');
  const p = (t - t0) / d; if (p < 0 || p > 1) { e.style.display = 'none'; return; }
  e.style.transform = `translateX(${lerp(-120, 120, EZ.io(p))}%) skewX(-18deg)`;
  e.style.opacity = Math.sin(Math.PI * p) * .85;
}
// Capa de color: modo 'in' (de color a transparente), 'out' (de transparente a color) o pulso
function cover(id, color, op) { const e = el(id, 'div', 'fade'); e.style.background = color; e.style.opacity = op; if (op <= 0.001) e.style.display = 'none'; }
function fade(t, t0, d, color = '#000', maxO = 1, id = 'fade') {
  const e = el(id, 'div', 'fade'); const p = Math.sin(Math.PI * clamp((t - t0) / d));
  if (t < t0 || t > t0 + d) { e.style.display = 'none'; return; }
  e.style.background = color; e.style.opacity = p * maxO;
}

// ---------- ciclo de render
let SCENES = [];
function renderFrame(n) {
  const t = n / FPS; USED = new Set(); PENDING.length = 0;
  const vg = document.querySelector('.vig'); if (vg) vg.style.opacity = 1;
  background(t, window.BG_OPTS ? window.BG_OPTS(t) : {});
  for (const sc of SCENES) { if (t >= sc.t0 - 1e-6 && t < sc.t1) sc.draw(t - sc.t0, t, sc); }
  for (const id in POOL) if (!USED.has(id)) POOL[id].style.display = 'none';
  return Promise.all(PENDING).then(() => new Promise(r => requestAnimationFrame(() => r(t))));
}
window.renderFrame = renderFrame;
