---
layout: post
title: 'Rails images 小技巧 favicon'
date: 2018-01-27 15:02
comments: true
categories: 
---
要在rails 頁面使用圖片方式

	<%= image_tag("rss.jpg", :alt => "rss feed") %>

	image_tag("icon")# => <img alt="Icon" src="/assets/icon" />

	image_tag("icon.png")# => <img alt="Icon" src="/assets/icon.png" />

	image_tag("icon.png", size: "16x10", alt: "Edit Entry")# => <img src="/assets/icon.png" width="16" height="10" alt="Edit Entry" />

	image_tag("/icons/icon.gif", size: "16")# => <img src="/icons/icon.gif" width="16" height="16" alt="Icon" />

	image_tag("/icons/icon.gif", height: '32', width: '32')# => <img alt="Icon" height="32" src="/icons/icon.gif" width="32" />

	image_tag("/icons/icon.gif", class: "menu_icon")# => <img alt="Icon" class="menu_icon" src="/icons/icon.gif" />

[add-image-to-layout-in-ruby-on-rails](https://stackoverflow.com/questions/1814736/add-image-to-layout-in-ruby-on-rails)
[image_tag](https://apidock.com/rails/ActionView/Helpers/AssetTagHelper/image_tag)