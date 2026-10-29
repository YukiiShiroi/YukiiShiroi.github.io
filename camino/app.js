// Camino — © 2026 YukiiShiroi (github.com/YukiiShiroi). All rights reserved.
// The app: home, word lessons and reviews, sounds, grammar, reading, copybook, Cold Learn, stats, settings and sync.
const C = window.CAMINO, {MIN, WORDS, schedule, dayNum, checkEs, meaningCorrect, meaningTypo, firstMeaning, normEs} = C;
const SELFTEST = /[?&]selftest\b/.test(location.search);
const STORE = SELFTEST ? 'camino.selftest' : 'camino.v1';
const SOUNDS = window.SOUNDS, GRAMMAR = window.GRAMMAR, READER = window.READER;

/* =========================================================
   Small helpers
   ========================================================= */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[c]);
const sum = a => a.reduce((x, y) => x + y, 0);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtClock = s => `${Math.floor(s / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const fmtSecs = s => s < 10 ? s.toFixed(1) + 's' : Math.round(s) + 's';
const fmtHours = s => s < 60 ? `${Math.round(s)}s` : s < 3600 ? `${Math.round(s / 60)} min` : `${(s / 3600).toFixed(1).replace(/\.0$/, '')} h`;
const plural = (n, w, ws = w + 's') => `${n} ${n === 1 ? w : ws}`;
const meter = parts => `<div class="meter">${parts.map(([p, c]) => `<span style="width:${Math.max(0, Math.min(100, p))}%;background:${c}"></span>`).join('')}</div>`;
let toastT = 0;
function toast(msg){ const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600); }
function announce(msg){ const el = $('live'); el.textContent = ''; setTimeout(() => { el.textContent = String(msg).replace(/<[^>]+>/g, ''); }, 30); }

/* =========================================================
   Cards: every word has a recognition card (Spanish → English) and, once that one is learned,
   a production card (English → Spanish)
   ========================================================= */
const CARDS = {}, SETS = [];
for (const w of WORDS){
  w.id = w.es;
  CARDS['r:' + w.es] = {id:'r:' + w.es, kind:'r', w};
  CARDS['p:' + w.es] = {id:'p:' + w.es, kind:'p', w};
  let set = SETS.find(s => s.id === w.set);
  if (!set) SETS.push(set = {id:w.set, title:w.setTitle, words:[]});
  set.words.push(w);
}
const R_IDS = WORDS.map(w => 'r:' + w.es);

/* =========================================================
   Saved progress. Everything loaded from storage, a backup or the sync file is checked field by field first.
   ========================================================= */
function defaults(){
  return {cards:{}, days:{}, mist:{}, gram:{}, read:{}, sounds:{}, cold:{}, newDay:{d:0, n:0},
    cb:{pages:0, lines:0, correct:0, secs:0, hist:[]}, peers:{}, settingsT:0, resetAt:0,
    settings:{theme:'auto', newPerDay:10, lessonSize:5, production:true, speed:'5'}};
}
const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const objOf = (o, ok = isObj) => isObj(o) ? Object.fromEntries(Object.entries(o).filter(([, v]) => ok(v))) : {};
const pickNums = (o, keys) => Object.fromEntries(keys.filter(k => isObj(o) && isNum(o[k])).map(k => [k, o[k]]));
function numsOf(o){ const out = {}; if (isObj(o)) for (const [k, v] of Object.entries(o)){ if (isNum(v)) out[k] = v; else if (isObj(v)) out[k] = numsOf(v); } return out; }
function cleanCard(c){
  if (!isObj(c) || !['learn', 'relearn', 'review'].includes(c.s)) return null;
  const out = {s:c.s, ease:2.5, ...pickNums(c, ['ivl', 'ease', 'dueDay', 'lastDay', 'dueTs', 'step', 'lapses', 'reps', 'rt', 'u'])};
  if (out.s === 'review'){ out.ivl ??= 1; out.dueDay ??= 0; } else { out.step ??= 0; out.dueTs ??= 0; out.ivl ??= 1; }
  return out;
}
const cleanCb = cb => isObj(cb) ? {...pickNums(cb, ['pages', 'lines', 'correct', 'secs']), hist:Array.isArray(cb.hist) ? cb.hist.filter(isObj).map(h => pickNums(h, ['s', 't', 'd', 'secs'])).filter(h => isNum(h.t)) : []} : undefined;
const SETTING_CHOICES = {theme:['auto', 'light', 'dark'], speed:['0', '3', '5', '8']};
function cleanSettings(s){
  if (!isObj(s)) return undefined;
  const out = {};
  for (const k of ['newPerDay', 'lessonSize']) if (isNum(s[k])) out[k] = s[k];
  for (const [k, ok] of Object.entries(SETTING_CHOICES)) if (ok.includes(String(s[k]))) out[k] = String(s[k]);
  if (typeof s.production === 'boolean') out.production = s.production;
  return out;
}
function cleanDB(d){
  if (!isObj(d)) return null;
  const out = {};
  out.cards = Object.fromEntries(Object.entries(objOf(d.cards)).filter(([id]) => CARDS[id]).map(([id, c]) => [id, cleanCard(c)]).filter(([, c]) => c));
  for (const k of ['days', 'mist', 'newDay']) if (k in d) out[k] = numsOf(d[k]);
  out.gram = Object.fromEntries(Object.entries(objOf(d.gram)).map(([id, g]) => [id, {...(g.p === true ? {p:true} : {}), ...pickNums(g, ['best', 'ivl', 'due', 'at'])}]));
  out.read = Object.fromEntries(Object.entries(objOf(d.read)).map(([id, r]) => [id, pickNums(r, ['n', 'best', 'at'])]));
  out.sounds = objOf(d.sounds, v => v === true);
  out.cold = Object.fromEntries(Object.entries(objOf(d.cold)).filter(([k]) => /^[rp](20|50)?$/.test(k)).map(([k, r]) => [k, pickNums(r, ['s', 't', 'secs', 'at', 'bs', 'bt', 'bsecs'])]).filter(([, r]) => r.t > 0 && isNum(r.s)));
  if ('cb' in d) out.cb = cleanCb(d.cb);
  if ('settings' in d) out.settings = cleanSettings(d.settings);
  for (const k of ['settingsT', 'resetAt']) if (isNum(d[k])) out[k] = d[k];
  for (const k of ['peers', 'ledgers']) if (isObj(d[k])) out[k] = Object.fromEntries(Object.entries(d[k]).filter(([, p]) => isObj(p))
    .map(([id, p]) => [id, {name:String(p.name || 'Device').slice(0, 40), ...pickNums(p, ['at']), days:numsOf(p.days), mist:numsOf(p.mist), cb:cleanCb(p.cb) || {}}]));
  return out;
}
function merge(base, d){
  return {...base, ...d, newDay:{...base.newDay, ...(d.newDay || {})}, cb:{...base.cb, ...(d.cb || {})}, settings:{...base.settings, ...(d.settings || {})}};
}
let loadProblem = false;
function load(){
  if (SELFTEST) return defaults();
  let raw = null;
  try{ raw = localStorage.getItem(STORE); }catch{ return defaults(); }
  if (!raw) return defaults();
  try{ const d = cleanDB(JSON.parse(raw)); if (d) return merge(defaults(), d); }catch{}
  try{ localStorage.setItem(STORE + '.unreadable', raw); }catch{}
  loadProblem = true;
  return defaults();
}
let DB = load(), saveWarned = false;
function save(quiet){
  try{ localStorage.setItem(STORE, JSON.stringify(DB)); }
  catch{ if (!saveWarned){ saveWarned = true; setTimeout(() => toast('Couldn’t save your progress in this browser. Export a backup in Settings.'), 0); } }
  if (!quiet) markSyncDirty();
}
try{ navigator.storage?.persisted?.().then(p => { if (!p) navigator.storage.persist?.(); }).catch(() => {}); }catch{}

/* =========================================================
   Card state and what's due
   ========================================================= */
const st = id => DB.cards[id] || {s:'new'};
const strength = id => { const c = st(id); return c.s === 'new' ? 'new' : c.s !== 'review' ? 'learn' : c.ivl >= 21 ? 'master' : 'young'; };
const learned = w => st('r:' + w.es).s !== 'new';
const learnedWords = () => WORDS.filter(learned);
const prodOn = () => DB.settings.production !== false;
const dayLog = t => DB.days[t] ||= {r:0, c:0, n:0, ms:0};
function newCounter(){ const t = dayNum(); if (DB.newDay.d !== t) DB.newDay = {d:t, n:0}; return DB.newDay; }
const newLeft = () => Math.max(0, DB.settings.newPerDay - newCounter().n);
const unseen = () => R_IDS.filter(id => st(id).s === 'new');
function dueIds(now = Date.now()){
  const t = dayNum(now), learn = [], rev = [];
  for (const [id, c] of Object.entries(DB.cards)){
    if (!CARDS[id] || (CARDS[id].kind === 'p' && !prodOn())) continue;
    if (c.s === 'review' && c.dueDay <= t) rev.push(id);
    else if (c.s !== 'review' && c.dueTs <= now + 20 * MIN) learn.push(id);
  }
  return {learn:learn.sort((a, b) => DB.cards[a].dueTs - DB.cards[b].dueTs), rev:shuffle(rev)};
}
const dueCount = () => { const d = dueIds(); return d.learn.length + d.rev.length; };
// Once a word's meaning is learned (it reaches the review stage), saying it in Spanish joins the reviews the next day
function unlockProduction(rid){
  const pid = 'p:' + CARDS[rid].w.es;
  if (!prodOn() || DB.cards[pid]) return;
  const t = dayNum();
  DB.cards[pid] = {s:'review', ivl:1, ease:2.5, dueDay:t + 1, lastDay:t, reps:0, u:Date.now()};
}
// Kept in step if production is switched on after words were learned
function catchUpProduction(){ if (prodOn()) for (const id of R_IDS) if (st(id).s === 'review') unlockProduction(id); }

/* =========================================================
   Study days, streaks and device ledgers (each synced device keeps its own log; stats add them up)
   ========================================================= */
function allDays(){
  const out = {};
  for (const src of [DB.days, ...Object.values(DB.peers || {}).map(p => p.days || {})])
    for (const [d, v] of Object.entries(src)){ const o = out[d] ||= {}; for (const [k, n] of Object.entries(v)) if (isNum(n)) o[k] = (o[k] || 0) + n; else if (isObj(n)){ o[k] ||= {}; for (const [a, b] of Object.entries(n)) o[k][a] = (o[k][a] || 0) + b; } }
  return out;
}
const studied = d => !!d && (d.r > 0 || d.n > 0 || (d.ms || 0) >= 60000);
function streak(){
  const all = allDays(); let t = dayNum(), n = 0;
  if (!studied(all[t])) t--;
  while (studied(all[t])){ n++; t--; }
  return n;
}
function allCb(){
  const out = {pages:0, lines:0, correct:0, secs:0};
  for (const cb of [DB.cb, ...Object.values(DB.peers || {}).map(p => p.cb || {})]) for (const k of Object.keys(out)) out[k] += cb[k] || 0;
  return out;
}
function recordMistake(src){ DB.mist[src] = (DB.mist[src] || 0) + 1; }

/* =========================================================
   Rendering
   ========================================================= */
let view = 'home', S = null, L = null, GQ = null, RD = null, SD = null, P = null, CL = null, modalId = null;
const app = $('app');
const VIEWS = {};
function render(){
  try{ renderView(); }
  catch(e){
    console.error(e);
    app.innerHTML = `<section class="panel" style="max-width:560px;margin:40px auto;text-align:center"><h1 class="es">Something went wrong</h1>
      <p class="sub">This screen couldn’t be drawn. Export a backup first, then try going home.</p><p class="muted" style="font-size:12px">${esc(e && e.message || e)}</p>
      <div class="row center"><button class="btn primary" data-act="export">Export backup</button><button class="btn" data-act="go" data-view="home">Go home</button></div></section>`;
  }
}
function renderView(){
  const studying = (view === 'study' && S) || (view === 'lesson' && L) || (view === 'cold' && CL && CL.phase === 'test') || (view === 'grammar' && GQ && GQ.phase === 'quiz');
  document.body.classList.toggle('focus', !!studying);
  const navView = {study:'home', lesson:'home', done:'home', cold:CL?.from || 'home'}[view] || view;
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.view === navView));
  app.innerHTML = (VIEWS[view] || VIEWS.home)();
}
function go(v){ S = L = GQ = RD = SD = CL = null; if (v !== 'copybook' && P && P.checked) P = null; view = v; render(); window.scrollTo(0, 0); }

/* =========================================================
   Home: today's plan, then practice, with your progress beside it
   ========================================================= */
const gramPassed = id => !!DB.gram[id]?.p;
const gramUnlocked = i => i === 0 || gramPassed(GRAMMAR[i - 1].id);
const gramNext = () => GRAMMAR.find((g, i) => !gramPassed(g.id) && gramUnlocked(i)) || null;
const gramDue = () => GRAMMAR.filter(g => gramPassed(g.id) && (DB.gram[g.id].due || 0) <= dayNum());
const readUnlocked = t => t.g.every(gramPassed);
const soundNext = () => SOUNDS.find(s => !DB.sounds[s.id]) || null;
function greeting(){
  const h = new Date().getHours();
  return h >= 4 && h < 12 ? ['¡Buenos días!', 'Good morning'] : h >= 12 && h < 19 ? ['¡Buenas tardes!', 'Good afternoon'] : ['¡Buenas noches!', 'Good evening'];
}
function pathStages(){
  const frac = (a, b) => b ? a / b : 1;
  return [
    ['Sounds', frac(SOUNDS.filter(s => DB.sounds[s.id]).length, SOUNDS.length)],
    ['First 100 words', Math.min(1, R_IDS.filter(id => st(id).s === 'review').length / 100)],
    ['Grammar', frac(GRAMMAR.filter(g => gramPassed(g.id)).length, GRAMMAR.length)],
    ['Reading', frac(READER.filter(t => DB.read[t.id]).length, READER.length)],
    ['All words', frac(R_IDS.filter(id => st(id).s === 'review').length, R_IDS.length)],
  ];
}
VIEWS.home = () => {
  const [hi, en] = greeting(), today = dayNum(), d = allDays()[today] || {};
  const due = dueCount(), left = Math.min(newLeft(), unseen().length), gn = gramNext(), gd = gramDue();
  const nextText = READER.find(t => readUnlocked(t) && !DB.read[t.id]), sn = soundNext();
  const task = (ico, title, line, done, btn) => `<div class="task${done ? ' is-done' : ''}"><span class="ico">${done ? '✓' : ico}</span><div class="t"><b>${title}</b><span>${line}</span></div>${btn}</div>`;
  const tasks = [
    task('↻', 'Reviews', due ? `${plural(due, 'card')} ready` : 'All caught up', !due, due ? `<button class="btn primary" data-act="study">Review →</button>` : ''),
    task('+', 'New words', left ? `${left} new today${SETS.find(s => s.words.some(w => !learned(w))) ? ` · next: ${esc(SETS.find(s => s.words.some(w => !learned(w))).title)}` : ''}` : unseen().length ? 'Today’s new words are done' : 'Every word learned', !left,
      left ? `<button class="btn${due ? '' : ' primary'}" data-act="lesson">Learn →</button>` : ''),
    sn && Object.keys(DB.sounds).length < SOUNDS.length ? task('ñ', 'Sounds', `Next: ${esc(sn.title)}`, false, `<button class="btn" data-act="sound" data-id="${sn.id}">Read →</button>`) : '',
    gd.length ? task('G', 'Grammar review', `${plural(gd.length, 'point')} to refresh`, false, `<button class="btn" data-act="gram-review">Review →</button>`)
      : gn ? task('G', 'Grammar', `Next: ${esc(gn.title)}`, false, `<button class="btn" data-act="gram" data-id="${gn.id}">Learn →</button>`) : '',
    nextText ? task('R', 'Reading', `New text: ${esc(nextText.title)}`, false, `<button class="btn" data-act="text" data-id="${nextText.id}">Read →</button>`) : '',
  ].join('');
  const n = learnedWords().length, s = streak(), stages = pathStages(), cur = stages.findIndex(x => x[1] < 1);
  const week = Array.from({length:7}, (_, i) => today - 6 + i).map(t => { const lbl = new Date(t * C.DAY).toLocaleDateString(undefined, {weekday:'short', timeZone:'UTC'}); return `<span><i class="${studied(allDays()[t]) ? 'on' : ''}${t === today ? ' today' : ''}"></i>${lbl.slice(0, 1)}</span>`; }).join('');
  const mastered = R_IDS.filter(id => strength(id) === 'master').length, young = R_IDS.filter(id => strength(id) === 'young').length;
  return `<div class="hello" style="margin-bottom:18px"><span class="es">${hi}</span><h1>${en}</h1></div>
    ${loadProblem ? '<section class="panel" style="margin-bottom:16px;border-color:var(--red)"><b>Your saved progress couldn’t be read.</b> <span class="muted">A copy was kept aside. If you have a backup, import it in Settings.</span></section>' : ''}
    <div class="path">${stages.map(([name, p], i) => `<div class="${i === cur ? 'now' : ''}"><i><b style="width:${Math.round(p * 100)}%"></b></i>${name}</div>`).join('')}</div>
    <div class="home">
      <div class="stack">
        <section class="panel"><h2>Today</h2>${tasks}</section>
        <div class="tiles">
          <button class="tile" data-act="cold" ${n ? '' : 'disabled'}><span class="ico">❄</span><span><b>Cold Learn</b><span>${n ? `${plural(n, 'word')} you know · shuffled · no hints` : 'Unlocks after your first lesson'}</span></span></button>
          <button class="tile" data-act="go" data-view="copybook"><span class="ico">✎</span><span><b>Copybook</b><span>${DB.cb.pages ? `${plural(allCb().pages, 'page')} written` : 'Write Spanish by hand, line by line'}</span></span></button>
          <button class="tile" data-act="practice" ${n >= 4 ? '' : 'disabled'}><span class="ico">↺</span><span><b>Practice</b><span>${n >= 4 ? '20 words you know · your schedule isn’t affected' : 'Unlocks after your first lesson'}</span></span></button>
          <button class="tile" data-act="go" data-view="sounds"><span class="ico">ñ</span><span><b>Sounds</b><span>${Object.keys(DB.sounds).length}/${SOUNDS.length} guides read</span></span></button>
        </div>
      </div>
      <div class="stack">
        <section class="panel"><div class="streak"><b>${s}</b><span>day${s === 1 ? '' : 's'} in a row</span></div><div class="week">${week}</div>
          <p class="muted" style="font-size:13px;margin:12px 0 0">${d.r || 0} reviews · ${d.n || 0} new · ${Math.round((d.ms || 0) / 60000)} min today</p></section>
        <section class="panel prog"><h2>Progress</h2>
          <div><div class="r"><span>Words</span><b>${n}/${WORDS.length}</b></div>${meter([[young / WORDS.length * 100, 'var(--gold)'], [mastered / WORDS.length * 100, 'var(--green)'], [(n - young - mastered) / WORDS.length * 100, 'var(--red)']])}</div>
          <div><div class="r"><span>Grammar</span><b>${GRAMMAR.filter(g => gramPassed(g.id)).length}/${GRAMMAR.length}</b></div>${meter([[GRAMMAR.filter(g => gramPassed(g.id)).length / GRAMMAR.length * 100, 'var(--blue)']])}</div>
          <div><div class="r"><span>Texts read</span><b>${Object.keys(DB.read).length}/${READER.length}</b></div>${meter([[Object.keys(DB.read).length / READER.length * 100, 'var(--accent)']])}</div>
        </section>
      </div>
    </div>`;
};

/* =========================================================
   Lessons: meet a few new words, then answer each one before they join your reviews
   ========================================================= */
function startLesson(ids){
  ids ||= unseen().slice(0, Math.min(newLeft() || 0, DB.settings.lessonSize));
  if (!ids.length) return toast(unseen().length ? 'That’s all the new words for today. Raise the limit in Settings for more.' : 'You’ve learned every word!');
  L = {items:ids, phase:'teach', i:0, queue:[], cur:null, missed:new Set(), answered:null, relearn:ids.some(id => st(id).s !== 'new')};
  view = 'lesson'; render(); window.scrollTo(0, 0);
}
function lessonQuizStart(){ L.phase = 'quiz'; L.queue = shuffle([...L.items]); lessonNextQ(); }
function lessonNextQ(){
  L.answered = null;
  if (!L.queue.length) return lessonCommit();
  L.cur = L.queue.shift(); render();
  setTimeout(() => $('ltyped')?.focus(), 30);
}
function lessonAnswer(raw){
  if (!L || L.answered || !String(raw || '').trim()) return;
  const w = CARDS[L.cur].w, ok = meaningCorrect(raw, w.en);
  L.answered = {text:String(raw || '').trim(), ok};
  if (!ok){ L.missed.add(L.cur); L.queue.push(L.cur); recordMistake('lesson'); }
  render();
  if (ok) setTimeout(() => { if (L && L.answered && L.answered.ok) lessonNextQ(); }, 700);
}
function lessonCommit(){
  const now = Date.now(), d = dayLog(dayNum(now));
  for (const id of L.items){
    if (st(id).s === 'new'){ DB.cards[id] = schedule({s:'new'}, 3, now); newCounter().n++; d.n++; }
    else DB.cards[id] = {...schedule({...st(id), s:'relearn', step:0}, 1, now)};
  }
  save();
  const items = L.items, missed = L.missed;
  L = null; view = 'done';
  VIEWS.done = () => `<div class="done"><span class="badge">✓</span><h1>¡Muy bien!</h1><p class="lead">${plural(items.length, 'word')} learned. They’ll come back in your reviews in a few minutes, then on a growing schedule.</p>
    <section class="panel"><div class="chips" style="justify-content:center">${items.map(id => `<button class="chip ${missed.has(id) ? 's-learn' : 's-master'}" data-act="word" data-id="${esc(CARDS[id].w.es)}">${esc(CARDS[id].w.es)}</button>`).join('')}</div></section>
    <div class="row center">${newLeft() && unseen().length ? '<button class="btn primary big" data-act="lesson">Learn more →</button>' : ''}<button class="btn big${newLeft() && unseen().length ? '' : ' primary'}" data-act="go" data-view="home">Home</button></div></div>`;
  render(); window.scrollTo(0, 0);
}
VIEWS.lesson = () => {
  if (!L) return VIEWS.home();
  const n = L.items.length;
  if (L.phase === 'teach'){
    const w = CARDS[L.items[L.i]].w, g = C.genderOf(w.es);
    return `<div class="study"><div class="study-top"><button class="icon-btn" data-act="lesson-quit" aria-label="Leave the lesson">✕</button><div class="progress"><span style="width:${L.i / n * 50}%"></span></div><span class="meta">${L.i + 1} / ${n}</span></div>
      <div class="card teach"><div class="card-top"><span class="pill">${L.relearn ? 'Relearn' : 'New word'} · ${esc(w.setTitle)}</span>${g ? `<span class="tag ${g}">${g === 'm' ? 'masculine' : 'feminine'}</span>` : ''}</div>
        <div class="big" lang="es">${esc(w.es)}</div><div class="en">${esc(w.en)}</div>${w.note ? `<div class="note">${esc(w.note)}</div>` : ''}</div>
      <div class="row" style="justify-content:space-between;margin-top:16px"><button class="btn" data-act="lesson-back" ${L.i ? '' : 'disabled'}>← Back</button><button class="btn primary big" data-act="lesson-next">${L.i < n - 1 ? 'Next →' : 'Check yourself →'}</button></div>
      <div class="dots">${L.items.map((_, i) => `<i class="${i <= L.i ? 'on' : ''}"></i>`).join('')}</div>
      <p class="keys"><kbd>Enter</kbd> next · <kbd>←</kbd> back</p></div>`;
  }
  const w = CARDS[L.cur].w, a = L.answered, doneN = L.items.length - new Set([...L.queue, L.cur]).size;
  return `<div class="study"><div class="study-top"><button class="icon-btn" data-act="lesson-quit" aria-label="Leave the lesson">✕</button><div class="progress"><span style="width:${50 + doneN / n * 50}%"></span></div><span class="meta">Check</span></div>
    <div class="card"><div class="card-top"><span class="pill">What does it mean?</span></div><div class="prompt"><div class="big" lang="es">${esc(w.es)}</div><small>Type the English</small></div></div>
    ${a ? `<div class="verdict ${a.ok ? 'ok' : 'no'}"><div class="head">${a.ok ? '✓ Right' : '✗ Not quite'}</div>${a.ok ? '' : `<div class="ans">${esc(w.en)}</div><div class="note">You typed “${esc(a.text || '—')}”. It comes back at the end.</div>`}</div>
      ${a.ok ? '' : '<div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn primary" data-act="lesson-continue">Continue →</button></div>'}`
      : `<form class="typein" data-form="lesson"><input id="ltyped" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the meaning…" aria-label="Your answer"><button class="btn primary">Check</button></form>`}
  </div>`;
};

/* =========================================================
   Reviews. Between cards only the parts that change are redrawn, so the answer box (and a phone's keyboard) stays put.
   ========================================================= */
function startStudy(practice){
  let queue;
  if (practice){
    queue = shuffle(learnedWords().map(w => (prodOn() && st('p:' + w.es).s !== 'new' && Math.random() < .5 ? 'p:' : 'r:') + w.es)).slice(0, 20);
    if (!queue.length) return;
  } else {
    const d = dueIds();
    queue = [...d.rev, ...d.learn];
    if (!queue.length) return toast('Nothing to review right now');
  }
  S = {queue, done:0, right:0, total:queue.length, practice:!!practice, cur:null, revealed:false, typed:null, shownAt:0, firstKey:null, start:Date.now()};
  view = 'study'; nextCard(true);
}
function nextCard(first){
  // Cards still in their first steps come back once they're due, so a session can end with a few of them
  S.cur = null;
  if (!S.practice){
    const now = Date.now(), soon = S.queue.findIndex(id => DB.cards[id].s !== 'review' && DB.cards[id].dueTs <= now);
    if (soon > 0) S.queue.unshift(...S.queue.splice(soon, 1));
  }
  if (!S.queue.length) return finishStudy();
  S.cur = S.queue.shift(); S.revealed = false; S.typed = null; S.shownAt = performance.now(); S.firstKey = null;
  if (first) { render(); window.scrollTo(0, 0); $('typed')?.focus(); }
  else studyUpdate();
}
const askOf = c => c.kind === 'r' ? 'What does it mean?' : 'Say it in Spanish';
const promptHTML = (c, pop) => c.kind === 'r'
  ? `<div class="big${pop ? ' pop' : ''}" lang="es">${esc(c.w.es)}</div><span class="ask">${askOf(c)}</span>`
  : `<div class="big en${pop ? ' pop' : ''}">${esc(c.w.en)}</div><span class="ask">${askOf(c)}</span>${C.genderOf(c.w.es) ? '<small>A noun: include el or la</small>' : ''}`;
function studyMetaHTML(){ return `<b>${S.done + 1}</b> / ${S.done + S.queue.length + 1}`; }
VIEWS.study = () => {
  if (!S || !S.cur) return VIEWS.home();
  const c = CARDS[S.cur];
  return `<div class="study"><div class="study-top"><button class="icon-btn" data-act="study-quit" aria-label="End the session">✕</button><div class="progress"><span id="sBar" style="width:${S.done / (S.done + S.queue.length + 1) * 100}%"></span></div><span class="meta" id="sMeta">${studyMetaHTML()}</span></div>
    <div class="card"><div class="card-top"><span class="pill" id="sPill">${S.practice ? 'Practice · ' : ''}${c.kind === 'r' ? 'Meaning' : 'Spanish'}</span></div><div class="prompt" id="sPrompt">${promptHTML(c)}</div></div>
    <form class="typein" data-form="study"><input id="typed" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" placeholder="${c.kind === 'r' ? 'Type the meaning…' : 'Escribe en español…'}" aria-label="Your answer"><button class="btn primary" id="sBtn">Check</button></form>
    <div id="sAnswer"></div>
    <p class="keys"><kbd>Enter</kbd> check, then accept the highlighted grade · <kbd>1</kbd>–<kbd>4</kbd> grade · <kbd>Esc</kbd> stop</p></div>`;
};
function studyUpdate(){
  const c = CARDS[S.cur], box = $('typed');
  if (!box) return render();
  $('sPrompt').innerHTML = promptHTML(c, true);
  $('sPill').textContent = (S.practice ? 'Practice · ' : '') + (c.kind === 'r' ? 'Meaning' : 'Spanish');
  $('sMeta').innerHTML = studyMetaHTML();
  $('sBar').style.width = S.done / (S.done + S.queue.length + 1) * 100 + '%';
  $('sAnswer').innerHTML = '';
  $('sBtn').textContent = 'Check';
  box.readOnly = false; box.value = ''; box.placeholder = c.kind === 'r' ? 'Type the meaning…' : 'Escribe en español…';
}
// Checks a typed answer for a card: {ok, note, typo}
function judge(c, raw){
  if (c.kind === 'r'){
    const ok = meaningCorrect(raw, c.w.en);
    return {ok, typo:!ok && !!String(raw || '').trim(), hint:!ok && meaningTypo(raw, c.w.en)};
  }
  const r = checkEs(raw, c.w.es);
  const note = r.ok && r.accent ? `Watch the accent: <b>${esc(c.w.es.replace(C.ARTICLE, ''))}</b>` : r.ok && r.article ? `With its article: <b>${esc(c.w.es)}</b>` : '';
  return {ok:r.ok, note, typo:!!r.typo, hint:!!r.typo};
}
function suggested(){
  if (!S.typed) return 3;
  if (!S.typed.ok && S.typed.kind !== 'typo') return 1;
  const target = +DB.settings.speed;
  return target && S.rt > target + (CARDS[S.cur].kind === 'p' ? 2 : 0) ? 2 : 3;
}
function studySubmit(){
  if (!S || !S.cur) return;
  if (S.revealed) return grade(suggested());
  const c = CARDS[S.cur], box = $('typed'), raw = box.value;
  if (!raw.trim() && performance.now() - S.shownAt < 400) return;
  S.rt = ((S.firstKey ?? performance.now()) - S.shownAt) / 1000;
  S.typed = {text:raw.trim(), ...judge(c, raw), kind:'know'};
  S.revealed = true; box.readOnly = true;
  if (!S.typed.ok) recordMistake('review');
  drawVerdict();
  announce(S.typed.ok ? 'Correct' : `Not quite. It’s ${c.kind === 'r' ? firstMeaning(c.w.en) : c.w.es}`);
}
function drawVerdict(){
  const c = CARDS[S.cur], t = S.typed, kept = t.ok || t.kind === 'typo', sug = suggested(), now = Date.now();
  const answer = c.kind === 'r' ? c.w.en : c.w.es;
  const forgive = !t.ok && t.text ? `<div class="forgive"><button class="${t.kind === 'typo' ? 'on' : ''}" data-act="forgive">${c.kind === 'r' ? '✓ My answer was right' : '⌨ It was a typo'}</button></div>` : '';
  const rate = S.practice ? `<div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" data-act="grade" data-g="${kept ? 3 : 1}">Next →</button></div>`
    : `<div class="rate">${[['Again', 1], ['Hard', 2], ['Good', 3], ['Easy', 4]].map(([l, g]) => `<button class="g${g}${g === sug ? ' sug' : ''}" data-act="grade" data-g="${g}">${l}<small>${fmtIvl(schedule(st(S.cur), g, now), now)}</small></button>`).join('')}</div>`;
  $('sAnswer').innerHTML = `<div class="verdict ${kept ? 'ok' : 'no'}"><div class="head">${t.ok ? '✓ Right' : t.kind === 'typo' ? '✓ Counted' : '✗ Not quite'}${S.rt > 0 && t.ok ? ` <span class="muted" style="font-weight:600;font-size:13px">· ${fmtSecs(S.rt)}</span>` : ''}</div>
    <div class="ans" ${c.kind === 'p' ? 'lang="es"' : ''}>${esc(answer)}</div>${t.ok ? '' : `<div class="note">You typed “${esc(t.text || '—')}”</div>`}${t.note ? `<div class="note">${t.note}</div>` : ''}${c.w.note ? `<div class="note">${esc(c.w.note)}</div>` : ''}${forgive}</div>${rate}`;
  $('sBtn').textContent = 'Next';
}
function fmtIvl(after, now){
  if (after.s === 'review'){ const d = after.ivl; return d < 30 ? d + 'd' : d < 365 ? (d / 30).toFixed(1).replace(/\.0$/, '') + 'mo' : (d / 365).toFixed(1).replace(/\.0$/, '') + 'y'; }
  const m = Math.round((after.dueTs - now) / MIN);
  return m < 60 ? Math.max(1, m) + 'm' : Math.round(m / 60) + 'h';
}
function grade(g){
  if (!S || !S.revealed) return;
  const id = S.cur, now = Date.now(), d = dayLog(dayNum(now)), before = st(id);
  const kept = S.typed.ok || S.typed.kind === 'typo';
  if (kept) S.right++;
  if (!S.practice){
    const after = schedule(before, g, now);
    if (S.rt) after.rt = Math.round(((before.rt || S.rt) * 2 + S.rt) / 3 * 10) / 10;
    DB.cards[id] = after;
    d.r++; if (kept) d.c++;
    if (CARDS[id].kind === 'r' && before.s !== 'review' && after.s === 'review') unlockProduction(id);
    if (after.s !== 'review' && after.dueTs - now < 20 * MIN) S.queue.push(id);
  }
  S.done++;
  save(true);
  nextCard();
}
function finishStudy(){
  const s = S; S = null; markSyncDirty();
  const pct = s.done ? Math.round(s.right / s.done * 100) : 100, mins = Math.max(1, Math.round((Date.now() - s.start) / 60000));
  view = 'done';
  VIEWS.done = () => `<div class="done"><span class="badge">✓</span><h1>${s.practice ? '¡Bien hecho!' : '¡Listo!'}</h1><p class="lead">${s.practice ? 'Practice done. Your review schedule wasn’t changed.' : 'Reviews done for now.'}</p>
    <div class="stats3"><div class="panel stat"><div class="k">Cards</div><div class="v">${s.done}</div></div><div class="panel stat"><div class="k">Right</div><div class="v">${pct}<small>%</small></div></div><div class="panel stat"><div class="k">Time</div><div class="v">${mins}<small> min</small></div></div></div>
    <div class="row center">${newLeft() && unseen().length ? '<button class="btn primary big" data-act="lesson">Learn new words →</button>' : ''}<button class="btn big" data-act="go" data-view="home">Home</button></div></div>`;
  render(); window.scrollTo(0, 0);
}

