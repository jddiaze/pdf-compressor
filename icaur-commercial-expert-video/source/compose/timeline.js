// =====================================================================
// Línea de tiempo · iCAUR Commercial Expert (9:16)
// Cada escena define draw(u, t): u = tiempo local de la escena, t = global.
// Para mover una escena: cambie t0/t1 en source/timeline_master.json y los
// desplazamientos internos aquí. Los textos visibles están en TEXTOS.
// =====================================================================
const M = window.MARKS || {}; const R = window.RECTS || {};
const TEXTOS = {
  s1_tag: 'Una nueva forma<br>de <em>explorar</em>.',
  s2_kicker: 'Hall digital', s2_head: 'Recorre el <em>showroom</em>',
  s2_v23: 'V23 · <b>100% eléctrico</b>', s2_v27: 'V27 · <b>Rango extendido</b>',
  s3_kicker: 'Visor 3D', s3_head: 'Explora en <em>3D</em>',
  s3_c1: 'Rotación libre', s3_c2: '<b>6</b> colores', s3_c3: 'Puntos de interés',
  s4_kicker: 'Detalle del producto', s4_head: 'Todo sobre tu <em>iCAUR</em>',
  s4_list: ['Características', 'Seguridad', 'Autonomía', 'Precio', 'Financiación', 'Ficha técnica'],
  s5_head: '¿Tienes una <em>pregunta</em>?',
  s5_c1: 'Sabe qué modelo <b>estás viendo</b>', s5_c2: 'Compara <b>V23 y V27</b>', s5_c3: 'Te orienta según <b>tu uso</b>', s5_c4: 'Perfila tus <b>necesidades</b>',
  s6_kicker: 'Del interés a la acción', s6_a: '<b>01</b> · Reserva tu iCAUR', s6_b: '<b>02</b> · Prueba de manejo', s6_c: '<b>03</b> · Envía tus datos',
  s6_crm_head: 'Conectado con tu<br>equipo <em>comercial</em>',
  s7_tag: ['Explora', 'Pregunta', 'Avanza'], url: 'icaur.commercialexpert.denivodigital.com',
};
// tiempo de una palabra de la narración (primera coincidencia desde 'after')
function wt(word, after = 0) { const w = (window.WORDS || []).find(x => x.t[0] >= after - 0.01 && x.w.replace(/[¿?,.]/g, '').toLowerCase() === word.toLowerCase()); return w ? w.t[0] : after; }
// mapa por tramos tiempo de escenario -> tiempo de clip: [[t0, t1, c0, c1], ...]
function seg(t, segs) {
  for (const [t0, t1, c0, c1] of segs) if (t < t1) return t <= t0 ? c0 : c0 + (c1 - c0) * (t - t0) / (t1 - t0);
  const l = segs[segs.length - 1]; return l[3];
}
const cm = (clip, label, def) => (M[clip] && M[clip][label] != null) ? M[clip][label] : def;
function scrims(t, top, bot) {
  const a = el('scrimT', 'div', 'scrim'); Object.assign(a.style, { position: 'absolute', left: 0, top: 0, width: '1080px', height: '760px', zIndex: 30, background: 'linear-gradient(#0e0f12f0, #0e0f1299 45%, transparent)', opacity: top });
  const b = el('scrimB', 'div', 'scrim'); Object.assign(b.style, { position: 'absolute', left: 0, bottom: 0, width: '1080px', height: '700px', zIndex: 30, background: 'linear-gradient(transparent, #0e0f12aa 50%, #0e0f12ee)', opacity: bot });
}
function imgEl(id, src, x, y, w, o = {}) {
  const e = el(id, 'img', 'logo'); setSrc(e, src);
  Object.assign(e.style, { left: x + 'px', top: y + 'px', width: w + 'px', opacity: o.opacity ?? 1, transform: o.transform || 'none', filter: o.filter || 'none', zIndex: o.z ?? 70 });
  return e;
}
const SFX = []; // eventos de sonido para la mezcla (tipo, tiempo)
const sfx = (type, t, extra = {}) => SFX.push({ type, t: +t.toFixed(3), ...extra });

