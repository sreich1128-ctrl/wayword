import { loadContent, loadLanguage, tierIncludes, inCategory } from './data.js';
import { store } from './store.js';

const $app = document.getElementById('app');
let C = null; // content model
let L = null; // current language bundle
let practice = null; // running flashcard session

/* ---------- helpers ---------- */

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

// Escapes text, then highlights fill-in blanks ("___" and "[language]").
function withSlots(text) {
  return esc(text)
    .replace(/_{2,}/g, '<bdi class="slot">___</bdi>')
    .replace(/\[([a-z ]+)\]/gi, '<bdi class="slot slot-word">$1</bdi>');
}

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, qs] = raw.split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  return { parts, query: new URLSearchParams(qs || '') };
}

const go = (hash) => { location.hash = hash; };

const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  map: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  puzzle: '<path d="M10 4h4v3a2 2 0 1 0 4 0V4h2v6h-3a2 2 0 1 0 0 4h3v6h-6v-3a2 2 0 1 0-4 0v3H4v-6h3a2 2 0 1 0 0-4H4V4h6Z"/>',
  cards: '<rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v13"/>',
  back: '<path d="M15 5 8 12l7 7"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  sound: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  shuffle: '<path d="M3 7h3.5c4 0 6 10 10 10H21M3 17h3.5c1.6 0 2.8-1.6 3.8-3.6M14 9.6C15 7.6 16 7 17 7h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
};
const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

/* ---------- theming ---------- */

function applyTheme(lang) {
  const root = document.documentElement;
  if (lang) {
    root.style.setProperty('--accent', lang.meta.accent);
    root.style.setProperty('--accent-2', lang.meta.accent2);
    root.dataset.motif = lang.meta.motif || '';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', lang.meta.accent);
  } else {
    root.style.removeProperty('--accent');
    root.style.removeProperty('--accent-2');
    root.dataset.motif = '';
  }
  const p = store.prefs();
  document.body.classList.toggle('hide-en', !p.showEnglish);
  document.body.classList.toggle('hide-pron', !p.showPron);
}

/* ---------- filtering ---------- */

const tier = () => store.prefs().tier;
const inTier = (p) => tierIncludes(C, tier(), p.priority);
const tierLabel = (id) => (C.tiers.find((t) => t.id === id) || {}).label || id;
const priorityLabel = (pr) => ({ core: 'Core', travel: 'Travel', explore: 'Explore' }[pr] || pr);

/* ---------- shared pieces ---------- */

function nativeAttrs(lang) {
  return `lang="${esc(lang.meta.bcp47)}" dir="${esc(lang.direction)}"`;
}

function phraseCard(p, { compact = false } = {}) {
  const lang = L.lang;
  const cat = C.categoryById.get(p.category);
  const fav = store.isFav(p.key);
  const learned = store.isLearned(p.key);
  const notes = [];
  if (p.regional_note) notes.push(`<p class="note note-regional"><span class="note-k">${icon('globe')} Regional</span>${esc(p.regional_note)}</p>`);
  if (p.usage_note) notes.push(`<p class="note"><span class="note-k">Usage</span>${esc(p.usage_note)}</p>`);
  if (p.example) notes.push(`<p class="note"><span class="note-k">Example</span><span ${nativeAttrs(lang)}>${esc(p.example)}</span></p>`);
  if (p.response) notes.push(`<p class="note"><span class="note-k">Likely reply</span><span ${nativeAttrs(lang)}>${esc(p.response)}</span></p>`);

  const native = p.missing
    ? '<p class="native missing">Not in the dataset yet</p>'
    : `<p class="native" ${nativeAttrs(lang)}>${withSlots(p.target)}</p>
       <p class="pron" data-peek="pron">${withSlots(p.pron)}</p>`;

  return `
  <article class="card ${p.type === 'pattern' ? 'is-pattern' : ''} ${learned ? 'is-learned' : ''} ${compact ? 'compact' : ''}" data-key="${esc(p.key)}" data-id="${esc(p.id)}">
    <div class="card-top">
      <span class="chip-mini">${cat ? cat.icon : ''} ${esc(cat ? cat.label : p.category)}</span>
      <span class="prio prio-${esc(p.priority)}">${esc(priorityLabel(p.priority))}</span>
      ${p.type === 'pattern' ? '<span class="prio prio-pattern">Pattern</span>' : ''}
      <button class="icon-btn fav ${fav ? 'on' : ''}" data-action="fav" aria-pressed="${fav}" aria-label="Favorite">${icon('star')}</button>
    </div>
    <p class="en" data-peek="en">${withSlots(p.english)}</p>
    ${native}
    ${notes.length ? `<div class="notes">${notes.join('')}</div>` : ''}
    ${p.missing ? '' : `<div class="card-actions">
      ${canSpeak() ? `<button class="pill-btn" data-action="speak">${icon('sound')}<span>Listen</span></button>` : ''}
      <button class="pill-btn learn ${learned ? 'on' : ''}" data-action="learned" aria-pressed="${learned}">${icon('check')}<span>${learned ? 'Learned' : 'Mark learned'}</span></button>
    </div>`}
  </article>`;
}

