---
layout: post
title: 'Form Authentication(表單驗證) 很值得參考'
date: 2017-08-22 09:42
comments: true
categories: MVC
tags: MVC Csharp
---

[Forms Authentication](http://msdn2.microsoft.com/en-us/library/aa480476.aspx)<br>
看完這篇就幾乎全懂了！

要讓會員登入成「已驗證」狀態的話，可以透過 FormsAuthentication 類別中的一個 RedirectFromLoginPage 靜態方法，而最簡單的一段程式碼就是這樣：
```cs
string strUsername = "will";
FormsAuthentication.RedirectFromLoginPage(strUsername, false);
```
只要執行這段程式碼就會以「strUsername」定義的名稱登入了。

如果你要判斷使用者是否已經是登入的狀態，可以用以下程式碼：
```cs
if(User.Identity.IsAuthenticated)
{
  Response.Write("您現在是已登入狀態。");
}
```
登入後要取得登入的帳號，可以用以下程式碼：
```cs
string strLoginID = User.Identity.Name;
```
但使用這段程式碼要注意，如果使用者「尚未登入」的話，`User.Identity`會回傳 null 進而導致使用`User.Identity.Name`的時候發生 Exception !!

雖然你可以很輕易的執行「登入」動作，但是預設來說 ASP.NET 2.0 的 Forms Authentication 是使用 Cookie 來做儲存登入資訊的動作，且預設的過期時間是 30 分鐘，如果希望設定成 Browser 全部關閉後會自動登出的話，就必須採用自訂 `Forms Authentication Cookie` 的方式，程式碼片段如下：
```cs
string userData = "ApplicationSpecific data for this user";
string strUsername = "你想要存放在 User.Identy.Name 的值，通常是使用者帳號";
FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1,
  strUsername,
  DateTime.Now,
  DateTime.Now.AddMinutes(30),
  isPersistent,
  userData,
  FormsAuthentication.FormsCookiePath);

// Encrypt the ticket.
string encTicket = FormsAuthentication.Encrypt(ticket);

// Create the cookie.
Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));
```
以上這段程式碼片段就是用來產生`Forms Authentication`的 Ticket，並將取得的 Ticket 編碼後設定儲存在使用者 Browser 的 Cookie 中。但其中有個參數叫做 "userData"，我也是研究了一下子才知道怎麼用他，想知道的人可以參考`FormsAuthenticationTicket.UserData`屬性。<br>

所以要取得登入時設定的 userData 的方式，可以參考以下程式片段：
```cs
FormsIdentity id = (FormsIdentity)User.Identity;
FormsAuthenticationTicket ticket = id.Ticket;
cookiePath.Text = ticket.CookiePath;
expireDate.Text = ticket.Expiration.ToString();
expired.Text = ticket.Expired.ToString();
isPersistent.Text = ticket.IsPersistent.ToString();
issueDate.Text = ticket.IssueDate.ToString();
name.Text = ticket.Name;
userData.Text = ticket.UserData;
version.Text = ticket.Version.ToString();
```
但是有點要特別注意，就是您應該要限制儲存在`UserData`屬性中的資料量，因為`UserData`屬性所設定的資料最後會加密後儲存在 Cookie 中，雖然在 [RFC 2109 HTTP State Management Mechanism](https://tools.ietf.org/html/rfc2109)規範的 6.3 Implementation Limits 中有定義 User Agent (瀏覽器) 針對 Cookie 的最低儲存量，但是其 Cookie 的儲存量還是有其限制的，如果你設定超過了其限制，就有可能造成怎樣都無法登入成功的狀況！請參考 KB 306070 : 數字和大小限制的 Internet Explorer 中的 Cookie。

最後，如果你要登出的話，可以用以下程式碼片段：
```cs
FormsAuthentication.SignOut();
```
[FormsAuthentication](https://blog.miniasp.com/post/2008/02/20/Explain-Forms-Authentication-in-ASPNET-20.aspx)