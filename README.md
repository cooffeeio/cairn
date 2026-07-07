# CAIRN — PWA トレーニングログ

ランニング・登山・クライミングの統合トレーニング記録アプリ。  
GPX/TCX取り込み・心拍ゾーン分析・ACWR負荷管理・クライミングELOレーティングに対応。


## ファイル構成

```
cairn-pwa/
├── index.html      ← メインアプリ（React + Recharts、CDN経由）
├── manifest.json   ← PWAマニフェスト
├── sw.js           ← Service Worker（オフラインキャッシュ）
├── icon-192.svg    ← アプリアイコン 192px
└── icon-512.svg    ← アプリアイコン 512px
```

## GitHub Pages でのデプロイ方法

### 1. リポジトリを作成

1. <https://github.com/new> にアクセス
1. Repository name: `cairn` （または任意の名前）
1. **Public** を選択
1. “Create repository” をクリック

### 2. ファイルをアップロード

**GitHub UIから（コマンドライン不要）:**

1. 作成したリポジトリを開く
1. “Add file” → “Upload files” をクリック
1. `index.html`, `manifest.json`, `sw.js`, `icon-192.svg`, `icon-512.svg` の5ファイルをドラッグ＆ドロップ
1. “Commit changes” をクリック

**または git コマンドで:**

```bash
cd cairn-pwa
git init
git add .
git commit -m "Initial CAIRN PWA"
git remote add origin https://github.com/あなたのユーザー名/cairn.git
git push -u origin main
```

### 3. GitHub Pages を有効化

1. リポジトリの **Settings** タブを開く
1. 左メニュー “Pages” をクリック
1. Source: **Deploy from a branch**
1. Branch: **main** / `/ (root)` を選択
1. **Save** をクリック

数分後、以下のURLでアクセス可能になります:  
`https://あなたのユーザー名.github.io/cairn/`

### 4. iPhoneのホーム画面に追加

1. Safari でアプリのURLを開く
1. 下部の **共有ボタン（↑）** をタップ
1. 「**ホーム画面に追加**」を選択
1. 「追加」をタップ

-----

## 技術仕様

|項目     |内容                        |
|-------|--------------------------|
|フレームワーク|React 18（CDN）             |
|チャート   |Recharts 2.12             |
|CSV解析  |PapaParse 5.4             |
|トランスパイル|Babel Standalone          |
|データ保存  |localStorage（端末内のみ）       |
|オフライン対応|Service Worker + Cache API|
|外部通信   |なし（フォント読み込みのみ）            |

## データについて

- 記録データはすべて **ブラウザの localStorage** に保存されます
- サーバーへのデータ送信は一切ありません
- 機種変更や端末リセット前に「データ → バックアップを書き出す（JSON）」で保存してください

## PNG アイコンへの変換（任意・推奨）

一部のブラウザではSVGアイコンが正しく表示されない場合があります。  
より確実な表示のために PNG に変換することを推奨します:

```bash
# macOS の場合（rsvg-convert が必要: brew install librsvg）
rsvg-convert -w 192 -h 192 icon-192.svg > icon-192.png
rsvg-convert -w 512 -h 512 icon-512.svg > icon-512.png
```

変換後、`manifest.json` の `type` を `"image/png"` に変更し、`src` を `.png` に変えてください。

-----

© CAIRN トレーニングログ
