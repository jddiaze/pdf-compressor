// Escena 4 (parte 2) · Desde el hall: menú Características (panel real) y botón Precio,
// que envía una pregunta real al chat y muestra la respuesta del asesor.
const L = require('./lib'); const OUT = process.env.OUT || require('path').resolve(__dirname, '../../grabaciones'); const fs = require('fs');
(async () => {
  const { browser, ctx, page } = await L.launch({ dsf: 2 });
  await L.enter(page);
  await L.goToModel(page, 'TIGGO 9 CSH');
  await page.mouse.move(600, 420); L.setMouse(600, 420);
  await page.waitForTimeout(2500);
  const rec = new L.RealtimeRecorder(ctx, page, OUT, 'C04b_menu_precio');
  await rec.start();
  await L.wait(page, 500);
  rec.mark('menu');
  await L.clickOn(page, page.getByRole('button', { name: 'Características' }).first(), 700);
  await L.wait(page, 700);
  const rects = {};
  for (const it of ['Seguridad', 'Autonomía', 'Batería']) {
    const l = page.getByRole('button', { name: it, exact: true }).filter({ visible: true }).first();
    if (await l.isVisible().catch(() => false)) { rec.mark('hover_' + it); const b = await l.boundingBox(); rects[it] = [b.x, b.y, b.width, b.height]; await L.glide(page, b.x + b.width / 2, b.y + b.height / 2, 420); await L.wait(page, 350); }
  }
  const panel = await page.evaluate(() => { const h = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^CARACTERÍSTICAS$/i.test((e.innerText || '').trim())); const p = h && h.closest('div[class]').parentElement; const r = (p || h).getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
  rects.__panel = panel;
  await page.keyboard.press('Escape'); await L.wait(page, 400);
  rec.mark('precio');
  const pb = page.getByRole('button', { name: 'Precio' }).filter({ visible: true }).first();
  const b2 = await pb.boundingBox(); rects.Precio = [b2.x, b2.y, b2.width, b2.height];
  await L.clickOn(page, pb, 800);
  await page.waitForFunction(() => /Está escribiendo/i.test(document.body.innerText), null, { timeout: 20000 }).catch(() => { });
  rec.mark('typing');
  await page.waitForFunction(() => !/Está escribiendo/i.test(document.body.innerText), null, { timeout: 120000 });
  rec.mark('answer');
  await L.glide(page, 700, 250, 600);
  await L.wait(page, 2200);
  rects.answer = await page.evaluate(() => { const c = [...document.querySelectorAll('div,p,span')].filter(e => { const r = e.getBoundingClientRect(); return r.x > 880 && r.height > 30 && /COP|precio/i.test(e.innerText || '') && !/YOU/.test(e.innerText || ''); }); c.sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height); const r = c[0] && c[0].getBoundingClientRect(); return r ? [r.x, r.y, r.width, r.height] : null; });
  rects.price = await page.evaluate(() => { const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const n = w.currentNode; const m = /[0-9.]{9,} COP/.exec(n.textContent); if (m && n.parentElement.getBoundingClientRect().x > 880) { let i = m.index; while (true) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + m[0].length); out.push(...[...r.getClientRects()].map(q => [q.x, q.y, q.width, q.height])); const m2 = /[0-9.]{6,} COP/g; m2.lastIndex = i + m[0].length; const x = m2.exec(n.textContent); if (!x) break; i = x.index; m[0] = x[0]; } } } return out; });
  console.log('ANSWER', (await page.evaluate(() => document.body.innerText.split('CHERY EXPERT').pop())).slice(0, 300));
  fs.writeFileSync(OUT + '/C04b_rects.json', JSON.stringify(rects));
  await rec.stop(); await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
