// Escenas 1-2 · Hall digital: stand V23 -> flecha -> stand V27 -> regreso y "Ver en 3D"
const L = require('./lib'); const OUT = process.env.OUT || require('path').resolve(__dirname, '../../grabaciones');
(async () => {
  const { browser, ctx, page } = await L.launch({ dsf: 2 });
  await L.enter(page);
  await page.mouse.move(700, 620); L.setMouse(700, 620);
  await page.waitForTimeout(2500);
  const rec = new L.RealtimeRecorder(ctx, page, OUT, 'C01_hall');
  await rec.start();
  await L.wait(page, 2200);
  rec.mark('to_next');
  await L.clickOn(page, page.getByRole('button', { name: 'Vehículo siguiente' }), 900);
  rec.mark('v27');
  await L.wait(page, 3500);
  rec.mark('to_prev');
  await L.clickOn(page, page.getByRole('button', { name: 'Vehículo anterior' }), 1000);
  rec.mark('v23');
  await L.wait(page, 2500);
  rec.mark('hover_3d');
  const b3d = page.getByRole('button', { name: /Ver en 3D/ }).filter({ visible: true }).first();
  const [x, y] = await L.center(page, b3d); await L.glide(page, x, y, 900);
  await L.wait(page, 1500);
  await rec.stop(); await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
