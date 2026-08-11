---
layout: post
title: 'Rails migration: change vs up/down 怎麼選'
date: 2026-04-24 21:00
comments: true
categories: Rails
description: 'When change is safe, when you must write up/down explicitly'
tags: Rails Migration ActiveRecord
reference:
  name:
    - Rails Guides - Writing Migrations
    - ActiveRecord::Migration#change
  link:
    - https://guides.rubyonrails.org/active_record_migrations.html#writing-a-migration
    - https://api.rubyonrails.org/classes/ActiveRecord/Migration/CommandRecorder.html
---

### 兩種寫法

Rails migration 可以寫成：

```ruby
class AddEmailToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :email, :string
  end
end
```

或明確分開：

```ruby
class AddEmailToUsers < ActiveRecord::Migration[7.1]
  def up
    add_column :users, :email, :string
  end

  def down
    remove_column :users, :email
  end
end
```

`change` 比較短，Rails 會**自動推導出 rollback** (`db:rollback` 時執行反向操作)。看起來 `change` 永遠好，但不是。

***

### `change` 可以幫你推導的指令

官方清單 ([API docs](https://api.rubyonrails.org/classes/ActiveRecord/Migration/CommandRecorder.html))：

- `create_table` ↔ `drop_table`
- `add_column` ↔ `remove_column`
- `add_index` ↔ `remove_index`
- `add_reference` ↔ `remove_reference`
- `add_foreign_key` ↔ `remove_foreign_key`
- `change_column_default` (帶 `from:` / `to:`)
- `change_column_null`
- `rename_column`, `rename_index`, `rename_table`

這些 Rails 知道怎麼反過來。**只用這些**的 migration 可以放心用 `change`。

***

### 什麼時候一定要寫 up/down

**1. `change_column` 改型態**

```ruby
def change
  change_column :users, :age, :integer   # ← 原本是什麼？
end
```

Rails 不知道「原本是什麼型態」，rollback 時不知道要改回啥。必須：

```ruby
def up
  change_column :users, :age, :integer
end

def down
  change_column :users, :age, :string
end
```

**2. 有 data migration (寫資料)**

```ruby
def change
  add_column :users, :full_name, :string
  User.reset_column_information
  User.find_each { |u| u.update!(full_name: "#{u.first_name} #{u.last_name}") }
end
```

rollback 時怎麼還原？沒辦法。而且這整段 data migration 放 migration 裡本身就有問題 (下面再講)，但如果真的要做，至少要明確 `up` / `down`：

```ruby
def up
  add_column :users, :full_name, :string
  # data migration
end

def down
  remove_column :users, :full_name
end
```

**3. `execute` 直接跑 SQL**

```ruby
def change
  execute "UPDATE users SET role = 'member' WHERE role IS NULL"
end
```

跟上面同理，Rails 不會去 parse SQL 然後反推。必須分成 `up` / `down`，或用 `reversible`：

```ruby
def change
  reversible do |dir|
    dir.up   { execute "UPDATE users SET role = 'member' WHERE role IS NULL" }
    dir.down { execute "UPDATE users SET role = NULL WHERE role = 'member'" }
  end
end
```

**4. 真的不可逆**

```ruby
def up
  remove_column :users, :legacy_token  # 資料就這樣消失
end

def down
  raise ActiveRecord::IrreversibleMigration
end
```

誠實寫出來，不要騙自己可以回。也可以在 `change` 裡用 Rails 提供的 block：

```ruby
def change
  remove_column :users, :legacy_token, :string   # ← 注意：要指定原本的型態
end
```

`remove_column` 帶型態時 Rails 可以從 `drop_column` 推回 `add_column`，反向可逆。

***

### 我自己的 rule of thumb

- **純 schema change、且在「Rails 知道怎麼 reverse 的清單」裡** → 用 `change`。
- **含 data migration** → 不應該跟 schema change 綁在同一個 migration，拆兩支。schema 那支用 `change`，data 那支用另一種機制 (下面講)。
- **含 `execute` SQL / `change_column` 改型** → 寫 `up` / `down`，或用 `reversible`。
- **真的不可逆** → 寫 `up`，在 `down` 明確 `raise IrreversibleMigration`。

**不確定時優先寫 `up`/`down`**。多打幾行總比半夜 rollback 時 migration 自己說「我不知道怎麼回去」好。

***

### Data migration 不要放 schema migration 裡

即使你寫得漂漂亮亮的 `reversible`，實務上 **schema migration 裡跑資料更新** 還是有兩個麻煩：

**1. 大 table 會 timeout**

```ruby
User.find_each { |u| u.update!(full_name: "#{u.first_name} #{u.last_name}") }
```

1000 萬筆 user，這段跑幾小時。migration 鎖表、deploy 掛在那、DBA 電話進來。

**2. Model code 跟 schema 版本錯開**

migration 寫在 `20260424120000_backfill_full_name.rb` 時用 `User` model，半年後 `User` 已經加了新欄位、新 callback、新 validation。這支 migration 在 rollback 或 schema re-setup 時又被跑一次，可能 behavior 完全不一樣。

比較好的 pattern：**schema migration 只改 schema，data backfill 跑 rake task 或獨立的 maintenance job**：

```ruby
# lib/tasks/backfill_full_name.rake
namespace :backfill do
  task full_name: :environment do
    User.where(full_name: nil).find_each(batch_size: 1000) do |u|
      u.update_columns(full_name: "#{u.first_name} #{u.last_name}")
    end
  end
end
```

Deploy flow：

1. Deploy 帶 schema migration 的 commit → `add_column :users, :full_name`。
2. `rails backfill:full_name` 跑一次 (可中斷、可 monitor、可分批)。
3. Deploy 移除舊欄位 / 加 NOT NULL constraint 的 commit。

雖然步驟變多，但每一步都小、可回退、可 monitor。

***

### 小結

- `change` 給純 schema 用。
- `change_column` 型態改變 / `execute` SQL / data migration → 寫 `up`/`down` 或用 `reversible`。
- 真的不可逆就誠實 `raise IrreversibleMigration`。
- Schema migration 跟 data migration 分開。schema 用 `change`，data 用 rake task。