// ---------------------------------------------------------------- S1 · IMPACTO
const S1 = { t0: 0, t1: 6.0, draw(u, t) {
  const ct = 0.1 + u * 0.05;
  const s = kf(u, [[0, .66], [1.3, .74, 'o5'], [4.5, .78, 'io'], [6.0, 2.6, 'io5']]);
  const fx = kf(u, [[0, 640], [4.5, 640, 'io5'], [6.0, 262]]), fy = kf(u, [[0, 400], [4.5, 400, 'io5'], [6.0, 400]]);
  const py = kf(u, [[0, 1650], [1.3, 1010, 'o5'], [4.5, 1000, 'io5'], [6.0, 960]]);
  const tilt = { rx: kf(u, [[0, 26], [1.3, 9, 'o5'], [4.5, 5, 'io'], [5.7, 0]]), ry: kf(u, [[0, -20], [1.3, -9, 'o5'], [4.5, -5, 'io'], [5.7, 0]]), rz: kf(u, [[0, 4], [1.3, 0]]) };
  browserWin('w1', 'C01_hall', ct, { cam: { fx, fy, s, px: 540, py }, tilt, opacity: kf(u, [[0, 0], [.5, 1]]), blur: kf(u, [[4.7, 0], [5.35, 5], [6.0, 0]]) });
  // logo oficial blanco (activo del propio sitio)
  const lp = prog(u, 1.2, .8, 'o5'), lo = prog(u, 4.4, .5, 'i');
  imgEl('s1logo', 'assets/logo-icaur-blanco.png', 540 - 240, 250 - lo * 60, 480, { opacity: lp * (1 - lo), transform: `scale(${.86 + .14 * lp})`, filter: `blur(${(1 - lp) * 14 + lo * 8}px) drop-shadow(0 8px 30px rgba(0,0,0,.5))` });
  kinetic('s1ce', 'Commercial Expert', u, 2.15, 4.35, { x: 40, y: 400, w: 1000, align: 'center', size: 108 });
  kinetic('s1tag', TEXTOS.s1_tag, u, wt('Una') - 0.1, 5.25, { x: 40, y: 1350, w: 1000, align: 'center', size: 84, cls: 'mid' });
  sweep(u, 1.05, .8);
  cover('fadein', '#000', 1 - prog(u, 0, .6, 'o'));
}};
sfx('impact', 1.2); sfx('whoosh', 5.0); sfx('rise', 4.3);

// ---------------------------------------------------------------- S2 · HALL
const S2 = { t0: 6.0, t1: 13.8, draw(u, t) {
  const clickNext = 11.05;
  const ct = seg(t, [[6.0, 9.9, .2, cm('C01_hall', 'to_next', 2.12)], [9.9, clickNext, cm('C01_hall', 'to_next', 2.12), cm('C01_hall', 'v27', 3.27)], [clickNext, 13.8, cm('C01_hall', 'v27', 3.27), cm('C01_hall', 'v27', 3.27) + 2.75]]);
  const s = kf(t, [[6.0, 2.6], [7.6, 2.8, 'io5'], [8.8, 1.12, 'io'], [10.2, 1.18, 'io5'], [11.6, 1.18, 'io5'], [12.6, 2.6, 'io'], [13.4, 2.7, 'io5'], [13.8, 4.0]]);
  const fx = kf(t, [[6.0, 262], [7.6, 270, 'io5'], [8.8, 640, 'io'], [11.6, 640, 'io5'], [12.6, 262]]);
  const fy = kf(t, [[6.0, 400], [8.8, 400, 'io'], [11.6, 400, 'io5'], [12.6, 400], [13.4, 400, 'io5'], [13.8, 600]]);
  const py = kf(t, [[6.0, 960], [7.6, 960, 'io5'], [8.8, 1010, 'io'], [11.6, 1010, 'io5'], [12.6, 960]]);
  const tilt = { rx: kf(t, [[7.6, 0], [8.8, 4, 'io'], [11.6, 4], [12.6, 0]]), ry: kf(t, [[7.6, 0], [8.8, -6, 'io'], [11.6, -6], [12.6, 0]]) };
  const w = browserWin('w1', 'C01_hall', ct, { cam: { fx, fy, s, px: 540, py }, tilt, blur: kf(t, [[13.3, 0], [13.8, 9]]) });
  const full = kf(t, [[6.0, 1], [7.6, 1], [8.4, 0], [11.9, 0], [12.5, 1]]);
  scrims(t, full * .95, full * .8);
  kinetic('s2k', TEXTOS.s2_kicker, t, 6.25, 8.0, { x: 80, y: 250, size: 34, cls: 'kicker' });
  kinetic('s2h', TEXTOS.s2_head, t, 6.45, 8.1, { x: 80, y: 300, size: 96 });
  chip('s2c1', TEXTOS.s2_v23, t, wt('V23') - .15, 11.0, { x: 540, y: 1530, anchor: 'center', from: 'bottom', size: 40 });
  chip('s2c2', TEXTOS.s2_v27, t, 11.75, 13.5, { x: 540, y: 1530, anchor: 'center', from: 'bottom', size: 40 });
  // flecha hacia el botón "siguiente vehículo" y onda de clic
  const [ax, ay] = w.map(850, 400);
  arrow('s2arr', [ax - 330, ay - 360], [ax - 34, ay - 30], t, 9.95, clickNext + .15, { bend: -.3 });
  ping('s2ping', ax, ay, t, clickNext);
  kinetic('s2hall', 'Elige tu <em>modelo</em>', t, 8.9, 10.9, { x: 80, y: 280, size: 80 });
}};
sfx('click', 11.05); sfx('whoosh', 13.35); sfx('pop', 8.35); sfx('pop', 11.75);

