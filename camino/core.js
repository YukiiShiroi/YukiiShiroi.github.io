// Camino — © 2026 YukiiShiroi (github.com/YukiiShiroi). All rights reserved.
// The parts of the app that don't touch the page: the word list, answer checking, word meanings for the
// reader, and the review scheduler. tools/check-data.js loads this file too.
(() => {
const MIN = 60000, DAY = 86400000;

/* ---------- the word list: one entry per Spanish word or phrase ---------- */
const WORDS = [];
for (const [set, title, text] of window.WORD_SETS){
  for (const line of text.trim().split('\n')){
    const [es, en, note] = line.split('|').map(s => s.trim());
    WORDS.push({es, en, note:note || '', set, setTitle:title});
  }
}
const ARTICLE = /^(el|la|los|las|un|una|unos|unas)\s+/i;
const genderOf = es => { const m = ARTICLE.exec(es); return !m ? '' : /^(el|los|un|unos)$/i.test(m[1]) ? 'm' : 'f'; };

/* ---------- English meanings: any listed meaning counts; case, punctuation, brackets and "to / a / the" don't matter ---------- */
const WORD_EQUIV = {colour:'color', grey:'gray', favourite:'favorite', neighbour:'neighbor', centre:'center', theatre:'theater', mum:'mom',
  trousers:'pants', shop:'store', shops:'store', holiday:'vacation', film:'movie', mobile:'cell', autumn:'fall',
  children:'child', people:'person', men:'man', women:'woman', feet:'foot', teeth:'tooth', mice:'mouse', kids:'child', kid:'child'};
const singular = w => w.length <= 3 || /(ss|us|is)$/.test(w) ? w : /ies$/.test(w) ? w.slice(0, -3) + 'y' : /(x|z|ch|sh|ss)es$/.test(w) ? w.slice(0, -2) : /s$/.test(w) ? w.slice(0, -1) : w;
const canonWord = w => WORD_EQUIV[w] || WORD_EQUIV[singular(w)] || singular(w);
const plain = s => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '');
const normMeaning = s => plain(s).replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\b(to|a|an|the)\b/g, ' ').replace(/\s+/g, ' ').trim()
  .split(' ').filter(Boolean).map(canonWord).join('');
const meaningParts = m => String(m).split(/[,;/]|\bor\b/);
function meaningAlts(m){
  const alts = new Set([normMeaning(m), ...meaningParts(m).map(normMeaning)]);
  alts.delete('');
  return [...alts];
}
const meaningCorrect = (text, m) => { const t = normMeaning(text || ''); return !!t && meaningAlts(m).includes(t); };
// One wrong, missing, extra or swapped letter
function oneOff(a, b){
  if (a === b || Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length){
    const diff = [...a].map((ch, i) => ch !== b[i] ? i : -1).filter(i => i >= 0);
    return diff.length === 1 || (diff.length === 2 && diff[1] === diff[0] + 1 && a[diff[0]] === b[diff[1]] && a[diff[1]] === b[diff[0]]);
  }
  const [s, l] = a.length < b.length ? [a, b] : [b, a];
  for (let i = 0; i < l.length; i++) if (s === l.slice(0, i) + l.slice(i + 1)) return true;
  return false;
}
const meaningTypo = (text, m) => { const t = normMeaning(text || ''); return t.length >= 3 && meaningAlts(m).some(a => a.length >= 3 && oneOff(t, a)); };
const firstMeaning = m => String(m).split(/[,;]/)[0].replace(/\(.*?\)/g, '').trim();

