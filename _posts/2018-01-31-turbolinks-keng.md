---
layout: post
title: 'Turbolinks 造成的相關錯誤'
date: 2018-01-31 08:34
comments: true
categories:
tags: Rails
---
`Turbolinks`是一個Rails內建的頁面加速工具(Javascript套件工具)，由於他只會重新載入body而header只有在第一次進入頁面時候去做載入動作，導致會吃不到某些 javascript造成某些功能失效。

如果有用到以下相關的jquery javascript功能
```js
(funciont(){ //do somethings... })();
OR
$(function(){ //do somethings... });
```
請修改成加入`turbolinks`強制他執行`load function`這樣才會重新載入這個function
```js
$(document).on("turbolinks:load", function(){ //do somethings... })
```
如果寫在頁面上面的 javascript 莫名其妙被觸發兩次 很大的機率就是Turbolinks所發的問題

解法：
1.關掉 Turbolinks的緩存功能 把下面指令加到 layout head裡面
```HTML
<meta name="turbolinks-cache-control" content="no-cache">
```
2.使用layout 的 body載入當前的javascript 像這樣意思就是當載入 application.js 時只有載入這一頁所需的js
```erb
<body id="<%= "#{controller_name}-#{action_name}"%>">
```

> 如果想要拆掉這個功能
1. Gemfile 拆除安裝檔
2. app/assets/javascripts/application.js 拆除js檔案
3. app/views/layout/application.html.erb 拆除屬性