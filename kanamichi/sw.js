// Kanamichi — © 2026 YukiiShiroi (github.com/YukiiShiroi). All rights reserved.
// Kanamichi service worker: lets the app open and run offline.
// Three caches: the app itself (replaced with each version), and audio clips and fonts, which are kept
// across updates so a new version doesn't throw away every clip you've already listened to.
const CACHE = 'kanamichi-v51';
const AUDIO = 'kanamichi-audio';
const FONTS = 'kanamichi-fonts';
const SHELL = ['./', './index.html', './audio/list.js', './data/kanji.js', './data/kanji-n4.js', './data/kanji-n4b.js', './data/kanji-n4c.js', './data/synonyms.js', './data/words-core.js', './data/words-core2.js', './data/grammar.js', './data/grammar-n4.js', './data/grammar-n4b.js', './data/grammar-n4c.js', './data/reader.js', './data/reader-n4.js', './data/reader-more.js', './data/reader-n4c.js', './fonts/fonts.css', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

// The bundled fonts are split into small files, and a browser only downloads one when a page first shows one of
// its characters. So every file fonts.css names is fetched here, once: offline, a kanji you meet for the first
// time still gets the app's typeface. Files kept from an earlier version aren't fetched again, and ones
// fonts.css no longer names are dropped.
async function cacheFonts(){
  const cache = await caches.open(FONTS);
  const css = await (await fetch('./fonts/fonts.css', {cache:'reload'})).text();
  const want = new Set([...css.matchAll(/url\(([^)]+\.woff2)\)/g)].map(m => new URL('./fonts/' + m[1], self.location).href));
  for (const req of await cache.keys()) if (!want.has(req.url)) await cache.delete(req);
  await Promise.all([...want].map(async u => { if (!await cache.match(u)) await cache.add(new Request(u, {cache:'reload'})).catch(() => {}); }));
}

self.addEventListener('install', e => {
  // 'reload' skips the browser's HTTP cache (GitHub Pages lets it keep files for 10 minutes)
  e.waitUntil(Promise.all([
    caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, {cache:'reload'})))),
    cacheFonts().catch(() => {}),               // a font that fails to download is fetched later, when it's used
  ]).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  const keep = [CACHE, AUDIO, FONTS];
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => !keep.includes(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Audio: from the cache when we have it, otherwise download the whole clip once and keep it.
// <audio> often asks for a byte range; a range is answered from the full cached file, so
// clips play offline in every browser (a partial response can't be cached on its own).
async function audioResponse(req){
  const cache = await caches.open(AUDIO);
  let res = await cache.match(req.url);
  if (!res){
    const net = await fetch(req.url, {cache:'no-cache'});
    if (!net.ok) return net;
    await cache.put(req.url, net.clone());
    res = net;
  }
  const range = req.headers.get('range');
  if (!range) return res;
  const buf = await res.arrayBuffer(), size = buf.byteLength, m = /bytes=(\d*)-(\d*)/.exec(range);
  const start = m && m[1] ? +m[1] : 0, end = m && m[2] ? Math.min(+m[2], size - 1) : size - 1;
  return new Response(buf.slice(start, end + 1), {status:206, headers:{
    'Content-Type':res.headers.get('Content-Type') || 'audio/mpeg', 'Content-Range':`bytes ${start}-${end}/${size}`,
    'Content-Length':String(end - start + 1), 'Accept-Ranges':'bytes'}});
}

// Network first, but give up after a few seconds on a bad connection and use the cached copy
function fresh(input, opts){
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 5000);
  return fetch(input, {...opts, signal:ctl.signal}).finally(() => clearTimeout(t));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  // Home-screen icons go straight to the network so the phone always gets the real file
  if (same && /icon[^/]*.png$/.test(url.pathname)) return;

  // Fonts: network first (so a re-made font file arrives), kept in the font cache for offline use
  if (same && /\/fonts\/[^/]+\.woff2$/.test(url.pathname)){
    e.respondWith(fresh(req.url, {cache:'no-cache'})
      .then(res => { if (res.ok){ const copy = res.clone(); caches.open(FONTS).then(c => c.put(req.url, copy)); } return res; })
      .catch(() => caches.match(req.url, {cacheName:FONTS}).then(hit => hit || Response.error())));
    return;
  }

  if (same && /\/audio\/[^/]+\.mp3$/.test(url.pathname)){
    e.respondWith(audioResponse(req).catch(() => Response.error()));
    return;
  }

  // The app page: network first so updates arrive, cached copy when offline.
  // 'no-cache' asks GitHub whether the page changed instead of reusing a copy up to 10 minutes old.
  // Only a good copy of the app itself is kept: other pages here (tests.html, a mistyped link's 404)
  // must never become what opens offline.
  if (req.mode === 'navigate'){
    const base = new URL(self.registration.scope).pathname;
    if (!same || (url.pathname !== base && url.pathname !== base + 'index.html')) return;
    e.respondWith(fresh(req.url, {cache:'no-cache', credentials:'same-origin'})
      .then(res => { if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); } return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }

  // App files (data, scripts): network first as well, so the page and its data always match;
  // the cached copy is the offline fallback. A small file that hasn't changed costs a quick 304.
  if (same){
    e.respondWith(fresh(req, {cache:'no-cache'})
      .then(res => { if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req, {ignoreSearch:true})));
    return;
  }
});