// ---------------------------------------------------------------- S3 · VISOR 3D
const S3 = { t0: 13.8, t1: 21.6, draw(u, t) {
  const A = 'C03a_visor3d_rotacion', B = 'C03b_visor3d_colores_hotspot';
  const useB = t >= 17.9;
  const clip = useB ? B : A;
  const ct = useB ? seg(t, [[17.9, 21.6, 0, 3.7]]) : seg(t, [[13.8, 15.3, 0, .45], [15.3, 17.9, .45, Math.min(3.5, (CLIPS[A] || { dur: 3.5 }).dur - .05)]]);
  const hsX = 760, hsY = 330; // zona aproximada del punto de interés frontal
  const s = kf(t, [[13.8, 2.4], [14.8, 1.24, 'o5'], [17.9, 1.30, 'io'], [18.4, 1.55, 'io'], [19.6, 1.55, 'io5'], [20.6, 1.9, 'io'], [21.6, 2.0]]);
  const fx = kf(t, [[13.8, 450], [14.8, 455, 'o5'], [17.9, 455, 'io'], [18.4, 330, 'io'], [19.6, 330, 'io5'], [20.6, 560]]);
  const fy = kf(t, [[13.8, 330], [14.8, 345, 'o5'], [17.9, 345, 'io'], [18.4, 470, 'io'], [19.6, 470, 'io5'], [20.6, 330]]);
  const tilt = { rx: kf(t, [[13.8, 10], [15.0, 3, 'o5'], [21.6, 0]]), ry: kf(t, [[13.8, 16], [15.0, 4, 'o5'], [17.9, -3], [21.6, 0]]) };
  const w = browserWin('w3', clip, ct, { cam: { fx, fy, s, px: 540, py: 1010 }, tilt, chrome: true, blur: kf(t, [[13.8, 10], [14.3, 0], [17.85, 0], [17.9, 4], [18.05, 0], [21.2, 0], [21.6, 8]]) });
  fade(t, 17.82, .16, '#fff', .35, 'flash3');
  scrims(t, kf(t, [[13.8, .9], [17.6, .9], [18.2, 0]]), 0);
  kinetic('s3k', TEXTOS.s3_kicker, t, 14.0, 17.6, { x: 80, y: 250, size: 34, cls: 'kicker' });
  kinetic('s3h', TEXTOS.s3_head, t, 14.15, 17.6, { x: 80, y: 300, size: 100 });
  chip('s3c1', TEXTOS.s3_c1, t, wt('exterior') - .4, 17.85, { x: 80, y: 1560, from: 'left', size: 38 });
  chip('s3c2', TEXTOS.s3_c2, t, wt('color') - .2, 19.5, { x: 80, y: 1560, from: 'left', size: 38 });
  chip('s3c3', TEXTOS.s3_c3, t, wt('puntos') - .2, 21.3, { x: 80, y: 1560, from: 'left', size: 38 });
  if (useB) highlight(w, 'colors', [135, 548, 268, 40], t, 18.25, 19.7, { r: 22, pad: 6, fill: 0 });
}};
sfx('whoosh', 13.8); sfx('pop', 16.1); sfx('pop', 17.8); sfx('click', 18.8); sfx('click', 20.3); sfx('pop', 19.35);

