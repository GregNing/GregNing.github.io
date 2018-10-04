---
layout: post
title: 'show devise gem files'
date: 2018-02-23 16:41
comments: true
categories: Ruby-On-Rails
description: '顯示 devise 有關的檔案'
tags: Ruby Rails
---
### 如何顯示關於[devise](https://github.com/plataformatec/devise#getting-started) controller 以及 view
顯示`Views`
```c
#可以叫出 devise views
rails g devise:views
#這是叫出繼承devise的 users views
rails g devise:views users
```
顯示`Controllers`
```c
#顯示繼承devise controller的 users controller
rails g devise:controllers users
```
## 如果有自訂 controller要使用，而不要使用預設devise路徑請使用以下方式進行處理
```rb
devise_for :user, controllers: {
  passwords: 'users/passwords',
  registrations: 'users/registrations',
  sessions: 'users/sessions'
}
```