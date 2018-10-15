---
layout: post
title: 'MVC Pass string To View'
date: 2017-12-11 02:21
comments: true
categories: MVC
tags: MVC Csharp
reference:
  name:
    - pass-html-string-from-controller-to-view
  link:
    - https://stackoverflow.com/questions/22781548/pass-html-string-from-controller-to-view-asp-net-mvc
---
```cs
ViewBag.HtmlStr = "<table style=\"width:300px\"><tr><td>Jill</td><td>Smith</td> <td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr></table>";
```
使用以下方式即可在View輸出您所需要使用的字元:<br>
`@Html.Raw(ViewBag.HtmlStr)`

或是使用這種方式以下方式為C# 6.0寫法直接在前端使用字串組合@ ($"")
`@($"leader{item.ID}")`