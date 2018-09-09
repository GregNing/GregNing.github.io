---
layout: post
title: 'Mongodb query operator'
date: 2018-08-19 23:35
comments: true
categories:
description: 'Mongodb query operator(條件查詢)'
---
使用 Ruby 進行 mongodb query 時候可以參考以下使用
例: 我們有個Model叫做Pet
```rb
Pet:
  foo: {bar: 1, foobar: 2}
  another_attr: 1
```
我們要搜尋某個 `attributes` 裡面的 hash value 資訊，可以這樣使用 `:'foo.bar'.gt => 0`
```Ruby
Pet.where(:'foo.bar'.gt => 0, :another_attr => 1) // foo bar 要大於0
Pet.where(:'foo.bar'.lt => 0, :another_attr => 1) // foo bar 要小於0
ids = [13213, 232123, '3']
Pet.where(:id.in => ids) // 查詢Pet id 是否有 13213, 232123, '3'
```
{% capture string_with_newlines %}
`gt`: 大於
`gte`: 大於等於
`lt`: 小於
`lte`: 小於等於
`ne`: 不等於
`in`: 是否相符類似 `incldes` (請帶陣列)
`nin`: 與上意思相反(不相符)

[query hash in mongodb](https://stackoverflow.com/questions/12372688/how-to-perform-this-query-on-a-hash-in-a-mongodb-document-using-mongoid)
[mongodb query operator](https://docs.mongodb.com/manual/reference/operator/query/)
[mongodb query condition使用說明](https://www.cnblogs.com/navy235/archive/2012/05/03/2480758.html)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}