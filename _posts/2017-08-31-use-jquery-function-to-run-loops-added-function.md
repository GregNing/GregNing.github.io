---
layout: post
title: '使用Jquery function 跑 迴圈 新增 function'
date: 2017-08-31 11:29
comments: true
categories: Jquery
tags: Jquery
---
可使用 這隻迴圈function 製造迴圈新增function
```js
var numArr = [];
var funArr = [];
for(let i = 0; i < 10; ++i){
  numArr[numArr.length] = i;
  funArr[funArr.length] = function(){  return i; };
}
```
Ex帶入寫法
```js
var numArr = [];
var funArr = [];
for (let i = 0; i < datanumber.length; ++i) {
  numArr[numArr.length] = i;
  funArr[funArr.length] = $('#' + datanumber[i]).click(function () {
  //注意! 帶入寫法一定要將 跑迴圈之值(i)直接寫入到要設定function的裡面如果寫在外處則一定會發生錯誤
  //每個函數都是一個閉包，它們都引用相同的變量i。 當每個函數運行時，它將在函數運行時返回i的值（這將比循環的極限值多一個）。
  var series = chart.series[i]
  if (series.visible) {
    series.hide();
  } else {
    series.show();
  }
  });
};
```
{% capture string_with_newlines %}
[javascript-creating-functions-in-a-for-loop](https://stackoverflow.com/questions/19696015/javascript-creating-functions-in-a-for-loop)
[javascript-closure-inside-loops-simple-practical-example](https://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example)
[es6-in-depth-let-and-const](https://hacks.mozilla.org/2015/07/es6-in-depth-let-and-const/)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}