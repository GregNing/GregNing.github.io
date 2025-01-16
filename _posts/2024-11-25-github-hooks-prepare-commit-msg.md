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

COMMIT_MSG_FILE=$1

# Define branches to skip
BRANCHES_TO_SKIP="master develop test"

# Check if the hook is running during a rebase
if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then
  echo "Skipping prepare-commit-msg hook during rebase"
  exit 0
fi

# Get the current branch name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# Exit if the current branch is in the skip list
if echo "$BRANCHES_TO_SKIP" | grep -qw "$BRANCH_NAME"; then
  echo "Skipping commit message formatting for branch: $BRANCH_NAME"
  exit 0
fi

# will auto transfer branch name to special words
# Eamples of branch to prefix:
#   JIRA-1234              -> JIRA-1234: <COMMIT_MSG>
#   feature/JIRA-1234      -> JIRA-1234: <COMMIT_MSG>
#   JIRA-1234_my_feature   -> JIRA-1234: <COMMIT_MSG>
TICKET=$(echo "$BRANCH_NAME" | grep -oE 'JIRA-[0-9]+')

# Check for merge commit
if [ -f ".git/MERGE_HEAD" ]; then
  exit 0
fi

# Get the commit message without comments
MESSAGE=$(grep -v '^#' "$COMMIT_MSG_FILE" | sed '/^$/d')

# Abort if the commit message is empty
if [ -z "$MESSAGE" ]; then
  echo "Aborting commit due to empty commit message."
  exit 1
fi

# Prepend the ticket number or branch name to the commit message
if [ -n "$TICKET" ]; then
  echo "$TICKET: $MESSAGE" > "$COMMIT_MSG_FILE"
else
  echo "$BRANCH_NAME: $MESSAGE" > "$COMMIT_MSG_FILE"
fi
```
