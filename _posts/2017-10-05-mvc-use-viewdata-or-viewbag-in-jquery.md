---
layout: post
title: 'MVC Use ViewData or ViewBag in Jquery '
date: 2017-10-05 02:36
comments: true
categories: 
---
可以從Controller 接參數到View 直接使用在 javascript

	<script>
	var name = @Html.Raw(Json.Encode(ViewData["Name"]));
	</script>
