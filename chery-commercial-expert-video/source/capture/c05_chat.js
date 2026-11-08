// Escena 5 (protagonista) · Chat Chery Expert sobre el stand Tiggo 9 CSH: preguntas reales y respuestas reales
const L = require('./lib'); const OUT = process.env.OUT || require('path').resolve(__dirname, '../../grabaciones'); const fs = require('fs');
const QS = ['¿Qué autonomía tiene este vehículo?', '¿En qué se diferencian el Tiggo 8 y el Tiggo 9?', 'Lo usaría en ciudad y para viajar los fines de semana con mi familia. ¿Cuál me recomiendas?', '¿Cómo puedo agendar una prueba de manejo?'];
(async () => {
  const { browser, ctx, page } = await L.launch({ dsf: 2 });
  await L.enter(page);
  await L.goToModel(page, 'TIGGO 9 CSH');
  await page.mouse.move(640, 560); L.setMouse(640, 560);
  await page.waitForTimeout(3000);
  const rec = new L.RealtimeRecorder(ctx, page, OUT, 'C05_chat');
  await rec.start();
  await L.wait(page, 1200);
  const log = [];
  const count = () => page.evaluate(() => document.body.innerText.split('CHERY EXPERT').length - 1);
  for (let i = 0; i < QS.length; i++) {
    const q = QS[i];
    rec.mark(`q${i + 1}_focus`);
    await L.clickOn(page, page.locator('textarea'), 700);
    await L.wait(page, 250);
    rec.mark(`q${i + 1}_type`);
    for (const ch of q) { await page.keyboard.type(ch); await L.wait(page, 38 + Math.random() * 40); }
    await L.wait(page, 350);
    const n0 = await count();
    rec.mark(`q${i + 1}_send`);
    await L.clickOn(page, page.getByRole('button', { name: 'Enviar' }), 500);
    await page.waitForFunction(n => document.body.innerText.split('CHERY EXPERT').length - 1 > n, n0, { timeout: 30000 }).catch(() => { });
    rec.mark(`q${i + 1}_thinking`);
    await page.waitForFunction(() => !/Está escribiendo/i.test(document.body.innerText), null, { timeout: 90000 });
    rec.mark(`q${i + 1}_answer`);
    await page.mouse.move(1000, 250); L.setMouse(1000, 250);
    await L.wait(page, 2600);
    const all = await page.evaluate(() => document.body.innerText.split('CHERY EXPERT'));
    const ans = all[all.length - 1].split('Presiona Enter')[0].trim();
    const rx = [/1\.400 km[^,;.]*/, /140 km[^,;.]*/, /que estás viendo/, /Tiggo 9 CSH/, /tracción integral[^,;.]*/, /tracción 4WD/, /tracción delantera/, /7 puestos/, /orient[a-z]+ [^.?]*/, /¿[Cc]uántas personas[^?]*\?/, /botón Prueba de Manejo/, /híbridos enchufables[^,;.]*/];
    const allTxt = await page.evaluate(() => document.body.innerText.split('CHERY EXPERT'));
    const ansNow = allTxt[allTxt.length - 1].split('Presiona Enter')[0].trim();
    const rects = await page.evaluate(([srcs, pre]) => {
      const out = {};
      const cands = [...document.querySelectorAll('div,p,span')].filter(e => { const r = e.getBoundingClientRect(); return r.x > 880 && r.height > 30 && (e.innerText || '').includes(pre); });
      cands.sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height);
      const last = cands[0]; if (!last) return out;
      const walker = document.createTreeWalker(last, NodeFilter.SHOW_TEXT); const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const src of srcs) { const re = new RegExp(src);
        for (const n of nodes) { const m = re.exec(n.textContent); if (!m) continue;
          const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
          out[m[0]] = [...r.getClientRects()].map(q => [q.x, q.y, q.width, q.height]); break; } }
      const br = (last.closest('[class*=message], [class*=bubble]') || last).getBoundingClientRect(); out.__bubble = [[br.x, br.y, br.width, br.height]];
      return out; }, [rx.map(r => r.source), ansNow.slice(0, 40)]);
    const bubbles = await page.evaluate(() => [...document.querySelectorAll('div,p')].filter(e => e.children.length < 3 && e.innerText && e.innerText.length > 60 && e.getBoundingClientRect().x > 880).map(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, t: e.innerText.slice(0, 80) }; }));
    log.push({ q, a: ans, bubbles, rects, t: rec.marks.at(-1).t });
    console.log('Q', q, '\nA', ans);
  }
  fs.writeFileSync(OUT + '/C05_chat_log.json', JSON.stringify(log, null, 1));
  await rec.stop(); await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
