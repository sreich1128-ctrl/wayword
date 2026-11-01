import { loadContent, loadLanguage, loadSounds, inCategory } from './data.js';
import { store } from './store.js';
import * as tts from './speech.js';
import * as mic from './speak.js';
import { shortVoiceName } from './voices.js';
import { sfx } from './sfx.js';
import { checkTyped, checkTypedChars } from './typecheck.js';
import { DAY, gapFor, lockTime, parseDate, daysUntil, todayIso, endOfToday } from './schedule.js';
import { planSession, requeue, readiness, reviewMode, LADDER, buildTiles, buildIsRight, canBuildPhrase } from './plan.js';

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
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6"/><circle cx="12" cy="16.8" r=".6" fill="currentColor"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  plane: '<path d="M10.5 13.5 3 11l1.5-1.5 8 1L17 6c1-1 2.6-1.4 3.2-.8.6.6.2 2.2-.8 3.2l-4.5 4.5 1 8L14.5 22.4 12 15l-3.5 3.5V21l-1.5 1-1.2-3.3L2.5 17.5l1-1.5h2.5L9.5 12.5"/>',
  printer: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
  shuffle: '<path d="M3 7h3.5c4 0 6 10 10 10H21M3 17h3.5c1.6 0 2.8-1.6 3.8-3.6M14 9.6C15 7.6 16 7 17 7h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  dots: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
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

// Levels (Core/Travel/Explore) no longer hide anything: every screen shows every phrase.
// They only set the teaching order, so Core phrases are taught first (see freshPool).
const inTier = () => true;

function renderGrouped(items, renderItem) {
  return items.map((p) => renderItem(p, false)).join('');
}

/* ---------- situations ---------- */

// A situation's phrases (missing ones dropped) and how many are Learning or Locked in.
function sitPhrases(sit) { return sit.concepts.map((id) => L.byId.get(id)).filter((p) => p && !p.missing); }
function sitReady(sit) {
  const ok = (id) => { const p = L.byId.get(id); return !!p && !p.missing; };
  return readiness(sit, (id) => store.isLearned(L.byId.get(id).key), ok);
}

// The situation Continue teaches from: the one you picked, or automatically The basics first,
// then the situation closest to ready (a near goal), in list order on ties.
function focusSituation() {
  const picked = (store.prefs().focus || {})[L.lang.code];
  const sit = picked && C.scenarios.find((x) => x.id === picked);
  if (sit) return { sit, auto: false };
  const open = C.scenarios.map((x) => ({ x, r: sitReady(x) })).filter(({ r }) => r.n && r.ready < r.n);
  const basics = open.find(({ x }) => x.id === 'basics');
  const best = basics || open.sort((a, b) => b.r.ready / b.r.n - a.r.ready / a.r.n)[0];
  return { sit: best ? best.x : null, auto: true };
}

function setFocus(id) {
  store.setPref('focus', { ...(store.prefs().focus || {}), [L.lang.code]: id || undefined });
}

// Replies you'll hear in a situation (content/replies.json), in this language.
const repliesFor = (sit) => (sit ? L.replies.filter((r) => r.situations.includes(sit.id)) : []);

const readyBar = (r) => `<span class="ready-bar"><span style="width:${r.n ? Math.round((r.ready / r.n) * 100) : 0}%"></span></span>`;

/* ---------- shared pieces ---------- */

function nativeAttrs(lang) {
  return `lang="${esc(lang.meta.bcp47)}" dir="${esc(lang.direction)}"`;
}

const langCtx = () => ({ code: L.lang.code, bcp47: L.lang.meta.bcp47, regions: L.lang.meta.voice_regions || [] });
const speechItem = (p) => ({ key: p.key, id: p.id, text: p.target, lang: langCtx() });
// Audio exists if the language has natural recordings, or device speech is on for it.
const canSpeak = () => !!(L && ((L.lang.meta.tts && tts.speechSupported) || tts.naturalFor(L.lang.code)));
const voiceText = () => { const t = tts.voiceLabel(langCtx()); return t ? (t.includes(' · ') ? t : shortVoiceName(t)) : null; };
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

// cls 'labeled' gives a pill with words ("Listen", "Say it"); otherwise a round icon button.
function listenBtn(p, cls = '') {
  if (!canSpeak() || p.missing) return '';
  const labeled = cls.includes('labeled');
  return `<button class="${labeled ? 'pill-btn' : 'round-btn'} listen ${cls}" data-action="speak" data-id="${esc(p.id)}" data-key="${esc(p.key)}" data-state="idle" aria-label="Listen">${icon('play', 'i-play')}${icon('pause', 'i-pause')}${labeled ? '<span class="lbl">Listen</span>' : ''}</button>`;
}

function micBtn(p, cls = '') {
  if (!canPracticeAloud() || p.missing) return '';
  const labeled = cls.includes('labeled');
  return `<button class="${labeled ? 'pill-btn' : 'round-btn'} ${cls}" data-action="say-it" data-id="${esc(p.id)}" aria-label="Say it yourself">${icon('mic')}${labeled ? '<span>Say it</span>' : ''}</button>`;
}

// Two labels only: Learning (started, being reviewed) and Locked in (passed every review).
const statusLabel = (st) => (st === 'locked' ? 'Locked in' : st === 'learning' ? 'Learning' : '');
// Drafts: written for Wayword, not yet checked by a native speaker (content/added/).
// A draft that matches a sentence a native speaker wrote (Tatoeba) gets a lighter, green label.
const draftTag = (p) => (!p.draft ? ''
  : p.native_match ? '<span class="draft-tag native" title="Matches a translation written by a native speaker (Tatoeba)">Matches native</span>'
    : '<span class="draft-tag" title="Draft translation, not yet checked by a native speaker">Draft</span>');

// "How it's said": natural-speed coaching from the sound guide, with a link to the guide.
const sayTipNote = (p, link = true) => (p.say_tip
  ? `<p class="note"><span class="note-k">How it’s said</span>${esc(p.say_tip)}${link ? ` <a class="note-link" href="#/${L.lang.code}/sounds">Sound guide</a>` : ''}</p>`
  : '');

/* ---------- Swap it: pattern variations (js/variants.js) ---------- */

// The variant picked for each frame, kept while the app is open ('' = the frame itself).
const swapSel = {};
const variantsOf = (p) => (L.examples[p.id] || []);
function shownFor(p) {
  const id = swapSel[p.id];
  return (id && variantsOf(p).find((v) => v.id === id)) || p;
}

// One row of chips: the frame first (its default), then each variant. Scrolls sideways on narrow screens.
function swapChips(p, selectedId, action) {
  const vs = variantsOf(p);
  if (!vs.length) return '';
  const chip = (id, label, on) => `<button class="swap-chip ${on ? 'on' : ''}" data-action="${action}" data-pid="${esc(p.id)}" data-v="${esc(id)}" aria-pressed="${on}">${esc(label)}</button>`;
  return `<div class="swap" role="group" aria-label="Swap the blank">
      <span class="swap-k">Swap it</span>
      <div class="swap-row">${chip('', '___', !selectedId)}${vs.map((v) => chip(v.id, v.label, selectedId === v.id)).join('')}</div>
    </div>`;
}

function phraseCard(p) {
  const fav = store.isFav(p.key);
  const st = store.status(p.key);
  const notes = [];
  if (p.say_tip) notes.push(sayTipNote(p));
  if (p.regional_note) notes.push(`<p class="note"><span class="note-k">Regional</span>${esc(p.regional_note)}</p>`);
  if (p.usage_note) notes.push(`<p class="note"><span class="note-k">Usage</span>${esc(p.usage_note)}</p>`);
  if (p.example) notes.push(`<p class="note"><span class="note-k">Example</span><span ${nativeAttrs(L.lang)}>${esc(p.example)}</span></p>`);
  if (p.response) notes.push(`<p class="note"><span class="note-k">Likely reply</span><span ${nativeAttrs(L.lang)}>${esc(p.response)}</span></p>`);
  if (p.missing) return `<article class="card lk" data-key="${esc(p.key)}" data-id="${esc(p.id)}"><p class="en">${withSlots(p.english)}</p>${phraseLines(p)}</article>`;
  const d = shownFor(p); // the frame, or the variant picked with Swap it
  return `
  <article class="card lk ${p.type === 'pattern' ? 'is-pattern' : ''}" data-key="${esc(p.key)}" data-id="${esc(p.id)}">
    <div class="lk-main">
      <div class="lk-text">${phraseLines(d)}</div>
      ${canSpeak() ? `<button class="round-btn lk-play listen" data-action="speak" data-id="${esc(d.id)}" data-key="${esc(d.key)}" data-state="idle" aria-label="Listen">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button>` : ''}
    </div>
    ${swapChips(p, d === p ? '' : d.id, 'swap')}
    ${d === p && notes.length ? `<div class="notes">${notes.join('')}</div>` : d !== p && d.say_tip ? `<div class="notes">${sayTipNote(d)}</div>` : ''}
    <div class="card-actions">
      <button class="pill-btn" data-action="show-it" data-id="${esc(d.id)}">${icon('expand')}<span>Show</span></button>
      ${canPracticeAloud() ? `<button class="pill-btn" data-action="say-it" data-id="${esc(p.id)}" data-v="${d === p ? '' : esc(d.id)}">${icon('mic')}<span>Practise</span></button>` : ''}
      <span class="lk-spacer"></span>
      ${draftTag(d)}
      ${st ? `<span class="status-tag ${st}">${statusLabel(st)}</span>` : ''}
      ${p.type === 'pattern' ? '<span class="lk-kind">Pattern</span>' : ''}
      <button class="icon-btn fav ${fav ? 'on' : ''}" data-action="fav" aria-pressed="${fav}" aria-label="Save">${icon('star')}</button>
    </div>
  </article>`;
}

// A frame's written-out examples ("Um bilhete para o aeroporto"), each playable.
function exampleRow(x) {
  return `<div class="pp-more-row"><div><b ${nativeAttrs(L.lang)}>${withSlots(x.target)}</b><small>${withSlots(x.english)}</small></div>${canSpeak() ? `<button class="round-btn small listen" data-action="speak" data-id="${esc(x.id)}" data-key="${esc(x.key)}" data-state="idle" aria-label="Listen">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button>` : ''}</div>`;
}

// "Show this": one phrase, full-screen and large, to hand the phone to someone.
function openShowIt(p) {
  closeShowIt();
  const el = document.createElement('div');
  el.id = 'showit';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML = `
    <button class="icon-btn showit-x" data-action="show-close" aria-label="Close">${icon('x')}</button>
    <div class="showit-body">
      <p class="showit-native" ${nativeAttrs(L.lang)}>${withSlots(p.target)}</p>
      ${p.reading && p.reading !== p.target ? `<p class="showit-reading" ${nativeAttrs(L.lang)}>${withSlots(p.reading)}</p>` : ''}
      <p class="showit-en">${withSlots(p.english)}</p>
      ${p.draft ? '<p class="showit-draft">Draft translation, not yet checked</p>' : ''}
      ${canSpeak() ? `<button class="mic-big listen showit-play" data-action="speak" data-id="${esc(p.id)}" data-key="${esc(p.key)}" data-state="idle" aria-label="Play it for them">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button>` : ''}
    </div>`;
  document.body.appendChild(el);
  document.body.classList.add('showit-open');
  syncListen();
}
function closeShowIt() {
  document.getElementById('showit')?.remove();
  document.body.classList.remove('showit-open');
}

// Save a set of phrases' recordings for offline use. The service worker caches whatever the page fetches.
const audioUrls = (ps) => ps.map((p) => tts.naturalUrl(speechItem(p))).filter(Boolean);
async function offlineState(ps) {
  const urls = audioUrls(ps);
  if (!urls.length || !('caches' in window)) return { urls, saved: 0 };
  let saved = 0;
  for (const u of urls) if (await caches.match(new URL(u, location.href).href, { ignoreSearch: true })) saved++;
  return { urls, saved };
}
async function saveOffline(ps, btn) {
  const urls = audioUrls(ps);
  let done = 0;
  const label = btn?.querySelector('span');
  for (const u of urls) {
    try { await fetch(u); } catch { /* offline right now: try again later */ }
    done++;
    if (label) label.textContent = `Saving… ${done}/${urls.length}`;
  }
  // Give the service worker a moment to finish writing to its cache, then re-check.
  setTimeout(() => refreshOfflineBtn(ps), 400);
}
async function refreshOfflineBtn(ps) {
  const btn = document.querySelector('[data-action="save-offline"]');
  if (!btn) return;
  const { urls, saved } = await offlineState(ps);
  if (!urls.length) { btn.remove(); return; }
  const all = saved === urls.length;
  btn.classList.toggle('on', all);
  btn.querySelector('span').textContent = all ? 'Saved for offline' : 'Save for offline';
}


function header({ title, back, focus } = {}) {
  if (focus) return `<header class="topbar focus"><a class="icon-btn quiet" href="${back}" aria-label="Close">${icon('x')}</a></header>`;
  const p = store.prefs();
  const lang = L && L.lang;
  return `<header class="topbar">
    ${back ? `<a class="icon-btn quiet" href="${back}" aria-label="Back">${icon('back')}</a>` : lang ? '' : `<a class="brand" href="#/" aria-label="All languages">Wayword</a>`}
    ${lang ? `<a class="lang-chip" href="#/" title="Switch language"><span class="glyph" ${nativeAttrs(lang)}>${esc(lang.meta.glyph)}</span><span class="lang-chip-name">${esc(title || lang.name)}</span>${icon('globe', 'chip-switch')}</a>` : '<span></span>'}
    ${lang ? `<div class="toggles">
      <button class="tog ${p.showEnglish ? 'on' : ''}" data-action="toggle-en" aria-pressed="${p.showEnglish}" title="Show or hide English">EN</button>
      <button class="tog ${p.showPron ? 'on' : ''}" data-action="toggle-pron" aria-pressed="${p.showPron}" title="Show or hide pronunciation">Aa</button>
      <button class="tog help-btn" data-action="help" aria-label="How Wayword works" title="How Wayword works">${icon('help')}</button>
    </div>` : ''}
  </header>`;
}

function bottomNav(active) {
  const code = encodeURIComponent(L.lang.code);
  const items = [
    ['home', `#/${code}`, 'home', 'Today'],
    ['phrases', `#/${code}/phrases`, 'list', 'Phrases'],
    ['more', `#/${code}/more`, 'dots', 'More'],
  ];
  return `<nav class="bottomnav" aria-label="Sections">${items.map(([id, href, ic, label]) =>
    `<a href="${href}" class="nav-${id} ${active === id ? 'on' : ''}" ${active === id ? 'aria-current="page"' : ''}>${icon(ic)}<span>${label}</span></a>`).join('')}</nav>`;
}

