---
layout: post
title: 'Rails migration 踩雷：MySQL int vs bigint FK'
date: 2026-04-24 17:00
comments: true
categories: Rails
description: 'Why t.references + add_foreign_key can fail on legacy MySQL schemas'
tags: Rails MySQL Migration
reference:
  name:
    - Rails Guides Active Record Migrations
    - MySQL Foreign Key Constraints
  link:
    - https://guides.rubyonrails.org/active_record_migrations.html
    - https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html
---

### 問題

當你在一個已經跑了很多年的 Rails + MySQL 專案加一張新表，然後很直覺地寫：

```ruby
create_table :shop_ai_credentials do |t|
  t.references :shop, null: false, foreign_key: true
  t.string :provider, null: false
  t.timestamps
end
```

在新建的 local 環境可能沒事，但 deploy 到 production 會在 migration 那一步死掉，錯誤訊息類似：

```
Mysql2::Error: Referencing column 'shop_id' and referenced column 'id'
in foreign key constraint ... are incompatible.
```

### 原因

`t.references :shop` 在 Rails 5.1+ 預設會建 `bigint`。但如果你的 `shops.id` 是很久以前建的，欄位型態很可能是 `int` 而不是 `bigint`。MySQL 建 foreign key 時會嚴格檢查兩邊欄位型態必須完全一致，`int` 跟 `bigint` 就會被擋下來。

local 可能沒事是因為你是用最新的 schema 從零跑 migration，`shops.id` 一開始就是 bigint。production 則是歷史遺物。

***

### 修法

有兩個方向：

**1. 不加 DB-level 的 FK，只在 model 層用 `belongs_to`**

```ruby
create_table :shop_ai_credentials do |t|
  t.bigint :shop_id, null: false
  t.string :provider, null: false
  t.timestamps
end

add_index :shop_ai_credentials, :shop_id
```

```ruby
class ShopAiCredential < ApplicationRecord
  belongs_to :shop
end
```

Referential integrity 從 DB 移到 app 層。優點：不用動 `shops` 表、deploy 零風險。缺點：如果有別的系統 (data pipeline、直接跑 SQL 的人) 繞過 Rails 寫資料，就保證不了了。

**2. 先把 `shops.id` 升級成 bigint**

這是正解，但成本高。要：

- 確認 `shops.id` 沒有其他表以 `int` 型態參照它 (每個參照方都要一起升級，不然同樣撞 FK 型態錯誤)。
- 跑一支 migration 改 column type。大表會鎖很久。
- 測 replication 是否跟得上。

小專案可以做，大表 + 多 FK 的老專案通常不值得。

***

### 為什麼不要留 `foreign_key: true` + rescue

有些人會想「那我包 `begin/rescue` 先試看看」。不要。migration 失敗後 schema 會停在半套狀態，下一次 deploy 會更麻煩。decision 要在寫 migration 當下就做：**要嘛確認兩邊都是 bigint，要嘛就不加 DB FK**。

***

### 順便：欄位 index 也要自己加

`t.references` 會自動加 index，但 `t.bigint :shop_id` 不會。記得手動：

```ruby
add_index :shop_ai_credentials, :shop_id
```

如果還有複合 unique index (ex: `[shop_id, provider]`)，**單欄 `shop_id` index 還是要保留**。MySQL 複合 index 只在前綴欄位可以被單欄查詢利用，但有些 ORM 產生的 query 不一定會打到前綴，留一個獨立的 `shop_id` index 最保險。

***

### 小結

- `t.references` 在新專案很好用，老專案要先確認對面 `id` 欄位型態。
- 用 `t.bigint :shop_id` + `belongs_to` 是**最務實的妥協**：DB 不加 FK、model 負責關聯。
- 別忘了手動加 `add_index` 跟複合 unique index。
