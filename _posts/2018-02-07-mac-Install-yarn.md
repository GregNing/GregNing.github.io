---
layout: post
title: 'Mac Install yarn'
date: 2018-02-07 09:34
comments: true
categories:
---
如果已經裝好Homebrew要在安裝 [yarn](https://yarnpkg.com/lang/en/docs/install/)請按照以下方式即可
```
brew install yarn
```
測試安裝好的yarn查看版本 on `iTerm`
```
yarn -v
#OR
yarn --v
```
{% capture string_with_newlines %}
> yarn 不支援直接安裝套件
> yarn install
> yarn add [paakage] 僅是將 --save 改成 add
> yarn add [paakage] --dev
> yarn global add [package]	這段還沒測過 global 的差異
> yarn remove [package]	 移除套件
> yarn upgrade	移除再安裝 變 直接升級套件
{% endcapture %}
{{ string_with_newlines | newline_to_br }}