function page(active, body, hdr = {}) {
  $app.innerHTML = `${header(hdr)}<main class="main ${hdr.focus ? 'focus' : ''}">${body}</main>${hdr.focus ? '' : bottomNav(active)}`;
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
  const dueByLang = store.dueTodayByLang();
  const dueLangs = C.languages.filter((l) => dueByLang[l.code]);
  $app.innerHTML = `
  ${header()}
  <main class="main home">
    <section class="home-hero">
      <p class="eyebrow">Wayword · finding your way with words</p>
      <div class="say home-say">${mascot('wave', 'say-m')}<h1 class="say-b">Where to next?</h1></div>
      ${last ? `<a class="continue" href="#/${encodeURIComponent(last.code)}" style="--accent:${last.meta.accent}">Continue with ${esc(last.name)} ${icon('chev')}</a>` : ''}
    </section>
    ${dueLangs.length ? `<section class="due-strip"><span class="due-k">${icon('lock')} Due today</span>${dueLangs.map((l) =>
      `<a href="#/${encodeURIComponent(l.code)}/session" style="--accent:${l.meta.accent}"><bdi lang="${esc(l.meta.bcp47)}">${esc(l.native_name)}</bdi> <b>${Math.min(dueByLang[l.code], 20)}</b></a>`).join('')}</section>` : ''}
    <section class="visa-page">
      <p class="visa-label">Visas</p>
      <div class="stamps">
      ${C.languages.map((l, i) => {
        const c = store.counts(l.code);
        const due = dueByLang[l.code] || 0;
        const foot = due ? `${due} due today` : c.started ? [c.learning ? `${c.learning} learning` : '', c.locked ? `${c.locked} locked in` : ''].filter(Boolean).join(' · ') : 'First visit';
        return `<a class="stamp shape-${i % 3}" href="#/${encodeURIComponent(l.code)}" data-stamp style="--accent:${l.meta.accent};--rot:${STAMP_TILT[i % STAMP_TILT.length]}deg;--i:${i}">
          <span class="stamp-region">${esc(l.region)}</span>
          <span class="stamp-glyph" lang="${esc(l.meta.bcp47)}" dir="${esc(l.direction)}">${esc(l.meta.glyph)}</span>
          <span class="stamp-native" lang="${esc(l.meta.bcp47)}" dir="${esc(l.direction)}">${esc(l.native_name)}</span>
          <span class="stamp-name">${esc(l.name)}</span>
          <span class="stamp-foot">${foot}</span>
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

// Today: one Continue, a fast way to a phrase, and how ready you are for each situation.
function viewDashboard() {
  const lang = L.lang;
  const code = lang.code;
  const pool = L.phrases.filter((p) => !p.missing);
  const ready = pool.filter((p) => store.isLearned(p.key)).length;
  const trip = store.trip(code);
  const days = trip ? daysUntil(trip) : null;
  const sits = C.scenarios.map((sit) => ({ sit, r: sitReady(sit) })).filter(({ r }) => r.n);

  page('home', `
    <section class="lang-hero today-hero">
      <div class="hero-text">
        <p class="eyebrow">${esc(lang.name)}${days != null ? ` · ${days === 0 ? 'you fly today' : days === 1 ? 'you fly tomorrow' : `${days} days to your trip`}` : ''}</p>
        <h1 class="hero-native" ${nativeAttrs(lang)}>${esc(lang.native_name)}</h1>
        <p class="hero-counts">${ready} of ${pool.length} phrases ready</p>
      </div>
      ${mascot('wave', 'hero-m')}
    </section>
    ${todaySay(ready)}
    ${nextStepCard()}
    ${weekCard()}

    ${section('Need a phrase now?', `<div class="scen-row">${sits.map(({ sit }) => `<a class="scen-btn" href="#/${code}/scenario/${sit.id}"><span class="scen-ic">${sit.icon}</span>${esc(sit.label)}</a>`).join('')}</div>`)}

    ${section('Your situations', `<div class="sit-list">${sits.map(({ sit, r }) => `
      <a class="sit-row ${r.ready === r.n ? 'done' : ''}" href="#/${code}/scenario/${sit.id}">
        <span class="scen-ic badge">${sit.icon}</span>
        <span class="sit-text"><b>${esc(sit.label)}</b><small>${r.ready === r.n ? 'Ready ✓' : `${r.ready} of ${r.n} ready`}</small>${readyBar(r)}</span>
        ${icon('chev', 'row-chev')}
      </a>`).join('')}</div>`)}
  `);
}

// One clear thing to do next: today's session (reviews + a few new phrases from your situation).
function nextStepCard() {
  const code = L.lang.code;
  const soon = leavingSoon();
  const reviews = Math.min(dueItems().length, soon ? 5 : 3);
  const fresh = freshPool(soon && freshPool(true).length > 0).length;
  const news = Math.min(fresh, Math.max(2, 5 - reviews));
  const started = L.phrases.some((p) => store.isLearned(p.key));
  const { sit, auto } = focusSituation();
  const r = sit ? sitReady(sit) : null;
  const working = sit ? `<button class="working" data-action="focus-sheet">
      <span class="scen-ic">${sit.icon}</span><span class="working-text"><small>${auto ? 'Working on' : 'You picked'}</small><b>${esc(sit.label)}</b></span>
      <span class="working-n">${r.ready}/${r.n}</span><span class="working-change">Change</span></button>` : '';
  if (!reviews && !news) {
    return `<section class="next-step">
      <p class="ns-k">All started</p>
      <h2>Every phrase is Learning or Locked in 🎉</h2>
      <p class="ns-sub">Keep them fresh with a quick practice round. Reviews come back on their own.</p>
      <a class="cta" href="#/${code}/session">${icon('play')} Practise 5 you know</a>
    </section>`;
  }
  const parts = [reviews ? `${reviews} to review` : '', news ? `${news} new` : ''].filter(Boolean).join(' · ');
  const mins = Math.max(2, Math.round((reviews + news * 2) * 0.4));
  return `<section class="next-step">
    <p class="ns-k">${started ? (soon ? 'Leaving soon' : 'Today') : 'Start here'}</p>
    ${working}
    <p class="ns-sub">${parts} · about ${mins} minutes. Listen, say it, compare yourself with the native voice.</p>
    <a class="cta" href="#/${code}/session">${icon('play')} ${started ? 'Continue' : 'Start'}</a>
  </section>`;
}

// This week at a glance, linking to Progress.
function weekCard() {
  const hist = historyFor(L.lang.code);
  if (!hist.length) return '';
  const since = Date.now() - 7 * 86400000;
  const week = hist.filter((h) => h.at >= since);
  const days = new Set(week.map((h) => h.d)).size;
  return `<a class="week-card" href="#/${L.lang.code}/progress">
      <span class="week-top"><span class="week-text"><b>This week</b><small>${week.length} session${week.length === 1 ? '' : 's'} · ${week.reduce((a, h) => a + h.right, 0)} right · ${days} day${days === 1 ? '' : 's'}</small></span>
      ${icon('chev', 'row-chev')}</span>${weekDots(L.lang.code)}</a>`;
}

// The last 7 days as circles, ticked on days you practised. Nothing to lose, just a picture of the week.
function weekDots(code) {
  const on = new Set(historyFor(code).map((h) => h.d));
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const done = on.has(todayIso(d.getTime()));
    out.push(`<span class="wd ${done ? 'on' : ''} ${i === 0 ? 'today' : ''}"><i>${done ? '✓' : ''}</i><small>${'SMTWTFS'[d.getDay()]}</small></span>`);
  }
  return `<span class="week-dots" role="img" aria-label="Days practised in the last 7 days: ${[...on].filter((x) => x >= todayIso(Date.now() - 6 * 86400000)).length}">${out.join('')}</span>`;
}

// Today's speech bubble: hello in the language, then what's waiting.
function todaySay(ready) {
  const hello = L.phrases.find((p) => p.id === 'hello' && !p.missing);
  const due = dueItems().length;
  const msg = !ready ? 'Let’s learn your first phrase!' : due ? `${due} phrase${due === 1 ? ' is' : 's are'} ready to review.` : 'All caught up. Fancy a few new ones?';
  return `<div class="say today-say"><p class="say-b">${hello ? `<b ${nativeAttrs(L.lang)}>${esc(hello.target.replace(/[.!]$/, ''))}!</b> ` : ''}${msg}</p></div>`;
}

// Pick the situation Continue teaches from (or leave it automatic).
function focusSheetHtml() {
  const picked = (store.prefs().focus || {})[L.lang.code];
  const rowFor = (id, iconTxt, label, sub) => `<button class="row ${picked === id || (!picked && !id) ? 'picked' : ''}" data-action="pick-focus" data-id="${id || ''}">
      <span class="row-ic emoji">${iconTxt}</span><span class="row-text"><span class="row-title">${label}</span><span class="row-sub">${sub}</span></span>
      ${picked === id || (!picked && !id) ? icon('check', 'row-check') : ''}</button>`;
  return `<div class="sheet-head"><h2>What are you getting ready for?</h2><button class="icon-btn quiet" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>
    <p class="help-lead">Continue teaches new phrases from this situation first. Reviews still come from everything you've learned.</p>
    <div class="group">
      ${rowFor('', '✨', 'Automatic', 'The basics first, then whichever situation is closest to ready')}
      ${C.scenarios.map((sit) => { const r = sitReady(sit); return r.n ? rowFor(sit.id, sit.icon, esc(sit.label), r.ready === r.n ? 'Ready ✓' : `${r.ready} of ${r.n} ready`) : ''; }).join('')}
    </div>`;
}

// Daily reminder: a repeating calendar event that opens today's session. No account or server:
// your calendar does the reminding (the habit research's "prompt" at a time you choose).
function reminderSheetHtml() {
  const t = store.prefs().reminder || '08:30';
  return `<div class="sheet-head"><h2>Daily reminder</h2><button class="icon-btn quiet" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>
    <p class="help-lead">Reviews only work if they happen on the day they’re due. Pick a time you’re usually free for 3 minutes (with coffee, on the commute) and add a daily reminder to your calendar. It opens straight into today’s ${esc(L.lang.name)} session.</p>
    <label class="trip-row reminder-row"><span>Remind me at</span><input type="time" id="reminder-time" value="${esc(t)}"></label>
    <button class="cta" data-action="reminder-ics">${icon('bell')} Add to iPhone / Apple Calendar</button>
    <button class="more-btn" data-action="reminder-google">Add to Google Calendar</button>
    <p class="fine">On iPhone, tap “Add to Calendar” on the screen that opens. To stop, delete the event in your calendar.</p>`;
}

function reminderEvent() {
  const t = (document.getElementById('reminder-time')?.value || '08:30').split(':');
  store.setPref('reminder', `${t[0]}:${t[1]}`);
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const start = `${ymd}T${t[0]}${t[1]}00`;
  const end = `${ymd}T${t[0]}${String(Math.min(59, Number(t[1]) + 5)).padStart(2, '0')}00`;
  const url = `${location.origin}${location.pathname}#/${L.lang.code}/session`;
  return { start, end, url, title: `Wayword: 3 minutes of ${L.lang.name}`, details: `Open Wayword and tap Continue. Reviews due today are waiting: ${url}` };
}

function reminderIcs() {
  const e = reminderEvent();
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wayword//Daily reminder//EN', 'BEGIN:VEVENT',
    `UID:wayword-daily-${L.lang.code}@wayword`, `DTSTAMP:${stamp}`, `DTSTART:${e.start}`, `DTEND:${e.end}`, 'RRULE:FREQ=DAILY',
    `SUMMARY:${e.title}`, `DESCRIPTION:${e.details}`, `URL:${e.url}`,
    'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', `DESCRIPTION:${e.title}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `wayword-${L.lang.code}-reminder.ics`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
}

function reminderGoogle() {
  const e = reminderEvent();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const q = new URLSearchParams({ action: 'TEMPLATE', text: e.title, details: e.details, dates: `${e.start}/${e.end}`, recur: 'RRULE:FREQ=DAILY', ctz: tz });
  window.open(`https://calendar.google.com/calendar/render?${q}`, '_blank', 'noopener');
}

// Progress over time: a 14-day chart, recent sessions, phrases by stage, situations.
function historyFor(code) { return (store.prefs().history || {})[code] || []; }
function viewProgress() {
  const lang = L.lang;
  const code = lang.code;
  const hist = historyFor(code);
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const iso = todayIso(d.getTime());
    const list = hist.filter((h) => h.d === iso);
    days.push({ iso, d, right: list.reduce((a, h) => a + h.right, 0), n: list.length });
  }
  const max = Math.max(4, ...days.map((x) => x.right));
  const pool = L.phrases.filter((p) => !p.missing);
  const locked = pool.filter((p) => store.status(p.key) === 'locked').length;
  const learning = pool.filter((p) => store.status(p.key) === 'learning').length;
  const fresh = pool.length - locked - learning;
  const pct = (n) => `${(n / pool.length) * 100}%`;
  const week = days.slice(7);
  const sits = C.scenarios.map((sit) => ({ sit, r: sitReady(sit) })).filter(({ r }) => r.n);
  page('more', `
    <section class="page-head"><h1>Progress</h1><p>${esc(lang.name)} · ${hist.length} session${hist.length === 1 ? '' : 's'} so far</p></section>
    <div class="week-card static">${weekDots(code)}</div>
    <div class="board big">
      <div><b>${week.reduce((a, x) => a + x.n, 0)}</b><small>sessions this week</small></div>
      <div><b>${week.reduce((a, x) => a + x.right, 0)}</b><small>right this week</small></div>
      <div><b>${week.filter((x) => x.n).length}/7</b><small>days this week</small></div>
    </div>
    ${section('Right answers, last 14 days', `<div class="chart" role="img" aria-label="Right answers per day for the last 14 days">${days.map((x) => `
        <div class="cbar ${x.iso === todayIso() ? 'today' : ''}"><span class="cbar-n">${x.right || ''}</span><span class="cbar-track"><span class="cbar-fill" style="height:${Math.round((x.right / max) * 100)}%"></span></span><span class="cbar-d">${'SMTWTFS'[x.d.getDay()]}</span></div>`).join('')}
      </div>`)}
    ${section('Your phrases', `<div class="stages"><span class="st-locked" style="width:${pct(locked)}"></span><span class="st-learning" style="width:${pct(learning)}"></span></div>
      <div class="stage-keys"><span><i class="k-locked"></i>${locked} Locked in</span><span><i class="k-learning"></i>${learning} Learning</span><span><i class="k-new"></i>${fresh} not started</span></div>`)}
    ${hist.length ? section('Recent sessions', `<div class="group">${hist.slice(-10).reverse().map((h) => `
        <div class="row static"><span class="row-ic ${h.answered && h.right === h.answered ? 'ok' : ''}">${icon(h.answered && h.right === h.answered ? 'check' : 'play')}</span>
          <span class="row-text"><span class="row-title">${h.answered ? `${h.right}/${h.answered} right` : 'Learning session'} · ${fmtTime(h.ms)}</span>
          <span class="row-sub">${new Date(h.at).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}${h.combo >= 2 ? ` · 🔥 ${h.combo}` : ''}${h.newly ? ` · ${h.newly} new` : ''}${h.locked ? ` · ${h.locked} locked in` : ''}</span></span></div>`).join('')}</div>`) : '<p class="fine">Finish a session and it shows up here.</p>'}
    ${section('Situations', `<div class="sit-list">${sits.map(({ sit, r }) => `
      <a class="sit-row ${r.ready === r.n ? 'done' : ''}" href="#/${code}/scenario/${sit.id}"><span class="scen-ic badge">${sit.icon}</span>
        <span class="sit-text"><b>${esc(sit.label)}</b><small>${r.ready === r.n ? 'Ready ✓' : `${r.ready} of ${r.n} ready`}</small>${readyBar(r)}</span></a>`).join('')}</div>`)}
    ${scoreboardHtml()}
  `, { back: `#/${code}` });
}

// Your scoreboard for this language: personal bests, no leaderboard, no streak to lose.
function scoreboardHtml() {
  const code = L.lang.code;
  const sc = scoresFor(code);
  const c = store.counts(code);
  const month = todayIso().slice(0, 7);
  const days = Object.keys(sc.days || {}).filter((d) => d.startsWith(month)).length;
  if (!sc.sessions && !c.started) return '';
  const cell = (v, k) => `<div><b>${v}</b><small>${k}</small></div>`;
  return section('Scoreboard', `<div class="board big">
      ${cell(sc.sessions || 0, 'sessions')}
      ${cell(sc.totalRight || 0, 'right answers')}
      ${cell(`🔥 ${sc.bestCombo || 0}`, 'best combo')}
      ${cell(sc.fastestPerfect ? fmtTime(sc.fastestPerfect) : '–', 'fastest perfect')}
      ${cell(c.locked, 'locked in')}
      ${cell(days, 'days this month')}
      ${sc.race?.best != null ? cell(`${sc.race.best}/8`, 'Swap race best') : ''}
      ${sc.race?.fastest ? cell(fmtTime(sc.race.fastest), 'fastest race') : ''}
    </div>`);
}

