// =====================================================================
// Línea de tiempo · Chery Commercial Expert · versión HORIZONTAL 16:9 (1920×1080) — versión prioritaria
// Interfaz grande a la derecha, textos en columna izquierda. Paleta tomada de la plataforma Chery
// (acento #0069FF sobre grafito y blanco). Protagonista: Tiggo 9 CSH.
// =====================================================================
const M = window.MARKS || {}; const R = window.RECTS || {};
const TEXTOS = {
  s1_tag: 'Una nueva forma<br>de <em>explorar</em>.',
  s2_kicker: 'Hall digital', s2_head: 'Todo el<br><em>portafolio</em>',
  s2_models: [['Chery E5', 'E5'], ['Tiggo 4 CSH', 'tiggo4'], ['Tiggo 7 CSH', 'tiggo7'], ['Tiggo 8 CSH', 'tiggo8'], ['Tiggo 9 CSH', 'tiggo9']],
  s2_total: '<b>8</b> modelos en el showroom',
  s3_kicker: 'Visor 3D · Tiggo 9 CSH', s3_head: 'Explora<br>en <em>3D</em>',
  s3_c1: 'Rotación libre', s3_c2: '<b>5</b> colores', s3_c3: 'Puntos de interés',
  s4_list: ['Características', 'Seguridad', 'Autonomía', 'Precio', 'Financiación', 'Ficha técnica'],
  s5_head: '¿Tienes una<br><em>pregunta</em>?',
  s5_c1: 'Sabe qué modelo <b>estás viendo</b>', s5_c2: 'Compara <b>Tiggo 8 y Tiggo 9</b>', s5_c3: 'Te orienta según <b>tu uso</b>', s5_c4: 'Perfila tus <b>necesidades</b>',
  s6_kicker: 'Del interés a la acción', s6_a: '<b>01</b> · Reserva tu Chery', s6_b: '<b>02</b> · Prueba de manejo', s6_c: '<b>03</b> · Envía tus datos',
  s6_crm_head: 'Conectado con tu equipo <em>comercial</em>',
  s7_tag: ['Explora', 'Pregunta', 'Avanza'], url: 'chery.commercialexpert.denivodigital.com',
};
const LOGO_W = 'assets/logo-chery-blanco.svg', LOGO_K = 'assets/logo-chery-negro.svg';
function wt(word, after = 0) { const w = (window.WORDS || []).find(x => x.t[0] >= after - 0.01 && x.w.replace(/[¿?,.]/g, '').toLowerCase() === word.toLowerCase()); return w ? w.t[0] : after; }
function seg(t, segs) {
  for (const [t0, t1, c0, c1] of segs) if (t < t1) return t <= t0 ? c0 : c0 + (c1 - c0) * (t - t0) / (t1 - t0);
  return segs[segs.length - 1][3];
}
// inverso de seg(): tiempo de escenario en que el clip llega a c
function inv(segs, c) { for (const [t0, t1, c0, c1] of segs) if (c >= c0 && c <= c1) return t0 + (t1 - t0) * (c - c0) / Math.max(1e-6, c1 - c0); return segs[segs.length - 1][1]; }
const cm = (clip, label, def) => (M[clip] && M[clip][label] != null) ? M[clip][label] : def;
function scrims(t, top, left) {
  const a = el('scrimT', 'div', 'scrim'); Object.assign(a.style, { position: 'absolute', left: 0, top: 0, width: '1920px', height: '420px', zIndex: 30, background: 'linear-gradient(#090b10f0, #090b1088 50%, transparent)', opacity: top });
  const b = el('scrimL', 'div', 'scrim'); Object.assign(b.style, { position: 'absolute', left: 0, top: 0, width: '1150px', height: '1080px', zIndex: 30, background: 'linear-gradient(90deg, #090b10f2 0%, #090b10d0 45%, transparent)', opacity: left });
}
function imgEl(id, src, x, y, w, o = {}) {
  const e = el(id, 'img', 'logo'); setSrc(e, src);
  Object.assign(e.style, { left: x + 'px', top: y + 'px', width: w + 'px', opacity: o.opacity ?? 1, transform: o.transform || 'none', filter: o.filter || 'none', zIndex: o.z ?? 70, transformOrigin: o.origin || '50% 50%' });
  return e;
}
const SFX = []; const sfx = (type, t) => SFX.push({ type, t: +t.toFixed(3) });
const LX = 110;