// ---------------------------------------------------------------- S4 · INTERIOR + MENÚ + PRECIO
const S4 = { t0: 21.6, t1: 30.0, draw(u, t) {
  const G = 'C04a_galeria_interior', P = 'C04b_menu_precio';
  const tSwitch = 24.2; const useP = t >= tSwitch;
  // galería
  if (!useP) {
    const ct = seg(t, [[21.6, tSwitch, 0, Math.min((CLIPS[G] || { dur: 2.6 }).dur - .05, 2.6 * 1.25)]]);
    const s = kf(t, [[21.6, 2.1], [22.4, 1.28, 'o5'], [tSwitch, 1.36, 'io']]);
    browserWin('w4', G, ct, { cam: { fx: kf(t, [[21.6, 450], [tSwitch, 470]]), fy: kf(t, [[21.6, 330], [tSwitch, 360]]), s, px: 540, py: 1000 }, tilt: { rx: kf(t, [[21.6, 8], [22.6, 2, 'o5']]), ry: kf(t, [[21.6, -14], [22.6, -3, 'o5']]) }, blur: kf(t, [[21.6, 9], [22.0, 0], [23.9, 0], [tSwitch, 8]]) });
  } else {
    const mk = M[P] || {}; const cMenu = mk.menu ?? .2, cSeg = mk.hover_Seguridad ?? 1.6, cAut = mk.hover_Autonomía ?? 2.2, cPre = mk.precio ?? 3.0, cAns = mk.answer ?? 5.0;
    const tAns = 28.3;
    const ct = seg(t, [[tSwitch, wt('seguridad', 24) + .1, Math.max(0, cMenu - .1), cSeg + .45], [wt('seguridad', 24) + .1, wt('autonomía', 24) + .1, cSeg + .45, cAut + .45], [wt('autonomía', 24) + .1, 27.2, cAut + .45, cPre + .9], [27.2, tAns, cPre + .9, cAns], [tAns, 30.0, cAns, cAns + 1.7]]);
    const rc = R.C04b || {}; const pan = [66, 195, 300, 315]; // panel Características (CSS)
    const s = kf(t, [[tSwitch, 2.6], [24.7, 2.15, 'o5'], [27.0, 2.15, 'io'], [27.9, 2.4, 'io']]);
    const fx = kf(t, [[tSwitch, pan[0] + pan[2] / 2 + 60], [27.0, pan[0] + pan[2] / 2 + 60, 'io'], [27.9, 1068]]);
    const fy = kf(t, [[tSwitch, pan[1] + pan[3] / 2], [27.0, pan[1] + pan[3] / 2, 'io'], [27.9, 410]]);
    const w = browserWin('w4', P, ct, { cam: { fx, fy, s, px: 540, py: 1010 }, blur: kf(t, [[tSwitch, 10], [24.6, 0], [26.9, 0], [27.45, 6], [27.9, 0]]) });
    for (const [k, tt] of [['Seguridad', wt('seguridad', 24)], ['Autonomía', wt('autonomía', 24)]]) if (rc[k]) highlight(w, k, rc[k], t, tt - .05, 27.0, { r: 12, pad: 5 });
    if (rc.price && rc.price.length) marker(w, 'price', rc.price.slice(0, 2), t, tAns + .5, 30.0, { stagger: .35 });
    else if (rc.answer) highlight(w, 'ans', rc.answer, t, tAns + .4, 30.0, { r: 18 });
  }
  scrims(t, .85, .0);
  kinetic('s4k', TEXTOS.s4_kicker, t, 21.85, 23.9, { x: 80, y: 250, size: 34, cls: 'kicker' });
  kinetic('s4h', 'Galería <em>interior</em>', t, 22.0, 23.9, { x: 80, y: 300, size: 100 });
  // lista sincronizada con la voz
  const words = ['características', 'seguridad', 'autonomía', 'precio', 'financiación', 'ficha'];
  TEXTOS.s4_list.forEach((txt, i) => {
    const tt = wt(words[i], 23) - .1; const col = i % 2, row = Math.floor(i / 2);
    chip('s4l' + i, txt, t, tt, 29.75, { x: 80 + col * 470, y: 240 + row * 104, size: 34, from: 'top' });
  });
}};
sfx('whoosh', 21.6); sfx('whoosh', 24.2); ['características', 'seguridad', 'autonomía', 'precio', 'financiación', 'ficha'].forEach(w => sfx('tick', wt(w, 23) - .05)); sfx('click', 27.2); sfx('shimmer', 28.8);

// ---------------------------------------------------------------- S5 · CHAT (protagonista)
const C5 = 'C05_chat';
const m5 = k => cm(C5, k, 0);
const S5segs = () => [
  [30.0, 31.6, 0.0, m5('q1_type')], [31.6, 34.05, m5('q1_type'), m5('q1_send')], [34.05, 35.1, m5('q1_send'), m5('q1_answer')],
  [35.1, 37.7, m5('q1_answer'), m5('q2_focus')], [37.7, 38.3, m5('q2_focus'), m5('q2_type')], [38.3, 41.22, m5('q2_type'), m5('q2_send')],
  [41.22, 42.0, m5('q2_send'), m5('q2_answer')], [42.0, 44.7, m5('q2_answer'), m5('q3_focus')],
  [44.7, 47.4, m5('q3_answer') + .2, m5('q3_answer') + 2.9], [47.4, 48.0, m5('q3_answer') + 2.9, m5('q3_answer') + 3.5]];