function tierBar() {
  return `<div class="tierbar" role="tablist" aria-label="Level">
    ${C.tiers.map((t) => {
      const n = L.phrases.filter((p) => t.includes.includes(p.priority)).length;
      return `<button role="tab" class="tier-btn ${t.id === tier() ? 'on' : ''}" data-action="tier" data-tier="${t.id}" aria-selected="${t.id === tier()}">
        <span>${esc(t.label)}</span><small>${n}</small></button>`;
    }).join('')}
  </div>`;
}

function header({ title, back } = {}) {
  const p = store.prefs();
  const lang = L && L.lang;
  return `<header class="topbar">
    ${back ? `<a class="icon-btn" href="${back}" aria-label="Back">${icon('back')}</a>` : lang ? '' : `<a class="brand" href="#/" aria-label="All languages">Wayword</a>`}
    ${lang ? `<a class="lang-chip" href="#/" title="Switch language"><span class="glyph" ${nativeAttrs(lang)}>${esc(lang.meta.glyph)}</span><span class="lang-chip-name">${esc(title || lang.name)}</span>${icon('globe', 'chip-switch')}</a>` : '<span></span>'}
    ${lang ? `<div class="toggles">
      <button class="tog ${p.showEnglish ? 'on' : ''}" data-action="toggle-en" aria-pressed="${p.showEnglish}" title="Show or hide English">EN</button>
      <button class="tog ${p.showPron ? 'on' : ''}" data-action="toggle-pron" aria-pressed="${p.showPron}" title="Show or hide pronunciation">Aa</button>
    </div>` : ''}
  </header>`;
}

function bottomNav(active) {
  const code = encodeURIComponent(L.lang.code);
  const items = [
    ['home', `#/${code}`, 'home', 'Home'],
    ['phrases', `#/${code}/phrases`, 'list', 'Phrases'],
    ['scenarios', `#/${code}/scenarios`, 'map', 'Scenes'],
    ['patterns', `#/${code}/patterns`, 'puzzle', 'Patterns'],
    ['practice', `#/${code}/practice`, 'cards', 'Practice'],
  ];
  return `<nav class="bottomnav" aria-label="Sections">${items.map(([id, href, ic, label]) =>
    `<a href="${href}" class="${active === id ? 'on' : ''}" ${active === id ? 'aria-current="page"' : ''}>${icon(ic)}<span>${label}</span></a>`).join('')}</nav>`;
}

function page(active, body, hdr = {}) {
  $app.innerHTML = `${header(hdr)}<main class="main">${body}</main>${bottomNav(active)}`;
}

/* ---------- views ---------- */