// ---------------------------------------------------------------- S1 · IMPACTO
const S1 = { t0: 0, t1: 6.0, draw(u, t) {
  const ct = 0.1 + u * 0.05;
  const s = kf(u, [[0, .56], [1.3, .64, 'o5'], [4.5, .68, 'io'], [6.0, 2.2, 'io5']]);
  const fx = kf(u, [[0, 640], [4.5, 640, 'io5'], [6.0, 450]]), fy = kf(u, [[0, 400], [4.5, 400, 'io5'], [6.0, 400]]);
  const px = kf(u, [[0, 1500], [1.3, 1330, 'o5'], [4.5, 1320, 'io5'], [6.0, 960]]);
  const py = kf(u, [[0, 760], [1.3, 560, 'o5'], [4.5, 560, 'io5'], [6.0, 540]]);
  const tilt = { rx: kf(u, [[0, 16], [1.3, 6, 'o5'], [4.5, 3, 'io'], [5.7, 0]]), ry: kf(u, [[0, -28], [1.3, -14, 'o5'], [4.5, -10, 'io'], [5.7, 0]]), rz: kf(u, [[0, 3], [1.3, 0]]) };
  browserWin('w1', 'C01_hall', ct, { url: TEXTOS.url, cam: { fx, fy, s, px, py }, tilt, opacity: kf(u, [[0, 0], [.5, 1]]), blur: kf(u, [[4.7, 0], [5.35, 5], [6.0, 0]]) });
  const lp = prog(u, 1.2, .8, 'o5'), lo = prog(u, 4.4, .5, 'i');
  imgEl('s1logo', LOGO_W, LX, 320 - lo * 40, 560, { opacity: lp * (1 - lo), transform: `scale(${.86 + .14 * lp})`, origin: '0 50%', filter: `blur(${(1 - lp) * 14 + lo * 8}px) drop-shadow(0 8px 30px rgba(0,0,0,.5))` });
  kinetic('s1ce', 'Commercial<br>Expert', u, 2.15, 4.35, { x: LX, y: 420, w: 760, size: 104 });
  kinetic('s1tag', TEXTOS.s1_tag, u, wt('Una') - 0.1, 5.25, { x: LX, y: 680, w: 760, size: 60, cls: 'mid' });
  sweep(u, 1.05, .8);
  cover('fadein', '#000', 1 - prog(u, 0, .6, 'o'));
}};
sfx('impact', 1.2); sfx('whoosh', 5.0); sfx('rise', 4.3);

// ---------------------------------------------------------------- S2 · HALL: recorrido por el portafolio
const HALL = 'C01_hall';
const S2segs = () => [[6.0, 7.0, .2, 1.4], [7.0, 8.3, 1.4, 3.6], [8.3, 9.9, 3.6, 6.8], [9.9, 11.4, 6.8, 9.9], [11.4, 13.8, 9.9, Math.min(14.3, (CLIPS[HALL] || { dur: 14.4 }).dur - .05)]];
const S2 = { t0: 6.0, t1: 13.8, draw(u, t) {
  const SG = S2segs(); const ct = seg(t, SG);
  const s = kf(t, [[6.0, 2.2], [6.9, .95, 'io5'], [12.5, 1.0, 'io'], [13.3, 2.2, 'io5'], [13.8, 3.0]]);
  const fx = kf(t, [[6.0, 450], [6.9, 640, 'io5'], [12.5, 640, 'io'], [13.3, 450, 'io5']]);
  const fy = kf(t, [[6.0, 400], [13.3, 400], [13.8, 560]]);
  const px = kf(t, [[6.0, 960], [6.9, 1190, 'io5'], [12.5, 1190, 'io'], [13.3, 960, 'io5']]);
  const py = kf(t, [[6.0, 540], [6.9, 570, 'io5'], [12.5, 570, 'io'], [13.3, 540, 'io5']]);
  const tilt = { rx: kf(t, [[6.0, 0], [6.9, 3, 'io'], [12.5, 3], [13.3, 0]]), ry: kf(t, [[6.0, 0], [6.9, -9, 'io'], [12.5, -9], [13.3, 0]]) };
  const w = browserWin('w1', HALL, ct, { url: TEXTOS.url, cam: { fx, fy, s, px, py }, tilt, blur: kf(t, [[6.0, 4], [6.4, 0], [13.3, 0], [13.8, 9]]) });
  scrims(t, 0, kf(t, [[6.0, .95], [13.2, .95], [13.6, .4]]));
  kinetic('s2k', TEXTOS.s2_kicker, t, 6.25, 13.3, { x: LX, y: 200, size: 30, cls: 'kicker' });
  kinetic('s2h', TEXTOS.s2_head, t, 6.45, 13.3, { x: LX, y: 250, size: 96, w: 760 });
  // un chip por modelo, sincronizado con la llegada real a cada stand; el anterior se atenúa
  TEXTOS.s2_models.forEach(([label, mk], i) => {
    const tt = i === 0 ? 6.6 : inv(SG, cm(HALL, mk, 0) + 1.5) - .1;
    chip('s2m' + i, label, t, tt, 13.6, { x: LX, y: 500 + i * 80, from: 'left', size: 34 });
    const nextT = i < 4 ? inv(SG, cm(HALL, TEXTOS.s2_models[i + 1][1], 99) + 1.5) - .1 : 99;
    const e2 = document.getElementById('s2m' + i); if (e2 && t > nextT) e2.style.opacity = Math.min(+e2.style.opacity, 1 - .55 * prog(t, nextT, .3));
  });
  chip('s2tot', TEXTOS.s2_total, t, 12.3, 13.3, { x: LX, y: 920, from: 'left', size: 30, cls: 'light' });
  // flecha al botón "siguiente" en el primer clic y onda en cada clic real
  const [ax, ay] = w.map(850, 400);
  arrow('s2arr', [ax - 260, ay + 250], [ax - 30, ay + 26], t, 6.95, inv(SG, cm(HALL, 'tiggo4', 2.4)) + .1, { bend: .3 });
  ['tiggo4', 'tiggo7', 'tiggo8', 'tiggo9'].forEach((mk, i) => ping('s2p' + i, ax, ay, t, inv(SG, cm(HALL, mk, 0)) - .15));
}};
['tiggo4', 'tiggo7', 'tiggo8', 'tiggo9'].forEach(mk => { sfx('click', inv(S2segs(), cm(HALL, mk, 0)) - .15); sfx('pop', inv(S2segs(), cm(HALL, mk, 0)) - .05); });
sfx('pop', 6.6); sfx('whoosh', 13.35); sfx('pop', 12.3);

