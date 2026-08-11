---
layout: post
title: 'Expo Deep Link 與 Universal Links 筆記'
date: 2026-04-24 16:00
comments: true
categories: React-Native
description: 'Deep link, Universal Links, App Links in Expo'
tags: Expo React-Native Deep-Link Universal-Links
reference:
  name:
    - Expo Linking
    - Expo Router linking
    - Apple Universal Links
    - Android App Links
  link:
    - https://docs.expo.dev/guides/linking/
    - https://docs.expo.dev/router/advanced/native-intent/
    - https://developer.apple.com/ios/universal-links/
    - https://developer.android.com/training/app-links
---

### 名詞先分清楚

這幾個詞常混用，先分清楚：

1. **Deep Link** — 任何可以「打開 app 到特定畫面」的連結都算，包含 custom scheme (`myapp://order/123`) 與 https link。
2. **Universal Links** (iOS) — 用 `https://` 連結打開 app 的機制，沒裝 app 就 fallback 到網頁。
3. **App Links** (Android) — 類似 Universal Links 的 Android 版本，需要 Digital Asset Links 驗證。
4. **Custom URL Scheme** — 早期的 `myapp://` 作法，不需 domain 驗證，但 iOS/Android 都不保證安全。

在 Expo 裡，三種都可以做，只是設定方式不一樣。

***

### Custom Scheme (最簡單)

`app.json` / `app.config.js` 設定：

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

打開 `myapp://order/123` 就會進到 app。測試用可以，但正式環境建議改用 Universal Links / App Links，因為 custom scheme 在 email、SMS、社群平台常會被攔截或不可點。

***

### iOS Universal Links

要讓 `https://example.com/order/123` 直接打開 app，需要三件事：

1. **Associated Domains capability** 要打開。Expo 設定：

    ```json
    {
      "expo": {
        "ios": {
          "associatedDomains": ["applinks:example.com"]
        }
      }
    }
    ```

2. **Apple App Site Association 檔案** 要放在：

    ```
    https://example.com/.well-known/apple-app-site-association
    ```

    內容：

    ```json
    {
      "applinks": {
        "apps": [],
        "details": [
          {
            "appID": "TEAMID.com.yourcompany.yourapp",
            "paths": ["/order/*", "/product/*"]
          }
        ]
      }
    }
    ```

    注意：這個檔案 **不能加副檔名**，而且必須 `Content-Type: application/json`，HTTPS 回 200。

3. iOS 第一次啟動 app 時會 fetch 這個檔案，之後就認得這個 domain。

***

### Android App Links

Expo 設定：

```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            { "scheme": "https", "host": "example.com", "pathPrefix": "/order" }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

然後 web 端放：

```
https://example.com/.well-known/assetlinks.json
```

內容：

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.yourapp",
      "sha256_cert_fingerprints": ["AA:BB:CC:..."]
    }
  }
]
```

`sha256_cert_fingerprints` 是你的簽章憑證 SHA-256 指紋，用 `eas credentials` 可以查。

***

### 路由側處理 (Expo Router)

Expo Router 會自動把 https/app link 的 pathname 對應到 route。例如 `/order/123` 打開 app，會進 `app/order/[id].tsx`，完全不用額外寫 linking config。

如果沒用 Expo Router，就要自己用 `Linking.getInitialURL()` 跟 `Linking.addEventListener('url', ...)` 處理：

```ts
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

export function useDeepLink(onUrl: (url: string) => void) {
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) onUrl(url);
    });
    const sub = Linking.addEventListener('url', ({ url }) => onUrl(url));
    return () => sub.remove();
  }, [onUrl]);
}
```

***

### 常見踩雷

1. **`apple-app-site-association` 要放在 root domain**，不能放 subdirectory。
2. **iOS 會 cache**，改完檔案之後不一定馬上生效；重裝 app 最保險。
3. **Android autoVerify 失敗 = 走不到 deep link**。要在系統 log 看 `PackageManager` 的驗證結果，常見原因是 assetlinks.json 回 301、回 HTML、Content-Type 錯、或 SHA-256 指紋對不上 (debug vs release key)。
4. **iOS 上從 Safari 手動打 URL 不會觸發 Universal Link**，要從別的 app (iMessage、Notes) 點才行。這不是 bug，是 Apple 設計。
5. **沒裝 app 時的 fallback** — 兩邊 OS 都會自動開瀏覽器載入該 https URL，所以 web 端最好也能處理同一個 path。

***

### 小結

Deep link 要打通的話，app 端設定其實不多，主要麻煩都在 **domain 這側的兩個檔案** (`apple-app-site-association` 跟 `assetlinks.json`)，跟驗證流程。第一次踩都會在這裡花最多時間，設定好之後就是單純的路由對應問題了。
