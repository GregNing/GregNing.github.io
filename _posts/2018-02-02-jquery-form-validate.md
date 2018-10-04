---
layout: post
title: 'Ruby Jquery Form Validation Plugin'
date: 2018-02-02 08:42
comments: true
categories: Ruby-On-Rails
tags: Rails
---
{% capture string_with_newlines %}
可以在這裡找到相關 [Form Style](https://www.sitepoint.com/10-jquery-form-validation-plugins/)
目前所使用的範例是[bootstrap-validator](http://1000hz.github.io/bootstrap-validator/)
[Boorstrap-validator-GitHub](https://github.com/1000hz/bootstrap-validator)
在這使用的是bootstrap-validator 是輸入一個去做驗證而不是整個一起送出後才驗證效果會比較好
請先下載 [bootstrap-validator](https://raw.githubusercontent.com/1000hz/bootstrap-validator/master/dist/validator.min.js)
放在`vendor\assets\javascripts\目錄下面`
{% endcapture %}
{{ string_with_newlines | newline_to_br }}
```js
//= require validator.min
```
```erb
<div class="form-group">
  <%= f.label :name, "姓名", :class => "control-label" %>
  <%= f.text_field :name, :class => "form-control", :required => true, :autofocus => true %>
  <div class="help-block with-errors"></div>
</div>
```
使用HTML5 前端資料驗證 補上`:required => true`
```erb
<%= f.text_field :name, :class => "form-control", :required => true, :autofocus => true %>
```
其實主要是加上這段讓他錯誤顯示於輸入窗正下方
```html
<div class="help-block with-errors"></div>
```
使用Jquery驗證
```js
$("form").validator();
```