// ---------------------------------------------------------------- S3 · VISOR 3D (Tiggo 9 CSH)
const S3 = { t0: 13.8, t1: 21.6, draw(u, t) {
  const A = 'C03a_visor3d_rotacion', B = 'C03b_visor3d_colores_hotspot';
  const tB = 17.6, useB = t >= tB; const clip = useB ? B : A;
  const durA = (CLIPS[A] || { dur: 3.6 }).dur, durB = (CLIPS[B] || { dur: 5.7 }).dur;
  const ct = useB ? seg(t, [[tB, 21.6, 0, Math.min(durB - .05, 4.8)]]) : seg(t, [[13.8, 15.0, 0, .4], [15.0, tB, .4, durA - .05]]);
  const s = kf(t, [[13.8, 1.9], [14.8, 1.02, 'o5'], [tB, 1.08, 'io'], [18.1, 1.3, 'io'], [19.6, 1.3, 'io5'], [20.6, 1.5, 'io'], [21.6, 1.6]]);
  const fx = kf(t, [[13.8, 450], [14.8, 450, 'o5'], [tB, 450, 'io'], [18.1, 330, 'io'], [19.6, 330, 'io5'], [20.6, 470]]);
  const fy = kf(t, [[13.8, 340], [14.8, 360, 'o5'], [tB, 360, 'io'], [18.1, 470, 'io'], [19.6, 470, 'io5'], [20.6, 330]]);
  const tilt = { rx: kf(t, [[13.8, 8], [15.0, 2, 'o5'], [21.6, 0]]), ry: kf(t, [[13.8, -18], [15.0, -7, 'o5'], [tB, -5], [21.6, -2]]) };
  const w = browserWin('w3', clip, ct, { url: TEXTOS.url, cam: { fx, fy, s, px: 1260, py: 560 }, tilt, blur: kf(t, [[13.8, 10], [14.3, 0], [tB - .05, 0], [tB, 4], [tB + .15, 0], [21.2, 0], [21.6, 8]]) });
  fade(t, tB - .08, .16, '#fff', .35, 'flash3');
  scrims(t, 0, .9);
  kinetic('s3k', TEXTOS.s3_kicker, t, 14.0, 21.1, { x: LX, y: 300, size: 30, cls: 'kicker' });
  kinetic('s3h', TEXTOS.s3_head, t, 14.15, 21.1, { x: LX, y: 350, size: 110, w: 600 });
  chip('s3c1', TEXTOS.s3_c1, t, wt('exterior') - .4, 21.3, { x: LX, y: 640, from: 'left', size: 36 });
  chip('s3c2', TEXTOS.s3_c2, t, wt('color') - .2, 21.3, { x: LX, y: 730, from: 'left', size: 36 });
  chip('s3c3', TEXTOS.s3_c3, t, wt('puntos') - .2, 21.3, { x: LX, y: 820, from: 'left', size: 36 });
  if (useB) highlight(w, 'colors', [150, 572, 232, 42], t, 18.0, 19.9, { r: 20, pad: 6, fill: 0 });
}};
sfx('whoosh', 13.8); sfx('pop', 16.1); sfx('pop', 17.8); sfx('click', 18.45); sfx('click', 19.95); sfx('click', 20.95); sfx('pop', 19.2);

