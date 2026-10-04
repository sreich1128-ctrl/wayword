import { loadContent, loadLanguage, loadSounds, tierIncludes, inCategory } from './data.js';
import { store } from './store.js';
import * as tts from './speech.js';
import * as mic from './speak.js';
import { shortVoiceName } from './voices.js';

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
  chev: '<path d="m9 5 7 7-7 7"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  ear: '<path d="M7 9a5 5 0 0 1 10 0c0 3-3 3.5-3 6.5a2.5 2.5 0 0 1-5 0"/><path d="M10 9.5a2 2 0 0 1 4 0"/>',
  play: '<path d="M8 5.5v13l10.5-6.5L8 5.5Z"/>',
  sound: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  replay: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/>',
  loop: '<path d="M17 3l3 3-3 3"/><path d="M4 11V9a3 3 0 0 1 3-3h13"/><path d="M7 21l-3-3 3-3"/><path d="M20 13v2a3 3 0 0 1-3 3H4"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
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
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim() || '#f6f4ef');
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

const langCtx = () => ({ code: L.lang.code, bcp47: L.lang.meta.bcp47, regions: L.lang.meta.voice_regions || [] });
const speechItem = (p) => ({ key: p.key, id: p.id, text: p.target, lang: langCtx() });
const canSpeak = () => !!(L && L.lang.meta.tts && tts.speechSupported);
const canPracticeAloud = () => mic.canRecord || mic.canRecognize;

// Every phrase, everywhere, reads the same way: native script, then the easy
// pronunciation, then the meaning. `nativeHtml` lets a caller add highlights.
function phraseLines(p, { size = '', nativeHtml } = {}) {
  if (p.missing) return '<p class="native missing">Not in the dataset yet</p>';
  return `<p class="native ${size}" ${nativeAttrs(L.lang)}>${nativeHtml ?? withSlots(p.target)}</p>
    ${readingLine(p, size)}
    <p class="pron ${size}" data-peek="pron">${withSlots(p.pron)}</p>
    <p class="en ${size}" data-peek="en">${withSlots(p.english)}</p>`;
}

// Kana reading for scripts like Japanese, shown only when it differs from the written form.
function readingLine(p, size = '') {
  if (!p.reading || p.reading === p.target) return '';
  return `<p class="kana ${size}" data-peek="pron" ${nativeAttrs(L.lang)}>${withSlots(p.reading)}</p>`;
}

function listenBtn(p, cls = '') {
  if (!canSpeak() || p.missing) return '';
  return `<button class="round-btn listen ${cls}" data-action="speak" data-id="${esc(p.id)}" data-key="${esc(p.key)}" data-state="idle" aria-label="Listen">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button>`;
}

function micBtn(p, cls = '') {
  if (!canPracticeAloud() || p.missing) return '';
  return `<button class="round-btn ${cls}" data-action="say-it" data-id="${esc(p.id)}" aria-label="Say it yourself">${icon('mic')}</button>`;
}

function phraseCard(p) {
  const fav = store.isFav(p.key);
  const learned = store.isLearned(p.key);
  const notes = [];
  if (p.regional_note) notes.push(`<p class="note"><span class="note-k">Regional</span>${esc(p.regional_note)}</p>`);
  if (p.usage_note) notes.push(`<p class="note"><span class="note-k">Usage</span>${esc(p.usage_note)}</p>`);
  if (p.example) notes.push(`<p class="note"><span class="note-k">Example</span><span ${nativeAttrs(L.lang)}>${esc(p.example)}</span></p>`);
  if (p.response) notes.push(`<p class="note"><span class="note-k">Likely reply</span><span ${nativeAttrs(L.lang)}>${esc(p.response)}</span></p>`);

  return `
  <article class="card ${p.type === 'pattern' ? 'is-pattern' : ''} ${learned ? 'is-learned' : ''}" data-key="${esc(p.key)}" data-id="${esc(p.id)}">
    <div class="card-meta">
      <span>${p.type === 'pattern' ? 'Pattern · ' : ''}${esc(priorityLabel(p.priority))}</span>
      <button class="icon-btn fav ${fav ? 'on' : ''}" data-action="fav" aria-pressed="${fav}" aria-label="Save">${icon('star')}</button>
    </div>
    ${phraseLines(p)}
    ${notes.length ? `<div class="notes">${notes.join('')}</div>` : ''}
    ${p.missing ? '' : `<div class="card-actions">
      ${listenBtn(p)}${micBtn(p)}
      <button class="learn ${learned ? 'on' : ''}" data-action="learned" aria-pressed="${learned}">${icon('check')}<span>${learned ? 'Learned' : 'Learn'}</span></button>
    </div>`}
  </article>`;
}

function tierBar() {
  const t = C.tiers.find((x) => x.id === tier());
  return `<div class="tierwrap"><div class="tierbar" role="tablist" aria-label="Level">
    ${C.tiers.map((x) => {
      const n = L.phrases.filter((p) => x.includes.includes(p.priority)).length;
      return `<button role="tab" class="tier-btn ${x.id === tier() ? 'on' : ''}" data-action="tier" data-tier="${x.id}" aria-selected="${x.id === tier()}">
        <span>${esc(x.label)}</span><small>${n}</small></button>`;
    }).join('')}
  </div>${t ? `<p class="tier-blurb">${esc(t.blurb)}</p>` : ''}</div>`;
}

