// Librería de captura: cursor visible, grabación en tiempo real (screencast CDP)
// y grabación fotograma a fotograma con tiempo virtual (para WebGL/3D).
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');

const URL_CE = 'https://icaur.commercialexpert.denivodigital.com/';
const FPS = 30;
// Captura en cámara lenta: todo ocurre SLOW veces más lento y luego se reproduce a velocidad normal
const SLOW = +(process.env.SLOW || 1);
const wait = (page, ms) => page.waitForTimeout(ms * SLOW);

// Cursor + onda de clic inyectados en la página (solo visual, sin pointer-events)
const CURSOR_JS = `
(() => {
  const vt = window.__vt = { on:false, now:0, base:0, dbase:0, q:[], id:1 };
  const rRaf = window.requestAnimationFrame.bind(window);
  const rCaf = window.cancelAnimationFrame.bind(window);
  const rNow = performance.now.bind(performance);
  const rDate = Date.now;
  performance.now = () => vt.on ? vt.now : rNow();
  Date.now = () => vt.on ? vt.dbase + (vt.now - vt.base) : rDate();
  window.requestAnimationFrame = (cb) => { if (vt.on) { const id = 1e6 + (vt.id++); vt.q.push([id, cb]); return id; } return rRaf(cb); };
  window.cancelAnimationFrame = (id) => { vt.q = vt.q.filter(x => x[0] !== id); rCaf(id); };
  vt.enable = () => { vt.now = rNow(); vt.base = vt.now; vt.dbase = rDate(); vt.on = true; };
  vt.disable = () => { const q = vt.q; vt.q = []; vt.on = false; q.forEach(([id, cb]) => rRaf(cb)); };
  vt.step = (ms) => { vt.now += ms; const q = vt.q; vt.q = []; for (const [id, cb] of q) { try { cb(vt.now); } catch (e) { console.error(e); } } };
  const install = () => {
    if (document.getElementById('__cur')) return;
    const st = document.createElement('style');
    st.textContent = '#__cur{position:fixed;left:0;top:0;width:30px;height:30px;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px);transition:opacity .25s;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}' +
      '.__rip{position:fixed;z-index:2147483646;pointer-events:none;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;border:3px solid #D58D0F;background:rgba(213,141,15,.25);animation:__r .55s ease-out forwards}' +
      '@keyframes __r{to{transform:scale(4.2);opacity:0}}';
    document.documentElement.appendChild(st);
    const c = document.createElement('div'); c.id = '__cur';
    c.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 22 L14.6 20.7 L11.7 14.2 L18 14.2 Z" fill="#fff" stroke="#1B1F28" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    document.documentElement.appendChild(c);
    addEventListener('mousemove', e => { c.style.transform = 'translate(' + (e.clientX - 4) + 'px,' + (e.clientY - 2) + 'px)'; }, true);
    addEventListener('mousedown', e => { const r = document.createElement('div'); r.className = '__rip'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.documentElement.appendChild(r); setTimeout(() => r.remove(), 700); c.firstChild.style.transform='scale(.85)'; }, true);
    addEventListener('mouseup', () => { c.firstChild.style.transform=''; }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
  window.__hideCursor = (h) => { const c = document.getElementById('__cur'); if (c) c.style.opacity = h ? 0 : 1; };
})();`;

async function launch({ width = 1280, height = 800, dsf = 2 } = {}) {
  const browser = await chromium.launch({ args: [...(dsf > 1 ? ['--force-device-scale-factor=' + dsf] : []), '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars'] });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf, locale: 'es-CO', timezoneId: 'America/Bogota' });
  await ctx.addInitScript(CURSOR_JS);
  // Bloquea analítica de terceros para no ensuciar métricas del cliente
  await ctx.route(/googletagmanager|google-analytics/, r => r.abort());
  const page = await ctx.newPage();
  return { browser, ctx, page };
}

