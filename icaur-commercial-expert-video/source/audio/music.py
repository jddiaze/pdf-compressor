"""Banda sonora original (sintetizada desde cero, sin muestras de terceros).
100 BPM, Re menor cálido: Dm9 - Bbmaj7 - Fmaj7 - C6. Exporta stems y mezcla.
Uso: python source/audio/music.py  (lee source/timeline_master.json)
"""
import json, os, numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TL = json.load(open(os.path.join(ROOT, 'source/timeline_master.json')))
SR = 48000
DUR = TL['duration'] + 1.5
N = int(DUR * SR)
BEAT = 60 / TL['bpm']; BAR = 4 * BEAT
SC = {s['id']: (s['t0'], s['t1']) for s in TL['scenes']}
T2, T3, T4, T5, T6, T7 = [SC[k][0] for k in ['S2_hall', 'S3_visor3d', 'S4_interior_menu', 'S5_chat', 'S6_conversion_crm', 'S7_cierre']]
TV5 = T5 + 1.2  # entra la voz del chat
rng = np.random.default_rng(7)

def t_arr(n): return np.arange(n) / SR
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def saw(f, n, ph=0.0):
    t = t_arr(n); return 2 * ((f * t + ph) % 1) - 1
def env_adsr(n, a, d, s, r):
    e = np.ones(n) * s; A = int(a * SR); D = int(d * SR); R = int(r * SR)
    e[:A] = np.linspace(0, 1, A, endpoint=False) if A else e[:A]
    e[A:A + D] = np.linspace(1, s, len(e[A:A + D]))
    if R: e[-R:] *= np.linspace(1, 0, len(e[-R:]))
    return e
def place(buf, x, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i] * gain
def section_gain(t, keys):
    """keys: [(t, g), ...] interpolación lineal"""
    ts = [k[0] for k in keys]; gs = [k[1] for k in keys]
    return np.interp(t, ts, gs)

T = t_arr(N)
# progresión (notas MIDI) – 1 acorde por compás
CHORDS = [[50, 57, 60, 64, 65], [46, 53, 57, 60, 62], [41, 53, 57, 60, 64], [48, 55, 57, 60, 64]]
BASS = [38, 34, 41, 36]

# ---------------- PAD (sierra desafinada, filtro lento)
padL = np.zeros(N); padR = np.zeros(N)
nbars = int(DUR / BAR) + 1
for b in range(nbars):
    t0 = b * BAR; n = int(BAR * SR * 1.25)
    ch = CHORDS[b % 4]
    vl = np.zeros(n); vr = np.zeros(n)
    for m in ch[1:]:
        f = midi(m)
        for d in (-0.11, 0.0, 0.12):
            vl += saw(f * 2 ** (d / 12), n, rng.random()); vr += saw(f * 2 ** ((d + 0.03) / 12), n, rng.random())
    e = env_adsr(n, 0.55, 0.6, 0.8, 0.9)
    place(padL, vl * e, t0); place(padR, vr * e, t0)
cut = 900 + 1400 * (0.5 + 0.5 * np.sin(2 * np.pi * T / (BAR * 4)))
padL = lp(padL, 2200, 4); padR = lp(padR, 2200, 4)
padL = lp(padL, 1400); padR = lp(padR, 1400)

# ---------------- BAJO (pulsos de corcheas con bombeo)
bass = np.zeros(N)
for b in range(nbars):
    f = midi(BASS[b % 4])
    for k in range(8):
        t0 = b * BAR + k * BEAT / 2; n = int(BEAT / 2 * SR)
        x = 0.7 * np.sin(2 * np.pi * f * t_arr(n)) + 0.35 * saw(f, n)
        x = x * env_adsr(n, 0.005, 0.12, 0.55, 0.05)
        place(bass, x, t0, 0.9 if k % 2 == 0 else 0.6)
bass = lp(bass, 420, 4)