// ---------------------------------------------------------------- S4 · INTERIOR + MENÚ + PRECIO
const S4 = { t0: 21.6, t1: 30.0, draw(u, t) {
  const G = 'C04a_galeria_interior', P = 'C04b_menu_precio';
  const tSwitch = 24.2; const useP = t >= tSwitch;
  if (!useP) {
    const ct = seg(t, [[21.6, tSwitch, 0, Math.min((CLIPS[G] || { dur: 2.6 }).dur - .05, 2.6 * 1.25)]]);
    const s = kf(t, [[21.6, 1.7], [22.4, 1.04, 'o5'], [tSwitch, 1.1, 'io']]);
    browserWin('w4', G, ct, { url: TEXTOS.url, cam: { fx: kf(t, [[21.6, 450], [tSwitch, 470]]), fy: kf(t, [[21.6, 330], [tSwitch, 350]]), s, px: 1260, py: 560 }, tilt: { rx: kf(t, [[21.6, 6], [22.6, 2, 'o5']]), ry: kf(t, [[21.6, -16], [22.6, -6, 'o5']]) }, blur: kf(t, [[21.6, 9], [22.0, 0], [23.9, 0], [tSwitch, 8]]) });
  } else {
    const mk = M[P] || {}; const cMenu = mk.menu ?? .2, cSeg = mk.hover_Seguridad ?? 1.6, cAut = mk.hover_Autonomía ?? 2.2, cPre = mk.precio ?? 3.0, cAns = mk.answer ?? 5.0;
    const tAns = 28.3;
    const ct = seg(t, [[tSwitch, wt('seguridad', 24) + .1, Math.max(0, cMenu - .1), cSeg + .45], [wt('seguridad', 24) + .1, wt('autonomía', 24) + .1, cSeg + .45, cAut + .45], [wt('autonomía', 24) + .1, 27.2, cAut + .45, cPre + .9], [27.2, tAns, cPre + .9, cAns], [tAns, 30.0, cAns, cAns + 1.7]]);
    const rc = R.C04b || {}; const pan = [66, 195, 300, 315];
    const s = kf(t, [[tSwitch, 2.2], [24.7, 1.75, 'o5'], [27.0, 1.75, 'io'], [27.9, 1.6, 'io']]);
    const fx = kf(t, [[tSwitch, pan[0] + pan[2] / 2 + 60], [27.0, pan[0] + pan[2] / 2 + 60, 'io'], [27.9, 1090]]);
    const fy = kf(t, [[tSwitch, pan[1] + pan[3] / 2], [27.0, pan[1] + pan[3] / 2, 'io'], [27.9, 400]]);
    const px = kf(t, [[tSwitch, 1320], [27.0, 1320, 'io'], [27.9, 1340]]);
    const w = browserWin('w4', P, ct, { url: TEXTOS.url, cam: { fx, fy, s, px, py: 540 }, blur: kf(t, [[tSwitch, 10], [24.6, 0], [26.9, 0], [27.45, 6], [27.9, 0]]) });
    for (const [k, tt] of [['Seguridad', wt('seguridad', 24)], ['Autonomía', wt('autonomía', 24)]]) if (rc[k]) highlight(w, k, rc[k], t, tt - .05, 27.0, { r: 12, pad: 5 });
    if (rc.price && rc.price.length) marker(w, 'price', rc.price.slice(0, 2), t, tAns + .5, 30.0, { stagger: .35 });
  }
  scrims(t, 0, .9);
  kinetic('s4k', 'Detalle del producto', t, 21.85, 23.9, { x: LX, y: 330, size: 30, cls: 'kicker' });
  kinetic('s4h', 'Galería<br><em>interior</em>', t, 22.0, 23.9, { x: LX, y: 380, size: 104, w: 600 });
  const words = ['características', 'seguridad', 'autonomía', 'precio', 'financiación', 'ficha'];
  TEXTOS.s4_list.forEach((txt, i) => chip('s4l' + i, txt, t, wt(words[i], 23) - .1, 29.75, { x: LX, y: 230 + i * 104, size: 38, from: 'left' }));
}};
sfx('whoosh', 21.6); sfx('click', 22.55); sfx('click', 23.35); sfx('whoosh', 24.2); ['características', 'seguridad', 'autonomía', 'precio', 'financiación', 'ficha'].forEach(w => sfx('tick', wt(w, 23) - .05)); sfx('click', 27.2); sfx('shimmer', 28.8);

// ---------------------------------------------------------------- S5 · CHAT (protagonista)
const C5 = 'C05_chat'; const m5 = k => cm(C5, k, 0);
const S5segs = () => [
  [30.0, 31.6, 0.0, m5('q1_type')], [31.6, 34.05, m5('q1_type'), m5('q1_send')], [34.05, 35.1, m5('q1_send'), m5('q1_answer')],
  [35.1, 37.7, m5('q1_answer'), m5('q2_focus')], [37.7, 38.3, m5('q2_focus'), m5('q2_type')], [38.3, 41.22, m5('q2_type'), m5('q2_send')],
  [41.22, 42.0, m5('q2_send'), m5('q2_answer')], [42.0, 44.7, m5('q2_answer'), m5('q3_focus')],
  [44.7, 47.4, m5('q3_answer') + .2, m5('q3_answer') + 2.9], [47.4, 48.0, m5('q3_answer') + 2.9, m5('q3_answer') + 3.5]];