// Entra a la experiencia: autorización mínima obligatoria (sin contacto comercial ni publicidad) y salta el tour
async function enter(page) {
  await page.goto(URL_CE, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(5000);
  const cb = page.locator('input[type=checkbox]').first();
  if (await cb.isVisible().catch(() => false)) {
    await cb.check({ force: true });
    await page.getByText('Continuar con lo seleccionado').click();
    await page.waitForTimeout(1500);
  }
  await skipTour(page);
}
async function skipTour(page) {
  const s = page.getByText('Saltar', { exact: true });
  if (await s.isVisible().catch(() => false)) { await s.click(); await page.waitForTimeout(700); }
}

const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
let mouse = { x: 640, y: 400 };
// Movimiento humano del cursor (curva suave). En modo virtual, onStep captura cada fotograma.
async function glide(page, x, y, ms = 700, onStep = null) {
  const n = Math.max(2, Math.round(ms / (1000 / FPS)));
  const stepMs = onStep ? 0 : (1000 / FPS) * SLOW;
  const x0 = mouse.x, y0 = mouse.y; const bend = (Math.random() - .5) * 60;
  for (let i = 1; i <= n; i++) {
    const t = ease(i / n);
    const px = x0 + (x - x0) * t + Math.sin(Math.PI * t) * bend * 0.4, py = y0 + (y - y0) * t - Math.sin(Math.PI * t) * bend * 0.25;
    await page.mouse.move(px, py);
    if (onStep) await onStep(); else await page.waitForTimeout(stepMs);
  }
  mouse = { x, y };
}
async function center(page, locator) { const b = await locator.boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2]; }
async function clickOn(page, locator, ms = 700, onStep = null) {
  const [x, y] = await center(page, locator);
  await glide(page, x, y, ms, onStep);
  await page.mouse.down(); if (onStep) await onStep(); else await page.waitForTimeout(70 * SLOW);
  await page.mouse.up();
}

// --- Grabación en tiempo real con CDP screencast -> MP4 30 fps CFR
class RealtimeRecorder {
  constructor(ctx, page, outDir, name) { this.ctx = ctx; this.page = page; this.dir = path.join(outDir, '_frames_' + name); this.name = name; this.out = path.join(outDir, name + '.mp4'); this.frames = []; this.marks = []; }
  async start() {
    fs.rmSync(this.dir, { recursive: true, force: true }); fs.mkdirSync(this.dir, { recursive: true });
    this.cdp = await this.ctx.newCDPSession(this.page);
    this.cdp.on('Page.screencastFrame', async f => {
      const i = this.frames.length; const file = path.join(this.dir, String(i).padStart(6, '0') + '.jpg');
      fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
      this.frames.push({ file, ts: f.metadata.timestamp });
      try { await this.cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) { }
    });
    if (SLOW > 1) {
      await this.cdp.send('Animation.enable');
      await this.cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / SLOW });
      await this.page.evaluate((r) => {
        const fix = v => { v.defaultPlaybackRate = r; v.playbackRate = r; };
        document.querySelectorAll('video').forEach(fix);
        document.addEventListener('play', e => { if (e.target.tagName === 'VIDEO') fix(e.target); }, true);
        document.addEventListener('loadedmetadata', e => { if (e.target.tagName === 'VIDEO') fix(e.target); }, true);
      }, 1 / SLOW);
    }
    const vp = this.page.viewportSize(); const dsf = await this.page.evaluate(() => devicePixelRatio);
    await this.cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: vp.width * dsf, maxHeight: vp.height * dsf, everyNthFrame: 1 });
    this.t0 = Date.now() / 1000;
    // Fuerza repintado periódico para que haya fotogramas aun sin cambios
    this.keep = setInterval(() => this.page.evaluate(() => { document.documentElement.style.outlineColor = 'rgba(0,0,0,' + (Math.random() * 0.001) + ')'; }).catch(() => { }), 200);
  }
  mark(label) { this.marks.push({ label, t: Date.now() / 1000 - this.t0 }); console.log('  mark', label, (Date.now() / 1000 - this.t0).toFixed(2)); }
  async stop() {
    clearInterval(this.keep);
    await this.cdp.send('Page.stopScreencast');
    await new Promise(r => setTimeout(r, 300));
    const T0 = this.frames[0].ts; const tEnd = Date.now() / 1000 - this.t0;
    const offset = this.frames[0].ts - (this.t0); // screencast ts is wall-clock seconds
    const lines = [];
    for (let i = 0; i < this.frames.length; i++) {
      const d = (i + 1 < this.frames.length ? this.frames[i + 1].ts : this.frames[i].ts + 1 / FPS) - this.frames[i].ts;
      lines.push(`file '${this.frames[i].file}'`, `duration ${Math.max(d / SLOW, 0.0005).toFixed(5)}`);
    }
    lines.push(`file '${this.frames[this.frames.length - 1].file}'`);
    fs.writeFileSync(this.dir + '/list.txt', lines.join('\n'));
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', this.dir + '/list.txt', '-vf', `fps=${FPS},scale=trunc(iw/2)*2:trunc(ih/2)*2`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', this.out]);
    // marcas relativas al primer fotograma
    const shift = T0 - this.t0;
    fs.writeFileSync(this.out.replace('.mp4', '.marks.json'), JSON.stringify({ firstFrameOffset: shift, slow: SLOW, marks: this.marks.map(m => ({ ...m, t: +((m.t - shift) / SLOW).toFixed(3) })) }, null, 1));
    console.log(`  ${this.name}: ${this.frames.length} frames, ${((this.frames.at(-1).ts - T0) / SLOW).toFixed(1)} s (x${SLOW}) -> ${this.out}`);
  }
}

