---
layout: post
title: 'in  override void OnActionExecuting redirect'
date: 2018-01-09 03:09
comments: true
categories: MVC
tags: Csharp MVC
reference:
  name:
    - how-to-redirect-from-onactionexecuting-in-base-controller
  link:
    - https://stackoverflow.com/questions/3214774/how-to-redirect-from-onactionexecuting-in-base-controller
---
若要在`OnActionExecuting`發生錯誤導向到指定頁面下列方式可以使用
```cs
if (!validateAJAXAntiForgeryTokenAttribute(filterContext))
{
  filterContext.Result = RedirectToAction("Logout", "Account");
  return;
}
```