"""Genera una secuencia FCP7 XML (Premiere Pro: Archivo > Importar) y una guía CSV para CapCut.
V1: video sin textos cortado por escenas · V2: video final con textos (desactivado, como referencia)
A1: frases de narración (editables, desde el MP3 original) · A2: música · A3: efectos.
Uso: python source/gen_premiere_xml.py"""
import json, os
from xml.sax.saxutils import escape
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(ROOT, 'source/timeline_master.json')))
FPS = 30; F = lambda s: int(round(s * FPS)); DUR = F(TL['duration'])
MEDIA = {
    'sin_textos': ('Commercial_Expert_Chery_16x9_66s_sin_textos.mp4', 'final/Commercial_Expert_Chery_16x9_66s_sin_textos.mp4', 'video'),
    'final': ('Commercial_Expert_Chery_16x9_66s.mp4', 'final/Commercial_Expert_Chery_16x9_66s.mp4', 'video'),
    'voz': ('narracion_original_chery_lorena.mp3', 'audio/narracion_original_chery_lorena.mp3', 'audio'),
    'musica': ('musica_original_Chery.wav', 'audio/musica/musica_original_Chery.wav', 'audio'),
    'efectos': ('efectos_sonido.wav', 'audio/efectos/efectos_sonido.wav', 'audio'),
}
DURS = {'sin_textos': DUR, 'final': DUR, 'voz': F(47.1), 'musica': F(TL['duration'] + 1.5), 'efectos': F(TL['duration'] + .5)}
done = set()
def rate(): return f'<rate><timebase>{FPS}</timebase><ntsc>FALSE</ntsc></rate>'
def fileref(k):
    name, rel, kind = MEDIA[k]
    if k in done: return f'<file id="f_{k}"/>'
    done.add(k)
    media = ('<media><video><samplecharacteristics><width>1920</width><height>1080</height></samplecharacteristics></video><audio><channelcount>2</channelcount></audio></media>' if kind == 'video'
             else '<media><audio><samplecharacteristics><samplerate>48000</samplerate><depth>16</depth></samplecharacteristics><channelcount>2</channelcount></audio></media>')
    return f'<file id="f_{k}"><name>{escape(name)}</name><pathurl>{escape(rel)}</pathurl>{rate()}<duration>{DURS[k]}</duration>{media}</file>'
def clip(cid, name, k, start, end, i0, enabled=True):
    return (f'<clipitem id="{cid}"><name>{escape(name)}</name><enabled>{"TRUE" if enabled else "FALSE"}</enabled><duration>{DURS[k]}</duration>{rate()}'
            f'<start>{start}</start><end>{end}</end><in>{i0}</in><out>{i0 + end - start}</out>{fileref(k)}</clipitem>')
v1 = [clip(f'v1_{s["id"]}', s['id'], 'sin_textos', F(s['t0']), F(s['t1']), F(s['t0'])) for s in TL['scenes']]
v2 = [clip('v2_final', 'Final con textos (referencia)', 'final', 0, DUR, 0, enabled=False)]
a1 = [clip(f'a1_{c["id"]}', f'{c["id"]} · {c["text"][:40]}', 'voz', F(c['dst']), F(c['dst']) + F(c['src'][1] - c['src'][0]), F(c['src'][0])) for c in TL['narration']['chunks']]
a2 = [clip('a2_musica', 'Música original (sin ducking)', 'musica', 0, DUR, 0)]
a3 = [clip('a3_efectos', 'Efectos de sonido', 'efectos', 0, DUR, 0)]
track = lambda items: '<track>' + ''.join(items) + '</track>'
markers = ''.join(f'<marker><name>{s["id"]}</name><in>{F(s["t0"])}</in><out>-1</out></marker>' for s in TL['scenes'])
xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4"><sequence id="seq1"><name>Commercial Expert Chery 16x9</name><duration>{DUR}</duration>{rate()}
<media><video><format><samplecharacteristics>{rate()}<width>1920</width><height>1080</height><pixelaspectratio>square</pixelaspectratio></samplecharacteristics></format>
{track(v1)}{track(v2)}</video>
<audio>{track(a1)}{track(a2)}{track(a3)}</audio></media>{markers}</sequence></xmeml>'''
os.makedirs(os.path.join(ROOT, 'premiere_capcut'), exist_ok=True)
open(os.path.join(ROOT, 'premiere_capcut/Commercial_Expert_Chery_Premiere_16x9.xml'), 'w', encoding='utf-8').write(xml)
rows = ['tipo,id,inicio_s,fin_s,origen_inicio_s,texto']
rows += [f'escena,{s["id"]},{s["t0"]},{s["t1"]},{s["t0"]},' for s in TL['scenes']]
rows += [f'narracion,{c["id"]},{c["dst"]},{round(c["dst"] + c["src"][1] - c["src"][0], 2)},{c["src"][0]},"{c["text"]}"' for c in TL['narration']['chunks']]
open(os.path.join(ROOT, 'premiere_capcut/guia_cortes_CapCut.csv'), 'w', encoding='utf-8').write('\n'.join(rows) + '\n')
print('xml + csv ok')
