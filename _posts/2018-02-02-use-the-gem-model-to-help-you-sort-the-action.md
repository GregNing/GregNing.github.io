---
layout: post
title: 'Ruby 使用ranked-model Gem來做排序動作'
date: 2018-02-02 04:17
comments: true
categories:
---
在這介紹[ranked-model](https://github.com/mixonic/ranked-model)
使用Gemfile安裝
```rb
gem 'ranked-model'
```
在你要用的model 裡面加入以下這樣才可以使用到排序作用
```ruby
include RankedModel
ranks :row_order
```
在要用的 model 新增欄位
至於為什麼要新增名字為`row_order`是因為官方只認這個欄位
```ruby
add_column :tableName, :row_order, :integer
```
在使用`migration`設定`row_order`的值order的地方加上索引加快搜尋動作
官方文件記載以下排序方式都可以使用
:first 位於第一個 , :last最後 , :up 向上一位 , :down向下一位
```ruby
TableName.find_each do |e|
  e.update( :row_order_position => :last )
end
add_index :TableName, :row_order
```
`@groups = Group.rank(:row_order).all`這樣就完成了。
