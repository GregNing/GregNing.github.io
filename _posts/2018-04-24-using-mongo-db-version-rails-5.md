---
layout: post
title: 'Ruby 使用Mongo DB'
date: 2018-04-24 14:51
comments: true
categories:
description: 'ROR use mongodb'
---
## Install Mongo before you need to remove all the active record related entries from `application.rb` and `config/initializers/*`
### Step1 Remove database adapter gems from your Gemfile
install in Gemfile `gem 'sqlite3'`
### Step2 Remove require 'rails/all' and Add below
```ruby
#require 'rails/all'
require "action_controller/railtie"
require "action_mailer/railtie"
require "sprockets/railtie"
require `"rails/test_unit/railtie"`
```
### Step3 Delete `database.ym , schema.rb` and all the migrations
### Step4 Delete migration checks from `test/test_helper.rb`
### Step5 Delete all activerecord related configuration from `config/environments`
```conf
# config.active_record.migration_error = :page_load
```
in `config/environments/production.rb` setting `# config.active_record.dump_schema_after_migration = false`
### Install Mongoid Use gemfile
in Gemfile `gem 'mongoid', '~> 6.1.0'`<br>
User `rails g mongoid:config` create `config/initializers/mongoid.rb`and Add below
`Mongoid.load!(File.expand_path("config/mongoid.yml", Dir.pwd))`<br>
in `application.rb` setting
```ruby
config.generators do |g|
  g.orm :mongoid
end
```
## 注意如果Rails 5.1.1 版本使用`rails c`接著使用query `User.all.count`當掉或是掛掉請降版本
Ralis 版本降到4.2.7
mongoid降到4.0.0
Ruby版本降到 2.2.3

#### mongodb安裝按照下列步驟使用
Step1 `brew install mongodb`使用homebrew安裝mongodb
Step2 `mongod`啟動mongoDB
Step3 `sudo mkdir -p /data/db`創建文件(用來存放 Mongo DB資料所使用)
Step4 `mongod --dbpath ~/data/db`將Mongo DB資料存放在此目錄底下
##### 如果發現無法連線到MongoDB請先確認是否有開啟MongoDB而且MongoDB `dbpath`指向哪邊
{% capture string_with_newlines %}
[install mongodb](https://www.jianshu.com/p/1582e58483be)
[install mongodb](http://www.runoob.com/mongodb/mongodb-osx-install.html)
[Mongoid 4.0.0 (Rails 4.0+)](https://mongoid.github.io/old/en/mongoid/docs/installation.html)
[Mongoid Official English(Rails 5.0+)](https://docs.mongodb.com/mongoid/master/tutorials/mongoid-installation/)
[安裝Mongo DB中文版](https://www.1ju.org/mongodb/mongodb-ruby)
[remove active record](https://stackoverflow.com/questions/28319002/how-do-i-remove-activerecord-from-an-existing-rails-4-application)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}