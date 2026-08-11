---
layout: post
title: '用 ActiveSupport::MessageEncryptor 加密 per-tenant API key'
date: 2026-04-24 18:30
comments: true
categories: Rails
description: 'Encrypt tenant secrets at rest without extra gems'
tags: Rails Security Encryption
reference:
  name:
    - ActiveSupport::MessageEncryptor
    - ActiveSupport::KeyGenerator
  link:
    - https://api.rubyonrails.org/classes/ActiveSupport/MessageEncryptor.html
    - https://api.rubyonrails.org/classes/ActiveSupport/KeyGenerator.html
---

### 問題

SaaS 專案有一種很常見的需求：**每個 tenant (shop / team / org) 自己填 API key**。OpenAI / LINE Pay / ECPay 等等，各家第三方 API 的金鑰，不能寫死在 `config/secrets.yml` 或 `ENV`，因為每個 tenant 都不一樣。

最糟的實作是直接把金鑰**明文存 DB**：

```ruby
create_table :shop_ai_credentials do |t|
  t.bigint :shop_id, null: false
  t.string :provider, null: false
  t.string :access_token   # ← 明文
  t.timestamps
end
```

這樣 DB backup 一外洩、DBA 一下 query、log 不小心吐出來，全部 tenant 的金鑰就全跟著走。

***

### Rails 7.1+ 內建的 encrypts

Rails 7.1 之後直接支援 attribute-level encryption：

```ruby
class ShopAiCredential < ApplicationRecord
  encrypts :access_token
end
```

底層會幫你處理加密 / 解密 / key rotation，相當方便。如果你的 Rails 夠新，**直接用這個就好**。

但如果你在 Rails 6/7.0、或因為別的原因不能用 `encrypts`，可以手刻一個基於 `ActiveSupport::MessageEncryptor` 的版本。

***

### 手刻版：MessageEncryptor

**Migration**

```ruby
create_table :shop_ai_credentials do |t|
  t.bigint :shop_id, null: false
  t.string :provider, null: false
  t.text :access_token_encrypted     # 加密過的存這欄
  t.string :model
  t.timestamps
end
```

**Model**

```ruby
class ShopAiCredential < ApplicationRecord
  belongs_to :shop

  def access_token
    return nil if access_token_encrypted.blank?
    encryptor.decrypt_and_verify(access_token_encrypted)
  rescue ActiveSupport::MessageEncryptor::InvalidMessage
    nil
  end

  def access_token=(plaintext)
    self.access_token_encrypted =
      plaintext.present? ? encryptor.encrypt_and_sign(plaintext) : nil
  end

  private

  def encryptor
    self.class.encryptor
  end

  def self.encryptor
    @encryptor ||= begin
      key = ActiveSupport::KeyGenerator
              .new(Rails.application.secret_key_base)
              .generate_key("shop_ai_credential.access_token.v1", 32)
      ActiveSupport::MessageEncryptor.new(key)
    end
  end
end
```

### 幾個要點

1. **`secret_key_base` 當 master key**。Rails 自己已經要求這是高熵隨機值，拿來 derive 沒問題。Production 走 credentials、env var、secret manager 都可以，重點是不要進 git。

2. **`KeyGenerator` + salt**。不要直接把 `secret_key_base` 塞給 MessageEncryptor。KeyGenerator 是 PBKDF2，會針對這個欄位的用途 derive 出獨立的 key。salt 帶版本號 (`"v1"`)，之後要 rotate 時可以換 `"v2"` 做 migration。

3. **`encrypt_and_sign` / `decrypt_and_verify`**。用帶驗證的方法 (內部其實是 AES-GCM)，密文被竄改時 `decrypt_and_verify` 會拋 `InvalidMessage`，而不是默默吐出亂碼。

4. **`@encryptor` memoize 在 class 層級**。每次讀寫都重做 PBKDF2 會慢 (PBKDF2 就是設計來慢的)，memoize 到 process 記憶體就好。

5. **rescue `InvalidMessage` 回 nil**。某些情境下 (ex: secret_key_base 真的換了、或 DB 裡有歷史髒資料) 你會希望解密失敗時 app 不要整個爆掉。要不要 rescue 看需求 — 走 fail-fast 也合理。

***

### 表單端注意事項

Admin UI 常見需求是「編輯這張 credential 的模型設定，但不想強制重填金鑰」：

```slim
= form_with model: credential do |f|
  = f.password_field :access_token,
      placeholder: credential.access_token_encrypted.present? ? "已設定 — 留空則保留現有金鑰" : "輸入金鑰"
```

Controller 端：

```ruby
def credential_params
  permitted = params.require(:shop_ai_credential).permit(:provider, :model, :access_token)
  permitted.delete(:access_token) if permitted[:access_token].blank?
  permitted
end
```

空字串就從 params 拿掉，`access_token=` setter 就不會被呼叫，`access_token_encrypted` 保留原值。

***

### 為什麼不用 symmetric encryption gem (ex: lockbox、attr_encrypted)

- 少一個 dependency，`ActiveSupport::MessageEncryptor` 已經在 Rails 裡，維護成本低。
- 需求簡單 (單一欄位、單一 purpose) 時，gem 的功能都用不到。
- gem 通常會綁自己的 key schema，之後要遷移到 Rails 7.1 `encrypts` 反而多一步。

如果你需要 **blind index** (加密後還能 query)、或 **key rotation 自動化**，gem 的功能才開始有價值。

***

### 不會保護你的東西

- **Memory dump**：程式跑的時候金鑰解密後在記憶體裡，root 存取 process 記憶體就看得到。
- **Log 不小心印出來**：`Rails.logger.info credential.access_token` 就前功盡棄，code review 要盯。
- **`secret_key_base` 本身外洩**：key 跟 ciphertext 一起外洩等於沒加密。最低限度：production 不把它放在 git、ideally 放進 secret manager (GCP Secret Manager、AWS KMS、Vault)。

***

### 小結

- Rails 7.1+：直接 `encrypts :access_token`。
- 7.0 以下：手刻一個 `MessageEncryptor` + `KeyGenerator` 包裝，30 行解決。
- 加密欄位命名帶 `_encrypted` 後綴，欄位型態用 `text`，不要用 `string` (密文比明文長)。
- log / inspect / as_json 要確認不會吐出明文或密文。
