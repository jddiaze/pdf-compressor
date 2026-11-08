// Escenas 1-2 · Hall digital Chery: recorrido por el portafolio (E5 -> Tiggo 4 -> Tiggo 7 -> Tiggo 8 -> Tiggo 9) y "Ver en 3D"
const L = require('./lib'); const OUT = process.env.OUT || require('path').resolve(__dirname, '../../grabaciones');
(async () => {
  const { browser, ctx, page } = await L.launch({ dsf: 2 });
  await L.enter(page);
  await L.goToModel(page, 'E5');
  await page.mouse.move(700, 620); L.setMouse(700, 620);
  await page.waitForTimeout(2500);
  const rec = new L.RealtimeRecorder(ctx, page, OUT, 'C01_hall');
  await rec.start();
  await L.wait(page, 1600);
  const next = page.getByRole('button', { name: 'Vehículo siguiente' });
  for (const name of ['tiggo4', 'tiggo7', 'tiggo8', 'tiggo9']) {
    rec.mark('to_' + name);
    await L.clickOn(page, next, 650);
    rec.mark(name);
    await L.wait(page, 2300);
  }
  rec.mark('hover_3d');
  const b3d = page.getByRole('button', { name: 'TIGGO 9 CSH · Ver en 3D' });
  const [x, y] = await L.center(page, b3d); await L.glide(page, x, y, 900);
  await L.wait(page, 1500);
  await rec.stop(); await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
