---
layout: post
title: 'use mixin and autoload_paths vs eager_load_paths'
date: 2018-03-01 18:31
comments: true
categories: Ruby-On-Rails
description: '使用 mixin 以及 autoload_paths vs eager_load_paths解說'
tags: Ruby
reference:
  name:
    - autoload_paths vs eager_load_paths詳細說明
    - Don't forget about eager_load when extending autoload paths
    - autoload_paths or eager_load其他使用方式
    - rails3中autoload_paths加載詳細說明
    - helper-method-and-view-context解說
  link:
    - https://stackoverflow.com/questions/19773266/confusing-about-autoload-paths-vs-eager-load-paths-in-rails-4
    - https://blog.arkency.com/2014/11/dont-forget-about-eager-load-when-extending-autoload/
    - http://hakunin.com/rails3-load-paths
    - http://www.mojidong.com/rails/2013/03/16/rails3-autoload_paths-principle/
    - http://blog.xdite.net/posts/2014/06/16/helper-method-and-view-context
---
> 先進行 mixin 範例<br>
> 如果不想使用mixin請使用以下方式直接在Controller新增 Controller級的helper
```rb
helper_method :current_cart
def current_cart
  @current_cart ||= find_cart
end
```
在 `lib/modules/common_helper.rb` 先新增我們所需要的helper相關資訊<br>
將Cart相關資訊存在session裡面 `common_helper.rb`
```rb
module CommonHelper
  def current_cart
    @current_cart ||= find_cart
  end
  def find_cart
      cart = Cart.find_by(id: session[:cart_id])
      if cart.blank?
        cart = Cart.create
      end
      session[:cart_id] = cart.id
      return cart
  end
end
```
接下來在 `config/application.rb`新增[自動載入方式](https://ihower.tw/rails/environments-and-bundler.html#sec6)這樣就完成了可以在Controller or View 呼叫
```rb
config.eager_load_paths << "#{Rails.root}/lib/modules"
```
`eager_load_paths`目錄是指 Rails 會自動根據命名慣例載入，而 Ruby 的 $LOAD_PATH 常數則是 require 時會尋找的目錄。像 lib 這個目錄 Rails 預設就只有加到 $LOAD_PATH 之中，所以你放在 lib 的檔案是可以 require 到，但是因為預設沒有加到`eager_load_paths`之中，所以沒有自動載入的機制。

若要查看是否有載入請在`rails c`
輸入這行`ActiveSupport::Dependencies.autoload_paths` OR
`Rails.application.config.assets.paths`即可
```rb
> rails c
> ActiveSupport::Dependencies.autoload_paths
[
    [ 0] "/Users/app/assets",
    [ 1] "/Users/app/channels",
    [ 2] "/Users/app/controllers",
    [ 3] "/Users/app/controllers/concerns",
    [ 4] "/Users/app/helpers",
    [ 5] "/Users/app/jobs",
    [ 6] "/Users/app/mailers",
    [ 7] "/Users/app/models",
    [ 8] "/Users/app/models/concerns",
    [ 9] "/Users/app/uploaders",
我們需要的是載入這行 -> [10] "/Users/lib/modules",
    [11] "/Users/.rvm/gems/ruby-2.3.1/gems/devise-4.4.1/app/controllers",
    [12] "/Users/.rvm/gems/ruby-2.3.1/gems/devise-4.4.1/app/helpers",
    [13] "/Users/.rvm/gems/ruby-2.3.1/gems/devise-4.4.1/app/mailers",
    [14] "/Users/.rvm/gems/ruby-2.3.1/gems/font-awesome-rails-4.7.0.3/app/assets",
    [15] "/Users/.rvm/gems/ruby-2.3.1/gems/font-awesome-rails-4.7.0.3/app/helpers",
    [16] "/Users/.rvm/gems/ruby-2.3.1/gems/material_icons-2.2.1/app/assets",
    [17] "/Users/.rvm/gems/ruby-2.3.1/gems/material_icons-2.2.1/app/helpers",
    [18] "/Users/.rvm/gems/ruby-2.3.1/gems/material_icons-2.2.1/app/models",
    [19] "/Users/test/mailers/previews"
]
```
### Controller 裡使用
```rb
def add_to_cart
  extend CommonHelper
  current_cart.add_product_to_cart(@product)
end
```
### View 裡使用
```erb
<% extend CommonHelper %>
```
* `include` 提供了混合它的Class的實例方法。(動態使用)
* `extend` 擴展為混合Class提供類方法。(靜態使用)
* 建議使用 `extend` 取代 `include` 這樣就不用include 在 new 了<br>
[extend or include](https://stackoverflow.com/questions/15097929/ruby-module-require-and-include)<br>
[extend include 解說](http://blog.niclin.tw/posts/1076821)
### autoload_paths 以及 eager_load_paths使用方式
autoload_paths在 Rails版本 < 5以下做使用以下任一種方式即可使用 in `config/application.rb`
```rb
config.autoload_paths += Dir["#{config.root}/lib/**"]
config.autoload_paths += %W(#{config.root}/lib/modules)
```
eager_load_paths 在 Rails版本 >= 5使用以下任一種方式即可使用，in `config/application.rb`
```rb
config.eager_load_paths << "#{Rails.root}/lib/modules"
config.eager_load_paths += %W(#{config.root}/lib/modules)
config.eager_load_paths += %W(
  #{config.root}/lib/modules
  #{config.root}/lib/my_others
)
```
{% capture string_with_newlines %}
上production因安全所需會自動取消autoload_paths，所以在此建議使用`eager_load_paths` 上production會比以較不會發生異常。
總結：`autoload_paths`就是當使用某個常量（比如module class時），rails會調用const_missing，然後在`autoload_paths`的數組目錄中查找，找到該常量後加載使用。簡單認為，在使用時，才加載相關代碼。 優點：能夠快速啟動rails，在啟動rails時減少加載代碼，在使用時臨時加載進來。`eager_load_paths`在rails啟動時，就把`eager_load_paths`中的目錄代碼加載進來.production環境時建議使用，`eager_load_paths`加載。這樣雖然啟動的 時候速度會變慢，因為要加載更多代碼，但是，這樣加載預熱後，在用戶使用程序時，就能很快的調用到相關代碼，因為已經在啟動的時候加載好了。 關於lib目錄中的代碼文件根據實際情況需要，選擇加載方式。
{% endcapture %}
{{ string_with_newlines | newline_to_br }}