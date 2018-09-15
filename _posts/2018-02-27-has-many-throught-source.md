---
layout: post
title: 'use has_many through'
date: 2018-02-27 08:00
comments: true
categories:
description: 'has_many through source 範例'
tags: Ruby
---
如果要用於模型上關聯的名稱與through模型中的關聯不相同，則可以使用source來指定它。
以下範例
```rb
class Pet < ActiveRecord::Base
  has_many :dogs
end
```
```rb
class Dog < ActiveRecord::Base
  belongs_to :pet
  has_many :breeds
end
```
```rb
class Dog::Breed < ActiveRecord::Base
  belongs_to :dog
end
```
> 我們選擇使用命名空間Dog :: Breed，因為我們想要存取Dog.find(123).breeds作為關聯。<br>
> 現在，如果我們想在Pet上創建``has_many：dog_breeds，：through =>：dogs``關聯，會出現問題。<br>
> Rails將無法在Dog上找到：dog_breeds關聯，因此Rails不可能知道要使用哪個Dog關聯。所以我們要使用`:source`來指定給予
```rb
class Pet < ActiveRecord::Base
  has_many :dogs
  has_many :dog_breeds, :through => :dogs, :source => :breeds
end
```
{% capture string_with_newlines %}
使用`：source`，我們告訴Rails尋找一個名為：breeds model(來源)
> has_many :through 關聯通常用來建立兩個 Model 之間的多對多關係。
> has_many :through 關聯透過（through）第三個 Model，宣告一個 Model 實體，可有零個或多個另一個 Model 實體。
連接 Model 會自動刪除、直接執行，不會觸發任何 destroy，關聯若使用了 :through 選項，則會忽略 :dependent 選項。
[has_many through](https://stackoverflow.com/questions/4632408/understanding-source-option-of-has-one-has-many-through-of-rails)
[has_many through ruby active](https://rails.ruby.tw/association_basics.html#has-many-through-%E9%97%9C%E8%81%AF)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}