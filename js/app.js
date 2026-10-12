import { loadContent, loadLanguage, loadSounds, inCategory } from './data.js';
import { store } from './store.js';
import * as tts from './speech.js';
import * as mic from './speak.js';
import { shortVoiceName } from './voices.js';
import { checkTyped, checkTypedChars } from './typecheck.js';
import { DAY, gapFor, lockTime, parseDate, daysUntil, todayIso, endOfToday } from './schedule.js';
import { planSession, requeue } from './plan.js';

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
  const ps = sitPhrases(sit);
  return { n: ps.length, ready: ps.filter((p) => store.isLearned(p.key)).length };
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
// "How it's said": natural-speed coaching from the sound guide, with a link to the guide.
const sayTipNote = (p, link = true) => (p.say_tip
  ? `<p class="note"><span class="note-k">How it’s said</span>${esc(p.say_tip)}${link ? ` <a class="note-link" href="#/${L.lang.code}/sounds">Sound guide</a>` : ''}</p>`
  : '');

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
  return `
  <article class="card lk ${p.type === 'pattern' ? 'is-pattern' : ''}" data-key="${esc(p.key)}" data-id="${esc(p.id)}">
    <div class="lk-main">
      <div class="lk-text">${phraseLines(p)}</div>
      ${canSpeak() ? `<button class="round-btn lk-play listen" data-action="speak" data-id="${esc(p.id)}" data-key="${esc(p.key)}" data-state="idle" aria-label="Listen">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button>` : ''}
    </div>
    ${notes.length ? `<div class="notes">${notes.join('')}</div>` : ''}
    <div class="card-actions">
      <button class="pill-btn" data-action="show-it" data-id="${esc(p.id)}">${icon('expand')}<span>Show</span></button>
      ${canPracticeAloud() ? `<button class="pill-btn" data-action="say-it" data-id="${esc(p.id)}">${icon('mic')}<span>Practise</span></button>` : ''}
      <span class="lk-spacer"></span>
      ${st ? `<span class="status-tag ${st}">${statusLabel(st)}</span>` : ''}
      ${p.type === 'pattern' ? '<span class="lk-kind">Pattern</span>' : ''}
      <button class="icon-btn fav ${fav ? 'on' : ''}" data-action="fav" aria-pressed="${fav}" aria-label="Save">${icon('star')}</button>
    </div>
  </article>`;
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
    `<a href="${href}" class="${active === id ? 'on' : ''}" ${active === id ? 'aria-current="page"' : ''}>${icon(ic)}<span>${label}</span></a>`).join('')}</nav>`;
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
      <h1>Where to next?</h1>
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
        return `<a class="stamp shape-${i % 3}" href="#/${encodeURIComponent(l.code)}" data-stamp style="--accent:${l.meta.accent};--rot:${STAMP_TILT[i % STAMP_TILT.length]}deg">
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
    </section>
    ${nextStepCard()}

    ${section('Need a phrase now?', `<div class="scen-row">${sits.map(({ sit }) => `<a class="scen-btn" href="#/${code}/scenario/${sit.id}"><span class="scen-ic">${sit.icon}</span>${esc(sit.label)}</a>`).join('')}</div>`)}

    ${section('Your situations', `<div class="sit-list">${sits.map(({ sit, r }) => `
      <a class="sit-row ${r.ready === r.n ? 'done' : ''}" href="#/${code}/scenario/${sit.id}">
        <span class="scen-ic">${sit.icon}</span>
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

// More: everything that isn't the daily loop or looking a phrase up.
function viewMore() {
  const lang = L.lang;
  const code = lang.code;
  const favs = store.countFor('fav', code);
  const patterns = L.phrases.filter((p) => p.type === 'pattern' && !p.missing).length;
  page('more', `
    <section class="page-head"><h1>More</h1></section>
    ${section('Your trip', `<div class="group">
      ${row({ href: `#/${code}/flight`, ic: 'plane', title: 'Flying soon?', sub: 'Set your trip date, rescue kit, crash course' })}
      ${row({ href: `#/${code}/cheatsheet`, ic: 'printer', title: 'Cheat sheet', sub: 'Every Core phrase on one screen. Print or screenshot it' })}
      ${row({ href: `#/${code}/phrases?cat=saved`, ic: 'star', title: 'Saved phrases', count: favs })}
    </div>`)}
    ${section('Go deeper', `<div class="group">
      ${row({ href: `#/${code}/sounds`, ic: 'ear', title: 'Sound guide', sub: 'The tricky sounds, and how to read the pronunciation line' })}
      ${row({ href: `#/${code}/patterns`, ic: 'puzzle', title: 'Power patterns', sub: 'One sentence frame, many uses', count: patterns })}
      ${row({ href: `#/${code}/practice/run`, ic: 'list', title: 'Type it', sub: 'Write phrases out; get told exactly what to fix' })}
    </div>`)}
    ${canSpeak() || lang.meta.tts_note ? section('Audio', audioGroup()) : ''}
    ${L.generalNotes.length ? section(`About this ${lang.direction === 'rtl' ? 'dialect' : 'set'}`, `<div class="group notes-group">
      ${L.generalNotes.map((n) => `<p class="about-row"><span class="note-k">${esc(n.key)}</span>${esc(n.text)}</p>`).join('')}
    </div>`) : ''}
    <div class="group">${row({ action: 'help', ic: 'help', title: 'How Wayword works' })}</div>
    <p class="fine">Progress is saved on this device only.</p>
  `);
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
  const chips = [['all', 'All', ''], ['saved', 'Saved', '★'], ...C.scenarios.map((x) => [x.id, x.label, x.icon])];
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
  else if (sit) items = sitPhrases(sit);
  else items = L.phrases.filter((p) => !p.missing);
  const el = document.getElementById('list');
  document.querySelector('.chips')?.classList.toggle('dim', !!needle);
  if (!items.length) {
    el.innerHTML = `<div class="empty-state">${needle ? 'No phrase matches that.' : sel === 'saved' ? 'Tap ★ on any phrase to save it here.' : 'Nothing here yet.'}</div>`;
    return;
  }
  const head = needle ? `${items.length} match${items.length === 1 ? '' : 'es'} in all phrases`
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
    ${anySubs ? '' : '<p class="callout">Swap-in words aren’t in the dataset yet. Under each pattern you’ll find dataset phrases already built on it.</p>'}
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
    ${s.typed ? `<p class="heard">You wrote: <bdi ${nativeAttrs(L.lang)}>${esc(s.typed)}</bdi></p>` : ''}
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
  const inSit = new Set(sit.concepts);
  return [...pool.filter((p) => inSit.has(p.id)), ...pool.filter((p) => !inSit.has(p.id))];
}

function sessionPlanFor(query) {
  const soon = leavingSoon();
  const coreLeft = freshPool(true).length > 0;
  return planSession({
    due: dueItems(),
    fresh: freshPool((query.get('mode') === 'flight' || soon) && coreLeft),
    known: L.phrases.filter((p) => !p.missing && store.isLearned(p.key)),
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
    <p class="fc-meta">${STEP_LABEL[st.kind]} · ${s.i + 1} of ${s.steps.length}</p>`;

  if (st.kind === 'listen') {
    const p = st.p;
    const picked = s.picked;
    page('home', `${top}
      <article class="pp-phrase pp-prompt"><span class="fc-label">What did they say?</span>
        <div class="pp-stage"><button class="mic-big listen pp-big" data-action="speak" data-id="${esc(p.id)}" data-key="${esc(p.key)}" data-state="idle" aria-label="Listen">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button>
        <span class="pp-hint">Listen, then pick the meaning</span></div>
      </article>
      <div class="lc-opts">${st.options.map((o, i) => `<button class="lc-opt ${picked == null ? '' : o.ok ? 'right' : picked === i ? 'wrong' : ''}" data-action="lc-pick" data-i="${i}" ${picked == null ? '' : 'disabled'}>${withSlots(o.text)}</button>`).join('')}</div>
      ${picked == null ? '' : `<article class="pp-phrase lc-answer"><p class="take-verdict">${st.options[picked].ok ? '✓ Right' : 'Not quite. This one:'}</p>${phraseLines(p)}</article>
        <button class="cta pp-next" data-action="ss-next">Next ${icon('arrow')}</button>`}
    `, { back: home, focus: true });
    return;
  }

  const recall = st.kind !== 'new';
  if (!pl || pl.p !== st.p || pl.where !== 'session') mountPlayer(st.p, 'session', recall ? 'recall' : 'learn');
  page('home', `${top}<div id="pp" class="pp">${playerInner()}</div>`, { back: home, focus: true });
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
  const row = (p, ok) => `<div class="row static"><span class="row-ic ${ok ? 'ok' : ''}">${icon(ok ? 'check' : 'replay')}</span>
    <span class="row-text"><span class="row-title">${withSlots(p.english)}</span><span class="row-sub" ${nativeAttrs(lang)}>${withSlots(p.target)}</span></span></div>`;
  page('home', `
    <section class="done">
      <div class="done-burst">${again.length ? '👏' : '🎉'}</div>
      <h1>${got.length ? 'You can now say' : 'Nice work'}</h1>
      ${notes ? `<p>${notes}</p>` : ''}
    </section>
    ${got.length || again.length || learnedOnly.length ? `<div class="group session-summary">${got.map((p) => row(p, true)).join('')}${again.map((p) => row(p, false)).join('')}${learnedOnly.map((p) => row(p, true)).join('')}</div>` : ''}
    <div class="done-actions">
      <button class="cta" data-action="ss-another">${icon('play')} Keep going</button>
      <a class="more-btn" href="${home}">Done</a>
    </div>
  `, { back: home, focus: true });
}

// After a tap moves the session on: play what the new step needs.
function sessionAutoplay() {
  const st = session?.steps[session.i];
  if (!st || !canSpeak()) return;
  if (st.kind === 'new') plListen();
  else if (st.kind === 'listen') speakPhrase(st.p.id);
}

function sessionAdvance() {
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
  const learning = store.status(p.key) === 'learning';
  if (st.kind === 'review' || (st.kind === 'practice' && store.isDue(p.key))) {
    if (learning) { const r = store.review(p.key, got); if (r?.locked) s.newlyLocked++; }
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
  if (store.status(p.key) !== 'learning' || session?.missed.has(p.key)) return '';
  const r = store.previewPass(p.key);
  if (!r) return '';
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

const micState = (rec, finishing, interim, idleText) => rec
  ? (finishing ? 'Finishing…' : interim ? `<bdi ${nativeAttrs(L.lang)}>${esc(interim)}</bdi>` : 'Listening… stops when you pause')
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
  if (pl && canSpeak()) speakPhrase(pl.p.id);
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
  const { p } = pl;
  const failed = pl.take && !pl.take.url && !pl.take.transcript;
  const idle = failed ? esc(mic.explain(pl.take) || 'Nothing came through. Try again.') : 'Say it out loud, then hear the right version';
  return `<article class="pp-phrase pp-prompt"><span class="fc-label">How do you say this in ${esc(L.lang.name)}?</span><p class="fc-en">${withSlots(p.english)}</p></article>
    ${canPracticeAloud() ? `<div class="pp-stage">
      <button class="mic-big pp-big ${pl.rec ? 'rec' : ''} ${pl.finishing ? 'finishing' : ''}" data-action="pp-mic" aria-label="${pl.rec ? 'Stop' : 'Start speaking'}">${icon(pl.rec ? 'stop' : 'mic')}</button>
      <span class="pp-hint">${micState(pl.rec, pl.finishing, pl.interim, idle)}</span>
      ${failed ? `<a class="link-btn" href="#/${L.lang.code}/mic">Run the Mic check ${icon('chev')}</a>` : ''}
      ${pl.rec ? '' : micPrimer()}
    </div>` : ''}
    <button class="${canPracticeAloud() ? 'more-btn' : 'cta'} pp-next" data-action="pp-reveal">${canPracticeAloud() ? 'Show me without speaking' : 'Show me'}</button>`;
}

function playerInner() {
  if (pl.mode === 'recall' && pl.step === 'prompt') return promptInner();
  const { p, where, step } = pl;
  const cue = listenFor(p);
  const hl = !p.say_tip && p.sound_cue?.mark ? markText(p.target, p.sound_cue.mark, p.sound_cue.hl) : undefined;
  const notes = [p.usage_note, p.regional_note].filter(Boolean).map((t) => `<p class="note">${esc(t)}</p>`).join('');
  const failed = pl.take && !pl.take.url && !pl.take.transcript;

  let stage;
  if (step === 'listen') {
    stage = `<button class="mic-big listen pp-big" data-action="speak" data-id="${esc(p.id)}" data-key="${esc(p.key)}" data-state="idle" aria-label="Listen">${icon('play', 'i-play')}${icon('pause', 'i-pause')}</button>
      <span class="pp-hint">Listen and follow the pronunciation line</span>`;
  } else if (step === 'say' || (step === 'compare' && where === 'sheet') || pl.rec) {
    const idle = failed ? esc(mic.explain(pl.take) || 'Nothing came through. Try again.') : step === 'compare' ? 'Tap to try again' : 'Your turn: tap, then say it';
    stage = `<button class="mic-big pp-big ${pl.rec ? 'rec' : ''} ${pl.finishing ? 'finishing' : ''}" data-action="pp-mic" aria-label="${pl.rec ? 'Stop' : 'Start speaking'}">${icon(pl.rec ? 'stop' : 'mic')}</button>
      <span class="pp-hint">${micState(pl.rec, pl.finishing, pl.interim, idle)}</span>
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
  if (where === 'session' && step === 'reveal') {
    next = `${pl.take ? '' : (pl.rec ? '' : `<button class="link-btn center" data-action="pp-mic">${icon('mic')} Say it and compare</button>`)}
      ${lockHint(p)}
      <div class="fc-actions"><button class="fc-btn again" data-action="ss-again">Not yet</button><button class="fc-btn got" data-action="ss-got">Got it</button></div>
      <p class="fine center">Got it = you knew it before you heard it.</p>`;
  } else if (where === 'session') {
    next = `<button class="${ready ? 'cta' : 'more-btn'} pp-next" data-action="ss-next">${upNext === 'check' ? 'Quick check' : upNext ? 'Next' : 'Finish'} ${icon('arrow')}</button>
       ${!ready && canPracticeAloud() ? '<p class="fine">Speaking is optional. Skip it whenever you like.</p>' : ''}`;
  }

  // First phrase ever: how to read the three lines (replaces the old welcome tour).
  const howto = !store.prefs().readHint && pl.mode === 'learn'
    ? `<p class="pp-howto">How to read it: <b>how it’s written</b> · <b class="pron-k">how to say it</b>${/[A-Z]{2}/.test(p.pron || '') ? ' (CAPITALS = stress)' : ''} · <b>what it means</b></p>` : '';
  return `${howto}<article class="pp-phrase">${phraseLines(p, { size: 'lg', nativeHtml: hl })}
      ${cue ? `<p class="pp-cue"><span class="note-k">Listen for</span>${cue} <a class="note-link" href="#/${L.lang.code}/sounds">Sound guide</a></p>` : ''}
      ${notes ? `<div class="notes">${notes}</div>` : ''}
    </article>
    ${stage ? `<div class="pp-stage">${stage}</div>` : ''}
    ${compare}
    ${small ? `<div class="pp-small">${small}</div>` : ''}
    ${['compare', 'reveal', 'done'].includes(step) ? tryAnotherHtml(p) : ''}
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
  const rel = relatedPhrases(p);
  if (!rel.length) return '';
  return `<div class="pp-more"><p class="more-k">${C.patterns[p.id] ? 'Same frame, other uses' : 'Goes with'}</p>
    ${rel.map((r) => `<div class="pp-more-row"><div><b ${nativeAttrs(L.lang)}>${withSlots(r.target)}</b><small>${withSlots(r.english)}</small></div>${listenBtn(r, 'small')}</div>`).join('')}
  </div>`;
}

// After recording: the guided playback, and what the phone's speech check understood.
function compareHtml() {
  const { p, take, guide } = pl;
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
      tts.play(speechItem(run.p)); // plSync clears the highlight when it ends
    }));
  };
  tts.stop();
  if (!canSpeak()) { meThenNative(); return; }
  mark('n1');
  tts.play(speechItem(run.p), () => pause(meThenNative));
}

// Audio events move the player along: listening done → your turn; guided playback done → idle.
function plSync() {
  if (!pl) return;
  const st = tts.getState();
  if (st.status !== 'done' || st.item?.key !== pl.p.key) return;
  if (pl.step === 'listen') { pl.step = canPracticeAloud() ? 'say' : 'done'; drawPlayer(); }
  else if (pl.guide === 'n2') { pl.guide = null; drawPlayer(); }
}

function plMic() {
  if (pl.rec) { pl.finishing = true; drawPlayer(); capture?.stop(); return; }
  stopPlayerAudio();
  Object.assign(pl, { rec: true, finishing: false, interim: '', step: pl.mode === 'recall' ? pl.step : pl.step === 'compare' ? 'compare' : 'say' });
  const run = pl;
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
  });
  drawPlayer();
}

function openSayIt(p) {
  mountPlayer(p, 'sheet');
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
  const p = L.byId.get(id);
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
    openSayIt(L.byId.get(btn.dataset.id));
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
    openShowIt(L.byId.get(btn.dataset.id));
  } else if (a === 'show-close') {
    tts.stop();
    closeShowIt();
  } else if (a === 'save-offline') {
    const sit = C.scenarios.find((x) => x.id === btn.dataset.id);
    if (sit) saveOffline(sitPhrases(sit), btn);
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
  } else if (a === 'pp-reveal') {
    if (!pl) return;
    capture?.stop();
    pl.step = 'reveal';
    drawPlayer();
    plListen();
  } else if (a === 'lc-pick') {
    if (session.picked != null) return;
    session.picked = Number(btn.dataset.i);
    drawSession();
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

/* ---------- router ---------- */

async function route() {
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
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

boot();