/* =========================================================
   Words: every set, what's learned, and each word's details
   ========================================================= */
VIEWS.words = () => {
  const n = learnedWords().length, nextSet = SETS.find(s => s.words.some(w => !learned(w)));
  return `<div class="page-head"><div><p class="eyebrow">Palabras</p><h1>Words</h1><p class="sub">${WORDS.length} everyday words in ${SETS.length} sets, taught a few at a time. Each one is asked both ways: Spanish → English, then English → Spanish once you know it.</p></div>
    <div class="row"><button class="btn" data-act="cold" ${n ? '' : 'disabled'}>❄ Cold Learn</button><button class="btn primary" data-act="lesson" ${newLeft() && unseen().length ? '' : 'disabled'}>Learn ${Math.min(newLeft(), DB.settings.lessonSize, unseen().length) || ''} new →</button></div></div>
    <section class="panel"><div class="legend" style="margin-bottom:6px"><span><i class="s-learn"></i>Learning</span><span><i class="s-young"></i>Young</span><span><i class="s-master"></i>Mastered (3+ weeks)</span></div>
    ${SETS.map((s, i) => { const k = s.words.filter(learned).length; return `<details class="set"${s === nextSet ? ' open' : ''}><summary><span class="item ${k === s.words.length ? 'done' : s === nextSet ? 'next' : ''}" style="border:0;padding:0;width:auto"><span class="n">${k === s.words.length ? '✓' : i + 1}</span></span><span class="t"><b>${esc(s.title)}</b><span>${k}/${s.words.length} learned</span></span></summary>
      <div class="words-list">${s.words.map(w => { const sg = strength('r:' + w.es); return `<button class="wcard" data-act="word" data-id="${esc(w.es)}"><span><span class="es" lang="es">${esc(w.es)}</span><small>${learned(w) ? esc(w.en) : '·  ·  ·'}</small></span><i class="s-${sg}"></i></button>`; }).join('')}</div></details>`; }).join('')}</section>`;
};
function wordSheetHTML(es){
  const w = WORDS.find(x => x.es === es);
  if (!w) return '';
  const row = (id, label) => { const c = st(id), lbl = {new:'Not yet', learn:'Learning', relearn:'Relearning', review:c.ivl >= 21 ? 'Mastered' : 'Young'}[c.s];
    return `<div><b>${lbl}</b><span>${label}</span></div><div><b>${c.ivl ? c.ivl + 'd' : '—'}</b><span>Interval</span></div>`; };
  const g = C.genderOf(w.es);
  return `<div class="modal" data-act="close"><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(w.es)}">
    <div class="card-top"><span class="pill">${esc(w.setTitle)}</span><button class="icon-btn" data-act="close" aria-label="Close">✕</button></div>
    <div class="big" lang="es">${esc(w.es)}</div><div class="en">${esc(w.en)}</div>${g ? `<p style="text-align:center;margin:6px 0 0"><span class="tag ${g}">${g === 'm' ? 'masculine' : 'feminine'}</span></p>` : ''}
    <div class="kv">${row('r:' + w.es, 'Meaning')}${row('p:' + w.es, 'Spanish')}</div>
    ${w.note ? `<div class="tip">${esc(w.note)}</div>` : ''}
    <p class="muted" style="font-size:12.5px;text-align:center;margin:12px 0 0">Missed ${st('r:' + w.es).lapses || 0}× (meaning) · ${st('p:' + w.es).lapses || 0}× (Spanish)</p></div></div>`;
}
function openModal(html){ modalId = 1; $('modal').innerHTML = html; $('modal').querySelector('[data-act="close"].icon-btn')?.focus(); }
function closeModal(){ modalId = null; $('modal').innerHTML = ''; }

