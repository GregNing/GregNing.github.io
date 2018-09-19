---
layout: post
title: 'MVC 從Header 移除 敏感資訊'
date: 2017-12-17 15:00
comments: true
categories:
tags: MVC Csharp
---
將會把X-AspNet 以及 X-Powered 相關資訊隱藏
以下是默認訊息
```conf
Cache-Control:private, s-maxage=0
Content-Encoding:gzip
Content-Length:8024
Content-Type:text/html; charset=utf-8
Date:Fri, 30 Sep 2016 03:17:10 GMT
Server:Microsoft-IIS/10.0
Vary:Accept-Encoding
X-AspNet-Version:4.0.30319
X-AspNetMvc-Version:5.2
X-Frame-Options:SAMEORIGIN
X-Powered-By:ASP.NET
X-SourceFiles:=?UTF-8?B?RDpcV29ya1wyMDE2XE56TmQuSWRlbnRpdHlcR0xELldlYlxTdXBlclxVc2Vycw==?=
X-AspNetMvc-Version
```
開啟Global.asax.cs ，在Application_Start方法中，添加以下代碼:<br>
`MvcHandler.DisableMvcResponseHeader = true;`

同樣在Global.asax.cs 中，添加如下代码
```cs
protected void Application_PreSendRequestHeaders(object sender, EventArgs e)
{
  HttpApplication app = sender as HttpApplication;
  if (app != null && app.Context != null)
  {
    app.Context.Response.Headers.Remove("Server");
  }
}
```
`X-AspNet-Version`
在Web.config文件中找到system.web，添加如下配置：<br>
`<httpRuntime enableVersionHeader="false" />`

`X-Powered-By`
在Web.Config文件中找到system.webServer，添加如下配置：
```conf
<httpProtocol>
  <customHeaders>
    <remove name="X-Powered-By" />
  </customHeaders>
</httpProtocol>
```
[來源](http://www.cnblogs.com/buyixiaohan/p/5923226.html)