// More: everything that isn't the daily loop or looking a phrase up.
function viewMore() {
  const lang = L.lang;
  const code = lang.code;
  const favs = store.countFor('fav', code);
  const patterns = L.phrases.filter((p) => p.type === 'pattern' && !p.missing).length;
  page('more', `
    <section class="page-head"><h1>More</h1></section>
    ${section('Your progress', `<div class="group">${row({ href: `#/${code}/progress`, ic: 'list', title: 'Progress', sub: 'Every session, the last 14 days, and your phrases by stage' })}</div>`)}
    ${scoreboardHtml()}
    ${section('Stay on it', `<div class="group">
      ${row({ action: 'toggle-sfx', ic: 'sound', title: 'Sounds', sub: sfx.enabled() ? 'On: a ding for right, a soft note for not quite' : 'Off', attrs: 'id="sfx-row"' })}
      ${row({ action: 'reminder-sheet', ic: 'bell', title: 'Daily reminder', sub: store.prefs().reminder ? `Set for ${esc(store.prefs().reminder)} · add it again to change the time` : 'A repeating calendar reminder, so reviews happen on the day they’re due' })}
    </div>`)}
    ${section('Your trip', `<div class="group">
      ${row({ href: `#/${code}/flight`, ic: 'plane', title: 'Flying soon?', sub: 'Set your trip date, rescue kit, crash course' })}
      ${row({ href: `#/${code}/cheatsheet`, ic: 'printer', title: 'Cheat sheet', sub: 'Every Core phrase on one screen. Print or screenshot it' })}
      ${row({ href: `#/${code}/phrases?cat=saved`, ic: 'star', title: 'Saved phrases', count: favs })}
    </div>`)}
    ${section('Go deeper', `<div class="group">
      ${row({ href: `#/${code}/sounds`, ic: 'ear', title: 'Sound guide', sub: 'The tricky sounds, and how to read the pronunciation line' })}
      ${row({ href: `#/${code}/patterns`, ic: 'puzzle', title: 'Power patterns', sub: 'One sentence frame, many uses', count: patterns })}
      ${row({ href: `#/${code}/race`, ic: 'shuffle', title: 'Swap race', sub: 'Hear it, tap the swapped word. 8 rounds against the clock' })}
      ${row({ href: `#/${code}/practice/run`, ic: 'list', title: 'Type it', sub: 'Write phrases out; get told exactly what to fix' })}
    </div>`)}
    ${canSpeak() || lang.meta.tts_note ? section('Audio', audioGroup()) : ''}
    ${L.generalNotes.length ? section(`About this ${lang.direction === 'rtl' ? 'dialect' : 'set'}`, `<div class="group notes-group">
      ${L.generalNotes.map((n) => `<p class="about-row"><span class="note-k">${esc(n.key)}</span>${esc(n.text)}</p>`).join('')}
    </div>`) : ''}
    <div class="group">${row({ action: 'help', ic: 'help', title: 'How Wayword works' })}</div>
    <p class="fine">Progress is saved on this device only. <span id="app-version"></span></p>
  `);
  fetch('./sw.js').then((r) => r.text()).then((t) => {
    const v = t.match(/wayword-v(\d+)/);
    const el = document.getElementById('app-version');
    if (v && el) el.textContent = `Version ${v[1]}.`;
  }).catch(() => {});
}

function audioGroup() {
  const lang = L.lang;
  if (!canSpeak()) return `<div class="group notes-group"><p class="about-row">${esc(lang.meta.tts_note || 'Audio is off for this language.')}</p></div>`;
  const v = voiceText();
  return `<div class="group">
    ${row({ action: 'voice-sheet', ic: 'person', title: 'Voice', sub: v ? esc(v) : 'No voice installed', attrs: 'id="voice-row"' })}
    <div class="row static"><span class="row-ic">${icon('play')}</span><span class="row-text"><span class="row-title">Speed</span></span></div>
    <div class="seg-wrap">${speedSeg()}</div>
    ${canPracticeAloud() ? row({ href: `#/${lang.code}/mic`, ic: 'mic', title: 'Mic check', sub: 'Test your speaker, microphone and speech check' }) : ''}
  </div>
  ${tts.naturalFor(lang.code)?.source ? `<p class="tip">Natural voices by ${esc(tts.naturalFor(lang.code).source.replace(/ neural voices$/, ''))}.</p>` : ''}
  <p class="tip">No sound? On iPhone the voice is muted when the side switch is on silent. Turn silent off and the volume up.</p>
  ${lang.meta.tts_warning ? `<p class="callout">${esc(lang.meta.tts_warning)}</p>` : ''}`;
}

const speedSeg = () => `<div class="seg">${tts.SPEEDS.map((sp) =>
  `<button class="seg-btn ${sp.id === tts.speed().id ? 'on' : ''}" data-action="set-speed" data-speed="${sp.id}">${sp.label}</button>`).join('')}</div>`;

// Phrases: search everything, or pick a situation. Every phrase, every level.
function viewPhrases(query) {
  const lang = L.lang;
  const sel = query.get('s') || (query.get('cat') === 'saved' ? 'saved' : 'all');
  const q = (query.get('q') || '').trim();
  const chips = [['all', 'All', ''], ['saved', 'Saved', '★'], ['patterns', 'Patterns', '🧩'], ...C.scenarios.map((x) => [x.id, x.label, x.icon])];
  page('phrases', `
    <div class="search">${icon('search')}<input id="q" type="search" inputmode="search" placeholder="Search English, ${esc(lang.native_name)} or sounds" value="${esc(q)}" autocomplete="off"></div>
    <div class="chips" role="tablist">${chips.map(([id, label, ic]) =>
      `<a class="chip ${sel === id ? 'on' : ''}" href="#/${lang.code}/phrases?s=${id}">${ic ? `<span>${ic}</span>` : ''}${esc(label)}</a>`).join('')}</div>
    <div id="list" class="list"></div>
  `);
  const input = document.getElementById('q');
  const draw = () => renderList(sel, input.value.trim());
  input.addEventListener('input', draw);
  draw();
  if (sel !== 'all') document.querySelector('.chip.on')?.scrollIntoView({ inline: 'center', block: 'nearest' });
}

function renderList(sel, q) {
  const needle = q.toLowerCase();
  const sit = C.scenarios.find((x) => x.id === sel);
  let items;
  if (needle) { // searching looks through everything, whatever chip is on
    items = L.phrases.filter((p) => [p.english, p.target, p.reading, p.pron, p.regional_note, p.usage_note]
      .some((x) => x && x.toLowerCase().includes(needle)));
  } else if (sel === 'saved') items = L.phrases.filter((p) => store.isFav(p.key));
  else if (sel === 'patterns') items = L.phrases.filter((p) => !p.missing && variantsOf(p).length); // Swap it frames
  else if (sit) items = sitPhrases(sit);
  else items = L.phrases.filter((p) => !p.missing);
  const el = document.getElementById('list');
  document.querySelector('.chips')?.classList.toggle('dim', !!needle);
  if (!items.length) {
    el.innerHTML = `<div class="empty-state">${needle ? 'No phrase matches that.' : sel === 'saved' ? 'Tap ★ on any phrase to save it here.' : 'Nothing here yet.'}</div>`;
    return;
  }
  const head = needle ? `${items.length} match${items.length === 1 ? '' : 'es'} in all phrases`
    : sel === 'patterns' ? `${items.length} patterns · tap a chip to swap the blank · <a class="link-btn" href="#/${L.lang.code}/race">🏁 Swap race ${icon('chev')}</a>`
    : sit ? `${sit.icon} ${esc(sit.label)} · ${items.length} phrases · <a class="link-btn" href="#/${L.lang.code}/scenario/${sit.id}">Get ready ${icon('chev')}</a>`
      : `${items.length} phrase${items.length === 1 ? '' : 's'}`;
  el.innerHTML = `<p class="count">${head}</p>${items.map((p) => phraseCard(p)).join('')}`;
  syncListen();
}

function viewScenarios() {
  const lang = L.lang;
  page('home', `
    <section class="page-head"><h1>Where are you?</h1><p>Pick a place. You'll see the phrases that matter there.</p></section>
    <div class="scen-grid">${C.scenarios.map((sit) => {
      const r = sitReady(sit);
      return `<a class="scen-card" href="#/${lang.code}/scenario/${sit.id}"><span class="scen-ic big">${sit.icon}</span><strong>${esc(sit.label)}</strong><small>${r.ready} of ${r.n} ready</small></a>`;
    }).join('')}</div>
  `, { back: `#/${lang.code}` });
}

function viewScenario(id) {
  const lang = L.lang;
  const sit = C.scenarios.find((x) => x.id === id);
  if (!sit) return go(`#/${lang.code}`);
  const ps = sitPhrases(sit);
  const r = sitReady(sit);
  page('home', `
    <section class="page-head scen-head"><span class="scen-ic huge">${sit.icon}</span><div><h1>${esc(sit.label)}</h1><p>${r.ready === r.n ? 'Ready ✓' : `${r.ready} of ${r.n} ready`}</p>${readyBar(r)}</div></section>
    ${sit.note ? `<p class="callout">${esc(sit.note)}</p>` : ''}
    ${r.ready < r.n ? `<button class="cta sit-cta" data-action="practise-sit" data-id="${sit.id}">${icon('play')} Get ready for ${esc(sit.label === 'The basics' ? 'the basics' : sit.label)}</button>` : ''}
    ${audioUrls(ps).length ? `<button class="pill-btn offline-btn" data-action="save-offline" data-id="${sit.id}">${icon('download')}<span>Save for offline</span></button>` : ''}
    <div class="list">${ps.map((p) => phraseCard(p)).join('')}</div>
    ${repliesFor(sit).length ? section('You might hear', `<div class="group pad hear-list">${repliesFor(sit).map((x) => exampleRow(x).replace('<small>', `${draftTag(x)}<small>`)).join('')}</div>`) : ''}
  `, { back: `#/${lang.code}` });
  refreshOfflineBtn(ps);
}

function viewPatterns() {
  const lang = L.lang;
  const rank = (p) => (p.category === 'power_patterns' ? 0 : 1);
  const pats = L.phrases.filter((p) => p.type === 'pattern' && inTier(p)).sort((a, b) => rank(a) - rank(b) || a.order - b.order);
  const anySubs = Object.values(C.patterns).some((x) => x.substitutions && x.substitutions[lang.code]?.length);
  page('more', `
    <section class="page-head"><h1>Power patterns</h1><p>Learn the frame once, then swap the blank to say new things.</p></section>
    ${anySubs || Object.keys(L.examples).length ? '' : '<p class="callout">Swap-in words aren’t in the dataset yet. Under each pattern you’ll find dataset phrases already built on it.</p>'}
    <div class="list">${renderGrouped(pats, (p, isNew) => patternCard(p, isNew), { noun: 'patterns' }) || '<div class="empty-state">No patterns yet.</div>'}</div>
  `);
}

function miniPhrase(p, { nativeHtml } = {}) {
  return `<div class="mini" data-key="${esc(p.key)}">
    <div class="mini-text">${phraseLines(p, { size: 'sm', nativeHtml })}</div>
    <div class="mini-actions">${listenBtn(p, 'small')}${micBtn(p, 'small')}</div>
  </div>`;
}

function patternCard(p, isNew = false) {
  const lang = L.lang;
  const conf = C.patterns[p.id] || {};
  const subs = (conf.substitutions && conf.substitutions[lang.code]) || [];
  const related = (conf.related || []).map((id) => L.byId.get(id)).filter((r) => r && !r.missing);
  return `<div class="pattern">
    ${phraseCard(p, { isNew })}
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

// Type it: the one practice mode outside sessions (spelling, accents, scripts). From More.
// ?s=<situation> limits the deck to one situation; otherwise every phrase, shuffled.
function buildDeck(query) {
  const sit = C.scenarios.find((x) => x.id === query.get('s'));
  return shuffle((sit ? sitPhrases(sit) : L.phrases).filter((p) => !p.missing));
}

function viewPracticeRun(query) {
  const sig = `${L.lang.code}|${query.toString()}`;
  if (!practice || practice.sig !== sig) {
    const deck = buildDeck(query);
    practice = { sig, query: query.toString(), all: deck, queue: deck.slice(), total: deck.length, done: 0, missed: new Set() };
  }
  drawPractice();
}

function nextCard() {
  practice.check = null;
  practice.typed = '';
  tts.stop();
}

function drawPractice() {
  const lang = L.lang;
  const s = practice;
  const back = `#/${lang.code}/more`;
  if (!s.total) {
    page('more', `<div class="empty-state big">Nothing to type yet.<br><a href="${back}">Back</a></div>`, { back, focus: true });
    return;
  }
  if (!s.queue.length) {
    page('more', `<section class="done">
      <div class="done-burst">🎉</div><h1>All typed</h1>
      <p>${s.total} phrases${s.missed.size ? ` · ${s.missed.size} to try again` : ''}</p>
      <div class="done-actions">
        ${s.missed.size ? `<button class="cta" data-action="retry-missed">${icon('replay')} Try the ${s.missed.size} I missed</button>` : ''}
        <button class="more-btn" data-action="restart">${icon('shuffle')} Shuffle again</button>
        <a class="more-btn" href="${back}">Done</a>
      </div>
    </section>`, { back, focus: true });
    return;
  }
  const p = s.queue[0];
  const nativeBlock = `<p class="native fc-native" ${nativeAttrs(lang)}>${withSlots(p.target)}</p>${readingLine(p, 'fc-kana')}<p class="pron fc-pron" data-peek="pron">${withSlots(p.pron)}</p>`;
  const notes = sayTipNote(p, false);
  page('more', `
    <div class="fc-progress"><span style="width:${Math.round((s.done / s.total) * 100)}%"></span></div>
    <p class="fc-meta">Type it · ${s.done + 1} of ${s.total}</p>
    ${s.done === 0 && !s.check ? '<p class="fc-tip">Read the English and type the phrase. Accents count; capitals and punctuation don’t.</p>' : ''}
    <div class="flashcard typing ${s.check ? 'flipped' : ''}" aria-live="polite">
      <div class="fc-face">
        <span class="fc-label">Type it in ${esc(lang.name)}</span>
        <p class="fc-en">${withSlots(p.english)}</p>
        ${s.check
          ? `<span class="fc-divider"></span>${nativeBlock}${typeResult(s)}${notes}`
          : `<form class="type-form" data-type-form>
               <input class="type-input" id="type-input" ${nativeAttrs(lang)} autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" enterkeyhint="done" placeholder="Type it here" value="${esc(s.typed || '')}">
               <button class="cta" type="submit">Check</button>
             </form>${typeHint(p)}`}
      </div>
    </div>
    ${!s.check ? '<button class="link-btn center" data-action="type-reveal">Show the answer</button>' : ''}
    ${s.check && !['correct', 'marks'].includes(s.check.verdict) ? `<button class="link-btn center" data-action="type-retry">${icon('replay')} Try again</button>` : ''}
    ${s.check ? `<button class="cta pp-next" data-action="type-next">Next ${icon('arrow')}</button>` : ''}
    <div class="fc-extra">${listenBtn(p)}</div>
  `, { back, focus: true });
}

