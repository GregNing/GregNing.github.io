---
layout: post
title: 'mouseover  mouseout mouseenter mouseleave hover以及其他事件相關資訊'
date: 2017-12-20 08:28
comments: true
categories: 
---
滑鼠事件
click：在點擊與放開滑鼠按鍵之後觸發。( 亦會產生 mousedown ＋ mouseup 事件 )
dbclick：在快速雙擊滑鼠按鍵之後觸發。( 亦會產生兩次 click 事件，故在同一標籤上不要同時使用 )
mousedown：在按下滑鼠鍵但還沒放開時觸發。( 可追蹤拖曳動作 )
mouseup：放開滑鼠鍵時觸發。( 可追蹤拖曳動作 )
mouseover：滑鼠移入網頁上某個元素時觸發。( 常與 CSS 的：hover 功能搭配使用)
mouseout：滑鼠移出網頁上某個元素時觸發。
mousemove：滑鼠移動時就會觸發。

	使用Jquery 搭配hover 使用
	$('.fa.fa-bars').hover(function () {
	$(".leftsidebar").animate({ left: 0 }, 500, 'easeInSine');} , 
	function () { $(".leftsidebar").animate({left: -198 }, 500, 'easeInSine'); })
	$(".leftsidebar").hover(function () { $(".leftsidebar").stop(); }, 
	function () { $(".leftsidebar").animate({ left: -198 }, 500, 'easeInSine'); }) 

	使用 javascript 
	mouseover(滑鼠移入且移動就會偵測) 以及 mouseout(滑鼠移出且移動就會偵測)
	mouseenter(滑鼠移入) mouseleave(滑鼠移出)
	document.getElementById("leftsidebar").addEventListener("mouseenter", setover, false);
	document.getElementById("fa-bars").addEventListener("mouseenter", setover, false);
	document.getElementById("leftsidebar").addEventListener("mouseleave", setout, false);
	document.getElementById("fa-bars").addEventListener("mouseleave", setout, false);
	function setover() {
	    document.getElementById("leftsidebar").classList.remove('setleftsidebarover')
	    document.getElementById("leftsidebar").classList.add('setleftsidebarout')
	}
	function setout() {
	    document.getElementById("leftsidebar").classList.remove('setleftsidebarout')
	    document.getElementById("leftsidebar").classList.add('setleftsidebarover')
	}


來源demo https://css-tricks.com/examples/jQueryStop/
官網解說 Javascript
https://www.w3schools.com/jsref/event_onmouseenter.asp
http://jsfiddle.net/ZWQqc/
https://stackoverflow.com/questions/10292050/jquery-animation-on-mouseover-and-stop-on-mouseout
Jquery 事件大概說明 https://ithelp.ithome.com.tw/articles/10187721
另外一種替代方法
https://stackoverflow.com/questions/10618001/javascript-mouseover-mouseout-issue-with-child-element
