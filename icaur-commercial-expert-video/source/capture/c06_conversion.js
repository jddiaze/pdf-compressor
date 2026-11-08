// Escena 6 · Conversión: Prueba de Manejo (formulario oficial), Envía tus datos, Reserva tu iCAUR.
// No se envía ningún formulario ni se inicia pago.
const L = require('./lib'); const OUT = process.env.OUT || require('path').resolve(__dirname, '../../grabaciones');
(async () => {
  const { browser, ctx, page } = await L.launch({ dsf: 2 });
  await L.enter(page);
  await page.mouse.move(700, 500); L.setMouse(700, 500);
  await page.waitForTimeout(2000);
  let rec = new L.RealtimeRecorder(ctx, page, OUT, 'C06a_testdrive_datos');
  await rec.start();
  await L.wait(page, 700);
  rec.mark('td_click');
  await L.clickOn(page, page.getByRole('button', { name: 'Prueba de Manejo' }).first(), 900);
  await L.wait(page, 6500);
  rec.mark('td_scroll');
  await L.glide(page, 640, 520, 500);
  for (let i = 0; i < 14; i++) { await page.mouse.wheel(0, 45); await L.wait(page, 40); }
  await L.wait(page, 2200);
  rec.mark('td_close');
  const close = page.locator('button[aria-label*="errar"]').first();
  if (await close.isVisible().catch(() => false)) await L.clickOn(page, close, 700); else await page.keyboard.press('Escape');
  await L.wait(page, 900);
  rec.mark('datos_click');
  await L.clickOn(page, page.getByRole('button', { name: 'Envía tus datos' }).first(), 900);
  await L.wait(page, 1600);
  rec.mark('datos_scroll');
  await L.glide(page, 640, 500, 400);
  for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 40); await L.wait(page, 35); }
  await L.wait(page, 1500);
  rec.mark('datos_end');
  await page.keyboard.press('Escape'); await L.wait(page, 400);
  const c2 = page.locator('button[aria-label*="errar"], button:has-text("×")').first(); if (await c2.isVisible().catch(() => false)) await c2.click();
  await L.wait(page, 800);
  rec.mark('reserva_hover');
  const rb = page.getByRole('button', { name: 'Reserva tu iCAUR' }).first();
  const [x, y] = await L.center(page, rb); await L.glide(page, x, y, 800);
  await L.wait(page, 400);
  rec.mark('reserva_click');
  await page.mouse.down(); await L.wait(page, 80);
  const pp = ctx.waitForEvent('page', { timeout: 10000 });
  await page.mouse.up();
  await L.wait(page, 700);
  await rec.stop();
  const np = await pp; await np.waitForLoadState('domcontentloaded').catch(() => { });
  await L.wait(np, 6000);
  await np.mouse.move(900, 400);
  rec = new L.RealtimeRecorder(ctx, np, OUT, 'C06b_reserva_portal');
  await rec.start();
  await L.wait(np, 1500);
  rec.mark('scroll');
  for (let i = 0; i < 24; i++) { await np.mouse.wheel(0, 22); await L.wait(np, 35); }
  await L.wait(np, 1500);
  rec.mark('color');
  const sw = np.locator('button[aria-label*="aranja"], [title*="aranja"]').first();
  if (await sw.isVisible().catch(() => false)) { await L.clickOn(np, sw, 800); }
  await L.wait(np, 2500);
  console.log('URL', np.url());
  await rec.stop(); await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