/* =========================================================
   Sounds and spelling
   ========================================================= */
VIEWS.sounds = () => {
  if (SD) return soundHTML();
  return `<div class="page-head"><div><p class="eyebrow">Sonidos</p><h1>Sounds and spelling</h1><p class="sub">Spanish is spelled the way it sounds. These short guides cover every letter that works differently from English, as it’s said in Latin America.</p></div></div>
    <section class="panel"><div class="items">${SOUNDS.map((s, i) => `<button class="item ${DB.sounds[s.id] ? 'done' : s === soundNext() ? 'next' : ''}" data-act="sound" data-id="${s.id}"><span class="n">${DB.sounds[s.id] ? '✓' : i + 1}</span><span class="t"><b>${esc(s.title)}</b><span>${esc(s.sub)}</span></span><span class="muted">→</span></button>`).join('')}</div></section>`;
};
function soundHTML(){
  const s = SOUNDS.find(x => x.id === SD.id);
  if (SD.q >= 0 && SD.q < s.quiz.length){
    const [q, right] = s.quiz[SD.q], picked = SD.picked;
    return `<div class="study"><div class="study-top"><button class="icon-btn" data-act="sound-back" aria-label="Back to the guide">✕</button><div class="progress"><span style="width:${SD.q / s.quiz.length * 100}%"></span></div><span class="meta">${SD.q + 1} / ${s.quiz.length}</span></div>
      <div class="card"><div class="card-top"><span class="pill">${esc(s.title)}</span></div><div class="prompt"><div class="big en" style="font-size:22px">${esc(q)}</div></div></div>
      <div class="opts">${SD.order.map(o => `<button class="opt ${picked === null ? '' : o === right ? 'right' : o === picked ? 'wrong' : 'dim'}" style="font-size:16px;font-family:var(--ui)" data-act="sound-pick" data-val="${esc(o)}" ${picked === null ? '' : 'disabled'}>${esc(o)}</button>`).join('')}</div>
      ${picked !== null ? `<div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn primary" data-act="sound-next">${SD.q < s.quiz.length - 1 ? 'Next →' : 'Finish'}</button></div>` : ''}</div>`;
  }
  const done = SD.q >= s.quiz.length;
  return `<div class="study" style="max-width:720px"><button class="linkbtn" data-act="sound-list">← All guides</button>
    <div class="page-head" style="margin-top:10px"><div><p class="eyebrow">${esc(s.sub)}</p><h1>${esc(s.title)}</h1></div></div>
    <section class="panel explain">${s.body}<div style="margin-top:10px">${s.rows.map(([sp, sound, ex, mean]) => `<div class="srow"><b lang="es">${esc(sp)}</b><span>${esc(sound)}</span><span class="ex1"><span class="es" lang="es">${esc(ex)}</span> · ${esc(mean)}</span></div>`).join('')}</div><div class="tip">${s.tip}</div></section>
    ${done ? `<section class="panel" style="margin-top:14px;text-align:center"><h2>${SD.score === s.quiz.length ? '¡Perfecto!' : `${SD.score} / ${s.quiz.length}`}</h2><p class="sub">${DB.sounds[s.id] ? 'Guide complete.' : 'Get them all right to complete the guide.'}</p>
      <div class="row center">${DB.sounds[s.id] && soundNext() ? `<button class="btn primary" data-act="sound" data-id="${soundNext().id}">Next guide →</button>` : ''}<button class="btn" data-act="sound-quiz">Try again</button></div></section>`
      : `<div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn primary big" data-act="sound-quiz">Check yourself →</button></div>`}</div>`;
}
const soundOrder = () => { const s = SOUNDS.find(x => x.id === SD.id); SD.order = shuffle(s.quiz[SD.q].slice(1)); };

