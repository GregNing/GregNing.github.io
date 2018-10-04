---
layout: post
title: 'Ryby redirect用法'
date: 2018-01-28 14:51
comments: true
categories: Ruby-On-Rails
tags: Ruby
---
在此示範是在 admin::jobs Controller裡面
下面指令會回到 admin_jobs_path
```rb
redirect_back fallback_location: root_path , notice: "#{@jobs.title}發布成功"
```
導向`admin_jobs_path`等於是`admin / jobs / Index.html.erb`
```rb
redirect_to admin_jobs_path, alert: "#{@jobs.title}刪除成功"
```