---
title: "Memcached with Rails 3"
description: "I never had a reason to play with memcached and it was on my list of things to learn. Below I will demonstrate an example app very quickly and simp..."
date: 2011-08-30T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

I never had a reason to play with memcached and it was on my list of things to learn.  Below I will demonstrate an example app very quickly and simply.  I'm not doing anything more complicated than simple primitive storing.  If you are going to store any objects in memcached, dalli gem will take care of this for you (ymmv).

First let's create a rails app and an rvm gemset to play in.

`rvm use 1.9.2@memcache --create`

If you don't have rails in your global gemset, you can install rails now.  I used the 3.1 RC here just to test out 3.1 and memcached at the same time.

```bash
gem install rails --pre
gem install dalli
```

[Dalli](https://github.com/mperham/dalli) is written by Mike Perham (awesome guy) and simply wires up Rails.cache to be our memcached server.  This is convenient and more standard than creating your own global variable or other configuration.

Next, let's install memcached if we haven't already:

```bash
brew install memcached
$ memcached -v
```

You can also start memcached as a service under Mac using the homebrew instructions.  I like to leave things in the foreground when I'm first setting them up or grok'ing.

Ok, now we can create our dummy app.

`rails new memcache_test`

Our dummy rails app is going to have a slow controller action in it.  In this case, it could be a row count of a huge database.  In your case it could be a slow network call or a result of an expensive SQL operation.

First, edit your Gemfile:

```ruby
gem 'dalli'
```

Edit config/environments/development.rb

```ruby
# Memcached
  config.perform_caching = true
  config.action_controller.perform_caching = true
  config.cache_store = :dalli_store, 'localhost:11211'
```

Rails c should work at this point and this line:

```ruby
Rails.cache.read('foo')
=> nil
```

Now generate a controller:

`rails g controller posts`

```ruby
class PostsController < ApplicationController
  def index
    @posts_count = Rails.cache.read 'posts_count'
    if @posts_count
    else
      # expensive operation
      sleep 3
      @posts_count = 321
      Rails.cache.write('posts_count', @posts_count, :expires_in => 3)
    end
  end
end
```

Create a route in routes.rb:

```ruby
resources :posts
```

Create a simple view in app/views/posts/index.json.erb:

```ruby
{ posts: <%= @posts_count %> }
```

Now when you hit the page it should be slow the first time but fast the second time.  After 3 seconds, it's slow again.

```bash
$ time wget -O - localhost:3000/posts.json
HTTP request sent, awaiting response... 200 OK
Length: 14 [application/json]
real  0m3.049s
user  0m0.001s
sys 0m0.003s

$ time wget -O - localhost:3000/posts.json
HTTP request sent, awaiting response... 200 OK
Length: 14 [application/json]
real  0m0.049s
user  0m0.001s
sys 0m0.003s
```

So you can see that memcached returned the cached object and avoided the sleep call.  In the real world, this would equate to lower page rendering time or better application performance.