function viewHome() {
  const last = store.prefs().lastLang && C.languageByCode.get(store.prefs().lastLang);
  $app.innerHTML = `
  ${header()}
  <main class="main home">
    <section class="home-hero">
      <p class="eyebrow">Your pocket travel phrasebook</p>
      <h1>Where are we<br>talking today?</h1>
      ${last ? `<a class="continue" href="#/${encodeURIComponent(last.code)}" style="--accent:${last.meta.accent}">Continue with ${esc(last.name)} →</a>` : ''}
    </section>
    <section class="lang-grid">
      ${C.languages.map((l) => {
        const learned = store.countFor('learned', l.code);
        return `<a class="lang-card" href="#/${encodeURIComponent(l.code)}" style="--accent:${l.meta.accent};--accent-2:${l.meta.accent2}" data-motif="${esc(l.meta.motif || '')}">
          <span class="lang-glyph" lang="${esc(l.meta.bcp47)}" dir="${esc(l.direction)}">${esc(l.meta.glyph)}</span>
          <span class="lang-native" lang="${esc(l.meta.bcp47)}" dir="${esc(l.direction)}">${esc(l.native_name)}</span>
          <span class="lang-name">${esc(l.name)}</span>
          <span class="lang-region">${esc(l.region)}${learned ? ` · ${learned} learned` : ''}</span>
        </a>`;
      }).join('')}
    </section>
    <p class="fine">Progress is saved on this device only.</p>
  </main>`;
}

function viewDashboard() {
  const lang = L.lang;
  const pool = L.phrases.filter(inTier);
  const learned = pool.filter((p) => store.isLearned(p.key)).length;
  const pct = pool.length ? Math.round((learned / pool.length) * 100) : 0;
  const t = C.tiers.find((x) => x.id === tier());
  const favs = store.countFor('fav', lang.code);
  const pick = shuffle(pool.filter((p) => !p.missing))[0];

  page('home', `
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow">${esc(lang.name)} · ${esc(lang.region)}</p>
        <h1 class="hero-native" ${nativeAttrs(lang)}>${esc(lang.native_name)}</h1>
        <p class="hero-sub">${esc(t.blurb)}</p>
      </div>
      <div class="ring" style="--pct:${pct}" aria-label="${learned} of ${pool.length} learned">
        <strong>${learned}<small>/${pool.length}</small></strong><span>learned</span>
      </div>
    </section>
    ${tierBar()}

    <section class="quick">
      <a class="quick-btn primary" href="#/${lang.code}/practice/run?dir=en">${icon('cards')}<span>English → ${esc(lang.native_name)}</span></a>
      <a class="quick-btn" href="#/${lang.code}/practice/run?dir=target">${icon('cards')}<span><bdi>${esc(lang.native_name)}</bdi> → English</span></a>
      <a class="quick-btn" href="#/${lang.code}/phrases?cat=saved">${icon('star')}<span>Saved <small>${favs}</small></span></a>
    </section>

    ${pick ? `<section class="block">
      <div class="block-head"><h2>Phrase of the moment</h2><button class="link-btn" data-action="reroll">${icon('shuffle')} Another</button></div>
      <div id="pick">${phraseCard(pick)}</div>
    </section>` : ''}

    <section class="block">
      <div class="block-head"><h2>Scenarios</h2><a class="link-btn" href="#/${lang.code}/scenarios">All</a></div>
      <div class="scen-row">${C.scenarios.map((s) => `<a class="scen-btn" href="#/${lang.code}/scenario/${s.id}"><span class="scen-ic">${s.icon}</span>${esc(s.label)}</a>`).join('')}</div>
    </section>

    <section class="block">
      <div class="block-head"><h2>Categories</h2></div>
      <div class="cat-grid">${C.categories.map((c) => {
        const n = L.phrases.filter((p) => inTier(p) && inCategory(C, p, c.id)).length;
        return `<a class="cat-tile ${n ? '' : 'empty'}" href="#/${lang.code}/phrases?cat=${c.id}"><span class="cat-ic">${c.icon}</span><span class="cat-label">${esc(c.label)}</span><small>${n}</small></a>`;
      }).join('')}</div>
    </section>

    ${L.generalNotes.length ? `<section class="block about">
      <h2>About this ${lang.direction === 'rtl' ? 'dialect' : 'set'}</h2>
      ${L.generalNotes.map((n) => `<p><span class="note-k">${esc(n.key)}</span>${esc(n.text)}</p>`).join('')}
      ${lang.meta.tts_note ? `<p><span class="note-k">audio</span>${esc(lang.meta.tts_note)}</p>` : ''}
    </section>` : ''}
  `);
}

