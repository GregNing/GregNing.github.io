---
layout: post
title: 'git squash (將眾多的Commit 簡略化)'
date: 2018-05-17 17:37
comments: true
description: 'git squash 介紹'
categories: Git
tags: Git
---
#### `git squash` 合併目前的commit
假設我有這麼多commit或更多
```
* b1b8eq9 - (HEAD -> master) Commit-3
* 57qwqe5 - Commit-2
* e7ada1d - Commit-1
* 5d39f12 - Commit-0
```
{% capture string_with_newlines %}
在此的歷史紀錄 commit就很醜陋，接下來讓我們把它變得更簡單吧。
使用`git rebase -i 參數`稱為squash
`-i` 實際上就是 `--interactive` 簡寫 參數代表我們想保留哪個commit
如果我們要保留`e7ada1d`那就執行:
`git rebase -i e7ada1d`
也可以透過`HEAD~4`做指定
`git rebase -i HEAD~4`
Enter後讓我們進行下一步驟，我們會看到類似這樣的commit紀錄。
{% endcapture %}
{{ string_with_newlines | newline_to_br }}

```
pick e7ada1d Commit-1
pick 57qwqe5 Commit-2
pick b1b8eq9 Commit-3

# Rebase 5d39f12..b1b8eq9 onto 5d39ff2 (3 command(s))
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```
{% capture string_with_newlines %}
`squash`： 使用該Commit 會被合併到前一個Commit當中
`fixup`： 就像 squash 那樣，但會拋棄 Commit message(常用)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}
完成後請存擋 `:wq`
```
pick e7ada1d Commit-1
s 57qwqe5 Commit-2
s b1b8eq9 Commit-3
```
這時候會進入下一個階段
```c
# This is a combination of 3 commits.
# The first commit's message is:
Commit-1

# This is the 2nd commit message:

Commit-2

# This is the 3rd commit message:

Commit-3

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Tue Jan 5 23:27:22 2016 +0800
```
{% capture string_with_newlines %}
接下來請只留你要的一個Commit就好其他可以刪除註解`#`可以不用理會
修改完成請存擋 `:wq`
{% endcapture %}
{{ string_with_newlines | newline_to_br }}

```c
# This is a combination of 3 commits.
# The first commit's message is:
Commit-1

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Tue Jan 5 23:27:22 2016 +0800
```
接下來再看一下我們的log
#### 使用`git log`查看紀錄即可完成
如果想要修改 Commit message 請使用`git commit --amend`來進行修改動作

[changing-a-commit-message](https://help.github.com/articles/changing-a-commit-message/)