/* =========================================================
   Grammar: a path of points, each explained, drilled, then brought back for short reviews
   ========================================================= */
function gramQuestion(q){
  const out = {q, picked:null, chosen:[], tiles:[]};
  if (q.t === 'pick') out.opts = shuffle([...q.o]);
  if (q.t === 'order'){ out.tiles = shuffle(q.w.split(' ').map((w, i) => ({w, i}))); }
  return out;
}
function startGrammar(id){ const g = GRAMMAR.find(x => x.id === id); GQ = {id, phase:'learn', mode:'learn', qs:shuffle(g.q.map(gramQuestion)), i:0, score:0, answered:false}; view = 'grammar'; render(); window.scrollTo(0, 0); }
function startGramReview(){
  const due = gramDue();
  if (!due.length) return;
  const qs = shuffle(due.flatMap(g => shuffle([...g.q]).slice(0, 3).map(q => ({...gramQuestion(q), gid:g.id})))).slice(0, 12);
  GQ = {ids:due.map(g => g.id), phase:'quiz', mode:'review', qs, i:0, score:0, answered:false}; view = 'grammar'; render(); window.scrollTo(0, 0); focusGram();
}
const focusGram = () => setTimeout(() => $('gtyped')?.focus(), 30);
const gapHTML = (s, fill, ok) => esc(s).replace('＿', `<span class="gap"${ok === false ? ' style="color:var(--red);border-color:var(--red)"' : ''}>${fill ? esc(fill) : '&nbsp;'}</span>`);
function gramAnswer(value){
  const cur = GQ.qs[GQ.i], q = cur.q;
  if (GQ.answered) return;
  let ok;
  if (q.t === 'pick'){ cur.picked = value; ok = value === q.o[0]; }
  else if (q.t === 'type'){ cur.picked = value; const r = checkEs(value, [q.a, ...(q.alt || [])], {needArticle:true}); ok = r.ok; cur.accent = r.accent; }
  else { const built = cur.chosen.map(i => cur.tiles[i].w).join(' '); cur.picked = built; ok = [q.w, ...(q.alt || [])].some(s => normEs(s) === normEs(built)); }
  cur.ok = ok; GQ.answered = true;
  if (ok) GQ.score++; else recordMistake('grammar');
  render();
}
function gramNextQ(){
  GQ.i++; GQ.answered = false;
  if (GQ.i < GQ.qs.length){ render(); focusGram(); return; }
  const pct = GQ.score / GQ.qs.length, t = dayNum();
  if (GQ.mode === 'learn'){
    const prev = DB.gram[GQ.id] || {};
    if (pct >= .8) DB.gram[GQ.id] = {p:true, best:Math.max(prev.best || 0, pct), ivl:prev.ivl || 1, due:prev.p ? prev.due : t + 1, at:Date.now()};
    else DB.gram[GQ.id] = {...prev, best:Math.max(prev.best || 0, pct), at:Date.now()};
  } else for (const id of GQ.ids){
    const g = DB.gram[id], qs = GQ.qs.filter(x => x.gid === id), ok = qs.filter(x => x.ok).length / Math.max(1, qs.length);
    g.ivl = ok >= .8 ? Math.min(180, Math.round((g.ivl || 1) * 2.5)) : 1; g.due = t + g.ivl; g.at = Date.now();
  }
  GQ.phase = 'done'; save(); render(); window.scrollTo(0, 0);
}
VIEWS.grammar = () => {
  if (GQ) return gramHTML();
  const next = gramNext(), due = gramDue();
  return `<div class="page-head"><div><p class="eyebrow">Gramática</p><h1>Grammar</h1><p class="sub">${GRAMMAR.length} beginner points, one after another. Each is explained with examples, then drilled: pass with 80% to open the next. Passed points come back for short reviews.</p></div>
    ${due.length ? `<button class="btn primary" data-act="gram-review">Review ${plural(due.length, 'point')} →</button>` : ''}</div>
    <section class="panel"><div class="items">${GRAMMAR.map((g, i) => { const open = gramUnlocked(i), done = gramPassed(g.id);
      return `<button class="item ${done ? 'done' : g === next ? 'next' : ''}" data-act="gram" data-id="${g.id}" ${open ? '' : 'disabled'}><span class="n">${done ? '✓' : i + 1}</span><span class="t"><b>${esc(g.title)}</b><span>${esc(g.sub)}${done ? ` · best ${Math.round(DB.gram[g.id].best * 100)}%` : ''}</span></span><span class="muted">${open ? '→' : '🔒'}</span></button>`; }).join('')}</div></section>`;
};
function gramHTML(){
  const g = GQ.id ? GRAMMAR.find(x => x.id === GQ.id) : null;
  if (GQ.phase === 'learn') return `<div class="study" style="max-width:720px"><button class="linkbtn" data-act="gram-list">← All grammar</button>
    <div class="page-head" style="margin-top:10px"><div><p class="eyebrow">${esc(g.sub)}</p><h1>${esc(g.title)}</h1></div></div>
    <section class="panel explain">${g.explain}<div class="ex">${g.ex.map(([es, en]) => `<div><span class="es" lang="es">${esc(es)}</span><small>${esc(en)}</small></div>`).join('')}</div></section>
    <div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn primary big" data-act="gram-start">Practice (${g.q.length} questions) →</button></div></div>`;
  if (GQ.phase === 'done'){
    const pct = Math.round(GQ.score / GQ.qs.length * 100), pass = pct >= 80, nx = gramNext();
    const opened = GQ.mode === 'learn' && pass ? READER.filter(t => t.g.includes(GQ.id) && readUnlocked(t) && !DB.read[t.id]) : [];
    return `<div class="done"><span class="badge">${pass ? '✓' : '…'}</span><h1>${GQ.score} / ${GQ.qs.length}</h1>
      <p class="lead">${GQ.mode === 'review' ? (pass ? 'Still solid. These points come back later.' : 'A little rusty: they’ll come back tomorrow.') : pass ? `Passed! ${nx ? `Next up: ${esc(nx.title)}.` : 'That’s the whole path.'}` : 'You need 80% to pass. Read the examples again, then retry.'}</p>
      ${opened.length ? `<section class="panel"><b>New to read:</b> ${opened.map(t => `<button class="linkbtn" data-act="text" data-id="${t.id}">${esc(t.title)}</button>`).join(' · ')}</section>` : ''}
      <div class="row center">${GQ.mode === 'learn' && !pass ? `<button class="btn primary big" data-act="gram" data-id="${GQ.id}">Try again</button>` : nx && GQ.mode === 'learn' ? `<button class="btn primary big" data-act="gram" data-id="${nx.id}">Next point →</button>` : ''}<button class="btn big" data-act="gram-list">All grammar</button></div></div>`;
  }
  const cur = GQ.qs[GQ.i], q = cur.q, done = GQ.answered;
  let body = '';
  if (q.t === 'pick') body = `<div class="prompt"><div class="big" lang="es" style="font-size:clamp(24px,7cqw,34px)">${gapHTML(q.s, done ? cur.picked : '', done ? cur.ok : undefined)}</div>${q.en ? `<small>${esc(q.en)}</small>` : ''}</div>`;
  else if (q.t === 'type') body = `<div class="prompt"><div class="big en" style="font-size:clamp(20px,6cqw,28px)">${esc(q.p)}</div><small>Type it in Spanish</small></div>`;
  else body = `<div class="prompt" style="padding-bottom:4px"><div class="big en" style="font-size:clamp(18px,5cqw,24px)">${esc(q.en || 'Put the words in order')}</div><small>Tap the words in order</small></div>
    <div class="built">${cur.chosen.map((ti, k) => `<button data-act="gram-untile" data-k="${k}" ${done ? 'disabled' : ''}>${esc(cur.tiles[ti].w)}</button>`).join('')}</div>`;
  const controls = q.t === 'pick' ? `<div class="opts">${cur.opts.map(o => `<button class="opt ${!done ? '' : o === q.o[0] ? 'right' : o === cur.picked ? 'wrong' : 'dim'}" data-act="gram-pick" data-val="${esc(o)}" ${done ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>`
    : q.t === 'type' ? (done ? '' : `<form class="typein" data-form="gram"><input id="gtyped" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escribe aquí…" aria-label="Your answer"><button class="btn primary">Check</button></form>`)
    : `<div class="tiles-order">${cur.tiles.map((t, ti) => cur.chosen.includes(ti) ? '' : `<button data-act="gram-tile" data-i="${ti}" ${done ? 'disabled' : ''}>${esc(t.w)}</button>`).join('')}</div>${done ? '' : `<div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" data-act="gram-check" ${cur.chosen.length === cur.tiles.length ? '' : 'disabled'}>Check</button></div>`}`;
  const right = q.t === 'pick' ? q.s.replace('＿', q.o[0]) : q.t === 'type' ? q.a : q.w;
  const fb = done ? `<div class="verdict ${cur.ok ? 'ok' : 'no'}"><div class="head">${cur.ok ? '✓ Right' : '✗ Not quite'}</div>${cur.ok && !cur.accent ? '' : `<div class="ans" lang="es">${esc(right)}</div>`}${cur.accent ? '<div class="note">Counted, but watch the accent.</div>' : ''}${!cur.ok && q.t !== 'pick' ? `<div class="note">You wrote “${esc(cur.picked || '—')}”</div>` : ''}</div>
    <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" data-act="gram-next">${GQ.i < GQ.qs.length - 1 ? 'Next →' : 'Finish'}</button></div>` : '';
  return `<div class="study"><div class="study-top"><button class="icon-btn" data-act="gram-quit" aria-label="Leave">✕</button><div class="progress"><span style="width:${GQ.i / GQ.qs.length * 100}%"></span></div><span class="meta"><b>${GQ.i + 1}</b> / ${GQ.qs.length}</span></div>
    <div class="card" style="min-height:200px"><div class="card-top"><span class="pill">${GQ.mode === 'review' ? 'Grammar review' : esc(g.title)}</span><span class="meta">✓ ${GQ.score}</span></div>${body}</div>${controls}${fb}</div>`;
}

/* =========================================================
   Reading: short texts that open as you pass their grammar. Tap any word for its meaning.
   ========================================================= */
function startText(id){ RD = {id, phase:'read', sel:null, en:false, qi:0, qs:[], score:0}; view = 'read'; render(); window.scrollTo(0, 0); }
VIEWS.read = () => {
  if (RD) return textHTML();
  return `<div class="page-head"><div><p class="eyebrow">Lectura</p><h1>Reading</h1><p class="sub">Short texts that use the grammar you’ve passed. Tap any word to see what it means, then answer a few questions.</p></div></div>
    <section class="panel"><div class="items">${READER.map((t, i) => { const open = readUnlocked(t), r = DB.read[t.id];
      return `<button class="item ${r ? 'done' : ''}" data-act="text" data-id="${t.id}" ${open ? '' : 'disabled'}><span class="n">${r ? '✓' : i + 1}</span><span class="t"><b lang="es">${esc(t.title)}</b><span>${esc(t.en)}${open ? r ? ` · best ${r.best}/${t.q.length}` : '' : ` · opens with: ${t.g.filter(id => !gramPassed(id)).map(id => esc(GRAMMAR.find(g => g.id === id).title)).join(', ')}`}</span></span><span class="muted">${open ? '→' : '🔒'}</span></button>`; }).join('')}</div></section>`;
};
function textHTML(){
  const t = READER.find(x => x.id === RD.id);
  if (RD.phase === 'quiz' && RD.qi < RD.qs.length){
    const q = RD.qs[RD.qi], done = q.pick !== null;
    return `<div class="study"><div class="study-top"><button class="icon-btn" data-act="text-back" aria-label="Back to the text">✕</button><div class="progress"><span style="width:${RD.qi / RD.qs.length * 100}%"></span></div><span class="meta">${RD.qi + 1} / ${RD.qs.length}</span></div>
      <div class="card" style="min-height:180px"><div class="card-top"><span class="pill" lang="es">${esc(t.title)}</span></div><div class="prompt"><div class="big en" style="font-size:22px">${esc(q.q)}</div></div></div>
      <div class="opts">${q.opts.map(o => `<button class="opt ${!done ? '' : o === q.right ? 'right' : o === q.pick ? 'wrong' : 'dim'}" style="font-family:var(--ui);font-size:16px" data-act="text-pick" data-val="${esc(o)}" ${done ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
      ${done ? `<div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" data-act="text-next">${RD.qi < RD.qs.length - 1 ? 'Next →' : 'Finish'}</button></div>` : ''}</div>`;
  }
  if (RD.phase === 'quiz'){
    const nx = READER.find(x => readUnlocked(x) && !DB.read[x.id]);
    return `<div class="done"><span class="badge">✓</span><h1>${RD.score} / ${RD.qs.length}</h1><p class="lead">${RD.score === RD.qs.length ? '¡Excelente! You understood it all.' : 'Read it once more and the rest will click.'}</p>
      <div class="row center">${nx ? `<button class="btn primary big" data-act="text" data-id="${nx.id}">Next text →</button>` : ''}<button class="btn big" data-act="text" data-id="${t.id}">Read again</button><button class="btn big ghost" data-act="go" data-view="read">All texts</button></div></div>`;
  }
  let k = 0;
  const lines = t.lines.map(([es, en], li) => `<p class="line" lang="es">${es.split(/(\s+)/).map(part => {
    const word = C.tokens(part)[0];
    if (!word) return esc(part);
    const id = `${li}-${k++}`, i = part.indexOf(word);
    return `${esc(part.slice(0, i))}<button class="tok${RD.sel === id ? ' on' : ''}" data-act="tok" data-id="${id}" data-w="${esc(word)}">${esc(word)}</button>${esc(part.slice(i + word.length))}`;
  }).join('')}${RD.en ? `<small>${esc(en)}</small>` : ''}</p>`).join('');
  return `<div class="study" style="max-width:720px"><button class="linkbtn" data-act="go" data-view="read">← All texts</button>
    <div class="page-head" style="margin-top:10px"><div><p class="eyebrow">${esc(t.en)}</p><h1 lang="es">${esc(t.title)}</h1></div><button class="btn sm" data-act="text-en">${RD.en ? 'Hide' : 'Show'} English</button></div>
    <section class="panel text">${lines}</section>
    ${RD.selWord ? `<section class="panel glossbox"><span class="es" lang="es">${esc(RD.selWord)}</span> · <b>${esc(C.gloss(RD.selWord, t) || '—')}</b></section>` : ''}
    <div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn primary big" data-act="text-quiz">Questions →</button></div></div>`;
}

/* =========================================================
   Copybook: write Spanish line by line. Copy it as shown, or translate from English.
   ========================================================= */
let cbMode = 'copy';
function cbPool(mode){
  const sentences = [...GRAMMAR.filter(g => gramPassed(g.id)).flatMap(g => g.ex), ...READER.filter(t => DB.read[t.id]).flatMap(t => t.lines.map(([es, en]) => [es.replace(/^—/, ''), en.replace(/^"|"$/g, '')]))];
  if (mode === 'tr') return sentences;
  return [...sentences, ...learnedWords().map(w => [w.es, w.en])];
}
function newPage(){
  const pool = cbPool(cbMode);
  if (cbMode === 'tr' && pool.length < 4){ P = {empty:true}; return; }
  const src = pool.length >= 4 ? pool : WORDS.slice(0, 12).map(w => [w.es, w.en]);
  P = {mode:cbMode, lines:shuffle([...src]).slice(0, 6).map(([es, en]) => ({es, en})), checked:false, results:[], secs:0, start:Date.now()};
}
VIEWS.copybook = () => {
  if (!P || (P.mode !== cbMode && !P.checked && !P.empty)) newPage();
  if (P.empty && cbMode === 'tr') newPage();
  const head = `<div class="page-head"><div><p class="eyebrow">Cuaderno</p><h1>Copybook</h1><p class="sub">${cbMode === 'copy' ? 'Copy each line exactly, accents and all. It builds spelling and muscle memory.' : 'Write each English line in Spanish. Capitals and punctuation don’t matter; accents are pointed out.'}</p></div>
    <div class="seg"><button data-act="cb-mode" data-m="copy" class="${cbMode === 'copy' ? 'on' : ''}">Copy</button><button data-act="cb-mode" data-m="tr" class="${cbMode === 'tr' ? 'on' : ''}">Translate</button></div></div>`;
  if (P.empty) return head + '<section class="panel"><p class="empty">Translate pages use sentences from grammar you’ve passed and texts you’ve read. Pass your first grammar point to start.</p><button class="btn" data-act="go" data-view="grammar">Go to Grammar →</button></section>';
  const cb = allCb();
  const lines = P.lines.map((ln, i) => { const r = P.results[i];
    return `<div class="cb-line${r ? (r.ok ? ' ok' : ' no') : ''}"><div class="src${P.mode === 'tr' ? ' en' : ''}" ${P.mode === 'copy' ? 'lang="es"' : ''}>${esc(P.mode === 'copy' ? ln.es : ln.en)}</div>
      <input class="cb-in" data-i="${i}" lang="es" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="${i < P.lines.length - 1 ? 'next' : 'done'}" aria-label="Line ${i + 1}" ${P.checked ? 'readonly' : ''} value="${esc(P.answers?.[i] || '')}">
      ${r && (!r.ok || r.accent) ? `<div class="fix">${r.ok ? '✓ Counted, but watch the accents: ' : '✗ '}<b class="es" lang="es">${esc(ln.es)}</b></div>` : ''}</div>`; }).join('');
  const score = P.checked ? P.results.filter(r => r.ok).length : 0;
  return `${head}<div class="paper">${lines}</div>
    <div class="row" style="justify-content:space-between;margin-top:14px"><span class="muted" style="font-size:13px">${P.checked ? `<b>${score} / ${P.lines.length}</b> · ${fmtClock(P.secs)}` : `${plural(cb.pages, 'page')} so far${cb.lines ? ` · ${Math.round(cb.correct / cb.lines * 100)}% right` : ''}`}</span>
      ${P.checked ? '<button class="btn primary" data-act="cb-new">New page →</button>' : '<button class="btn primary" data-act="cb-check">Check page</button>'}</div>`;
};
function checkPage(){
  if (!P || P.checked || P.empty) return;
  P.answers = [...document.querySelectorAll('.cb-in')].map(i => i.value);
  P.results = P.lines.map((ln, i) => checkEs(P.answers[i], ln.es, {needArticle:true, dropPronoun:P.mode === 'tr'}));
  P.checked = true; P.secs = Math.round((Date.now() - P.start) / 1000);
  const ok = P.results.filter(r => r.ok).length;
  DB.cb.pages = (DB.cb.pages || 0) + 1; DB.cb.lines = (DB.cb.lines || 0) + P.lines.length; DB.cb.correct = (DB.cb.correct || 0) + ok; DB.cb.secs = (DB.cb.secs || 0) + P.secs;
  DB.cb.hist = [...(DB.cb.hist || []), {s:ok, t:P.lines.length, d:dayNum(), secs:P.secs}].slice(-100);
  for (const r of P.results) if (!r.ok) recordMistake('copybook');
  save(); render();
}

/* =========================================================
   Cold Learn: everything you've learned, one at a time in random order, with no hints.
   Meaning (Spanish → English) or Spanish (English → Spanish); a random 20, 50 or all. Reviews are never touched.
   ========================================================= */
let clDeck = 'r', clSize = 20;
const CL_SIZES = [20, 50];
const clOk = r => r.ok || r.kind === 'typo';
const clCls = r => !clOk(r) ? 's-learn' : r.slow ? 's-young' : 's-master';
const clBetter = (a, b) => !b || (a.t !== b.t ? a.t > b.t : a.s !== b.s ? a.s > b.s : a.secs < b.secs);
const clBest = r => r && isNum(r.bt) ? {s:r.bs, t:r.bt, secs:r.bsecs} : null;
function clScope(){
  const pool = learnedWords().map(w => w.es), n = clSize && pool.length > clSize ? clSize : pool.length;
  return {pool, n, key:clDeck + (n < pool.length ? n : '')};
}
function openCold(){ CL = {phase:'intro', from:['words'].includes(view) ? view : 'home'}; view = 'cold'; render(); window.scrollTo(0, 0); }
function startCold(){
  const s = clScope();
  if (!s.n) return;
  CL = {phase:'test', from:CL?.from || 'home', deck:clDeck, key:s.key, full:s.n === s.pool.length, ids:shuffle([...s.pool]).slice(0, s.n).map(es => clDeck + ':' + es),
    i:0, res:[], prev:DB.cold[s.key] || null, shownAt:performance.now(), firstKey:null};
  render(); window.scrollTo(0, 0); $('cltyped')?.focus();
}
function clQuit(){ const back = CL?.from || 'home'; CL = null; view = back; render(); window.scrollTo(0, 0); }
const clSecs = () => sum(CL.res.map(r => r.ms)) / 1000 + (CL.phase === 'test' ? (performance.now() - CL.shownAt) / 1000 : 0);
const clAnswer = c => c.kind === 'r' ? c.w.en : c.w.es;
const clScoreHTML = () => { const ok = CL.res.filter(clOk).length; return `<span style="color:var(--green)">✓ ${ok}</span>${CL.res.length - ok ? ` <span style="color:var(--red)">✗ ${CL.res.length - ok}</span>` : ''}`; };
const clTip = r => clOk(r) ? `${fmtSecs(r.rt)}${r.slow ? ' · slow' : ''}${r.kind === 'typo' ? ' · forgiven' : ''}` : `you typed ${r.text ? esc(r.text) : 'nothing'}`;
function clSlotHTML(i){
  const r = CL.res[i];
  if (!r) return `<i class="cl-slot${i === CL.i ? ' cur' : ''}"></i>`;
  const c = CARDS[r.id];
  return `<i class="cl-slot ${clCls(r)}" data-tip="${esc(c.w.es)} · ${esc(c.w.en)} · ${clTip(r)}"></i>`;
}
function clLastHTML(){
  const r = CL.res[CL.res.length - 1];
  if (!r) return `<span class="muted">${CL.deck === 'r' ? 'Type what each word means.' : 'Type each word in Spanish.'}</span>`;
  const c = CARDS[r.id], shown = c.kind === 'r' ? c.w.es : firstMeaning(c.w.en);
  return r.ok ? `<span class="chipt${r.slow ? ' slow' : ''}">✓ ${esc(shown)} · ${esc(clAnswer(c))}</span>` : `<span class="chipt no">✗ ${esc(shown)} is ${esc(clAnswer(c))}${r.text ? ` — you typed “${esc(r.text)}”` : ''}</span>`;
}
function clSubmit(raw, skip){
  if (!CL || CL.phase !== 'test') return;
  const id = CL.ids[CL.i], c = CARDS[id], now = performance.now(), text = String(raw || '').trim();
  if (!text && !skip && now - CL.shownAt < 400) return;
  const j = judge(c, text), rt = ((CL.firstKey ?? now) - CL.shownAt) / 1000, target = +DB.settings.speed;
  CL.res.push({id, text, ok:j.ok, kind:'know', rt, ms:Math.min(60000, now - CL.shownAt), slow:j.ok && target > 0 && rt > target + (c.kind === 'p' ? 2 : 0), hint:j.hint});
  if (!j.ok){ recordMistake('cold'); save(true); }
  CL.i++; CL.shownAt = performance.now(); CL.firstKey = null;
  if (CL.i >= CL.ids.length) return clFinish();
  announce(`${j.ok ? 'Right' : `No, ${clAnswer(c)}`}. Next.`);
  const k = $('clPrompt');
  if (!k) return render();
  k.innerHTML = promptHTML(CARDS[CL.ids[CL.i]], true);
  $('clCount').textContent = CL.i + 1;
  $('clBar').style.width = CL.i / CL.ids.length * 100 + '%';
  $('clScore').innerHTML = clScoreHTML();
  $('clLast').innerHTML = clLastHTML();
  const slots = document.querySelectorAll('.cl-slot');
  slots[CL.i]?.classList.add('cur');
  if (slots[CL.i - 1]) slots[CL.i - 1].outerHTML = clSlotHTML(CL.i - 1);
  $('cltyped').value = '';
}
function clFinish(){
  CL.phase = 'done'; CL.secs = Math.max(1, Math.round(sum(CL.res.map(r => r.ms)) / 1000)); CL.at = Date.now();
  clSave(); render(); window.scrollTo(0, 0);
}
function clSave(){
  const run = {s:CL.res.filter(clOk).length, t:CL.ids.length, secs:CL.secs, at:CL.at}, best = clBetter(run, clBest(CL.prev)) ? run : clBest(CL.prev);
  DB.cold[CL.key] = {s:run.s, t:run.t, secs:run.secs, at:run.at, bs:best.s, bt:best.t, bsecs:best.secs};
  save();
}
VIEWS.cold = () => {
  if (!CL) return VIEWS.home();
  if (CL.phase === 'intro'){
    const s = clScope(), rec = DB.cold[s.key], best = clBest(rec), N = s.pool.length;
    const what = s.n === N ? `all ${plural(N, 'word')} you’ve learned` : `a random ${s.n} of the ${N} words you’ve learned`;
    return `<div class="done"><span class="badge">❄</span><h1>Cold Learn</h1>
      <p class="lead">Test yourself on ${what}, one at a time in random order. No hints, no warm-up: ${clDeck === 'r' ? 'type what each one means' : 'see the English, write the Spanish'}.</p>
      <div class="opts-col"><div class="seg"><button data-act="cl-deck" data-d="r" class="${clDeck === 'r' ? 'on' : ''}">Meaning</button><button data-act="cl-deck" data-d="p" class="${clDeck === 'p' ? 'on' : ''}">Spanish</button></div>
        ${N > CL_SIZES[0] ? `<div class="seg">${CL_SIZES.filter(x => x < N).map(x => `<button data-act="cl-size" data-n="${x}" class="${s.n === x ? 'on' : ''}">${x}</button>`).join('')}<button data-act="cl-size" data-n="0" class="${s.n === N ? 'on' : ''}">All · ${N}</button></div>` : ''}</div>
      <div class="stats3"><div class="panel stat"><div class="k">In the test</div><div class="v">${s.n}</div></div>
        <div class="panel stat"><div class="k">Last time</div><div class="v">${rec ? `${rec.s}<small>/${rec.t}</small>` : '–'}</div></div>
        <div class="panel stat"><div class="k">Best</div><div class="v">${best ? `${best.s}<small>/${best.t}</small>` : '–'}</div></div></div>
      <div class="row center"><button class="btn primary big" data-act="cl-start">Start →</button><button class="btn big ghost" data-act="cl-quit">Back</button></div>
      <p class="muted" style="font-size:12.5px;margin-top:14px">Your reviews aren’t affected.</p></div>`;
  }
  if (CL.phase === 'done'){
    const n = CL.ids.length, right = CL.res.filter(clOk).length, pct = Math.round(right / n * 100);
    const wrong = CL.res.map((r, i) => [r, i]).filter(([r]) => !r.ok), missed = wrong.filter(([r]) => !clOk(r)).length;
    const prevBest = clBest(CL.prev), newBest = !!prevBest && clBetter({s:right, t:n, secs:CL.secs}, prevBest);
    return `<div class="done"><span class="badge">${pct >= 80 ? '✓' : '…'}</span><h1>${right} / ${n}</h1>
      <p class="lead">${pct === 100 ? `Every one, cold.${CL.full ? ' That’s all of them.' : ''}` : pct >= 80 ? 'Solid. Just a few to tidy up.' : 'These are the ones to work on. Relearn them, then try again tomorrow.'}${newBest ? ' <b style="color:var(--green)">New best!</b>' : ''}</p>
      <div class="stats4"><div class="panel stat"><div class="k">Right</div><div class="v">${pct}<small>%</small></div></div><div class="panel stat"><div class="k">Time</div><div class="v">${fmtClock(CL.secs)}</div></div>
        <div class="panel stat"><div class="k">Per word</div><div class="v">${fmtSecs(CL.secs / n)}</div></div><div class="panel stat"><div class="k">Last time</div><div class="v">${CL.prev ? `${CL.prev.s}<small>/${CL.prev.t}</small>` : '–'}</div></div></div>
      <section class="panel"><h2>Your results</h2><div class="chips" style="margin-top:8px">${CL.res.map(r => `<button class="chip ${clCls(r)}" data-act="word" data-id="${esc(CARDS[r.id].w.es)}" data-tip="${clTip(r)}" lang="es">${esc(CARDS[r.id].w.es)}</button>`).join('')}</div></section>
      ${wrong.length ? `<section class="panel"><h2>Wrong answers</h2>${wrong.map(([r, i]) => { const c = CARDS[r.id]; return `<div class="cl-row"><span><b lang="es">${esc(c.w.es)}</b> · ${esc(c.w.en)}<br><span class="muted">you typed ${r.text ? `“${esc(r.text)}”` : 'nothing'}</span></span>
        ${r.text ? `<div class="forgive"><button class="${r.kind === 'typo' ? 'on' : ''}" data-act="cl-typo" data-i="${i}">${c.kind === 'r' ? '✓ My answer was right' : '⌨ It was a typo'}</button></div>` : ''}</div>`; }).join('')}</section>` : ''}
      <div class="row center">${missed ? `<button class="btn primary big" data-act="cl-relearn">↺ Relearn the ${missed} missed</button>` : ''}<button class="btn big${missed ? '' : ' primary'}" data-act="cl-start">Test again</button><button class="btn big ghost" data-act="cl-quit">Done</button></div></div>`;
  }
  const c = CARDS[CL.ids[CL.i]], n = CL.ids.length;
  return `<div class="study"><div class="study-top"><button class="icon-btn" data-act="cl-quit" aria-label="Stop the test">✕</button><div class="progress"><span id="clBar" style="width:${CL.i / n * 100}%"></span></div><span class="meta"><b id="clCount">${CL.i + 1}</b> / ${n} · <span id="clTime">${fmtClock(Math.floor(clSecs()))}</span></span></div>
    <div class="card"><div class="card-top"><span class="pill">Cold Learn · ${CL.deck === 'r' ? 'Meaning' : 'Spanish'}</span><span class="meta" id="clScore">${clScoreHTML()}</span></div><div class="prompt" id="clPrompt">${promptHTML(c)}</div></div>
    <form class="typein" data-form="cold"><input id="cltyped" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="next" placeholder="${CL.deck === 'r' ? 'Type the meaning…' : 'Escribe en español…'}" aria-label="Your answer"><button class="btn primary">Check</button></form>
    <div class="cl-under"><div id="clLast" class="cl-last">${clLastHTML()}</div><button class="btn ghost sm" data-act="cl-skip">Don’t know</button></div>
    <div class="cl-sheet" aria-hidden="true">${CL.ids.map((_, i) => clSlotHTML(i)).join('')}</div>
    <p class="keys"><kbd>Enter</kbd> check · <kbd>Enter</kbd> on an empty box: don’t know · <kbd>Esc</kbd> stop</p></div>`;
};

/* =========================================================
   Stats
   ========================================================= */
const ACTIVITIES = {review:'Reviews', lesson:'Lessons', practice:'Practice', grammar:'Grammar', reading:'Reading', copybook:'Copybook', cold:'Cold Learn', sounds:'Sounds'};
VIEWS.stats = () => {
  const all = allDays(), today = dayNum(), days = Object.entries(all).map(([k, v]) => [+k, v]);
  const ms = sum(days.map(([, v]) => v.ms || 0)), week = sum(days.filter(([k]) => k > today - 7).map(([, v]) => v.ms || 0));
  const recent = days.filter(([k]) => k > today - 30), rv = sum(recent.map(([, v]) => v.r || 0)), rc = sum(recent.map(([, v]) => v.c || 0));
  const counts = {learn:0, young:0, master:0}; for (const id of R_IDS){ const s = strength(id); if (s !== 'new') counts[s]++; }
  const act = Object.fromEntries(Object.keys(ACTIVITIES).map(k => [k, 0])); for (const [, v] of days) for (const k of Object.keys(act)) act[k] += (v.act || {})[k] || 0;
  const actMax = Math.max(1, ...Object.values(act));
  const start = today - 7 * 17 - new Date(today * C.DAY).getUTCDay();
  const heat = Array.from({length:today - start + 1}, (_, i) => { const t = start + i, m = (all[t]?.ms || 0) / 60000; return `<i class="${m >= 30 ? 'l3' : m >= 10 ? 'l2' : m > 0 || all[t]?.r ? 'l1' : ''}" title="${Math.round(m)} min"></i>`; }).join('');
  const mist = {}; for (const src of [DB.mist, ...Object.values(DB.peers || {}).map(p => p.mist || {})]) for (const [k, n] of Object.entries(src)) mist[k] = (mist[k] || 0) + n;
  const cb = allCb(), cold = DB.cold;
  return `<div class="page-head"><div><p class="eyebrow">Estadísticas</p><h1>Stats</h1></div></div>
    <div class="stats4"><div class="panel stat"><div class="k">Streak</div><div class="v">${streak()}<small> days</small></div></div><div class="panel stat"><div class="k">Time studied</div><div class="v">${fmtHours(ms / 1000)}</div><small class="muted">${fmtHours(week / 1000)} this week</small></div>
      <div class="panel stat"><div class="k">Words learned</div><div class="v">${learnedWords().length}<small>/${WORDS.length}</small></div></div><div class="panel stat"><div class="k">Recall · 30 days</div><div class="v">${rv ? Math.round(rc / rv * 100) + '<small>%</small>' : '–'}</div></div></div>
    <div class="grid2">
      <section class="panel"><h2>Activity</h2><p class="sub">Last 18 weeks</p><div class="heat">${heat}</div></section>
      <section class="panel"><h2>Words</h2><p class="sub">Mastered = remembered over 3+ weeks</p><div class="bars">${[['Learning', counts.learn, 'var(--red)'], ['Young', counts.young, 'var(--gold)'], ['Mastered', counts.master, 'var(--green)']].map(([l, n, c]) => `<div><span>${l}</span>${meter([[n / WORDS.length * 100, c]])}<b>${n}</b></div>`).join('')}</div></section>
      <section class="panel"><h2>Where the time went</h2><div class="bars">${Object.entries(act).sort((a, b) => b[1] - a[1]).map(([k, s]) => `<div><span>${ACTIVITIES[k]}</span>${meter([[s / actMax * 100, 'var(--blue)']])}<b>${fmtHours(s)}</b></div>`).join('')}</div></section>
      <section class="panel"><h2>Everything else</h2><div class="bars">
        <div><span>Grammar passed</span>${meter([[GRAMMAR.filter(g => gramPassed(g.id)).length / GRAMMAR.length * 100, 'var(--blue)']])}<b>${GRAMMAR.filter(g => gramPassed(g.id)).length}/${GRAMMAR.length}</b></div>
        <div><span>Texts read</span>${meter([[Object.keys(DB.read).length / READER.length * 100, 'var(--accent)']])}<b>${Object.keys(DB.read).length}/${READER.length}</b></div>
        <div><span>Sounds guides</span>${meter([[Object.keys(DB.sounds).length / SOUNDS.length * 100, 'var(--accent)']])}<b>${Object.keys(DB.sounds).length}/${SOUNDS.length}</b></div></div>
        <p class="muted" style="font-size:13px;margin:12px 0 0">Copybook: ${plural(cb.pages, 'page')}${cb.lines ? `, ${Math.round(cb.correct / cb.lines * 100)}% of lines right` : ''}. Cold Learn best: ${['r', 'p'].map(d => { const b = Object.entries(cold).filter(([k]) => k[0] === d).map(([, r]) => clBest(r)).filter(Boolean).sort((a, b) => b.s / b.t - a.s / a.t)[0]; return `${d === 'r' ? 'meaning' : 'Spanish'} ${b ? `${b.s}/${b.t}` : '–'}`; }).join(', ')}. Mistakes logged: ${sum(Object.values(mist))}.</p></section>
    </div>`;
};

/* =========================================================
   Settings, backup and sync
   ========================================================= */
const SYNC_SETTINGS = ['newPerDay', 'lessonSize', 'production', 'speed'];
const segSet = (key, opts) => `<div class="seg">${opts.map(([v, l]) => `<button data-act="set" data-key="${key}" data-val="${v}" class="${String(DB.settings[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
VIEWS.settings = () => `<div class="page-head"><div><p class="eyebrow">Ajustes</p><h1>Settings</h1></div></div>
  <div class="stack">
    <section class="panel"><h2>Learning</h2>
      <div class="set-row"><div class="t"><b>New words per day</b><span>Each one adds a few minutes of reviews over the next weeks.</span></div>${segSet('newPerDay', [[5, '5'], [10, '10'], [15, '15'], [20, '20']])}</div>
      <div class="set-row"><div class="t"><b>Words per lesson</b></div>${segSet('lessonSize', [[3, '3'], [5, '5'], [8, '8']])}</div>
      <div class="set-row"><div class="t"><b>Practice saying it in Spanish</b><span>Once you know a word’s meaning, you’re also asked to write it in Spanish.</span></div>${segSet('production', [[true, 'On'], [false, 'Off']])}</div>
      <div class="set-row"><div class="t"><b>Speed target</b><span>A right answer slower than this is suggested as Hard.</span></div>${segSet('speed', [['0', 'Off'], ['3', '3s'], ['5', '5s'], ['8', '8s']])}</div>
    </section>
    <section class="panel"><h2>Look</h2><div class="set-row"><div class="t"><b>Theme</b></div>${segSet('theme', [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']])}</div></section>
    <section class="panel" id="syncPanel">${syncPanelHTML()}</section>
    <section class="panel"><h2>Backup</h2><p class="sub">Your progress is saved in this browser. Keep a copy, or move it to another device.</p>
      <div class="row"><button class="btn" data-act="export">Export backup</button><button class="btn" data-act="import">Import backup</button><button class="btn danger" data-act="reset">Reset all progress</button></div>
      <input type="file" id="importFile" accept="application/json,.json" hidden></section>
    <p class="muted" style="font-size:12.5px;text-align:center">Camino · © 2026 YukiiShiroi · <a href="privacy.html">Privacy</a></p>
  </div>`;
function applyTheme(){
  const t = DB.settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = t;
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name=theme-color]').content = dark ? '#15120f' : '#f5efe4';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

// Sync across devices through a secret Gist on the learner's own GitHub account. The token lives in its own storage key.
var syncReady = false, syncDirty = false, timeDirty = false;
const SYNC_KEY = 'camino.sync', SYNC_FILE = 'camino-progress.json';
let SY = (() => { if (SELFTEST) return {}; try{ return JSON.parse(localStorage.getItem(SYNC_KEY)) || {}; }catch{ return {}; } })();
SY.dev ||= 'd' + Math.random().toString(36).slice(2, 10);
let syncing = null, syncAgain = false, syncTimer = 0;
function saveSync(){ if (SELFTEST) return; try{ localStorage.setItem(SYNC_KEY, JSON.stringify(SY)); }catch{} }
saveSync();
const syncConnected = () => !!(SY.token && SY.gist);
function deviceName(){
  const ua = navigator.userAgent;
  return /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows PC' : /Mac/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux PC' : 'Device';
}
function markSyncDirty(){ if (!syncReady || !syncConnected()) return; syncDirty = true; clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 8000); }
async function gh(path, opts = {}){
  let res;
  try{ res = await fetch('https://api.github.com' + path, {...opts, cache:'no-store', headers:{Accept:'application/vnd.github+json', Authorization:`Bearer ${SY.token}`, 'X-GitHub-Api-Version':'2022-11-28', ...(opts.body ? {'Content-Type':'application/json'} : {})}}); }
  catch{ const e = new Error('Offline — will sync when you’re back online.'); e.offline = true; throw e; }
  if (!res.ok){
    const e = new Error(res.status === 401 ? 'GitHub didn’t accept the token. It may have expired — disconnect and connect with a new one.' : res.status === 403 || res.status === 429 ? 'GitHub is limiting requests right now. It’ll try again shortly.'
      : res.status === 404 ? 'The sync file is missing on GitHub. Disconnect and connect again to make a new one.' : `GitHub returned an error (${res.status}).`);
    e.status = res.status; throw e;
  }
  return res.status === 204 ? null : res.json();
}
// Cards: the most recently studied copy wins. Grammar: most recent. Reading: best score. Logs: one per device.
function mergeRemote(R){
  R = cleanDB(R);
  if (!R) return;
  if ((DB.resetAt || 0) > (R.resetAt || 0)){ DB.peers = {}; return; }
  if ((R.resetAt || 0) > (DB.resetAt || 0)){ const keep = DB.settings; DB = merge(defaults(), {resetAt:R.resetAt}); DB.settings = keep; }
  for (const [id, b] of Object.entries(R.cards)){ const a = DB.cards[id]; if (!a || (b.u || 0) > (a.u || 0)) DB.cards[id] = b; }
  for (const [id, b] of Object.entries(R.gram)){ const a = DB.gram[id]; if (!a || (b.at || 0) > (a.at || 0)) DB.gram[id] = b; }
  for (const [id, b] of Object.entries(R.read)){ const a = DB.read[id]; DB.read[id] = a ? {n:Math.max(a.n || 0, b.n || 0), best:Math.max(a.best || 0, b.best || 0), at:Math.max(a.at || 0, b.at || 0)} : b; }
  for (const id of Object.keys(R.sounds)) DB.sounds[id] = true;
  for (const [k, b] of Object.entries(R.cold)){
    const a = DB.cold[k], last = !a || (b.at || 0) > (a.at || 0) ? b : a, best = [clBest(a), clBest(b)].filter(Boolean).reduce((x, y) => clBetter(y, x) ? y : x, null);
    DB.cold[k] = {...pickNums(last, ['s', 't', 'secs', 'at']), ...(best ? {bs:best.s, bt:best.t, bsecs:best.secs} : {})};
  }
  const nd = R.newDay;
  if (nd && nd.d === DB.newDay.d) DB.newDay.n = Math.max(DB.newDay.n || 0, nd.n || 0); else if (nd && nd.d > DB.newDay.d) DB.newDay = {...nd};
  if ((R.settingsT || 0) > (DB.settingsT || 0) && R.settings){ for (const k of SYNC_SETTINGS) if (R.settings[k] !== undefined) DB.settings[k] = R.settings[k]; DB.settingsT = R.settingsT; }
  DB.peers = Object.fromEntries(Object.entries(R.ledgers || {}).filter(([dev]) => dev !== SY.dev));
}
function buildSyncFile(R){
  const keepOthers = R && (R.resetAt || 0) >= (DB.resetAt || 0);
  return {app:'camino', v:1, resetAt:DB.resetAt || 0, cards:DB.cards, gram:DB.gram, read:DB.read, sounds:DB.sounds, cold:DB.cold, newDay:DB.newDay,
    settings:Object.fromEntries(SYNC_SETTINGS.map(k => [k, DB.settings[k]])), settingsT:DB.settingsT || 0,
    ledgers:{...(keepOthers ? R.ledgers || {} : {}), [SY.dev]:{name:deviceName(), at:Date.now(), days:DB.days, mist:DB.mist, cb:{...DB.cb, hist:(DB.cb.hist || []).slice(-50)}}}};
}
function stableJSON(v){
  if (Array.isArray(v)) return `[${v.map(stableJSON).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => JSON.stringify(k) + ':' + stableJSON(v[k])).join(',')}}`;
  return JSON.stringify(v);
}
const syncSig = f => stableJSON({...f, ledgers:Object.fromEntries(Object.entries(f.ledgers || {}).map(([k, v]) => [k, {...v, at:0}]))});
async function readSyncFile(){
  const g = await gh(`/gists/${SY.gist}`), f = g.files && g.files[SYNC_FILE];
  if (!f) return null;
  const text = f.truncated ? await (await fetch(f.raw_url, {cache:'no-store'})).text() : f.content;
  try{ return JSON.parse(text || 'null'); }catch{ return null; }
}
async function syncNow(){
  if (!syncConnected()) return;
  if (syncing){ syncAgain = true; return syncing; }
  clearTimeout(syncTimer);
  const token = SY.token;
  syncing = (async () => {
    SY.state = 'syncing'; updateSyncUI();
    try{
      const raw = await readSyncFile(), R = raw ? cleanDB(raw) : null;
      if (SY.token !== token) return;
      if (R) mergeRemote(raw);
      catchUpProduction();
      const file = buildSyncFile(R);
      if (!R || syncSig(file) !== syncSig({...raw, ledgers:R.ledgers})) await gh(`/gists/${SY.gist}`, {method:'PATCH', body:JSON.stringify({files:{[SYNC_FILE]:{content:JSON.stringify(file)}}})});
      syncDirty = timeDirty = false; SY.last = Date.now(); SY.err = null; SY.state = 'ok';
      save(true);
      if (['home', 'stats', 'words', 'settings'].includes(view)) render();
    }catch(e){ if (SY.token !== token) return; SY.err = e.message; SY.state = e.offline ? 'offline' : 'error'; }
    saveSync(); updateSyncUI();
  })();
  await syncing; syncing = null;
  if (syncAgain){ syncAgain = false; return syncNow(); }
}
async function syncConnect(token){
  token = (token || '').trim();
  if (!token) return toast('Paste your GitHub token first');
  const prev = {...SY};
  SY.token = token; SY.state = 'connecting'; SY.err = null; updateSyncUI();
  try{
    const me = await gh('/user');
    let gist = null;
    for (let page = 1; page <= 10 && !gist; page++){ const list = await gh(`/gists?per_page=100&page=${page}`); gist = list.find(g => g.files && g.files[SYNC_FILE]); if (list.length < 100) break; }
    if (!gist) gist = await gh('/gists', {method:'POST', body:JSON.stringify({description:'Camino progress — kept in sync by the Camino app', public:false, files:{[SYNC_FILE]:{content:JSON.stringify(buildSyncFile(null))}}})});
    Object.assign(SY, {gist:gist.id, login:me.login, state:'ok'}); saveSync();
    await syncNow();
    if (!SY.err) toast(`Sync connected as @${me.login} ✓`);
  }catch(e){
    SY = {dev:prev.dev, state:'error', err:e.status === 401 ? 'GitHub didn’t accept that token. Check you copied all of it.' : e.status === 404 || e.status === 403 ? 'That token can’t use Gists. Tick the “gist” box when you create it.' : e.message};
    saveSync(); updateSyncUI();
  }
}
function syncDisconnect(){ if (!confirm('Stop syncing on this device? Your progress stays here, and nothing is deleted on GitHub.')) return; SY = {dev:SY.dev}; saveSync(); updateSyncUI(); toast('Sync turned off on this device'); }
const agoText = t => { const s = Math.round((Date.now() - t) / 1000); return s < 45 ? 'just now' : s < 3600 ? `${Math.round(s / 60)} min ago` : s < 86400 ? `${Math.round(s / 3600)} h ago` : `${Math.round(s / 86400)} d ago`; };
function updateSyncUI(){
  const btn = $('syncBtn');
  if (btn){
    if (!btn.innerHTML) btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 7 18z"/></svg>';
    btn.hidden = !syncConnected(); btn.className = `icon-btn sync-${SY.state || 'ok'}`;
    btn.title = SY.state === 'syncing' ? 'Syncing…' : SY.err ? `Sync problem: ${SY.err}` : SY.last ? `Synced ${agoText(SY.last)} · tap to sync now` : 'Tap to sync now';
  }
  const panel = $('syncPanel');
  if (panel && !panel.contains(document.activeElement)) panel.innerHTML = syncPanelHTML();
}
function syncPanelHTML(){
  if (!syncConnected()) return `<h2>Sync across devices</h2><p class="sub">Keep your phone and computer in step, using a private file on your own GitHub account. Set it up once on each device.</p>
    <ol class="steps"><li><a href="https://github.com/settings/tokens/new?scopes=gist&description=Camino%20sync" target="_blank" rel="noopener">Create a GitHub token</a> — only <b>gist</b> is ticked. Pick an expiration, generate it and copy it.</li><li>Paste it below and connect. Do the same on your other device (the same token works).</li></ol>
    <form class="typein" data-form="sync"><input type="password" id="syncToken" placeholder="Paste your token (ghp_…)" autocomplete="off" spellcheck="false" aria-label="GitHub token"><button class="btn primary"${SY.state === 'connecting' ? ' disabled' : ''}>${SY.state === 'connecting' ? 'Connecting…' : 'Connect'}</button></form>
    ${SY.err ? `<p class="sync-err">${esc(SY.err)}</p>` : ''}<p class="muted" style="font-size:12px;margin:10px 0 0">The token stays in this browser and can only read and write your Gists. Revoke it any time on GitHub.</p>`;
  const devices = [[SY.dev, {name:deviceName()}], ...Object.entries(DB.peers || {})];
  return `<h2>Sync across devices</h2><p><b>${SY.state === 'syncing' ? 'Syncing…' : SY.err ? 'Sync problem' : 'Synced'}</b> <span class="muted">as @${esc(SY.login || '')}${SY.last ? ` · ${agoText(SY.last)}` : ''}</span></p>
    ${SY.err ? `<p class="sync-err">${esc(SY.err)}</p>` : ''}<p class="muted" style="font-size:13px">${devices.map(([id, l]) => `${esc(l.name || 'Device')}${id === SY.dev ? ' (this device)' : ` · ${agoText(l.at || 0)}`}`).join(' · ')}</p>
    <div class="row"><button class="btn" data-act="sync-now">Sync now</button><button class="btn danger" data-act="sync-off">Disconnect this device</button></div>`;
}
setInterval(() => { if (syncConnected() && !document.hidden && (syncDirty || timeDirty)) syncNow(); }, 180000);
addEventListener('online', () => { if (syncConnected()) syncNow(); });

/* =========================================================
   Study clock: counts a second while you're in an activity, the app is visible, and you've done something in the last 90 s
   ========================================================= */
let lastActivity = Date.now(), ticks = 0;
function currentActivity(){
  if (view === 'study' && S) return S.practice ? 'practice' : 'review';
  if (view === 'lesson' && L) return 'lesson';
  if (view === 'grammar' && GQ) return 'grammar';
  if (view === 'read' && RD) return 'reading';
  if (view === 'copybook' && P && !P.checked && !P.empty) return 'copybook';
  if (view === 'cold' && CL && CL.phase === 'test') return 'cold';
  if (view === 'sounds' && SD) return 'sounds';
  return null;
}
setInterval(() => {
  const kind = currentActivity();
  if (kind === 'cold'){ const el = $('clTime'); if (el) el.textContent = fmtClock(Math.floor(clSecs())); }
  if (!kind || document.hidden || Date.now() - lastActivity > 90000) return;
  const d = dayLog(dayNum());
  d.ms = (d.ms || 0) + 1000; d.act ||= {}; d.act[kind] = (d.act[kind] || 0) + 1;
  if (++ticks % 15 === 0){ save(true); timeDirty = true; }
}, 1000);
['keydown', 'pointerdown', 'input', 'scroll'].forEach(ev => addEventListener(ev, () => { lastActivity = Date.now(); }, {passive:true, capture:true}));
document.addEventListener('visibilitychange', () => { if (document.hidden){ save(true); if (syncConnected() && (syncDirty || timeDirty)) syncNow(); } else if (syncConnected() && Date.now() - (SY.last || 0) > 60000) syncNow(); });
addEventListener('pagehide', () => save(true));

/* =========================================================
   Events
   ========================================================= */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const a = el.dataset.act, id = el.dataset.id;
  if (a === 'close'){ if (e.target === el || el.tagName === 'BUTTON') closeModal(); return; }
  if (a === 'go') go(el.dataset.view);
  if (a === 'study') startStudy(false);
  if (a === 'practice') startStudy(true);
  if (a === 'study-quit'){ if (S && S.done) finishStudy(); else go('home'); }
  if (a === 'grade') grade(+el.dataset.g);
  if (a === 'forgive' && S && S.typed && !S.typed.ok){ S.typed.kind = S.typed.kind === 'typo' ? 'know' : 'typo'; drawVerdict(); }
  if (a === 'lesson') startLesson();
  if (a === 'lesson-next'){ if (L.i < L.items.length - 1){ L.i++; render(); } else lessonQuizStart(); }
  if (a === 'lesson-back' && L.i > 0){ L.i--; render(); }
  if (a === 'lesson-continue') lessonNextQ();
  if (a === 'lesson-quit' && (!L || L.phase === 'teach' || confirm('Leave this lesson? These words stay new.'))) go('home');
  if (a === 'word'){ openModal(wordSheetHTML(id)); }
  if (a === 'sound'){ SD = {id, q:-1, score:0, picked:null}; view = 'sounds'; render(); window.scrollTo(0, 0); }
  if (a === 'sound-list'){ SD = null; render(); window.scrollTo(0, 0); }
  if (a === 'sound-quiz'){ Object.assign(SD, {q:0, score:0, picked:null}); soundOrder(); render(); window.scrollTo(0, 0); }
  if (a === 'sound-pick' && SD.picked === null){ const s = SOUNDS.find(x => x.id === SD.id); SD.picked = el.dataset.val; if (SD.picked === s.quiz[SD.q][1]) SD.score++; else recordMistake('sounds'); render(); }
  if (a === 'sound-next'){ const s = SOUNDS.find(x => x.id === SD.id); SD.q++; SD.picked = null; if (SD.q < s.quiz.length) soundOrder(); else if (SD.score === s.quiz.length){ DB.sounds[s.id] = true; save(); } render(); window.scrollTo(0, 0); }
  if (a === 'sound-back'){ SD.q = -1; render(); }
  if (a === 'gram') startGrammar(id);
  if (a === 'gram-list'){ GQ = null; view = 'grammar'; render(); window.scrollTo(0, 0); }
  if (a === 'gram-review') startGramReview();
  if (a === 'gram-start'){ GQ.phase = 'quiz'; render(); window.scrollTo(0, 0); focusGram(); }
  if (a === 'gram-quit' && (GQ.mode === 'review' || confirm('Leave this grammar practice?'))){ GQ = null; render(); }
  if (a === 'gram-pick') gramAnswer(el.dataset.val);
  if (a === 'gram-tile' && !GQ.answered){ GQ.qs[GQ.i].chosen.push(+el.dataset.i); render(); }
  if (a === 'gram-untile' && !GQ.answered){ GQ.qs[GQ.i].chosen.splice(+el.dataset.k, 1); render(); }
  if (a === 'gram-check') gramAnswer();
  if (a === 'gram-next') gramNextQ();
  if (a === 'text') startText(id);
  if (a === 'tok'){ RD.sel = RD.sel === id ? null : id; RD.selWord = RD.sel ? el.dataset.w : null; render(); }
  if (a === 'text-en'){ RD.en = !RD.en; render(); }
  if (a === 'text-quiz'){ const t = READER.find(x => x.id === RD.id); RD.phase = 'quiz'; RD.qi = 0; RD.score = 0; RD.qs = t.q.map(([q, right, ...wrong]) => ({q, right, opts:shuffle([right, ...wrong]), pick:null})); render(); window.scrollTo(0, 0); }
  if (a === 'text-pick'){ const q = RD.qs[RD.qi]; if (q.pick === null){ q.pick = el.dataset.val; if (q.pick === q.right) RD.score++; else recordMistake('reading'); render(); } }
  if (a === 'text-next'){
    RD.qi++;
    if (RD.qi >= RD.qs.length){ const r = DB.read[RD.id] || {}; DB.read[RD.id] = {n:(r.n || 0) + 1, best:Math.max(r.best || 0, RD.score), at:Date.now()}; save(); }
    render(); window.scrollTo(0, 0);
  }
  if (a === 'text-back'){ RD.phase = 'read'; render(); }
  if (a === 'cb-mode'){ cbMode = el.dataset.m; P = null; render(); }
  if (a === 'cb-check') checkPage();
  if (a === 'cb-new'){ P = null; render(); window.scrollTo(0, 0); document.querySelector('.cb-in')?.focus(); }
  if (a === 'cold') openCold();
  if (a === 'cl-deck'){ clDeck = el.dataset.d; render(); }
  if (a === 'cl-size'){ clSize = +el.dataset.n; render(); }
  if (a === 'cl-start') startCold();
  if (a === 'cl-quit') clQuit();
  if (a === 'cl-skip'){ clSubmit('', true); $('cltyped')?.focus(); }
  if (a === 'cl-typo' && CL){ const r = CL.res[+el.dataset.i]; if (r && !r.ok){ r.kind = r.kind === 'typo' ? 'know' : 'typo'; clSave(); render(); } }
  if (a === 'cl-relearn' && CL){ const ids = [...new Set(CL.res.filter(r => !clOk(r)).map(r => 'r:' + CARDS[r.id].w.es))]; CL = null; startLesson(ids); }
  if (a === 'set'){
    const k = el.dataset.key, v = el.dataset.val;
    DB.settings[k] = k === 'production' ? v === 'true' : ['newPerDay', 'lessonSize'].includes(k) ? +v : v;
    if (SYNC_SETTINGS.includes(k)) DB.settingsT = Date.now();
    if (k === 'production') catchUpProduction();
    save(); applyTheme(); render();
  }
  if (a === 'sync-now' && syncConnected()) syncNow().then(() => toast(SY.err ? SY.err : 'Synced ✓'));
  if (a === 'sync-off') syncDisconnect();
  if (a === 'export'){
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(DB, null, 1)], {type:'application/json'}));
    link.download = `camino-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }
  if (a === 'import') $('importFile').click();
  if (a === 'reset' && confirm(syncConnected() ? 'Reset ALL progress on every synced device? This cannot be undone.' : 'Reset ALL progress? This cannot be undone.')){
    const keep = DB.settings; DB = defaults(); DB.settings = keep; DB.resetAt = Date.now(); save(); toast('Progress reset'); go('home');
  }
});
document.addEventListener('submit', e => {
  const f = e.target.dataset.form;
  if (!f) return;
  e.preventDefault();
  if (f === 'study') studySubmit();
  if (f === 'lesson') lessonAnswer($('ltyped')?.value);
  if (f === 'gram') gramAnswer($('gtyped')?.value || '');
  if (f === 'cold') clSubmit($('cltyped')?.value || '');
  if (f === 'sync') syncConnect($('syncToken')?.value);
});
document.addEventListener('input', e => {
  if (e.target.id === 'typed' && S && S.firstKey == null && e.target.value) S.firstKey = performance.now();
  if (e.target.id === 'cltyped' && CL && CL.firstKey == null && e.target.value) CL.firstKey = performance.now();
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'importFile' && t.files[0]){
    t.files[0].text().then(txt => {
      const d = cleanDB(JSON.parse(txt));
      if (!d || !Object.keys(d.cards).length && !Object.keys(d.gram).length) throw new Error('bad');
      t.value = '';
      if (!confirm('Replace the progress on this device with this backup?')) return;
      DB = merge(defaults(), d); save(); applyTheme(); toast('Backup imported'); render();
    }).catch(() => { t.value = ''; toast('That file isn’t a Camino backup'); });
  }
});
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (modalId){ if (e.key === 'Escape') closeModal(); return; }
  if (e.key === 'Escape'){
    if (view === 'cold' && CL && CL.phase === 'test') return clQuit();
    if (view === 'study' && S) return document.querySelector('[data-act="study-quit"]')?.click();
  }
  if (e.target.classList?.contains('cb-in') && e.key === 'Enter'){
    e.preventDefault();
    const ins = [...document.querySelectorAll('.cb-in')], i = ins.indexOf(e.target);
    if (i < ins.length - 1) ins[i + 1].focus(); else checkPage();
    return;
  }
  if (view === 'study' && S && S.revealed && /^[1-4]$/.test(e.key)){ e.preventDefault(); return grade(+e.key); }
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (view === 'lesson' && L){
    if (L.phase === 'teach' && (e.key === 'Enter' || e.key === 'ArrowRight')){ e.preventDefault(); document.querySelector('[data-act="lesson-next"]')?.click(); }
    if (L.phase === 'teach' && e.key === 'ArrowLeft') document.querySelector('[data-act="lesson-back"]')?.click();
    if (L.phase === 'quiz' && L.answered && !L.answered.ok && e.key === 'Enter'){ e.preventDefault(); lessonNextQ(); }
  }
  if (view === 'grammar' && GQ && GQ.phase === 'quiz' && GQ.answered && e.key === 'Enter'){ e.preventDefault(); gramNextQ(); }
});

/* =========================================================
   Start
   ========================================================= */
if (!SELFTEST && 'serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
applyTheme();
catchUpProduction();
render();
syncReady = true;
updateSyncUI();
if (syncConnected()) syncNow();
