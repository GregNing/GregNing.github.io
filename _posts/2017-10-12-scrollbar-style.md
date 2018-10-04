---
layout: post
title: '網頁捲動軸 scrollbar Style'
date: 2017-10-12 16:48
comments: true
categories: CSS
tags: CSS
---
首先介紹捲動軸<br>
`::-webkit-scrollbar`: 代表整個捲動軸
![scrollbar.PNG](https://s3-ap-northeast-1.amazonaws.com/gregningpublic/5DGXnhAuTD2TbX784Gli_scrollbar.PNG)
`::-webkit-scrollbar-button`: 代表捲動軸上下按鈕
![scrollbar-button.PNG](https://s3-ap-northeast-1.amazonaws.com/gregningpublic/qZpepPFvRjKTCI0jzs9l_scrollbar-button.PNG)
`::-webkit-scrollbar-track`: 代表捲動軸按鈕按鈕之間由於這個沒按鈕就將就下~
![scrollbar-track .PNG](https://s3-ap-northeast-1.amazonaws.com/gregningpublic/oNFPnfkQTRSPQm4W2iCa_scrollbar-track+.PNG)
`::-webkit-scrollbar-track-piece`: 代表捲動軸之間的空白處
![scrollbar-track-piece .PNG](https://s3-ap-northeast-1.amazonaws.com/gregningpublic/fzOVGByTLyL5sUZp7ZQk_scrollbar-track-piece+.PNG)
`::-webkit-scrollbar-thumb`: 重點來了這是捲動軸
![scrollbar-thumb.PNG](https://s3-ap-northeast-1.amazonaws.com/gregningpublic/ke9cL9XTOasv6mJcorgA_scrollbar-thumb.PNG)
`::-webkit-scrollbar-corner`: 位於右下角的空白處介於`overflow-y`與`overflow-x`之間。<br>
`::-webkit-resizer`: 這是右下角拉取視窗大小地方
以下是捲動軸Style
```css
::-webkit-scrollbar {
  width: 12px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
  background-color: #555;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-border-radius: 10px;
  border-radius: 10px;
}
```
{% capture string_with_newlines %}
[scrollbars](https://css-tricks.com/custom-scrollbars-in-webkit/)
[style](https://codepen.io/devstreak/pen/dMYgeO)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}