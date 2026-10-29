// Android でアプリとしてインストールできるようにするための最小限のサービスワーカー
// （データはすべて Google 側にあるので、ここでは何も保存しません）
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () {});
