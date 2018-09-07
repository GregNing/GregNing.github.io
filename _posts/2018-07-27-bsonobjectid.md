---
layout: post
title: 'MongoDB 探討 BSON::Objectid'
date: 2018-07-27 01:17
comments: true
categories:
---
## 介紹mongodb的主鍵(key)所組成的構造為什麼是一串24位的字串

### ObjectId is a 12-byte BSON type, constructed using:

#### 4-byte value representing the seconds since the Unix epoch,
#### 3-byte machine identifier,
#### 2-byte process id, and
#### 3-byte counter, starting with a random value.
ObjectId: `BSON::ObjectId('5b59964a9791deb92e0001da')`

這串數字其實是由一組16進制的字符組成的,每個字節兩位的6進制數字,其總共運用了12字節的儲蓄空間，跟 Mysql 比較不一樣(Int 類型的4個字節)。

#### (一) 是時間戳Time
時間戳 `5b59964a` 將這串數字16進制轉換為10進制這個數字 `1532597834` 就是一個時間戳，通過時間戳轉換就成了看得懂的時間格式

#### (二) (主機識別碼)Machine Identifier
主機識別碼 `9791de` 確保不同主機生成不同的值以及確保在分散式中不造成衝突，這也就是說這幾個數字在同一台機器生成都是一模一樣的原因

#### (三) PID
程序PID `b92e` 進程符號，前面的九個數字是保證了一秒内不同機器不同進程生成objectId不衝突

#### (四) INC
計數器(隨機值開頭)`0001da`，保證同一主機同一進程同一秒內產生的ObjectId的唯一性。


##### 總結來看objectid 前四碼記錄了創建時間，接下來三個byte代表了所在主機唯一識別碼，確認不同主機產生不同的objectid，後兩個byte進程的id決定了在在同一個機器下不同的mogodb進程(PID)所產生的的objectid，最後三byte為計數器確保同一秒所產生的objectid唯一識別性。

```conf
i = Time.now.to_i # 會轉成10進制
t = Time.at(i) # 藉由 10 進制取得時間
```

[BSON::ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/)
[Mongodb ObjectID 生成](https://www.cnblogs.com/xjk15082/archive/2011/09/18/2180792.html)