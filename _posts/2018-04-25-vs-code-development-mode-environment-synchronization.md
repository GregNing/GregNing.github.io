---
layout: post
title: 'VS Code (Use SFTP)開發模式環境同步'
date: 2018-04-25 02:07
comments: true
categories: 
---
首先使用`VS Code`安裝[SFTP](https://marketplace.visualstudio.com/items?itemName=liximomo.sftp)
安裝完成再使用`Ctrl+Shift+P `指令搜尋`SFTP: config`點選去他會產生一個`sftp.json`檔案在.vscode資料夾裡面
```c 使用帳號密碼 以及 port
{    
"host": "遠端連線IP網址",
"port": 22,//在此需填寫對方的port
"username": "工作站姓名",
"password": "工作站密碼",
"protocol": "sftp",
"agent": null,
"privateKeyPath": null,
"passphrase": null,    
"passive": false,
"interactiveAuth": false,
"remotePath": "遠端連線地方位址",    
"uploadOnSave": false,//不建議開啟你修改完成存擋後會自動上傳此檔案
"syncMode": "update",
"ignore": [
  "**/.vscode/**",
  "**/.git/**",
  "**/.DS_Store"
  ],
"watcher": {
  "files": false,
  "autoUpload": false,
  "autoDelete": false
  }
}
```
```c 使用ssh key做認證 而不使用密碼只要使用帳號以及ssh key擺放位置
{
"host": "遠端連線IP網址",
"username": "工作站姓名",
"remotePath": "遠端連線地方位址ex: download/filename",
"protocol": "sftp",
"privateKeyPath": "/Users/usersname/.ssh/id_rsa.pub",//使用 ssh key做驗證需要設定此關鍵
"uploadOnSave": false,//不建議開啟你修改完成存擋後會自動上傳此檔案
"syncMode": "update",
}
```
如果要查詢`privateKeyPath`位址請在終端機輸入`ls ~/.ssh/*.pub`即可以知道位置
配置完成後記得要把`//`整個刪除掉
以上配置完成後使用方式
Step1 `SFTP：Sync to remote`(本地連線至服務器上)
Step2 `SFTP：Upload`(真正開始進行上傳動作)
Over