const S5 = { t0: 30.0, t1: 48.0, draw(u, t) {
  const ct = seg(t, S5segs());
  const s = kf(t, [[30.0, .80], [32.3, .88, 'io'], [33.2, 2.55, 'io5'], [33.6, 2.85, 'io'], [34.3, 2.85, 'io'], [35.1, 2.55, 'io5'], [37.6, 2.6, 'io'], [38.4, 2.9, 'io'], [41.3, 2.9, 'io'], [42.0, 2.55, 'io5'], [44.6, 2.6], [44.7, 2.75, 'o5'], [47.2, 2.6, 'io'], [48.0, 1.0, 'io5']]);
  const fx = kf(t, [[30.0, 640], [32.3, 700, 'io'], [33.2, 1066, 'io5'], [33.6, 1094, 'io'], [34.3, 1094, 'io'], [35.1, 1066, 'io5'], [37.6, 1066, 'io'], [38.4, 1094, 'io'], [41.3, 1094, 'io'], [42.0, 1066, 'io5'], [47.2, 1066, 'io'], [48.0, 900, 'io5']]);
  const fy = kf(t, [[30.0, 400], [32.3, 420, 'io'], [33.2, 420, 'io5'], [33.6, 466, 'io'], [34.3, 466, 'io'], [35.1, 420, 'io5'], [37.6, 400, 'io'], [38.4, 466, 'io'], [41.3, 466, 'io'], [42.0, 420, 'io5'], [44.6, 420], [44.7, 430, 'o5'], [47.2, 420, 'io'], [48.0, 400, 'io5']]);
  const py = kf(t, [[30.0, 1080], [32.3, 1090], [33.2, 960, 'io5']]);
  const tilt = { rx: kf(t, [[30.0, 10], [32.3, 5, 'io'], [33.1, 0, 'io5'], [47.3, 0], [48.0, 6]]), ry: kf(t, [[30.0, 14], [32.3, 7, 'io'], [33.1, 0, 'io5'], [47.3, 0], [48.0, -8]]) };
  const w = browserWin('w5', C5, ct, { cam: { fx, fy, s, px: 540, py }, tilt, blur: kf(t, [[30.0, 8], [30.4, 0], [44.55, 0], [44.7, 10], [44.95, 0], [47.6, 0], [48.0, 8]]) });
  // título inicial sobre la vista amplia
  scrims(t, kf(t, [[30, .9], [32.7, .9], [33.2, 0], [47.4, 0], [48, .6]]), 0);
  kinetic('s5h', TEXTOS.s5_head, t, 30.35, 32.35, { x: 60, y: 330, size: 104, w: 960, align: 'center', times: [30.35, 30.45, 31.5, 31.85] });
  kinetic('s5k', 'Asesor con IA', t, 30.2, 32.25, { x: 60, y: 270, w: 960, size: 34, cls: 'kicker', align: 'center' });
  // resaltados sobre las respuestas reales
  const C = (R.chat || []);
  const q1 = (C[0] || {}).rects || {}, q2 = (C[1] || {}).rects || {}, q3 = (C[2] || {}).rects || {};
  const pick = (o, re) => { const k = Object.keys(o).find(k => re.test(k)); return k ? o[k] : null; };
  const tA1 = 35.1, tA2 = 42.0;
  let r;
  if ((r = pick(q1, /^V27$/))) highlight(w, 'q1v27', r[0], t, wt('modelo', 35) - .3, 37.65, { r: 6, pad: 4 });
  if ((r = pick(q1, /1\.000 km/))) marker(w, 'q1km', r, t, wt('viendo', 35) - .1, 37.65);
  if ((r = pick(q2, /100 ?% eléctric/))) marker(w, 'q2e', r, t, tA2 + .35, 44.65);
  if ((r = pick(q2, /motor a gasolina/))) marker(w, 'q2g', r, t, tA2 + .95, 44.65);
  if ((r = pick(q2, /orientarte/))) marker(w, 'q2o', r, t, tA2 + 1.6, 44.65);
  if ((r = pick(q3, /¿Cuántas personas/))) marker(w, 'q3p', r, t, 45.2, 47.4, { stagger: .22 });
  if ((r = pick(q3, /^4 puestos/))) highlight(w, 'q34', r[0], t, 45.8, 47.4, { r: 6, pad: 3 });
  if ((r = pick(q3, /^5 puestos/))) highlight(w, 'q35', r[0], t, 46.0, 47.4, { r: 6, pad: 3 });
  chip('s5c1', TEXTOS.s5_c1, t, wt('sabe', 35) - .2, 37.7, { x: 540, y: 250, anchor: 'center', from: 'top', size: 40 });
  chip('s5c2', TEXTOS.s5_c2, t, wt('compara', 38) - .15, 41.9, { x: 540, y: 250, anchor: 'center', from: 'top', size: 40 });
  chip('s5c3', TEXTOS.s5_c3, t, 42.2, 44.6, { x: 540, y: 250, anchor: 'center', from: 'top', size: 40 });
  chip('s5c4', TEXTOS.s5_c4, t, 44.85, 47.5, { x: 540, y: 250, anchor: 'center', from: 'top', size: 40 });
  const iaTag = el('s5ia', 'div', 'chip light'); iaTag.innerHTML = '<i></i><span>Respuestas reales del asistente · IA</span>';
  Object.assign(iaTag.style, { left: '540px', top: '1770px', fontSize: '26px', padding: '12px 22px 12px 18px', transform: 'translateX(-50%)', opacity: win01(t, 32.6, 47.2) * .92 });
}};
sfx('whoosh', 30.0); sfx('rise', 31.0); sfx('send', 34.1); sfx('pop', 35.15); sfx('shimmer', 36.9); sfx('send', 41.25); sfx('pop', 42.05); sfx('shimmer', 42.4); sfx('whoosh', 44.65); sfx('shimmer', 45.3);
// tecleo real: un "tick" por carácter dentro de los tramos de escritura
(function () { const C = (window.RECTS && RECTS.chat) || []; [[31.6, 34.05, (C[0] || { q: '' }).q], [38.3, 41.22, (C[1] || { q: '' }).q]].forEach(([a, b, q]) => { const n = Math.max(1, q.length); for (let i = 0; i < n; i++) sfx('key', a + (b - a - .35) * i / n); }); })();

