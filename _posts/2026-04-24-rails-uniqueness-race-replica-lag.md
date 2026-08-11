---
layout: post
title: 'Rails uniqueness 的兩個經典坑：Race Condition 與 Replica Lag'
date: 2026-04-24 17:30
comments: true
categories: Rails
description: 'Why validates_uniqueness_of is not enough, and how to retry safely'
tags: Rails ActiveRecord MySQL Concurrency
reference:
  name:
    - Rails validates_uniqueness_of
    - ActiveRecord::RecordNotUnique
  link:
    - https://api.rubyonrails.org/classes/ActiveRecord/Validations/ClassMethods.html#method-i-validates_uniqueness_of
    - https://api.rubyonrails.org/classes/ActiveRecord/RecordNotUnique.html
---

### 情境

有一張 `shop_product_photos` 表，需求是：「同一個 shop 下，圖片檔名要唯一」。很直覺地會寫：

```ruby
class ShopProductPhoto < ApplicationRecord
  belongs_to :shop
  validates :filename, uniqueness: { scope: :shop_id }

  before_validation :ensure_unique_filename

  def ensure_unique_filename
    return unless filename_changed?
    base = filename
    i = 2
    while self.class.where(shop_id: shop_id, filename: filename).exists?
      self.filename = "#{base}_#{i}"
      i += 1
    end
  end
end
```

然後在 production 就會不定時 500：

```
ActiveRecord::RecordNotUnique: Mysql2::Error:
Duplicate entry 'photo_1-shop_42' for key 'index_shop_product_photos_on_filename_and_shop_id'
```

### 坑 1：TOCTOU — Time Of Check To Time Of Use

```
t=0  Request A: SELECT ... WHERE filename='photo_1' → 不存在
t=1  Request B: SELECT ... WHERE filename='photo_1' → 不存在
t=2  Request A: INSERT 'photo_1'  ← 成功
t=3  Request B: INSERT 'photo_1'  ← 撞 unique index，500
```

兩個 request 在 `exists?` 那一瞬間都看不到對方。Rails 的 `validates_uniqueness_of` 跟上面的 callback 都是這個 pattern，都擋不住這種 race。

### 坑 2：Primary / Replica Lag

Production 通常會把讀寫分流：寫走 primary，讀走 replica。`ApplicationRecord` 如果設定 `connected_to role: :reading`，`exists?` 可能跑到 replica。

```
t=0  Primary: INSERT 'photo_1' by Worker A     (commit)
t=1  Replica: (還沒 replicate 過來)
t=2  Worker B: exists? → 打 replica → false    (看不到 A 寫入)
t=3  Worker B: INSERT 'photo_1' → 撞 primary unique index，500
```

這不是 race condition，是 eventual consistency。幾十 ms 的 lag 就足夠中獎，而且比 TOCTOU 更難 reproduce。

***

### 真正的唯一性來源：DB unique index

Callback / validation 都只是 **best effort**，用來 UX 友善 (拒絕一些常見的重複、提早 fail) 。**唯一性唯一可靠的保證是 DB 的 unique index。** 寫 migration 時一定要加：

```ruby
add_index :shop_product_photos, [:shop_id, :filename], unique: true
```

然後應用層要 **預期 unique index 會撞到，並且處理它**。

***

### 重試 + 改名的模式

```ruby
class ShopProductPhoto < ApplicationRecord
  UNIQUE_FILENAME_INDEX = 'index_shop_product_photos_on_filename_and_shop_id'
  MAX_RETRIES = 10

  def save_with_unique_filename!
    base = filename.sub(/_\d+\z/, '')   # 把舊的 _N 剝掉重算
    taken = Set.new
    attempt = 0

    begin
      save!
    rescue ActiveRecord::RecordNotUnique => e
      raise unless e.message.include?(UNIQUE_FILENAME_INDEX)
      raise if (attempt += 1) > MAX_RETRIES

      taken << filename
      # 從 primary 重查一次，拿最新已存在的檔名
      existing = self.class.unscoped
                     .where(shop_id: shop_id)
                     .where('filename LIKE ?', "#{base}%")
                     .pluck(:filename)
      taken.merge(existing)

      i = 2
      i += 1 while taken.include?("#{base}_#{i}")
      self.filename = "#{base}_#{i}"

      retry
    end
  end
end
```

### 要點說明

1. **只 rescue 特定 index**。`RecordNotUnique` 也會因為其他 unique index (ex: `email`) 觸發；亂 rescue 會把別的錯誤吞掉，所以要比對 message。
2. **把撞失敗的檔名也塞進 taken**。replica lag 會讓 LIKE 查詢「看不到自己剛撞到的那個」，再跑一次就又挑到同一個名字。手動塞進去避免死循環。
3. **MAX_RETRIES**。沒有上限就是 DoS。10 次通常足夠，超過就是有別的問題 (真的有一萬個同名檔案？或者 bug)。
4. **一定要 primary 重查**。Rails 6+ 可以 `ApplicationRecord.connected_to(role: :writing) do ... end` 強制走 primary。
5. **`_N` 要剝掉重算**。不然重試時會一路往上 (`_2` → `_2_2` → `_2_2_2`)。

***

### 為什麼不用 `SELECT ... FOR UPDATE`

兩個理由：

1. 鎖 `shop_id` 層級會把同一個 shop 的所有上傳串行化，上傳並發高的 shop 就卡住了。
2. 要鎖「不存在的 row」得用 gap lock / advisory lock，複雜度遠高於「rescue + retry」。

對這種「自動改名避開衝突」的需求，樂觀鎖 (optimistic) + retry 幾乎永遠比悲觀鎖 (pessimistic) 好。

***

### 測試怎麼寫

```ruby
it 'retries on unique index violation' do
  create(:shop_product_photo, shop: shop, filename: 'photo_1')
  photo = build(:shop_product_photo, shop: shop, filename: 'photo_1')
  photo.save_with_unique_filename!
  expect(photo.filename).to eq('photo_1_2')
end

it 'does not retry on unrelated unique index' do
  # 模擬別的 index 撞到
  allow(photo).to receive(:save!).and_raise(
    ActiveRecord::RecordNotUnique.new('Duplicate entry for index_on_email')
  )
  expect { photo.save_with_unique_filename! }.to raise_error(ActiveRecord::RecordNotUnique)
end

it 'raises after MAX_RETRIES' do
  allow(photo).to receive(:save!).and_raise(
    ActiveRecord::RecordNotUnique.new("... #{ShopProductPhoto::UNIQUE_FILENAME_INDEX} ...")
  )
  expect { photo.save_with_unique_filename! }.to raise_error(ActiveRecord::RecordNotUnique)
end
```

至少覆蓋：初次成功、撞一次改名、撞到別的 index 不重試、超過上限拋出。

***

### 小結

- `validates_uniqueness_of` 不保證唯一性，DB unique index 才保證。
- Callback 幫忙的是 UX (常見場景提早 fail)，production 還是會撞 `RecordNotUnique`。
- 處理方式：rescue **特定** index + retry + 改名 + 上限。
- primary/replica 分流的架構，重試時要強制走 primary 查資料。
