// Escena 3 (parte 2) · Visor 3D del V23: cambio de color y punto de interés. Tiempo virtual.
const L = require('./lib'); const OUT = process.env.OUT || require('path').resolve(__dirname, '../../grabaciones');
(async () => {
  const { browser, ctx, page } = await L.launch({ dsf: 1 });
  await L.enter(page);
  await page.getByRole('button', { name: 'Ver en 3D' }).first().click();
  await page.waitForTimeout(15000);
  for (let i = 0; i < 3; i++) { await L.skipTour(page); await page.waitForTimeout(1200); }
  await page.mouse.move(700, 380); L.setMouse(700, 380);
  await page.waitForTimeout(2500);
  const rec = new L.VirtualRecorder(page, OUT, 'C03b_visor3d_colores_hotspot');
  await rec.start(); const F = rec.frame;
  await rec.hold(0.3);
  for (const color of ['Naranja', 'Verde']) {
    rec.mark('color_' + color);
    await L.clickOn(page, page.getByRole('button', { name: color, exact: true }), 600, F);
    await rec.hold(0.85);
  }
  const hs = page.locator('.hotspot:not(.hotspot-interior)');
  const n = await hs.count(); let best = null, bx = -1;
  for (let i = 0; i < n; i++) { const b = await hs.nth(i).boundingBox(); if (b && b.x > bx && b.x < 880 && b.y > 120 && b.y < 520) { bx = b.x; best = hs.nth(i); } }
  rec.mark('hotspot');
  if (best) { await L.clickOn(page, best, 650, F); }
  await rec.hold(1.8);
  await rec.stop(); await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
