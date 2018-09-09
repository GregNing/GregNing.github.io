---
layout: post
title: 'bundle exec rake vs rake'
date: 2018-08-09 01:08
comments: true
categories:
description: 'bundle exec rake vs rake 介紹'
---
`bundle exec rake`會根據你所使用的 Gemfile 去做執行動作。<br>
`rake`單純使用`gem install rake` 去做執行不會依據Gemfile去做執行。

若已經事先安裝`gem install rake 12.1.0`，倘若Gemfile指定版本是10.4.2，如果不加`bundle exec`，將會使用`rake 12.1.0`版本去執行本來的rake 10.1.0版本寫出來的tasks。

#### 有可能會發生異常現象，但是為了避免這種不兼容情況發生，`bundle exec`就是為了避免這種問題而存在的，不論系統是什麼版本的gem都會依照Gemfile所指定的版本去操作。

{% capture string_with_newlines %}
[what-does-bundle-exec-rake-mean](https://stackoverflow.com/questions/6588674/what-does-bundle-exec-rake-mean)
[bundle exec rake vs rake](https://stackoverflow.com/questions/8275885/use-bundle-exec-rake-or-just-rake)
[what's 'bundle exec' used for中文版介紹](https://ruby-china.org/topics/13571)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}