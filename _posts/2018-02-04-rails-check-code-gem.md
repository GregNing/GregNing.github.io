---
layout: post
title: 'Rails 檢查代碼助手'
date: 2018-02-04 14:31
comments: true
categories:
description: 'rails check code gem'
---
使用[brakeman](https://github.com/presidentbeef/brakeman)可以分析代碼找出有漏洞的地方
首先在Gemfile安裝
```rb
group :development do
  gem 'brakeman'
end
```
執行brakeman就會開始分析代碼了

使用[bundler-audit](https://github.com/rubysec/bundler-audit)可以檢查安裝gem是否有安全性漏洞需要更新
在Gemfile安裝
```rb
group :development do
  gem 'bundler-audit'
end
```
執行bundle-audit就可以開始偵測了