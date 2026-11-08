// Escena 3 (parte 1) · Visor 3D del V23: rotación por arrastre (de esta captura se usan los primeros 107 fotogramas, guardados como C03a_visor3d_rotacion).
// Captura fotograma a fotograma (tiempo virtual) para que el WebGL quede fluido a 30 fps.
const L = require('./lib'); const OUT = process.env.OUT || require('path').resolve(__dirname, '../../grabaciones');
(async () => {
  const { browser, ctx, page } = await L.launch({ dsf: 2 });
  await L.enter(page);
  await page.getByRole('button', { name: 'Ver en 3D' }).first().click();
  await page.waitForTimeout(15000); await L.skipTour(page);
  await page.mouse.move(980, 300); L.setMouse(980, 300);
  await page.waitForTimeout(3000);
  const rec = new L.VirtualRecorder(page, OUT, 'C03_visor3d_V23');
  await rec.start();
  const F = rec.frame;
  await rec.hold(0.5);
  rec.mark('drag_start');
  await L.glide(page, 520, 330, 450, F);
  await page.mouse.down(); await F();
  await L.glide(page, 830, 350, 2300, F);
  await page.mouse.up(); await F();
  rec.mark('drag_end');
  await rec.hold(0.5);
  for (const color of ['Naranja', 'Verde', 'Blanco']) {
    rec.mark('color_' + color);
    await L.clickOn(page, page.getByRole('button', { name: color, exact: true }), 650, F);
    await rec.hold(0.9);
  }
  // Punto de interés: el más cercano a la parte frontal (mayor x visible)
  const hs = page.locator('.hotspot:not(.hotspot-interior)');
  const n = await hs.count(); let best = null, bx = -1;
  for (let i = 0; i < n; i++) { const b = await hs.nth(i).boundingBox(); if (b && b.x > bx && b.x < 900 && b.y > 120 && b.y < 520) { bx = b.x; best = hs.nth(i); } }
  if (best) {
    rec.mark('hotspot');
    await L.clickOn(page, best, 700, F);
    await rec.hold(2.0);
  }
  rec.mark('reset');
  await L.clickOn(page, page.getByRole('button', { name: 'Restablecer Vista' }), 700, F);
  await rec.hold(1.2);
  rec.mark('v360');
  await L.clickOn(page, page.getByRole('button', { name: 'Vista 360º' }), 700, F);
  await L.glide(page, 1000, 250, 500, F);
  await rec.hold(2.5);
  await rec.stop();
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
