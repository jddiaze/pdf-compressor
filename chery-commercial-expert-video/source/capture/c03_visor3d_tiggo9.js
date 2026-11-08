// Escena 3 · Visor 3D del Tiggo 9 CSH. Tiempo virtual (30 fps exactos aunque el WebGL renderice lento).
// PARTE=a: rotación por arrastre · PARTE=b: colores + punto de interés
const L = require('./lib'); const OUT = process.env.OUT || require('path').resolve(__dirname, '../../grabaciones');
const PARTE = process.env.PARTE || 'a';
(async () => {
  const { browser, ctx, page } = await L.launch({ dsf: 1 });
  await L.enter(page); await L.goToModel(page, 'TIGGO 9 CSH');
  await page.getByRole('button', { name: 'TIGGO 9 CSH · Ver en 3D' }).click();
  await page.waitForTimeout(15000);
  for (let i = 0; i < 3; i++) { await L.skipTour(page); await page.waitForTimeout(1200); }
  // alejar la cámara para ver el vehículo completo
  await page.mouse.move(430, 330); for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(700); }
  await page.waitForTimeout(5000);
  await page.mouse.move(820, 200); L.setMouse(820, 200);
  await page.waitForTimeout(1500);
  const rec = new L.VirtualRecorder(page, OUT, PARTE === 'a' ? 'C03a_visor3d_rotacion' : 'C03b_visor3d_colores_hotspot');
  await rec.start(); const F = rec.frame;
  if (PARTE === 'a') {
    await rec.hold(0.4);
    rec.mark('drag_start');
    await L.glide(page, 400, 330, 450, F);
    await page.mouse.down(); await F();
    await L.glide(page, 760, 345, 2300, F);
    await page.mouse.up(); await F();
    rec.mark('drag_end');
    await rec.hold(0.5);
  } else {
    await rec.hold(0.3);
    for (const color of ['Verde Aurora', 'Blanco']) {
      rec.mark('color_' + color);
      await L.clickOn(page, page.getByRole('button', { name: color, exact: true }), 600, F);
      await rec.hold(0.85);
    }
    const hs = page.locator('.hotspot:not(.hotspot-interior)');
    const n = await hs.count(); let best = null, bx = -1;
    for (let i = 0; i < n; i++) { const b = await hs.nth(i).boundingBox(); if (b && b.x > bx && b.x < 860 && b.x > 40 && b.y > 140 && b.y < 520) { bx = b.x; best = hs.nth(i); } }
    rec.mark('hotspot');
    if (best) await L.clickOn(page, best, 650, F);
    await rec.hold(1.8);
  }
  await rec.stop(); await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
