---
layout: post
title: 'RadioButton 使用'
date: 2017-08-21 16:52
comments: true
categories:
tags: CSS
---

##### Get Radio Button Value with Javascript
```js
$('input[name="genderS"]:checked').val();
```
```js
//獲取一組radio被選中項的值
var item = $('input[@name=items][@checked]').val();
//獲取select被選中項的文本
var item = $("select[@name=items] option[@selected]").text();
//select下拉框的第二個元素為當前選中值
$('#select_id')[0].selectedIndex = 1;
//radio單選組的第二個元素為當前選中值
$('input[@name=items]').get(1).checked = true;
//文本框，文本區域：
$("#txt").attr("value")；
//多選框checkbox：
$("#checkbox_id").attr("value")；
//單選組radio：
$("input[@type=radio][@checked]").val();
//下拉框select：
$('#sel').val();
```

```js
$("#txt").attr("value",''); //清空內容
$("#txt").attr("value",'11');//填充內容

//多選框checkbox：
$("#chk1").attr("checked",'');//不打勾
$("#chk2").attr("checked",true);//打勾
if($("#chk1").attr('checked')==true) //判斷是否已經打勾

//單選組radio：
$("input[@type=radio]").attr("checked",'2');//設置value=2的項目為當前選中項

//下拉框select：
$("#sel").attr("value",'-sel3');//設置value=-sel3的項目為當前選中項
$("1111").appendTo("#sel");//添加下拉框的option
$("#sel").empty()；//清空下拉框
```
[use radio button](http://www.cnblogs.com/xlfj521/archive/2008/01/29/1057375.html)
