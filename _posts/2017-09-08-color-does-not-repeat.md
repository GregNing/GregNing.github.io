---
layout: post
title: '顏色不重複 自動randowNewColor'
date: 2017-09-08 17:40
comments: true
categories: JS
tags: CSS JS
---

User JS 設定顏色不重複
```js
function randomNewcolor() {
  var remarning = [];
    for (var i = 0; i < UserIdlist.length; i++) {
      var newcolor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
      remarning.push(newcolor);
    }
  remarning = $.unique(remarning)
  return remarning;
}
```