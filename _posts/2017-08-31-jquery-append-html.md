---
layout: post
title: '使用JQuery append進html'
date: 2017-08-31 04:09
comments: true
categories: 
---

	$(".userimglist").prepend(
	$("<li/>")
	.addClass('userimgitem')
	.prepend($("<img/>")
	.addClass('userimgitemimage')
	.attr('src', "@Url.Action("UsersImages","Home",{ id = "5"})")
	));

	$('#item').html(
	$('<div/>')
	.addClass('list')
	.css('color','red')
	.html('jQuery')
	.append(
	$('<a/>')
	.attr('href','http://ithelp.ithome.com.tw')
	.append(
	$('<img/>')
	.attr('src','image.jpg'))));
兩種使用方式都可以 append是在元素後面插入 prepend則是在元素前