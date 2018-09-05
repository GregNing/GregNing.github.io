---
layout: post
title: 'HTML異步加載Script'
date: 2018-02-04 18:09
comments: true
categories:
description: 'rails use async'
---
使用`async`
```erb
<%= javascript_include_tag 'application', 'data-turbolinks-track': 'reload', :async => true %>
```
async的話，瀏覽器不會阻擋HTML的渲染(加載)，當JavaScript下載完成時就會直接執行JavaScript，不會等HTML DOM加載。

使用defer(建議)
```erb
<%= javascript_include_tag 'application', 'data-turbolinks-track': 'reload', :defer => true %>
```
defer的話，瀏覽器也不會阻擋HTML的渲染，但是當JavaScript下載完成後，會等HTML加載完成，才會執行JavaScript。如果JavaScript裡面有依賴DOM的話，適合用這個方式。

async和defer是瀏覽器的新標準，優點是可以比傳統做法效果更好。但是缺點是舊的瀏覽器支援不好，IE <= 9的版本不支持。