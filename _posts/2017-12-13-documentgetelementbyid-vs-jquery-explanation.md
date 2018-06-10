---
layout: post
title: 'document.getElementById vs jQuery $() 比較不同'
date: 2017-12-13 03:11
comments: true
categories: 
---
建議使用Javascript 畢竟Jquery 基礎語言是使用Javascript 只是使用更簡潔的語言表達
使用Javascript 對本身能力也有提升

	回傳HTML dom元素
	document.getElementById('contents'); //returns a HTML DOM Object
	回傳Jquery 物件
	var contents = $('#contents');  //returns a jQuery Object
	回傳HTML dom元素
	var contents = $('#contents')[0]; //returns a HTML DOM Object

來源:https://stackoverflow.com/questions/4069982/document-getelementbyid-vs-jquery