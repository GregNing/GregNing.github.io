---
layout: post
title: 'Ruby 發生NoMethodError in Posts#edit處理'
date: 2018-01-17 13:43
comments: true
categories: 
---
進去連畫面都看不到才發生
如果發生 NoMethodError in Posts#edit 類似這種問題
undefined method `post_path' for #<#<Class:0x007ffe6d521ef8>:0x007ffe6db9f0f0>
Did you mean?  font_path
               root_path
處理方式:

	在config/routes.rb下新增以下代碼
	resources :posts

Ending
來源：https://stackoverflow.com/questions/37735081/no-method-error-in-postsedit-take-2