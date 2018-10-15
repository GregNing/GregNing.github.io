---
layout: post
title: 'Use scrollTop'
date: 2017-10-12 17:07
comments: true
categories: Jquery
tags: Jquery
reference:
  name:
    - jquery-scrolltop-animation
    - 可以玩玩看animate所使用的卷軸移動方式Style
    - 可以玩玩看animate所使用的卷軸移動方式Style2
    - scrolltop-animation-without-jquery
    - npm scrolltop
    - scrolltop function
    - file-animatedscrollto-js
  link:
    - https://stackoverflow.com/questions/16475198/jquery-scrolltop-animation
    - https://matthewlein.com/tools/jquery-easing
    - http://easings.net/zh-tw#easeOutSine
    - https://stackoverflow.com/questions/21474678/scrolltop-animation-without-jquery
    - https://github.com/tarun-dugar/easy-scroll
    - https://github.com/piotr-placzek/JsAnimScroll/blob/master/JsAnimScroll.jsscroptop function
    - https://gist.github.com/andjosh/6764939#file-animatedscrollto-js
---
#### 將捲動軸滑動到指定地點
先取得你要移動地方的id或是class之後再用`.offset().top`語法取得位置。
```js
var scrollid = $(this).attr('id');
var $body = $('html,body');
$body.animate({
  scrollTop: $("#" + scrollid).offset().top
}, 800, "easeOutCubic");
```