function header({ title, back } = {}) {
  const p = store.prefs();
  const lang = L && L.lang;
  return `<header class="topbar">
    ${back ? `<a class="icon-btn quiet" href="${back}" aria-label="Back">${icon('back')}</a>` : lang ? '' : `<a class="brand" href="#/" aria-label="All languages">Wayword</a>`}
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
  syncListen();
}

const section = (title, body, extra = '') => `<section class="sect">${title ? `<div class="sect-head"><h2>${esc(title)}</h2>${extra}</div>` : ''}${body}</section>`;

const row = ({ href, action, ic, emoji, title, sub, count, attrs = '' }) => {
  const inner = `${ic ? `<span class="row-ic">${icon(ic)}</span>` : emoji ? `<span class="row-ic emoji">${emoji}</span>` : ''}
    <span class="row-text"><span class="row-title">${title}</span>${sub ? `<span class="row-sub">${sub}</span>` : ''}</span>
    ${count != null ? `<span class="row-count">${count}</span>` : ''}${icon('chev', 'row-chev')}`;
  return href ? `<a class="row" href="${href}" ${attrs}>${inner}</a>` : `<button class="row" data-action="${action}" ${attrs}>${inner}</button>`;
};

/* ---------- views ---------- */

// Home is the inside of a passport: one visa stamp per language.
const STAMP_TILT = [-4, 3, -2, 5, -3, 2, -5, 4];
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function viewHome() {
  const last = store.prefs().lastLang && C.languageByCode.get(store.prefs().lastLang);
  $app.innerHTML = `
  ${header()}
  <main class="main home">
    <section class="home-hero">
      <p class="eyebrow">Wayword · finding your way with words</p>
      <h1>Where to next?</h1>
      ${last ? `<a class="continue" href="#/${encodeURIComponent(last.code)}" style="--accent:${last.meta.accent}">Continue with ${esc(last.name)} ${icon('chev')}</a>` : ''}
    </section>
    <section class="visa-page">
      <p class="visa-label">Visas</p>
      <div class="stamps">
      ${C.languages.map((l, i) => {
        const learned = store.countFor('learned', l.code);
        return `<a class="stamp shape-${i % 3}" href="#/${encodeURIComponent(l.code)}" data-stamp style="--accent:${l.meta.accent};--rot:${STAMP_TILT[i % STAMP_TILT.length]}deg">
          <span class="stamp-region">${esc(l.region)}</span>
          <span class="stamp-glyph" lang="${esc(l.meta.bcp47)}" dir="${esc(l.direction)}">${esc(l.meta.glyph)}</span>
          <span class="stamp-native" lang="${esc(l.meta.bcp47)}" dir="${esc(l.direction)}">${esc(l.native_name)}</span>
          <span class="stamp-name">${esc(l.name)}</span>
          <span class="stamp-foot">${learned ? `${learned} learned` : 'First visit'}</span>
        </a>`;
      }).join('')}
      </div>
    </section>
    <p class="fine">Progress is saved on this device only.</p>
  </main>`;
  maybeIntro();
}

// The passport cover swings open once per session. Tap skips it; Reduce Motion turns it off.
function maybeIntro() {
  let seen = false;
  try { seen = sessionStorage.getItem('wayword:intro') === '1'; sessionStorage.setItem('wayword:intro', '1'); } catch { seen = false; }
  if (seen || reducedMotion() || document.getElementById('intro')) return;
  const el = document.createElement('div');
  el.id = 'intro';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="passport">
      <div class="pp-page">
        <p class="pp-page-k">Holder</p><p class="pp-page-v">A curious traveller</p>
        <p class="pp-page-k">Languages</p><p class="pp-page-v">${C.languages.length}</p>
        <p class="pp-page-k">Valid for</p><p class="pp-page-v">Every conversation</p>
      </div>
      <div class="pp-cover">
        <div class="pp-front">
          <p class="pp-title">Wayword</p>
          <svg class="pp-emblem" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="31"/>
            <path d="M50 12 56 44 88 50 56 56 50 88 44 56 12 50 44 44Z"/>
            <path d="M50 30 53 47 70 50 53 53 50 70 47 53 30 50 47 47Z" class="fill"/>
          </svg>
          <p class="pp-sub">finding your way with words</p>
          <svg class="pp-chip" viewBox="0 0 40 26" aria-hidden="true"><rect x="1" y="1" width="38" height="24" rx="4"/><circle cx="20" cy="13" r="6"/><path d="M1 13h13M26 13h13"/></svg>
        </div>
        <div class="pp-back"></div>
      </div>
    </div>
    <p class="intro-hint">Tap to open</p>`;
  document.body.appendChild(el);
  document.body.classList.add('intro-on');
  let opened = false;
  const close = () => {
    el.classList.add('done');
    document.body.classList.remove('intro-on');
    setTimeout(() => el.remove(), 450);
  };
  const open = () => {
    if (opened) { close(); return; } // second tap: skip straight in
    opened = true;
    el.classList.add('open');
    setTimeout(close, 1050);
  };
  el.addEventListener('click', open);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(open, 900);
}

function viewDashboard() {
  const lang = L.lang;
  const code = lang.code;
  const pool = L.phrases.filter(inTier);
  const learned = pool.filter((p) => store.isLearned(p.key)).length;
  const pct = pool.length ? Math.round((learned / pool.length) * 100) : 0;
  const favs = store.countFor('fav', code);
  const pick = shuffle(pool.filter((p) => !p.missing))[0];
  const patterns = L.phrases.filter((p) => p.type === 'pattern' && inTier(p)).length;

  page('home', `
    <section class="lang-hero">
      <div class="hero-text">
        <p class="eyebrow">${esc(lang.name)} · ${esc(lang.region)}</p>
        <h1 class="hero-native" ${nativeAttrs(lang)}>${esc(lang.native_name)}</h1>
      </div>
      <div class="ring" style="--pct:${pct}" aria-label="${learned} of ${pool.length} learned">
        <strong>${learned}<small>/${pool.length}</small></strong><span>learned</span>
      </div>
    </section>
    ${tierBar()}

    ${section('Practice', `<div class="group">
      ${row({ href: `#/${code}/practice/run?dir=en`, ic: 'cards', title: 'Flashcards', sub: `English → <bdi>${esc(lang.native_name)}</bdi>` })}
      ${row({ href: `#/${code}/practice/run?dir=target`, ic: 'shuffle', title: 'Reverse flashcards', sub: `<bdi>${esc(lang.native_name)}</bdi> → English` })}
      ${canPracticeAloud() ? row({ href: `#/${code}/practice/run?dir=speak`, ic: 'mic', title: 'Speak it', sub: 'See the English, say it aloud, hear it back' }) : ''}
      ${row({ href: `#/${code}/sounds`, ic: 'ear', title: 'Sound guide', sub: 'The tricky sounds, and how to read the pronunciation' })}
    </div>`)}

    ${pick ? section('Phrase of the moment', `<div id="pick">${phraseCard(pick)}</div>`, `<button class="link-btn" data-action="reroll">${icon('shuffle')} Another</button>`) : ''}

    ${section('Where are you?', `<div class="scen-row">${C.scenarios.map((s) => `<a class="scen-btn" href="#/${code}/scenario/${s.id}"><span class="scen-ic">${s.icon}</span>${esc(s.label)}</a>`).join('')}</div>`,
      `<a class="link-btn" href="#/${code}/scenarios">All</a>`)}

    ${section('Browse', `<div class="group">
      ${row({ href: `#/${code}/patterns`, ic: 'puzzle', title: 'Power patterns', count: patterns })}
      ${row({ href: `#/${code}/phrases?cat=saved`, ic: 'star', title: 'Saved', count: favs })}
    </div>
    <div class="group">
      ${C.categories.filter((c) => c.id !== 'power_patterns').map((c) => {
        const n = L.phrases.filter((p) => inTier(p) && inCategory(C, p, c.id)).length;
        return row({ href: `#/${code}/phrases?cat=${c.id}`, emoji: c.icon, title: esc(c.label), count: n, attrs: n ? '' : 'data-empty' });
      }).join('')}
    </div>`)}

    ${canSpeak() || lang.meta.tts_note ? section('Audio', audioGroup()) : ''}

    ${L.generalNotes.length ? section(`About this ${lang.direction === 'rtl' ? 'dialect' : 'set'}`, `<div class="group notes-group">
      ${L.generalNotes.map((n) => `<p class="about-row"><span class="note-k">${esc(n.key)}</span>${esc(n.text)}</p>`).join('')}
    </div>`) : ''}
  `);
}

