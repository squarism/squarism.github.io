---
layout: post
status: publish
published: true
title: Using a Redis as a Database
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1847
wordpress_url: http://squarism.com/?p=1847
date: !binary |-
  MjAxMy0wNS0wNCAxMTozNzo0MyAtMDQwMA==
date_gmt: !binary |-
  MjAxMy0wNS0wNCAxNjozNzo0MyAtMDQwMA==
categories:
- Development
- Ruby
tags: []
comments:
- id: 12111
  author: Hai Bison
  author_email: haibison.apps@gmail.com
  author_url: ''
  date: !binary |-
    MjAxNC0wNy0xMiAxMDo1MTozOSAtMDQwMA==
  date_gmt: !binary |-
    MjAxNC0wNy0xMiAxNTo1MTozOSAtMDQwMA==
  content: ! "Hi Chris Dillon,\r\n\r\nI'm new to Ruby. I like Redis. In general, I
    don't understand/like the way `redis-objects` works.\r\n\r\nBut I've tried
    serializing Redis to my programming language before I knew `redis-objects`. When
    I came to learn Ruby, I ported that project to Ruby.\r\n\r\nIf you have free time,
    would you please play with my gem and send me some feedbacks? Here it is: https://code.google.com/p/ga-nuong/wiki/HelloGaNuong\r\n\r\nG&Atilde;&nbsp;
    N&AElig;&deg;&aacute;&raquo;&rsaquo;ng means \"Fried Chicken\" in Vietnamese  :-)\r\n\r\nThank
    you, and have a nice day,"
---
<p><img src="/uploads/2013/05/pixel-ribbon_cor.png" alt="pixel-ribbon_cor" width="576" height="24" class="aligncenter size-full wp-image-1971" /></p>
<h2>The Spike</h2><p>
I was spiking on Redis recently.  I wanted to use the <a href="https://github.com/nateware/redis-objects">redis-objects gem</a> to simulate a shopping cart app even though the README specifically says</p>
<blockquote><p>Just use MySQL, k?</p></blockquote>
<p>I wanted to see what would happen if I tried it anyway.  So the README and examples for the redis-objects gem are great so I'm not going to rehash what's there.  However, I will say though that the example has you hardcode the id field to 1.  That detail snuck up on me.</p>
<p>If you don't set an ID then you can't work with a redis-object instance.  You get an exception: <code>Redis::Objects::NilObjectId: Attempt to address redis-object :name on class User with nil id (unsaved record?)</code></p>
<p>It's basically trying to tell you, "hey, save the record first or set an ID".  Well, honestly, I don't want to set an id myself.  This is where the meat of the README is.  Redis-objects really fits organically in an existing ActiveRecord model.  That means Rails.  In this case though, I don't want an entire Rails app.  I can see the value though in a plain old Rails app.  Just look at the examples if you want to see more.</p>
<p>Anyway, continuing on with the spiking, I tried to integrate the Supermodel gem with Redis-objects.  That sort of worked.  You just <code>class User < Supermodel::Base</code> and you can sort of get it to work.  This is great because Supermodel gives you finders like <code>User.find_by_email('bob@yahoo.com')</code> to make it act like ActiveRecord but you can't use <code>.create(email: 'bob@yahoo.com')</code> to begin with because of the same errors as I mentioned above.  Redis-objects really wants the record to have an ID already.  Even using Supermodel's RandomID mixin didn't work.  The initialize order and callback hooks don't really work (or at least I couldn't get them to work).</p>
<p>Finally, I tried combining just redis-objects and datamapper redis.  That worked.  And it's pretty nice.  Check it out.</p>

{% highlight ruby %}
require 'redis-objects'
require 'dm-core'
require 'dm-redis-adapter'

DataMapper.setup(:default, {:adapter  => "redis"})

# you would move this to a common location
Redis.current = Redis.new(:host => '127.0.0.1', :port => 6379)

class User
  include Redis::Objects
  include DataMapper::Resource

  # datamapper fields, just used for .create
  property :id, Serial
  property :email, String

  # use redis-objects fields for everything else
  value :disabled
  value :name
  list :cart, :marshal => true

end

# absolutely need this line for dm-redis
User.finalize
{% endhighlight %}


<p>So using this is pretty easy.</p>

{% highlight ruby %}
u = User.create(email: 'test@test.com')
u.name = 'Testy McTesterson'
{% endhighlight %}


<p>When you look at Redis, the keys are already composited for you and magic has happened.</p>
<pre>
redis 127.0.0.1:6379> keys *
user:test@test.com:name

redis 127.0.0.1:6379> get user:test@test.com:name
Testy McTesterson
</pre>

<p>Yay!</p>
<p>The name field is from redis-objects and the create uses datamapper.  This is a really odd pairing but I like the fact that I have no sql database in the mix but still have finders similar to an ORM.  Something to keep in mind, datamapper's finders are a bit different than the Rails 3 ones (no .where method).</p>
<h2>Benchmarking A Million Things</h2><p>
Ok fine.  So maybe this works, maybe it doesn't.  Maybe it's not the right idea.  What about the good stuff?  Like, how fast can we load a whole lot of names into MySQL versus Redis using  the above code and techniques?  Is it even relevant?</p>

<pre>
Summary
-------------------------------------------------------------------------------
(PL = pipelined redis operation)

Loading one million random names (full names) like John Smith, Patty Gerbee Sr)
MySQL:                   06:05
Redis:                   02:45
Redis C ext              01:32
Redis pipelined:         00:56
Redis pipelined C ext:   00:19
Ruby just loading array: 387ms