function viewPhrases(query) {
  const lang = L.lang;
  const cat = query.get('cat') || 'all';
  const q = (query.get('q') || '').trim();
  const chips = [
    ['all', 'All', ''], ['saved', 'Saved', '★'], ['todo', 'Not learned', '○'],
    ...C.categories.map((c) => [c.id, c.label, c.icon]),
  ];
  page('phrases', `
    ${tierBar()}
    <div class="search">${icon('search')}<input id="q" type="search" inputmode="search" placeholder="Search English, ${esc(lang.native_name)} or sounds" value="${esc(q)}" autocomplete="off"></div>
    <div class="chips" role="tablist">${chips.map(([id, label, ic]) =>
      `<a class="chip ${cat === id ? 'on' : ''}" href="#/${lang.code}/phrases?cat=${id}">${ic ? `<span>${ic}</span>` : ''}${esc(label)}</a>`).join('')}</div>
    <div id="list" class="list"></div>
  `);
  const input = document.getElementById('q');
  const draw = () => renderList(cat, input.value.trim());
  input.addEventListener('input', draw);
  draw();
  if (cat !== 'all') document.querySelector('.chip.on')?.scrollIntoView({ inline: 'center', block: 'nearest' });
}

function renderList(cat, q) {
  const needle = q.toLowerCase();
  let items = L.phrases.filter((p) => {
    if (cat === 'saved') return store.isFav(p.key);
    if (!inTier(p)) return false;
    if (cat === 'todo') return !store.isLearned(p.key);
    if (cat !== 'all' && !inCategory(C, p, cat)) return false;
    return true;
  });
  if (needle) {
    items = items.filter((p) => [p.english, p.target, p.pron, p.regional_note, p.usage_note]
      .some((s) => s && s.toLowerCase().includes(needle)));
  }
  const el = document.getElementById('list');
  if (!items.length) {
    el.innerHTML = `<div class="empty-state">${cat === 'saved' ? 'Tap ★ on any phrase to save it here.' : `Nothing here at ${esc(tierLabel(tier()))}. Try a wider level.`}</div>`;
    return;
  }
  el.innerHTML = `<p class="count">${items.length} phrase${items.length === 1 ? '' : 's'}</p>` + items.map((p) => phraseCard(p)).join('');
}

function viewScenarios() {
  const lang = L.lang;
  page('scenarios', `
    <section class="page-head"><h1>Scenarios</h1><p>Pick where you are. Only the phrases that matter there.</p></section>
    <div class="scen-grid">${C.scenarios.map((s) => {
      const n = s.concepts.filter((id) => L.byId.has(id) && inTier(L.byId.get(id))).length;
      return `<a class="scen-card" href="#/${lang.code}/scenario/${s.id}"><span class="scen-ic big">${s.icon}</span><strong>${esc(s.label)}</strong><small>${n} phrases</small></a>`;
    }).join('')}</div>
  `);
}

function viewScenario(id, query) {
  const lang = L.lang;
  const s = C.scenarios.find((x) => x.id === id);
  if (!s) return go(`#/${lang.code}/scenarios`);
  const all = s.concepts.map((cid) => L.byId.get(cid)).filter(Boolean);
  const showAll = query.get('all') === '1';
  const shown = showAll ? all : all.filter(inTier);
  const hidden = all.length - shown.length;
  page('scenarios', `
    <section class="page-head scen-head"><span class="scen-ic huge">${s.icon}</span><div><h1>${esc(s.label)}</h1><p>${shown.length} phrases${showAll ? ' · all levels' : ` · ${esc(tierLabel(tier()))}`}</p></div></section>
    ${s.note ? `<p class="callout">${esc(s.note)}</p>` : ''}
    <div class="scen-actions">
      <a class="pill-btn solid" href="#/${lang.code}/practice/run?dir=en&scenario=${s.id}">${icon('cards')}<span>Practice this scene</span></a>
    </div>
    <div class="list">${shown.map((p) => phraseCard(p)).join('')}</div>
    ${hidden > 0 ? `<a class="more-btn" href="#/${lang.code}/scenario/${s.id}?all=1">+${hidden} more at higher levels</a>` : ''}
  `, { back: `#/${lang.code}/scenarios` });
}

