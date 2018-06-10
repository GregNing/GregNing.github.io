---
layout: post
title: 'Rake db淺談'
date: 2018-01-27 17:16
comments: true
categories: 
---
rake 的概念解說把它當作是一個執行 task所專屬的命令就可
rake 直譯上來說就是 Ruby Make ，用 ruby 語言開發的 Make
也可以說是一套 task 管理工具，幫助我們自動化執行所需要的指令

列出所有目前能執行的 rake 指令 (包含 install gem 以後建置在內的)

	rake -T

執行 資料庫異動設定 的 task

	rake db:migrate 

撰寫 seed.rb 檔 來重置你弄亂的檔案
我們來做一個 seed 檔作為測試
打開 DB/SEEDS.RB 新增以下指令

	pust '建立帳號'
	create_account = User.create([email: 'example@gmail.com', password: '123456', password_confirmation: '123456', name: '測試帳號'])

在執行

	rake db:seed

他就會幫你建立一個帳號(在這就代表著其實主要運用於執行對db存取修改資訊)
rake db:reset 是內建的 task ，會執行一整套流程
整個內容有 db:drop( 資料庫移除 ) => db:create( 資料庫建立 ) 
=> db:schema:load ( 資料庫欄位建立 ) => db:seed ( 執行資料庫種子 )

	rake db:reset

如果想把資料庫資料一切重新來過步驟是這樣

	rake log:clear + rake tmp:clear + rake db:drop + rake db:create + rake db:migrate + rake db:seed

這樣太慢了所以我們自己建立一個執行檔直接來幫你跑
現在讓我開始自己撰寫自己想要的 task(執行檔)指令也就是可以輸入以下就會執行 example.rake檔案裡面的內容

	rake example:resetbuild

由於Rails 預設執行會在railties/lib/rails/tasks/ 目錄的一些檔案(.rake 檔)，這些都是 Rails 預設會載入的任務。而 rake db:migrate 任務內容就藏在這網址(https://github.com/rails/rails/blob/v5.0.0.beta4/railties/lib/rails/tasks/engine.rake)。

在 lib/tasks/ 資料夾建立一個檔案 example.rake
以下指令適用於重建資料庫並且直接重頭到尾建立好資料(如果你有在seed檔案建立你要的資訊的話)

	namespace :example do
		desc "清空以及重建資料庫"
		task :build => ["tmp:clear", "log:clear", "db:drop", "db:create", "db:migrate"]
		task :resetbuild => [ "dev:build", "db:seed" ]
	end

	desc "範例"
	task :buildtest do
		puts "範例!"
	end

如果尚未定義 namespace就可以直接這樣執行但建議還是定義一下

	rake buildtest 

有定義namespace 中間的 : 前面就是接 namespace 後面就是方法名稱Ex: namespaceName:taskName

	rake example:build

task 方法可以定義任務的名字，後面接的就是執行名稱了 
最上面的 desc 則僅是這個任務的描述，如果有描述的話，在 rake -T 指令列出任務清單的時候就看得到說明了
只要輸入以下即可完成重建資料庫
這邊是清空資料

	rake example:build

下面是重建資料你所需要的資料可以寫在 seed檔裡面

	rake example:resetbuild

在 Rails 5 以後 rake 指令可以改變成以下方式
原本是這樣

	rake db:migrate
	rake routes

後來變成

	rails db:migrate
	rails routes

以上兩種指令都可以執行