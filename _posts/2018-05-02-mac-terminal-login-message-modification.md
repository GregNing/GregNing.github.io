---
layout: post
title: 'Mac Terminal 登入訊息修改'
date: 2018-05-02 16:29
comments: true
categories: Terminal
tags: Terminal
reference:
  name:
    - change-the-mac-os-x-terminals-message
  link:
    - http://osxdaily.com/2007/01/30/change-the-mac-os-x-terminals-message-of-the-day/
---
{% capture string_with_newlines %}
Step1 首先要建立檔案
`/etc/motd`
Step2 接下來要把電腦相關訊息加入至裡面需要權限請使用(登入 root)
`sudo -i`
Step3 請使用以下指令加入相關系統版本訊息
`sw_vers > /etc/motd`
Step4 修改您要的自訂訊息
`sudo nano /etc/motd`
{% endcapture %}
{{ string_with_newlines | newline_to_br }}