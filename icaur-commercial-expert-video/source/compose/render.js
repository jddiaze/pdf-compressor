// Render fotograma a fotograma de comp.html -> MP4 (sin audio), con trabajadores en paralelo.
// Uso: node source/compose/render.js [--from 0] [--to 65.4] [--workers 3] [--out final/_video_sin_audio.mp4] [--stills 1,5.5,12]
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs'); const { spawn, execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const TL = JSON.parse(fs.readFileSync(path.join(ROOT, 'source/timeline_master.json')));
const FPS = 30;
const from = Math.round(+arg('from', 0) * FPS), to = Math.round(+arg('to', TL.duration) * FPS);
const workers = +arg('workers', 3);
const out = path.resolve(ROOT, arg('out', 'final/_video_sin_audio.mp4'));
const stills = arg('stills', null);
const COMP = 'file://' + path.join(__dirname, 'comp.html');

async function openPage() {
  const b = await chromium.launch({ args: ['--disable-web-security', '--allow-file-access-from-files', '--font-render-hinting=none'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('PAGEERR', e.message));
  p.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  if (arg('notext', null)) await p.addInitScript(() => { window.NO_TEXT = true; });
  await p.goto(COMP); await p.evaluate(() => document.fonts.ready);
  const cdp = await p.context().newCDPSession(p);
  return { b, p, cdp };
}
async function shot(p, cdp, n) {
  await p.evaluate(n => window.renderFrame(n), n);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 }, optimizeForSpeed: false });
  return Buffer.from(data, 'base64');
}
async function renderRange(a, b, file, wi) {
  const { b: br, p, cdp } = await openPage();
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-r', String(FPS), file]);
  const t0 = Date.now();
  for (let n = a; n < b; n++) {
    const buf = await shot(p, cdp, n);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((n - a) % 90 === 0) console.log(`  w${wi} ${n}/${b} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await br.close();
}
(async () => {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  { const { b, p } = await openPage(); fs.writeFileSync(path.join(ROOT, 'source/sfx_events.json'), JSON.stringify(await p.evaluate(() => window.SFX), null, 0)); await b.close(); }
  if (arg('sfx-only', null)) return;
  if (stills) {
    const { b, p, cdp } = await openPage();
    for (const s of stills.split(',')) { const n = Math.round(+s * FPS); fs.writeFileSync(path.join(ROOT, `final/_still_${s}.jpg`), await shot(p, cdp, n)); console.log('still', s); }
    await b.close(); return;
  }
  const tmp = path.join(ROOT, 'final/_parts'); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  const per = Math.ceil((to - from) / workers); const jobs = [];
  for (let w = 0; w < workers; w++) { const a = from + w * per, b = Math.min(to, a + per); if (a < b) jobs.push(renderRange(a, b, path.join(tmp, `p${w}.mp4`), w)); }
  await Promise.all(jobs);
  fs.writeFileSync(path.join(tmp, 'list.txt'), jobs.map((_, w) => `file 'p${w}.mp4'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-c', 'copy', out]);
  console.log('OK', out);
})().catch(e => { console.error(e); process.exit(1); });
