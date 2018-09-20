---
layout: post
title: 'MVC POST 照片去前端使用方式'
date: 2017-08-31 02:40
comments: true
categories:
tags: MVC Csharp
---

##### 使用Url.Content(轉相對目錄) 方式，虛擬路徑
兩者相似都可採用
```HTML
<img src="@VirtualPathUtility.ToAbsolute("~/Content/Images/logo356.png")" />來源:
<img src="@Url.Content("~/Content/Images/logo356.png")" />
```
##### 使用Url.Action
```cs
public class ImagesController: Controller
{
  public ActionResult SomeImage(string imageName)
  {
    var root = @"C:\Images\";
    var path = Path.Combine(root, imageName);
    path = Path.GetFullPath(path);
    if (!path.StartsWith(root))
    {
      // Ensure that we are serving file only inside the root folder
      // and block requests outside like "../web.config"
      throw new HttpException(403, "Forbidden");
    }
    return File(path, "image/jpeg");
  }
}
```
```HTML
<img src="@Url.Action("SomeImage", "Images", new { image = "foo.jpg" })" alt="">
```
兩者差異在於`Url.Action`能使用在其他目錄以及FTP上擷取圖片但如果使用`Url.Content`會有權限等等的一些問題而且只能在跟目錄底下去運作。<br>
使用目錄外請使用`Url.Action`但請記得要`return File`相關的`contentType`。<br>
目錄內例:`Content Images`資料夾內部可以使用`Url.Content`。<br>
[set-src-property-in-view-to-a-url-outside-of-the-mvc](https://stackoverflow.com/questions/12589771/set-src-property-in-view-to-a-url-outside-of-the-mvc3-project)<br>
[mvc use razor](https://stackoverflow.com/questions/351937/in-asp-net-mvc-how-can-i-use-the-razor-url-content-helper-from-c-sharp-code)