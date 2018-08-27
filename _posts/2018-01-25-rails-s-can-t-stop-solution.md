<!-- ---
layout: post
title: 'Rails s can't Stop server is already running 解決方法'
date: 2018-01-25 14:59
comments: true
categories:
---
使用以下指令離開終端機

	CTRL-C
	CTRL-Z

將預設的server.pid給刪除

	rm tmp/pids/server.pid

輸入以下指令查看是否還有哪些程序3000運作中

	lsof -wni tcp:3000

如果有的話請使用以下指令即可

	kill -9 $(lsof -i tcp:3000 -t)

重開之前開server的那台終端機即可完成(restart server)
來源:https://stackoverflow.com/questions/15088163/cant-stop-rails-server -->