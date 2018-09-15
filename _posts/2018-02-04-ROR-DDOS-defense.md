---
layout: post
title: 'ROR DDOS defense'
date: 2018-02-04 14:22
comments: true
categories:
description: 'Ruby On Rails DDos防禦'
tags: Ruby
---
如何防禦某特定IP同一時間內存取太多次會被封鎖
使用[rack-attack](https://github.com/kickstarter/rack-attack)<br>
In Gemfile install [rack-attack](https://github.com/kickstarter/rack-attack)
```rb
gem 'rack-attack'
```
create `config\application.rb`
```rb
config.middleware.use Rack::Attack
```
add `config\initializers/rack-attack.rb`
```rb
class Rack::Attack
  throttle('req/ip', :limit => 180, :period => 1.minutes) do |req|
    req.ip
  end
  ### Prevent Brute-Force Login Attacks ###
  # The most common brute-force login attack is a brute-force password
  # attack where an attacker simply tries a large number of emails and
  # passwords to see if any credentials match.
  #
  # Another common method of attack is to use a swarm of computers with
  # different IPs to try brute-forcing a password for a specific account.
  # Throttle POST requests to /login by IP address
  #
  # Key: "rack::attack:#{Time.now.to_i/:period}:logins/ip:#{req.ip}"
  throttle('logins/ip', :limit => 5, :period => 20.seconds) do |req|
    if req.path == '/users/sign_in' && req.post?
      req.ip
    end
  end
  # Throttle POST requests to /login by email param
  #
  # Key: "rack::attack:#{Time.now.to_i/:period}:logins/email:#{req.email}"
  #
  # Note: This creates a problem where a malicious user could intentionally
  # throttle logins for another user and force their login requests to be
  # denied, but that's not very common and shouldn't happen to you. (Knock
  # on wood!)
  throttle("logins/email", :limit => 5, :period => 20.seconds) do |req|
    if req.path == '/users/sign_in' && req.post?
      # return the email if present, nil otherwise
      req.params['email'].presence
    end
  end
end
```
上面的設定包括
> 1. 一分鐘內，一個IP位址只能存取180次
> 2. 針對`/ users / sign_in`這個登入網址，20秒內只能嘗試登入5次
> 3. 針對`/ users / sign_in`這個網址，同一個電子郵件在20秒內只能嘗試登入5次