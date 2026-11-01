/*
 * 一先生ポータル Service Worker
 *
 * ・保存するのは、このリポジトリ内の「入口ページの部品」（オフライン画面・アイコン・manifest）だけ。
 * ・学習者データ／XP／宿題などは Google Apps Script（別ドメイン）にあり、ここでは一切保存・中継しない。
 * ・?key=… 付きのページ（生徒ごとのURL）もキャッシュしない。
 * ・ファイルを更新したら VERSION を変える → 古いキャッシュは自動で削除される。
 */
var VERSION = '2026-11-02-1';
var PREFIX = 'ichi-portal-';           // 同じ github.io 上の他リポジトリのキャッシュには触れないための目印
var CACHE = PREFIX + VERSION;

var SHELL = [
  'offline.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-192.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
  'favicon-32.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(SHELL.map(function (p) { return new Request(p, { cache: 'reload' }); })); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k.indexOf(PREFIX) === 0 && k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  // 別ドメイン（Google Apps Script など）や、このアプリの範囲外は一切触らない
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf(new URL(self.registration.scope).pathname) !== 0) return;

  // ページ表示：常にネットから最新を取得（保存しない）。通信できないときだけオフライン画面
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(function () {
        return caches.match('offline.html').then(function (r) {
          return r || new Response('オフラインです', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        });
      })
    );
    return;
  }

  // アイコン等：保存済みのものを使う（クエリは無視して照合）。無ければネットから
  if (SHELL.some(function (p) { return url.pathname.endsWith('/' + p); })) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || fetch(req); })
    );
  }
  // それ以外は respondWith しない＝ブラウザ標準の通信のまま
});
