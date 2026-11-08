"""Prepara las grabaciones para el compositor:
- extrae cada recordings/*.mp4 a source/compose/clips/<clip>/%06d.jpg (30 fps)
- genera source/compose/data.js con CLIPS (tamaños), MARKS (marcas de tiempo) y RECTS (posiciones de resaltados)
Uso: python source/compose/prep.py [--force]
"""
import json, os, glob, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REC = os.path.join(ROOT, 'grabaciones'); OUT = os.path.join(ROOT, 'source/compose/clips')
force = '--force' in sys.argv
clips, marks, rects = {}, {}, {}
for mp4 in sorted(glob.glob(os.path.join(REC, '*.mp4'))):
    name = os.path.basename(mp4)[:-4]
    d = os.path.join(OUT, name)
    if force or not os.path.isdir(d) or not os.listdir(d):
        os.makedirs(d, exist_ok=True)
        for f in glob.glob(d + '/*.jpg'): os.remove(f)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-vf', 'fps=30', '-q:v', '2', d + '/%06d.jpg'], check=True)
    n = len(glob.glob(d + '/*.jpg'))
    w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', mp4], capture_output=True, text=True).stdout.strip().split(','))
    clips[name] = {'frames': n, 'w': w, 'h': h, 'cssW': 1280, 'cssH': 800, 'dur': n / 30}
    mj = mp4[:-4] + '.marks.json'
    if os.path.exists(mj):
        m = json.load(open(mj)); marks[name] = {x['label']: x['t'] for x in m['marks']}
    print(f'{name}: {n} fotogramas {w}x{h}')
# rectángulos de resaltado
cl = os.path.join(REC, 'C05_chat_log.json')
if os.path.exists(cl):
    rects['chat'] = [{'q': x['q'], 'a': x['a'], 'rects': x['rects']} for x in json.load(open(cl))]
for extra in ['C04b_rects.json']:
    p = os.path.join(REC, extra)
    if os.path.exists(p): rects[extra.split('_')[0]] = json.load(open(p))
words = json.load(open(os.path.join(ROOT, 'source/narration_words.json')))
tl = json.load(open(os.path.join(ROOT, 'source/timeline_master.json')))
with open(os.path.join(ROOT, 'source/compose/data.js'), 'w') as f:
    f.write('// Generado por prep.py — no editar a mano\n')
    f.write('window.CLIPS = ' + json.dumps(clips) + ';\n')
    f.write('window.MARKS = ' + json.dumps(marks) + ';\n')
    f.write('window.RECTS = ' + json.dumps(rects, ensure_ascii=False) + ';\n')
    f.write('window.WORDS = ' + json.dumps(words, ensure_ascii=False) + ';\n')
    f.write('window.TL = ' + json.dumps(tl, ensure_ascii=False) + ';\n')
print('data.js ok')
