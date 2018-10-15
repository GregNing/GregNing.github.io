---
layout: post
title: 'MVC 使用 JWT'
date: 2018-01-25 08:52
comments: true
categories: MVC
tags: Csharp MVC JWT
reference:
  name:
    - RFC7519
    - 安裝Nuget套件OWIN Host SystemWeb
    - 參考JWT
    - 驗證token資訊
    - 在這是注意SHA256使用
    - token-authentication-asp-net-core
  link:
    - https://tools.ietf.org/html/rfc7519
    - https://www.nuget.org/packages/Microsoft.Owin.Host.SystemWeb/
    - https://dotblogs.com.tw/libtong/2018/01/15/144410
    - https://stackoverflow.com/questions/29355384/when-is-jwtsecuritytokenhandler-validatetoken-actually-valid
    - https://stackoverflow.com/questions/39080740/how-to-generate-jwt-token-with-identitymodel-extensions-for-net-5
    - https://stormpath.com/blog/token-authentication-asp-net-core
---
JWT是Json Web Token的縮寫，詳細規範在[RFC7519](https://tools.ietf.org/html/rfc7519)中，目的是用來傳遞JSON物件並且透過雜湊簽章來確保資料沒有被變更過。因此我們可以把它當作驗證的token來用，也可以用來在兩個client之間傳遞資料。

JWT包含了三個部分，header、payload和signature，並使用"點"( . )將三個部分連結起來成為一個字串進行傳遞，因此一個完整的JWT字串看起來會像這樣
```
xxasdasdasdas.asdasdasfdjaskhdkjash.asdasdasd
```
Header
Header的json通常包含兩部分，token類型typ及加密類型alg，例如以下JSON物件代表了使用HS256演算法來產生JWT，token
```js
{
  "alg": "HS256",
  "typ": "JWT"
}
```
然後以Base64Url編碼(例如 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)，此為JWT的header部分。
#### Payload
Payload則用來存放用來要求資料的資訊(claims)，例如使用者名稱帳號等。<br>
claims有三種`reserved claims`，`public claims`及`private claims`。<br>
在這裡可以存放一些基本的驗證資訊，在RFC7519中也包含了基本內建的幾個資訊如`iss(issuer)`、`sub(subject)`等等(非必要)，當然我們也可以加入自己要的資訊，一個payload看起來會像這樣:
```js
{
  "sub": "testGreg",
  "age": 25,
  "roles": "Admin"
}
```
與header一樣，payload的json也會以Base64Url編碼。

#### Signature
Signature的是以編碼過的header，payload及密碼來產生，例如使用HMAC SHA256編碼，則簽名會以下面方式來建立:<br>
第一部分為header.payload的Base64Url編碼。<br>
第二部分為密碼（這邊的密碼為secret）。<br>
```
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```
則產生簽名，簽名用來驗證JWT的發送者的身分，並確保資訊沒有被修改。
將header，payload及signature組合起來就是JWT的token。
要特別注意的是JWT只有經過編碼(encoded)但並沒有加密(encrypted)，所以JWT的內容只要解碼都看得到，因此JWT中不要存放敏感的資訊例如密碼或信用卡號等等。

[安裝Nuget套件OWIN Host SystemWeb](https://www.nuget.org/packages/Microsoft.Owin.Host.SystemWeb/)
```
Install-Package Microsoft.Owin.Host.SystemWeb
```
提供OWIN應用運行的Host 整合ASP.NET Pipeline

安裝Nuget套件OWIN Security Jwt
```
Install-Package Microsoft.Owin.Security.Jwt
```
提供JWT驗證授權的OWIN Middleware

加入Startup啟用類別(OWIN運行的進入點)
啟用`JWT Bearer Authentication`
加入JWT token初始化
在這注意SymmetricKeyIssuerSecurityTokenProvider裡面請使用Microsoft.Owin.Security.DataHandler.Encoder.TextEncodings.Base64Url.Decode
在Startup.cs裡
```cs
public void Configuration(IAppBuilder app)
{
  app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
  {
    AuthenticationMode = AuthenticationMode.Active,
    AllowedAudiences = new[] { audience },
    IssuerSecurityTokenProviders = new IIssuerSecurityTokenProvider[]
    {
      new SymmetricKeyIssuerSecurityTokenProvider(issueMicrosoft.Owin.Security.DataHandler.Encoder.TextEncodings.Base64Url.Decode(signkey))
    },
    TokenValidationParameters = new TokenValidationParameters()
    {
      ValidAudience = audience,
      ValidIssuer = issuer,
      //認證SigningKey
      IssuerSigningKey = new InMemorySymmetricSecurity      (Microsoft.Owin.Security.DataHandler.Encoder.TextEncodings.Base64Url.Decode(signkey)),
      IssuerSigningTokens = new SymmetricKeyIssuerSecurityTokenProvider(issuer, secret).SecurityTokens,
    }
  });
}
```
下面這三行請到web.config做設定
```conf
ConfigurationManager.AppSettings["Audience"];
ConfigurationManager.AppSettings["Issuer"];
ConfigurationManager.AppSettings["SignKey"];
```
在這三行中設定是看個人如何設定都可
只有SignKey要注意
如果SignKey字元設定太少
會發生以下的 Exception
IDX10603: The 'System.IdentityModel.Tokens.InMemorySymmetricSecurityKey' cannot have less than: '128' bits. Parameternavn: key.KeySize The actual size was 48.
你可以將SignKey設定成這樣越長越好就不會再發生這樣問題了
```conf
<add key="SignKey" value="dsadasdasdsadasddasdJpc3MiOiJodHRwczovL3NlY3VyZS5leGFtcGxlLmNvbS8iLCJleHAiOjE0MTA4MTkzODAsImh0dHA6Ly9leGFtcGxlLmNvbS9vcmdudW0iOiI5ODc5ODc5ODciLCJodHRwOi8vZXhhbXBsZS5jb20vdXNlciI6Im1lQGV4YW1wbGUuY29tIiwiaWF0IjoxNDA4NDE5NTQwfQ" />
```
開始實作取得token
```cs
public static string setToken()
{
  string result = string.Empty;
  try
  {
    string audience = ConfigurationManager.AppSettings["Audience"];
    string issuer = ConfigurationManager.AppSettings["Issuer"];
    string signKey = ConfigurationManager.AppSettings["SignKey"];
    System.Security.Claims.Claim[] claims = new[]
    {
      //自訂Payload附帶其他Identity其他屬性的type & value map宣告在這可以使用不敏感資料進行
      new System.Security.Claims.Claim(System.IdentityModel.Claims.ClaimTypes.Name, _user.UserID),
      new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, _user.UserRoles.ToString())
    };
    InMemorySymmetricSecurityKey key = new InMemorySymmetricSecurityK    (Microsoft.Owin.Security.DataHandler.Encoder.TextEncodings.Base64Url.Decode(signKey));
    SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature    SecurityAlgorithms.Sha256Digest);
    //開始塞資料給token
    JwtSecurityToken token = new JwtSecurityToken(
    issuer: issuer,
    audience: audience,
    claims: claims,
    expires: DateTime.Now.AddMinutes(30),
    signingCredentials: creds);
    string cookieToken, formToken;
    //寫入token
    result = new JwtSecurityTokenHandler().WriteToken(token);
  }
  catch (Exception ex)
  {
    //do somethings...
  }
  return result;
}
```
驗證Token資訊
```cs
private bool VerifyToken(string token)
{
  bool result = true;
  var validationParameters = new TokenValidationParameters()
  {
    IssuerSigningToken = new System.ServiceModel.Security.Tokens.BinarySecretSecurityTok     (Microsoft.Owin.Security.DataHandler.Encoder.TextEncodings.Base64Url.Decode(signkey)),
    ValidAudience = audience,
    ValidIssuer = issuer,
    ValidateLifetime = true,
    ValidateAudience = true,
    ValidateIssuer = true,
    ValidateIssuerSigningKey = true
  };
  JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
  SecurityToken validatedToken = null;
  try
  {
    tokenHandler.ValidateToken(token, validationParameters, out validatedToken);
  }
  catch (SecurityTokenException ex)
  {
    //do somethings...
    return false;
  }
  catch (Exception e)
  {
  //do somethings...
  return false;
  }
  return result;
}
```
 使用方式先在專案下建立一個資料夾叫做 App_Code
 在 App_Code 底下建立頁面 CommonRazorFunctions.cshtml
 寫下下面functions
```cs
@functions{
public static object GetToken()
{
  object result = null;
  if (User.Identity.IsAuthenticated)
  {
    result = FundaySales.Controllers.SettingsController.setToken();
  }
  return result;
  }
}
```
使用ajax方式Set Header Token
```js
jqxhr.setRequestHeader('RequestVerificationToken', '@CommonRazorFunctions.GetToken()')
```
 之後再共用 Controller去做驗證動作
 在這是使用`OnActionExecuting`裡去做驗證 如果驗證失敗會回到登入畫面
```cs
if (!validateAJAXTokenAttribute(filterContext))
{
  filterContext.Result = RedirectToAction("Logout", "Account");
  return;
}
```
取得ajaxheader token
```cs
private bool validateAJAXTokenAttribute(ActionExecutingContext filterContext)
{
  bool result = true;
  //是否ajax 方式呼叫controller 與 POST 方式呼叫，才進入驗證
  if (!filterContext.HttpContext.Request.IsAjaxRequest())
  {
    return result;
  }
  System.Collections.Specialized.NameValueCollection headers = filterContext.HttpContext.Request.Headers;
  try
  {
    if (headers == null)
    {
      return false;
    }
    IEnumerable<string> xRequestedWithHeaders = headers.GetValues("X-Requested-With").AsEnumerable();
    if (filterContext.HttpContext.Request.HttpMethod.ToUpper() == "POST")
    {
      string headerValue = xRequestedWithHeaders.FirstOrDefault();
      if (!string.IsNullOrEmpty(headerValue))
      {
        string[] tokenHeaders = headers.GetValues("RequestVerificationToken");
        result = VerifyToken(tokenHeaders[0]);
      }
    }
  }
  catch (Exception ex)
  {
    return false;
  }
  return result;
}
```
若有發生以下問題:
```
IDX10603: The 'System.IdentityModel.Tokens.InMemorySymmetricSecurityKey' cannot have less than: '128' bits. Parameternavn: key.KeySize The actual size was 48錯誤
```
[解決方式](https://stackoverflow.com/questions/25372035/not-able-to-validate-json-web-token-with-net-key-to-short)