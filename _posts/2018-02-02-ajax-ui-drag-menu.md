---
layout: post
title: 'Ajax UI 拖拉式選單'
date: 2018-02-02 05:03
comments: true
categories: Ruby-On-Rails
tags: Rails
reference:
  name:
    - Sortable Plugin
    - jquery-ui-rails
  link:
    - http://api.jqueryui.com/sortable/
    - https://github.com/jquery-ui-rails/jquery-ui-rails
---
使用Jquery元件 拖拉移動[Sortable Plugin](http://api.jqueryui.com/sortable/)
安裝[jquery-ui-rails](https://github.com/jquery-ui-rails/jquery-ui-rails)

在 Gemfile 安裝
```conf
gem 'jquery-ui-rails'
```
```js
//= require jquery-ui
```
`app\assets\stylesheets\application.scss`加上以下使用css效果在拖拉時候出現移動圖標
```scss
@import "jquery-ui";
.sort .sort_icon {
  border: none;
  color: #ECECEC;
  font-size: 20px;
  cursor: move;
  padding-right: 10px;
}
```
```erb
<table class="table">
<thead>
<tr>
<th>Active Name</th>
<th>Event Name</th>
<th>Actions</th>
</tr>
</thead>
<tbody class="sort">
<% @groups.each do |group| %>
<!-- 要被拖移的對象  -->
<tr data-reorder-url="<%= reorder_group_path(group) %>">
  <td>
  <span class="sort_icon">☰</span>
  <%= link_to group.name, goup_path(group) %>
  </td>
<td>Even Name</td>
  <td>
  <%= link_to "Edit", edit_group_path(group), :class => "btn btn-default" %>
  <%= link_to "Delete", group_path(group), method: "delete", :data => { :confirm => "Are you sure?" }, :class =>"btn btn-danger" %>
</tr>
<% end %>
</tbody>
</table>
```
下方是寫 Jquery Ajax去觸動拖拉
```js
$( ".sort" ).sortable({
  axis: 'y', // 限制只能上下拖拉
  items: 'tr',     // 拖拉整個 tr 在這要注意如果沒有用 thead and tbody 包起來會連動到標題去拖拉
  cursor: 'move',  // 變更拖拉的 icon
  handle: ".sor_icon",  //限制只能拖拉 icon如果沒有這行等於整列(tr)都可以拖拉
  stop: function(e, ui){ //拖拉結束會掉用這個特效
    ui.item.children('td').effect('highlight', {}, 1000)
  },
  update: function(e, ui) {   //拖拉整個完成後包括DOM位置變更會調用這個方法
    reorder_url = ui.item.data('reorder-url')
    position = ui.item.index()  // 取得排列順序
    $.ajax({
      type: 'POST',
      url: reorder_url,
      dataType: 'json',
      data: { position: position }})}
});
```