function viewPatterns() {
  const lang = L.lang;
  const rank = (p) => (p.category === 'power_patterns' ? 0 : 1);
  const pats = L.phrases.filter((p) => p.type === 'pattern' && inTier(p)).sort((a, b) => rank(a) - rank(b) || a.order - b.order);
  const anySubs = Object.values(C.patterns).some((x) => x.substitutions && x.substitutions[lang.code]?.length);
  page('patterns', `
    ${tierBar()}
    <section class="page-head"><h1>Power Patterns</h1><p>Learn the frame once, then swap the blank to say new things.</p></section>
    ${anySubs ? '' : '<p class="callout">Swap-in words aren’t in the dataset yet, so none are shown here. Below each pattern are the dataset phrases already built on it.</p>'}
    <div class="list">${pats.map((p) => patternCard(p)).join('') || '<div class="empty-state">No patterns at this level. Try Travel 50.</div>'}</div>
  `);
}

function patternCard(p) {
  const lang = L.lang;
  const conf = C.patterns[p.id] || {};
  const subs = (conf.substitutions && conf.substitutions[lang.code]) || [];
  const related = (conf.related || []).map((id) => L.byId.get(id)).filter((r) => r && !r.missing);
  return `<div class="pattern">
    ${phraseCard(p)}
    ${subs.length ? `<div class="subs"><p class="subs-k">Fill the blank</p><div class="sub-chips">${subs.map((s) =>
      `<span class="sub"><b ${nativeAttrs(lang)}>${esc(s.target)}</b><i data-peek="pron">${esc(s.pronunciation_easy || '')}</i><em data-peek="en">${esc(s.english)}</em></span>`).join('')}</div></div>` : ''}
    ${related.length ? `<div class="related"><p class="subs-k">Built on this</p>${related.map((r) =>
      `<a class="rel" href="#/${lang.code}/phrases?q=${encodeURIComponent(r.english)}"><b ${nativeAttrs(lang)}>${withSlots(r.target)}</b><span data-peek="en">${withSlots(r.english)}</span></a>`).join('')}</div>` : ''}
  </div>`;
}

function viewPracticeSetup() {
  const lang = L.lang;
  const pool = L.phrases.filter((p) => inTier(p) && !p.missing);
  const favs = L.phrases.filter((p) => store.isFav(p.key) && !p.missing).length;
  const todo = pool.filter((p) => !store.isLearned(p.key)).length;
  page('practice', `
    ${tierBar()}
    <section class="page-head"><h1>Practice</h1><p>Five minutes, one thumb. Tap the card to flip it.</p></section>
    <form id="setup" class="setup">
      <fieldset><legend>Direction</legend>
        <label class="opt"><input type="radio" name="dir" value="en" checked><span>English → <bdi>${esc(lang.native_name)}</bdi></span></label>
        <label class="opt"><input type="radio" name="dir" value="target"><span><bdi>${esc(lang.native_name)}</bdi> → English</span></label>
      </fieldset>
      <fieldset><legend>Deck</legend>
        <label class="opt"><input type="radio" name="deck" value="all" checked><span>All of ${esc(tierLabel(tier()))} <small>${pool.length}</small></span></label>
        <label class="opt"><input type="radio" name="deck" value="todo"><span>Not learned yet <small>${todo}</small></span></label>
        <label class="opt"><input type="radio" name="deck" value="saved" ${favs ? '' : 'disabled'}><span>Saved ★ <small>${favs}</small></span></label>
      </fieldset>
      <fieldset><legend>Category</legend>
        <select name="cat" class="select"><option value="">Any category</option>${C.categories.map((c) => `<option value="${c.id}">${c.icon} ${esc(c.label)}</option>`).join('')}</select>
      </fieldset>
      <button class="cta" type="submit">${icon('shuffle')} Shuffle &amp; start</button>
    </form>
  `);
  document.getElementById('setup').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const qs = new URLSearchParams({ dir: f.get('dir'), deck: f.get('deck') });
    if (f.get('cat')) qs.set('cat', f.get('cat'));
    go(`#/${lang.code}/practice/run?${qs}`);
  });
}

function buildDeck(query) {
  const deck = query.get('deck') || 'all';
  const cat = query.get('cat');
  const scen = query.get('scenario') && C.scenarios.find((s) => s.id === query.get('scenario'));
  let items = scen ? scen.concepts.map((id) => L.byId.get(id)).filter(Boolean) : L.phrases;
  items = items.filter((p) => !p.missing);
  if (deck === 'saved') items = items.filter((p) => store.isFav(p.key));
  else {
    items = items.filter(inTier);
    if (deck === 'todo') items = items.filter((p) => !store.isLearned(p.key));
  }
  if (cat) items = items.filter((p) => inCategory(C, p, cat));
  return shuffle(items);
}

