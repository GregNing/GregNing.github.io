---
layout: post
title: '使用Hangfire  MVC 做排程 '
date: 2017-10-15 08:44
comments: true
categories: Hangfire
tags: MVC Hangfire Csharp
reference:
  name:
    - hangfire install
    - IIS Application Initialization
    - Settings IIS AlwaysRunning
    - Application-Initialization-for-keeping
    - pp-always-running
    - auto-start
    - always-running
    - Cron 時間計算
    - Cron 詳細解說
    - HangfireIO Owin
    - HangfireIO using-dashboard
    - Hangfire-aspnet-mvc-webapi
    - rainmaker
    - Hangfire Configuring
    - Hangfire Performing
  link:
    - http://docs.hangfire.io/en/latest/installation.html
    - https://docs.microsoft.com/en-us/iis/get-started/whats-new-in-iis-8/iis-80-application-initialization
    - https://www.red-gate.com/simple-talk/blogs/speeding-up-your-application-with-the-iis-auto-start-feature/
    - https://weblog.west-wind.com/posts/2013/Oct/02/Use-IIS-Application-Initialization-for-keeping-ASPNET-Apps-alive
    - http://docs.hangfire.io/en/latest/deployment-to-production/making-aspnet-app-always-running.html
    - https://www.red-gate.com/simple-talk/blogs/speeding-up-your-application-with-the-iis-auto-start-feature/
    - http://docs.hangfire.io/en/latest/deployment-to-production/making-aspnet-app-always-running.html)
    - https://cronexpressiondescriptor.azurewebsites.net/?expression=0+15+10+*+*+%3F&locale=zh-CN
    - https://en.wikipedia.org/wiki/Cron
    - https://github.com/HangfireIO/Hangfire/issues/613
    - http://docs.hangfire.io/en/latest/configuration/using-dashboard.html
    - http://blog.kkbruce.net/2015/09/hangfire-aspnet-mvc-webapi.html#.WeMjT2iCxPa
    - https://dotblogs.com.tw/rainmaker/2015/08/19/153169
    - http://docs.hangfire.io/en/latest/background-processing/configuring-degree-of-parallelism.html
    - http://docs.hangfire.io/en/latest/background-methods/performing-recurrent-tasks.html
---
所使用的是 Hangfire 強大排程器有 UI介面可以使用。<br>
首先安裝`PM> Install-Package Hangfire`

