---
layout: post
title: 'Reload/Refresh Images Use Jquery'
date: 2017-09-20 03:19
comments: true
categories:
tags: Jquery CSS
---
```js
d = new Date();
$("#myimg").attr("src", "/myimg.jpg?"+d.getTime());
$(".usersimg#" + listmodel[i].cn).html('<img src="' + "@Url.Action("Images", "Management")?pic=" + picn	ame + '&'+ dat.getTime() +'"id = "' + listmodel[i].indx + '" alt="usersimage" />');
```
[how-to-reload-refresh-an-elementimage-in-jquery](https://stackoverflow.com/questions/2104949/how-to-reload-refresh-an-elementimage-in-jquery)
```js
function playSound(){
  var img = $(this).prev();
  img.attr("src", "css/images/ajax-loader.gif?"+new Date().getTime());
  setTimeout(function() {
  var url = "http://some.com/fanky.mp3";
  mediaTTS = new Media(url, onSuccessTTS(url), onErrorTTS);
  mediaTTS.play();
  }, 100);
}
```
[jquery-refresh-image-after-source-change](https://stackoverflow.com/questions/12271933/jquery-refresh-image-after-source-change)