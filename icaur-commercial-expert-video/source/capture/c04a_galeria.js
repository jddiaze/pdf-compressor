// Escena 4 (parte 1) · Galería interior del V23. Tiempo virtual (esta vista renderiza lento en software).
const L = require('./lib'); const OUT = process.env.OUT || require('path').resolve(__dirname, '../../grabaciones');
(async () => {
  const { browser, ctx, page } = await L.launch({ dsf: 1 });
  await L.enter(page);
  await page.getByRole('button', { name: 'Vista interior' }).first().click();
  await page.waitForTimeout(12000);
  for (let i = 0; i < 5; i++) { await L.skipTour(page); await page.waitForTimeout(1500); }
  await page.mouse.move(560, 380); L.setMouse(560, 380);
  await page.waitForTimeout(2000);
  const rec = new L.VirtualRecorder(page, OUT, 'C04a_galeria_interior');
  await rec.start(); const F = rec.frame;
  await rec.hold(0.4);
  for (const [k, x] of [[2, 330], [3, 410], [4, 490]]) {
    rec.mark('thumb' + k);
    await L.glide(page, x, 535, 550, F); await page.mouse.down(); await F(); await page.mouse.up();
    await rec.hold(0.75);
  }
  await rec.stop(); await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