const S5 = { t0: 30.0, t1: 48.0, draw(u, t) {
  const ct = seg(t, S5segs());
  const s = kf(t, [[30.0, .78], [32.3, .84, 'io'], [33.2, 1.45, 'io5'], [33.6, 1.95, 'io'], [34.3, 1.95, 'io'], [35.1, 1.55, 'io5'], [37.6, 1.6, 'io'], [38.4, 1.95, 'io'], [41.3, 1.95, 'io'], [42.0, 1.55, 'io5'], [44.6, 1.6], [44.7, 1.7, 'o5'], [47.2, 1.6, 'io'], [48.0, .9, 'io5']]);
  const fx = kf(t, [[30.0, 640], [32.3, 660, 'io'], [33.2, 1080, 'io5'], [33.6, 1090, 'io'], [41.3, 1090], [42.0, 1080, 'io5'], [47.2, 1080, 'io'], [48.0, 800, 'io5']]);
  const fy = kf(t, [[30.0, 400], [32.3, 410, 'io'], [33.2, 400, 'io5'], [33.6, 520, 'io'], [34.3, 520, 'io'], [35.1, 420, 'io5'], [37.6, 400, 'io'], [38.4, 520, 'io'], [41.3, 520, 'io'], [42.0, 420, 'io5'], [44.6, 420], [44.7, 430, 'o5'], [47.2, 420, 'io'], [48.0, 400, 'io5']]);
  const px = kf(t, [[30.0, 1230], [32.3, 1230], [33.2, 1330, 'io5']]);
  const py = kf(t, [[30.0, 570], [32.3, 570], [33.2, 540, 'io5']]);
  const tilt = { rx: kf(t, [[30.0, 8], [32.3, 4, 'io'], [33.1, 0, 'io5'], [47.3, 0], [48.0, 5]]), ry: kf(t, [[30.0, -18], [32.3, -10, 'io'], [33.1, 0, 'io5'], [47.3, 0], [48.0, -10]]) };
  const w = browserWin('w5', C5, ct, { url: TEXTOS.url, cam: { fx, fy, s, px, py }, tilt, blur: kf(t, [[30.0, 8], [30.4, 0], [44.55, 0], [44.7, 10], [44.95, 0], [47.6, 0], [48.0, 8]]) });
  scrims(t, 0, kf(t, [[30, .9], [33.2, .95]]));
  kinetic('s5k', 'Asesor con IA', t, 30.2, 34.0, { x: LX, y: 330, size: 30, cls: 'kicker' });
  kinetic('s5h', TEXTOS.s5_head, t, 30.35, 34.1, { x: LX, y: 380, size: 104, w: 760, times: [30.35, 30.45, wt('Tienes', 30) - .05, wt('pregunta', 30) - .1] });
  const C = (R.chat || []);
  const q1 = (C[0] || {}).rects || {}, q2 = (C[1] || {}).rects || {}, q3 = (C[2] || {}).rects || {};
  const pick = (o, re) => { const k = Object.keys(o).find(k => re.test(k)); return k ? o[k] : null; };
  const tA2 = 42.0; let r;
  if ((r = pick(q1, /^Tiggo 9 CSH$/))) highlight(w, 'q1m', r[0], t, wt('modelo', 35) - .3, 37.65, { r: 6, pad: 4 });
  if ((r = pick(q1, /^que estás viendo/))) marker(w, 'q1v', r, t, wt('viendo', 35) - .15, 37.65);
  if ((r = pick(q1, /^1\.400 km/))) marker(w, 'q1km', r, t, wt('viendo', 35) + .25, 37.65);
  if ((r = pick(q2, /^híbridos enchufables/))) marker(w, 'q2h', r, t, tA2 + .35, 44.65);
  if ((r = pick(q2, /^tracción integral/))) marker(w, 'q2t', r, t, tA2 + .95, 44.65, { stagger: .2 });
  if ((r = pick(q3, /^¿[Cc]uántas personas/))) marker(w, 'q3p', r, t, 45.2, 47.4, { stagger: .22 });
  if ((r = pick(q3, /^7 puestos/))) highlight(w, 'q37', r[0], t, 45.6, 47.4, { r: 6, pad: 3 });
  if ((r = pick(q3, /^tracción 4WD/))) highlight(w, 'q34', r[0], t, 45.9, 47.4, { r: 6, pad: 3 });
  const cy = 520;
  chip('s5c1', TEXTOS.s5_c1, t, wt('sabe', 35) - .2, 37.7, { x: LX, y: cy, from: 'left', size: 44 });
  chip('s5c2', TEXTOS.s5_c2, t, wt('compara', 38) - .15, 41.9, { x: LX, y: cy, from: 'left', size: 44 });
  chip('s5c3', TEXTOS.s5_c3, t, 42.2, 44.6, { x: LX, y: cy, from: 'left', size: 44 });
  chip('s5c4', TEXTOS.s5_c4, t, 44.85, 47.5, { x: LX, y: cy, from: 'left', size: 44 });
  kinetic('s5q', 'Chery <em>Expert</em>', t, 34.4, 47.4, { x: LX, y: 380, size: 84, w: 760 });
  const iaTag = el('s5ia', 'div', 'chip light'); iaTag.innerHTML = '<i></i><span>Respuestas reales del asistente · IA</span>';
  Object.assign(iaTag.style, { left: LX + 'px', top: '640px', fontSize: '26px', padding: '12px 22px 12px 18px', opacity: win01(t, 32.6, 47.2) * .92 });
}};
sfx('whoosh', 30.0); sfx('rise', 31.0); sfx('send', 34.1); sfx('pop', 35.15); sfx('shimmer', 36.9); sfx('send', 41.25); sfx('pop', 42.05); sfx('shimmer', 42.4); sfx('whoosh', 44.65); sfx('shimmer', 45.3);
(function () { const C = (window.RECTS && RECTS.chat) || []; [[31.6, 34.05, (C[0] || { q: '' }).q], [38.3, 41.22, (C[1] || { q: '' }).q]].forEach(([a, b, q]) => { const n = Math.max(1, q.length); for (let i = 0; i < n; i++) sfx('key', a + (b - a - .35) * i / n); }); })();

