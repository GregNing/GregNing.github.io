---
layout: post
title: '使用IIS建立站台 從外部連線'
date: 2017-09-07 02:53
comments: true
categories: 
---
1.架設IIS站台 並且從繫結內設定您的 IP位址例如http://192.168.??.>>:56555/Home/Index
2.設立防火牆新增您所要的port例如:56555使用新增輸入規則去新增使用連接埠
3.若要設立SQL SERVER 請新增 1433 PORT在防火牆
4.在SQL Server Configuration Manager 找到 SQL Server Network Configuration 下你所使用的 Protocols For sql名稱 點選TCP/IP在IP Address 最下面	IPAll TCP Port 輸入1433啟用
5.在服務區塊 重新啟動SQL Server(Sql名稱) 以及 SQL SERVER Browser(在此sql server browser可以先在	SQL Server Configuration Manager的 Sql Server Servce啟動)

6.SQL 連線名稱 192.168.??.??\SQLEXPRESS,1433