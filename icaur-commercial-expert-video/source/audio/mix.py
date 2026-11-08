"""Efectos de sonido sintetizados + mezcla final.
Entradas: audio/narracion_original_lorena.mp3, audio/musica/musica_original_iCAUR.wav,
          source/timeline_master.json, source/sfx_events.json (lo genera render.js)
Salidas:  audio/narracion_editada.wav (voz sola en la línea de tiempo final)
          audio/efectos/efectos_sonido.wav, audio/mezcla_final.wav (-14 LUFS, -1 dBTP)
Uso: python source/audio/mix.py
"""
import json, os, subprocess, wave, numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TL = json.load(open(os.path.join(ROOT, 'source/timeline_master.json')))
SR = 48000; DUR = TL['duration']; N = int((DUR + 0.5) * SR)
rng = np.random.default_rng(3)
A = lambda *p: os.path.join(ROOT, *p)

def load(path, ch=2):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
def write(path, x):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(x.shape[1]); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
def bq(x, f, kind, o=2): return sosfilt(butter(o, f, kind, fs=SR, output='sos'), x, axis=0)
t_ = lambda n: np.arange(n) / SR
def place(buf, x, t0, g=1.0):
    i = int(t0 * SR); x = x if x.ndim == 2 else np.stack([x, x], 1)
    if i < 0: x = x[-i:]; i = 0
    j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i] * g

# ---------------- narración: fragmentos colocados en la línea final
voice_src = load(A(TL['narration']['file']), 1)[:, 0]
voice_src = bq(voice_src, 80, 'high')
voice = np.zeros((N, 2))
for ch in TL['narration']['chunks']:
    a, b = ch['src']; seg = voice_src[int(a * SR):int(b * SR)].copy()
    f = int(.012 * SR); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    place(voice, seg, ch['dst'])
write(A('audio/narracion_editada.wav'), voice * 0.98)

# ---------------- efectos (sintetizados)
def whoosh(d=.55):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n); step = 1024
    for k in range(0, n, step):
        p = k / n; fc = 400 + 5000 * np.sin(np.pi * p) ** 2
        out[k:k + step] = bq(x[k:k + step], [fc * .6, min(fc * 1.6, 20000)], 'band')
    return out * np.sin(np.pi * t_(n) / d) ** 2 * .9
def click():
    n = int(.05 * SR); t = t_(n)
    return (bq(rng.standard_normal(n), 2500, 'high') * np.exp(-t * 180) * .6 + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120) * .35)
def key():
    n = int(.03 * SR); t = t_(n)
    return bq(rng.standard_normal(n), [1800, 6000], 'band') * np.exp(-t * 260) * (.35 + .2 * rng.random())
def pop():
    n = int(.18 * SR); t = t_(n); f = 700 + 500 * (1 - np.exp(-t * 40))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 22) * .45
def tick():
    n = int(.08 * SR); t = t_(n); return np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 70) * .25
def shimmer():
    n = int(1.2 * SR); t = t_(n); x = np.zeros(n)
    for k, f in enumerate([1568, 2093, 2637, 3136]):
        x += np.sin(2 * np.pi * f * t + k) * np.exp(-t * (3 + k)) * np.clip((t - k * .05) * 40, 0, 1)
    return x * .12
def send():
    n = int(.25 * SR); t = t_(n); f = 500 + 900 * t / .25
    c = click(); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 12) * .3 + np.pad(c, (0, n - len(c))) * .6
def data():
    n = int(1.0 * SR); x = np.zeros(n)
    for k in range(8):
        i = int(k * .11 * SR); m = int(.06 * SR); tt = t_(m)
        x[i:i + m] += np.sin(2 * np.pi * (1200 + 180 * k) * tt) * np.exp(-tt * 60) * .18
    return x
def impact():
    n = int(2.0 * SR); t = t_(n)
    return np.sin(2 * np.pi * np.cumsum(40 + 80 * np.exp(-t * 7)) / SR) * np.exp(-t * 2.5) * .8 + bq(rng.standard_normal(n), 2500, 'low') * np.exp(-t * 6) * .3
def rise(d=1.0):
    n = int(d * SR); t = t_(n); return bq(rng.standard_normal(n), [800, 9000], 'band') * (t / d) ** 2.5 * .35
GEN = {'whoosh': whoosh, 'click': click, 'key': key, 'pop': pop, 'tick': tick, 'shimmer': shimmer, 'send': send, 'data': data, 'impact': impact, 'rise': rise}
GAIN = {'whoosh': .55, 'click': .7, 'key': .45, 'pop': .5, 'tick': .55, 'shimmer': .7, 'send': .6, 'data': .7, 'impact': .45, 'rise': .5}
fx = np.zeros((N, 2))
ev = json.load(open(A('source/sfx_events.json')))
for e in ev:
    x = GEN[e['type']](); pan = rng.uniform(-.25, .25)
    st = np.stack([x * (1 - pan), x * (1 + pan)], 1)
    place(fx, st, e['t'] - (1.0 if e['type'] == 'rise' else 0), GAIN[e['type']])
ir = rng.standard_normal(int(.9 * SR)) * np.exp(-t_(int(.9 * SR)) * 6); ir /= np.abs(ir).sum() ** .5 * 8
fx = fx * .85 + np.stack([fftconvolve(fx[:, 0], ir)[:N], fftconvolve(fx[:, 1], ir)[:N]], 1) * .5
write(A('audio/efectos/efectos_sonido.wav'), fx * .9)

# ---------------- música con "ducking" bajo la voz
music = load(A('audio/musica/musica_original_iCAUR.wav'))
music = np.pad(music, ((0, max(0, N - len(music))), (0, 0)))[:N]
env = np.abs(voice[:, 0]); win = int(.05 * SR)
env = np.convolve(env, np.ones(win) / win, 'same')
on = (env > 0.01).astype(float)
# ataque 60 ms, liberación 450 ms
g = np.zeros(N); a, r = 1 - np.exp(-1 / (.06 * SR)), 1 - np.exp(-1 / (.45 * SR)); y = 0
for i in range(0, N, 64):
    tgt = on[i]; y += ((a if tgt > y else r) * 64) * (tgt - y); g[i:i + 64] = y
duck = 1 - .62 * np.clip(g, 0, 1)  # ≈ -8.4 dB bajo la voz
music_d = music * duck[:, None]
# fundido final
fo = int(1.6 * SR); music_d[N - fo:] *= np.linspace(1, 0, fo)[:, None]

mix = voice * 1.0 + music_d * .62 + fx * .30
write(A('audio/_mezcla_pre.wav'), mix / max(1, np.abs(mix).max()))
# normalización EBU R128 en dos pasadas: -14 LUFS, -1 dBTP (estándar redes sociales)
pre = A('audio/_mezcla_pre.wav')
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', pre, '-af', 'loudnorm=I=-14:TP=-1:LRA=9:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
js = json.loads(m[m.rindex('{'):m.rindex('}') + 1])
af = f"loudnorm=I=-14:TP=-1:LRA=9:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true,alimiter=limit=0.84:attack=2:release=60:level=false"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', af, '-ar', str(SR), '-t', str(DUR), A('audio/mezcla_final.wav')], check=True)
os.remove(pre)
print('mezcla ok', js['input_i'], '->', -14)
