---
layout: post
title: 'Ruby use email html css gem'
date: 2018-02-03 08:25
comments: true
categories: Ruby-On-Rails
description: 'Ruby 使用寄信Email-HTML CSS樣式的gem'
tags: Gem Rails Ruby
reference:
  name:
    - letter_opener
    - premailer-rails
  link:
    - https://github.com/ryanb/letter_opener
    - https://github.com/fphilipe/premailer-rails
---

請先在Gemfile安裝
```rb
gem 'letter_opener'
gem 'premailer-rails'
```
> 由於各瀏覽器對於Email的CSS支援不一致所以才使用這套件<br>
> **舉例來說有些Email閱讀器不能用<link>標籤取得css 也不能使用`<style>標籤寫只能集中於<a style="xxx"/>類似這樣**`<br>

編輯config/environments/development.rb加上以下代碼作為測試所用
```rb
config.action_mailer.delivery_method = :letter_opener
```
新增一個寄信用的`rails g mailer notification`
寫上以下代碼做為註冊所需要的 mail就是寄信所用
```rb
def confirmed_registration(registration)
  @registration = registration
  @people = registration.people
  mail( :to => @registration.email, :subject =>   I18n.t("notification.subject.confirmed_registration", :name => @people.name) )
end
```
在這我們有使用到 I18n.t，請修改`config/locales/zh-TW.yml` **在這注意到 yml請使用空格鍵(使用Tab鍵有可能造成無預期錯誤發生)**
```yaml
  "zh-TW":
    notification:
      subject:
        confirmed_registration: "報名成功: %{name}"
```
Controller中設定寄信一小段即可這樣就可以寄信了
```rb
NotificationMailer.confirmed_registration(@registration).deliver_later
```
編輯`app/views/layouts/mailer.html.erb`全部替換成以下代碼
在View中設定 Email畫面
**注意 Email當中的網址請寫成絕對網址url 而不是path Rails會透過config.action_mailer.default_url_options = { :host => 'localhost:3000' }去加上現在當前的網址**
```erb
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Notification</title>
<link href="email.css" media="all" rel="stylesheet" type="text/css" />
</head>
<body itemscope itemtype="http://schema.org/EmailMessage">
<table class="body-wrap">
<tr>
<td></td>
<td class="container" width="600">
<div class="content">
<table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction">
<tr>
<td class="content-wrap">
<meta itemprop="name" content="Confirm Email"/>
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td class="content-block">
<%= yield %>
</td>
</tr>
<tr>
<td class="content-block" itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler">
<%= yield :action %>
</td>
</tr>
<tr>
<td class="content-block">
&mdash; Name
</td>
</tr>
</table>
</td>
</tr>
</table>
<div class="footer">
<table width="100%">
<tr>
<td class="aligncenter content-block"><a href="https://gregyang.logdown.com">測試寄信</a></td>
</tr>
</table>
</div></div>
</td>
<td></td>
</tr>
</table>
</body>
</html>
```
新增`app/views/notification_mailer/confirmed_registration.html.erb`作為樣板使用
```erb
  <p>Hi <%= @registration.name %>,</p>
  <p>您已完成註冊 <%= link_to @people.name, people_url(@people) %></p>
  <% content_for :action do %>
  <%= link_to "看註冊結果", registration_url(@people, @registration), :class => "btn-primary", :itemprop =>  "url" %>
  <% end %>
```