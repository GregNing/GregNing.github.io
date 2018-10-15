---
layout: post
title: 'ASP.Net web.config Settings Session'
date: 2017-12-29 03:14
comments: true
categories: MVC
tags: MVC Csharp
reference:
  name:
    - Session特性與在Web.config的常用設定
    - ASP.NET Session State Overview
    - sessionState的三種屬性
    - Session莫名遺失的解決辦法
    - Session-State Modes
    - 工作階段狀態模式
  link:
    - https://dotblogs.com.tw/darren.net/2009/02/05/7043
    - https://msdn.microsoft.com/en-us/library/ms178581.aspx
    - https://dotblogs.com.tw/may05005/2016/03/01/162511
    - http://nelman.pixnet.net/blog/post/22127633-session%E8%8E%AB%E5%90%8D%E9%81%BA%E5%A4%B1%E7%9A%84%E8%A7%A3%E6%B1%BA%E8%BE%A6%E6%B3%95
    - https://msdn.microsoft.com/en-us/library/ms178586.aspx
    - https://msdn.microsoft.com/zh-tw/library/ms178586(v=vs.100).aspx
---

從web.config 設定 Session 相關資訊<br>
`Forms Authentication Timeout`（表單身份驗證超時）值設置身份驗證Cookie設置為有效的時間（以分鐘為單位），cookie將過期，用戶將不再進行身份驗證 - 它們將被重定向到登錄頁面自動。<br>
`slidingExpiration = true`的值基本上是說在每個請求完成後，定時器被重置，只要用戶在超時值內發出請求，它們將繼續被認證。
如果設置slidingExpiration = false，那麼無論用戶是否在超時值內發出請求，身份驗證Cookie都將在值分鐘數後過期。
sessionState 設定 必須有的屬性
{% capture string_with_newlines %}
(A) mode : 設定Session的狀態為關閉或儲存方式,其參數如下...
  (1). OFF: 不使用Session.
  (2). InProc: 與ASP的Session儲存方式相同,與IIS的狀態有關係.(跟隨IIS程序執行而存在,若IIS關閉或重新啟動則Session消失)	不建議使用 InProc 不穩定
>  (a)、配置檔中processModel標籤的memoryLimit屬性。
   (b)、Global.asax或者Web.config文件被更改。
   (c)、Bin檔夾中的Web程式（DLL）被修改。
   (d)、殺毒軟體掃描了一些.config文件。

  (3).`StateServer`: 儲存在獨立的狀態下,與IIS的狀態無關係.(推薦)
    `StateServer`是本機的一個服務，可以在系統服務裏看到服務名為ASP.NET State Service的服務，預設情況是不啟動的。
	當我們設定mode為StateServer之後，請手工將該服務啟動。
    這樣，我們就能利用本機的StateService來存儲Session了，除非電腦重啟或者StateService掛掉，否則Session是不會丟的(Session超時被丟棄是正常的)。
  (4). SQLServer: 儲存在SQL資料庫裡,與IIS的狀態無關係.
    `sessionState` 可選擇的屬性:
    (A) cookieless:
      (a) true : 使用Cookieless模式,不使用Client端瀏覽器Cookie改為透過URL傳送SessionID.
        ex. `ttp://localhost/MyApplication.aspx`
	    粗體字部分為IIS自動加上(括號內為SessionID),不影響之前的連結.
      (b) `false`: 使用Cookie模式,預設值)，Client端瀏覽器Cookie須開啟(Session在Client端是以Cookie的型態存在)。
      (B) `timeout` : 有效時間(分鐘數)，預設值為20分鐘.
      (C) `stateConnectionString`: 若mode為StateServer必須設定此屬性,例如："tcpip=127.0.0.1:42424"。(一定要接42424)。
      (D) `stateNetworkTimeout`: 若mode為StateServer必須設定此屬性,設定StateServer模式儲存Session的時間,預設值10秒.
      (E) `sqlConnectionString`: 若mode為SQLServer必須設定此屬性,例如:
	  `"data source=localhost;Integrated Security=SSPI;Initial Catalog=northwind"`。
      (F) `sqlCommandTimeout`: 若mode為SQLServer必須設定此屬性,設定SQLServer模式儲存Session的時間,預設值10秒。
      (G) `regenerateExpiredSessionId`屬性設置為true。 當使用過期的會話ID進行無Cookie會話請求時，會生成一個新的會話ID。
	        如果使用HTTP POST方法創建了過期會話ID的請求，則當regenerateExpiredSessionId為true時，任何發布的數據都將丟失。這是因為ASP.NET執行重定向以確保瀏覽器在URL中具有新的會話標識符。
{% endcapture %}
{{ string_with_newlines | newline_to_br }}

```conf
<system.web>
  <sessionState mode="StateServer" cookieless="false" timeout="240" regenerateExpiredSessionId="true"stateConnectionString="tcpip=127.0.0.1:42424" stateNetworkTimeout="500"/>
    <authentication mode="Forms">
    #timeout單位為分鐘
    <forms loginUrl="~/Account/Login" path="/" slidingExpiration="true" timeout="240" />
  </authentication>
</system.web>
```
