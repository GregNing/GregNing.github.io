---
layout: post
title: 'ROR use Array(params[:ids])'
date: 2018-02-01 16:39
comments: true
categories: Ruby-On-Rails
description: 'Ruby 批次送出(使用Array(params[:ids]))'
tags: Ruby Rails
---
在`config\routes.rb`加上要設定的路由訊息
```rb
collection do
  post :update_list
end
```
在View上面 把 list資料用 form_tag標記起來
```erb
<%= form_tag update_list_events_path, :class => "form-inline" do %>
```
這是全選按鈕 我們會利用 id來做全選的觸發動作
```erb
<%= check_box_tag "全選", "1", false, :id => "toggle_all" %>
```
這是放在要被勾選的資料放在list得最前面
```erb
<%= check_box_tag "ids[]", event.id %>
```
這是送出按鈕
```erb
<%= submit_tag "送出按鈕", :class => "btn btn-info", :data => { :confirm => "Are you sure?" }%>
```
使用 Jquery 去觸發全選按鈕
```js
$("#toggle_all").click(function(){
  if ( $(this).prop("checked") ) {
    $("input[name='ids[]']").prop("checked", true);
  } else {
    $("input[name='ids[]']").prop("checked", false);
  }
})
```
```rb
def update_list
  total = 0
  Array(params[:ids]).each do |event_id|
    event = Event.find(event_id)
    event.destroy
    total += 1
  end
  redirect_to admin_events_path, alert: "成功完成 #{total} 筆"
end
```
修改完成
使用`Array(params[:ids])`解說，如果是`Array([1,2,3]) => [1,2,3]`沒變，但如果是 Array[nil] each不會因為nil each而爆錯因為他會顯示[]，如果沒使用這方法就要另外檢查`params[:id]`如果是nill就要返回否則會出現 NoMethodError。