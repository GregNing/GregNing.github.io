---
layout: post
title: '@Html.Partial  @Html.RenderPartial  @Html.Action @Html.RenderAction使用'
date: 2017-08-25 02:32
comments: true
categories: MVC
tags: Csharp MVC
---
#### 這樣寫效能較差，不推薦使用
```HTML
@Html.Partial("View")
//PartialViewName，而如果是使用其他目錄（例如 ~/Views/Shared/）的 Partial View 檔案，則可以使用檔案路徑。
@Html.Partial("~/Views/Shared/View")
```
#### 這樣寫效能較Html.Partial好，建議使用!
```HTML
@{
  Html.RenderPartial("View");
}

@{
  Html.RenderPartial("~/Views/Shared/View")
}
```
如果只要顯示畫面呈顯畫面的廣告之類可以使用`Partial`因為不會從Server要資料。<br>
`Profession ASP.NET MVC 4`裡面另外有提到，若是以效能來說，`Html.RenderPartial`會比`Html.Partial`來得好些，因為是在內部直接寫入到 ViewPage 的 Output Stream 裡，而`Html.Partial`則因為輸出`MvcHtmlString`，`ViewPage`於`Render`時會需要另外去處理。

##### 介紹`Html.Action` & `Html.RenderAction`使用
@Html.Action以及@Html.RenderAction有到伺服器端(Controller）進行一些Server端的程式碼或是取得資料庫的資料，然後再輸出而已
```HTML
@{
  Html.RenderAction("GetActionRender", "Partial", new { vlue = "777"  });
}
@Html.Action("GetActionRender", "Partial", new { value = "777" })
```
在@section裡面如何使用@Html.Action以及@Html.RenderAction：<br>
在@section裡面只能用`@Html.Action`，不能使用`@Html.RenderAction`,網路上的說明是因為`@Html.Action`是直接輸出string,不是`mvchtmlstring`, 因此無法使用。<br>
結論總結:
##### `Html.Action()` – Outputs string
##### `Html.RenderAction()` – Renders directly to response
```HTML
//Response stream is the better performance from string output.
@section contentSection
{
  @Html.Action("GetActionRender", "Partial", new { stringValue = "777", intValue = 888 });
  //無法使用Html.RenderAction,網路上說是因為他是直接輸出string,不是mvchtmlstring, 因此無法使用
  Html.RenderAction("GetActionRender", "Partial", new { value = "777" });
}
```