// Type it: the verdict and what to fix, from js/typecheck.js.
function typeResult(s) {
  const r = s.check;
  const head = {
    correct: '✓ Correct', marks: '✓ Right words. Check the accents', close: 'Close. A few things to fix',
    wrong: 'Not quite yet', revealed: 'Here’s the answer',
  }[r.verdict] || '';
  return `<div class="take type-take ${['correct', 'marks'].includes(r.verdict) ? 'good' : r.verdict === 'revealed' ? '' : 'failed'}">
    <p class="take-verdict">${head}</p>
    ${s.typed ? `<p class="heard">${s.built ? 'You built' : 'You wrote'}: <bdi ${nativeAttrs(L.lang)}>${esc(s.typed)}</bdi></p>` : ''}
    ${r.notes.length ? `<ul class="type-notes">${r.notes.map((n) => `<li>${esc(n.text)}</li>`).join('')}</ul>` : ''}
  </div>`;
}

function typeHint(p) {
  const lang = L.lang;
  const base = lang.meta.bcp47.split('-')[0];
  const keyboards = { ru: 'Russian', ar: 'Arabic', he: 'Hebrew', ja: 'Japanese (kana is fine)' };
  const tips = [];
  if (keyboards[base]) tips.push(`Needs a ${keyboards[base]} keyboard: iPhone Settings → General → Keyboard → Keyboards → Add New Keyboard.`);
  else tips.push('Hold a letter on the iPhone keyboard for accents (e → ê, é).');
  if (p.type === 'pattern') tips.push('For the blank, type any word, or leave it out.');
  return `<p class="fc-hint type-hint">${tips.join(' ')}</p>`;
}

function runTypeCheck(revealOnly = false) {
  const s = practice;
  const p = s.queue[0];
  const typed = (document.getElementById('type-input')?.value ?? s.typed ?? '').trim();
  if (!revealOnly && !typed) { document.getElementById('type-input')?.focus(); return; }
  s.typed = revealOnly ? '' : typed;
  s.check = revealOnly ? { verdict: 'revealed', notes: [] }
    : L.lang.meta.no_spaces ? checkTypedChars(p.target, typed, p.reading) : checkTyped(p.target, typed);
  // A wrong answer (or peeking) counts as a miss, so a later "Got it" won't mark it Learning.
  if (!['correct', 'marks'].includes(s.check.verdict)) s.missed.add(p.key);
  drawPractice();
  if (canSpeak()) tts.play(speechItem(p)); // hear the right version straight away
}

/* ---------- the session: one engine for learning and review (see js/plan.js) ---------- */

let session = null;

// Learning phrases due today, most overdue first (any level), at most 20 a day.
function dueItems() {
  return store.dueToday(L.lang.code).map((k) => L.byId.get(k.slice(L.lang.code.length + 1))).filter((p) => p && !p.missing).slice(0, 20);
}

// Leaving within 3 days: Core first and more reviews.
function leavingSoon() {
  const trip = store.trip(L.lang.code);
  return !!trip && daysUntil(trip) <= 3;
}

// Not started yet, in teaching order (Core, then Travel, then Explore). Core only for the crash course.
function freshPool(coreOnly = false) {
  const rank = { core: 0, travel: 1, explore: 2 };
  const pool = L.phrases.filter((p) => !p.missing && !store.isLearned(p.key) && (!coreOnly || p.priority === 'core'));
  pool.sort((a, b) => rank[a.priority] - rank[b.priority] || a.order - b.order);
  const sit = focusSituation().sit;
  if (!sit) return pool;
  // The situation's own phrases first (its `counts`), then its general ones, then everything else.
  const own = new Set(sit.counts || sit.concepts);
  const inSit = new Set(sit.concepts);
  return [...pool.filter((p) => own.has(p.id)), ...pool.filter((p) => inSit.has(p.id) && !own.has(p.id)), ...pool.filter((p) => !inSit.has(p.id))];
}

function sessionPlanFor(query) {
  const soon = leavingSoon();
  const coreLeft = freshPool(true).length > 0;
  return planSession({
    due: dueItems(),
    fresh: freshPool((query.get('mode') === 'flight' || soon) && coreLeft),
    known: L.phrases.filter((p) => !p.missing && store.isLearned(p.key)),
    replies: repliesFor(focusSituation().sit),
    leavingSoon: soon,
    canListen: canSpeak(),
  });
}

function viewSession(query) {
  const sig = `${L.lang.code}|${focusSituation().sit?.id || ''}|${query.get('mode') === 'flight' ? 'flight' : ''}`;
  const stale = !session || session.sig !== sig || session.i >= session.steps.length || Date.now() - session.at > 3 * 3600000;
  if (stale) {
    session = { sig, at: Date.now(), steps: sessionPlanFor(query), i: 0, results: {}, missed: new Set(), newly: 0, newlyLocked: 0, picked: null };
    for (const u of audioUrls(session.steps.map((x) => x.p))) fetch(u).catch(() => {}); // preload + cache for offline
  }
  pl = null;
  drawSession();
}

const STEP_LABEL = { review: 'Review', again: 'Once more', new: 'New phrase', check: 'Quick check', listen: 'Listening', practice: 'Practice' };

function drawSession() {
  const lang = L.lang;
  const s = session;
  const home = `#/${lang.code}`;
  if (!s.steps.length) {
    page('home', `<div class="empty-state big">Nothing to practise yet.<br><a href="${home}">Back to ${esc(lang.name)} home</a></div>`, { back: home });
    return;
  }
  if (s.i >= s.steps.length) { drawSessionDone(); return; }
  const st = s.steps[s.i];
  const top = `<div class="fc-progress"><span style="width:${Math.round((s.i / s.steps.length) * 100)}%"></span></div>
    <p class="fc-meta">${s.combo >= 2 ? `<span class="combo-chip">🔥 ${s.combo}</span>` : ''}${STEP_LABEL[st.kind]} · ${s.i + 1} of ${s.steps.length} ${['review', 'practice', 'check'].includes(st.kind) ? ladderHtml(st.ask || (st.ask = askFor(st))) : ''}</p>`;

  if (st.kind === 'listen') {
    const p = st.p;
    const picked = s.picked;
    // Recognising isn't enough: once you've picked, you repeat it (production beats recognition).
    if (picked != null && (!pl || pl.p !== p)) Object.assign(mountPlayer(p, 'session', 'learn'), { step: canPracticeAloud() ? 'say' : 'done', echo: true });
    page('home', `${top}
      <article class="pp-phrase pp-prompt">${promptHead(`What did they say?`)}
        <div class="pp-stage"><button class="mic-big listen pp-big" data-action="speak" data-id="${esc(p.id)}" data-key="${esc(p.key)}" data-state="idle" aria-label="Listen">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button>
        <span class="pp-hint">Listen, then pick the meaning</span></div>
      </article>
      <div class="lc-opts">${st.options.map((o, i) => `<button class="lc-opt ${picked == null ? '' : o.ok ? 'right pop' : picked === i ? 'wrong shake' : ''}" data-action="lc-pick" data-i="${i}" ${picked == null ? '' : 'disabled'}>${withSlots(o.text)}</button>`).join('')}</div>
      ${picked == null ? '' : `<p class="take-verdict lc-verdict">${st.options[picked].ok ? '✓ Right. Now say it back.' : 'Not quite. Here it is: say it back.'} ${draftTag(p)}</p>
        <div id="pp" class="pp">${playerInner()}</div>`}
    `, { back: home, focus: true });
    return;
  }

  if (st.ask === 'recognize') {
    const p = st.p;
    const picked = st.picked;
    const ok = picked != null && st.options[picked].ok;
    page('home', `${top}
      <article class="pp-phrase pp-prompt">${promptHead(`What does this mean?`)}
        <p class="native lg" ${nativeAttrs(L.lang)}>${withSlots(p.target)}</p>${readingLine(p, 'lg')}
        ${canSpeak() ? `<div class="pp-stage"><button class="mic-big listen pp-big" data-action="speak" data-id="${esc(p.id)}" data-key="${esc(p.key)}" data-state="idle" aria-label="Listen">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button></div>` : ''}
      </article>
      <div class="lc-opts">${st.options.map((o, i) => `<button class="lc-opt ${picked == null ? '' : o.ok ? 'right pop' : picked === i ? 'wrong shake' : ''}" data-action="rc-pick" data-i="${i}" ${picked == null ? '' : 'disabled'}>${withSlots(o.text)}</button>`).join('')}</div>
      ${picked == null ? '' : feedbackSheet(ok, { sub: ok ? '' : `It means: <b>${withSlots(p.english)}</b>. ${missSub(st.kind)}`, action: ok ? 'ss-got' : 'ss-again' })}
    `, { back: home, focus: true });
    return;
  }

  const recall = st.kind !== 'new';
  if (recall && !st.ask) st.ask = askFor(st);
  if (!pl || pl.p !== st.p || pl.where !== 'session') {
    mountPlayer(st.p, 'session', recall ? 'recall' : 'learn');
    if (recall) Object.assign(pl, { ask: st.ask, reply: st.reply });
  }
  page('home', `${top}<div id="pp" class="pp">${playerInner()}</div>`, { back: home, focus: true });
  warmMicSoon();
}

function drawSessionDone() {
  const lang = L.lang;
  const s = session;
  const home = `#/${lang.code}`;
  const seen = [];
  for (const st of s.steps) if (st.kind !== 'listen' && !seen.includes(st.p)) seen.push(st.p);
  const got = seen.filter((p) => s.results[p.key] === 'got');
  const again = seen.filter((p) => s.results[p.key] === 'again');
  const learnedOnly = seen.filter((p) => !s.results[p.key]); // heard but no recall in this session
  const next = store.nextDue(lang.code);
  const nextIn = next ? Math.max(0, Math.round((next - Date.now()) / 86400000)) : null;
  const notes = [
    s.newly ? `${s.newly} new phrase${s.newly === 1 ? '' : 's'} now Learning.` : '',
    s.newlyLocked ? `${s.newlyLocked} Locked in for good.` : '',
    again.length ? 'The ones marked ↻ come back next time.' : '',
    nextIn != null ? `Next review ${nextIn === 0 ? 'later today' : nextIn === 1 ? 'tomorrow' : `in ${nextIn} days`}.` : '',
  ].filter(Boolean).join(' ');
  if (!s.result) { s.result = recordSession(s); sfx.done(); }
  const { ms, perfect, pb } = s.result;
  const board = s.answered ? `<div class="board">
      <div><b>${s.right || 0}/${s.answered}</b><small>right</small></div>
      <div><b>${fmtTime(ms)}</b><small>time</small></div>
      <div><b>🔥 ${s.bestCombo || 0}</b><small>best combo</small></div>
    </div>
    ${pb.length ? `<p class="pb pop">🏆 New personal best: ${pb.join(', ')}!</p>` : perfect ? '<p class="pb">✨ A perfect session.</p>' : ''}` : '';
  const row = (p, ok) => `<div class="row static"><span class="row-ic ${ok ? 'ok' : ''}">${icon(ok ? 'check' : 'replay')}</span>
    <span class="row-text"><span class="row-title">${withSlots(p.english)}</span><span class="row-sub" ${nativeAttrs(lang)}>${withSlots(p.target)}</span></span></div>`;
  page('home', `
    <section class="done">
      ${mascot(again.length ? 'happy' : 'cheer', 'done-mascot')}
      <h1>${got.length ? 'You can now say' : 'Nice work'}</h1>
      ${notes ? `<p>${notes}</p>` : ''}
    </section>
    ${board}
    ${got.length || again.length || learnedOnly.length ? `<div class="group session-summary">${got.map((p) => row(p, true)).join('')}${again.map((p) => row(p, false)).join('')}${learnedOnly.map((p) => row(p, true)).join('')}</div>` : ''}
    <div class="done-actions">
      <button class="cta" data-action="ss-another">${icon('play')} Keep going</button>
      <a class="more-btn" href="#/${lang.code}/progress">See your progress</a>
      <a class="more-btn" href="${home}">Done</a>
    </div>
  `, { back: home, focus: true });
}

/* ---------- Swap race: hear a sentence, tap the word that was swapped in ---------- */

const RACE_ROUNDS = 8;
let race = null;
let raceTimer = 0;

function newRace() {
  const frames = L.phrases.filter((p) => !p.missing && variantsOf(p).length >= 3);
  const rounds = [];
  for (let i = 0; i < RACE_ROUNDS && frames.length; i++) {
    const f = frames[Math.floor(Math.random() * frames.length)];
    const vs = variantsOf(f);
    const ans = vs[Math.floor(Math.random() * vs.length)];
    const options = shuffle([ans, ...shuffle(vs.filter((v) => v.id !== ans.id)).slice(0, 3)]);
    rounds.push({ f, ans, options });
  }
  return { code: L.lang.code, rounds, i: 0, right: 0, start: Date.now(), picked: null, done: false };
}

function viewRace() {
  clearInterval(raceTimer);
  if (race && race.code !== L.lang.code) race = null;
  const lang = L.lang;
  const back = `#/${lang.code}/phrases?s=patterns`;
  const best = scoresFor(lang.code).race || {};
  if (!canSpeak()) {
    page('home', '<div class="empty-state big">Swap race needs audio, and this language has no voice on this device.</div>', { back, focus: true });
    return;
  }
  if (!race) {
    page('home', `<section class="race-intro">
        ${mascot('happy', 'done-mascot')}<h1>🏁 Swap race</h1>
        <p>Hear a sentence, tap the word that was swapped into the blank. ${RACE_ROUNDS} rounds, as fast as you can.</p>
        ${best.best != null ? `<div class="board"><div><b>${best.best}/${RACE_ROUNDS}</b><small>best score</small></div><div><b>${best.fastest ? fmtTime(best.fastest) : '–'}</b><small>fastest perfect</small></div><div><b>${best.plays || 0}</b><small>races</small></div></div>` : ''}
        <button class="cta" data-action="race-start">${icon('play')} Start</button>
      </section>`, { back, focus: true });
    return;
  }
  if (race.done) {
    page('home', `<section class="done">
        ${mascot(race.right === RACE_ROUNDS ? 'cheer' : race.right >= RACE_ROUNDS / 2 ? 'happy' : 'oops', 'done-mascot')}
        <h1>${race.right}/${RACE_ROUNDS}</h1>
        <p>${fmtTime(race.ms)}${race.pb ? ' · <b>new personal best!</b>' : ''}</p>
      </section>
      <div class="done-actions">
        <button class="cta" data-action="race-start">${icon('replay')} Race again</button>
        <a class="more-btn" href="${back}">Back to patterns</a>
      </div>`, { back, focus: true });
    return;
  }
  const r = race.rounds[race.i];
  const picked = race.picked;
  page('home', `
    <div class="fc-progress"><span style="width:${Math.round((race.i / RACE_ROUNDS) * 100)}%"></span></div>
    <p class="fc-meta race-meta"><span>Round ${race.i + 1} of ${RACE_ROUNDS} · ${race.right} right</span><span id="race-time">${fmtTime(Date.now() - race.start)}</span></p>
    <article class="pp-phrase pp-prompt">${promptHead(`Which word was swapped in?`)}
      <p class="native" ${nativeAttrs(lang)}>${withSlots(r.f.target)}</p>
      <p class="en">${withSlots(r.f.english)}</p>
      <div class="pp-stage"><button class="mic-big listen pp-big" data-action="speak" data-id="${esc(r.ans.id)}" data-key="${esc(r.ans.key)}" data-state="idle" aria-label="Hear it">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button></div>
    </article>
    <div class="lc-opts race-opts">${r.options.map((o) => `<button class="lc-opt ${picked == null ? '' : o.id === r.ans.id ? 'right pop' : picked === o.id ? 'wrong shake' : ''}" data-action="race-pick" data-v="${esc(o.id)}" ${picked == null ? '' : 'disabled'}>${esc(o.label)}</button>`).join('')}</div>
    ${picked != null ? `<p class="fine center race-answer" ${nativeAttrs(lang)}>${withSlots(r.ans.target)}</p>` : ''}
  `, { back, focus: true });
  raceTimer = setInterval(() => {
    const el = document.getElementById('race-time');
    if (!el || !race || race.done) { clearInterval(raceTimer); return; }
    el.textContent = fmtTime(Date.now() - race.start);
  }, 500);
}