/* ---------- Spanish answers: punctuation and capitals never matter; a missing accent is pointed out but counted ---------- */
const normEs = s => String(s || '').toLowerCase().normalize('NFC').replace(/[¿¡?!.,;:"“”«»—…()]/g, ' ').replace(/\s+/g, ' ').trim();
const noAccents = s => s.normalize('NFD').replace(/[́̈]/g, '').normalize('NFC');   // keeps ñ
// typed vs one or more right answers → {ok, accent: right except for accent marks, article: the article was left off}
const PRONOUN = /^(yo|tú|él|ella|usted|nosotros|nosotras|ustedes|ellos|ellas)\s+/;
// dropPronoun: Spanish usually leaves out "I / he / we…", so a sentence counts with or without it
function checkEs(typed, answers, {needArticle = false, dropPronoun = false} = {}){
  let t = normEs(typed);
  if (!t) return {ok:false};
  if (dropPronoun){ t = t.replace(PRONOUN, ''); answers = [].concat(answers).map(a => normEs(a).replace(PRONOUN, '')); }
  for (const ans of [].concat(answers)){
    const a = normEs(ans), bare = a.replace(ARTICLE, '');
    for (const [want, article] of [[a, false], ...(!needArticle && bare !== a ? [[bare, true]] : [])]){
      if (t === want) return {ok:true, article};
      if (noAccents(t) === noAccents(want)) return {ok:true, accent:true, article};
    }
  }
  const typo = [].concat(answers).some(ans => { const a = noAccents(normEs(ans)); return oneOff(noAccents(t), a) || oneOff(noAccents(t), a.replace(ARTICLE, '')); });
  return {ok:false, typo};
}

/* ---------- reading: what a word means when you tap it ---------- */
const tokens = s => String(s).split(/\s+/).map(w => w.replace(/^[¿¡"“—(]+|[?!.,;:"”)…]+$/g, '').replace(/^[¿¡—]+/, '')).filter(w => /[a-záéíóúüñ]/i.test(w));
const LEX = new Map();
for (const w of WORDS){
  const key = w.es.replace(ARTICLE, '').toLowerCase();
  if (!LEX.has(key)) LEX.set(key, w.en);
}
function gloss(word, text){
  const w = String(word).toLowerCase();
  if (text && text.gl && text.gl[w]) return text.gl[w];
  if (window.FORMS[w]) return window.FORMS[w];
  if (LEX.has(w)) return LEX.get(w);
  // plurals and feminine forms of words in the list: casas → casa, ciudades → ciudad, cansada → cansado
  const tries = [w.replace(/es$/, ''), w.replace(/s$/, ''), w.replace(/a$/, 'o'), w.replace(/as$/, 'o'), w.replace(/ces$/, 'z')];
  for (const t of tries) if (t !== w && LEX.has(t)) return LEX.get(t) + (/s$/.test(w) ? ' (plural)' : '');
  return '';
}

/* ---------- days: a study day rolls over at 4 a.m. ---------- */
const dayNum = (t = Date.now()) => { const d = new Date(t - 4 * 3600e3); return Math.floor((d.getTime() - d.getTimezoneOffset() * MIN) / DAY); };

/* ---------- scheduler: SM-2 flavoured, with short learning steps for new and forgotten cards ---------- */
const STEPS = [1, 10], RESTEPS = [10];
function toReview(c, ivl, today){
  c.s = 'review'; c.ivl = Math.min(Math.max(1, ivl), 3650); c.dueDay = today + c.ivl; c.lastDay = today;
  delete c.dueTs; delete c.step;
}
function schedule(prev, g, now = Date.now()){
  const c = {...prev}, today = dayNum(now);
  c.reps = (c.reps || 0) + 1;
  if (!c.s || c.s === 'new'){ c.s = 'learn'; c.step = 0; c.ease = 2.5; c.lapses = 0; }
  if (c.s === 'learn'){
    if (g === 1){ c.step = 0; c.dueTs = now + STEPS[0] * MIN; }
    else if (g === 2){ c.dueTs = now + STEPS[Math.min(c.step, STEPS.length - 1)] * 1.5 * MIN; }
    else if (g === 3){ c.step++; if (c.step >= STEPS.length) toReview(c, 1, today); else c.dueTs = now + STEPS[c.step] * MIN; }
    else toReview(c, 4, today);
  } else if (c.s === 'relearn'){
    if (g === 1){ c.step = 0; c.dueTs = now + RESTEPS[0] * MIN; }
    else if (g === 2){ c.dueTs = now + RESTEPS[0] * 1.5 * MIN; }
    else toReview(c, g === 4 ? c.ivl + 1 : c.ivl, today);
  } else {
    if (g === 1){
      c.lapses = (c.lapses || 0) + 1; c.ease = Math.max(1.3, c.ease - 0.2);
      c.ivl = Math.max(1, Math.round(c.ivl * 0.5)); c.s = 'relearn'; c.step = 0; c.dueTs = now + RESTEPS[0] * MIN;
    } else {
      const base = Math.max(c.ivl, today - (c.lastDay ?? today));
      const hard = Math.max(c.ivl + 1, Math.round(base * 1.2)), good = Math.max(hard + 1, Math.round(base * c.ease)), easy = Math.max(good + 1, Math.round(base * c.ease * 1.3));
      if (g === 2){ c.ease = Math.max(1.3, c.ease - 0.15); toReview(c, hard, today); }
      if (g === 3){ toReview(c, good, today); if (c.ease < 2.5) c.ease = Math.min(2.5, +(c.ease + 0.05).toFixed(2)); }
      if (g === 4){ c.ease += 0.15; toReview(c, easy, today); }
    }
  }
  c.u = now;
  return c;
}

window.CAMINO = {MIN, DAY, WORDS, ARTICLE, genderOf, meaningAlts, meaningCorrect, meaningTypo, firstMeaning, oneOff, normEs, noAccents, checkEs, tokens, gloss, dayNum, schedule};
})();
