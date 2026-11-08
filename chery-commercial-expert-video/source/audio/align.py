"""Tiempos por palabra de la narración a partir de la transcripción Whisper (source/narration_asr.json),
conservando la ortografía del guion. Salida: source/narration_words.json con tiempos src y dst (línea final)."""
import json, os, re, difflib
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TL = json.load(open(os.path.join(ROOT, 'source/timeline_master.json')))
asr = [w for s in json.load(open(os.path.join(ROOT, 'source/narration_asr.json'))) for w in s['words']]
norm = lambda w: re.sub(r'[^a-z0-9áéíóúñü]', '', w.lower().replace('cien', '100').replace('%', '').replace('cherry', 'chery'))
script = []
for ch in TL['narration']['chunks']:
    for w in ch['text'].split(): script.append((w, ch))
A = [norm(w[2]) for w in asr]; B = [norm(w) for w, _ in script]
B2 = [b if b not in ('por', 'ciento') else '' for b in B]
sm = difflib.SequenceMatcher(None, A, B2, autojunk=False)
times = [None] * len(script)
for tag, a0, a1, b0, b1 in sm.get_opcodes():
    if tag == 'equal':
        for k in range(b1 - b0): times[b0 + k] = [asr[a0 + k][0], asr[a0 + k][1]]
    elif a1 > a0:
        t0, t1 = asr[a0][0], asr[a1 - 1][1]; n = b1 - b0
        for k in range(n): times[b0 + k] = [t0 + (t1 - t0) * k / n, t0 + (t1 - t0) * (k + 1) / n]
for i in range(len(times)):  # huecos: interpolar
    if times[i] is None:
        p = times[i - 1][1]; times[i] = [p, p + 0.15]
res = []
for (w, ch), (a, b) in zip(script, times):
    off = ch['dst'] - ch['src'][0]
    res.append({'w': w, 'chunk': ch['id'], 'src': [round(a, 3), round(b, 3)], 't': [round(a + off, 3), round(b + off, 3)]})
json.dump(res, open(os.path.join(ROOT, 'source/narration_words.json'), 'w'), ensure_ascii=False, indent=0)
print(' '.join(f"{r['w']}@{r['t'][0]:.2f}" for r in res))
