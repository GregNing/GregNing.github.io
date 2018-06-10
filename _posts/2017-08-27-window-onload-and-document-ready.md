---
layout: post
title: 'window.onload 與 $(document).ready'
date: 2017-08-27 16:32
comments: true
categories: 
---
		window.onload   							$(document).ready
事件JS 		原生事件								 DOM標準的DOM Contentload事件
處發時機	網頁元素下載完成才會執行	全部的DOM元素下載完成就會觸發觸發時間較早
複寫	    會覆蓋									 都會執行
範例  		window.onload						$(document).ready(function (){ 
				= function()							})
        {do something...}