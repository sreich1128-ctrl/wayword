# Merges a batch of draft content into the content files. Used for the Level 2 batches.
#   python3 scripts/apply-batch.py scripts/batches/<name>
# The folder holds spec.json (English: concepts, replies, variations, review notes) and one
# <code>.txt per language, one line per item:  id | target | [reading |] pronunciation
#   plain id = phrase · r:<id> = reply you hear · x:<frame>~<variant> = a frame's variation.
# Adds only: existing ids are left alone, and content/lang/ (the vetted dataset) is never touched.
import json, sys, os
src = sys.argv[1]
J = lambda p: json.load(open(p, encoding='utf-8'))
def W(p, d): open(p, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
spec = J(os.path.join(src, 'spec.json'))
LEVEL = spec.get('level', 2)

concepts = J('content/concepts.json'); have = {c['id'] for c in concepts}
for i, cat, en, typ, sit in spec['concepts']:
    if i not in have: concepts.append({'id': i, 'category': cat, 'priority': 'explore', 'english': en, 'type': typ, 'level': LEVEL, 'situation': sit})
W('content/concepts.json', concepts)
ids = {c['id'] for c in concepts}

rep = J('content/replies.json'); rhave = {r['id'] for r in rep['replies']}
for i, en, sits, ans in spec['replies']:
    bad = [a for a in ans if a not in ids]
    assert not bad, ('reply answers with unknown phrase', i, bad)
    if i not in rhave: rep['replies'].append({'id': i, 'english': en, 'situations': sits, 'answer_with': ans, 'level': LEVEL})
W('content/replies.json', rep)

pat = J('content/patterns.json')
for pid, vs in spec['examples'].items():
    conf = pat['patterns'].setdefault(pid, {'related': [], 'substitutions': {}, 'examples': []})
    seen = {v if isinstance(v, str) else v['id'] for v in conf.setdefault('examples', [])}
    for vid, label, en in vs:
        if vid not in seen: conf['examples'].append({'id': vid, 'label': label, 'english': en})
W('content/patterns.json', pat)

sc = J('content/scenarios.json'); by = {s['id']: s for s in sc}
for i, cat, en, typ, sit in spec['concepts']:
    lst = by[sit].setdefault(f'level{LEVEL}', [])
    if i not in lst: lst.append(i)
W('content/scenarios.json', sc)

entry_ids = [c[0] for c in spec['concepts']]
reply_ids = {r[0] for r in spec['replies']}
ex_ids = {f'{p}~{v[0]}' for p, vs in spec['examples'].items() for v in vs}
for code in ['pt-PT', 'es', 'fr', 'it', 'ro', 'ru', 'ja', 'he', 'ar-levantine']:
    a = J(f'content/added/{code}.json')
    q = {**spec.get('qa', {}).get('*', {}), **spec.get('qa', {}).get(code, {})}
    ja = code == 'ja'
    got = {'e': {}, 'r': {}, 'x': {}}
    for line in open(os.path.join(src, f'{code}.txt'), encoding='utf-8'):
        if not line.strip(): continue
        parts = [p.strip() for p in line.rstrip('\n').split(' | ')]
        assert len(parts) == (4 if ja else 3), (code, line)
        key = parts[0]
        item = {'target': parts[1], 'reading': parts[2], 'pronunciation_easy': parts[3]} if ja else {'target': parts[1], 'pronunciation_easy': parts[2]}
        kind, k = ('r', key[2:]) if key.startswith('r:') else ('x', key[2:]) if key.startswith('x:') else ('e', key)
        if q.get(k): item['qa'] = q[k]
        got[kind][k] = item
    assert list(got['e']) == entry_ids, (code, 'phrases', set(entry_ids) ^ set(got['e']))
    assert set(got['r']) == reply_ids, (code, 'replies', reply_ids ^ set(got['r']))
    assert set(got['x']) == ex_ids, (code, 'variations', ex_ids ^ set(got['x']))
    for c in spec['concepts']:   # a frame keeps its blank in every language
        if c[3] == 'pattern': assert '___' in got['e'][c[0]]['target'], (code, c[0], 'no blank')
    have_e = {x['id'] for x in a['entries']}
    for k, item in got['e'].items():
        if k not in have_e: a['entries'].append({'id': k, **item})
    for k, item in got['r'].items(): a.setdefault('replies', {}).setdefault(k, item)
    for k, item in got['x'].items():
        pid, vid = k.split('~')
        lst = a.setdefault('examples', {}).setdefault(pid, [])
        if not any(x['word'] == vid for x in lst): lst.append({'word': vid, **item})
    W(f'content/added/{code}.json', a)
    print(code, len(a['entries']), 'phrases', len(a['replies']), 'replies', sum(len(v) for v in a['examples'].values()), 'variations')
