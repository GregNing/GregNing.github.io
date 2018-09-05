---
layout: post
title: 'rails use select_tag'
date: 2018-03-20 14:38
comments: true
categories:
description: 'Rails select_tag 介紹以及使用ajax方式不使用remote: true'
---
我們不用 [simple_form](https://github.com/plataformatec/simple_form) 表單去做處理而是使用原始Rails所用的select_tag。<br>
使用[url_for](https://apidock.com/rails/ActionView/RoutingUrlFor/url_for)
```erb
<%= url_for(action: 'find', controller: 'books') %>
```
使用[select_tag](https://apidock.com/rails/ActionView/Helpers/FormTagHelper/select_tag)
```erb
<%= select_tag(:school_or_org, options_for_select([ ['school', "school"], ['non-profit', "non-profit"]] ), {:class => 'form-control'})  %>
```
首先使用 [select_tag](https://apidock.com/rails/ActionView/Helpers/FormTagHelper/select_tag)實作，以下為原生使用方式。
```erb
<%= select_tag(:school_or_org, options_for_select([ ['school', "school"], ['non-profit', "non-profit"]] ), {:class => 'form-control'})  %>
我們稍做修改 (1)
<% eval(item.quantity).each do |k, v|  %>
<%= select_tag 'quantity', options_for_select(1..@producthash[k.to_s], v), class: "quantity-select",
data: {
remote: true,
url: cart_item_path(item.product_id),
progress_bar: "progress_bar_div_id",
update: "message_div_id",
method: :patch} %>
讓我們在做一次修改 (2)
<%= select_tag 'quantity', options_for_select(1..@producthash[k.to_s] , v),
onchange: "javascript: cartitem_tweak.changeCartitemquantity(#{item.product_id},#{k.to_json},this.value);" ,class: "quantity-select"%>
<% end %>
```
* 介紹(1) 單純使用`Rails remote: :true`功能在controller裡面會接收到訊息並回傳`js`即可
* 介紹(2) 使用`onchange`去 call `update_quantity` funciton改變我們所需要的值
```js
<script type='text/javascript'>
var cartitem_tweak = (function () {
let changeCartitemquantity = (product,size, quantity ) => {
使用 Javascript 方式
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
  if (xhr.readyState == XMLHttpRequest.DONE) {   // xhr.DONE == 4
    if (xhr.status == 200) {
	這行代表他會幫你執行吐出來的cript 如果在Jquery使用Ajax會轉成JSON並且自動幫你執行script
	eval(xhr.responseText);
    }
    else if (xhr.status == 400) {
    console.log('There was an error 400');
    }
    else {
    console.log('something else other than 200 was returned');
    }
  }
};
let data = new FormData()
data.append('size', size);
data.append('quantity', quantity);
xhr.open("PATCH", `<%= cart_items_path %>/${product}`, true);
xhr.setRequestHeader("X-CSRF-Token",document.querySelector('meta[name="csrf-token"]').content);
xhr.send(data);
使用 Jquery 方式
$.ajax({
beforeSend: function(xhr) {
  xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
  },
  url: `<%= cart_items_path %>/${product}`,
  type: "PATCH",
  data: {
  "size" : size,
  "quantity" : quantity },
  success: (data) => {
    console.log(data)},
  })
 };
return {
changeCartitemquantity: changeCartitemquantity,
};
}());
</script>
```
Controller 中使用直接返回你要的 `example.js.erb`
```ruby
....省略
respond_to do |format|
format.js { render "example"}
end
```