function raceNext() {
  if (!race) return;
  race.i++;
  race.picked = null;
  if (race.i >= race.rounds.length) {
    race.done = true;
    race.ms = Date.now() - race.start;
    const code = L.lang.code;
    const all = store.prefs().scores || {};
    const sc = all[code] || {};
    const prev = sc.race || {};
    const perfect = race.right === RACE_ROUNDS;
    race.pb = !!prev.plays && (race.right > (prev.best ?? -1) || (perfect && (!prev.fastest || race.ms < prev.fastest)));
    const next = { plays: (prev.plays || 0) + 1, best: Math.max(prev.best ?? 0, race.right), fastest: perfect ? Math.min(prev.fastest || Infinity, race.ms) : prev.fastest || null };
    store.setPref('scores', { ...all, [code]: { ...sc, race: next } });
    sfx.done();
    viewRace();
    return;
  }
  viewRace();
  speakPhrase(race.rounds[race.i].ans.id); // the next sentence plays straight away
}

/* ---------- the game feel: one feedback panel, sounds, combo, scoreboard ---------- */

// The mascot: a round little speech bubble in the language's colour. Moods: happy, oops, cheer.
function mascot(mood = 'happy', cls = '') {
  const eyes = mood === 'happy' || mood === 'wave'
    ? '<path d="M38 50q5-6 10 0M62 50q5-6 10 0" stroke="#1d1d1f" stroke-width="4" fill="none" stroke-linecap="round"/>'
    : '<circle cx="43" cy="49" r="5.5" fill="#1d1d1f"/><circle cx="67" cy="49" r="5.5" fill="#1d1d1f"/><circle cx="45" cy="47" r="1.8" fill="#fff"/><circle cx="69" cy="47" r="1.8" fill="#fff"/>';
  const mouth = mood === 'oops'
    ? '<ellipse cx="55" cy="66" rx="5" ry="6" fill="#7f1d1d"/>'
    : mood === 'cheer'
      ? '<path d="M41 61q14 16 28 0z" fill="#7f1d1d"/><path d="M47 66q8 5 16 0" stroke="#f87171" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<path d="M43 62q12 11 24 0" stroke="#1d1d1f" stroke-width="4" fill="none" stroke-linecap="round"/>';
  const extra = mood === 'wave'
    ? '<path class="m-arm" d="M92 52q14-6 12-22" stroke="currentColor" stroke-width="9" fill="none" stroke-linecap="round"/>'
    : mood === 'oops'
    ? '<path d="M84 30q5 8 0 11q-5-3 0-11z" fill="#60a5fa"/>'
    : mood === 'cheer'
      ? '<path d="M20 50q-12-10-8-24" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M90 50q12-10 8-24" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M8 18l4 6M18 10l1 7M102 18l-4 6M92 10l-1 7" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>'
      : '';
  return `<svg class="mascot ${cls}" viewBox="0 0 110 100" aria-hidden="true" style="color:var(--accent)">
    ${extra}
    <path d="M55 12c24 0 40 14 40 34s-16 34-40 34c-5 0-10-1-14-2l-14 10 3-15C19 66 15 57 15 46c0-20 16-34 40-34z" fill="currentColor" stroke="color-mix(in srgb, currentColor 60%, #000)" stroke-width="4"/>
    <ellipse cx="45" cy="30" rx="12" ry="5" fill="#fff" opacity=".35"/>
    <circle cx="33" cy="60" r="6" fill="#fb7185" opacity=".55"/><circle cx="77" cy="60" r="6" fill="#fb7185" opacity=".55"/>
    <circle cx="55" cy="50" r="27" fill="#fff" opacity=".0"/>
    ${eyes}${mouth}
  </svg>`;
}

// The mascot with a speech bubble: prompts in sessions read as the mascot talking to you.
const promptHead = (text, cls = '') => `<div class="say prompt-say ${cls}">${mascot('happy', 'say-m')}${text ? `<span class="fc-label say-b">${text}</span>` : ''}</div>`;

const PRAISE = ['Nice!', 'Spot on!', 'Exactly!', 'Great!', 'Yes!'];
// The panel that slides up after every graded answer: same place, same Continue, every time.
function feedbackSheet(ok, { sub = '', action }) {
  const s = session;
  const combo = ok && s?.combo >= 2 ? `<span class="fb-combo">🔥 ${s.combo} in a row</span>` : '';
  const title = ok ? PRAISE[(s?.i || 0) % PRAISE.length] : 'Not quite';
  document.body.classList.add('has-fb');
  return `<div class="fb ${ok ? 'ok' : 'no'}" role="status">
      <div class="fb-head">${mascot(ok ? 'happy' : 'oops', 'fb-mascot')}<b>${title}</b>${combo}</div>
      ${sub ? `<p class="fb-sub">${sub}</p>` : ''}
      <button class="cta fb-go" data-action="${action}">Continue</button>
    </div>`;
}
const missSub = (kind) => (kind === 'check' ? 'It comes back in a minute.' : 'It comes back in a minute, and tomorrow. That’s how it sticks.');

// Score the answer for the session's tally and combo (the 'again' repeats don't count).
function scoreAnswer(got) {
  const s = session;
  const st = s.steps[s.i];
  if (!st || st.kind === 'again' || st.scored) return;
  st.scored = true;
  s.answered = (s.answered || 0) + 1;
  if (got && !s.missed.has(st.p.key)) {
    s.right = (s.right || 0) + 1;
    s.combo = (s.combo || 0) + 1;
    s.bestCombo = Math.max(s.bestCombo || 0, s.combo);
    if ([3, 5, 10, 15].includes(s.combo)) { sfx.combo(); toast(`🔥 ${s.combo} in a row`, 1800); }
  } else s.combo = 0;
}

// Personal bests per language (no accounts, so no leaderboard): stored with your progress.
function scoresFor(code) { return (store.prefs().scores || {})[code] || {}; }
function recordSession(s) {
  const code = L.lang.code;
  const prev = scoresFor(code);
  const ms = Date.now() - s.at;
  const perfect = s.answered >= 5 && s.right === s.answered;
  const pb = [];
  if ((s.bestCombo || 0) > (prev.bestCombo || 0) && s.bestCombo >= 3) pb.push('longest combo');
  if ((s.right || 0) > (prev.bestRight || 0) && s.right >= 3) pb.push('most right in one session');
  if (perfect && (!prev.fastestPerfect || ms < prev.fastestPerfect)) pb.push('fastest perfect session');
  const today = todayIso();
  const next = {
    sessions: (prev.sessions || 0) + 1,
    totalRight: (prev.totalRight || 0) + (s.right || 0),
    bestCombo: Math.max(prev.bestCombo || 0, s.bestCombo || 0),
    bestRight: Math.max(prev.bestRight || 0, s.right || 0),
    fastestPerfect: perfect ? Math.min(prev.fastestPerfect || Infinity, ms) : prev.fastestPerfect || null,
    days: { ...(prev.days || {}), [today]: true },
    race: prev.race || null,
  };
  store.setPref('scores', { ...(store.prefs().scores || {}), [code]: next });
  const hist = (store.prefs().history || {})[code] || [];
  const entry = { d: today, at: Date.now(), right: s.right || 0, answered: s.answered || 0, ms, combo: s.bestCombo || 0, newly: s.newly || 0, locked: s.newlyLocked || 0 };
  store.setPref('history', { ...(store.prefs().history || {}), [code]: [...hist, entry].slice(-120) });
  return { ms, perfect, pb: prev.sessions ? pb : [] }; // no "personal best" fanfare on the very first session
}
const fmtTime = (ms) => { const t = Math.round(ms / 1000); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };

// How a recall step asks for its phrase. Reviews get harder as the phrase gets stronger (js/plan.js);
// the quick check of brand-new phrases is always "say it".
function askFor(st) {
  const canBuild = canBuildPhrase(st.p.target, !!L.lang.meta.no_spaces);
  if (st.kind === 'check') {
    // Right after learning, graded: alternate Build and Write; single words (nothing to build) are written.
    const canType = st.p.type !== 'pattern';
    const nth = session.steps.slice(0, session.i).filter((x) => x.kind === 'check').length;
    if (!canBuild) return canType ? 'type' : 'say';
    return canType && nth % 2 === 1 ? 'type' : 'build';
  }
  if (st.kind !== 'review' && st.kind !== 'practice') return 'say';
  const r = store.get().srs[st.p.key];
  const fits = canSpeak() ? L.replies.filter((x) => x.answer_with.includes(st.p.id)) : [];
  if (fits.length) st.reply = fits[Math.floor(Math.random() * fits.length)];
  const mode = reviewMode({ box: r?.box || 1, keep: !!r?.keep, stage: r?.stage || 0, hasReply: !!fits.length, canType: st.p.type !== 'pattern', canBuild });
  if (mode === 'recognize') st.options = recognizeOptions(st.p);
  return mode;
}

// Recognize: the right meaning and two others, preferring phrases from the same category.
function recognizeOptions(p) {
  const pool = L.phrases.filter((x) => !x.missing && x.id !== p.id && x.english !== p.english);
  const near = shuffle(pool.filter((x) => x.category === p.category));
  const wrong = [...near, ...shuffle(pool)].filter((x, i, a) => a.findIndex((y) => y.english === x.english) === i).slice(0, 2);
  return shuffle([{ text: p.english, ok: true }, ...wrong.map((x) => ({ text: x.english, ok: false }))]);
}

// The ladder under a review: where this phrase is (Recognize · Say · Write · Answer).
const RUNG = { recognize: 'Recognize', build: 'Build', say: 'Say', type: 'Write', answer: 'Answer' };
function ladderHtml(ask) {
  if (!ask) return '';
  return `<span class="ladder" aria-label="Level: ${RUNG[ask]}">${LADDER.map((r) => `<span class="${r === ask ? 'on' : ''}">${RUNG[r]}</span>`).join('')}</span>`;
}

// What each rating does, said on the button, so Not yet reads as "keep it coming", not "fail".
function ratingButtons(st, p, { weak = false } = {}) {
  const prev = store.get().srs[p.key] ? store.previewPass(p.key) : null;
  const gotSub = st.kind === 'check' ? 'Starts reviews: back tomorrow'
    : st.kind === 'again' ? 'Done for this session'
      : prev?.keep ? `Next check ${fmtGap(prev.inMs)}` : prev?.locked ? 'Locked in' : prev ? `Next check ${fmtGap(prev.inMs)}` : 'Back later';
  const againSub = st.kind === 'again' || st.kind === 'check' ? 'Again in a minute' : 'Again in a minute, and tomorrow';
  return `<div class="fc-actions rate">
      <button class="fc-btn ${weak ? 'got' : 'again'}" data-action="ss-again"><b>Not yet</b><small>${againSub}</small></button>
      <button class="fc-btn ${weak ? 'again' : 'got'}" data-action="ss-got"><b>Got it</b><small>${gotSub}</small></button>
    </div>
    <p class="fine center">Not sure? Choose Not yet. It isn't failing: seeing it again soon is how it sticks.</p>`;
}

// After a tap moves the session on: play what the new step needs.
function sessionAutoplay() {
  const st = session?.steps[session.i];
  if (!st || !canSpeak()) return;
  if (st.kind === 'new') plListen();
  else if (st.kind === 'listen') speakPhrase(st.p.id);
  else if (st.ask === 'answer' && st.reply) speakPhrase(st.reply.id); // they speak first
  else if (st.ask === 'recognize') speakPhrase(st.p.id);
}

function sessionAdvance() {
  document.body.classList.remove('has-fb');
  if (session.steps[session.i]?.kind === 'new' && !store.prefs().readHint) store.setPref('readHint', true);
  capture?.stop();
  tts.stop();
  stopPlayerAudio();
  pl = null;
  session.i++;
  session.picked = null;
  drawSession();
  window.scrollTo(0, 0);
  sessionAutoplay();
}

// Got it / Not yet on a recall step.
function sessionRate(got) {
  const s = session;
  const st = s.steps[s.i];
  const p = st.p;
  if (!st.graded) { scoreAnswer(got); if (got) sfx.right(); else sfx.tap(); } // self-rated: Not yet is honest, never punished
  if (st.kind === 'review' || (st.kind === 'practice' && store.isDue(p.key))) {
    if (store.get().srs[p.key]) {
      const wasLocked = store.status(p.key) === 'locked';
      const r = store.review(p.key, got);
      if (r?.locked && !wasLocked) s.newlyLocked++;
    }
  } else if (st.kind === 'check' && got && !s.missed.has(p.key) && !store.isLearned(p.key)) {
    store.setLearned(p.key, true, 'session');
    s.newly++;
  }
  if (st.kind !== 'again') {
    if (got && !s.missed.has(p.key)) s.results[p.key] = 'got';
    if (!got) { s.missed.add(p.key); s.results[p.key] = 'again'; requeue(s.steps, s.i, st); }
  }
  sessionAdvance();
}

/* ---------- flight prep: Core crash course, rescue kit, cheat sheet ---------- */

function viewFlight() {
  const lang = L.lang;
  const code = lang.code;
  const core = L.phrases.filter((p) => p.priority === 'core' && !p.missing);
  const learned = core.filter((p) => store.isLearned(p.key)).length;
  const lockedN = core.filter((p) => store.status(p.key) === 'locked').length;
  const left = core.length - learned;
  const pct = core.length ? Math.round((learned / core.length) * 100) : 0;
  const trip = store.trip(code);
  const rescue = (C.flight?.rescue || []).map((id) => L.byId.get(id)).filter((p) => p && !p.missing);
  page('home', `
    <section class="page-head flight-head">
      <span class="flight-ic">${icon('plane')}</span>
      <div><h1>Flying soon?</h1><p>The fastest way to be ready for ${esc(lang.name)}: the ${core.length} Core phrases, a rescue kit, and a cheat sheet for the trip.</p></div>
    </section>

    <section class="next-step">
      <p class="ns-k">1 · Crash course</p>
      <h2>${left ? `${left} Core phrase${left === 1 ? '' : 's'} to go` : 'Every Core phrase is Learning or Locked in ✓'}</h2>
      <div class="bar" aria-label="${learned} of ${core.length} Learning or Locked in"><span style="width:${pct}%"></span></div>
      <p class="ns-sub">${learned - lockedN} learning · ${lockedN} locked in</p>
      <p class="ns-sub">${left
        ? `About ${Math.max(5, Math.round(left * 1.2))} minutes in rounds of 5: listen, say it, quick check. Works whatever level you have selected.`
        : 'Run a quick review before you land to keep them fresh.'}</p>
      <a class="cta" href="#/${code}/session${left ? '?mode=flight' : ''}">${icon('play')} ${left ? (learned ? 'Continue the crash course' : 'Start the crash course') : 'Quick review'}</a>
    </section>

    ${section('Trip date', `<div class="group pad trip">
      <label class="trip-row"><span>When do you fly?</span><input type="date" id="trip-date" min="${todayIso()}" value="${esc(trip || '')}"></label>
      <p class="heard">${tripProjection(core, trip)}</p>
      ${trip ? '<button class="link-btn" data-action="trip-clear">Clear the trip date</button>' : ''}
    </div>`)}

    ${rescue.length ? section('2 · Rescue kit', `<p class="sect-lead">If you remember nothing else, remember these. They get you out of almost any jam.</p>
      <div class="group mini-list">${rescue.map((p) => miniPhrase(p)).join('')}</div>`) : ''}

    ${section(`${rescue.length ? 3 : 2} · Cheat sheet`, `<div class="group">
      ${row({ href: `#/${code}/cheatsheet`, ic: 'list', title: 'Open the cheat sheet', sub: `All ${core.length} Core phrases on one screen. Works offline; screenshot or print it.` })}
    </div>`)}
  `, { back: `#/${code}` });
}

