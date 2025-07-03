# TreeView Generator

フォルダをアップロードするだけで、**階層構造をアスキーアートで出力**できるWebアプリです。

![screenshot](public/tree.svg)

## 概要
<pre> \```
└── 📁 treeview-generator
    ├── 📄 eslint.config.mjs
    ├── 🟦 next-env.d.ts
    ├── 🟦 next.config.ts
    ├── 🧾 package-lock.json
    ├── 🧾 package.json
    ├── 📄 postcss.config.mjs
    ├── 📁 public
    │   ├── 🧩 file.svg
    │   ├── 🧩 globe.svg
    │   ├── 🧩 next.svg
    │   ├── 🧩 tree.svg
    │   ├── 🧩 vercel.svg
    │   └── 🧩 window.svg
    ├── 📝 README.md
    ├── 📁 src
    │   ├── 📁 app
    │   │   ├── 📄 favicon.ico
    │   │   ├── 🎨 globals.css
    │   │   ├── 🔷 layout.tsx
    │   │   └── 🔷 page.tsx
    │   └── 📁 components
    │       └── 🔷 TreeViewGenerator.tsx
    └── 🧾 tsconfig.json
\``` </pre>


---

## 特徴

-  フォルダをドラッグ＆ドロップでアップロード
-  標準的なツリー構造を自動生成（`├──`, `└──`, `│`）
-  フォルダ／ファイルの区別やフィルター
-  ワンクリックでコピー
-  クライアントのみで完結（安全・高速）

---

## 使用技術

- フレームワーク: [Next.js 14](w)
- 言語: [TypeScript](w)
- UI: [Tailwind CSS](w)
- アイコン: [Lucide React](w)

---

## 使い方

1. treeview-generatorを開く
2. フォルダをドラッグ＆ドロップ or 選択
3. 自動でツリー構造を生成
4. Copyボタンでクリップボードに保存

---

## セキュリティ

- サーバーにデータ送信されません
- ファイル内容は読み取りません（**名前のみ取得**）
- すべての処理はブラウザ内で完結

---

## 製作理由

AIに階層構造のプロンプトを送るときに、フォルダをそのまま添付するわけにもいかず困っていたから。

---

## 製作者

Created by [Takeru-13](https://github.com/Takeru-13) / 坂本武龍 🌸