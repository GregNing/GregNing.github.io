---
layout: post
title: 'Ruby上傳到Heroku(基礎篇)'
date: 2018-01-17 12:29
comments: true
categories: Heroku
description: ROR專案上傳到Heroku
tags: Heroku Ruby Git
---

使用Rails建立`rails new app_Name`專案進入專案之後請輸入`bundle`讓專案跑一次等於是重建的效果。

啟動Rails 伺服器預設網址`http://localhost:3000`使用此指令時請開新的終端機讓他進行運轉`rails s`。

在這邊使用`scaffold`方式建立留言板
```bash
rails g scaffold topic title:string description:text
rake db:migrate
```
接下來是使用git做相關動作，設定相關app資訊。<br>
設定成我的名字 GregYang
`git config --global user.name "GregYang"`

在這注意要將email 改為自己的並且已經註冊過git hub的email<br>
`git config --global user.email "GregJieNing@gmail.com"`

存擋時就知道就會紀錄是誰存擋。

請在此目錄app_Name下輸入`git init`設定存擋進度所使用。

設定專案上傳到Github，在Github上設定電子簽名SSh Key因要在Github留印動作，查看是否已經設定完成`more ~/.ssh/id_rsa.pub`。<br>
如上述設定失敗請輸入以下輸入完成連按三次enter`ssh-keygen`。<br>
上述設定完成輸入以下將內容拷貝起來<br>
`more ~/.ssh/id_rsa.pub`

在去做設定動作[New SSH key](https://github.com/settings/ssh)

若要將自己專案放在網路上觀賞請參考下列步驟使用Heroku 方便上傳給人參觀網站
註冊帳號[Heroku](https://www.heroku.com/)。

以下是安裝資訊需要放在網路上供觀賞所需資訊[heroku install](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
```
brew install heroku/brew/heroku
檢查版本
heroku --version
```
完成 Heroku 的 SSH-key 的设定<br>
輸入heroku login<br>
再輸入heroku keys:add 即可完成部署
```
發布
git push heroku master
在輸入以下
heroku run rake db:migrate
最后在终端输入 heroku open 就可以打开刚刚部署到heroku上的app了。
heroku open
```