# ---------------- BATERÍA
def kick():
    n = int(0.45 * SR); t = t_arr(n)
    f = 46 + 90 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 7.5)
    x[:int(.004 * SR)] += rng.standard_normal(int(.004 * SR)) * .4
    return x
def hat(open_=False):
    n = int((0.22 if open_ else 0.06) * SR)
    x = hp(rng.standard_normal(n), 7000, 4) * np.exp(-t_arr(n) * (14 if open_ else 70))
    return x
def clap():
    n = int(0.3 * SR); x = bp(rng.standard_normal(n), 900, 3500) * np.exp(-t_arr(n) * 18)
    for d in (0.008, 0.016): x[int(d * SR):] += x[:n - int(d * SR)] * .5
    return x * .8
K, HC, HO, CL = kick(), hat(), hat(True), clap()
drums = np.zeros(N); sidechain = np.ones(N)
nbeats = int(DUR / BEAT) + 1
for i in range(nbeats):
    t0 = i * BEAT
    s = next((k for k, (a, b) in SC.items() if a <= t0 < b), 'S7_cierre')
    kick_on = s in ('S3_visor3d', 'S4_interior_menu', 'S6_conversion_crm') or (s == 'S5_chat' and t0 >= TV5) or (s == 'S2_hall' and t0 >= T2 + 3.6)
    if s == 'S7_cierre' and t0 > T7 + 2 * BAR: kick_on = False
    if kick_on:
        place(drums, K, t0, 0.95)
        n = int(BEAT * SR * .9); i0 = int(t0 * SR)
        sc = 1 - 0.55 * np.exp(-t_arr(n) * 9)
        sidechain[i0:i0 + n] = np.minimum(sidechain[i0:i0 + n], sc[:len(sidechain[i0:i0 + n])])
    if s not in ('S1_impacto',) and t0 < 64:
        place(drums, HC, t0 + BEAT / 2, 0.35)
        if s in ('S4_interior_menu', 'S6_conversion_crm', 'S5_chat'):
            place(drums, HC, t0 + BEAT / 4, 0.16); place(drums, HC, t0 + 3 * BEAT / 4, 0.16)
        if kick_on and i % 4 in (1, 3) and s in ('S3_visor3d', 'S4_interior_menu', 'S6_conversion_crm'):
            place(drums, CL, t0, 0.45)
        if i % 8 == 7 and s != 'S5_chat': place(drums, HO, t0 + BEAT / 2, 0.25)

# ---------------- ARPEGIO "tech" (pluck) en chat y conversión
arp = np.zeros(N)
pattern = [0, 2, 1, 3, 2, 4, 3, 1]
for i in range(int(DUR / (BEAT / 4))):
    t0 = i * BEAT / 4
    on = (TV5 <= t0 < T7) or (T3 <= t0 < T4)
    if not on: continue
    ch = CHORDS[int(t0 / BAR) % 4]
    m = ch[1:][pattern[i % 8] % 4] + 12
    n = int(0.25 * SR); f = midi(m)
    x = (np.sign(np.sin(2 * np.pi * f * t_arr(n))) * .5 + saw(f * 1.003, n) * .5)
    x = lp(x * np.exp(-t_arr(n) * 16), 3200)
    g = 0.22 if t0 >= TV5 else 0.14
    place(arp, x, t0, g * (1.0 if i % 2 == 0 else .7))
# eco
d = int(BEAT * .75 * SR); arpE = arp.copy(); arpE[d:] += arp[:-d] * .35; arpE[2 * d:] += arp[:-2 * d] * .15
arp = arpE

# ---------------- FX: subidas (risers), impactos, barridos
fx = np.zeros(N)
def riser(dur):
    n = int(dur * SR); t = t_arr(n); x = rng.standard_normal(n)
    out = np.zeros(n); seg = 2048
    for k in range(0, n, seg):
        fc = 300 + 7000 * (k / n) ** 2
        out[k:k + seg] = bp(x[k:k + seg], fc * .7, min(fc * 1.4, 20000))
    tone = saw(1, n) * 0
    f = 110 * 2 ** (3 * t / dur); tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * .15
    return (out * .6 + tone) * (t / dur) ** 2
