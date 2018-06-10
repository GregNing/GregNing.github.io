---
layout: post
title: 'Rails 生成HTML代碼至前端'
date: 2018-01-28 14:11
comments: true
categories: 
---
在Helper 裡面大多數的 method都是給給前端所使用的包括一些判斷

	content_tag(htmltag(html標籤),"內容", "class名稱" , "style名稱")

	content_tag(:h2, "Title") => <h2>Title</h2>

	content_tag(:span, '' , class: 'fa fa-lock') => <span class="fa fa-lock"></span>

再加上其他 style

	content_tag(:p, "This is p", class: "p", style: "font-weight: bold") => <p class="p" style="font-weight:bold">This is p</p>

以下方法是html p 包 span

	content_tag(:p, content_tag(:span, "this is span"), :style => "color: red")
	=> <p>
	=>   <span>this is span</span>
	=> </p>

以下是 div 包 h2 p "Footer"

	content_tag :div, :class => "container" do
	content_tag(:h2, "This is title") +
	content_tag(:p, "This is content") +
	"Footer"
	end
	=> <div>
	=>   <h2>This is title</h2>
	=>   <p>This is content</p>
	=>   "Footer"
	=> </div>
