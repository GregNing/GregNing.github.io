---
layout: post
title: 'VS Code Ruby 相關插件小技巧'
date: 2018-01-26 17:10
comments: true
categories: 
---
執行指令`shift + cmd + P`
可以重啟  VSCode 使用執行再加上以下兩種指令都可以`Reload`,`Reload Window`
自動補全Html.erb 檔案
In Settings.config Or Workpace（工作區設定） 設定`"emmet.includeLanguages": {"erb": "html"}`
參考https://github.com/rubyide/vscode-ruby/issues/197

#### For Javascript
VS Code JavaScript (ES6) snippets
1. For Js require`Npm Intellisense`
2. 讓程式碼畫面變好看適用於 js檔案`OneDark-Pro`
3. 很快找到你的路徑 `Path Intellisense`
4. 一定要安裝的插件對你的視覺效果會造成很大的幫助`vscode-icons`

#### For Ruby On Rails
##### rubocop 會幫你查看專案的Ruby程式碼是否有依照它的規則走
請先安裝 https://github.com/bbatsov/rubocop
使用`gem install rubocop`
或是使用 bundler進行安裝
```c Gemfile
gem 'rubocop', require: false
```
安裝完成後會建議在建立.rubocop.yml 檔案去做規則的設定
首先在你的專案路徑打上`rubocop --auto-gen-config`指令，會建立兩個檔案`.rubocop_todo.yml`,`.rubocop.yml`
接著請去下列網址讓我們去填補上我們所需在 rubocop的限制
.rubocop.yml 內容出處 : [.rubocop.yml](https://gist.github.com/jhass/a5ae80d87f18e53e7b56)
建立.rubocop.yml詳細資訊
[rubocop-configuration](https://github.com/bbatsov/rubocop/blob/master/manual/configuration.md)
[rubocop-rails-getting-started](https://joanswork.com/rubocop-rails-getting-started/)
[rubocop-configuration](http://rubocop.readthedocs.io/en/latest/configuration/)
##### VS Code `Ruby On Rails` Press F12 go to definition
(1) Press `cmd + ,` To VS Code Settings
(2) Edit `"ruby.intellisense": false` => `"ruby.intellisense" : "rubyLocate"`
(3) Restart VS Code
(4) Done