---
layout: post
title: 'simple_form 使用兩個model'
date: 2018-03-28 16:52
comments: true
categories:
---
[simple_form user two model ](https://github.com/plataformatec/simple_form/wiki/Nested-Models)
### 目標: 在 view 中使用兩個 model
> 首先在model 先套上`accepts_nested_attributes_for`只限於`one_to_one or one_to_many`
```ruby
class Product < ApplicationRecord
  has_many :sizes
  accepts_nested_attributes_for :sizes,allow_destroy: true, reject_if: :all_blank
end
```
{% capture string_with_newlines %}
[用 accepts_nested_attributes_for Nested Model 順帶編輯跟新增](https://ihower.tw/rails/restful-practices.html)
> 在這使用`accepts_nested_attributes_for`可以透過 `params` 來新增或修改 `sizes`
> `allow_destroy:`是否刪除聯繫對象，默認 false
> `reject_if:`表示說在什麼條件下，就當做沒有要真的動作，例如:`all_blank`就表示如果資料都是空的，就不建立sizes資料(當然也就不會檢查sizes的驗證了)。
#### accepts_nested_attributes_for 另外還有兩個參數可以使用
> `limit:` has_many關係時起作用，能處理的關聯對象的最大數量。接受Proc，Symbol和數字，proc和symbol關聯的方法需要返回數字。
> `update_only:` has_one關係時起作用，是否更新關聯對象，默認設置為false。設置為true時，不管參數中是否有id，都更新關聯對象
{% endcapture %}
{{ string_with_newlines | newline_to_br }}
```ruby
def new
   @product = Product.new
   @product.sizes.build
end
def create
  @product = Product.new(product_params)
  @product.user = current_user
  @product.save!
end
def product_params
  params.require(:product).permit(:name, :description, :price, :image,:category_id, sizes_attributes: [:s,:m,:l])
end
```
`build`適合用在建立關聯式創建時使用<br>
`build 與 new`其實非常相像不同之處在於build會幫你自動建立`sizes`
```erb
<%= simple_form_for @product do |f| %>
  <div class="form-group">
    <%= f.input :name, label: "name" ,required: false,label_html: { class: 'control-label' },wrapper_html: { class: 'label-floating' }%>
  </div>
  // 庫存量 使用 accepts_nested_attributes_for
  <div class="size-quantity">
  <%= f.simple_fields_for :sizes do |p| %>
  <%= p.input :s, label: "S 號" ,required: false,label_html: { class: 'control-label' }, wrapper_html: { class: 'label-floating' }%>
  <% end %>
  </div>
  <div class="form-actions">
  <%= button_tag name: "send",type: 'submit',class: "btn submit-button",data: { disable_with: "Submit..." } do %>
    Submit <i class="material-icons right">send</i>
  <% end %>
  </div>
<% end %>
```