def impact():
    n = int(2.8 * SR); t = t_arr(n)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.2)
    nz = lp(rng.standard_normal(n), 3000) * np.exp(-t * 5) * .5
    return boom + nz
def reverse_swell(dur):
    n = int(dur * SR); x = lp(rng.standard_normal(n), 5000) * np.linspace(0, 1, n) ** 3
    return x * .6
for t_hit in TL['hits']:
    rdur = 2.0 if t_hit == T7 else 1.2 if t_hit in (1.2, T5) else 1.6
    place(fx, riser(rdur), t_hit - rdur, .55)
    place(fx, impact(), t_hit, .75 if t_hit in (1.2, T7) else .45)

# ---------------- reverb (respuesta al impulso sintética)
def reverb(x, sec=2.2, mix=.25):
    n = int(sec * SR); ir = rng.standard_normal(n) * np.exp(-t_arr(n) * 3.2); ir = lp(ir, 6000); ir /= np.abs(ir).sum() ** .5 * 6
    return x * (1 - mix) + fftconvolve(x, ir)[:len(x)] * mix * 6

# ---------------- dinámica por secciones
g_pad = section_gain(T, [(0, 0), (0.6, .5), (1.2, .9), (T2, .8), (T3, .7), (T5, .75), (TV5, .6), (T6, .7), (T7, 1.0), (DUR - 2.5, .8), (DUR, 0)])
g_bass = section_gain(T, [(0, 0), (1.2, 0), (1.25, .6), (T2, .75), (T3, 1.0), (T5 - .2, 1.0), (T5, 0.2), (TV5, .85), (T6, 1), (T7, 1), (T7 + 1.2, .5), (T7 + 4.2, 0), (DUR, 0)])
g_arp = section_gain(T, [(0, 0), (T3, .7), (T4, .7), (T4 + .1, 0), (TV5, .9), (T6, 1), (T7, .9), (T7 + .2, 0), (DUR, 0)])
g_dr = section_gain(T, [(0, 1), (DUR, 1)])

pad = np.stack([padL, padR], 1) * g_pad[:, None] * (0.55 + 0.45 * sidechain)[:, None] * .09
bassS = (bass * g_bass * sidechain * .36)[:, None] * [1, 1]
drumsS = (drums * g_dr * .5)[:, None] * [1, 1]
arpS = np.stack([arp * g_arp * .9, np.roll(arp, int(.012 * SR)) * g_arp * .9], 1) * (0.6 + 0.4 * sidechain)[:, None]
fxS = np.stack([fx, np.roll(fx, int(.007 * SR))], 1) * .5

pad = np.stack([reverb(pad[:, 0], 3.0, .35), reverb(pad[:, 1], 3.0, .35)], 1)
arpS = np.stack([reverb(arpS[:, 0], 1.8, .3), reverb(arpS[:, 1], 1.8, .3)], 1)
fxS = np.stack([reverb(fxS[:, 0], 2.5, .3), reverb(fxS[:, 1], 2.5, .3)], 1)

def write(path, x):
    x = np.clip(x, -1, 1); os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())

out = os.path.join(ROOT, 'audio/musica')
stems = {'pad': pad, 'bajo': bassS, 'bateria': drumsS, 'arpegio': arpS, 'fx_transiciones': fxS}
mix = sum(stems.values())
peak = np.abs(mix).max(); scale = 0.89 / peak
for k, v in stems.items(): write(f'{out}/stems/musica_{k}.wav', v * scale)
write(f'{out}/musica_original_iCAUR.wav', mix * scale)
print('ok', DUR, 'peak', peak)
