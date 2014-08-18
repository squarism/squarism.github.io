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
<p><img src="/uploads/2013/04/good_enough_mono-580x24.png" alt="good_enough_mono" width="580" height="24" class="aligncenter size-large wp-image-1880" /></p>
<p>Caching in Rails is really simple (straight from the docs):</p>
<p><em>You can set up your application's default cache store by calling config.cache_store= in the Application definition inside your config/application.rb file or in an Application.configure block in an environment specific configuration file (i.e. config/environments/*.rb). The first argument will be the cache store to use and the rest of the argument will be passed as arguments to the cache store constructor.
</em></p>
<p>Originally, I didn't even know it was there.  So I was thinking I'd just create a hash in memory.  So I wrote my own cache class like this (homegrown_cache.rb):</p>
{% highlight ruby %}
# not exactly a pure cache, implements the lookup or expensive operation too
# probably needs to be decoupled</p>
<p>class Cache
  def initialize
    @cache = {}
  end</p>
<p>  def cache(name, values = {})
    if values = {}
      return @cache[name.to_sym]
    else
      @cache[name.to_sym] ||= values
    end
  end</p>
<p>  def search(name)
    if @cache.keys.include?(name.to_sym)
      puts "getting name from cache instead of expensive operation"
      return @cache[name.to_sym]
    else
      self.cache(name, Expensive::Search(name))
      return @cache[name.to_sym]
    end
  end</p>
<p>  def clear
    cache_size = @cache.length
    @cache = {}
    return cache_size
  end</p>
<p>  def to_s
    "#<Cache:#{self.object_id} Cache Size: #{@cache.length}>"
  end</p>
<p>  def size
    @cache.length
  end</p>
<p>end
{% endhighlight %}

<p>Then you might want to use it in an implementation like like CacheEnabledSearch or something like that within your app.</p>
<p>But it's way easier and smarter to just use the <del datetime="2011-12-08T17:24:46+00:00">goddamn</del> caching that's built into Rails.  Specifically, if you use the in memory store, since Rails 3.0 <strong>it's thread safe</strong>.  Meaning if two clients hit your cache, you're not going to have weird bugs pop up.  It's very easy to configure and use.</p>
<p>I'm posting the Cache class anyway though it's interesting how simple an object it is without being thread-safe.  But even then, I'd recommend using the cache class from Rails outside of Rails.</p>
<p>So here's how you'd use Rails caching "without" Rails.  In other words, a console app.</p>

{% highlight ruby %}
# using the Rails caching class outside of rails
require 'active_support'</p>
<p>#
cache = ActiveSupport::Cache::MemoryStore.new
cache.write('user', 'bob')
# => true
puts cache.read('user')
# => bob
{% endhighlight %}


<p>Not particularly interesting.  This would be way more useful inside of a Rails app where a singleton class called Rails.cache is set <a href="http://guides.rubyonrails.org/caching_with_rails.html#activesupport-cache-memorystore">if you have something set in your config</a>:
<code>config.cache_store = :memory_store</code></p>
<p>Let's avoid the Rails situation for now and create a file cache directory for a file based cache:
<code>$ mkdir /tmp/poro_cache</code></p>
<p>Here's a complete example.</p>

{% highlight ruby %}
# using the Rails caching class outside of rails
require 'active_support'</p>
<p>cache = ActiveSupport::Cache::FileStore.new "/tmp/poro_cache"
if cache.read('user').nil?
  cache.write('user', 'bob')
  puts "wrote to cache, run me again"
else
  puts "Reading from filestore cache: #{cache.read('user')}"
end
{% endhighlight %}


<p>If we run this one time, we get this:
<code>ruby rails_cache_poro.rb
wrote to cache, run me again</code></p>
<p>And running it again:
<code>ruby rails_cache_poro.rb
Reading from filestore cache: bob</code></p>
<p>Reset it with <code>rm -rf /tmp/poro_cache</code></p>
<p>Ok, so that's ActiveSupport caching outside of Rails.  Wiring Rails up to do this inside a controller, lib class, helper or other ruby object is trivial once you have followed the <a href="http://guides.rubyonrails.org/caching_with_rails.html#activesupport-cache-memorystore">caching guide</a>.  You won't instantiate ActiveSupport::Cache anymore directly but you'll do it indirectly through the config block for your environment.</p>
<p>And then all the statements will look like this:</p>

{% highlight ruby %}
>> Rails.cache.write 'foo', 'bar'
=> true
{% endhighlight %}


<p>But it works the same.  Really easy.  Of course, the next subject which is more complicated is <a href="http://jeffdickey.info/cache-correctly-stop-invalidating">when to invalidate your cache</a>.</p>
