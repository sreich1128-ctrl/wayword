# One-off: merges the Level 1 repair drafts (2026-11-14, docs/LEVEL_CUT.md) into the content files.
# Usage: python3 scripts/apply-level1-repairs.py <dir with one <code>.txt per language>
# Line format: id | target | [reading |] pronunciation   (r:<id> = reply, x:<frame>~<variant> = example)
import json, sys, os
src = sys.argv[1]
J = lambda p: json.load(open(p, encoding='utf-8'))
def W(p, d): open(p, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')

CONCEPTS = [
 ('look_beautiful','connection','explore','You look beautiful.','phrase'),
 ('love_outfit','connection','explore','I love your outfit.','phrase'),
 ('beautiful_smile','connection','explore','You have a beautiful smile.','phrase'),
 ('like_style','connection','explore','I like your style.','phrase'),
 ('get_coffee','connection','explore','Would you like to get a coffee?','phrase'),
 ('buy_drink','connection','explore','Can I buy you a drink?','phrase'),
 ('see_again','connection','explore',"I'd like to see you again.",'phrase'),
 ('free_tomorrow','connection','explore','Are you free tomorrow?','phrase'),
 ('your_number','connection','explore','Can I have your number?','phrase'),
 ('with_friends','connection','explore','Are you here with friends?','phrase'),
 ('great_time','connection','explore','I had a great time.','phrase'),
 ('not_interested','connection','travel',"Thanks, but I'm not interested.",'phrase'),
 ('leave_me_alone','emergency','core','Please leave me alone.','phrase'),
 ('my_name_is','social','travel','My name is ___.','pattern'),
 ('im_from','social','travel',"I'm from ___.",'pattern'),
 ('how_long_here','social','travel','How long are you here for?','phrase'),
 ('cheers','social','travel','Cheers!','phrase'),
 ('need_ambulance','emergency','core','I need an ambulance.','phrase'),
 ('hurts_here','emergency','core','It hurts here.','phrase'),
 ('been_robbed','emergency','travel',"I've been robbed.",'phrase'),
 ('medicine_for','emergency','travel','I need medicine for ___.','pattern'),
 ('trouble_breathing','emergency','travel',"I'm having trouble breathing.",'phrase'),
 ('luggage_missing','transportation','travel',"My luggage didn't arrive.",'phrase'),
 ('flight_delayed','transportation','travel','Is my flight delayed?','phrase'),
 ('connecting_flight','transportation','travel','I have a connecting flight.','phrase'),
 ('tickets_please','navigation','travel','___ tickets, please.','pattern'),
 ('what_time_open','navigation','travel','What time does it open?','phrase'),
 ('what_time_close','navigation','travel','What time does it close?','phrase'),
 ('tour_english','navigation','explore','Is there a guided tour in English?','phrase'),
 ('on_tap','food','explore','What do you have on tap?','phrase'),
 ('non_alcoholic','food','travel','Something non-alcoholic, please.','phrase'),
 ('what_time_is_it','essentials','travel','What time is it?','phrase'),
]
REPLIES = [
 ('id_love_to',"I'd love to.",['flirting'],[]),
 ('maybe_another_time','Maybe another time.',['flirting'],[]),
 ('sorry_i_cant',"Sorry, I can't.",['flirting'],[]),
 ('seeing_someone',"I'm seeing someone.",['flirting'],[]),
 ('here_for_a_week',"I'm here for a week.",['meeting'],[]),
 ('how_long_staying','How long are you staying?',['meeting'],[],'how_long_here'),
 ('like_it_here','Do you like it here?',['meeting'],['yes']),
 ('what_happened','What happened?',['emergency'],['been_robbed','not_well']),
 ('where_hurt','Where does it hurt?',['emergency'],['hurts_here']),
 ('wait_here','Wait here.',['emergency'],['okay']),
 ('passport_please','Passport, please.',['airport','hotel'],[]),
 ('boarding_started','Boarding has started.',['airport'],[]),
 ('gate_changed','Your gate has changed.',['airport'],[]),
 ('sold_out',"It's sold out.",['sightseeing'],[]),
 ('follow_me','Follow me.',['sightseeing','directions'],['okay']),
 ('what_can_i_get','What can I get you?',['bar','cafe'],['i_would_like','on_tap','non_alcoholic']),
 ('last_call','Last call.',['bar'],['another_one']),
 ('thats_altogether',"That's twenty altogether.",['numbers'],[]),
 ('starts_at','It starts at ten.',['numbers','sightseeing'],[]),
]
EXAMPLES = {
 'where_is': [('hospital','the hospital','Where is the hospital?'),('checkin','check-in','Where is check-in?'),('baggage','baggage claim','Where is baggage claim?'),('gate','the gate','Where is the gate?')],
 'im_from': [('usa','the United States',"I'm from the United States."),('canada','Canada',"I'm from Canada."),('uk','the UK',"I'm from the UK."),('israel','Israel',"I'm from Israel."),('australia','Australia',"I'm from Australia.")],
 'medicine_for': [('pain','pain','I need medicine for pain.'),('fever','a fever','I need medicine for a fever.'),('cough','a cough','I need medicine for a cough.'),('allergies','allergies','I need medicine for allergies.')],
 'tickets_please': [('one','one','One ticket, please.'),('two','two','Two tickets, please.'),('three','three','Three tickets, please.'),('four','four','Four tickets, please.')],
 'i_would_like': [('red_wine','red wine',"I'd like a glass of red wine, please."),('white_wine','white wine',"I'd like a glass of white wine, please.")],
}
PRIORITY = {'need_ambulance','hurts_here','medicine_for','trouble_breathing','not_interested','leave_me_alone'}
QA = {
 '*': {
  'look_beautiful': 'Said to someone you are flirting with; both gender forms are shown where the language changes with who you talk to.',
  'thats_altogether': 'A price heard at a till, with a plain number so it fits any currency.',
 },
 'pt-PT': {'look_beautiful': 'Formal register like the other social phrases in this set (bonita to a woman, bonito to a man). Informal: Estás muito bonita/bonito.', 'like_it_here': 'Reviewer: or simply "Está a gostar?"'},
 'es': {'great_time': 'Neutral Latin American. Spain: "Me lo pasé muy bien."', 'buy_drink': 'Neutral. Spain: "¿Te invito a una copa?"', 'been_robbed': 'Spain: "Me han robado."'},
 'fr': {'look_beautiful': 'beau to a man, belle to a woman.', 'sorry_i_cant': 'A woman writes "Désolée"; it sounds the same.'},
 'it': {'love_outfit': 'Literally "I like how you are dressed".'},
 'ro': {'look_beautiful': 'frumoasă to a woman, frumos to a man.'},
 'ru': {'cheers': 'The toast foreigners know. Among Russians a toast is usually to something: "За встречу!" (to our meeting).', 'thats_altogether': 'Literally "From you, twenty": how a total is said at a till.'},
 'ja': {
  'look_beautiful': 'PRIORITY REVIEW (directness). きれい is said to a woman; to a man: かっこいいですね。 A direct compliment on looks to a stranger is forward in Japanese.',
  'beautiful_smile': 'PRIORITY REVIEW (directness).',
  'leave_me_alone': 'PRIORITY REVIEW. A firm "Please stop." The literal ほっといてください is harsher. The no must stay clear.',
  'not_interested': 'PRIORITY REVIEW. 結構です is a clear, polite no.',
  'sorry_i_cant': 'The usual soft refusal: literally "Sorry, it is a little…". It means no.',
  'medicine_for~pain': 'Natural word for a painkiller, rather than a literal "medicine for pain".',
  'thats_altogether': 'Plain number as in the other languages; in Japan you would hear a yen amount (二千円です).',
  'my_name_is': 'Reviewer: or ___です。',
 },
 'he': {
  'look_beautiful': 'First form to a woman, second to a man.',
  '_note': 'Other lines follow this set\'s rule: masculine "you" in the pronunciation line. To a woman: shel-AKH, le-AKH, ot-AKH, at pnuya.',
  'sorry_i_cant': 'Said by a woman. A man: לא יכול (lo ya-KHOL).',
  'seeing_someone': 'Or מישהי (MEE-she-hee) for a woman.',
  'leave_me_alone': 'PRIORITY REVIEW. To a woman: תעזבי אותי.',
 },
 'ar-levantine': {
  'look_beautiful': 'PRIORITY REVIEW (directness). First form to a woman, second to a man. Forward with a stranger in many settings.',
  'beautiful_smile': 'PRIORITY REVIEW (directness).',
  'cheers': 'Only where people are drinking. Do not assume alcohol.',
  'sorry_i_cant': 'Said by a woman. A man: آسف (AA-sef).',
  'seeing_someone': 'Said by a woman. A man: مرتبط (mir-TIBet).',
  'leave_me_alone': 'PRIORITY REVIEW. To a woman: اتركيني.',
  'buy_drink': 'مشروب is any drink, not necessarily alcohol.',
 },
}

# ---- shared files
concepts = J('content/concepts.json'); have = {c['id'] for c in concepts}
for i, cat, pri, en, typ in CONCEPTS:
    if i not in have: concepts.append({'id': i, 'category': cat, 'priority': pri, 'english': en, 'type': typ})
W('content/concepts.json', concepts)
ids = {c['id'] for c in concepts}

rep = J('content/replies.json'); rhave = {r['id'] for r in rep['replies']}
for r in REPLIES:
    if r[0] in rhave: continue
    o = {'id': r[0], 'english': r[1], 'situations': r[2], 'answer_with': [a for a in r[3] if a in ids]}
    if len(r) > 4: o['same_as'] = r[4]
    rep['replies'].append(o)
for r in rep['replies']:
    if r['id'] == 'its_closed' and 'sightseeing' not in r['situations']: r['situations'].append('sightseeing')
W('content/replies.json', rep)

pat = J('content/patterns.json')
for pid, vs in EXAMPLES.items():
    conf = pat['patterns'].setdefault(pid, {'related': [], 'substitutions': {}, 'examples': []})
    ex = conf.setdefault('examples', [])
    seen = {v if isinstance(v, str) else v['id'] for v in ex}
    for vid, label, en in vs:
        if vid not in seen: ex.append({'id': vid, 'label': label, 'english': en})
W('content/patterns.json', pat)

sc = J('content/scenarios.json'); by = {s['id']: s for s in sc}
def ok(lst): return [i for i in lst if i in ids]
FL_OWN = ['look_beautiful','love_outfit','beautiful_smile','like_style','youre_funny','like_talking','get_coffee','buy_drink','free_tomorrow','see_again','your_number','instagram','with_friends','great_time','not_interested','leave_me_alone']
by['flirting'].update({'note': 'Friendly and respectful. The last two are for saying no.', 'concepts': ok(FL_OWN + ['your_name','where_from','live_here','and_you','really','interesting','me_too','nice_meeting']), 'counts': ok(FL_OWN)})
m = by['meeting']
for i in ['my_name_is','im_from','how_long_here','what_recommend','learning_by_trying']:
    if i in ids and i not in m['concepts']: m['concepts'].append(i)
m['counts'] = [i for i in dict.fromkeys(list(m.get('counts', m['concepts'])) + ['my_name_is','im_from','how_long_here','learning_by_trying']) if i in m['concepts']]
e = by['emergency']
for i in ['need_ambulance','hurts_here','trouble_breathing','been_robbed','medicine_for','leave_me_alone','where_is']:
    if i not in e['concepts']: e['concepts'].append(i)
e['counts'] = list(dict.fromkeys(list(e['counts']) + ['need_ambulance','hurts_here','trouble_breathing','been_robbed','medicine_for']))
NEW = [
 {'id': 'airport', 'label': 'Airport', 'icon': '✈️', 'note': 'Mostly listening: the announcements and questions you get here.', 'concepts': ok(['luggage_missing','flight_delayed','connecting_flight','where_is','lost_my','help_me','speak_english','say_again']), 'counts': ['luggage_missing','flight_delayed','connecting_flight']},
 {'id': 'sightseeing', 'label': 'Sightseeing', 'icon': '🎟️', 'concepts': ok(['tickets_please','what_time_open','what_time_close','tour_english','can_i_here','where_is','how_much','pay_card']), 'counts': ['tickets_please','what_time_open','what_time_close','tour_english']},
 {'id': 'bar', 'label': 'Bar', 'icon': '🍺', 'concepts': ok(['on_tap','non_alcoholic','cheers','another_one','i_would_like','bill','pay_card']), 'counts': ['on_tap','non_alcoholic','cheers']},
 {'id': 'numbers', 'label': 'Numbers & time', 'icon': '🔢', 'note': 'What you get told back: prices and times. Mostly listening.', 'concepts': ok(['what_time_is_it','how_much','how_much_is','checkout_time','next_leave']), 'counts': ['what_time_is_it']},
]
for n in NEW:
    if n['id'] not in by: sc.append(n)
W('content/scenarios.json', sc)

# ---- per language
entry_ids = [c[0] for c in CONCEPTS]
for code in ['pt-PT','es','fr','it','ro','ru','ja','he','ar-levantine']:
    a = J(f'content/added/{code}.json')
    q = {**QA['*'], **QA.get(code, {})}
    ja = code == 'ja'
    got = {'e': {}, 'r': {}, 'x': {}}
    for line in open(os.path.join(src, f'{code}.txt'), encoding='utf-8'):
        if not line.strip(): continue
        parts = [p.strip() for p in line.rstrip('\n').split(' | ')]
        assert len(parts) == (4 if ja else 3), (code, line)
        key = parts[0]
        item = {'target': parts[1], 'pronunciation_easy': parts[-1]}
        if ja: item = {'target': parts[1], 'reading': parts[2], 'pronunciation_easy': parts[3]}
        kind, k = ('r', key[2:]) if key.startswith('r:') else ('x', key[2:]) if key.startswith('x:') else ('e', key)
        note = q.get(k)
        if kind == 'e' and k in PRIORITY and not (note or '').startswith('PRIORITY'):
            note = ('PRIORITY REVIEW (' + ('medical' if k not in ('not_interested','leave_me_alone') else 'a boundary that must stay firm') + '). ' + (note or '')).strip()
        if note: item['qa'] = note
        got[kind][k] = item
    assert list(got['e']) == entry_ids, (code, 'entries')
    assert set(got['r']) == {r[0] for r in REPLIES if len(r) == 4}, (code, 'replies')
    assert set(got['x']) == {f'{p}~{v[0]}' for p, vs in EXAMPLES.items() for v in vs}, (code, 'examples')
    have_e = {x['id'] for x in a['entries']}
    for k, item in got['e'].items():
        if k not in have_e: a['entries'].append({'id': k, **item})
    for k, item in got['r'].items(): a.setdefault('replies', {}).setdefault(k, item)
    for k, item in got['x'].items():
        pid, vid = k.split('~')
        lst = a.setdefault('examples', {}).setdefault(pid, [])
        if not any(x['word'] == vid for x in lst): lst.append({'word': vid, **item})
    if code == 'he' and q.get('_note'):
        for x in a['entries']:
            if x['id'] == 'love_outfit': x.setdefault('qa', q['_note'])
    W(f'content/added/{code}.json', a)
    print(code, len(a['entries']), 'entries', len(a['replies']), 'replies', sum(len(v) for v in a['examples'].values()), 'examples')
