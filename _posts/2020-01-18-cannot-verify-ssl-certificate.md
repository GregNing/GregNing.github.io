---
layout: post
title: '驗證網站SSL (Verify SSL Certificate)'
date: 2020-01-18 13:59
comments: true
categories: SSL
description: 'Verify SSL Certificate'
tags: SSL
reference:
  name:
    - What's My Chain Cert
  link:
    - https://whatsmychaincert.com/
---
串接使用[FB Debug](https://developers.facebook.com/tools/debug/) share時候遇到無法擷取SEO相關資料
```
SSL Error
Can’t validate SSL Certificate. Either it is self-signed (which will cause browser warnings) or it is invalid.
```
當初我以為我SSL裝好了，網頁上方的安全連線都成功了，但沒想到卻出現這問題，而後來上網查證並且[Verify SSL](https://whatsmychaincert.com/)才發現完全沒裝好(搞笑了)
貼上你的網址去驗證如以下圖所示
<img src="/assets/images/verify-ssl-1.png" alt="drawing" width="500"/>

倘若驗證失敗，上面的文字會變以下
is misconfigured. This is the chain it should be using.
請點This下載就好，在合併到原本的crt上去(將伺服器憑證及中繼憑證合併為一個)

```bash
cat example.com.crt example.com.chain.crt > example.com.chained.crt
```