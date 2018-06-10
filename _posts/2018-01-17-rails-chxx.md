---
layout: post
title: 'Rails ChXX'
date: 2018-01-17 12:29
comments: true
categories: 
---

	使用Rails 建立專案 進入專案之後請輸入 bundle讓專案跑一次等於是重建的效果
	rails new app_Name

	啟動Rails 伺服器預設網址http://localhost:3000使用此指令時請開新的終端機讓他進行運轉
	rails s

	建立小成品留言板
	rails g scaffold topic title:string description:text
	rake db:migrate

	接下來是使用git 做相關動作
	設定相關app資訊

	設定成我的名字 GregYang
	git config --global user.name "GregYang"

	在這注意要將email 改為自己的並且已經註冊過git hub的email
	git config --global user.email "GregJieNing@gmail.com"

存擋時就知道就會紀錄是誰存擋

	請在此目錄app_Name下輸入 設定存擋進度所使用
	git init

	查看還未被新增到進度的檔案
	git status

	將檔案加到進度裡
	git commit -m "add README"

	將檔案尚未被新增到進度的全部設定為預設存擋
	git add . or git add -A

	儲存檔案到進度控管裡
	git commit -m "add rest files"

	設定專案上傳到Github
	在 Github 上設定電子簽名SSh Key 因要在Github留印動作
	查看是否已經設定完成
	more ~/.ssh/id_rsa.pub

	如上述設定失敗請輸入以下輸入完成連按三次enter
	ssh-keygen

	上述設定完成輸入以下將內容拷貝起來
	more ~/.ssh/id_rsa.pub

	再到以下網址去做設定動作 New SSH key

	https://github.com/settings/ssh

接下來上github Start Project 開始建立專案上傳到github

接下來會常使用到的存擋指令而且直接上傳指令

git add [檔名] 或 git add . (所走檔案)
git commit -m "check in 紀錄（歷史訊息之後會常看到）"
git push origin master （Upload to github）

若要將自己專案放在網路上觀賞請參考下列步驟使用Heroku 方便上傳給人參觀網站
註冊帳號https://www.heroku.com/

以下是安裝 需要放在網路上供觀賞所需資訊https://devcenter.heroku.com/articles/heroku-cli#download-and-install

	brew install heroku/brew/heroku
	檢查版本	
	heroku --version

完成 Heroku 的 SSH-key 的设定
輸入heroku login
再輸入heroku keys:add 即可完成部署

	發布
	git push heroku master
	在輸入以下
	heroku run rake db:migrate
	最后在终端输入 heroku open 就可以打开刚刚部署到heroku上的app了。
	heroku open

新增資料夾存放專案檔案

	mkdir railsbridge
	刪除當前目錄內所有檔案
	rm -rf suggestotron
	新增一個 rails專案檔案
	rails new suggestotron（檔名）
	建立完成後使用
	bundle
  加入版本控管Git Repo
  git init
	檢查狀態還有未被遷入資料
	git status
	將此專案底下所有檔案新增進去控管
	git add .
	新增一個歷史紀錄
	git commit -m "Add all the things"  簡寫-m "Added all the things"
	啟動伺服器
	rails s

建立控制器以及model和view

	rails generate scaffold topic title:string description:text

generate scaffold 建立一個完整的Model binding 與資料庫互動
topic Model Name
title:string 是说 topics 有标题（title），它是一个字串（String）。
description:text 是说 topics 有正文内容（description），它是一段文字（Text）。（text是用來儲存很長的字串所用。）

Rails 更新資料庫並且建立 Model

	rake db:migrate

建立名為 welcome 的控制器

	rails g controller welcome

建立一個index.html.erb

	touch app/views/welcome/index.html.erb

存擋：
最一开始的时候要先执行存档：

	cd 你的项目文件夹名称
	git init
	git add -A
	git commit -m "对于修改部分的简要叙述"

新增一个分支：

	git checkout -b 你想取的分支名称

这样你的存档会自动被保留在这个分支里。
如果不小心做烂了，可以直接切回上一个分支去做。
切换分支：

	git checkout 你想要切换到的分支名称

举例来说，假设你从01开始做，做到02的时候烂掉了
你可以 git checkout 01 回到01再重新开始做

那这个烂掉的02要怎么办呢？虽然你可以产生另一个新的02-1，但还是建议把错误的删除掉，这样才不会做到最后变得乱七八糟的。
删除掉branch的方法：
先离开你要删除的分支，接着执行 git branch -D 你要删除的分支名称
就可以了。

建立Model 名字為 groups 欄位 title 型別為string description 文字屬性

rails g model group title:string description:text

新增資料庫的資料指令

	rails c(console)

在資料庫劑型新增第一筆名為Boarddescription為 Board 1 body

	Group.create(title: "Board 1", description: "Board 1 body")
	Group.create(title: "Board 2", description: "Board 2 body")
  
使用 SimpleForm 簡化程式語言也會直接提錯誤訊息再欄位旁邊 simple_form for bootstrap設定
安裝	SimpleForm
在Gemfile，新增一行 

	gem 'simple_form'

接下來安裝

	rails generate simple_form:install --bootstrap

安裝完成後重啟伺服器
語法

	<%= simple_form_for @group do |f| %>
		<div class="form-group">
			<%= f.input :title, input_html: { class: "form-control"} %>
			<%= f.input :description, input_html: { class: "form-control"} %>
		</div>
			<%= f.submit "Submit", class: "btn btn-primary", data: { disable_with: "Submiting..." } %>
	<% end %>

RESTful 的基础概念
因为 CRUD 是常见的操作行为，但是大家实作的方式、与网址设计方式不一样。造成很多维护上的困扰。
后来就有人发明 RESTful 这个概念，希望用 HTTP 的动作 ( Verb）一起去封装 CRUD 的行为。所以又多加了两个动作：
PUT/PATCH : 更新 ( update )
DELETE : 删除 ( delete）

/groups/ 一定就是 index，首页，对应Routes路径： groups_path
/groups/123 一定就是 show，名字为123的讨论版个版页面，对应Routes路径： group_path(123)
/groups/123/edit 一定就是 edit，编辑讨论版123的表单页面，对应Routes路径：edit_group_path(123)
/groups/new 一定就是 new，新增讨论版的表单页面，对应Routes路径(或称为helper)：new_group_path

使用Rails 做登入登出機制
Devise 是一个 Rails 内热门的 gem，专门用来快速实作“登录系统”。在这一章我们会用 devise 实作登录功能。
Gemfile 新增一行 gem 'devise'
Step 2 : 产生会员系统的必要文件
执行
rails g devise:install
rails g devise user
rake db:migrate
在 groups_controller 限制 “新增讨论群”必须先登录
在 app/controllers/groups_controller.rb 加入一行 before_action :authenticate_user! , only: [:new]