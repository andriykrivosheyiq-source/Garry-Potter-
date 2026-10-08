"""Збирає garments.js з мокапів Loomiq.

Запуск: python3 tools/build-garments.py <шлях до Vyshyvka/images> <шлях до Vyshyvka/catalog-base.js>
Кладе оброблені фото в images/g/ (білий фон, ширина ≤ 720px) і пише garments.js:
для кожного виробу — кольори (назва, hex) і межі виробу на кожному фото (у %),
від яких конструктор рахує, де стоїть дизайн.
"""
import sys, os, glob, json, re
from PIL import Image, ImageDraw
import numpy as np

SRC, CATALOG = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DST = os.path.join(ROOT, 'images', 'g')
os.makedirs(DST, exist_ok=True)

VIEWS = {'teeover': ['front', 'back'], 'tee': ['front', 'back'], 'hoodieover': ['front', 'back'],
         'hoodieoverfleece': ['front', 'back'], 'hoodie': ['front', 'back'], 'hoodiezip': ['front', 'back'],
         'sweat': ['front', 'back'], 'cap': ['front', 'left'], 'tote': ['front']}

src = open(CATALOG, encoding='utf-8').read()
base = json.loads(src[src.index('{'):src.rindex('}') + 1])
names = {g['id']: g['name'] for g in base['garments']}
colors = base['colors']

out = {}
for prod, views in VIEWS.items():
    cols = []
    for c in colors.get(prod, []):
        shots = {}
        for v in views:
            f = f'{SRC}/{prod}-{c["id"]}-{v}.webp'
            if not os.path.exists(f):
                break
            im = Image.open(f).convert('RGB')
            if im.width > 720:
                im = im.resize((720, round(im.height * 720 / im.width)), Image.LANCZOS)
            for p in [(1, 1), (im.width - 2, 1), (1, im.height - 2), (im.width - 2, im.height - 2)]:
                if sum(im.getpixel(p)) > 600:
                    ImageDraw.floodfill(im, p, (255, 255, 255), thresh=24)
            a = np.asarray(im).astype(int)
            ys, xs = np.where(a.min(axis=2) < 235)
            x0, x1 = np.percentile(xs, [0.3, 99.7]); y0, y1 = np.percentile(ys, [0.3, 99.7])
            im.save(f'{DST}/{prod}-{c["id"]}-{v}.webp', 'WEBP', quality=82, method=6)
            shots[v] = [im.width, im.height, round(x0 / im.width * 100, 2), round(y0 / im.height * 100, 2),
                        round((x1 - x0) / im.width * 100, 2), round((y1 - y0) / im.height * 100, 2)]
        if len(shots) == len(views):
            cols.append({'id': c['id'], 'name': c['name'], 'hex': c['hex'], 'shots': shots})
    out[prod] = {'name': names[prod], 'colors': cols}

with open(os.path.join(ROOT, 'garments.js'), 'w', encoding='utf-8') as fh:
    fh.write('/* Створено tools/build-garments.py з мокапів Loomiq. Руками не правити. */\n')
    fh.write('window.GARMENTS = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print({k: len(v['colors']) for k, v in out.items()})
