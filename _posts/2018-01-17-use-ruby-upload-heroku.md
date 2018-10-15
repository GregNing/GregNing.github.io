---
layout: post
title: '使用 Ruby 上傳 Heroku指南'
date: 2018-01-17 14:30
comments: true
categories: Heroku
tags: Heroku Ruby
reference:
  name:
    - ruby-on-rails-app-not-deploying-on-heroku
    - pushing-app-to-heroku-problem
    - buildpacks
    - heroku ruby-versions
    - change-a-rails-application-to-production
    - rails-application-using-postgres-adapter-cant-activate-pg
  link:
    - https://stackoverflow.com/questions/48037482/ruby-on-rails-app-not-deploying-on-heroku
    - https://stackoverflow.com/questions/2947190/pushing-app-to-heroku-problem
    - https://devcenter.heroku.com/articles/buildpacks
    - https://devcenter.heroku.com/articles/ruby-support#ruby-versions
    - https://stackoverflow.com/questions/1949229/change-a-rails-application-to-production
    - https://stackoverflow.com/questions/48201361/rails-application-using-postgres-adapter-cant-activate-pg
---
為何要修改Gemfile文件才能上傳Heroku請參考以下
```
SQLite stores data in a file. Heroku doesn't allow storing user's file so you can't use SQLite with Heroku. Instead you should to switch to another database like PostgreSQL or MySQL. Here you can find details.
If you already have an app that was created without specifying --database=postgresql you will need to add the pg gem to your Rails project. Edit your Gemfile and change this line:
```

把 sqlite3  To -> group :development, :test do<br>
Ex:
```rb
group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'sqlite3'
end
```
在新增PostgreSQL (pg)
在Rails 版本5以上請用以下安裝
```rb
gem 'pg', '~> 0.18'
# Rails < 5請用以下安裝
gem 'pg', '~> 0.11'
group :production do
  gem 'rails_12factor'
end
```
開始進行上傳Heroku動作，登入以及創建一個app在雲上
```
heroku login
heroku create
```
輸入
`git push heroku master`(換成你要放上雲端的最新要件)

執行數據庫的上載`heroku run rake db:migrate`。

失敗原因:
首先如果上傳的檔案在雲上沒有導致上傳失誤
```
輸入查看有哪些
git remote -v

基本上會有兩個
origin  https://github.com/Name/xxxx.git (fetch)
origin  https://github.com/Name/sssss.git (push)

檢查檔案名稱是否有誤
heroku  https://git.heroku.com/rocky-depths-123.git (fetch)
heroku  https://git.heroku.com/rocky-depths-123.git (push)
刪除目前heroku狀態 刪除完畢再輸入git remote -v 檢查是否還存在
git remote rm heroku
```

如出現Build failed -- check your build logs之類相關問題有可能是<br>
buildpack 尚未安裝
> Check your buildpack檢查
  heroku buildpacks
  如出現無資料相關資訊請輸入以下
  `heroku buildpacks:set heroku/nodejs`

如果`heroku run rake db:migrate`<br>
發生下面這種錯誤

	Gem::LoadError can't activate pg (~> 0.18), already activated pg-1.0.0. Make sure all dependencies are added to Gemfile.

請修改Gemfile
```rb
# 在Rails 版本5以上請用以下安裝
gem 'pg', '~> 0.18'
# Rails < 5請用以下安裝
gem 'pg', '~> 0.11'
group :production do
  gem 'rails_12factor'
end
```
執行更新動作`bundle update pg`。<br>
再來請在git commit 在 試一次 `heroku run rake db:migrate`
完成後再次上傳看看