// ---------------------------------------------------------------- S6 · CONVERSIÓN + CRM
const S6 = { t0: 48.0, t1: 58.2, draw(u, t) {
  const tB = 49.3, tC = 50.75, tCRM = 52.35;
  if (t < tCRM + .5) {
    let clip, ct, cam, label;
    if (t < tB) { clip = 'C06b_reserva_portal'; ct = seg(t, [[48.0, tB, 4.7, 6.2]]); cam = { fx: kf(t, [[48, 1000], [tB, 1010]]), fy: kf(t, [[48, 470], [tB, 480]]), s: kf(t, [[48.0, 3.0], [48.5, 2.1, 'o5'], [tB, 2.2]]) }; }
    else if (t < tC) { const td = cm('C06a_testdrive_datos', 'td_scroll', 8.07); clip = 'C06a_testdrive_datos'; ct = seg(t, [[tB, tC, td + 9.6, td + 11.6]]); cam = { fx: kf(t, [[tB, 760], [tC, 780]]), fy: kf(t, [[tB, 420], [tC, 440]]), s: kf(t, [[tB, 2.4], [tB + .45, 1.62, 'o5'], [tC, 1.7]]) }; }
    else { const ds = cm('C06a_testdrive_datos', 'datos_scroll', 22.99), de = cm('C06a_testdrive_datos', 'datos_end', 31.27); clip = 'C06a_testdrive_datos'; ct = seg(t, [[tC, tCRM, ds + 4.6, de - .2]]); cam = { fx: 640, fy: kf(t, [[tC, 400], [tCRM, 420]]), s: kf(t, [[tC, 2.6], [tC + .45, 1.75, 'o5'], [tCRM, 1.85]]) }; }
    const w = browserWin('w6', clip, ct, { opacity: 1 - prog(t, tCRM - .1, .55, 'io'), cam: { ...cam, s: cam.s * (1 - .35 * prog(t, tCRM - .2, .7, 'io')), px: 540, py: 1060 }, url: clip === 'C06b_reserva_portal' ? 'www.icaur.com.co/pedidos' : undefined, blur: kf(t, [[48.0, 8], [48.3, 0], [tB - .15, 0], [tB, 8], [tB + .3, 0], [tC - .15, 0], [tC, 8], [tC + .3, 0], [tCRM - .3, 0], [tCRM + .4, 12]]), tilt: { ry: kf(t, [[48, -6], [tCRM, 4]]) } });
    if (clip === 'C06b_reserva_portal') { highlight(w, 'res1', [894, 458, 287, 66], t, 48.55, tB, { r: 10 }); highlight(w, 'res2', [894, 542, 287, 52], t, 48.75, tB, { r: 26 }); }
  }
  scrims(t, .9, .0);
  kinetic('s6k', TEXTOS.s6_kicker, t, 48.1, tCRM - .2, { x: 80, y: 250, size: 34, cls: 'kicker' });
  chip('s6a', TEXTOS.s6_a, t, 48.25, tB - .05, { x: 80, y: 310, from: 'left', size: 46 });
  chip('s6b', TEXTOS.s6_b, t, tB, tC - .05, { x: 80, y: 310, from: 'left', size: 46 });
  chip('s6c', TEXTOS.s6_c, t, tC, tCRM - .05, { x: 80, y: 310, from: 'left', size: 46 });
  if (t >= tCRM - .2) crmFlow(t, tCRM);
}};
sfx('whoosh', 48.0); sfx('pop', 48.3); sfx('whoosh', 49.3); sfx('pop', 49.35); sfx('whoosh', 50.75); sfx('pop', 50.8); sfx('whoosh', 52.35);
[52.6, 52.8, 53.0].forEach(x => sfx('pop', x)); sfx('data', 53.3); sfx('data', 54.6); sfx('shimmer', 55.4); sfx('pop', 56.2);

