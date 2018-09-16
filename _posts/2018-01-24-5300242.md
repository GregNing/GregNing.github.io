---
layout: post
title: '使用iterm2安裝 zsh'
date: 2018-01-24 14:02
comments: true
categories:
tags: Terminal ZSH
---
shell to zsh在iterms2輸入
```
chsh -s /bin/zsh
```
若要確認請重開iterm輸入`echo $0`查看是否是zsh。

安装 oh-my-zsh 輸入以下指令
```
cd ~/
git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
如果以下這行出錯請輸入 touch ~/.zshrc 建立檔案即可
cp ~/.zshrc ~/.zshrc.orig
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
```
修改 theme 使用 atom打開檔案
```
atom .zshrc
```
Search ZSH_THEME="robbyrussell" and replaces
```
#ZSH_THEME="robbyrussell"
ZSH_THEME="agnoster"
```
修改 agnoster 的 theme source code 輸入以下
```
atom ~/.oh-my-zsh/themes/agnoster.zsh-theme
```
打開後請將以下網址打開 打開後複製裡面所有代碼貼上去上述的[theme](https://gist.github.com/agnoster/3712874/raw/c3107c06c04fb42b0ca27b0a81b15854819969c6/agnoster.zsh-theme)檔案，存檔安裝[字型](https://gist.github.com/qrush/1595572)，完成後重開及完成。