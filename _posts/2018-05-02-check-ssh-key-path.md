---
layout: post
title: 'Check ssh key path'
date: 2018-05-02 04:53
comments: true
categories: ssh
tags: ssh
reference:
  name:
    - Check ssh key path
  link:
    - https://stackoverflow.com/questions/3828164/how-do-i-access-my-ssh-public-key
---
```
cat ~/.ssh/id_rsa.pub Or cat ~/.ssh/id_dsa.pub
```
on Mac OS X: `cat ~/.ssh/id_rsa.pub`

You can list all the public keys you have by doing: `ls ~/.ssh/*.pub`

checkout who's ssh key in here`vim ~/.ssh/authorized_keys`