// Gráfico explicativo del flujo de datos (no representa pantallas de ningún sistema)
function crmFlow(t, T) {
  const vis = 1 - prog(t, 57.9, .3, 'i');
  kinetic('crmh', TEXTOS.s6_crm_head, t, T + .1, 57.8, { x: 60, y: 240, w: 960, size: 84, align: 'center' });
  // tres tarjetas de origen con fotogramas reales de las tres acciones
  const srcs = [['C06b_reserva_portal', 6.0, 'Reserva'], ['C06a_testdrive_datos', cm('C06a_testdrive_datos', 'td_scroll', 8.07) + 6.5, 'Prueba de manejo'], ['C06a_testdrive_datos', cm('C06a_testdrive_datos', 'datos_scroll', 22.99) + 1.0, 'Tus datos']];
  srcs.forEach(([clip, ct, label], i) => {
    const p = prog(t, T + .25 + i * .18, .6, 'back');
    const x = 60 + i * 330, y = 520;
    const c = el('crmcard' + i, 'div', 'card', stage, `<img style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;border-radius:24px"><div class="lbl" style="left:0;right:0;bottom:-58px;text-align:center;font-size:30px;color:#fff"></div>`);
    setSrc(c.querySelector('img'), frameSrc(clip, ct)); c.querySelector('.lbl').textContent = label;
    Object.assign(c.style, { left: x + 'px', top: y + 'px', width: '300px', height: '190px', opacity: clamp(p * 1.4) * vis, transform: `translateY(${(1 - p) * 60}px) scale(${.8 + .2 * p})`, borderRadius: '24px', padding: 0 });
  });
  // nodos
  const node = (id, html, x, y, w, t0, accent) => {
    const p = prog(t, t0, .6, 'back'); const e = el(id, 'div', 'card', stage, html);
    Object.assign(e.style, { left: (x - w / 2) + 'px', top: y + 'px', width: w + 'px', padding: '30px 34px', boxSizing: 'border-box', textAlign: 'center', opacity: clamp(p * 1.4) * vis, transform: `scale(${.7 + .3 * p})`, border: accent ? '2px solid rgba(213,141,15,.85)' : '1.5px solid rgba(255,255,255,.14)', boxShadow: accent ? '0 0 60px rgba(213,141,15,.35), 0 30px 80px rgba(0,0,0,.5)' : '0 30px 80px rgba(0,0,0,.5)' });
    return e;
  };
  node('crmn1', '<div style="font:700 26px Inter;letter-spacing:.2em;color:#C5A57B">ICAUR</div><div style="font:800 46px Inter;letter-spacing:-.02em">Commercial Expert</div>', 540, 880, 620, T + .9, true);
  node('crmn2', '<div style="font:800 46px Inter;letter-spacing:-.02em">Gestión comercial · CRM</div><div style="font:500 28px Inter;color:#C5A57B;margin-top:6px">Contacto y modelo de interés</div>', 540, 1250, 700, T + 2.2, false);
  // conexiones con partículas
  const svg = el('crmsvg', 'svg', 'arrow', stage); svg.setAttribute('width', 1080); svg.setAttribute('height', 1920);
  if (!svg.dataset.b) { svg.innerHTML = [0, 1, 2].map(i => `<path class="ap" id="cp${i}" pathLength="1"/>`).join('') + '<path class="ap" id="cpm" pathLength="1"/>' + [0, 1, 2, 3, 4, 5].map(i => `<circle id="pt${i}" r="9" fill="#fff"/>`).join(''); svg.dataset.b = 1; }
  svg.style.opacity = vis; svg.style.zIndex = 35;
  const paths = [0, 1, 2].map(i => { const x = 210 + i * 330; return `M${x},${770} C${x},${830} 540,${820} 540,${880}`; });
  paths.forEach((d, i) => { const p = svg.querySelector('#cp' + i); p.setAttribute('d', d); p.style.strokeDashoffset = 1 - prog(t, T + .6 + i * .1, .5, 'io'); p.style.strokeWidth = 5; });
  const pm = svg.querySelector('#cpm'); pm.setAttribute('d', 'M540,1040 L540,1250'); pm.style.strokeDashoffset = 1 - prog(t, T + 1.6, .6, 'io'); pm.style.strokeWidth = 6;
  // puntos que viajan (datos)
  for (let i = 0; i < 6; i++) {
    const c = svg.querySelector('#pt' + i); const ph = ((t - T - 1.0) * .8 + i / 6) % 1;
    if (t < T + 1.0 || i >= 3 && t < T + 2.0) { c.style.opacity = 0; continue; }
    if (i < 3) { const x0 = 210 + i * 330; const q = ph; const x = (1 - q) ** 3 * x0 + 3 * (1 - q) ** 2 * q * x0 + 3 * (1 - q) * q * q * 540 + q ** 3 * 540; const y = (1 - q) ** 3 * 770 + 3 * (1 - q) ** 2 * q * 830 + 3 * (1 - q) * q * q * 820 + q ** 3 * 880; c.setAttribute('cx', x); c.setAttribute('cy', y); }
    else { c.setAttribute('cx', 540); c.setAttribute('cy', 1040 + 210 * ((ph * 1.6) % 1)); }
    c.style.opacity = Math.sin(Math.PI * ph);
  }
  chip('crmauth', '🔒 Solo con <b>tu autorización</b>', t, wt('autorización', 52) - .2, 57.8, { x: 540, y: 1080, anchor: 'center', size: 34, from: 'right' });
  chip('crmfollow', 'Seguimiento de un <b>asesor iCAUR</b>', t, wt('continuar', 52) - .1, 57.8, { x: 540, y: 1470, anchor: 'center', size: 38, from: 'bottom' });
  const note = el('crmnote', 'div', 'lbl'); note.textContent = 'Esquema ilustrativo del flujo de información';
  Object.assign(note.style, { left: '0', width: '1080px', textAlign: 'center', top: '1600px', fontSize: '24px', color: 'rgba(255,255,255,.45)', opacity: vis * prog(t, T + 1, .5) });
}

