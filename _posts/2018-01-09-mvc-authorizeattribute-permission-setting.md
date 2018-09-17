---
layout: post
title: 'MVC AuthorizeAttribute 自訂權限設定'
date: 2018-01-09 02:27
comments: true
categories:
tags: Csharp MVC
---

MVC 使用權限設定
步驟
1 建立所需權限屬性
2 建立 自訂 Auth 驗證方式
3 將尚未授權人員直接導向登入頁面並且寫入Log
4 使用方式
```cs
// 首先建立所需的權限屬性
public static class Role
{
  public const string Administrator = "Administrator";
  public const string Customer = "Customer";
}

//開始建立自訂 Auth驗證方式
public class AuthorizeRolesAttribute : AuthorizeAttribute
{
  // 預設導向頁面
  private string _notifyUrl = "/Account/Logout";
  public string NotifyUrl
  {
    get { return _notifyUrl; }
    set { _notifyUrl = value; }
  }

  private void CacheValidateHandler(HttpContext context, object data, ref HttpValidationStatus validationStatus)
  {validationStatus = OnCacheAuthorization(new HttpContextWrapper(context));}
  public override void OnAuthorization(AuthorizationContext filterContext)
  {
    if (filterContext == null)
    {
      throw new ArgumentNullException("filterContext");
      write log...do somethings
      Redirect to Login page.
      // 導向登入頁面
      HandleUnauthorizedRequest(filterContext);
    }

    if (AuthorizeCore(filterContext.HttpContext))
    {
      HttpCachePolicyBase cachePolicy = filterContext.HttpContext.Response.Cache;
      cachePolicy.SetProxyMaxAge(new TimeSpan(0));
      cachePolicy.AddValidationCallback(CacheValidateHandler, null);
      if (filterContext.HttpContext.User.Identity.IsAuthenticated)
      {
        //以下的 UsersHelper.UsersInfo().UserRoles是自行建立的
        if (!Roles.Split(',').Where(x => x == UsersHelper.UsersInfo().UserRoles.ToString()).Any())
        {
          //導向登入頁面(錯誤)
          HandleUnauthorizedRequest(filterContext);
        }
      }
    }
    else if (filterContext.HttpContext.User.Identity.IsAuthenticated)
    {
      if (NotifyUrl != null)
      filterContext.Result = new RedirectResult(NotifyUrl);
      else
      //導向登入頁面
      HandleUnauthorizedRequest(filterContext);
    }
    //尚未驗證導向登入頁
    else
    {
      //導向登入頁面(錯誤)
      HandleUnauthorizedRequest(filterContext);
    }
  }

  //權限設定 Attrbute
  public AuthorizeRolesAttribute(params int[] roles) : base()
  {
    try
    {
      if (HttpContext.Current == null)
        throw new ArgumentNullException("httpContext is Null");
      // 判斷是否已驗證
      if (!HttpContext.Current.User.Identity.IsAuthenticated)
        throw new ArgumentNullException("尚未驗證成功無法使用權限");
      // 將允許的登入人員新增至 Roles
      Roles = string.Join(",", roles);
    }
    catch (Exception ex)
    {throw ex;}
  }
}

// 使用方式只允許 Administrator 進行登入
public class MyController : Controller
{
  Not Allow Role.Customer
  [AuthorizeRoles(Role.Administrator)]
  public ActionResult Adminview()
  {return View();}
}
```
來源:
新增[roles Attrubute](https://stackoverflow.com/questions/24181888/authorize-attribute-with-multiple-roles)
[導向錯誤頁設定](https://stackoverflow.com/questions/2504923/how-to-redirect-authorize-to-loginurl-only-when-roles-are-not-used)
[詳細導向錯誤相關資訊](https://stackoverflow.com/questions/1485640/so-very-very-confused-about-authentication-in-asp-net-mvc)
