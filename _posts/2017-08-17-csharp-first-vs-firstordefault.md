---
layout: post
title: 'First,FirstOrDefault,Single,SingleOrDefault 分別'
date: 2017-08-17 15:24
comments: true
categories:
tags: Csharp
---
返回序列中的第一個元素。
```cs
Enumerable.First
```
返回序列中的第一個元素;如果序列中不包含任何元素，則返回默認值。
```cs
Enumerable.FirstOrDefault
```
返回序列的唯一元素;如果該序列並非恰好包含一個元素，則會引發異常。
```cs
Enumerable.Single
```
返回序列中滿足指定條件的唯一元素;如果這類元素不存在，則返回默認值;如果有多個元素滿足該條件，此方法將引發異常。
```cs
Enumerable.SingleOrDefault
```