function audioGroup() {
  const lang = L.lang;
  if (!canSpeak()) return `<div class="group notes-group"><p class="about-row">${esc(lang.meta.tts_note || 'Audio is off for this language.')}</p></div>`;
  const v = tts.chosenVoice(langCtx());
  return `<div class="group">
    ${row({ action: 'voice-sheet', ic: 'person', title: 'Voice', sub: v ? esc(shortVoiceName(v.name)) : 'No voice installed', attrs: 'id="voice-row"' })}
    <div class="row static"><span class="row-ic">${icon('play')}</span><span class="row-text"><span class="row-title">Speed</span></span></div>
    <div class="seg-wrap">${speedSeg()}</div>
    ${canPracticeAloud() ? row({ href: `#/${lang.code}/mic`, ic: 'mic', title: 'Mic check', sub: 'Test your speaker, microphone and speech check' }) : ''}
  </div>
  <p class="tip">No sound? On iPhone the voice is muted when the side switch is on silent. Turn silent off and the volume up.</p>
  ${lang.meta.tts_warning ? `<p class="callout">${esc(lang.meta.tts_warning)}</p>` : ''}`;
}

const speedSeg = () => `<div class="seg">${tts.SPEEDS.map((sp) =>
  `<button class="seg-btn ${sp.id === tts.speed().id ? 'on' : ''}" data-action="set-speed" data-speed="${sp.id}">${sp.label}</button>`).join('')}</div>`;

function viewPhrases(query) {
  const lang = L.lang;
  const cat = query.get('cat') || 'all';
  const q = (query.get('q') || '').trim();
  const chips = [
    ['all', 'All', ''], ['saved', 'Saved', '★'], ['todo', 'Not learned', ''],
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
    items = items.filter((p) => [p.english, p.target, p.reading, p.pron, p.regional_note, p.usage_note]
      .some((s) => s && s.toLowerCase().includes(needle)));
  }
  const el = document.getElementById('list');
  if (!items.length) {
    el.innerHTML = `<div class="empty-state">${cat === 'saved' ? 'Tap ★ on any phrase to save it here.' : `Nothing here at ${esc(tierLabel(tier()))}. Try a wider level.`}</div>`;
    return;
  }
  el.innerHTML = `<p class="count">${items.length} phrase${items.length === 1 ? '' : 's'}</p>` + items.map((p) => phraseCard(p)).join('');
  syncListen();
}

function viewScenarios() {
  const lang = L.lang;
  page('scenarios', `
    <section class="page-head"><h1>Where are you?</h1><p>Pick a place. You'll see only the phrases that matter there.</p></section>
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
      <a class="pill-btn" href="#/${lang.code}/practice/run?dir=en&scenario=${s.id}">${icon('cards')}<span>Flashcards</span></a>
      ${canPracticeAloud() ? `<a class="pill-btn" href="#/${lang.code}/practice/run?dir=speak&scenario=${s.id}">${icon('mic')}<span>Speak it</span></a>` : ''}
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
    <section class="page-head"><h1>Power patterns</h1><p>Learn the frame once, then swap the blank to say new things.</p></section>
    ${anySubs ? '' : '<p class="callout">Swap-in words aren’t in the dataset yet. Under each pattern you’ll find dataset phrases already built on it.</p>'}
    <div class="list">${pats.map((p) => patternCard(p)).join('') || '<div class="empty-state">No patterns at this level. Try Travel 50.</div>'}</div>
  `);
}

function miniPhrase(p, { nativeHtml } = {}) {
  return `<div class="mini" data-key="${esc(p.key)}">
    <div class="mini-text">${phraseLines(p, { size: 'sm', nativeHtml })}</div>
    <div class="mini-actions">${listenBtn(p, 'small')}${micBtn(p, 'small')}</div>
  </div>`;
}

function patternCard(p) {
  const lang = L.lang;
  const conf = C.patterns[p.id] || {};
  const subs = (conf.substitutions && conf.substitutions[lang.code]) || [];
  const related = (conf.related || []).map((id) => L.byId.get(id)).filter((r) => r && !r.missing);
  return `<div class="pattern">
    ${phraseCard(p)}
    ${subs.length ? `<div class="pattern-more"><p class="more-k">Fill the blank</p><div class="sub-chips">${subs.map((s) =>
      `<span class="sub"><b ${nativeAttrs(lang)}>${esc(s.target)}</b><i data-peek="pron">${esc(s.pronunciation_easy || '')}</i><em data-peek="en">${esc(s.english)}</em></span>`).join('')}</div></div>` : ''}
    ${related.length ? `<div class="pattern-more"><p class="more-k">Built on this</p>${related.map((r) => miniPhrase(r)).join('')}</div>` : ''}
  </div>`;
}

// Highlights the first occurrence of `mark` in a phrase. Skipped for Arabic,
// where wrapping a letter would break the joined letter shapes.
function markText(text, mark, allow) {
  const i = allow && mark ? text.indexOf(mark) : -1;
  if (i < 0) return withSlots(text);
  return withSlots(text.slice(0, i)) + `<mark class="hl">${esc(mark)}</mark>` + withSlots(text.slice(i + mark.length));
}

async function viewSounds() {
  const lang = L.lang;
  const g = await loadSounds(lang.code);
  if (L.lang !== lang) return;
  if (!g) {
    page('home', `<section class="page-head"><h1>Sound guide</h1></section><div class="empty-state">No sound guide for ${esc(lang.name)} yet.</div>`, { back: `#/${lang.code}` });
    return;
  }
  page('home', `
    <section class="page-head"><h1>Sound guide</h1><p>${esc(g.intro)}</p></section>
    ${section('Reading the pronunciation line', `<div class="group notes-group"><ul class="reading">${(g.reading || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>`)}
    <div class="list sounds">${g.sounds.map((snd) => `
      <article class="sound">
        <div class="sound-head">
          <span class="sound-sym" ${nativeAttrs(lang)}>${esc(snd.symbol)}</span>
          <div><h2>${esc(snd.name)}</h2><span class="sound-spelled">Spelled <b>${esc(snd.spelled)}</b></span></div>
        </div>
        <p class="sound-how">${esc(snd.how)}</p>
        <div class="sound-ex">${snd.examples.map((ex) => {
          const p = L.byId.get(ex.id);
          if (!p || p.missing) return '';
          return miniPhrase(p, { nativeHtml: markText(p.target, ex.mark, g.highlight !== false) });
        }).join('')}</div>
      </article>`).join('')}
    </div>
    <p class="fine">${esc(g.source)}</p>
  `, { back: `#/${lang.code}` });
}

/* ---------- practice ---------- */

function viewPracticeSetup() {
  const lang = L.lang;
  const pool = L.phrases.filter((p) => inTier(p) && !p.missing);
  const favs = L.phrases.filter((p) => store.isFav(p.key) && !p.missing).length;
  const todo = pool.filter((p) => !store.isLearned(p.key)).length;
  page('practice', `
    ${tierBar()}
    <section class="page-head"><h1>Practice</h1><p>Five minutes, one thumb.</p></section>
    <form id="setup" class="setup">
      <fieldset><legend>How</legend>
        <label class="opt"><input type="radio" name="dir" value="en" checked><span><b>Flashcards</b><small>English → <bdi>${esc(lang.native_name)}</bdi></small></span></label>
        <label class="opt"><input type="radio" name="dir" value="target"><span><b>Reverse</b><small><bdi>${esc(lang.native_name)}</bdi> → English</small></span></label>
        ${canPracticeAloud() ? `<label class="opt"><input type="radio" name="dir" value="speak"><span><b>Speak it</b><small>Say it aloud, then hear it back</small></span></label>` : ''}
      </fieldset>
      <fieldset><legend>Deck</legend>
        <label class="opt"><input type="radio" name="deck" value="all" checked><span><b>All of ${esc(tierLabel(tier()))}</b><small>${pool.length}</small></span></label>
        <label class="opt"><input type="radio" name="deck" value="todo"><span><b>Not learned yet</b><small>${todo}</small></span></label>
        <label class="opt"><input type="radio" name="deck" value="saved" ${favs ? '' : 'disabled'}><span><b>Saved</b><small>${favs}</small></span></label>
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
    const dir = ['target', 'speak'].includes(query.get('dir')) ? query.get('dir') : 'en';
    practice = { sig, dir, all: deck, queue: deck.slice(), total: deck.length, done: 0, again: 0, flipped: false, take: null };
  }
  drawPractice();
}

function nextCard() {
  practice.flipped = false;
  practice.take = null;
  tts.stop();
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
  const nativeBlock = `<p class="native fc-native" ${nativeAttrs(lang)}>${withSlots(p.target)}</p>${readingLine(p, 'fc-kana')}<p class="pron fc-pron" data-peek="pron">${withSlots(p.pron)}</p>`;
  const englishBlock = `<p class="fc-en">${withSlots(p.english)}</p>`;
  const notes = p.regional_note ? `<p class="note"><span class="note-k">Regional</span>${esc(p.regional_note)}</p>` : '';
  const pct = Math.round((s.done / s.total) * 100);
  const label = { en: `Say it in ${esc(lang.name)}`, target: 'What does it mean?', speak: `Say it aloud in ${esc(lang.name)}` }[s.dir];

  let face;
  if (s.dir === 'speak') {
    face = `<span class="fc-label">${label}</span>${englishBlock}
      ${s.flipped
        ? `<span class="fc-divider"></span>${nativeBlock}${s.take ? takeResult(p, s.take) : ''}${notes}`
        : `<button class="mic-big ${s.recording ? 'rec' : ''} ${s.finishing ? 'finishing' : ''}" data-action="pr-mic" aria-label="${s.recording ? 'Stop' : 'Start speaking'}">${icon(s.recording ? 'stop' : 'mic')}</button>
           <span class="fc-hint">${micState(s.recording, s.finishing, s.interim, 'Tap the mic, then say it')}</span>`}`;
  } else {
    const front = s.dir === 'en' ? englishBlock : nativeBlock;
    const backSide = s.dir === 'en' ? nativeBlock : englishBlock;
    face = `<span class="fc-label">${label}</span>${front}
      ${s.flipped ? `<span class="fc-divider"></span>${backSide}${notes}` : '<span class="fc-hint">Tap to reveal</span>'}`;
  }

  page('practice', `
    <div class="fc-progress"><span style="width:${pct}%"></span></div>
    <p class="fc-meta">${s.done} / ${s.total}</p>
    <div class="flashcard ${s.flipped ? 'flipped' : ''}" ${s.dir === 'speak' && !s.flipped ? '' : 'data-action="flip" role="button" tabindex="0"'} aria-live="polite">
      <div class="fc-face">${face}</div>
    </div>
    ${s.dir === 'speak' && !s.flipped ? `<button class="link-btn center" data-action="flip">Show the answer without speaking</button>` : ''}
    <div class="fc-actions ${s.flipped ? '' : 'disabled'}">
      <button class="fc-btn again" data-action="again" ${s.flipped ? '' : 'disabled'}>Again</button>
      <button class="fc-btn got" data-action="got" ${s.flipped ? '' : 'disabled'}>Got it</button>
    </div>
    <div class="fc-extra">
      ${listenBtn(p)}${canSpeak() ? `<button class="pill-btn speed-pill" data-action="speed-cycle" aria-label="Speed">${tts.speed().label}</button>` : ''}${s.dir !== 'speak' ? micBtn(p) : ''}
      <button class="learn ${learned ? 'on' : ''}" data-action="learned-current">${icon('check')}<span>${learned ? 'Learned' : 'Learn'}</span></button>
    </div>
  `, { back });
}

/* ---------- speaking: record, transcribe, compare ---------- */

let capture = null;

// What you said vs the phrase: each word marked heard / nearly / not heard,
// plus buttons to hear the correct audio, your take, or both back to back.
function takeResult(p, take) {
  const lang = L.lang;
  const problem = mic.explain(take);
  let verdict = '';
  let words = '';
  if (take.transcript) {
    const r = mic.compare(p.target, take.transcript, { charMode: !!lang.meta.no_spaces, alt: p.reading });
    const pct = Math.round(r.score * 100);
    verdict = pct >= 80 ? 'Clear. Your phone understood almost every word.' : pct >= 50 ? 'Close. Some words came through, keep going.' : 'Not much came through. Listen once more, then try again.';
    words = `<p class="heard-words" ${nativeAttrs(lang)}>${r.words.map((w) => `<span class="w-${w.status}">${withSlots(w.raw)}</span>`).join(lang.meta.no_spaces ? '' : ' ')}</p>
      <p class="heard">Your phone heard: <bdi ${nativeAttrs(lang)}>${esc(take.transcript)}</bdi></p>`;
  } else if (problem) {
    verdict = problem;
  } else if (take.url) {
    verdict = take.mode === 'record' ? 'Got it. Play yourself back next to the correct version.' : 'Recorded, but the phone didn’t pick out any words. Play yourself back to compare.';
  } else {
    verdict = 'Nothing came through. Run the Mic check to see what’s going on.';
  }
  const note = lang.code === 'ar-levantine' && take.transcript ? '<p class="heard">Phone speech recognition writes formal Arabic, so dialect words may show up spelled differently even when you said them right.</p>' : '';
  const secs = take.ms ? ` · ${(take.ms / 1000).toFixed(1)}s` : '';
  return `<div class="take ${!take.url && !take.transcript ? 'failed' : ''}">
    <p class="take-verdict">${esc(verdict)}</p>${words}${note}
    <div class="take-actions">
      ${canSpeak() ? `<button class="pill-btn" data-action="hear-native" data-id="${esc(p.id)}">${icon('play')}<span>Hear it</span></button>` : ''}
      ${take.url ? `<button class="pill-btn" data-action="hear-me">${icon('person')}<span>Hear me${secs}</span></button>` : ''}
      ${take.url && canSpeak() ? `<button class="pill-btn" data-action="hear-both" data-id="${esc(p.id)}">${icon('loop')}<span>Back to back</span></button>` : ''}
    </div>
    ${!take.url && !take.transcript ? `<a class="link-btn" href="#/${lang.code}/mic">Run the Mic check ${icon('chev')}</a>` : ''}
  </div>`;
}

// One take at a time. The mic button shows a live level ring while you speak.
function startCapture(onUpdate, onDone) {
  tts.stop();
  const lang = L.lang;
  capture = mic.capture({
    asrLang: lang.meta.asr || lang.meta.bcp47,
    onInterim: (text) => onUpdate(text),
    onLevel: (lvl) => document.querySelectorAll('.mic-big.rec').forEach((b) => b.style.setProperty('--lvl', lvl.toFixed(3))),
  });
  capture.done.then((take) => {
    capture = null;
    if (lastTakeUrl && lastTakeUrl !== take.url) URL.revokeObjectURL(lastTakeUrl);
    lastTakeUrl = take.url;
    onDone(take);
  });
}

let lastTakeUrl = null;
let takeAudio = null;
function playTake(url, after) {
  if (!url) return;
  takeAudio?.pause();
  takeAudio = new Audio(url);
  takeAudio.onended = () => after?.();
  takeAudio.play().catch(() => toast('Couldn’t play your recording. Check the volume.'));
}

const micState = (rec, finishing, interim, idleText) => rec
  ? (finishing ? 'Finishing…' : interim ? `<bdi ${nativeAttrs(L.lang)}>${esc(interim)}</bdi>` : 'Listening… stops when you pause')
  : idleText;

function micModeSeg() {
  const opts = [];
  if (mic.canRecord) opts.push(['record', 'Hear myself']);
  if (mic.canRecognize) opts.push(['recognize', 'Check words']);
  if (mic.canRecord && mic.canRecognize) opts.push(['both', 'Both']);
  if (opts.length < 2) return '';
  return `<div class="seg mode-seg">${opts.map(([id, label]) =>
    `<button class="seg-btn ${mic.micMode() === id ? 'on' : ''}" data-action="mic-mode" data-mode="${id}">${label}</button>`).join('')}</div>`;
}

/* ---------- Mic check: tests each piece on this device ---------- */

const mc = { speaker: null, beep: null, runs: {}, running: null };

const TESTS = [
  { mode: 'record', title: 'Microphone', ask: 'Tap, then say anything for a few seconds.', needs: () => mic.canRecord },
  { mode: 'recognize', title: 'Speech check', ask: '', needs: () => mic.canRecognize },
  { mode: 'both', title: 'Both at once', ask: '', needs: () => mic.canRecord && mic.canRecognize },
];

// A short tone as a WAV file. Plays through the media channel, unlike the voice,
// so it tells a silent-switch problem apart from a voice problem.
function beepUrl() {
  const rate = 22050; const n = Math.floor(rate * 0.35);
  const buf = new ArrayBuffer(44 + n * 2); const v = new DataView(buf);
  const w = (o, str) => [...str].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.sin(2 * Math.PI * 660 * i / rate) * 9000 * Math.min(1, (n - i) / 800), true);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}

function viewMicCheck() {
  mc.runs = {}; mc.running = null; mc.speaker = null;
  drawMicCheck();
}

function checkItem(ok, text) {
  return `<li class="${ok === true ? 'ok' : ok === false ? 'bad' : ''}">${ok === true ? icon('check') : ok === false ? icon('x') : ''}<span>${text}</span></li>`;
}

function runResult(t, r) {
  if (!r) return '';
  const items = [];
  if (t.mode !== 'recognize') {
    items.push(checkItem(!['NotAllowedError', 'SecurityError'].includes(r.recError), 'Microphone permission'));
    items.push(checkItem(!!r.url, r.url ? `Recorded ${(r.ms / 1000).toFixed(1)}s${r.mime ? ` (${esc(r.mime.split(';')[0])})` : ''}` : `No recording${r.recError ? ` (${esc(r.recError)})` : ''}`));
    if (r.url) items.push(checkItem(r.peak >= 0.08, `Loudest level ${Math.round(r.peak * 100)}%${r.peak < 0.08 ? ', too quiet' : ''}`));
  }
  if (t.mode !== 'record') {
    items.push(checkItem(!!r.transcript, r.transcript ? `Heard: <bdi ${nativeAttrs(L.lang)}>${esc(r.transcript)}</bdi>` : `No words${r.srError ? ` (${esc(r.srError)})` : ''}`));
  }
  const why = mic.explain(r);
  return `<ul class="checks">${items.join('')}</ul>${why ? `<p class="heard">${esc(why)}</p>` : ''}
    ${r.url ? `<button class="pill-btn" data-action="mc-play" data-url="${esc(r.url)}">${icon('person')}<span>Play my recording</span></button>` : ''}`;
}

function recommendation() {
  const ok = (m) => { const r = mc.runs[m]; return r && (m === 'record' ? !!r.url && r.peak >= 0.08 : m === 'recognize' ? !!r.transcript : !!r.url && !!r.transcript); };
  if (ok('both')) return { mode: 'both', text: 'Everything works at once on this phone: you’ll hear yourself back and see which words came through.' };
  if (mc.runs.both && ok('record') && ok('recognize')) return { mode: 'record', text: 'Each works alone but not together on this phone. Say it will record you so you can hear yourself back; switch to “Check words” in the Say it panel when you want the word check.' };
  if (ok('record')) return { mode: 'record', text: 'Recording works. Say it will record you so you can hear yourself back.' };
  if (ok('recognize')) return { mode: 'recognize', text: 'The speech check works, but recording didn’t. Say it will show which words came through.' };
  return null;
}

function drawMicCheck() {
  const lang = L.lang;
  const hello = L.byId.get('hello');
  const rec = recommendation();
  const current = mic.micMode();
  page('practice', `
    <section class="page-head"><h1>Mic check</h1><p>Run this on the phone you practise with. Each step tests one thing, so if something fails you’ll see which part.</p></section>

    ${section('1 · Speaker', `<div class="group pad">
      <p>Can you hear the voice and a short beep?</p>
      <div class="take-actions">
        ${canSpeak() ? `<button class="pill-btn" data-action="mc-speaker">${icon('play')}<span>Play “${esc(hello && !hello.missing ? hello.target : lang.native_name)}”</span></button>` : ''}
        <button class="pill-btn" data-action="mc-beep">${icon('sound')}<span>Play beep</span></button>
      </div>
      <p class="heard">Beep plays but no voice: your iPhone is probably on silent. The voice follows the side switch; the beep doesn’t. Neither plays: turn the volume up, or check Bluetooth headphones.</p>
    </div>`)}

    ${TESTS.filter((t) => t.needs()).map((t, i) => {
      const r = mc.runs[t.mode];
      const running = mc.running === t.mode;
      const ask = t.mode === 'record' ? t.ask : `Tap, then say “${esc(hello && !hello.missing ? hello.target : '')}”${hello && !hello.missing ? ` (${esc(hello.pron)})` : ''}.`;
      return section(`${i + 2} · ${t.title}`, `<div class="group pad">
        <p>${ask}</p>
        <div class="mc-row">
          <button class="mic-big ${running ? 'rec' : ''}" data-action="mc-run" data-mode="${t.mode}" ${mc.running && !running ? 'disabled' : ''} aria-label="${running ? 'Stop' : 'Start'}">${icon(running ? 'stop' : 'mic')}</button>
          ${t.mode !== 'recognize' ? `<div class="meter" id="meter-${t.mode}"><span></span></div>` : `<span class="mic-hint" id="interim-${t.mode}">${running ? 'Listening…' : ''}</span>`}
        </div>
        ${runResult(t, r)}
      </div>`);
    }).join('')}

    ${section('Result', `<div class="group pad">
      ${rec ? `<p><b>${esc(rec.text)}</b></p>
        ${rec.mode !== current ? `<button class="cta" data-action="mc-use" data-mode="${rec.mode}">Use this setting</button>` : `<p class="heard">${icon('check')} Say it is already using this setting.</p>`}`
        : '<p>Run the steps above and the best setting for this phone appears here.</p>'}
      <button class="pill-btn" data-action="mc-copy">${icon('cards')}<span>Copy report</span></button>
      <p class="heard">If something still doesn’t work, copy the report and paste it into our chat.</p>
    </div>`)}
  `, { back: `#/${lang.code}` });
}

function micCheckSpeaker() {
  const hello = L.byId.get('hello');
  if (hello && !hello.missing) tts.play(speechItem(hello));
  mc.speaker = 'played';
}

function micCheckRun(mode) {
  if (mc.running === mode) { capture?.stop(); return; }
  if (mc.running) return;
  mc.running = mode;
  const lang = L.lang;
  tts.stop();
  capture = mic.capture({
    asrLang: lang.meta.asr || lang.meta.bcp47,
    mode,
    maxMs: 8000,
    onLevel: (lvl) => { const bar = document.querySelector(`#meter-${mode} span`); if (bar) bar.style.width = `${Math.round(lvl * 100)}%`; },
    onInterim: (t) => { const el = document.getElementById(`interim-${mode}`); if (el) el.textContent = t; },
  });
  drawMicCheck();
  capture.done.then((r) => {
    capture = null;
    mc.running = null;
    mc.runs[mode] = r;
    drawMicCheck();
  });
}

function micReport() {
  const lines = [
    'Wayword mic check',
    `Language: ${L.lang.name} (speech check: ${L.lang.meta.asr || L.lang.meta.bcp47})`,
    `Browser: ${navigator.userAgent}`,
    `Supports: recording ${mic.canRecord ? 'yes' : 'no'}, speech check ${mic.canRecognize ? 'yes' : 'no'}, voice ${tts.speechSupported ? 'yes' : 'no'}, audioSession ${navigator.audioSession ? 'yes' : 'no'}`,
    `Voice: ${tts.chosenVoice(langCtx())?.name || 'none'}`,
    `Current setting: ${mic.micMode()}`,
  ];
  for (const t of TESTS) {
    const r = mc.runs[t.mode];
    if (!r) { lines.push(`${t.title}: not run`); continue; }
    lines.push(`${t.title}: recording=${r.url ? `${(r.ms / 1000).toFixed(1)}s ${r.mime}` : 'none'} recError=${r.recError || '-'} peak=${Math.round(r.peak * 100)}% words="${r.transcript}" srError=${r.srError || '-'}`);
  }
  return lines.join('\n');
}

/* the "Say it" sheet */

let sheetPhrase = null;
let sheetTake = null;
let sheetRec = false;
let sheetFinishing = false;
let sheetInterim = '';

function openSayIt(p) {
  sheetPhrase = p;
  sheetTake = null;
  sheetRec = false;
  sheetFinishing = false;
  sheetInterim = '';
  openSheet(sayItHtml());
}

function sayItHtml() {
  const p = sheetPhrase;
  return `<div class="sheet-head"><h2>Say it</h2><button class="icon-btn quiet" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>
    <div class="say-phrase">${phraseLines(p, { size: 'lg' })}</div>
    <ol class="steps">
      <li><span class="step-n">1</span><span class="step-t">Listen</span>
        <div class="step-body">${listenBtn(p)}${speedSeg()}</div></li>
      <li><span class="step-n">2</span><span class="step-t">Your turn</span>
        <div class="step-body">
          <button class="mic-big ${sheetRec ? 'rec' : ''} ${sheetFinishing ? 'finishing' : ''}" data-action="sheet-mic" aria-label="${sheetRec ? 'Stop' : 'Start speaking'}">${icon(sheetRec ? 'stop' : 'mic')}</button>
          <span class="mic-hint">${micState(sheetRec, sheetFinishing, sheetInterim, sheetTake ? 'Tap to try again' : 'Tap, then say the phrase')}</span>
        </div>
        <div class="step-body full">${micModeSeg()}</div></li>
      ${sheetTake ? `<li><span class="step-n">3</span><span class="step-t">Compare</span><div class="step-body full">${takeResult(p, sheetTake)}</div></li>` : ''}
    </ol>`;
}

function redrawSheet() {
  const panel = document.querySelector('#sheet .sheet-panel');
  if (panel && sheetPhrase) { panel.innerHTML = sayItHtml(); syncListen(); }
}

/* the voice sheet */

let voiceFilter = 'all';

function voiceSheetHtml() {
  const list = tts.voicesFor(langCtx());
  const current = tts.chosenVoice(langCtx());
  const hasGender = list.some((x) => x.gender !== 'unknown');
  const shown = list.filter((x) => voiceFilter === 'all' || x.gender === voiceFilter);
  const tag = (x) => [x.gender !== 'unknown' ? x.gender : '', x.levantine ? 'Levantine' : '', /premium|enhanced|natural|neural/i.test(x.voice.name) ? 'natural' : '', x.voice.lang].filter(Boolean).join(' · ');
  return `<div class="sheet-head"><h2>Voice</h2><button class="icon-btn quiet" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>
    ${hasGender ? `<div class="seg filter">${['all', 'female', 'male'].map((g) =>
      `<button class="seg-btn ${voiceFilter === g ? 'on' : ''}" data-action="voice-filter" data-g="${g}">${g === 'all' ? 'All' : g === 'female' ? 'Female' : 'Male'}</button>`).join('')}</div>` : ''}
    <div class="group voice-list">${shown.length ? shown.map((x) => `
      <button class="row ${current && x.voice.voiceURI === current.voiceURI ? 'picked' : ''}" data-action="pick-voice" data-uri="${esc(x.voice.voiceURI)}">
        <span class="row-text"><span class="row-title">${esc(shortVoiceName(x.voice.name))}</span><span class="row-sub">${esc(tag(x))}</span></span>
        ${current && x.voice.voiceURI === current.voiceURI ? icon('check', 'row-check') : ''}
      </button>`).join('') : `<p class="about-row">${list.length ? 'No voices of that type on this device.' : 'No voice for this language is installed on this device.'}</p>`}
    </div>
    <p class="tip">Want a more natural voice, or a male/female option you don’t see? On iPhone: Settings → Accessibility → Spoken Content → Voices → ${esc(L.lang.name.replace('European ', ''))}. Download one marked <b>Enhanced</b> or <b>Premium</b> and it appears here. On Android: Settings → Text-to-speech → Google → Install voice data.</p>`;
}

/* bottom sheet + mini player + toast */

function openSheet(html) {
  let el = document.getElementById('sheet');
  if (!el) {
    el = document.createElement('div');
    el.id = 'sheet';
    el.innerHTML = '<div class="sheet-backdrop" data-action="close-sheet"></div><div class="sheet-panel" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(el);
  }
  el.querySelector('.sheet-panel').innerHTML = html;
  el.classList.add('open');
  document.body.classList.add('sheet-open');
  syncListen();
}

function closeSheet() {
  capture?.stop();
  sheetPhrase = null;
  document.getElementById('sheet')?.classList.remove('open');
  document.body.classList.remove('sheet-open');
}

function renderPlayer() {
  let el = document.getElementById('player');
  if (!el) {
    el = document.createElement('div');
    el.id = 'player';
    document.body.appendChild(el);
  }
  const st = tts.getState();
  const p = st.item && L && L.byId.get(st.item.id);
  if (!p || location.hash.includes('/practice/run') || location.hash.endsWith('/mic')) {
    el.className = '';
    el.innerHTML = '';
    document.body.classList.remove('has-player');
    return;
  }
  const playing = st.status === 'playing' || st.status === 'gap';
  const v = tts.chosenVoice(langCtx());
  el.className = 'show';
  document.body.classList.add('has-player');
  el.innerHTML = `<div class="player">
    <div class="pl-top">
      <button class="pl-main" data-action="pl-toggle" aria-label="${playing ? 'Pause' : 'Play'}">${icon(playing ? 'pause' : 'play')}</button>
      <div class="pl-text"><b ${nativeAttrs(L.lang)}>${withSlots(p.target)}</b><span>${withSlots(p.pron)}</span></div>
      <button class="icon-btn quiet" data-action="pl-close" aria-label="Close player">${icon('x')}</button>
    </div>
    <div class="pl-row">
      <button class="pl-btn" data-action="pl-replay" aria-label="Replay">${icon('replay')}</button>
      <button class="pl-btn ${st.loop ? 'on' : ''}" data-action="pl-loop" aria-pressed="${st.loop}" aria-label="Repeat">${icon('loop')}</button>
      <div class="pl-speed">
        <button data-action="pl-slower" aria-label="Slower">−</button>
        <span>${tts.speed().label}</span>
        <button data-action="pl-faster" aria-label="Faster">+</button>
      </div>
      <button class="pl-voice" data-action="voice-sheet">${icon('person')}<span>${v ? esc(shortVoiceName(v.name)) : 'Voice'}</span></button>
    </div>
  </div>`;
}

// Listen buttons mirror whatever is playing.
function syncListen() {
  const st = tts.getState();
  document.querySelectorAll('[data-action="speak"]').forEach((b) => {
    const mine = st.item && b.dataset.key === st.item.key;
    const s = !mine ? 'idle' : st.status === 'playing' || st.status === 'gap' ? 'playing' : st.status === 'paused' ? 'paused' : 'idle';
    b.dataset.state = s;
    b.setAttribute('aria-label', s === 'playing' ? 'Pause' : s === 'paused' ? 'Resume' : 'Listen');
  });
  document.querySelectorAll('[data-action="set-speed"]').forEach((b) => b.classList.toggle('on', b.dataset.speed === tts.speed().id));
}

tts.subscribe(() => { syncListen(); renderPlayer(); });
tts.onVoices(() => {
  const vr = document.getElementById('voice-row');
  if (vr && L) {
    const v = tts.chosenVoice(langCtx());
    const sub = vr.querySelector('.row-sub');
    if (sub) sub.textContent = v ? shortVoiceName(v.name) : 'No voice installed';
  }
});

const warned = new Set();
function speakPhrase(id) {
  const p = L.byId.get(id);
  if (!p) return;
  const m = L.lang.meta;
  if (m.tts_warning && !warned.has(L.lang.code)) {
    warned.add(L.lang.code);
    toast(m.tts_warning);
  }
  tts.toggle(speechItem(p));
}

let toastTimer = null;
function toast(text) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    el.addEventListener('click', () => el.classList.remove('show'));
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 7000);
}