// --- Grabación fotograma a fotograma con tiempo virtual (3D fluido aunque el render sea lento)
class VirtualRecorder {
  constructor(page, outDir, name) { this.page = page; this.dir = path.join(outDir, '_frames_' + name); this.out = path.join(outDir, name + '.mp4'); this.n = 0; this.marks = []; this.name = name; }
  async start() {
    fs.rmSync(this.dir, { recursive: true, force: true }); fs.mkdirSync(this.dir, { recursive: true });
    this.cdp = await this.page.context().newCDPSession(this.page);
    await this.page.evaluate(() => window.__vt.enable());
    await this.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 50 }); // calentamiento
  }
  mark(label) { this.marks.push({ label, t: +(this.n / FPS).toFixed(3) }); console.log('  mark', label, (this.n / FPS).toFixed(2)); }
  frame = async () => {
    await this.page.evaluate(ms => window.__vt.step(ms), 1000 / FPS);
    await this.page.evaluate(() => new Promise(r => setTimeout(r, 0)));
    const { data } = await this.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 92 });
    fs.writeFileSync(path.join(this.dir, String(this.n).padStart(6, '0') + '.jpg'), Buffer.from(data, 'base64'));
    if (this.n % 30 === 0) console.log('   frame', this.n, new Date().toISOString().slice(11, 19));
    this.n++;
  }
  async hold(sec) { const k = Math.round(sec * FPS); for (let i = 0; i < k; i++) await this.frame(); }
  async stop() {
    await this.page.evaluate(() => window.__vt.disable());
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', this.dir + '/%06d.jpg', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', this.out]);
    fs.writeFileSync(this.out.replace('.mp4', '.marks.json'), JSON.stringify({ firstFrameOffset: 0, marks: this.marks }, null, 1));
    console.log(`  ${this.name}: ${this.n} frames -> ${this.out}`);
  }
}

// Rectángulos (coordenadas CSS) de frases dentro de un contenedor, para resaltados en postproducción
async function phraseRects(page, selector, phrases) {
  return page.evaluate(([sel, phrases]) => {
    const root = sel ? document.querySelector(sel) : document.body; const out = {};
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const ph of phrases) {
      for (const n of nodes.reverse ? nodes.slice().reverse() : nodes) {
        const i = n.textContent.indexOf(ph); if (i < 0) continue;
        const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + ph.length);
        out[ph] = [...r.getClientRects()].map(q => [q.x, q.y, q.width, q.height]); break;
      }
    }
    return out;
  }, [selector, phrases]);
}

module.exports = { SLOW, wait, launch, enter, skipTour, glide, clickOn, center, RealtimeRecorder, VirtualRecorder, phraseRects, FPS, URL_CE, setMouse: (x, y) => { mouse = { x, y }; } };
