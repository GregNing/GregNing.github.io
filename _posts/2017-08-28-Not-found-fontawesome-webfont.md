---
layout: post
title: 'Not Found fontawesome-webfont.woff?v=4.0.3'
date: 2017-08-28 02:47
comments: true
categories:
tags: Csharp CSS MVC
---
當使用`font awesome`套件 網頁出現fontawesome-webfont.woff?v=% 找不到此文件之類的問題
直接在web.config中設定以下所需的設定
```conf
<system.webServer>
  <staticContent>
    <remove fileExtension=".woff"/>
    <mimeMap fileExtension=".woff" mimeType="application/x-font-woff" />
  </staticContent>
</system.webServer>
```
若要在TextBpxFor套用font awseome請使用以下
```HTML
@Html.TextBoxFor(m => m.Email, new { @class = "form-control login-input", placeholder = HttpUtility.Htm	lDecode("&#xf007; Username or Email"), style = "font-family:Arial, FontAwesome" })
```