function viewPracticeRun(query) {
  const sig = `${L.lang.code}|${query.toString()}|${tier()}`;
  if (!practice || practice.sig !== sig) {
    const deck = buildDeck(query);
    practice = { sig, dir: query.get('dir') === 'target' ? 'target' : 'en', all: deck, queue: deck.slice(), total: deck.length, done: 0, again: 0, flipped: false };
  }
  drawPractice();
}

function drawPractice() {
  const lang = L.lang;
  const s = practice;
  const back = `#/${lang.code}/practice`;
  if (!s.total) {
    page('practice', `<div class="empty-state big">No cards in this deck.<br><a href="${back}">Change the deck</a></div>`, { back });
    return;
  }
  if (!s.queue.length) {
    page('practice', `<section class="done">
      <div class="done-burst">🎉</div><h1>Deck cleared</h1>
      <p>${s.total} cards · ${s.again} repeat${s.again === 1 ? '' : 's'}</p>
      <button class="cta" data-action="restart">${icon('shuffle')} Shuffle again</button>
      <a class="more-btn" href="${back}">New deck</a>
    </section>`, { back });
    return;
  }
  const p = s.queue[0];
  const learned = store.isLearned(p.key);
  const nativeBlock = `<p class="native fc-native" ${nativeAttrs(lang)}>${withSlots(p.target)}</p><p class="pron fc-pron" data-peek="pron">${withSlots(p.pron)}</p>`;
  const englishBlock = `<p class="fc-en">${withSlots(p.english)}</p>`;
  const front = s.dir === 'en' ? englishBlock : nativeBlock;
  const backSide = s.dir === 'en' ? nativeBlock : englishBlock;
  const notes = p.regional_note ? `<p class="note note-regional"><span class="note-k">${icon('globe')} Regional</span>${esc(p.regional_note)}</p>` : '';
  const pct = Math.round((s.done / s.total) * 100);

  page('practice', `
    <div class="fc-progress"><span style="width:${pct}%"></span></div>
    <p class="fc-meta">${s.done} / ${s.total} · ${s.dir === 'en' ? 'English → ' + esc(lang.native_name) : esc(lang.native_name) + ' → English'}</p>
    <div class="flashcard ${s.flipped ? 'flipped' : ''}" data-action="flip" role="button" tabindex="0" aria-live="polite">
      <div class="fc-face">
        <span class="fc-label">${s.dir === 'en' ? 'Say it in ' + esc(lang.name) : 'What does it mean?'}</span>
        ${front}
        ${s.flipped ? `<span class="fc-divider"></span>${backSide}${notes}` : '<span class="fc-hint">Tap to reveal</span>'}
      </div>
    </div>
    <div class="fc-actions ${s.flipped ? '' : 'disabled'}">
      <button class="fc-btn again" data-action="again" ${s.flipped ? '' : 'disabled'}>Again</button>
      <button class="fc-btn got" data-action="got" ${s.flipped ? '' : 'disabled'}>Got it</button>
    </div>
    <div class="fc-extra">
      ${canSpeak() ? `<button class="pill-btn" data-action="speak-current">${icon('sound')}<span>Listen</span></button>` : ''}
      <button class="pill-btn learn ${learned ? 'on' : ''}" data-action="learned-current">${icon('check')}<span>${learned ? 'Learned' : 'Mark learned'}</span></button>
    </div>
  `, { back });
}

/* ---------- speech (native device voices only) ---------- */

function canSpeak() {
  return !!(L && L.lang.meta.tts && 'speechSynthesis' in window);
}

