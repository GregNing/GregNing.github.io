---
layout: post
title: '使用Jquery 排序ul li'
date: 2017-11-28 04:00
comments: true
categories: 
---
使用 JQuery 做排序動作排序 ul li 

	<ul class="alphaList">
	<li>apples</li>
	<li>cats</li>
	<li>bears</li>
	</ul>

	<script type="text/javascript">
	
	var items = $('.alphaList > li').get();
	items.sort(function(a,b){
	var keyA , keyB;
	var  = $(b).text();
	下方是需要做轉換動作因是要使用int排序所以要在這轉換否則排序將錯亂
	keyA = parseInt($(a).text());
	keyB = parseInt($(b).text());
	不需要轉換
	keyA = $(a).text();
	keyB = $(b).text();
	if (keyA < keyB) return -1;
	if (keyA > keyB) return 1;
	return 0;
	});
	var ul = $('.alphaList');
	$.each(items, function(i, li){
	使用append ul 就會移除element(remove the element)所以不用將ul清空直接使用 append就可以
	ul.append(li);
	});

	</script>

[easiest-way-to-order-a-ul-ol-in-jquery](https://stackoverflow.com/questions/304396/what-is-the-easiest-way-to-order-a-ul-ol-in-jquery)
[jquery-sort-list-based-on-data-attribute-value](https://stackoverflow.com/questions/21600802/jquery-sort-list-based-on-data-attribute-value)
[sort-a-list-alphabetically-using](https://stackoverflow.com/questions/1134976/how-may-i-sort-a-list-alphabetically-using-jquery)