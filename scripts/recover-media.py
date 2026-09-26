"""Restore missing portfolio posters from their original public sources."""
import concurrent.futures
import io
import json
import pathlib
import re
import urllib.request

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
projects = json.loads((ROOT / 'content/projects.json').read_text())
records = {r['id']: r for r in json.loads((ROOT / 'docs/source-inventory.json').read_text())['records']}

def recover(project):
    poster = project.get('poster', '')
    if not poster or poster.startswith('https:'):
        return None
    if not re.fullmatch(r'media/[A-Za-z0-9_.-]+', poster):
        raise ValueError('Invalid local poster path: ' + poster)
    output = ROOT / 'public' / poster
    if output.exists():
        return None
    record = records.get(project['id'], {})
    candidates = [record.get('image_rendition_url'), record.get('image_source_url')]
    if project['provider'] == 'youtube':
        video = re.search(r'/embed/([\w-]{11})', project.get('embedUrl', ''))
        if video:
            candidates = [f'https://img.youtube.com/vi/{video[1]}/hqdefault.jpg', f'https://img.youtube.com/vi/{video[1]}/mqdefault.jpg']
    elif project['provider'] == 'drive':
        video = re.search(r'/file/d/([\w-]+)', project.get('embedUrl', ''))
        if video:
            candidates = [f'https://drive.google.com/thumbnail?id={video[1]}&sz=w1200']
    errors = []
    for source in filter(None, candidates):
        for attempt in range(2):
            try:
                request = urllib.request.Request(source, headers={'User-Agent': 'Mozilla/5.0 PortfolioAssetRecovery/1.0'})
                with urllib.request.urlopen(request, timeout=25) as response:
                    data = response.read(20 * 1024 * 1024 + 1)
                if len(data) > 20 * 1024 * 1024:
                    raise ValueError('Image exceeds 20 MiB')
                picture = Image.open(io.BytesIO(data)).convert('RGB')
                if min(picture.size) < 20:
                    raise ValueError('Image is too small')
                picture.thumbnail((1400, 1400))
                output.parent.mkdir(parents=True, exist_ok=True)
                picture.save(output, 'WEBP', quality=82, method=5)
                print('Restored ' + project['id'], flush=True)
                return None
            except Exception as error:
                errors.append(str(error))
    return project['id'] + ': ' + '; '.join(errors[-2:])

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    failures = [message for message in pool.map(recover, projects) if message]
if failures:
    raise SystemExit('Could not restore:\n' + '\n'.join(failures))
print('All project posters are available.')
