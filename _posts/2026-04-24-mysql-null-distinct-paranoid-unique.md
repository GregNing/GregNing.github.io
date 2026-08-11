---
layout: post
title: 'MySQL NULL distinct 與 paranoid 的 unique index 陷阱'
date: 2026-04-24 18:00
comments: true
categories: MySQL
description: 'Why [shop_id, provider, deleted_at] unique does not block duplicate active rows'
tags: MySQL Rails Paranoia Soft-Delete
reference:
  name:
    - MySQL Unique Indexes and NULL
    - paranoia gem
  link:
    - https://dev.mysql.com/doc/refman/8.0/en/create-index.html
    - https://github.com/rubysherpas/paranoia
---

### 問題

使用 paranoia (或 `acts_as_paranoid`、或自己手刻 `deleted_at` 欄位) 做 soft delete 的 Rails 專案，常會看到這種 migration：

```ruby
create_table :shop_ai_credentials do |t|
  t.bigint :shop_id, null: false
  t.string :provider, null: false
  t.datetime :deleted_at
  t.timestamps
end

add_index :shop_ai_credentials, [:shop_id, :provider, :deleted_at], unique: true
```

邏輯上很合理：「同一個 shop 下同一個 provider 只能有一筆**還活著**的記錄。已刪除的 (deleted_at 有值) 不算。」

實際跑起來會發現：**同一個 (shop_id, provider) 可以塞進多筆 `deleted_at IS NULL` 的 row**。unique index 沒擋到。

### 原因：MySQL 把每一個 NULL 當成不同的值

SQL 標準規定 `NULL != NULL` (三值邏輯的 UNKNOWN)。MySQL 的 unique index 實作也是這樣：**對 unique 檢查來說，每個 NULL 都是獨一無二的**。

所以 `[1, 'openai', NULL]` 跟 `[1, 'openai', NULL]` 在 MySQL 看起來是**兩個不同的 tuple**，unique 檢查直接放行。

這個行為不是 bug，是規格。PostgreSQL 15 以前也一樣，PG 15 之後才加了 `UNIQUE NULLS NOT DISTINCT` 選項。MySQL 8.x 目前還沒有對應語法。

***

### 正確做法

**拿掉 deleted_at，unique index 只管「活著的」場景**：

```ruby
add_index :shop_ai_credentials, [:shop_id, :provider], unique: true
```

然後刪除時不要真的 soft delete 相同 row，而是處理掉衝突。

但這樣會跟 paranoia 的 default scope 打架 — soft-deleted 的 row 還在表裡，第二次再插 `[shop_id, provider]` 會撞 unique。

有幾種常見解：

**方法 A：刪除時同時改寫 provider**

```ruby
def soft_delete!
  update!(
    deleted_at: Time.current,
    provider: "#{provider}__deleted_#{SecureRandom.hex(4)}"
  )
end
```

讓歷史記錄保留，但 `provider` 欄位被「破壞」成不會撞到活著記錄的值。缺點：provider 欄位不再純粹，查詢歷史時要處理。

**方法 B：硬刪除 (真的 DELETE)，另外留一張 audit 表**

```ruby
def destroy_with_audit!
  ShopAiCredentialAudit.create!(attributes)
  destroy!    # 真 DELETE
end
```

乾淨，但要多維護一張表。適合「歷史記錄不常查但要留」的情境。

**方法 C：用 generated column**

MySQL 5.7+ 支援 generated column，可以把 NULL 轉成穩定值：

```sql
ALTER TABLE shop_ai_credentials
  ADD COLUMN deleted_at_nn DATETIME
  AS (IFNULL(deleted_at, '1970-01-01 00:00:00')) STORED;

CREATE UNIQUE INDEX ix_shop_provider_deleted_nn
  ON shop_ai_credentials (shop_id, provider, deleted_at_nn);
```

活著的時候所有 row 都是 `1970-01-01`，撞到就擋；刪掉的時候 `deleted_at_nn` 變真實時間，各自獨立。

這方法保留了原始 schema 的語意，但 migration / schema.rb 會變醜，其他開發者不一定看得懂為什麼有個 `_nn` 欄位。

***

### 為什麼不選「在 application 層檢查」

跟前一篇 race condition 的結論一樣：**application 層擋不住並發**。兩個 request 同時過驗證、同時 INSERT，DB 沒有 unique constraint 的話，就兩筆都進去了。

paranoia + 並發寫 + 沒有正確的 unique index，production 一定會出現「同一個 shop 有兩筆 active 的同 provider credential」的髒資料，而且很難追。

***

### 檢查你現在的 schema

掃一下所有用 paranoia 的表，找出可疑的 unique index：

```sql
SELECT
  TABLE_NAME,
  INDEX_NAME,
  GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS cols
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
  AND NON_UNIQUE = 0
GROUP BY TABLE_NAME, INDEX_NAME
HAVING cols LIKE '%deleted_at%';
```

每一列都值得檢查一次：這個 unique 真的有在擋嗎？

***

### 小結

- MySQL / 老版本 PG 的 unique index 對 NULL 是「每個 NULL 都不同」。
- `[..., deleted_at]` unique + paranoia 幾乎一定是 bug。
- 解法：要嘛刪除時改寫某欄位，要嘛用 generated column，要嘛硬刪除 + audit。
- 凡是用 soft delete 的表，schema review 一定要專門檢查 unique index。
