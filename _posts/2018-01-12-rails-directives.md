---
layout: post
title: 'Git相關指令'
date: 2018-01-12 14:26
comments: true
categories: 
---
使用 get 製作個人hash(電子簽名意思)
首先輸入以下代碼為了取得hash key
```c 取得hash key
	more ~/.ssh/id_rsa.pub
```
沒有的話請輸入(尚未產生id_rsa.pub檔案) 輸入完成後click三次
在輸入more ~/.ssh/id_rsa.pub 取得hashkey
```c 產生id_rsa.pub檔案
	ssh-keygen
```
前往[新增ssh key](https://github.com/settings/ssh)完成後他就認得你了
一開始建立完專案請執行以下指令方便之後做板控
初始化repository（repo）並且建立 .git資料夾做版本控管
```c git 初始化
	git init # 初始化
	git checkout -b ch08 # 	建立並且移動到ch08
	等於以下
	git branch h08
	git checkout ch08
```
```c git 相關指令
	git status # 查看新增修改刪除狀態
	git add -A # 把所有狀態都變成要新增進去目前要簽入的對象（建議使用此指令 不建議使用 git add .）新增到staging
	git commit -m "註解原因" # 新增commit log
	git checkout master # 移動到master
	git merge ch08 # 將 ch08 合併到 master去合併分支的意思
	git remote -v  # 查看目前連線版本狀態
	git remote rm heroku # 將heroku連線刪除 
	git push --all origin # 上傳所有進度到origin(branch)
	git clone git@github.com:XXXXX/job-listing.git （XXXXX 是你的 github 用户名）# 從遠端下載下來
	git diff # 查看剛剛改過的檔案
	git checkout . # 將以修改檔案回復原來的樣子用於已被追蹤的檔案(新增檔案不在於此範圍因為沒被git 追蹤)
	rm -rf .git # 如果在錯誤的路徑使用 git init 可以使用以下方式取消 git init
	git fetch origin # 獲得當前所有分支的訊息
	ls -alh | wc -l # 列出專題檔案
	git push -d <remote_name> <branch_name> # 刪除遠端分支
	git branch -d branch_name # 刪除 local 分支  
```
上傳 Github 
請先上個人 github 網站 startpujects 建立名稱 Repository name rails101 =>
再到 push an existing replsitory from the command line 複製下面兩行指令執行它
#### `git remote add origin git@github.com:你的github名字/rails102`
如果當前分支與多個主機存在追蹤關係，則可以使用 -u 來指定一個默認主機，這樣以後就可以不用加任何參數直接使用git push就好。
####	`git push -u origin master`