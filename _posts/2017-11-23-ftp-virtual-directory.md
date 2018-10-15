---
layout: post
title: '使用 IIS 建立 FTP 虛擬目錄 以及隔離使用者教學'
date: 2017-11-23 02:09
comments: true
categories: FTP
tags: FTP IIS
reference:
  name:
    - Microsoft FTP 7.5 使用者隔離 操作教學
  link:
    - https://atifans.net/articles/microsoft-ftp-7-5-users-isolation/
---
在FTP 建立虛擬目錄

Ex: FTP使用者是本機使用者(LocalUser)
1. 先建立FTP目錄(用來當虛擬目錄)
2. 設定FTP站台，實體目錄不能跟步驟1同樣
3. 在FTP站台新增一個虛擬目錄叫做"LocalUser"，而那個路徑就設在步驟1的假目錄，並且要設定該資料夾"只有"開放FTP使用者"列出資料夾內容"或是有特殊需求可在此設定權限
4. 回到FTP站台，在LocalUser這個虛擬目錄下再建立新增虛擬目錄，名稱為"使用者帳戶名稱(Tom)"，並且設定虛擬目錄路徑是"最終目標資料夾"(你想要讓使用者看到的)
5. 接著在FTP站台開啟"使用者隔離"，設定選項為第一個，"隔離使用者(禁止全域目錄)"
6. 在FTP站台選"使用者驗證"，開啟相對應的驗證方式，如果你是用本機帳戶，請開啟基本驗證
7. 接著開放使用者存取FTP站台的權限
8. 再來就是調整"最終目標資料夾"的存取權限