Loading 10k ecommerce-style data (orders, users, products)
MySQL:    00:09.40
Redis:    00:14.50
Redis PL: 00:02.72
</pre>

A gist of these <a href="https://gist.github.com/squarism/5234519">test results is here</a>.

<h2>A More Complete Example</h2>
<p>
If you know the ID and don't need something like an auto-incrementing column outside your code/control then you can greatly simplify the code above by getting rid of Datamapper.  You can simply use redis-objects to fake an ORM.  I had great success using it as long as you <em>USE NATIVE REDIS TYPES</em>.  Listen to the redis-objects author, don't try to force the tool into the use case.</p>

{% highlight ruby %}
# What if we want to use redis-objects as a database but
# try to stick with native redis objects?
#
# For example, Supermodel is a great gem but using the Redis
# mixin causes Supermodel to serialize to JSON strings in Redis
# which is going to kill performance.  You have to model your
# problem using native Redis objects to keep the speed up.
#
# At the same time, I miss the finders from ActiveModel
# like: Person.find('Joe')
# Supermodel does give you those finders so you will feel right at
# home coming from Rails.  I tried using ActiveModel mixins with
# redis-objects but it didn't work for me.
#
# I found the below a nice compromise but it requires a lot of
# custom methods.  :(

require 'redis-objects'

class Person
  attr_reader :name
  alias :id :name

  include Redis::Objects

  def initialize name
    @name = name
  end

  def self.exists? name
    # Here's a big assumption, if the id attribute exists, the entire
    # object exists.  This might not work for your problem.
    self.redis.exists "name:{#name}:id"
  end

  def self.find name
    # new behaves like find when a record exists, so this works like
    # find_or_create()
    self.new name
  end

  # native redis attributes with redis-objects
  value :age
  list :favorite_foods
end

# example usage

joe = Person.new 'Joe'
joe.age = 34
joe.favorite_foods << ['cake', 'pie']  # it will flatten arrays, don't worry
joe.favorite_foods << 'bacon'          # or you can do this

Person.find('Joe').age = 56

# find and initialize
Person.find('Stan').age = 21

# you cannot just .favorite_foods = ['Steak]' because that's not how native
# Redis objects work
Person.find('Stan').favorite_foods << 'Steak'

# deleting a field
Person.find('Stan').favorite_foods.del  # notice it's .del and not .delete (del is the redis cmd)
{% endhighlight %}