/* ---------- events ---------- */

document.addEventListener('click', (e) => {
  const stamp = e.target.closest('a[data-stamp]');
  if (stamp && !reducedMotion() && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    stamp.classList.add('stamping');
    setTimeout(() => { location.hash = stamp.getAttribute('href'); }, 420);
    return;
  }
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
    btn.querySelector('span').textContent = on ? 'Learned' : 'Learn';
    card.classList.toggle('is-learned', on);
  } else if (a === 'speak') {
    speakPhrase(btn.dataset.id);
  } else if (a === 'set-speed') {
    tts.setSpeed(btn.dataset.speed);
    syncListen();
  } else if (a === 'say-it') {
    openSayIt(L.byId.get(btn.dataset.id));
  } else if (a === 'sheet-mic') {
    if (sheetRec) { sheetFinishing = true; redrawSheet(); capture?.stop(); return; }
    sheetRec = true;
    sheetFinishing = false;
    sheetInterim = '';
    startCapture((t) => { sheetInterim = t; redrawSheet(); }, (take) => {
      sheetRec = false;
      sheetFinishing = false;
      if (!sheetPhrase) return;
      sheetTake = take;
      redrawSheet();
    });
    redrawSheet();
  } else if (a === 'mic-mode') {
    mic.setMicMode(btn.dataset.mode);
    btn.parentElement.querySelectorAll('.seg-btn').forEach((b) => b.classList.toggle('on', b === btn));
  } else if (a === 'speed-cycle') {
    const i = tts.SPEEDS.indexOf(tts.speed());
    tts.setSpeed(tts.SPEEDS[(i + 1) % tts.SPEEDS.length].id);
    btn.textContent = tts.speed().label;
  } else if (a === 'pr-mic') {
    if (practice.recording) { practice.finishing = true; drawPractice(); capture?.stop(); return; }
    practice.recording = true;
    practice.finishing = false;
    practice.interim = '';
    const p = practice.queue[0];
    startCapture((t) => { practice.interim = t; drawPractice(); }, (take) => {
      if (practice.queue[0] !== p) return;
      Object.assign(practice, { recording: false, finishing: false, interim: '', take, flipped: true });
      drawPractice();
      if (canSpeak()) tts.play(speechItem(p)); // hear it back right away
    });
    drawPractice();
  } else if (a === 'hear-native') {
    tts.play(speechItem(L.byId.get(btn.dataset.id)));
  } else if (a === 'hear-me') {
    tts.stop();
    playTake(lastTakeUrl);
  } else if (a === 'mc-beep') {
    playTake(beepUrl());
  } else if (a === 'mc-speaker') {
    micCheckSpeaker();
  } else if (a === 'mc-run') {
    micCheckRun(btn.dataset.mode);
  } else if (a === 'mc-play') {
    playTake(btn.dataset.url);
  } else if (a === 'mc-use') {
    mic.setMicMode(btn.dataset.mode);
    toast('Saved. Say it will use this setting.');
    drawMicCheck();
  } else if (a === 'mc-copy') {
    navigator.clipboard?.writeText(micReport()).then(() => toast('Copied. Paste it into your chat.'), () => toast('Couldn’t copy. Long-press the report to select it.'));
  } else if (a === 'hear-both') {
    const p = L.byId.get(btn.dataset.id);
    tts.play(speechItem(p), () => setTimeout(() => playTake(lastTakeUrl), 350));
  } else if (a === 'voice-sheet') {
    sheetPhrase = null;
    openSheet(voiceSheetHtml());
  } else if (a === 'voice-filter') {
    voiceFilter = btn.dataset.g;
    openSheet(voiceSheetHtml());
  } else if (a === 'pick-voice') {
    const st = tts.getState();
    tts.setVoice(langCtx(), btn.dataset.uri);
    if (!st.item) {
      const sample = L.byId.get('hello');
      if (sample && !sample.missing) tts.play(speechItem(sample));
    }
    openSheet(voiceSheetHtml());
    const vr = document.querySelector('#voice-row .row-sub');
    if (vr) vr.textContent = shortVoiceName(tts.chosenVoice(langCtx())?.name || '');
  } else if (a === 'close-sheet') {
    closeSheet();
  } else if (a === 'pl-toggle') {
    const st = tts.getState();
    if (st.status === 'playing' || st.status === 'gap') tts.pause();
    else if (st.status === 'paused') tts.resume();
    else tts.replay();
  } else if (a === 'pl-replay') {
    tts.replay();
  } else if (a === 'pl-loop') {
    tts.setLoop(!tts.getState().loop);
  } else if (a === 'pl-slower') {
    tts.stepSpeed(-1);
  } else if (a === 'pl-faster') {
    tts.stepSpeed(1);
  } else if (a === 'pl-close') {
    tts.stop();
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
    syncListen();
  } else if (a === 'flip') {
    if (practice.recording) return;
    practice.flipped = !practice.flipped;
    drawPractice();
  } else if (a === 'again') {
    const c = practice.queue.shift();
    practice.queue.splice(Math.min(practice.queue.length, 3), 0, c);
    practice.again++;
    nextCard();
    drawPractice();
  } else if (a === 'got') {
    practice.queue.shift();
    practice.done++;
    nextCard();
    drawPractice();
  } else if (a === 'restart') {
    Object.assign(practice, { queue: shuffle(practice.all), done: 0, again: 0 });
    nextCard();
    drawPractice();
  } else if (a === 'learned-current') {
    store.toggleLearned(practice.queue[0].key);
    drawPractice();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('sheet-open')) { closeSheet(); return; }
  if (!practice || !location.hash.includes('/practice/run') || e.target.matches('input,select,textarea')) return;
  if (practice.dir === 'speak' && !practice.flipped) return;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); practice.flipped = !practice.flipped; drawPractice(); }
  if (practice.flipped && e.key === 'ArrowRight') document.querySelector('[data-action="got"]')?.click();
  if (practice.flipped && e.key === 'ArrowLeft') document.querySelector('[data-action="again"]')?.click();
});

/* ---------- router ---------- */

async function route() {
  tts.stop();
  closeSheet();
  capture?.stop();
  const { parts, query } = parseRoute();
  const [code, sectionName, arg] = parts;

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

  const keepScroll = sectionName === 'practice' && arg === 'run';
  if (!sectionName) viewDashboard();
  else if (sectionName === 'phrases') viewPhrases(query);
  else if (sectionName === 'scenarios') viewScenarios();
  else if (sectionName === 'scenario') viewScenario(arg, query);
  else if (sectionName === 'patterns') viewPatterns();
  else if (sectionName === 'sounds') await viewSounds();
  else if (sectionName === 'mic') viewMicCheck();
  else if (sectionName === 'practice' && arg === 'run') viewPracticeRun(query);
  else if (sectionName === 'practice') viewPracticeSetup();
  else return go(`#/${code}`);
  if (!keepScroll) window.scrollTo(0, 0);
}

async function boot() {
  mic.setAudioSession('playback');
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
