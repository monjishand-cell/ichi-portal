# 一先生ポータル（ICHI SENSEI STUDY PORTAL）— PWA 入口ページ

GitHub Pages: https://monjishand-cell.github.io/ichi-portal/
本体（学習者データ・XP・宿題・キャラクター）は Google Apps Script 側にあり、このリポジトリは「アプリとして開くための入口」だけです。

## ファイル

| ファイル | 役割 |
|---|---|
| `index.html` | 入口ページ。GAS 本体を全画面で表示し、`?key=…` をそのまま本体に渡す |
| `manifest.json` | Web App Manifest（名前・アイコン・standalone 表示・scope） |
| `sw.js` | Service Worker。オフライン画面とアイコンだけをキャッシュ |
| `offline.html` | 通信できないときの画面 |
| `install.html` | 生徒向け「ホーム画面への追加方法」（iPhone / Android） |
| `icon-192.png` / `icon-512.png` | 通常アイコン |
| `icon-maskable-192.png` / `icon-maskable-512.png` | Android の丸型・角丸用（余白入り） |
| `apple-touch-icon.png` | iPhone のホーム画面用（180px） |
| `icon-180.png` | 旧ファイル名。すでに追加済みの端末のために残しています |
| `favicon-32.png` | ブラウザのタブ用 |

## 大事な設計メモ

- **`start_url` はあえて書いていません。** 書くと、生徒がホーム画面に追加したときに `?key=…` が消えて、自分のページが開けなくなります。書かなければ「追加したときのURL」が起動URLになります。
- ホーム画面のアプリとして起動したときだけ、`?key=…` をその端末の localStorage に保存します（保存名は `ichi-portal:launch-query`）。key が付かずに起動したときの保険です。ブラウザで開いたときは保存しません。アイコンを削除すると、保存された内容も消えます。
- Service Worker は**同じリポジトリ内のファイルだけ**を扱います。Google Apps Script への通信や学習データには触れません。ページ本体（`?key=` 付きの URL）もキャッシュしません。
- 名前が `ichi-portal-` で始まるキャッシュだけを削除します。同じ `monjishand-cell.github.io` 上のほかのリポジトリには影響しません。

## 更新するとき

1. ファイルを変更します。
2. `sw.js` の `VERSION`（例：`'2026-11-02-1'`）を新しい値に変えます。
3. アップロードします。GitHub Pages の反映には最大10分ほどかかります。古いキャッシュは自動で削除されます。

GAS のURLが変わったとき（新しいデプロイを作成した場合）は、`index.html` の `APP_URL` を書き換えます。「デプロイを管理」で既存のデプロイを更新すれば、URLは変わりません。
