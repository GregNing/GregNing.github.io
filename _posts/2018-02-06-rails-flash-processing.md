---
layout: post
title: 'Rails Flash使用'
date: 2018-02-06 16:04
comments: true
categories:
---
Rails Falsh hash會儲存在session中，當重新request頁面時，會從session中提取出來，並且立刻刪除，所以只會出現一次，它的用處在於redirect時，能夠從這一個request傳遞訊息到下一個request主要用於顯示於畫面，Rails預設針對notice和alert這兩個類型可以直接塞進redirect_to當作參數。
1. flash 是存在 session當你切換頁面只會出現一次，但當你使用render時他等同於無視 適用於redirect_to
2. flash.now 是存在於當前的request 適用於 `render :new` 等等

in `app\helpers\flashes_helper.rb`
```ruby
FlashesHelper
  FLASH_CLASS = {alert: "danger", notice: "success", warning: "warning"}.freeze
  def flash_class(key)
    FLASH_CLASS.fetch key.to_sym, key
  end

  def user_facing_flashes
    flash.to_hash.slice "alert", "notice", "warning"
  end
end
```

```erb
<% if flash.any? %>
  <% user_facing_flashes.each do |key,value| %>
    <div class="alert flashbar alert-dismissable alert-<%= flash_class(key) %>">
	  <button class="close" data-dismiss="alert">X</button>
	  <%= value %>
	</div>
  <% end %>
<% end %>
```
你可以在layout去render它 `app\views\layout\application.html.erb`
```erb
<div class="container-fluid">
  <div class="row">
    <%= render "common/navbar" %>
	<%= render 'common/flashes' %>
	<%= yield %>
  </div>
</div>
<%= render 'common/footer' %>
```
剛剛有提到因 Rails 裡面預設的flash_types只有notice & alert，所以要記得在`app\controller\application_controller.rb`加上
```rb
class ApplicationController < ActionController::Base
  add_flash_types :warning
end
```
這樣才可以在View正確顯示warring方式，最後讓我們直接在`app\controller\example_controller.rb`裡面呼叫。
```rb
def udpate
  redirect_to examples_path, warning: "warning!"
end
```