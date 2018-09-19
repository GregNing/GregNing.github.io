---
layout: post
title: 'DropDownList樣式'
date: 2017-09-14 01:38
comments: true
categories:
tags: CSS MVC
---
如果不喜歡使用
```HTML
@Html.DropDownListFor(x => x.name, (SelectList)ViewData["listame"], new { @class = "dropdownlist" })
```
可以使用以下 以下使用為 ul li配置而不是使用mvc 的dropdownlistfor
以第三為樣品試試看

#### html語法
```HTML
<div class="wrapper">
  <div id="userroles" class="wrapper-dropdown-3 userroles" tabindex="1">
    <span>請選擇選單</span>
    <ul class="dropdown">
    @foreach (var itemroles in ViewData["list"] as IEnumerable<Model>)
    {
      <li><a href="#" id="@list.Value">@list.Text</a></li>
    }
    </ul>
  </div>
</div>
```
## css語法
```css
.wrapper-dropdown {
  position: relative;
  width: 200px;
  margin: 0 auto;
  padding: 0px 12px;
  background: #fff;
  border-radius: 7px;
  border: 1px solid rgba(0,0,0,0.15);
  box-shadow: 0 1px 1px rgba(50,50,50,0.1);
  cursor: pointer;
  outline: none;
  font-weight: bold;
  color: #8AA8BD;
}

.wrapper-dropdown span{
  font-family: MicrosoftJhengHei;
  font-size: 14px;
  line-height: 1.71;
  letter-spacing: 0.4px;
}

.wrapper:after {
  clear: both;
  content: "";
  display: table;
}

.wrapper-dropdown:after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  right: 15px;
  top: 50%;
  margin-top: -3px;
  border-width: 6px 6px 0 6px;
  border-style: solid;
  border-color: #8aa8bd transparent;
}

.wrapper-dropdown .dropdown {
  position: absolute;
  top: 140%;
  left: 0;
  right: 0;
  background: white;
  border-radius: inherit;
  border: 1px solid rgba(0,0,0,0.17);
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  font-weight: normal;
  -webkit-transition: all 0.5s ease-in;
  -moz-transition: all 0.5s ease-in;
  -ms-transition: all 0.5s ease-in;
  -o-transition: all 0.5s ease-in;
  transition: all 0.5s ease-in;
  list-style: none;
  opacity: 0;
  pointer-events: none;
}

.wrapper-dropdown.active.userroles .dropdown {
  opacity: 1;
  pointer-events: auto;
}

.wrapper-dropdown.active.groups .dropdown {
  opacity: 1;
  pointer-events: auto;
}

.wrapper-dropdown .dropdown:before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  bottom: 100%;
  right: 13px;
  border-width: 0 8px 8px 8px;
  border-style: solid;
  border-color: rgba(0,0,0,0.1) transparent;
}

.wrapper-dropdown .dropdown:after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  bottom: 100%;
  right: 15px;
  border-width: 0 6px 6px 6px;
  border-style: solid;
  border-color: #fff transparent;
}

.wrapper-dropdown .dropdown li:first-of-type a {
  border-radius: 7px 7px 0 0;
}

.wrapper-dropdown .dropdown li a {
  display: block;
  padding: 10px;
  text-decoration: none;
  color: #8aa8bd;
  border-bottom: 1px solid #e6e8ea;
  box-shadow: inset 0 1px 0 rgba(255,255,255,1);
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -ms-transition: all 0.3s ease-out;
  -o-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
}

.wrapper-dropdown .dropdown li:last-of-type a {
  border: none;
  border-radius: 0 0 7px 7px;
}
```
### jquery 語法
```js
function DropDowngroup(el) {
  this.group = el;
  this.placeholder = this.group.children('span');
  this.opts = this.group.find('ul.dropdown > li');
  this.val = '';
  this.index = -1;
  this.initEvents();
}
DropDowngroup.prototype = {
  initEvents: function () {
  var obj = this;
  obj.group.on('click', function (event) {
  $(this).toggleClass('active');
  return false;  });
  obj.opts.on('click', function () {
    var opt = $(this);
    obj.val = opt.text();
    obj.index = opt.index();
    obj.placeholder.text(obj.val);
    //取值到我所隱藏的Html.HiddenFor(x=>x.name) 表單送出我就直接抓取此欄位的值
    $("#Group").val(opt.children().attr('id'));
  });
},
getValue: function () {
  return this.val;
},
getIndex: function () {
  return this.index;
}}
$(function () {
  var group = new DropDowngroup($('#name'));
  $('.wrapper-dropdown').removeClass('active');
})
```
[drop-down-style](https://tympanus.net/codrops/2012/10/04/custom-drop-down-list-styling/)