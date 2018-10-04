---
layout: post
title: 'Mongoid Iterating Over Large Collections no_timeout use no_timeout 使用'
date: 2018-08-11 02:06
comments: true
categories: Mongod
description: 'Mongoid Iterating Over Large Collections(大量數據跑迴圈)'
tags: Mongod
---
{% capture string_with_newlines %}
當我們要找尋所有店家會使用 `Merchant.each`，但當數量過大就不太適合了，這時候會需要使用到 `batch_size`。
但是在`Mongoid` 中 `Model.all` 會回傳 `Mongoid::Criteria` 的instance，而且會調用 `Criteria` 上的 `#each`，在此將會實例化 Mongo driver cursor 使其紀錄。而這個底層的 Mongo driver cursor 已經批量的處理所有紀錄，而默認情況下`batch_size`: 預設為 100。
{% endcapture %}
{{ string_with_newlines | newline_to_br }}
```rb
batch_size = 100
Merchant.each_with_index do |merchant, index|
  if (index % batch_size).zero?
    sleep 1
  end
end
```
對Mongoid而言，可以直接用`Merchant.each`，會自動利用(cursor)分批加載。
不過有個問題就是`cursor`有個10分鐘超時限制。意思是超過10分鐘就危險了。中途可能會發生`no cursor`的錯誤。
```rb
Mongo::Error::OperationFailure:
  Cursor not found, cursor id: 79727049273 (43)
```
接下來我們可以使用`Handling no cursor error`。
```rb
Model.no_timeout.each
# OR use no_cursor_timeout
```
#### `no_timeout`: 實際上在所有查詢默認情況下都有一個超時(默認值為60秒)。而你可以設置 `no_timeout` 來告訴他不timeout。
#### `no_cursor_timeout`: 當數據量過大較需的時間較長時(find 可能會執行較久)，就有可能發生`Cursor not found`的錯誤因此我們需要設置游標不過期，如果還有發生`Cursor not found`問題請把`batch_size`開大點。
#### 補充: 當我們在 Mongodb使用query查詢時會返回cursor類型(實際上也就是Iterator 模式)的實作，而cursor有個有個方法是`explain()`，用途是提供query plan的訊息，而可能的模式有 queryPlanner (default), executionStats, allPlansExecution。如果我們要看的話通常會看`winningPlan`和`rejectedPlans`去查看內容物(ex: index...)。
#### 如果是執行時間請查看`executionStats.executionTimeMillis`。
{% capture string_with_newlines %}
[mongodb batch size default](https://stackoverflow.com/questions/25126447/what-is-the-default-batchsize-in-pymongo)
[ruby find_each ](https://api.rubyonrails.org/v4.1/classes/ActiveRecord/Batches.html)
[Mongoid Criteria use batch_size reason](https://stackoverflow.com/questions/7041224/finding-mongodb-records-in-batches-using-mongoid-ruby-adapter)
[mongo cursor](https://github.com/mongodb/mongo-ruby-driver/blob/master/lib/mongo/cursor.rb#L474)
[Mongo::Error::OperationFailure: Cursor not found](https://itisatechiesworld.wordpress.com/2017/02/23/mongoerroroperationfailure-cursor-not-found/)
[mongodb Input_Connector](http://www.smartsct.com/rest_api/specification/Input_Connector/mongodb.html)
[Mongoid query default of 60s ](https://blog.github.com/2009-10-09-unicorn/)
[Mongoid Connection doc](https://docs.mongodb.com/manual/reference/connection-string)
[Mongoid no_cursor_timeout doc](https://docs.mongodb.com/manual/reference/method/cursor.noCursorTimeout/)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}