// ---------------------------------------------------------------- S7 · CIERRE
const S7 = { t0: 58.2, t1: 66.0, draw(u, t) {
  const r = prog(t, 58.2, .75, 'io') * 1400;
  const lb = el('lightbg', 'div', 'fade'); Object.assign(lb.style, { background: 'radial-gradient(120% 80% at 50% 45%, #FFFFFF 0%, #F8F7F4 55%, #EFE9E0 100%)', clipPath: `circle(${r}px at 50% 50%)`, opacity: 1, zIndex: 20 });
  const vg = document.querySelector('.vig'); vg.style.opacity = 1 - prog(t, 58.2, .6);
  const lp = prog(t, wt('iCAUR', 58) - .1, .8, 'o5');
  imgEl('s7logo', 'assets/logo-icaur-negro.png', 540 - 330, 640, 660, { opacity: lp, transform: `scale(${.9 + .1 * lp})`, filter: `blur(${(1 - lp) * 12}px)`, z: 75 });
  kinetic('s7ce', 'Commercial Expert', t, wt('Commercial', 58) - .15, 70, { x: 40, y: 860, w: 1000, align: 'center', size: 96, cls: 'dark' });
  const tg = TEXTOS.s7_tag;
  kinetic('s7tag', `${tg[0]} <b>·</b> ${tg[1]} <b>·</b> <em>${tg[2]}</em>`, t, 0, 70, { x: 40, y: 1060, w: 1000, size: 66, cls: 'dark mid', align: 'center', times: [wt('Explora', 58) - .1, wt('pregunta', 60) - .15, wt('pregunta', 60) - .1, wt('avanza', 60) - .15, wt('avanza', 60) - .1] });
  const pp = prog(t, 62.6, .7, 'back');
  const pill = el('s7url', 'div', 'chip'); pill.innerHTML = '<i></i><span>' + TEXTOS.url + '</span>';
  Object.assign(pill.style, { left: '540px', top: '1230px', fontSize: '32px', background: '#1B1F28', borderColor: '#D58D0F', zIndex: 76, transform: `translateX(-50%) scale(${.8 + .2 * pp})`, opacity: clamp(pp * 1.5) });
  const line = el('s7line', 'div', 'lbl'); Object.assign(line.style, { left: '390px', top: '1000px', height: '4px', width: (300 * prog(t, 59.8, .7, 'io')) + 'px', background: '#D58D0F', borderRadius: '4px', zIndex: 75 });
  cover('fadeout', '#F8F7F4', prog(t, 65.3, .7, 'io'));
}};
sfx('impact', 58.2); sfx('pop', 62.6); sfx('shimmer', 59.0);

SCENES = [S1, S2, S3, S4, S5, S6, S7];
window.SFX = SFX;
window.BG_OPTS = t => ({ glow: t < 6 ? 1.2 : 1, grid: t < 6 ? .7 : .45 });