// ---------------------------------------------------------------- S6 · CONVERSIÓN + CRM
const S6 = { t0: 48.0, t1: 58.2, draw(u, t) {
  const tB = 49.3, tC = 50.75, tCRM = 52.35;
  if (t < tCRM + .5) {
    let clip, ct, cam, url;
    if (t < tB) { clip = 'C06b_reserva_portal'; url = 'www.chery.com.co/pedidos'; ct = seg(t, [[48.0, tB, .05, .95]]); cam = { fx: kf(t, [[48, 980], [tB, 1000]]), fy: kf(t, [[48, 470], [tB, 480]]), s: kf(t, [[48.0, 2.3], [48.5, 1.45, 'o5'], [tB, 1.52]]) }; }
    else if (t < tC) { const td = cm('C06a_testdrive_datos', 'td_scroll', 8.35); clip = 'C06a_testdrive_datos'; url = TEXTOS.url; ct = seg(t, [[tB, tC, td + 1.8, td + 4.0]]); cam = { fx: kf(t, [[tB, 640], [tC, 640]]), fy: kf(t, [[tB, 420], [tC, 430]]), s: kf(t, [[tB, 2.0], [tB + .45, 1.3, 'o5'], [tC, 1.36]]) }; }
    else { const ds = cm('C06a_testdrive_datos', 'datos_scroll', 18.43), de = cm('C06a_testdrive_datos', 'datos_end', 23.56); clip = 'C06a_testdrive_datos'; url = TEXTOS.url; ct = seg(t, [[tC, tCRM, ds + .5, de - .3]]); cam = { fx: 640, fy: kf(t, [[tC, 400], [tCRM, 410]]), s: kf(t, [[tC, 2.0], [tC + .45, 1.35, 'o5'], [tCRM, 1.42]]) }; }
    const w = browserWin('w6', clip, ct, { url, opacity: 1 - prog(t, tCRM - .1, .55, 'io'), cam: { ...cam, s: cam.s * (1 - .35 * prog(t, tCRM - .2, .7, 'io')), px: 1250, py: 560 }, blur: kf(t, [[48.0, 8], [48.3, 0], [tB - .15, 0], [tB, 8], [tB + .3, 0], [tC - .15, 0], [tC, 8], [tC + .3, 0], [tCRM - .3, 0], [tCRM + .4, 12]]), tilt: { ry: kf(t, [[48, -8], [tCRM, -2]]) } });
    if (clip === 'C06b_reserva_portal') { highlight(w, 'res1', [826, 598, 300, 50], t, 48.5, tB, { r: 10 }); highlight(w, 'res3', [832, 718, 416, 56], t, 48.8, tB, { r: 12 }); }
  }
  scrims(t, 0, kf(t, [[48, .95], [tCRM, .95], [tCRM + .5, 0]]));
  kinetic('s6k', TEXTOS.s6_kicker, t, 48.1, tCRM - .2, { x: LX, y: 400, size: 30, cls: 'kicker' });
  chip('s6a', TEXTOS.s6_a, t, 48.25, tB - .05, { x: LX, y: 460, from: 'left', size: 46 });
  chip('s6b', TEXTOS.s6_b, t, tB, tC - .05, { x: LX, y: 460, from: 'left', size: 46 });
  chip('s6c', TEXTOS.s6_c, t, tC, tCRM - .05, { x: LX, y: 460, from: 'left', size: 46 });
  if (t >= tCRM - .2) crmFlow(t, tCRM);
}};
sfx('whoosh', 48.0); sfx('pop', 48.3); sfx('whoosh', 49.3); sfx('pop', 49.35); sfx('whoosh', 50.75); sfx('pop', 50.8); sfx('whoosh', 52.35);
[52.6, 52.8, 53.0].forEach(x => sfx('pop', x)); sfx('data', 53.3); sfx('data', 54.6); sfx('shimmer', 55.4); sfx('pop', 56.2);
// Esquema explicativo (horizontal): acciones -> Commercial Expert -> CRM. No representa pantallas de ningún sistema.
function crmFlow(t, T) {
  const vis = 1 - prog(t, 57.9, .3, 'i');
  kinetic('crmh', TEXTOS.s6_crm_head, t, T + .1, 57.8, { x: 60, y: 90, w: 1800, size: 72, align: 'center' });
  const srcs = [['C06b_reserva_portal', .4, 'Reserva'], ['C06a_testdrive_datos', cm('C06a_testdrive_datos', 'td_scroll', 8.35) + 3.0, 'Prueba de manejo'], ['C06a_testdrive_datos', cm('C06a_testdrive_datos', 'datos_scroll', 18.43) + .2, 'Tus datos']];
  const CY = [300, 520, 740];
  srcs.forEach(([clip, ct, label], i) => {
    const p = prog(t, T + .25 + i * .18, .6, 'back');
    const c = el('crmcard' + i, 'div', 'card', stage, `<img style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;border-radius:22px"><div class="lbl" style="left:-250px;width:230px;top:62px;text-align:right;font-size:30px;color:#fff"></div>`);
    setSrc(c.querySelector('img'), frameSrc(clip, ct)); c.querySelector('.lbl').textContent = label;
    Object.assign(c.style, { left: '360px', top: (CY[i] - 80) + 'px', width: '260px', height: '162px', opacity: clamp(p * 1.4) * vis, transform: `translateX(${(1 - p) * -60}px) scale(${.8 + .2 * p})`, borderRadius: '22px', padding: 0 });
  });
  const node = (id, html, x, y, w, t0, accent) => {
    const p = prog(t, t0, .6, 'back'); const e = el(id, 'div', 'card', stage, html);
    Object.assign(e.style, { left: (x - w / 2) + 'px', top: y + 'px', width: w + 'px', padding: '30px 34px', boxSizing: 'border-box', textAlign: 'center', opacity: clamp(p * 1.4) * vis, transform: `scale(${.7 + .3 * p})`, border: accent ? '2px solid rgba(0,105,255,.9)' : '1.5px solid rgba(255,255,255,.14)', boxShadow: accent ? '0 0 60px rgba(0,105,255,.4), 0 30px 80px rgba(0,0,0,.5)' : '0 30px 80px rgba(0,0,0,.5)' });
  };
  node('crmn1', '<div style="font:700 24px Inter;letter-spacing:.2em;color:#9DB5DB">CHERY</div><div style="font:800 42px Inter;letter-spacing:-.02em">Commercial Expert</div>', 960, 465, 470, T + .9, true);
  node('crmn2', '<div style="font:800 42px Inter;letter-spacing:-.02em">Gestión comercial · CRM</div><div style="font:500 26px Inter;color:#9DB5DB;margin-top:6px">Contacto y modelo de interés</div>', 1540, 455, 560, T + 2.2, false);
  const svg = el('crmsvg', 'svg', 'arrow', stage); svg.setAttribute('width', 1920); svg.setAttribute('height', 1080);
  if (!svg.dataset.b) { svg.innerHTML = [0, 1, 2].map(i => `<path class="ap" id="cp${i}" pathLength="1"/>`).join('') + '<path class="ap" id="cpm" pathLength="1"/>' + [0, 1, 2, 3, 4, 5].map(i => `<circle id="pt${i}" r="9" fill="#fff"/>`).join(''); svg.dataset.b = 1; }
  svg.style.opacity = vis; svg.style.zIndex = 35;
  const P0 = i => [620, CY[i]], P1 = [725, 540];
  [0, 1, 2].forEach(i => { const [x0, y0] = P0(i); const p = svg.querySelector('#cp' + i); p.setAttribute('d', `M${x0},${y0} C${x0 + 60},${y0} ${P1[0] - 60},${P1[1]} ${P1[0]},${P1[1]}`); p.style.strokeDashoffset = 1 - prog(t, T + .6 + i * .1, .5, 'io'); p.style.strokeWidth = 5; });
  const pm = svg.querySelector('#cpm'); pm.setAttribute('d', 'M1195,540 L1260,540'); pm.style.strokeDashoffset = 1 - prog(t, T + 1.6, .6, 'io'); pm.style.strokeWidth = 6;
  for (let i = 0; i < 6; i++) {
    const c = svg.querySelector('#pt' + i); const ph = ((t - T - 1.0) * .8 + i / 6) % 1;
    if (t < T + 1.0 || i >= 3 && t < T + 2.0) { c.style.opacity = 0; continue; }
    if (i < 3) { const [x0, y0] = P0(i), q = ph; const bx = (a, b, c2, d) => (1 - q) ** 3 * a + 3 * (1 - q) ** 2 * q * b + 3 * (1 - q) * q * q * c2 + q ** 3 * d; c.setAttribute('cx', bx(x0, x0 + 60, P1[0] - 60, P1[0])); c.setAttribute('cy', bx(y0, y0, P1[1], P1[1])); }
    else { c.setAttribute('cx', 1195 + 65 * ((ph * 1.6) % 1)); c.setAttribute('cy', 540); }
    c.style.opacity = Math.sin(Math.PI * ph);
  }
  chip('crmauth', '🔒 Solo con <b>tu autorización</b>', t, wt('autorización', 52) - .2, 57.8, { x: 1228, y: 650, anchor: 'center', size: 32, from: 'bottom' });
  chip('crmfollow', 'Seguimiento de un <b>asesor Chery</b>', t, wt('continuar', 52) - .1, 57.8, { x: 1540, y: 790, anchor: 'center', size: 34, from: 'bottom' });
  const note = el('crmnote', 'div', 'lbl'); note.textContent = 'Esquema ilustrativo del flujo de información';
  Object.assign(note.style, { left: '0', width: '1920px', textAlign: 'center', top: '1000px', fontSize: '22px', color: 'rgba(255,255,255,.45)', opacity: vis * prog(t, T + 1, .5) });
}

