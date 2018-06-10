---
layout: post
title: 'Ruby Active Record 關聯使用'
date: 2018-01-21 04:50
comments: true
categories: 
---
顧客Customer 訂單Order 範例
belongs_to	關聯為一對一關係
belongs_to 宣告必須使用單數形式。上例若使用複數形式，會報 "uninitialized constant Order::Customers" 錯誤。這是因為 Rails 使用關聯名稱來推出類別名稱。關聯名稱錯用複數，推斷出來的類別名稱自然也錯了。

has_many 關聯為一對多關係
宣告 has_many 關聯名稱採複數。

dependent用法
在刪除關聯物件擁有者時該如何處理關聯物件：
:destroy：同時刪除關聯物件。
:delete：直接將關聯物件從資料庫刪除，不會執行回呼。
:nullify：把外鍵設為 NULL，不會執行回呼。
:restrict_with_exception：有關聯物件的話，向擁有者拋出異常。
:restrict_with_error：有關聯物件的話，向擁有者拋出錯誤。
若在資料庫設定了 NOT NULL 約束條件，則不要使用 :nullify。此時若沒有把 :dependent 設為 destroy，會無法修改關聯物件，因為原本關聯物件的外鍵會被設為不允許的 NULL。
建立訂單以及顧客資料參考以下即可
@order = @customer.orders.create(order_date: Time.now)
若要刪除顧客資料 則訂單也須跟顧客一起刪除否則會查詢不到資料
dependent: :destroy

	class Customer < ActiveRecord::Base
		has_many :orders, dependent: :destroy
	end

	class Order < ActiveRecord::Base
		belongs_to :customer
	end

has_many :through 關聯
has_many :through 關聯通常用來建立兩個 Model 之間的多對多關係。has_many :through 關聯透過（through）第三個 Model，宣告一個 Model 實體，可有零個或多個另一個 Model 實體。舉個醫療的例子，“病患”需要透過“預約”來見“物理治療師”。相對應的宣告如下：

	class Physician < ActiveRecord::Base
		has_many :appointments
		has_many :patients, through: :appointments
	end

	class Appointment < ActiveRecord::Base
		belongs_to :physician
		belongs_to :patient
	end

	class Patient < ActiveRecord::Base
		has_many :appointments
		has_many :physicians, through: :appointments
	end

has_many :through 關聯在簡化嵌套的 has_many 關聯很有用。比如文件有多個章節、段落。想要簡單地從文件取得所有段落，可以這麼寫：

	class Document < ActiveRecord::Base
		has_many :sections
		has_many :paragraphs, through: :sections
	end

	class Section < ActiveRecord::Base
		belongs_to :document
		has_many :paragraphs
	end

	class Paragraph < ActiveRecord::Base
		belongs_to :section
	end

指定了 has_many :paragraphs, through: :sections 之後，Rails 便懂得如何透過章節，從文件中取得段落：
@document.paragraphs

如果值要規定為數字有以下寫法要是數字而且大於0

	validates :isnumber, numericality: { greater_than: 0, :message => "必須為數字，且大於0"}	
	validates_numericality_of :isnumber, :wage_lower_bound, :only_integer => true #必須是整數

接下來是 scope 語法想像成 SQL 語法 或是 C# linq 語法

created_at做排序動作

	scope :recent, ->{ order("created_at DESC") }

找出 is_hidden這個欄是false

	scope :whereis_hidden_is_false, -> { where(:is_hidden => false)}  

在model 定義 method 從Controller 去呼叫

	def publish!
			self.is_hidden = false
			self.save
	end


來源:	https://rails.ruby.tw/association_basics.html#has-many-through-關聯
來源	https://rails.ruby.tw/association_basics.html