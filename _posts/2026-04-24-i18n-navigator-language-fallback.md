---
layout: post
title: 'i18n locale JSON 載入失敗時不要強制 fallback 到 en'
date: 2026-04-24 20:30
comments: true
categories: Frontend
description: 'Respect navigator.language when the initial locale JSON request fails'
tags: i18n JavaScript Frontend UX
reference:
  name:
    - navigator.language
    - BCP 47 language tags
  link:
    - https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language
    - https://datatracker.ietf.org/doc/html/rfc5646
---

### 場景

前端多語系站通常是這樣做 lazy loading 的：

```js
async function loadLocale(locale) {
  const res = await fetch(`/locales/${locale}.json`);
  if (!res.ok) throw new Error('load failed');
  return res.json();
}

export async function initI18n(locale = 'zh-TW') {
  try {
    const messages = await loadLocale(locale);
    i18n.setMessages(messages);
  } catch (e) {
    // fallback
    const messages = await loadLocale('en');
    i18n.setMessages(messages);
  }
}
```

看起來 reasonable — 抓不到就用英文。直到有一天客人反應：「我用 Chrome 開你們的網站，第一次進站明明 UI 語言是中文，但突然就跳英文了」。

### 為什麼會這樣

幾個常見觸發點：

1. **第一次進站網路很爛**：手機從 4G 轉 WiFi、地下室訊號差、CDN 抖一下。`fetch` timeout / 連線斷線 → `catch` 觸發 → 掉到 en。
2. **CDN cache miss + 後端短暫 500**：`/locales/zh-TW.json` 第一次真的回 500，之後就正常了。但那位 user 第一次的體驗就是 en。
3. **service worker 還在 install**：第一次 request 沒被 cache，service worker 繞路的過程中 race，fetch 失敗。

後果都一樣：**user 其實是中文使用者，但被強制看到英文**。糟糕的 UX — 英文使用者反而不會受影響。

***

### 解法：fallback 要看瀏覽器語言再決定

```js
function pickFallbackLocale(supported) {
  const pref = navigator.languages || [navigator.language];
  for (const tag of pref) {
    // 先試完整 match
    if (supported.includes(tag)) return tag;
    // 再試 primary subtag (zh-TW → zh)
    const primary = tag.split('-')[0];
    const hit = supported.find(s => s.startsWith(primary + '-') || s === primary);
    if (hit) return hit;
  }
  return 'en'; // 真的都沒 match 才英文
}

const SUPPORTED = ['zh-TW', 'zh-CN', 'ja', 'en'];

export async function initI18n(locale) {
  const target = locale || pickFallbackLocale(SUPPORTED);
  try {
    i18n.setMessages(await loadLocale(target));
  } catch (e) {
    const fallback = pickFallbackLocale(SUPPORTED.filter(s => s !== target));
    i18n.setMessages(await loadLocale(fallback));
  }
}
```

### 要點

1. **`navigator.languages` 優先於 `navigator.language`**。前者是 array，按使用者設定的優先順序排。後者只有一個。
2. **Primary subtag match**。user browser 是 `zh-HK`，站只支援 `zh-TW` / `zh-CN` — 這時候 `zh-TW` (或 `zh-CN`，依你覺得誰離 HK 近) 比 en 合理太多。
3. **fallback 的 fallback 也不要是 en**。`[ja]` 掛掉時，user 是日文，退到 `zh-TW` 都比 en 合理一點 — 但這個 case 太邊界，多數情況下真的都掛掉就給 en 即可。
4. **BCP 47 case**：`zh-tw` / `zh-TW` / `ZH-TW` 要統一 normalize。瀏覽器通常回 `zh-TW`，但要防呆。

***

### 如果你用 i18next / vue-i18n

一樣的邏輯已經有現成選項：

```js
// i18next
i18next.init({
  fallbackLng: {
    'zh-HK': ['zh-TW', 'zh-CN', 'en'],
    'zh-MO': ['zh-TW', 'zh-CN', 'en'],
    default: ['en'],
  },
  detection: {
    order: ['querystring', 'cookie', 'navigator'],
  },
});
```

重點不是哪個 lib，而是 **「載入失敗」跟「語言沒支援」的 fallback 路徑要分開想**。大部分 lib 預設只處理「沒支援」的 fallback，載入失敗那條路是你自己要補的。

***

### 還要記得：user override 要 persist

第一次靠 navigator 猜語言沒關係，但 user 手動切換語言之後，**要記住**。

```js
function getPreferredLocale() {
  return (
    localStorage.getItem('locale') ||           // 手動選過的
    pickFallbackLocale(SUPPORTED)               // 沒選過就猜
  );
}

function setPreferredLocale(locale) {
  localStorage.setItem('locale', locale);
  initI18n(locale);
}
```

不然就會變成「user 選了繁中、關掉視窗再進來，又變回簡中」— 一樣糟。

***

### SSR 的版本

SSR 的情境下沒有 `navigator`，要從 request header 看：

```js
// Next.js / Remix / Express
function pickFromAcceptLanguage(header, supported) {
  if (!header) return 'en';
  const candidates = header
    .split(',')
    .map(part => {
      const [tag, q = 'q=1'] = part.trim().split(';');
      return { tag: tag.trim(), q: parseFloat(q.split('=')[1]) };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of candidates) {
    if (supported.includes(tag)) return tag;
    const primary = tag.split('-')[0];
    const hit = supported.find(s => s.startsWith(primary));
    if (hit) return hit;
  }
  return 'en';
}
```

邏輯是一樣的，只是資料來源從 `navigator.languages` 換成 `Accept-Language` header。

***

### 小結

- 載入 locale JSON 失敗 → 直接 fallback `en` 是**常見 UX bug**。
- 用 `navigator.languages` + primary subtag match 決定 fallback，英文只是最後的保底。
- user 手動切換過的語言要 persist (localStorage / cookie)。
- SSR 情境讀 `Accept-Language` header，邏輯相同。
