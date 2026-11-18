# Pronunciation-line audit (2026-11-18): one respelling per word, the reductions people actually
# say, stress shown on every line. Drafts (content/added/) are corrected in place. The vetted
# dataset (content/lang/) is never edited: its corrections go to content/pron/<code>.json, an
# overlay the app applies when it loads a language (js/data.js).
#   python3 scripts/fix-pron.py          # apply
#   python3 scripts/fix-pron.py --dry    # show what would change
import json, re, sys, os
DRY = '--dry' in sys.argv
J = lambda p: json.load(open(p, encoding='utf-8'))
def W(p, d): open(p, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
clean = lambda w: re.sub(r"[^\w'’-]", '', w.lower()).strip("-'’")

# target word -> the one respelling (CAPITALS = stressed syllable)
WORDS = {
 'pt-PT': {'que': 'kuh', 'estou': 'SHTOH', 'está': 'SHTAH', 'estão': 'SHTOWNG', 'estamos': 'SHTAH-moosh', 'estará': 'shtah-RAH', 'com': 'kong', 'só': 'soh', 'estação': 'shtah-SOWNG',
   'sim': 'seeng', 'também': 'tang-BENG', 'muito': 'MOOYN-too', 'tenho': 'TEN-yoo', 'faz': 'fash', 'inglês': 'een-GLESH', 'cartão': 'kar-TOWNG',
   'dinheiro': 'dee-NYAY-roo', 'alguém': 'al-GENG', 'escrever': 'shkruh-VEHR', 'comprar': 'kong-PRAR', 'bom': 'bong', 'recomenda': 'ruh-koo-MEN-dah',
   'estados': 'SHTAH-dooz', 'esquerda': 'SHKEHR-dah', 'experimentar': 'shpuh-ree-men-TAR', 'diz': 'deesh', 'traz': 'trash', 'meu': 'MEH-oo'},
 'fr': {'bien': 'byan', 'taille': 'tie', 'compris': 'kohn-pree', 'bagages': 'bah-gahzh', 'très': 'treh', 'taxes': 'tahks', 'comprends': 'kohn-prahn',
   'taxi': 'tahk-see', 'comprises': 'kohn-preez', 'lentement': 'lahnt-MAHN'},
 'it': {'quanto': 'KWAHN-toh', "all'aeroporto": 'ahl-lah-eh-roh-POR-toh', "all'hotel": 'ahl-loh-TEL', 'inglese': 'een-GLEH-zeh', 'acqua': 'AHK-kwah', 'tuo': 'TOO-oh',
   'ai': 'eye', 'taxi': 'TAHK-see', 'latticini': 'laht-tee-CHEE-nee', 'del': 'del', "l'ingresso": 'leen-GRES-soh', 'ghiaccio': 'GYAHT-choh'},
 'es': {'taxi': 'TAHK-see', 'están': 'es-TAHN', 'efectivo': 'eh-fek-TEE-voh'},
 'ro': {'foarte': 'FWAR-teh', 'meu': 'MEH-oo', 'să-mi': 'suhm', 'altă': 'AHL-tuh', 'nou': 'NOH-oo', 'rău': 'RUH-oo', 'vreo': 'VREH-oh',
   'recomandați': 'reh-koh-mahn-DAHTS', 'înainte': 'in-ah-EEN-teh', 'place': 'PLAH-cheh', 'sunteți': 'SOON-tets', 'gluten': 'gloo-TEN'},
 'ru': {'без': 'byez', 'аллергия': 'ah-leer-GHEE-yah', 'добраться': 'dah-BRAHT-sah', 'тоже': 'TOH-zheh', 'от': 'aht', 'этот': 'EH-taht', 'выход': 'VY-khaht',
   'очень': 'OH-cheen', 'кофе': 'KOH-feh', 'через': 'CHEH-rees', 'помощь': 'POH-mahshch', 'этом': 'EH-tahm', 'так': 'tahk', 'картой': 'KAR-toy',
   'интересно': 'een-tee-RYES-nah', 'завтрак': 'ZAHF-trahk', 'морепродукты': 'mah-ree-prah-DOOK-ty', 'орехов': 'ah-RYEH-khahf'},
 'he': {'סליחה': 'slee-KHA', 'שוב': 'shoov', 'בזה': 'be-ZE', 'התעופה': 'ha-te-u-FA', 'משהו': 'MA-she-hu', 'במידה': 'be-mee-DA', 'מידה': 'mee-DA',
   'להחליף': 'le-hakh-LEEF', 'הברית': 'ha-BREET', 'בחוץ': 'ba-KHUTS', 'מוצרי': 'mots-REY', 'קצת': 'ktsat', 'דרך': 'DE-rekh', 'אחרת': 'a-KHE-ret'},
 'ar-levantine': {'عندي': 'IN-dee', 'عندك': 'IN-dak', 'عندكم': 'IN-dkom', 'تذاكر': 'ta-ZAA-ker', 'السعر': "is-SI'-er", 'يعني': "YA'-nee", 'معك': "MA-'ak", 'قبل': 'abl',
   'تلفوني': 'tal-FOH-nee', 'مكسرات': 'mkas-sa-RAAT', 'بعرف': "BA'-ref", 'تعيد': 't-EED', 'باخده': 'BAA-khdoh', 'الفطور': 'il-f-TOOR', 'معي': "MA-'ee", 'الجاية': 'ij-JAA-yeh', 'أحكي': 'AH-kee', 'على': 'A-la', 'بالكرت': 'bil-KART', 'محسوبة': 'mah-SOO-beh', 'الفاتورة': 'il-faa-TOO-ra'},
}
# whole-line patterns, applied after the words (connected speech)
LINES = {
 'pt-PT': [(r'\boo kuh eh kuh\b', 'oo-kee-EH-kuh'), (r'\bah kuh OH-', 'ah kee OH-'), (r'\boo kuh fash\b', 'oo kuh FASH'), (r'\bkuh SHTAH\b', 'kuh SHTAH')],
 'fr': [(r'\bess keel yah\b', 'es-kee-yah'), (r'\bkeel yah\b', 'kee-yah'), (r'\beel yah\b', 'ee-yah'), (r'\bzhuh nuh ', 'zhuhn '), (r'\bkes-kuh\b', 'kesk'), (r'\be(?:s|ss)[- ]kuh\b', 'esk'), (r'\bkess kuh\b', 'kesk')],
}
# lines that showed no stress at all: the stressed syllable, marked
IDS = {
 'pt-PT': {'im_from': 'SOH duh ___', 'reply~l2_yes_it_does': 'SEENG, TENG', 'l2_what_brings': 'oo kuh oo/ah TRASH kah'},
 'es': {'and_you': 'ee TOO', 'im_from': 'SOY deh ___', 'l2_leaving_on': 'meh VOY ___'},
 'it': {'know_a_little': 'neh SOH oon POH', 'and_you': 'eh TOO', 'l2_and_then': 'eh POY', 'reply~l2_yes_it_does': 'SEE, CHEH'},
 'fr': {'where_is': 'oo EH ___', 'look_beautiful': 'tew eh treh BOH/BEL'},
 'he': {'know_a_little': 'a-NEE yo-DE-a ktsat'},
}

def syl(tok): return tok.split('-')
def recase(old, new):
    o, n = syl(old), syl(new)
    if len(o) != len(n): return new
    if not any(s.isupper() for s in o if s.isalpha()) and len(n) == 1: return new.lower() if len(o) == 1 and not o[0].isupper() else new
    return '-'.join(b.upper() if a.isupper() else b.lower() for a, b in zip(o, n))

def fix(code, target, pron, key):
    out = pron
    rules = WORDS.get(code, {})
    tt = [w for w in target.split() if clean(w.replace('___', ''))]
    pt = out.split()
    idx = [i for i, w in enumerate(pt) if clean(w.replace('___', ''))]
    if rules and len(tt) == len(idx):
        for tw, i in zip(tt, idx):
            tok = pt[i]
            if '/' in tok: continue
            m = re.match(r"^([^\w']*)([\w'’-]+?)([^\w']*)$", tok)
            if not m: continue
            pre, core, post = m.groups()
            want = rules.get(clean(tw))
            new = core
            if want and core.lower().replace('-', '') != want.lower().replace('-', ''):
                new = want if code != 'fr' or len(syl(core)) != len(syl(want)) else recase(core, want)
            elif want and code != 'fr' and core != want:
                new = want  # same letters, different stress mark: one spelling per word
            if code == 'pt-PT' and new.startswith('esh-') and re.match(r'e[sx][tpcq]', clean(tw)):
                rest = new[4:]
                first = rest.split('-')[0]
                new = ('SH' if first.isupper() else 'sh') + rest   # unstressed es- at the start of a word is just "sh"
            if code == 'ru' and re.search(r'(ать|ять)$', clean(tw)) and re.search(r'(?i)[^h]at$', new):
                new = new[:-2] + ('AHT' if new[-2:].isupper() else 'aht')
            pt[i] = pre + new + post
        out = ' '.join(pt)
    for pat, rep in LINES.get(code, []): out = re.sub(pat, rep, out)
    if key in IDS.get(code, {}): out = IDS[code][key]
    return out

total = {}
for code in ['pt-PT', 'es', 'fr', 'it', 'ro', 'ru', 'ja', 'he', 'ar-levantine']:
    vetted = J(f'content/lang/{code}.json'); added = J(f'content/added/{code}.json')
    over_path = f'content/pron/{code}.json'
    over = J(over_path) if os.path.exists(over_path) else {}
    changes = []
    for e in vetted['entries']:
        if not e.get('target'): continue
        cur = over.get(e['id'], e['pronunciation_easy'])
        new = fix(code, e['target'], cur, e['id'])
        if new != e['pronunciation_easy']:
            if over.get(e['id']) != new: changes.append((e['id'], cur, new))
            over[e['id']] = new
    def go(item, key):
        new = fix(code, item['target'], item['pronunciation_easy'], key)
        if new != item['pronunciation_easy']:
            changes.append((key, item['pronunciation_easy'], new)); item['pronunciation_easy'] = new
    for e in added['entries']: go(e, e['id'])
    for k, v in added.get('replies', {}).items(): go(v, 'reply~' + k)
    for pid, lst in added.get('examples', {}).items():
        for x in lst: go(x, f"{pid}~{x['word']}")
    total[code] = (len(changes), len(over))
    if not DRY:
        os.makedirs('content/pron', exist_ok=True)
        W(over_path, dict(sorted(over.items())))
        W(f'content/added/{code}.json', added)
    if '--show' in sys.argv or DRY:
        print(f'\n## {code}: {len(changes)} lines change ({len(over)} vetted overrides)')
        for k, a, b in changes[: (400 if '--all' in sys.argv else 14)]: print(f'   {k}: {a}  →  {b}')
print({k: f'{v[0]} changed, {v[1]} vetted overrides' for k, v in total.items()})
