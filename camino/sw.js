// Camino — © 2026 YukiiShiroi (github.com/YukiiShiroi). All rights reserved.
// Offline support: the app's files are fetched network-first (so a new version always arrives with matching data)
// and kept in a cache for when there's no connection. Bump CACHE when the app changes.
const CACHE = 'camino-v1';
const SHELL = ['./', './index.html', './style.css', './core.js', './app.js', './data/words.js', './data/sounds.js', './data/grammar.js', './data/reader.js', './data/forms.js',
  './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, {cache:'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first, but give up after a few seconds on a bad connection and use the cached copy
function fresh(input, opts){
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 5000);
  return fetch(input, {...opts, signal:ctl.signal}).finally(() => clearTimeout(t));
}
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url), same = url.origin === location.origin;
  if (!same) return;
  if (req.mode === 'navigate'){
    // Only the app page itself becomes what opens offline, never another page or a 404
    const base = new URL(self.registration.scope).pathname;
    if (url.pathname !== base && url.pathname !== base + 'index.html') return;
    e.respondWith(fresh(req.url, {cache:'no-cache', credentials:'same-origin'})
      .then(res => { if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); } return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(fresh(req, {cache:'no-cache'})
    .then(res => { if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
    .catch(() => caches.match(req, {ignoreSearch:true})));
});
