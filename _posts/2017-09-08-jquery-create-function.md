---
layout: post
title: '自動新增Jquery Method'
date: 2017-09-08 17:35
comments: true
categories:
tags: Jquery
---

##### 以下是示範使用使用照片去觸發折線圖消失或顯示
```js
var numArr = [];
var funArr = [];
```
##### 可使折線圖線條消失隱藏、顯示，新增funciton使用`for loop`迴圈。
```js
for (let i = 0; i < UserIdlist.length; ++i) {
  numArr[numArr.length] = i;
  funArr[funArr.length] = $('li#' + UserIdlist[i]).click(function () {
  var series = chart.series[i]
    if (series.visible) {
      $(this).css("background-color", "");
      series.hide();
    } else {
      (this).css("background-color", "#dfdfdf");
      series.show();
    }
  });
};
```
[javascript creating function](https://stackoverflow.com/questions/19696015/javascript-creating-functions-in-a-for-loop)