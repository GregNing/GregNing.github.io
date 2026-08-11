---
layout: post
title: 'CarrierWave 在 CI 上亂打 GCS 的坑'
date: 2026-04-24 19:00
comments: true
categories: Rails
description: 'Class-level storage :gcloud overrides global test config. Force :file in specs.'
tags: Rails CarrierWave Testing CI
reference:
  name:
    - CarrierWave README
    - CarrierWave Fog / Cloud Storage
  link:
    - https://github.com/carrierwaveuploader/carrierwave
    - https://github.com/carrierwaveuploader/carrierwave#using-amazon-s3-and-others-fog
---

### 症狀

CI 上突然整片紅，每個 spec 只要 `create(:product)` (或任何會建 uploader 的 factory) 就噴：

```
Google::Auth::CredentialsError: keyfile not a valid file
# 或
Google::Auth::CredentialsError: credentials type '' is not supported
```

local 不會，因為 local 有完整的 GCS credentials file。CI 沒有，就爆。

### 表象先不談，根本原因是：uploader 在**跑 spec 的時候**試著連 GCS

聽起來很廢話，但按照一般 CarrierWave 的 test setup 應該不會這樣：

```ruby
# spec/support/carrierwave.rb
CarrierWave.configure do |config|
  config.storage = :file
  config.enable_processing = false
end
```

理論上這個 global 設定會讓所有 uploader 在 test 環境用 local file。為什麼沒生效？

***

### 原因：class-level storage declaration 會 override global config

看一下你的 app 是不是有這種 uploader：

```ruby
class UploaderBase < CarrierWave::Uploader::Base
  storage :gcloud        # ← 這一行
end

class FaviconUploader < UploaderBase
end

class SmsKycDocumentUploader < UploaderBase
  storage :gcloud        # ← 或這一行
end
```

`storage :gcloud` 在 class 定義時就把 `_storage` 變數寫死到該 class 上。CarrierWave 的 lookup 順序是：

1. instance 的 `_storage`
2. **class 的 `_storage`**  ← 卡在這
3. parent class 的 `_storage`
4. global `CarrierWave.configure`

也就是說，只要 uploader class 裡有 `storage :gcloud`，**global config 永遠搶不過 class-level**。`CarrierWave.configure` 在 spec/support 裡設的 `:file` 對這些 class 完全無效。

### 為什麼 local 看起來沒事

local 環境 gcloud credentials file 是齊全的，所以即使真的走了 GCS 初始化路徑，也不會拋錯 — 只是在背景靜默連上 production bucket，你不會在 spec log 裡看到。

（是的，這代表你 local 跑 spec 的時候，可能在對 **production GCS 打 request**。這本身就該修。）

***

### 修法：spec land only，不要動 app code

不要改 uploader。改 uploader 容易出錯 (忘了 merge、env 判斷寫在 uploader 很醜)，也會影響 dev 環境的行為。

在 `spec/rails_helper.rb` 或 `spec/support/carrierwave.rb`：

```ruby
RSpec.configure do |config|
  config.before(:suite) do
    # eager load，讓所有 uploader subclass 都被 Ruby 認得
    Rails.application.eager_load!

    # 強制所有 CarrierWave uploader 在 spec 走 :file
    CarrierWave::Uploader::Base.descendants.each do |klass|
      klass.storage :file
    end

    # 關掉 image processing，避免 spec 真的跑 MiniMagick
    CarrierWave::Uploader::Base.descendants.each do |klass|
      klass.enable_processing = false
    end
  end
end
```

### 這段做了什麼

1. **`eager_load!`**：development / test 預設是 autoload，不先 `eager_load!` 的話 `descendants` 只會看到已經 require 過的 uploader。
2. **走到每個 subclass 把 `_storage` 覆寫成 `:file`**：這次是 class-level 寫入，就會蓋掉 uploader 檔案裡寫的 `storage :gcloud`。
3. **`enable_processing = false`**：關 image processing，spec 不會真的跑 thumbnail，快很多。

***

### 為什麼不用 `CarrierWave.configure` 就夠？

前面講過，class-level 的 `storage :gcloud` 搶在 global config 前面。global configure 只有對 **沒宣告 storage 的 uploader** 生效。

### 為什麼不用 `ENV['RAILS_ENV']` 條件在 uploader 裡判斷？

```ruby
class UploaderBase < CarrierWave::Uploader::Base
  storage(Rails.env.test? ? :file : :gcloud)
end
```

能動，但：

- uploader 開始背業務無關的環境判斷。
- CI 上要切換測試環境 (ex: integration test 真的要測 GCS) 時沒彈性。
- `storage` 呼叫時機是 class 定義期，某些 preloading 組合下會比 Rails.env 早。

比起這個，把測試策略放在 spec/support 是更乾淨的 separation of concerns。

***

### 順便：Active Storage 也有類似問題

Active Storage 用的是 `config/storage.yml` + `config.active_storage.service`，一般情況下：

```yaml
# config/storage.yml
test:
  service: Disk
  root: <%= Rails.root.join("tmp/storage") %>
```

```ruby
# config/environments/test.rb
config.active_storage.service = :test
```

這兩個沒齊全的話，test 也會跑到 production 的 service 名字。新開 project 時 check 一下。

***

### 小結

- CarrierWave class-level `storage :gcloud` 會 override 全域 test config。
- 修在 spec side：`before(:suite)` eager load + `descendants.each { |k| k.storage :file }`。
- 不要動 app code 裡的 uploader。
- CI 上「寫到 production bucket」這種事，local 可能看不出來；固定檢查 spec log 是不是有對外請求很重要。
