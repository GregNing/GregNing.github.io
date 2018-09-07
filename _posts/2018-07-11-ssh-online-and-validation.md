---
layout: post
title: 'ssh 連線以及驗證'
date: 2018-07-11 00:16
comments: true
categories:
---
{% capture string_with_newlines %}
如果我們要使用 `ssh` 去做連線登入動作請使用以下指令
`ssh username@11.255.123.123`
ssh 默認端口是 22 也就是登入的請求會被送到 22 這接口
`ssh -p 3322 username@11.255.123.123`
修改端口 也就是說ssh會直接連線到 3322這端口
第一次登入會要求輸入密碼當公鑰被接受後會被存在`~/.ssh/known_hosts`裡面，
下次連線會跳過警告直接要求輸入密碼但每次輸入也很麻煩
讓我們使用公鑰登入(不用密碼)
我們須提供自己的公鑰如果沒有的話就產生吧 `ssh-keygen`
產生過程中會要求輸入`passphrase` 如果擔心就輸入吧不擔心就 Enter 到底(我就是Enter到底的那個)
完成後會產生兩種檔案
`~/.ssh/id_rsa`: 私鑰
`~/.ssh/id_rsa.pub`: 公鑰(我們要給予遠端認證的)

`ssh-copy-id 3322 username@11.255.123.123`
輸入此命令即可將公鑰傳送至遠端主機
{% endcapture %}
{{ string_with_newlines | newline_to_br }}
### 我們可以在這查看是否有存成功 `~/.ssh/authorized_keys`

有的話讓我們登入看看是否可以成功倘若還不行。<br>
請編輯以下檔案，看資訊是否正確`/etc/ssh/sshd_config`。
```conf
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```
[ssh登入](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)