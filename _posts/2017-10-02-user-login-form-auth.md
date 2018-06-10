---
layout: post
title: 'User Login FormsAuthentication in Cookies MVC 有關驗證以及Cookies'
date: 2017-10-02 08:50
comments: true
categories: 
---
雖然都是程式碼但請實作一次
首先 建立 Model
將登入畫面所使用的model 以及驗證所需的 model Princaipal 放在一起

	public class VMLoginModel
	{
	// 登入帳號
	[Required(ErrorMessage = "請輸入帳號")]
	[EmailAddress]
	[Display(Name = "ID")]
	public string Account { get; set; }
	// 登入密碼
	[Required(ErrorMessage = "請輸入密碼")]
	[Display(Name = "Password")]
	[DataType(DataType.Password)]
	public string Password { get; set; }
	}
	//登入所需要驗證資料 Model
	public class UserPrincipal : IPrincipal
	{
	public UserPrincipal(IIdentity identity)
	{
	    Identity = identity;
	}
	public IIdentity Identity
	{
	    get;
	    private set;
	}
	public VMLoginModel User { get; set; }
	public bool IsInRole(string role)ㄋ
	{
	    return true;
	}
	}

Create  UserInfoSession 裡面放使用者存放Session 

	public class UserInfoSession
	{
	    
	    // 使用者帳號
	    public string UserID { get; set; }
	    
	    // 使用者 key值   
	    public int Userindx { get; set; }
	
	    // 使用者員編
	    public string Usercn { get; set; }  
	}

建立 Class UserAuthentication 放置 User FormsAuthenticationTicket的相關資訊

	public static bool ValidateUser(VMLoginModel logon, HttpResponseBase response)
	{
	bool result = false;
	if (Membership.ValidateUser(logon.Account, logon.Password))
	{
	    JavaScriptSerializer serializer = new JavaScriptSerializer();
	    //取得使用者個人資料
	    string userData = serializer.Serialize(User);
	    FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(
	        1,
	        logon.Account,
	        DateTime.Now,
	        DateTime.Now.AddHours(3),
	        true,
	        userData,
	        FormsAuthentication.FormsCookiePath
	        );
	    //建立加密 表單驗證票證 Encrypt the ticket.
	    string encTicket = FormsAuthentication.Encrypt(ticket);
	    // Create the cookie.
	    response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));
	    //驗證通過
	    result = true;
	}
	return result;
	}

使用者資料 是否通過驗證

	public static VMLoginModel User
	{
	 get
	 {
	     if (HttpContext.Current.User.Identity.IsAuthenticated)
	     {
	         // The user is authenticated. Return the user from the forms auth ticket.
	         return ((UserPrincipal)(HttpContext.Current.User)).User;
	     }
	     else if (HttpContext.Current.Items.Contains("User"))
	     {
	         // The user is not authenticated, but has successfully logged in.
	         return (VMLoginModel)HttpContext.Current.Items["User"];
	     }
	     else
	     {
	         return null;
	     }
	 }
	}

從資料庫抓取資料

	public static VMLoginModel AuthenticateUser(string username, string password)
	{
	VMLoginModel user = new VMLoginModel();
	// Lookup user in database, web service, etc. We'll just generate a fake user for this demo.
	驗證 cookie
	//http://www.primaryobjects.com/2012/12/07/mvc-forms-authentication-and-storing-data-in-the-cookie/
	IEnumerable<Table> modellist = Enumerable.Empty<Table>();
	DynamicParameters param = new DynamicParameters();
	param.Add("@id", username, System.Data.DbType.String, System.Data.ParameterDirection.Input, 1024);
	param.Add("@pwd", password, System.Data.DbType.String, System.Data.ParameterDirection.Input, 1024);
	查詢名單是否正確
	modellist = DbHelper.Query<Table>(null, param);
	if (modellist != null && modellist.Count() == 1)
	{
	HttpContext.Current.Session["member_id"] = modellist.FirstOrDefault().id;
	HttpContext.Current.Session["cn"] = modellist.FirstOrDefault().cn;
	HttpContext.Current.Session["indx"] = modellist.FirstOrDefault().indx;
	HttpContext.Current.Session["roles"] = modellist.FirstOrDefault().groups;
	HttpContext.Current.Session["realname"] = modellist.FirstOrDefault().realname;
	HttpContext.Current.Session["company"] = modellist.FirstOrDefault().company;
	HttpContext.Current.Session["groups"] = modellist.FirstOrDefault().manager;
	這個RedirectFromLoginPage功能會 自動存cookie 並 自動導回ReturnURL指定的頁面
	FormsAuthentication.RedirectFromLoginPage(modellist.FirstOrDefault().id, true);
	user.Account = modellist.FirstOrDefault().id;
	user.key = modellist.FirstOrDefault().indx;
	user.Password = modellist.FirstOrDefault().pwd;
	}
	else
	{
	    當帳號密碼發生錯誤 所需要顯示錯誤訊息在前端頁面上
	    user = null;
	}
	return user;
	}
	登出機制會清除session 以及 FormCokkieName
	public static void Logoff(HttpSessionStateBase session, HttpResponseBase response)
	{
	// Delete the user details from cache.
	session.Abandon();
	//clear all session
	session.RemoveAll();
	// Delete the authentication ticket and sign out.
	FormsAuthentication.SignOut();
	// Clear authentication cookie.
	HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, "");
	cookie.Expires = DateTime.Now.AddYears(-1);
	response.Cookies.Add(cookie);
	}

