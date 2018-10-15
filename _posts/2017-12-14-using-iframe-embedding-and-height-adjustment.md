---
layout: post
title: '使用iframe 嵌入以及高度調整'
date: 2017-12-14 08:36
comments: true
categories: iframe
tags: iframe
reference:
  name:
    - 隨螢幕解析度調整高度寬度
    - 隨您的內容調整高度以及寬度
  link:
    - https://stackoverflow.com/questions/3306124/how-to-make-a-html-iframe-100-width-and-height
    - http://17joweb.com/blog/13-know-how-notes/237-iframe
---
{% capture string_with_newlines %}
`height="100%"`: 稍後會提到如何控制自動微調高度 控制框架高度。
`width="100%"`: 控制框架寬度。
`frameborder="0"`: 不要框線可以填入0或no。
`marginheight="0"`: 框架內容垂直方向留空白。
`marginwidth="0"`: 框架內容水平方向留空白。
`scrolling="yes"`: NO為取消自動捲軸，若要保留自動捲軸，可填入YES。預設值為auto。
`align="center"`: 控制框架內容的對齊方式，包括：left, right, center。
{% endcapture %}
{{ string_with_newlines | newline_to_br }}
```HTML
<iframe src="http://www.xxx.com.tw" width="100%" height="100%" id="mainframe" marginheight="0" marginwidth="0" onload="this.width=screen.width;this.height=screen.height;" scrolling="yes"></iframe>
```
隨螢幕解析度調整高度寬度<br>
`this.width=screen.width;this.height=screen.height;`<br>
隨內容調整高度寬度<br>
`parent.document.getElementById("mainframe").height=document.body.scrollHeight`