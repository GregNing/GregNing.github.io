---
layout: post
title: 'MVC model驗證顯示'
date: 2017-08-23 03:27
comments: true
categories: MVC
tags: Csharp MVC
---
ASP.NET MVC針對`Create/Edit View`提供了方便好用的Client端驗證機制, 但對我來說有一點"美中不足": 在專案中我常使用如下圖的"表格式欄位排版"，預設驗證訊息會被接在欄位的正後方，多出的文字會增加<td>的寬度，即使換行顯示在下方也會增加<td>的高度，無論如何都會破壞原本的畫面配置。
![1229-967e-o.gif](http://user-image.logdown.io/user/29283/blog/28339/post/2207613/W0oADruTRvKZrPBh5obd_1229-967e-o.gif)

在還沒改用ASP.NET MVC的年代，我習慣選用Position: Absolute的jQuery Inline Form Validation。由於訊息會浮現在欄位的右上角不佔用實體空間，可避免驗證訊息破壞原有排版的問題。
![1229-967e-o.gif](http://user-image.logdown.io/user/29283/blog/28339/post/2207613/uQnwWS3TuCrvx2feqPlV_1229-967e-o.gif)
現在，是在ASP.NET MVC實現同樣的理念的時候了!

從`Inline Form Validation Engine plugin`中擷取部分程式, 我寫了一個可以支援ASP.NET MVC 3的改良版。使用方式很簡單: 引用jquery.validate.inline.js及validationEngine.jquery.css, 然後再加上一行指令: $(“form”).makeValidationInline(); 搞定收工。
排版顯示純文字
```js
<script src="@Url.Content("~/Scripts/jquery.validate.inline.js")" type="text/javascript"></script>
<link href="@Url.Content("~/Content/validationEngine.jquery.css")" rel="Stylesheet" type="text/css" />
<script type="text/javascript">
$(function () {
  $("form").makeValidationInline();
});
</script>
```
在Create.cshtml動點小手腳後，可以看見驗證訊息已改出現在右上角，不再破壞原本的排版囉!
![1230-b009-o.gif](http://user-image.logdown.io/user/29283/blog/28339/post/2207613/8HLpio56SA2WlFIwIRVQ_1230-b009-o.gif)

[文章來源](http://blog.darkthread.net/post-2011-07-04-asp-net-mvc-inline-validation-chinese.aspx)