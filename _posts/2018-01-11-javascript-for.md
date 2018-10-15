---
layout: post
title: 'Javascript(ES6) loop迴圈'
date: 2018-01-11 03:04
comments: true
categories: JS
tags: JS
reference:
  name:
    - For loop
    - Add ClassName
  link:
    - https://stackoverflow.com/questions/22754315/for-loop-for-htmlcollection-elements
    - https://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
---
For Loop 迴圈
```js
var list = document.getElementsByClassName("events");
for (let item of list) {
  console.log(item.id);
}
// ForEach
Array.from(document.getElementsByClassName("events")).forEach(function(item) {
  console.log(item.id);
});
```
Class Name 新增刪除作法
```js
document.getElementById("MyElement").classList.add('MyClass');
// 新增 Class Name 簡潔做法
document.getElementById("MyElement").className += " MyCLass"
document.getElementById("MyElement").classList.remove('MyClass');
if ( document.getElementById("MyElement").classList.contains('MyClass') )
document.getElementById("MyElement").classList.toggle('MyClass');
```
