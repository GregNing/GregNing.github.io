---
layout: post
title: 'Github Hooks auto add commit message'
date: 2024-11-25 21:50
comments: true
categories: github hooks
description: '利用github hooks prepare-commit-msg 自動將branch name 加入到 commit message'
tags: github
reference:
  name:
    - Github Hooks
    - prepare-commit-msg
  link:
    - https://git-scm.com/docs/githooks
    - https://github.com/janniks/prepare-commit-msg/blob/master/README.md
---

#### 當你需要自動將branch name加入到commit message中
#### 這時候就可以使用 `prepare-commit-msg`

### prepare-commit-msg
***
#### 在`PROJECT/.git/hooks/`會有很多的example hooks可以去做使用
#### 目前要使用的是prepare-commit-msg，接下來就開始吧

1. `cd PROJECT/.git/hooks/`
2. `cp prepare-commit-msg.sample prepare-commit-msg`
3. `vim prepare-commit-msg`
4. 複製貼上以下就大功告成

```sh
#!/bin/sh

if [ -z "$BRANCHES_TO_SKIP" ]; then
  BRANCHES_TO_SKIP=(master staging develop)
fi

# Exit early if this is part of a rebase
if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then
  echo "Skipping prepare-commit-msg hook during rebase"
  exit 0
fi

# Get the currently checked-out branch name
BRANCH_NAME=$(git branch | grep '*' | sed 's/* //')
# will auto transfer branch name to special words
# Eamples of branch to prefix:
#   JIRA-1234              -> JIRA-1234: <COMMIT_MSG>
#   feature/JIRA-1234      -> JIRA-1234: <COMMIT_MSG>
#   JIRA-1234_my_feature   -> JIRA-1234: <COMMIT_MSG>
NEW_BRANCH_NAME=$(git branch | grep '*' | sed 's/* //' | grep -oE 'JIRA-[0-9]+')

# Check if the MERGE_HEAD file is present
if [ -f ".git/MERGE_HEAD" ]
then
    exit 0
fi

# Get the commit message, removing lines that start with a #
MESSAGE=$(cat "$1" | sed '/^#.*/d')
# Check if the commit message is non-empty
if [ -n "$MESSAGE" ]
then
    # Add the branch name and the commit message
    echo "$NEW_BRANCH_NAME: $MESSAGE" > "$1"
else
    echo "Aborting commit due to empty commit message."
    exit 1
fi
```