安裝這個包含安裝Hangfire所有的相關環境了 類似Hangfire Sql Server Hangfire.Core....
[install](http://docs.hangfire.io/en/latest/installation.html)
{% capture string_with_newlines %}
在來是設定 IIS 因為是使用IIS站台。
請在你的IIS 應用程式集區找到您所使用的站台接下來點選 =>
進階設定找到啟動模式(Start Mode) 改成 AlwaysRunning模式。
也要把站台的進階設定，預先載入已啟動，改為True否則AlwaysRunning會沒有效果的。
{% endcapture %}
{{ string_with_newlines | newline_to_br }}
接下來要在程式設定 IIS站台永遠執行模式
在程式Create ApplicationPreload.cs
```conf
#讓 IIS 處在啟動狀態 要從 IIS 設定 PreLoad(預先載用) = true  進階設定 接下來在應用程式集區 進階設定 啟動模式選擇 AlwaysRunning
#接下來要到 C:\Windows\System32\inetsrv\config\applicationHost.config 設定
#查看 applicationPools 的 startMode 是否為 AlwaysRunning
<site name = "testsite" id="2" serverAutoStart="true">
  <application path = "/" applicationPool="testsite" preloadEnabled="true" serviceAutoStartProvider="ApplicationPreload">
    <virtualDirectory path = "/" physicalPath="D:\testsite" />
  </application>
  <binding protocol = "http" bindingInformation="*:5:" /></bindings>
</site>
#接下來複製貼上以下文字 在 system.applicationHost內  sites範圍外面
<!-- Just AFTER closing the `sites` element AND AFTER `webLimits` tag -->
<serviceAutoStartProviders>
<add name = "ApplicationPreload" type="ExampleService.AgentService.ApplicationPreload, ExampleService.AgentService" />
<serviceAutoStartProviders>
```
In `ApplicationPreload.cs`
```cs
public class ApplicationPreload : System.Web.Hosting.IProcessHostPreloadClient
{
  public void Preload(string[] parameters)
  {
    Startup.Instance.Start();
  }
}
```
在global.asax.cs裡啟動Hangfire
```cs
public class Global : HttpApplication
{
  protected void Application_Start(object sender, EventArgs e)
  {
    Startup.Instance.Start();
  }
  protected void Application_End(object sender, EventArgs e)
  {
    Startup.Instance.Stop();
  }
}
```
需建立完全同名 Startup.cs 因Hangfire會先到這取得 Configuration 資訊
使用Owin環境設定
```cs
[assembly: OwinStartup(typeof(AgentService.Startup))]
namespace AgentService
{
  public class Startup : IRegisteredObject
  {
    public static readonly Startup Instance = new Startup();
    private readonly object _lockObject = new object();
    private bool _started;
    private BackgroundJobServer _backgroundJobServer;
    /// <summary>
    /// 一開始所要執行的 初始化 Hangfire
    /// 會先尋找資料庫是否有被初始化再來則是這邊 如果一開始不先初始化資料庫直接 啟動 UseHangfireServer會產生
    ///	錯誤
    /// </summary>
    /// <param name="app"></param>
    public void Configuration(IAppBuilder app)
    {
      //啟用Hangfire的Dashboard
      //預設 Dashboard 路徑為http://localhost:xxxx/hangfire
      //使用 Dashboard，可以設定顯示 dashboard 的 path http://localhost:xxxx/HangfireDashboard
      //在這設定能進入Dashboard 得權限
      app.UseHangfireDashboard("/HangfireDashboard", new DashboardOptions
      {
        Authorization = new[] { new HangfireDashBoardAuthorizationFilter() },
      });
      //執行所需的 排程
      StartMyTask();
    }
}
```
Cron 的時間設定說明<br>
[Cron時間計算](https://cronexpressiondescriptor.azurewebsites.net/?expression=0+15+10+*+*+%3F&locale=zh-CN)<br>
[Cron 詳細解說](https://en.wikipedia.org/wiki/Cron)
```cs
/// <summary>
/// 執行的 Method 參數最好是字串，如果是物件的話，不要是 nested 物件，這樣會Parse不出來，然後報錯哦!
/// 使用 Hangfire 去執行的話， nested obj 會 parse 不出來，所以用字串傳遞
/// </summary>
private void StartMyTask()
{
  //設定每天的幾十幾分運作
  //Cron.Daily(07,30)
  //同上
  //分鐘 小時 日期 月份 週
  //30   07    *    *   *
  //代表這個域上包含所有合法的值
  //以下方做為表示是說每天07:30 AM執行此排程
  string cronExp = "30 07 * * *";
  //設定注意 這就是所謂的固定時間去做排程定時
  //第一參數為 RecurringJobId
  //第二為 你要所使用的call method
  //第三 就是你要這排程何時運作
  //第四 很重要!! 他會依你的排程時間下去實作但你需要將此時間設定為Local否則預設是 UTC你會不知道何時運作
  RecurringJob.AddOrUpdate("test", () =>  AgentService.SetDEMOamount(), cronExp,Ti	meZoneInfo.	Local);
  //這是需要在長時間 背景執行的工作就可以設定這個
  BackgroundJob.Enqueue(() => AgentService.SetDEMOamount());
  //BackgroundJob.Schedule()將目前的任務延後執行，在送入背景等待時就已經執行完畢，而不是3秒後才被執行。
  BackgroundJob.Schedule(() => AgentService.SetDEMOamount()),TimeSpan.FromSeconds(3));
  //使用下列方法 他會馬上執行此排程但不會紀錄這次的使用
  RecurringJob.Trigger("test");
}

/// <summary>
/// 一開始從 Global.aspx會啟動這邊 直接開啟 Hangfire 與 JobStorage資料庫連接
/// </summary>
public void Start()
{
  lock (_lockObject)
  {
    if (_started) return;
    _started = true;
    HostingEnvironment.RegisterObject(this);
    JobStorage.Current = new SqlServerStorage(ConnectionString);
    GlobalConfiguration.Configuration.UseSqlServerStorage(ConnectionString);
    // 建立Background JobSserver 來處理 Job
    // 啟用HanfireServer
    // reduce the heartbeat of the Hangfire dashboard. It is taking too much of our CPU usag	e.It is in our production also
    _backgroundJobServer = new BackgroundJobServer(new BackgroundJobServerOptions
    {
      //要處理的陣列列表
      Queues = new[] { "test" },
      //巡迴訪問時間越長 將會很耗CPU的效能
      //預設30秒 6分鐘為 使用 TransactionScope 限制時間
      HeartbeatInterval = new TimeSpan(0, 6, 0),
      ServerCheckInterval = new TimeSpan(0, 6, 0),
      //預設詢問Job是 15 秒，也可以依狀況來調整，如下我使用6分鐘
      SchedulePollingInterval = new TimeSpan(0, 6, 0),
      //服務名稱
      ServerName = "FundaySaleshangfireahent",
      //設定 Hangfire 同一時間，可以處理多少的 Job 現在是20
      //預設是 處理器數目 * 5
      WorkerCount = Environment.ProcessorCount * 5,
    });
  }
}

/// <summary>
/// 程序停止
/// </summary>
public void Stop()
{
  lock (_lockObject)
  {
    if (_backgroundJobServer != null)
    {
      _backgroundJobServer.Dispose();
    }
      HostingEnvironment.UnregisterObject(this);
    }
}
  void IRegisteredObject.Stop(bool immediate)
  {
    Stop();
  }
}
```
排程權限設定
```cs
/// <summary>
/// 取得能進入 Hangfire Dashboard的人員 只有管理者權限才能進入
/// </summary>
public class HangfireDashBoardAuthorizationFilter : IDashboardAuthorizationFilter
{
  public bool Authorize([NotNull]DashboardContext context)
  {
    if (context == null) throw new ArgumentNullException(nameof(context));
    var owinContext = new Microsoft.Owin.OwinContext(context.GetOwinEnvironment());
    if (owinContext.Authentication.User.Identity.IsAuthenticated)
    {
      return true;
    }
    return false;
  }
}
```