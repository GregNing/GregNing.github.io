---
layout: post
title: 'Use scrollTop'
date: 2017-10-12 17:07
comments: true
categories:
tags: Jquery
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
{% capture string_with_newlines %}
[jquery-scrolltop-animation](https://stackoverflow.com/questions/16475198/jquery-scrolltop-animation)
[可以玩玩看animate所使用的卷軸移動方式Style](https://matthewlein.com/tools/jquery-easing)
[可以玩玩看animate所使用的卷軸移動方式Style2](http://easings.net/zh-tw#easeOutSine)
[scrolltop-animation-without-jquery](https://stackoverflow.com/questions/21474678/scrolltop-animation-without-jquery)
[npm scrolltop](https://github.com/tarun-dugar/easy-scroll)
[scrolltop function](https://github.com/piotr-placzek/JsAnimScroll/blob/master/JsAnimScroll.jsscroptop function)
[file-animatedscrollto-js](https://gist.github.com/andjosh/6764939#file-animatedscrollto-js)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}