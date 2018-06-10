---
layout: post
title: 'Use @Url.Action pass param'
date: 2017-09-20 03:22
comments: true
categories: 
---

	$(".usersimg#" + listmodel[i].cn).html('<img src="' + "@Url.Action("Images", "Home")?pic=" + picn	ame + '&'+ dat.getTime() +'"id = "' + listmodel[i].indx + '" alt="usersimage" />');	     
	var firstname = "abc";
	var username = "abcd";
	location.href = '@Url.Action("Display", "Customer")?uname=' + firstname + '&name=' + username;

來源:https://stackoverflow.com/questions/15112055/passing-dynamic-javascript-values-using-url-action