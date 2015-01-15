---
layout: post
status: publish
published: true
title: Caching an Object in Rails is Easy
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1490
wordpress_url: http://squarism.com/?p=1490
date: !binary |-
  MjAxMi0wOS0yMyAxOToxMTowOCAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wOS0yNCAwMDoxMTowOCAtMDQwMA==
categories:
- Blog
tags: []
comments: []
---
Caching in Rails is really simple (straight from the docs):

_You can set up your application's default cache store by calling config.cache_store= in the Application definition inside your config/application.rb file or in an Application.configure block in an environment specific configuration file (i.e. config/environments/*.rb). The first argument will be the cache store to use and the rest of the argument will be passed as arguments to the cache store constructor.
_

Originally, I didn't even know it was there.  So I was thinking I'd just create a hash in memory.  So I wrote my own cache class like this (homegrown_cache.rb):

{% highlight ruby %}
# not exactly a pure cache, implements the lookup or expensive operation too
# probably needs to be decoupled</p>

class Cache
  def initialize
    @cache = {}
  end

  def cache(name, values = {})
    if values = {}
      return @cache[name.to_sym]
    else
      @cache[name.to_sym] ||= values
    end
  end

  def search(name)
    if @cache.keys.include?(name.to_sym)
      puts "getting name from cache instead of expensive operation"
      return @cache[name.to_sym]
    else
      self.cache(name, Expensive::Search(name))
      return @cache[name.to_sym]
    end
  end

  def clear
    cache_size = @cache.length
    @cache = {}
    return cache_size
  end

  def to_s
    "#<Cache:#{self.object_id} Cache Size: #{@cache.length}>"
  end

  def size
    @cache.length
  end

end
{% endhighlight %}

<p>Then you might want to use it in an implementation like like CacheEnabledSearch or something like that within your app.

But it's way easier and smarter to just use the <del datetime="2011-12-08T17:24:46+00:00">goddamn</del> caching that's built into Rails.  Specifically, if you use the in memory store, since Rails 3.0 **it's thread safe**.  Meaning if two clients hit your cache, you're not going to have weird bugs pop up.  It's very easy to configure and use.

I'm posting the Cache class anyway though it's interesting how simple an object it is without being thread-safe.  But even then, I'd recommend using the cache class from Rails outside of Rails.

So here's how you'd use Rails caching "without" Rails.  In other words, a console app.

{% highlight ruby %}
# using the Rails caching class outside of rails
require 'active_support'</p>

#
cache = ActiveSupport::Cache::MemoryStore.new
cache.write('user', 'bob')
# => true
puts cache.read('user')
# => bob
{% endhighlight %}

<p>Not particularly interesting.  This would be way more useful inside of a Rails app where a singleton class called Rails.cache is set [if you have something set in your config](http://guides.rubyonrails.org/caching_with_rails.html#activesupport-cache-memorystore):
`config.cache_store = :memory_store`

Let's avoid the Rails situation for now and create a file cache directory for a file based cache:
`$ mkdir /tmp/poro_cache`

Here's a complete example.

{% highlight ruby %}
# using the Rails caching class outside of rails
require 'active_support'</p>

cache = ActiveSupport::Cache::FileStore.new "/tmp/poro_cache"
if cache.read('user').nil?
  cache.write('user', 'bob')
  puts "wrote to cache, run me again"
else
  puts "Reading from filestore cache: #{cache.read('user')}"
end
{% endhighlight %}

<p>If we run this one time, we get this:
`ruby rails_cache_poro.rb
wrote to cache, run me again`

And running it again:
`ruby rails_cache_poro.rb
Reading from filestore cache: bob`

Reset it with `rm -rf /tmp/poro_cache`

Ok, so that's ActiveSupport caching outside of Rails.  Wiring Rails up to do this inside a controller, lib class, helper or other ruby object is trivial once you have followed the [caching guide](http://guides.rubyonrails.org/caching_with_rails.html#activesupport-cache-memorystore).  You won't instantiate ActiveSupport::Cache anymore directly but you'll do it indirectly through the config block for your environment.

And then all the statements will look like this:

{% highlight ruby %}
>> Rails.cache.write 'foo', 'bar'
=> true
{% endhighlight %}

But it works the same.  Really easy.  Of course, the next subject which is more complicated is [when to invalidate your cache](http://jeffdickey.info/cache-correctly-stop-invalidating).