// How many Core phrases can be Locked in before the flight, if every review is passed on time.
function tripProjection(core, trip) {
  if (!trip) return 'Set it and the checks speed up so your Core phrases can be Locked in before you fly. Each language has its own trip date.';
  const code = L.lang.code;
  const d = daysUntil(trip);
  const gaps = store.gaps(code);
  const departs = d <= 0 ? endOfToday() : parseDate(trip); // flying today: count up to tonight
  const now = Date.now();
  let locked = 0; let onTrack = 0; let startable = 0; let notStarted = 0;
  for (const p of core) {
    const st = store.status(p.key);
    if (st === 'locked') { locked++; continue; }
    if (st === 'learning') {
      const r = store.get().srs[p.key];
      if (lockTime(r.box, Math.max(r.due, now), gaps) < departs) onTrack++;
      continue;
    }
    notStarted++;
    if (lockTime(1, now + gapFor(1, gaps), gaps) < departs) startable++;
  }
  const when = d === 0 ? 'You fly today' : d === 1 ? 'You fly tomorrow' : `${d} days to go`;
  const pace = d <= 1 ? ' Checks now come back within hours.' : '';
  return `${when}.${pace} ${locked} Core phrase${locked === 1 ? ' is' : 's are'} Locked in; passing every check on time, <b>${locked + onTrack} will be by the time you fly</b>${startable ? `, or ${locked + onTrack + startable} if you start the other ${notStarted} today` : notStarted ? `. The other ${notStarted} can’t be Locked in before then, but starting them still helps` : ''}.`;
}

function viewCheatsheet(query) {
  const lang = L.lang;
  const code = lang.code;
  const whole = query.get('all') === '1';
  const items = L.phrases.filter((p) => !p.missing && (whole ? inTier(p) : p.priority === 'core'));
  const groups = C.categories
    .map((c) => ({ c, items: items.filter((p) => p.category === c.id) }))
    .filter((g) => g.items.length);
  page('home', `
    <section class="page-head cs-head">
      <h1>Cheat sheet</h1>
      <p>${esc(lang.name)} · ${whole ? 'All phrases' : 'Core'} · ${items.length} phrases</p>
      <div class="cs-actions">
        <a class="pill-btn" href="#/${code}/cheatsheet${whole ? '' : '?all=1'}">${whole ? 'Core only' : 'All phrases'}</a>
        <button class="pill-btn" data-action="print">${icon('printer')}<span>Print</span></button>
      </div>
    </section>
    ${groups.map((g) => `<section class="cs-group">
      <h2>${g.c.icon} ${esc(g.c.label)}</h2>
      ${g.items.map((p) => `<div class="cs-row" data-key="${esc(p.key)}">
        <div class="cs-text">
          <b class="cs-native" ${nativeAttrs(lang)}>${withSlots(p.target)}</b>
          ${p.reading && p.reading !== p.target ? `<span class="kana sm" ${nativeAttrs(lang)}>${withSlots(p.reading)}</span>` : ''}
          <span class="cs-pron">${withSlots(p.pron)}</span>
          <span class="cs-en">${withSlots(p.english)}</span>
          ${store.status(p.key) ? `<span class="status-tag ${store.status(p.key)}">${statusLabel(store.status(p.key))}</span>` : ''}
        </div>
        ${listenBtn(p, 'small')}
      </div>`).join('')}
    </section>`).join('')}
    <p class="fine cs-foot">Wayword · ${esc(lang.name)} · finding your way with words</p>
  `, { back: `#/${code}/more` });
}

// Under a flipped review card: what passing it will do.
function lockHint(p) {
  if (!store.status(p.key) || session?.missed.has(p.key)) return '';
  const r = store.previewPass(p.key);
  if (!r) return '';
  if (r.keep) return `<p class="lock-hint">${icon('lock', 'inline-ic')} Locked in · Got it → next check ${fmtGap(r.inMs)}</p>`;
  return `<p class="lock-hint">${icon('lock', 'inline-ic')} Got it → ${r.locked ? '<b>Locked in</b>' : `next check ${fmtGap(r.inMs)}`}</p>`;
}

function fmtGap(ms) {
  if (ms < DAY) { const h = Math.round(ms / 3600000); return h >= 1 ? `in ${h} hour${h === 1 ? '' : 's'}` : `in ${Math.round(ms / 60000)} minutes`; }
  const d = Math.round(ms / DAY);
  return d === 1 ? 'tomorrow' : `in ${d} days`;
}

/* ---------- first-time guide and help ---------- */

function helpHtml(first) {
  const code = L.lang.code;
  const hello = L.byId.get('hello');
  const sample = hello && !hello.missing ? `<div class="help-sample">
      <div class="hs-line"><span class="hs-k">As written</span><span class="native sm" ${nativeAttrs(L.lang)}>${esc(hello.target)}</span></div>
      ${hello.reading && hello.reading !== hello.target ? `<div class="hs-line"><span class="hs-k">Reading</span><span class="kana sm" ${nativeAttrs(L.lang)}>${esc(hello.reading)}</span></div>` : ''}
      <div class="hs-line"><span class="hs-k">Say it like</span><span class="pron sm">${esc(hello.pron)}</span></div>
      <div class="hs-line"><span class="hs-k">Meaning</span><span class="en sm">${esc(hello.english)}</span></div>
    </div>` : '';
  const items = [
    ['Read each phrase top to bottom', `How it’s written, then how to say it, then what it means.${hello && /[A-Z]{2}/.test(hello.pron || '') ? ' Capitals in the pronunciation show the stressed part.' : ''}${sample}`],
    ['Tap Continue', 'Each session is a few minutes: phrases due for review first, then a few new ones. You hear each new phrase, say it, and the app plays the native voice, then you, then the native voice again so you can compare.'],
    ['Say it before you hear it', 'A phrase you’ve met before starts with the English. Say it, then hear the right version. <b>Got it</b> means you knew it before you heard it. It comes back after 1, 3, 7 and 14 days, then it’s <b>Locked in</b>. Set a trip date (More → Flying soon?) and the reviews speed up to fit.'],
    ['Get ready for situations', 'Café, hotel, getting around… Today shows how ready you are for each. Pick one under “Working on”, or tap a situation to see its phrases right away.'],
    ['Test yourself', '<b>EN</b> hides the English and <b>Aa</b> hides the pronunciation. Tap a blurred line to peek.'],
  ];
  return `<div class="sheet-head"><h2>${first ? 'Welcome to Wayword' : 'How Wayword works'}</h2><button class="icon-btn quiet" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>
    ${first ? `<p class="help-lead">A quick tour before you start ${esc(L.lang.name)}. You can reopen it any time with the ${icon('help', 'inline-ic')} button.</p>` : ''}
    <ol class="help">${items.map(([t, d], i) => `<li><span class="step-n">${i + 1}</span><div><b class="help-t">${t}</b><p>${d}</p></div></li>`).join('')}</ol>
    ${first
      ? `<button class="cta" data-action="start-session">${icon('play')} Start my first phrases</button><button class="link-btn center" data-action="close-sheet">Look around first</button>`
      : `<button class="cta" data-action="close-sheet">Got it</button>`}`;
}

/* ---------- speaking: record, transcribe, compare ---------- */

let capture = null;

