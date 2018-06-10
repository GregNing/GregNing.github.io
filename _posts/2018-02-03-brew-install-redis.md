---
layout: post
title: 'Ruby On Rails 異步任務處理'
date: 2018-02-03 10:04
comments: true
categories: 
---
使用[redis-rb](https://github.com/redis/redis-rb) 數據庫gem
請先在本機安裝無法透過Gemfile安裝

	gem install redis

接下來請開啟redis所需的server跑起來看看是否有安裝成功

	redis-server /usr/local/etc/redis.conf

應該會長這樣
![螢幕快照 2018-02-03 下午6.09.02.png](http://user-image.logdown.io/user/29283/blog/28339/post/5560112/a8COh8vT0mKC41ymsY83_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202018-02-03%20%E4%B8%8B%E5%8D%886.09.02.png)

接下來安裝[sidekiq](https://github.com/mperham/sidekiq)
sidekiq 搭配 redis效果非常突出
請在Gemfile安裝

	gem 'sidekiq'

新增以下指令編輯 config/environments/development.rb 和 config/environments/production.rb 告訴 Rails 要用 sidekiq 来做異步處理

	config.active_job.queue_adapter = :sidekiq

新增 config\sidekiq.yml(請使用空格)

	:queues:
		default
		mailers

新增異步處理任務

	rails g job import_worker

```c 編輯 app/jobs/import_worker_job.rb
	def perform(import_id)
		#do somethings
	end
```
Controller加入以下代碼就可以呼叫了

	ImportWorkerJob.perform_later(@import.id)

在專案底下執行下面指令就可以看到是誰在幫你做執行了

	bundle exec sidekiq

![螢幕快照 2018-02-03 下午6.25.25.png](http://user-image.logdown.io/user/29283/blog/28339/post/5560112/4FLuNJgKTbecRceHKrA7_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202018-02-03%20%E4%B8%8B%E5%8D%886.25.25.png)

在Sidekiq有專用的dashboard可以查看瀏覽狀態紀錄
如果有設定權限請記得給予

	require 'sidekiq/web'
	authenticate :user, lambda { |u| u.is_admin? } do
		mount Sidekiq::Web => '/sidekiq'
	end

瀏覽網址

	http://localhost:3000/sidekiq

![螢幕快照 2018-02-03 下午6.29.40.png](http://user-image.logdown.io/user/29283/blog/28339/post/5560112/LXC85RXvQwbYnnYrWxAm_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202018-02-03%20%E4%B8%8B%E5%8D%886.29.40.png)