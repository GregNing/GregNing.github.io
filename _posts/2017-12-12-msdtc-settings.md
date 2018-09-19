---
layout: post
title: 'MSDTC 設定'
date: 2017-12-12 02:27
comments: true
categories:
tags: MSDTC SQL
---
1.  在[開始]工作列上的[執行]輸入`dcomcnfg.exe`，出現 ”元件服務”，在<br>
[電腦] => [我的電腦] => [Distributed Transaction] => [本機DTC] 上按滑鼠右鍵 ==> [內容] ==> [安全性] ==> 確定 網路DTC存取、允許遠端用戶端、允許輸入、允許輸出、不需要驗證、啟用SNA LU 6.2交易，都有勾選 ==>確定。DTC 登入帳戶為 “NT Authority\NetworkService“。

2. 確認DTC服務是否啟動。控制台 ==>系統管理工具 ==>服務 ==>Distributed Transation Coordinator，是否啟動，並設為自動啟動

3. 到 控制台 ==> 系統及安全性 ==> Windows 防火牆 ==> 允許程式或功能通過Windows防火牆 ==> 將 分散式交易協調器 後面的僅打勾（私人）==> 確定
{% capture string_with_newlines %}
[error-message-when-you-try-to-install-a-sql-server](https://support.microsoft.com/zh-tw/help/940971/error-message-when-you-try-to-install-a-sql-server-2005-service-pack)
[begin-distributed-transaction-transact-sql](https://docs.microsoft.com/zh-tw/sql/t-sql/language-elements/begin-distributed-transaction-transact-sql)
[MSDTC](https://chenghsiu.wordpress.com/2011/11/14/msdtc-%E9%A9%97%E8%AD%89/)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}