function speak(text) {
  if (!canSpeak() || !text) return;
  const lang = L.lang.meta.bcp47;
  const u = new SpeechSynthesisUtterance(text.replace(/_{2,}/g, ' … '));
  u.lang = lang;
  const voices = speechSynthesis.getVoices();
  const base = lang.split('-')[0];
  u.voice = voices.find((v) => v.lang.replace('_', '-') === lang) || voices.find((v) => v.lang.startsWith(base)) || null;
  u.rate = 0.85;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/* ---------- events ---------- */

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) {
    // Tap a hidden English/pronunciation line to peek at it.
    const peek = e.target.closest('[data-peek]');
    if (peek) peek.classList.toggle('peeked');
    return;
  }
  const card = btn.closest('.card');
  const key = card && card.dataset.key;
  const a = btn.dataset.action;

  if (a === 'fav' && key) {
    store.toggleFav(key);
    const on = store.isFav(key);
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on);
  } else if (a === 'learned' && key) {
    store.toggleLearned(key);
    const on = store.isLearned(key);
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on);
    btn.querySelector('span').textContent = on ? 'Learned' : 'Mark learned';
    card.classList.toggle('is-learned', on);
  } else if (a === 'speak' && key) {
    speak(L.byId.get(card.dataset.id)?.target);
  } else if (a === 'tier') {
    store.setPref('tier', btn.dataset.tier);
    practice = null;
    route();
  } else if (a === 'toggle-en') {
    store.setPref('showEnglish', !store.prefs().showEnglish);
    applyTheme(L && L.lang);
    btn.classList.toggle('on', store.prefs().showEnglish);
  } else if (a === 'toggle-pron') {
    store.setPref('showPron', !store.prefs().showPron);
    applyTheme(L && L.lang);
    btn.classList.toggle('on', store.prefs().showPron);
  } else if (a === 'reroll') {
    const pool = L.phrases.filter((p) => inTier(p) && !p.missing);
    document.getElementById('pick').innerHTML = phraseCard(pool[Math.floor(Math.random() * pool.length)]);
  } else if (a === 'flip') {
    practice.flipped = !practice.flipped;
    drawPractice();
  } else if (a === 'again') {
    const c = practice.queue.shift();
    practice.queue.splice(Math.min(practice.queue.length, 3), 0, c);
    practice.again++;
    practice.flipped = false;
    drawPractice();
  } else if (a === 'got') {
    practice.queue.shift();
    practice.done++;
    practice.flipped = false;
    drawPractice();
  } else if (a === 'restart') {
    Object.assign(practice, { queue: shuffle(practice.all), done: 0, again: 0, flipped: false });
    drawPractice();
  } else if (a === 'speak-current') {
    speak(practice.queue[0]?.target);
  } else if (a === 'learned-current') {
    store.toggleLearned(practice.queue[0].key);
    drawPractice();
  }
});

document.addEventListener('keydown', (e) => {
  if (!practice || !location.hash.includes('/practice/run') || e.target.matches('input,select,textarea')) return;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); practice.flipped = !practice.flipped; drawPractice(); }
  if (practice.flipped && e.key === 'ArrowRight') document.querySelector('[data-action="got"]')?.click();
  if (practice.flipped && e.key === 'ArrowLeft') document.querySelector('[data-action="again"]')?.click();
});

/* ---------- router ---------- */

async function route() {
  const { parts, query } = parseRoute();
  const [code, section, arg] = parts;

  if (!code) {
    L = null;
    applyTheme(null);
    viewHome();
    window.scrollTo(0, 0);
    return;
  }
  if (!C.languageByCode.has(code)) return go('#/');
  if (!L || L.lang.code !== code) {
    L = await loadLanguage(C, code);
    practice = null;
  }
  store.setPref('lastLang', code);
  applyTheme(L.lang);

  const keepScroll = section === 'practice' && arg === 'run';
  if (!section) viewDashboard();
  else if (section === 'phrases') viewPhrases(query);
  else if (section === 'scenarios') viewScenarios();
  else if (section === 'scenario') viewScenario(arg, query);
  else if (section === 'patterns') viewPatterns();
  else if (section === 'practice' && arg === 'run') viewPracticeRun(query);
  else if (section === 'practice') viewPracticeSetup();
  else return go(`#/${code}`);
  if (!keepScroll) window.scrollTo(0, 0);
}

async function boot() {
  try {
    C = await loadContent();
  } catch (err) {
    $app.innerHTML = `<div class="empty-state big">Couldn’t load the phrasebook.<br><small>${esc(err.message)}</small></div>`;
    return;
  }
  window.addEventListener('hashchange', route);
  route();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

boot();