// What you said vs the phrase: each word marked heard / nearly / not heard,
// plus buttons to hear the correct audio, your take, or both back to back.
// One take at a time. The mic button shows a live level ring while you speak.
function startCapture(onUpdate, onDone, onReady) {
  tts.stop();
  const lang = L.lang;
  capture = mic.capture({
    asrLang: lang.meta.asr || lang.meta.bcp47,
    onReady,
    onInterim: (text) => onUpdate(text),
    onLevel: (lvl) => document.querySelectorAll('.mic-big.rec').forEach((b) => b.style.setProperty('--lvl', lvl.toFixed(3))),
  });
  capture.done.then((take) => {
    capture = null;
    if (take.url || take.transcript) store.setPref('micPrimed', true);
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
  let called = false;
  const next = () => { if (!called) { called = true; after?.(); } };
  takeAudio.onended = next;
  takeAudio.onerror = next;
  takeAudio.play().catch(() => { toast('Couldn’t play your recording. Check the volume.'); next(); });
}

// While the mic is opening: "Wait…". Once it's live: "Speak now".
const micState = (rec, finishing, interim, idleText, live = true) => rec
  ? (finishing ? 'Finishing…' : interim ? `<bdi ${nativeAttrs(L.lang)}>${esc(interim)}</bdi>` : live ? '<b class="speak-now">Speak now</b> · stops when you pause' : 'Wait… opening the mic')
  : idleText;

// Before the first recording: what the permission prompt is for, and where audio goes.
function micPrimer() {
  if (store.prefs().micPrimed) return '';
  return `<p class="primer step-body full">Your phone will ask to use the microphone. Tap <b>Allow</b>. Recordings stay on this device; the word check uses your phone’s own speech recognition.</p>`;
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
  page('more', `
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
    `Voice: ${tts.voiceLabel(langCtx()) || 'none'}`,
    `Current setting: ${mic.micMode()}`,
  ];
  for (const t of TESTS) {
    const r = mc.runs[t.mode];
    if (!r) { lines.push(`${t.title}: not run`); continue; }
    lines.push(`${t.title}: recording=${r.url ? `${(r.ms / 1000).toFixed(1)}s ${r.mime}` : 'none'} recError=${r.recError || '-'} peak=${Math.round(r.peak * 100)}% words="${r.transcript}" srError=${r.srError || '-'}`);
  }
  return lines.join('\n');
}

/* ---------- the phrase player: one way to meet a phrase, everywhere ---------- */
// Used by Learn sessions and the "Say it" sheet. Steps: listen → say → compare.
// One big button follows the step. The phrase plays by itself when it appears (after a tap),
// and after you record it plays native → you → native with one thing to listen for.

let pl = null; // { p, where: 'session' | 'sheet', mode: 'learn' | 'recall', step, rec, finishing, interim, take, guide }

// learn: listen → say → compare. recall (a phrase you've met): prompt → reveal (hear it, compare, rate).
function mountPlayer(p, where, mode = 'learn') {
  const step = mode === 'recall' ? 'prompt' : canSpeak() ? 'listen' : canPracticeAloud() ? 'say' : 'done';
  pl = { p, where, mode, step, rec: false, finishing: false, interim: '', take: null, guide: null };
  return pl;
}

// Only call from a tap: phones block audio that starts on its own.
function plListen() {
  if (pl && canSpeak()) speakPhrase((pl.view || pl.p).id);
}

function stopPlayerAudio() {
  takeAudio?.pause();
  if (pl) pl.guide = null;
}

// "Listen for": the phrase's "How it's said" tip, or the Sound guide entry it's an example of.
function listenFor(p) {
  if (p.say_tip) return esc(p.say_tip);
  const c = p.sound_cue;
  if (!c) return '';
  return c.mark
    ? `<b ${nativeAttrs(L.lang)}>${esc(c.mark)}</b> here sounds like <b>${esc(c.spelled)}</b> (${esc(c.name.toLowerCase())}).`
    : `the <b>${esc(c.spelled)}</b> sound (${esc(c.name)}).`;
}

// Recall, before the answer: the English only. Say it (or just think it), then reveal.
function promptInner() {
  const { p, ask, reply } = pl;
  const lang = L.lang;
  const failed = pl.take && !pl.take.url && !pl.take.transcript;
  if (ask === 'build') {
    // Build it: tap the words in order; tap a placed word to take it back.
    if (!pl.build) {
      const others = shuffle(L.phrases.filter((x) => !x.missing && x.id !== p.id)).slice(0, 12).map((x) => x.target);
      pl.build = { tiles: buildTiles(p.target, { decoyFrom: others }), picked: [] };
    }
    const { tiles, picked } = pl.build;
    const byId = new Map(tiles.map((t) => [t.id, t]));
    const hasDecoy = tiles.some((t) => t.decoy);
    return `<article class="pp-phrase pp-prompt">${promptHead(`Build it in ${esc(lang.name)}`)}<p class="fc-en">${withSlots(p.english)}</p>
        <div class="bd-answer ${picked.length ? '' : 'empty'}" ${nativeAttrs(lang)} aria-label="Your sentence">${picked.length
          ? picked.map((id, i) => `<button class="bd-tile placed" data-action="bd-unpick" data-i="${i}">${esc(byId.get(id).text)}</button>`).join('')
          : '<span class="bd-placeholder">Tap the words in order</span>'}</div>
        <div class="bd-bank" ${nativeAttrs(lang)}>${tiles.map((t) => `<button class="bd-tile" data-action="bd-pick" data-id="${t.id}" ${picked.includes(t.id) ? 'disabled' : ''}>${esc(t.text)}</button>`).join('')}</div>
        ${hasDecoy ? '<p class="fine center">One word doesn’t belong.</p>' : ''}
      </article>
      <button class="cta pp-next" data-action="bd-check" ${picked.length ? '' : 'disabled'}>Check</button>
      <button class="more-btn pp-next" data-action="pp-reveal">Show me</button>`;
  }
  if (ask === 'type') {
    return `<article class="pp-phrase pp-prompt">${promptHead(`Type it in ${esc(lang.name)}`)}<p class="fc-en">${withSlots(p.english)}</p>
        <form class="type-form" data-pp-type>
          <input class="type-input" id="pp-type-input" ${nativeAttrs(lang)} autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" enterkeyhint="done" placeholder="Type it here">
          <button class="cta" type="submit">Check</button>
        </form>${typeHint(p)}
      </article>
      <p class="fine center">Writing it out from memory is the strongest practice there is. Accents count.</p>
      <button class="more-btn pp-next" data-action="pp-reveal">Show me</button>
      ${canPracticeAloud() ? '<button class="link-btn center" data-action="pp-ask-say">No keyboard for this? Say it instead</button>' : ''}`;
  }
  const idle = failed ? esc(mic.explain(pl.take) || 'Nothing came through. Try again.') : ask === 'answer' ? 'Answer out loud, then hear the right version' : 'Say it out loud, then hear the right version';
  const head = ask === 'answer' && reply
    ? `<span class="fc-label">They say</span>
       <div class="reply-row">${canSpeak() ? `<button class="round-btn lk-play listen" data-action="speak" data-id="${esc(reply.id)}" data-key="${esc(reply.key)}" data-state="idle" aria-label="Play">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button>` : ''}
         <div><b class="reply-native" ${nativeAttrs(lang)}>${withSlots(reply.target)}</b><small data-peek="en">${withSlots(reply.english)}</small></div></div>
       <span class="fc-label">Answer: say this in ${esc(lang.name)}</span><p class="fc-en">${withSlots(p.english)}</p>`
    : `<span class="fc-label">How do you say this in ${esc(lang.name)}?</span><p class="fc-en">${withSlots(p.english)}</p>`;
  return `<article class="pp-phrase pp-prompt">${promptHead('', 'mini')}${head}</article>
    ${canPracticeAloud() ? `<div class="pp-stage">
      <button class="mic-big pp-big ${pl.rec ? (pl.live ? 'rec' : 'rec warming') : ''} ${pl.finishing ? 'finishing' : ''}" data-action="pp-mic" aria-label="${pl.rec ? 'Stop' : 'Start speaking'}">${icon(pl.rec ? 'stop' : 'mic')}</button>
      <span class="pp-hint">${micState(pl.rec, pl.finishing, pl.interim, idle, pl.live)}</span>
      ${failed ? `<a class="link-btn" href="#/${lang.code}/mic">Run the Mic check ${icon('chev')}</a>` : ''}
      ${pl.rec ? '' : micPrimer()}
    </div>` : ''}
    <button class="${canPracticeAloud() ? 'more-btn' : 'cta'} pp-next" data-action="pp-reveal">${canPracticeAloud() ? 'Show me without speaking' : 'Show me'}</button>`;
}

// A graded answer (build, type): score it and play its sound once.
function gradeStep(ok) {
  const st = session?.steps[session.i];
  if (!st) return;
  st.graded = true;
  scoreAnswer(ok);
  if (ok) sfx.right(); else sfx.wrong();
}

// Build it: graded like typing. Right order = Got it; anything else comes back sooner.
function plBuildCheck(reveal = false) {
  if (!pl?.build) return;
  const p = pl.p;
  const byId = new Map(pl.build.tiles.map((t) => [t.id, t]));
  const words = pl.build.picked.map((id) => byId.get(id).text);
  const ok = !reveal && buildIsRight(p.target, words);
  pl.typed = reveal ? '' : words.join(L.lang.meta.no_spaces ? '' : ' ');
  pl.built = true;
  pl.check = reveal ? { verdict: 'revealed', notes: [] } : ok ? { verdict: 'correct', notes: [] } : { verdict: 'wrong', notes: [{ text: 'Compare the word order with the right version above.' }] };
  gradeStep(ok);
  pl.step = 'reveal';
  drawPlayer();
  plListen(); // hear the right version straight away
}

// Type it, inside a review: checked letter by letter; only a correct answer counts as Got it.
function plType(reveal = false) {
  if (!pl) return;
  const p = pl.p;
  const typed = reveal ? '' : (document.getElementById('pp-type-input')?.value || '').trim();
  if (!reveal && !typed) { document.getElementById('pp-type-input')?.focus(); return; }
  pl.typed = typed;
  pl.check = reveal ? { verdict: 'revealed', notes: [] } : L.lang.meta.no_spaces ? checkTypedChars(p.target, typed, p.reading) : checkTyped(p.target, typed);
  gradeStep(['correct', 'marks'].includes(pl.check.verdict));
  pl.step = 'reveal';
  drawPlayer();
  plListen(); // hear the right version straight away
}

function playerInner() {
  if (pl.mode === 'recall' && pl.step === 'prompt') return promptInner();
  const { where, step } = pl;
  const frame = pl.p;
  const p = pl.view || pl.p; // Swap it: everything below shows, plays and compares the picked variant
  const cue = listenFor(p);
  const hl = !p.say_tip && p.sound_cue?.mark ? markText(p.target, p.sound_cue.mark, p.sound_cue.hl) : undefined;
  const notes = [p.usage_note, p.regional_note].filter(Boolean).map((t) => `<p class="note">${esc(t)}</p>`).join('');
  const failed = pl.take && !pl.take.url && !pl.take.transcript;

  let stage;
  if (step === 'listen') {
    stage = `<button class="mic-big listen pp-big" data-action="speak" data-id="${esc(p.id)}" data-key="${esc(p.key)}" data-state="idle" aria-label="Listen">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button>
      <span class="pp-hint">Listen and follow the pronunciation line</span>`;
  } else if (step === 'say' || (step === 'compare' && where === 'sheet') || pl.rec) {
    const idle = failed ? esc(mic.explain(pl.take) || 'Nothing came through. Try again.') : step === 'compare' ? 'Tap to try again' : pl.echo ? 'Say it back, the way you heard it' : 'Your turn: tap, then say it';
    stage = `<button class="mic-big pp-big ${pl.rec ? (pl.live ? 'rec' : 'rec warming') : ''} ${pl.finishing ? 'finishing' : ''}" data-action="pp-mic" aria-label="${pl.rec ? 'Stop' : 'Start speaking'}">${icon(pl.rec ? 'stop' : 'mic')}</button>
      <span class="pp-hint">${micState(pl.rec, pl.finishing, pl.interim, idle, pl.live)}</span>
      ${failed ? `<a class="link-btn" href="#/${L.lang.code}/mic">Run the Mic check ${icon('chev')}</a>` : ''}
      ${step === 'say' && !pl.rec ? micPrimer() : ''}`;
  } else stage = '';

  const compare = (step === 'compare' || step === 'reveal') && pl.take ? compareHtml() : '';
  const small = [
    step !== 'listen' && canSpeak() ? `<button class="pill-btn" data-action="hear-native" data-id="${esc(p.id)}">${icon('play')}<span>Hear it</span></button>` : '',
    canSpeak() ? `<button class="pill-btn speed-pill" data-action="speed-cycle" aria-label="Speed">${tts.speed().label}</button>` : '',
    step === 'listen' && canPracticeAloud() ? `<button class="pill-btn" data-action="pp-to-say">${icon('mic')}<span>Say it</span></button>` : '',
  ].join('');
  const ready = step === 'compare' || step === 'done';
  const upNext = session?.steps[session.i + 1]?.kind;
  let next = '';
  if (where === 'session' && step === 'reveal' && pl.check) {
    // Typed: the checker decides. Exactly right (accents may be off) counts; anything else comes back sooner.
    const ok = ['correct', 'marks'].includes(pl.check.verdict);
    const kind = session?.steps[session.i]?.kind;
    next = `${typeResult({ check: pl.check, typed: pl.typed, built: pl.built })}
      ${feedbackSheet(ok, { sub: ok ? (pl.check.verdict === 'marks' ? 'Right words. Check the accents above.' : '') : missSub(kind), action: ok ? 'ss-got' : 'ss-again' })}`;
  } else if (where === 'session' && step === 'reveal') {
    // Said: you judge, but if the phone's speech check heard little of it, Not yet is the honest default.
    const score = pl.take?.transcript ? mic.compare(p.target, pl.take.transcript, { charMode: !!L.lang.meta.no_spaces, alt: p.reading }).score : null;
    const weak = score != null && score < 0.5;
    next = `${pl.take ? '' : (pl.rec ? '' : `<button class="link-btn center" data-action="pp-mic">${icon('mic')} Say it and compare</button>`)}
      ${weak ? '<p class="honest">Your phone only caught part of it. If you weren’t sure, choose Not yet.</p>' : ''}
      ${ratingButtons(session.steps[session.i], p, { weak })}`;
  } else if (where === 'session') {
    next = `<button class="${ready ? 'cta' : 'more-btn'} pp-next" data-action="ss-next">${upNext === 'check' ? 'Quick check' : upNext ? 'Next' : 'Finish'} ${icon('arrow')}</button>
       ${!ready && canPracticeAloud() ? '<p class="fine">Speaking is optional. Skip it whenever you like.</p>' : ''}`;
  }

  // First phrase ever: how to read the three lines (replaces the old welcome tour).
  const howto = !store.prefs().readHint && pl.mode === 'learn'
    ? `<p class="pp-howto">How to read it: <b>how it’s written</b> · <b class="pron-k">how to say it</b>${/[A-Z]{2}/.test(p.pron || '') ? ' (CAPITALS = stress)' : ''} · <b>what it means</b></p>` : '';
  return `${howto}<article class="pp-phrase">${pl.where === 'session' && pl.mode === 'learn' ? promptHead('New phrase! Say it with me.') : ''}${phraseLines(p, { size: 'lg', nativeHtml: hl })}
      ${p.draft ? `<p class="pp-draft">${draftTag(p)} ${p.native_match ? 'A native speaker wrote this exact sentence (Tatoeba).' : 'Not yet checked by a native speaker.'}</p>` : ''}
      ${cue ? `<p class="pp-cue"><span class="note-k">Listen for</span>${cue} <a class="note-link" href="#/${L.lang.code}/sounds">Sound guide</a></p>` : ''}
      ${notes ? `<div class="notes">${notes}</div>` : ''}
    ${swapChips(frame, pl.view ? pl.view.id : '', 'pp-swap')}</article>
    ${stage ? `<div class="pp-stage">${stage}</div>` : ''}
    ${compare}
    ${small ? `<div class="pp-small">${small}</div>` : ''}
    ${['compare', 'reveal', 'done'].includes(step) ? tryAnotherHtml(frame) : ''}
    ${next}`;
}

// Patterns in context: phrases that share a frame with this one (content/patterns.json).
function relatedPhrases(p) {
  const out = new Set();
  const own = C.patterns[p.id];
  if (own) for (const id of own.related || []) out.add(id);
  for (const [frame, conf] of Object.entries(C.patterns)) if ((conf.related || []).includes(p.id)) { out.add(frame); for (const id of conf.related) out.add(id); }
  out.delete(p.id);
  return [...out].map((id) => L.byId.get(id)).filter((x) => x && !x.missing).slice(0, 3);
}

function tryAnotherHtml(p) {
  if (variantsOf(p).length) return ''; // frames with variants have Swap it chips instead
  const rel = relatedPhrases(p);
  if (!rel.length) return '';
  return `<div class="pp-more"><p class="more-k">${C.patterns[p.id] ? 'Same frame, other uses' : 'Goes with'}</p>
    ${rel.map((r) => `<div class="pp-more-row"><div><b ${nativeAttrs(L.lang)}>${withSlots(r.target)}</b><small>${withSlots(r.english)}</small></div>${listenBtn(r, 'small')}</div>`).join('')}
  </div>`;
}

// After recording: the guided playback, and what the phone's speech check understood.
function compareHtml() {
  const { take, guide } = pl;
  const p = pl.view || pl.p;
  const lang = L.lang;
  let heard = '';
  if (take.transcript) {
    const r = mic.compare(p.target, take.transcript, { charMode: !!lang.meta.no_spaces, alt: p.reading });
    heard = `<p class="heard">Your phone understood (a word check, not a pronunciation score):</p>
      <p class="heard-words sm" ${nativeAttrs(lang)}>${r.words.map((w) => `<span class="w-${w.status}">${withSlots(w.raw)}</span>`).join(lang.meta.no_spaces ? '' : ' ')}</p>
      ${lang.code === 'ar-levantine' ? '<p class="heard">Phone speech recognition writes formal Arabic, so dialect words may look different even when you said them right.</p>' : ''}`;
  }
  const seq = take.url && canSpeak()
    ? `<div class="pp-seq" aria-live="polite">${[['n1', 'Native'], ['me', 'You'], ['n2', 'Native']].map(([id, label]) => `<span class="${guide === id ? 'on' : ''}">${label}</span>`).join(icon('chev'))}</div>`
    : '';
  const secs = take.ms ? ` · ${(take.ms / 1000).toFixed(1)}s` : '';
  return `<div class="pp-compare">
    ${seq}
    <div class="take-actions">
      ${take.url && canSpeak() ? `<button class="pill-btn" data-action="pp-guide">${icon('loop')}<span>${guide ? 'Playing…' : 'Compare again'}</span></button>` : ''}
      ${take.url ? `<button class="pill-btn" data-action="hear-me">${icon('person')}<span>Hear me${secs}</span></button>` : ''}
      ${pl.where === 'session' ? `<button class="pill-btn" data-action="pp-mic">${icon('mic')}<span>Try again</span></button>` : ''}
    </div>
    ${heard}
  </div>`;
}

function drawPlayer() {
  const el = document.getElementById('pp');
  if (!el || !pl) return;
  el.innerHTML = playerInner();
  syncListen();
  warmMicSoon();
}

// A mic button is on screen and nothing is playing: open the mic now, so the tap records at once.
function warmMicSoon() {
  if (!pl || pl.rec || !document.querySelector('#pp [data-action="pp-mic"]')) return;
  setTimeout(() => {
    const st = tts.getState().status;
    if (pl && !pl.rec && st !== 'playing' && document.querySelector('#pp [data-action="pp-mic"]')) mic.prewarm();
  }, 400);
}

// native → you → native, highlighting each part as it plays.
function plGuide() {
  if (!pl?.take?.url) return;
  const run = pl;
  const live = () => pl === run;
  const mark = (g) => { if (live()) { pl.guide = g; drawPlayer(); } };
  const pause = (fn) => setTimeout(() => { if (live() && pl.guide) fn(); }, 350);
  const meThenNative = () => {
    mark('me');
    playTake(run.take.url, () => pause(() => {
      if (!canSpeak()) { mark(null); return; }
      mark('n2');
      tts.play(speechItem(run.view || run.p)); // plSync clears the highlight when it ends
    }));
  };
  tts.stop();
  if (!canSpeak()) { meThenNative(); return; }
  mark('n1');
  tts.play(speechItem(run.view || run.p), () => pause(meThenNative));
}

// Audio events move the player along: listening done → your turn; guided playback done → idle.
function plSync() {
  if (!pl) return;
  const st = tts.getState();
  if (st.status !== 'done' || st.item?.key !== (pl.view || pl.p).key) return;
  if (pl.step === 'listen') { pl.step = canPracticeAloud() ? 'say' : 'done'; drawPlayer(); }
  else if (pl.guide === 'n2') { pl.guide = null; drawPlayer(); }
}

function plMic() {
  if (pl.rec) { pl.finishing = true; drawPlayer(); capture?.stop(); return; }
  stopPlayerAudio();
  Object.assign(pl, { rec: true, live: false, finishing: false, interim: '', step: pl.mode === 'recall' ? pl.step : pl.step === 'compare' ? 'compare' : 'say' });
  const run = pl;
  const onReady = () => { if (pl === run && pl.rec) { pl.live = true; drawPlayer(); } };
  startCapture((t) => { if (pl === run) { pl.interim = t; drawPlayer(); } }, (take) => {
    if (pl !== run) return;
    const ok = !!(take.url || take.transcript);
    const after = pl.mode === 'recall' ? (ok || pl.step === 'reveal' ? 'reveal' : 'prompt') : ok ? 'compare' : 'say';
    Object.assign(pl, { rec: false, finishing: false, interim: '', take: ok || pl.mode !== 'recall' || pl.step === 'prompt' ? take : pl.take, step: after });
    drawPlayer();
    if (ok) {
      document.querySelector('.pp-compare')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      if (take.url) plGuide(); else plListen();
    }
  }, onReady);
  drawPlayer();
}

function openSayIt(p, variantId = '') {
  mountPlayer(p, 'sheet');
  if (variantId) pl.view = variantsOf(p).find((v) => v.id === variantId) || null;
  openSheet(`<div class="sheet-head"><h2>Say it</h2><button class="icon-btn quiet" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>
    <div id="pp" class="pp">${playerInner()}</div>`);
  plListen();
}

/* the voice sheet */

let voiceFilter = 'all';

function voiceSheetHtml() {
  const list = tts.voicesFor(langCtx());
  const nat = tts.naturalFor(L.lang.code);
  const saved = (store.prefs().voices || {})[L.lang.code];
  const natPicked = nat && (!saved || saved.startsWith('audio:'));
  const current = natPicked ? null : tts.chosenVoice(langCtx());
  const natVoices = (nat?.voices || []).filter((v) => voiceFilter === 'all' || v.gender === voiceFilter);
  const natRows = nat ? `<p class="voice-k">Natural voices · ${esc(nat.source || 'recorded')}</p>
    <div class="group voice-list">${natVoices.map((v) => {
      const on = natPicked && (saved ? saved === `audio:${v.id}` : v === nat.voices[0]);
      return `<button class="row ${on ? 'picked' : ''}" data-action="pick-voice" data-uri="audio:${esc(v.id)}">
        <span class="row-text"><span class="row-title">${esc(v.name)}</span><span class="row-sub">${esc([v.gender, v.native ? 'recorded by a native speaker' : 'natural voice'].filter(Boolean).join(' · '))}</span></span>
        ${on ? icon('check', 'row-check') : ''}</button>`;
    }).join('') || '<p class="about-row">No natural voice of that type.</p>'}</div>
    ${nat.note ? `<p class="tip">${esc(nat.note)}</p>` : ''}
    <p class="voice-k">This device’s voices</p>` : '';
  const hasGender = list.some((x) => x.gender !== 'unknown') || !!nat;
  const shown = list.filter((x) => voiceFilter === 'all' || x.gender === voiceFilter);
  const tag = (x) => [x.gender !== 'unknown' ? x.gender : '', x.levantine ? 'Levantine' : '', /premium|enhanced|natural|neural/i.test(x.voice.name) ? 'natural' : '', x.voice.lang].filter(Boolean).join(' · ');
  return `<div class="sheet-head"><h2>Voice</h2><button class="icon-btn quiet" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>
    ${hasGender ? `<div class="seg filter">${['all', 'female', 'male'].map((g) =>
      `<button class="seg-btn ${voiceFilter === g ? 'on' : ''}" data-action="voice-filter" data-g="${g}">${g === 'all' ? 'All' : g === 'female' ? 'Female' : 'Male'}</button>`).join('')}</div>` : ''}
    ${natRows}
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
    // Scrolling over the dimmed background scrolls the panel instead of doing nothing.
    el.querySelector('.sheet-backdrop').addEventListener('wheel', (e) => {
      el.querySelector('.sheet-panel').scrollBy({ top: e.deltaY });
      e.preventDefault();
    }, { passive: false });
  }
  el.querySelector('.sheet-panel').innerHTML = html;
  el.classList.add('open');
  document.body.classList.add('sheet-open');
  syncListen();
}

function closeSheet() {
  capture?.stop();
  mic.releaseWarm();
  if (pl?.where === 'sheet') { stopPlayerAudio(); pl = null; }
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
  if (!p || location.hash.includes('/practice/run') || location.hash.endsWith('/mic') || location.hash.includes('/session')) {
    el.className = '';
    el.innerHTML = '';
    document.body.classList.remove('has-player');
    return;
  }
  const playing = st.status === 'playing' || st.status === 'gap';
  const v = voiceText();
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
      <button class="pl-voice" data-action="voice-sheet">${icon('person')}<span>${v ? esc(v.split(' · ')[0]) : 'Voice'}</span></button>
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
    const label = s === 'playing' ? 'Pause' : s === 'paused' ? 'Resume' : 'Listen';
    b.setAttribute('aria-label', label);
    const lbl = b.querySelector('.lbl');
    if (lbl) lbl.textContent = label;
  });
  document.querySelectorAll('[data-action="set-speed"]').forEach((b) => b.classList.toggle('on', b.dataset.speed === tts.speed().id));
}

