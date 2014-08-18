---
layout: post
status: publish
published: true
title: Memcached with Rails 3
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1326
wordpress_url: http://squarism.com/?p=1326
date: !binary |-
  MjAxMS0wOC0zMCAxODoxMzoyNyAtMDQwMA==
date_gmt: !binary |-
  MjAxMS0wOC0zMCAyMzoxMzoyNyAtMDQwMA==
categories:
- Ruby
- Rails
tags: []
comments: []
---
<p>I never had a reason to play with memcached and it was on my list of things to learn.  Below I will demonstrate an example app very quickly and simply.  I'm not doing anything more complicated than simple primitive storing.  If you are going to store any objects in memcached, dalli gem will take care of this for you (ymmv).</p>
<p>First let's create a rails app and an rvm gemset to play in.</p>
<pre lang="bash">rvm use 1.9.2@memcache --create</pre></p>
<p>If you don't have rails in your global gemset, you can install rails now.  I used the 3.1 RC here just to test out 3.1 and memcached at the same time.</p>
<pre lang="bash">gem install rails --pre
gem install dalli</pre></p>
<p><a href="https://github.com/mperham/dalli">Dalli</a> is written by Mike Perham (awesome guy) and simply wires up Rails.cache to be our memcached server.  This is convenient and more standard than creating your own global variable or other configuration.</p>
<p>Next, let's install memcached if we haven't already:</p>
<pre lang="bash">brew install memcached
memcached -v</pre></p>
<p>You can also start memcached as a service under Mac using the homebrew instructions.  I like to leave things in the foreground when I'm first setting them up or grok'ing.</p>
<p>Ok, now we can create our dummy app.</p>
<pre lang="bash">rails new memcache_test</pre></p>
<p>Our dummy rails app is going to have a slow controller action in it.  In this case, it could be a row count of a huge database.  In your case it could be a slow network call or a result of an expensive SQL operation.</p>

<p>First, edit your Gemfile:</p>
{% highlight ruby %}
gem 'dalli'
{% endhighlight %}

<p>Edit config/environments/development.rb</p>
{% highlight ruby %}
# Memcached
  config.perform_caching = true
  config.action_controller.perform_caching = true
  config.cache_store = :dalli_store, 'localhost:11211'
{% endhighlight %}

<p>Rails c should work at this point and this line:</p>
{% highlight ruby %}
Rails.cache.read('foo')
=> nil
{% endhighlight %}

<p>Now generate a controller:</p>
<pre lang="bash">rails g controller posts</pre></p>

{% highlight ruby %}
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
{% endhighlight %}

<p>Create a route in routes.rb:</p>
{% highlight ruby %}
resources :posts
{% endhighlight %}

<p>Create a simple view in app/views/posts/index.json.erb:</p>
{% highlight ruby %}
{ posts: <%= @posts_count %> }
{% endhighlight %}

<p>Now when you hit the page it should be slow the first time but fast the second time.  After 3 seconds, it's slow again.</p>
<pre lang="bash">$ time wget -O - localhost:3000/posts.json
HTTP request sent, awaiting response... 200 OK
Length: 14 [application/json]
real	0m3.049s
user	0m0.001s
sys	0m0.003s
</pre></p>
<pre lang="bash">$ time wget -O - localhost:3000/posts.json
HTTP request sent, awaiting response... 200 OK
Length: 14 [application/json]
real	0m0.049s
user	0m0.001s
sys	0m0.003s
</pre></p>
<p>So you can see that memcached returned the cached object and avoided the sleep call.  In the real world, this would equate to lower page rendering time or better application performance.</p>
