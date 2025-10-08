# TreeView Generator
フォルダをアップロードするだけで、**階層構造をアスキーアートで出力**できるWebアプリ。

### 🌳 TreeView Generator
<img src="https://github.com/user-attachments/assets/cc1e7a63-e26c-495b-9d89-f393afb8e1c3" alt="TreeView Generator Banner" style="width:100%;height:auto;" />

[🔗 アプリを見る](https://treeviewgenerator.netlify.app/) | [💻 ソースコード](https://github.com/Takeru-13/treeview-generator)  

##📌 制作経緯と目的

このツールは、当初 「AIに現在のフォルダ構成を共有したいのに、うまいやり方が分からない」 という悩みからスタートしました。
そこに「Next.jsを触れてみたい」という興味と、AIコーディング（Claude Code）を実際に試したいという思いも重なり、ミニプロジェクトとして生まれました。

「AIでどの程度実用的なコードを生成できるのか」「本当にそのまま動くのか」――
そうした検証を目的としています。

高度な機能はありませんが、AI生成コードの学習・検証の一環として意味を持つ実験作です

---

## 🖼 スクリーンショット
<p align="center">
  <a href="https://github.com/user-attachments/assets/42ff7e80-cf1f-4c2f-80da-43be02e8cd5e">
    <img src="https://github.com/user-attachments/assets/42ff7e80-cf1f-4c2f-80da-43be02e8cd5e"
         alt="SeaSide – Home Desktop Screenshot"
         width="980" />
  </a>
  <br/><sub>カレンダー＋感情アイコンの表示例（デスクトップ）</sub>
</p>

---

## 概要
このアプリにフォルダを読み込ませると、以下のようなAA(Tree view)が出力されます。
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

## 後書き
このアプリを用いたことで、AIとのやり取りの中でフォルダ構成を円滑に共有でき、開発の効率化にもつながりました。
また、実際にClaude Codeでコードを生成・試すことができたのは、とても良い経験でした。

一方で、後にCodexを使って編集を試した際にはエラーだらけになってしまい、AI任せでは限界があることも実感しました。
最終的には使用者自身の知識や理解が不可欠だと学べた点も、大きな収穫です。

---


## 製作者

Created by [Takeru-13](https://github.com/Takeru-13) / 坂本武龍 🌸