tts.subscribe(() => { syncListen(); renderPlayer(); plSync(); });
tts.onVoices(() => {
  const vr = document.getElementById('voice-row');
  if (vr && L) {
    const sub = vr.querySelector('.row-sub');
    if (sub) sub.textContent = voiceText() || 'No voice installed';
  }
});

const warned = new Set();
function speakPhrase(id) {
  const p = L.byId.get(id) || L.extraById.get(id);
  if (!p) return;
  const m = L.lang.meta;
  // Shown once per language, ever (it also stays in the Audio section on the language home).
  const seen = store.prefs().ttsWarned || {};
  if (m.tts_warning && !seen[L.lang.code] && !warned.has(L.lang.code)) {
    warned.add(L.lang.code);
    store.setPref('ttsWarned', { ...seen, [L.lang.code]: true });
    toast(m.tts_warning, 9000);
  }
  tts.toggle(speechItem(p));
}

function updateBanner() {
  if (document.getElementById('update-banner')) return;
  const el = document.createElement('div');
  el.id = 'update-banner';
  el.innerHTML = '<span>A new version of Wayword is ready.</span><button class="pill-btn" data-action="do-update">Update</button>';
  document.body.appendChild(el);
}

let toastTimer = null;
function toast(text, ms = 7000) {
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
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

/* ---------- events ---------- */

document.addEventListener('submit', (e) => {
  if (e.target.matches('[data-pp-type]')) { e.preventDefault(); plType(); return; }
  if (!e.target.matches('[data-type-form]')) return;
  e.preventDefault();
  runTypeCheck();
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'type-input' && practice) practice.typed = e.target.value;
});

// Trip date on the Flying soon? page.
document.addEventListener('change', (e) => {
  if (e.target.id !== 'trip-date' || !L) return;
  const v = e.target.value;
  store.setTrip(L.lang.code, v && daysUntil(v) >= 0 ? v : null);
  viewFlight();
});

document.addEventListener('click', (e) => {
  if (Date.now() < noClickUntil) return; // the end of a drag, not a tap
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
  } else if (a === 'speak') {
    speakPhrase(btn.dataset.id);
  } else if (a === 'set-speed') {
    tts.setSpeed(btn.dataset.speed);
    syncListen();
  } else if (a === 'say-it') {
    openSayIt(L.byId.get(btn.dataset.id), btn.dataset.v || '');
  } else if (a === 'pp-mic') {
    if (pl) plMic();
  } else if (a === 'pp-to-say') {
    if (!pl) return;
    tts.stop();
    pl.step = 'say';
    drawPlayer();
  } else if (a === 'pp-guide') {
    if (pl && !pl.guide) plGuide();
  } else if (a === 'speed-cycle') {
    const i = tts.SPEEDS.indexOf(tts.speed());
    tts.setSpeed(tts.SPEEDS[(i + 1) % tts.SPEEDS.length].id);
    btn.textContent = tts.speed().label;
  } else if (a === 'hear-native') {
    takeAudio?.pause();
    if (pl?.guide) { pl.guide = null; drawPlayer(); }
    tts.play(speechItem(L.byId.get(btn.dataset.id)));
  } else if (a === 'hear-me') {
    tts.stop();
    if (pl?.guide) { pl.guide = null; drawPlayer(); }
    playTake(pl?.take?.url || lastTakeUrl);
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
    if (pl?.where === 'sheet') { stopPlayerAudio(); pl = null; }
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
    if (vr) vr.textContent = voiceText() || '';
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
  } else if (a === 'show-it') {
    openShowIt(L.byId.get(btn.dataset.id) || L.extraById.get(btn.dataset.id));
  } else if (a === 'show-close') {
    tts.stop();
    closeShowIt();
  } else if (a === 'save-offline') {
    const sit = C.scenarios.find((x) => x.id === btn.dataset.id);
    if (sit) saveOffline(sitPhrases(sit), btn);
  } else if (a === 'do-update') {
    location.reload();
  } else if (a === 'race-start') {
    race = newRace();
    viewRace();
    speakPhrase(race.rounds[0].ans.id);
  } else if (a === 'race-pick') {
    if (!race || race.picked != null) return;
    const r = race.rounds[race.i];
    race.picked = btn.dataset.v;
    const ok = race.picked === r.ans.id;
    if (ok) { race.right++; sfx.right(); } else sfx.wrong();
    viewRace();
    setTimeout(raceNext, ok ? 650 : 1500);
  } else if (a === 'toggle-sfx') {
    sfx.set(!sfx.enabled());
    sfx.right(); // so you hear what you turned on
    const sub = document.querySelector('#sfx-row .row-sub');
    if (sub) sub.textContent = sfx.enabled() ? 'On: a ding for right, a soft note for not quite' : 'Off';
  } else if (a === 'reminder-sheet') {
    openSheet(reminderSheetHtml());
  } else if (a === 'reminder-ics') {
    reminderIcs();
    toast('Reminder file ready. On iPhone, tap Add to Calendar.');
  } else if (a === 'reminder-google') {
    reminderGoogle();
  } else if (a === 'focus-sheet') {
    openSheet(focusSheetHtml());
  } else if (a === 'pick-focus') {
    setFocus(btn.dataset.id);
    closeSheet();
    route();
  } else if (a === 'practise-sit') {
    setFocus(btn.dataset.id);
    session = null;
    go(`#/${L.lang.code}/session`);
  } else if (a === 'toggle-en') {
    store.setPref('showEnglish', !store.prefs().showEnglish);
    applyTheme(L && L.lang);
    btn.classList.toggle('on', store.prefs().showEnglish);
  } else if (a === 'toggle-pron') {
    store.setPref('showPron', !store.prefs().showPron);
    applyTheme(L && L.lang);
    btn.classList.toggle('on', store.prefs().showPron);
  } else if (a === 'trip-clear') {
    store.setTrip(L.lang.code, null);
    viewFlight();
  } else if (a === 'print') {
    window.print();
  } else if (a === 'help') {
    if (pl?.where === 'sheet') { stopPlayerAudio(); pl = null; }
    openSheet(helpHtml(false));
  } else if (a === 'start-session') {
    closeSheet();
    go(`#/${L.lang.code}/session`);
  } else if (a === 'ss-next') {
    sessionAdvance();
  } else if (a === 'ss-got' || a === 'ss-again') {
    sessionRate(a === 'ss-got');
  } else if (a === 'pp-swap') {
    sfx.tap();
    // Swap it inside the player: show, play, record and compare the picked variant.
    if (!pl) return;
    const v = variantsOf(pl.p).find((x) => x.id === btn.dataset.v) || null;
    capture?.stop();
    stopPlayerAudio();
    tts.stop();
    Object.assign(pl, { view: v, take: null, guide: null, rec: false, finishing: false, interim: '' });
    if (pl.mode === 'learn') pl.step = canSpeak() ? 'listen' : canPracticeAloud() ? 'say' : 'done';
    drawPlayer();
    plListen();
  } else if (a === 'swap') {
    sfx.tap();
    // Swap it on a phrase card: the card shows the picked sentence, and plays it.
    const p = L.byId.get(btn.dataset.pid);
    if (!p) return;
    swapSel[p.id] = btn.dataset.v || '';
    const card = btn.closest('.card');
    const row = card.querySelector('.swap-row');
    const scroll = row ? row.scrollLeft : 0;
    card.outerHTML = phraseCard(p);
    const fresh = document.querySelector(`.card[data-id="${CSS.escape(p.id)}"] .swap-row`);
    if (fresh) fresh.scrollLeft = scroll;
    syncListen();
    if (btn.dataset.v && canSpeak()) speakPhrase(shownFor(p).id);
  } else if (a === 'bd-pick') {
    if (!pl?.build) return;
    sfx.tap();
    if (!pl.build.picked.includes(btn.dataset.id)) pl.build.picked.push(btn.dataset.id);
    drawPlayer();
  } else if (a === 'bd-unpick') {
    if (!pl?.build) return;
    sfx.tap();
    pl.build.picked.splice(Number(btn.dataset.i), 1);
    drawPlayer();
  } else if (a === 'bd-check') {
    plBuildCheck();
  } else if (a === 'pp-ask-say') {
    if (!pl) return;
    pl.ask = 'say';
    if (session?.steps[session.i]) session.steps[session.i].ask = 'say';
    drawPlayer();
  } else if (a === 'pp-reveal') {
    if (!pl) return;
    if (pl.ask === 'type') { plType(true); return; }
    if (pl.ask === 'build') { plBuildCheck(true); return; }
    capture?.stop();
    pl.step = 'reveal';
    drawPlayer();
    plListen();
  } else if (a === 'rc-pick') {
    const st = session?.steps[session.i];
    if (!st || st.picked != null) return;
    st.picked = Number(btn.dataset.i);
    const ok = st.options[st.picked].ok;
    st.graded = true;
    scoreAnswer(ok);
    if (ok) sfx.right(); else sfx.wrong();
    drawSession();
  } else if (a === 'lc-pick') {
    if (session.picked != null) return;
    session.picked = Number(btn.dataset.i);
    if (session.steps[session.i].options[session.picked].ok) sfx.right(); else sfx.wrong();
    drawSession();
    document.querySelector('.lc-verdict')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  } else if (a === 'ss-another') {
    session = null;
    route();
  } else if (a === 'type-next') {
    practice.queue.shift();
    practice.done++;
    nextCard();
    drawPractice();
    window.scrollTo(0, 0);
  } else if (a === 'type-reveal') {
    runTypeCheck(true);
  } else if (a === 'type-retry') {
    Object.assign(practice, { check: null });
    tts.stop();
    drawPractice();
    document.getElementById('type-input')?.focus();
  } else if (a === 'retry-missed') {
    const missed = practice.all.filter((p) => practice.missed.has(p.key));
    Object.assign(practice, { all: missed, queue: shuffle(missed), total: missed.length, done: 0, missed: new Set() });
    nextCard();
    drawPractice();
  } else if (a === 'restart') {
    Object.assign(practice, { queue: shuffle(practice.all), done: 0, missed: new Set() });
    nextCard();
    drawPractice();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('showit-open')) { tts.stop(); closeShowIt(); return; }
  if (e.key === 'Escape' && document.body.classList.contains('sheet-open')) { closeSheet(); return; }
});

/* ---------- Build it: drag a tile into the sentence (tapping works too) ---------- */

let drag = null;
let noClickUntil = 0;
const overAnswer = (e) => {
  const box = document.querySelector('.bd-answer')?.getBoundingClientRect();
  return !!box && e.clientX >= box.left - 12 && e.clientX <= box.right + 12 && e.clientY >= box.top - 12 && e.clientY <= box.bottom + 12;
};
document.addEventListener('pointerdown', (e) => {
  const t = e.target.closest('.bd-bank .bd-tile:not([disabled])');
  if (t) drag = { t, id: t.dataset.id, x: e.clientX, y: e.clientY, ghost: null };
});
document.addEventListener('pointermove', (e) => {
  if (!drag) return;
  if (!drag.ghost) {
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
    drag.ghost = drag.t.cloneNode(true);
    drag.ghost.classList.add('bd-ghost');
    document.body.appendChild(drag.ghost);
    drag.t.classList.add('dragging');
  }
  const g = drag.ghost;
  g.style.transform = `translate(${e.clientX - g.offsetWidth / 2}px, ${e.clientY - g.offsetHeight / 2}px)`;
  document.querySelector('.bd-answer')?.classList.toggle('over', overAnswer(e));
});
const endDrag = (e, drop) => {
  if (!drag) return;
  const d = drag;
  drag = null;
  if (!d.ghost) return; // a plain tap: the click handler places it
  d.ghost.remove();
  d.t.classList.remove('dragging');
  document.querySelector('.bd-answer')?.classList.remove('over');
  noClickUntil = Date.now() + 300;
  if (drop && overAnswer(e) && pl?.build && !pl.build.picked.includes(d.id)) {
    pl.build.picked.push(d.id);
    sfx.tap();
    drawPlayer();
  }
};
document.addEventListener('pointerup', (e) => endDrag(e, true));
document.addEventListener('pointercancel', (e) => endDrag(e, false));

/* ---------- router ---------- */

async function route() {
  mic.releaseWarm();
  document.body.classList.remove('has-fb');
  clearInterval(raceTimer);
  tts.stop();
  closeSheet();
  closeShowIt();
  capture?.stop();
  stopPlayerAudio();
  pl = null;
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
    await tts.loadNatural(code);
    practice = null;
  }
  store.setPref('lastLang', code);
  applyTheme(L.lang);

  const keepScroll = sectionName === 'practice' && arg === 'run';
  if (!sectionName) viewDashboard();
  else if (sectionName === 'phrases') viewPhrases(query);
  else if (sectionName === 'scenarios') viewScenarios();
  else if (sectionName === 'scenario') viewScenario(arg);
  else if (sectionName === 'more') viewMore();
  else if (sectionName === 'race') viewRace();
  else if (sectionName === 'progress') viewProgress();
  else if (sectionName === 'patterns') viewPatterns();
  else if (sectionName === 'sounds') await viewSounds();
  else if (sectionName === 'mic') viewMicCheck();
  else if (sectionName === 'session') viewSession(query);
  else if (sectionName === 'flight') viewFlight();
  else if (sectionName === 'cheatsheet') viewCheatsheet(query);
  else if (sectionName === 'practice' && arg === 'run') viewPracticeRun(query);
  else if (sectionName === 'practice') return go(`#/${code}/practice/run`);
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
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('./sw.js').then((reg) => reg.update()).catch(() => {});
    // A new version took over: reload now, unless you're mid-session (then offer it).
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return; // first install, nothing changed for you
      if (/\/(session|practice\/run)/.test(location.hash)) updateBanner();
      else location.reload();
    });
  }
}

boot();
