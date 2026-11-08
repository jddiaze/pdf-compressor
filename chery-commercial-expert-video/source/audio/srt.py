"""Genera subtítulos SRT (y ASS para quemarlos) desde source/narration_words.json.
Reglas: máx. 42 caracteres por línea, 2 líneas, corte preferente en puntuación."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
W = json.load(open(os.path.join(ROOT, 'source/narration_words.json')))
MAXL = 42
cues, cur = [], []
def flush():
    if cur: cues.append(list(cur)); cur.clear()
for i, w in enumerate(W):
    if cur and (w['chunk'] != cur[-1]['chunk'] or w['t'][0] - cur[-1]['t'][1] > .6): flush()
    cur.append(w)
    text = ' '.join(x['w'] for x in cur)
    end_sent = w['w'][-1] in '.?!'
    if end_sent or len(text) > 2 * MAXL - 12 or (w['w'][-1] == ',' and len(text) > 30): flush()
flush()
def lines(ws):
    txt = ' '.join(x['w'] for x in ws)
    if len(txt) <= MAXL: return txt
    best = None
    for k in range(1, len(ws)):
        a = ' '.join(x['w'] for x in ws[:k]); b = ' '.join(x['w'] for x in ws[k:])
        if len(a) <= MAXL and len(b) <= MAXL:
            sc = abs(len(a) - len(b)) - (8 if a[-1] in ',.?' else 0)
            if best is None or sc < best[0]: best = (sc, a + '\n' + b)
    return best[1] if best else txt
def ts(t, sep=','):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f'{h:02d}:{m:02d}:{int(s):02d}{sep}{int(round((s - int(s)) * 1000)):03d}'
out = []
for k, c in enumerate(cues):
    a = c[0]['t'][0] - .05; b = c[-1]['t'][1] + .25
    if k + 1 < len(cues): b = min(b, cues[k + 1][0]['t'][0] - .08)
    out.append((a, max(b, a + .8), lines(c)))
srt = '\n'.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{t}\n' for i, (a, b, t) in enumerate(out))
open(os.path.join(ROOT, 'final/Commercial_Expert_Chery_subtitulos_ES.srt'), 'w', encoding='utf-8').write(srt)
# ASS con estilo de marca para la versión con subtítulos quemados (zona segura inferior)
ass = ['[Script Info]', 'ScriptType: v4.00+', 'PlayResX: 1080', 'PlayResY: 1920', '', '[V4+ Styles]',
       'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
       'Style: Sub,Inter,46,&H00FFFFFF,&H00FFFFFF,&H00281F1B,&H99281F1B,-1,0,0,0,100,100,0,0,3,14,0,2,90,90,430,1', '',
       '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
for a, b, t in out:
    ass.append(f'Dialogue: 0,{ts(a, ".")[1:-1]},{ts(b, ".")[1:-1]},Sub,,0,0,0,,{t.replace(chr(10), "\\N")}')
open(os.path.join(ROOT, 'source/audio/subtitulos.ass'), 'w', encoding='utf-8').write('\n'.join(ass) + '\n')
print(srt)

# Variante horizontal 16:9
ass16 = [l.replace('PlayResX: 1080', 'PlayResX: 1920').replace('PlayResY: 1920', 'PlayResY: 1080')
         .replace('Style: Sub,Inter,46,', 'Style: Sub,Inter,42,').replace(',3,14,0,2,90,90,430,1', ',3,12,0,2,240,240,60,1') for l in ass]
open(os.path.join(ROOT, 'source/audio/subtitulos_16x9.ass'), 'w', encoding='utf-8').write('\n'.join(ass16) + '\n')
