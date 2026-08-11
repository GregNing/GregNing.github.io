---
layout: post
title: 'esbuild 介紹'
date: 2026-04-24 15:00
comments: true
categories: Build-Tools
description: 'A quick intro to esbuild'
tags: esbuild JavaScript Bundler
reference:
  name:
    - esbuild official site
    - esbuild API docs
  link:
    - https://esbuild.github.io/
    - https://esbuild.github.io/api/
---

### 什麼是 esbuild

`esbuild` 是一個用 Go 寫的 JavaScript/TypeScript bundler 和 minifier。跟 webpack、rollup 比，最主要的差別是**速度**，官方 benchmark 宣稱比其他工具快 10 到 100 倍。

原因大致上是：

1. 使用 Go 編譯成 native binary，啟動與執行都比 Node.js 跑的工具快。
2. 重度平行化，充分利用多核 CPU。
3. 從頭設計，沒有沿用舊的 AST 或 plugin API 架構。

***

### 安裝

```bash
npm install --save-dev esbuild
```

簡單跑一下 build：

```bash
npx esbuild src/app.js --bundle --outfile=dist/bundle.js
```

***

### 使用 Config 檔

多數專案會把設定抽到 `esbuild.config.js`：

```js
import esbuild from 'esbuild';

const isWatch = process.argv.includes('-w');

const options = {
  entryPoints: ['src/app.js'],
  bundle: true,
  outfile: 'www/bundle.js',
  minify: true,
  sourcemap: true,
  target: ['es2017'],
};

if (isWatch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('watching...');
} else {
  await esbuild.build(options);
}
```

然後在 `package.json` 加上 scripts：

```json
{
  "scripts": {
    "build": "node esbuild.config.js",
    "start": "node esbuild.config.js -w"
  }
}
```

***

### 常用參數說明

1. `bundle` — 把所有 import 打包到一個檔案裡，否則 esbuild 只做 transform。
2. `minify` — 壓縮輸出，production build 時打開。
3. `sourcemap` — 產生 source map，debug 會用到。
4. `target` — 指定要輸出的 JS 版本 (ex: `es2017`, `esnext`)，決定哪些語法需要 down-level。
5. `loader` — 指定不同副檔名要用的 loader (ex: `.png` 用 `file`、`.svg` 用 `text`)。
6. `splitting` + `format: 'esm'` — 開啟 code splitting，適合瀏覽器端多入口的情境。

***

### 什麼時候該選 esbuild

- 喜歡**快**的 dev feedback loop，特別是大專案 rebuild 時間有感。
- 專案設定相對單純，不需要 webpack 那套龐大 plugin 生態系。
- 用來當 Vite / tsup / 其他工具的底層引擎也很常見。

反過來說，如果專案高度依賴 webpack-only 的 plugin，或需要很精細的 chunk 策略，esbuild 可能還不夠用，這時候搭配 Rollup 或 Vite 會比較合適。

***

### 小結

esbuild 的定位就是「**快**的 bundler」。實務上，很多現代工具 (Vite、tsup、Remix esbuild-mode 等) 都已經把 esbuild 當成底層，直接用它也完全可行。設定檔跟 API 都很簡潔，學習成本很低，值得放進工具箱。