// ---------------------------------------------------------------- S7 · CIERRE
const S7 = { t0: 58.2, t1: 66.0, draw(u, t) {
  const r = prog(t, 58.2, .75, 'io') * 1300;
  const lb = el('lightbg', 'div', 'fade'); Object.assign(lb.style, { background: 'radial-gradient(90% 90% at 50% 45%, #FFFFFF 0%, #F4F6F9 55%, #E6EBF2 100%)', clipPath: `circle(${r}px at 50% 50%)`, opacity: 1, zIndex: 20 });
  const vg = document.querySelector('.vig'); vg.style.opacity = 1 - prog(t, 58.2, .6);
  const lp = prog(t, wt('Chery', 58) - .1, .8, 'o5');
  imgEl('s7logo', LOGO_K, 960 - 360, 300, 720, { opacity: lp, transform: `scale(${.9 + .1 * lp})`, filter: `blur(${(1 - lp) * 12}px)`, z: 75 });
  kinetic('s7ce', 'Commercial Expert', t, wt('Commercial', 58) - .15, 70, { x: 60, y: 430, w: 1800, align: 'center', size: 92, cls: 'dark' });
  const tg = TEXTOS.s7_tag;
  kinetic('s7tag', `${tg[0]} <b>·</b> ${tg[1]} <b>·</b> <em>${tg[2]}</em>`, t, 0, 70, { x: 60, y: 610, w: 1800, size: 60, cls: 'dark mid', align: 'center', times: [wt('explora', 58) - .1, wt('pregunta', 60) - .15, wt('pregunta', 60) - .1, wt('avanza', 60) - .15, wt('avanza', 60) - .1] });
  const pp = prog(t, 62.4, .7, 'back');
  const pill = el('s7url', 'div', 'chip'); pill.innerHTML = '<i></i><span>' + TEXTOS.url + '</span>';
  Object.assign(pill.style, { left: '960px', top: '760px', fontSize: '30px', background: '#0B0E14', borderColor: '#0069FF', zIndex: 76, transform: `translateX(-50%) scale(${.8 + .2 * pp})`, opacity: clamp(pp * 1.5) });
  const line = el('s7line', 'div', 'lbl'); Object.assign(line.style, { left: '810px', top: '565px', height: '4px', width: (300 * prog(t, 59.8, .7, 'io')) + 'px', background: '#0069FF', borderRadius: '4px', zIndex: 75 });
  cover('fadeout', '#F4F6F9', prog(t, 65.3, .7, 'io'));
}};
sfx('impact', 58.2); sfx('pop', 62.4); sfx('shimmer', 59.0);

SCENES = [S1, S2, S3, S4, S5, S6, S7];
window.SFX = SFX;
window.BG_OPTS = t => ({ glow: t < 6 ? 1.2 : 1, grid: t < 6 ? .7 : .45 });