建立 UserProvider 因要使用 MembershipProvider  UserProvider:MembershipProvider

	public override bool ValidateUser(string username, string password)
	{
	// Check if this is a valid user.
	VMLoginModel user = UserAuthentication.AuthenticateUser(username, password);
	if (user != null)
	{
	    // Store the user temporarily in the context for this request.
	    HttpContext.Current.Items.Add("User", user);
	    return true;
	}
	else
	{
	    return false;
	}
	}

	public override MembershipUser GetUser(string username, bool userIsOnline)
	{
	if (UserAuthentication.User != null)
	{
	return new MembershipUser("UserMembershipProvider", username,
	UserAuthentication.User.key, UserAuthentication.User.Account, null,null, true, false, DateTime.MinValu	e, DateTime.MinValue,DateTime.MinValue, DateTime.MinValue, DateTime.MinValue);
	}
	else
	{
	    return null;
	}
	}

接下來請在Global.asax 裡建立

	protected void Application_AuthenticateRequest(object sender, EventArgs e)
	{
	HttpCookie authCookie = Request.Cookies[FormsAuthentication.FormsCookieName];
	if (authCookie != null)
	{
	取的 Form 認證 目前這位使用者身分
	FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);
	給予使用者 驗證身分
	GenericIdentity identify = new GenericIdentity(authTicket.Name, "Forms");
	UserPrincipal principal = new UserPrincipal(identify);
	取得使用者加密資料
	string userData = ((FormsIdentity)(Context.User.Identity)).Ticket.UserData;
	// Deserialize the json data and set it on the custom principal.
	JavaScriptSerializer serializer = new JavaScriptSerializer();
	解密使用者資料
	principal.User = (VMLoginModel)serializer.Deserialize(userData, typeof(VMLoginModel));
	Context.User = principal;
	}
	}
  
最後最重要請注意要在Web.config設定Membership 請注意 UserProvider 請自行開一隻cs 否則會load不到

	<membership defaultProvider="UserProvider">
	<providers> <clear/>
	https://dotblogs.com.tw/02047788a/2009/01/27/6950 有詳細說明介紹 membership
	//name  是用來做識別用的，同時可能有好幾個會員提供者。
	//type   包含會員提供者的名稱空間 類名稱 及組件名稱。
	//Provide 要另外放
	<add name="UserProvider" type="Providers.UserProvider"/>
	</providers>
	</membership>
	登入驗證的導向動作 尚未驗證通過就直接導到登入畫面
	<authentication mode="Forms">
	<forms loginUrl="~/Account/Login" defaultUrl ="~/Home/XXX"  name=".YourApplication" timeout="60" cookieless="AutoDetect" />
	</authentication>
重點來了剛驗證完成後若所有的acton都要驗證請掛上 [Authorize] 可以直接丟到Class級對所有的Action的驗證
跟System.Web.Security.FormsAuthentication.RedirectFromLoginPage(strUsername, true);做搭配使用
Ex: 

    [Authorize]    
    public class SettingsController : Controller    
    
FormsAuthenticationTicket來源: http://www.primaryobjects.com/2012/12/07/mvc-forms-authentication-and-storing-data-in-the-cookie/
FormsAuthentication.RedirectFromLoginPage: http://blog.xuite.net/jen999999/blog/124905607-C%23+webform+FormsAuthentication.RedirectFromLoginPage%E5%B0%8E%E9%A0%81%E9%9D%A2%E7%9A%84%E6%96%B9%E5%BC%8F
FormsAuthentication: https://msdn.microsoft.com/en-us/library/aa480476.aspx
保哥FormAuthentication: https://blog.miniasp.com/post/2008/02/20/Explain-Forms-Authentication-in-ASPNET-20.aspx