---
layout: post
title: 'Rails AASM使用'
date: 2018-05-08 15:21
comments: true
categories:
---
[AASM](https://github.com/aasm/aasm)，是一個狀態管理的gem，可以更好的幫助你管理各種在不同時間的不同狀態。
首先在Gemfile安裝 `gem 'aasm'`
在要使用的model裡include，在此要記住`model`要有一個欄位為名為`aasm_state`好方便記住狀態。
```
class Order < ApplicationRecord
	include AASM
  aasm do
    state :order_placed, initial: true #初始化
    state :paid
    state :shipping
    state :shipped
    state :order_cancelled
    state :good_returned
    event :make_payment, after_commit: :pay! do
      transitions from: :order_placed, to: :paid
    end
    event :ship do
      transitions from: :paid, to: :shipping
    end
    event :deliver do
      transitions from: :shipping, to: :shipped
    end
    event :return_good do
      transitions from: :shipped, to: :good_returned
    end
    event :cancel_order do
      transitions from: [:order_placed, :paid], to: :order_cancelled
    end
  end
end
```
{% capture string_with_newlines %}
##### state :order_placed, initial: true
上面這段解釋為
`state` 為可能性狀態
`initial` 為一開始的初始狀態(model 一建立之後)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}
```
event :make_payment, after_commit: :pay! do
	transitions from: :order_placed, to: :paid
end
```
{% capture string_with_newlines %}
`event` 表示為各個事件method名稱
`transitions` from: 什麼狀態改為 to: 狀態
`after_commit` 表示説如果`make_payment`為`true`就執行 `pay!` 的Method(在此沒顯示出來)
請使用Rails 環境執行`rails c`
{% endcapture %}
{{ string_with_newlines | newline_to_br }}
```
order = Order.new
order.order_placed? # true
order
#<Order:0x00123443asd> {
            :aasm_state => "order_placed",
}
order.make_payment # true
order
#<Order:0x00123443asd> {
            :aasm_state => "paid",
}
order.ship # true
order
#<Order:0x00123443asd> {
            :aasm_state => "shipping",
}
```
{% capture string_with_newlines %}
以上為使用方式以此類推
`transitions from:` 也可以是一個Array，但如果呼叫了此`event`但狀態不包含在from裡面則會發錯誤！
`aasm do`預設執會去找`aasm_state`這個欄位，如要設定哪個欄位請使用`aasm(:your column) do`
{% endcapture %}
{{ string_with_newlines | newline_to_br }}