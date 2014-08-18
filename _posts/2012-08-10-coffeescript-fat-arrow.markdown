---
layout: post
status: publish
published: true
title: Coffeescript Fat Arrow
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1601
wordpress_url: http://squarism.com/?p=1601
date: !binary |-
  MjAxMi0wOC0xMCAyMjowNTo0OCAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wOC0xMSAwMzowNTo0OCAtMDQwMA==
categories:
- Development
tags: []
comments: []
---
<p>I found myself in a situation where coffeescript was complaining that Object has no method foo when it clearly did.  What is going on?  Why is it so hard to call a class method from within a class?</p>

{% highlight ruby %}
class Car
  get_in_accident: ->
    @honk_horn("panic")
    @airbag()

  airbag: ->
    console.log("imma deploying mah airbag!")

  # just showing here that arguments don't change anything
  honk_horn: (level) ->
    if (level == "pissed")
      console.log("HONK HONK")
    else if (level == "panic")
      @yell("aaaa!", 1000)
      console.log("HON...")

  # the real issue is callbacks that lose the original scope
  yell: (message, wait_time) ->
    setTimeout ->
      console.log(message)
      @honk_horn("pissed")
      console.log("You jerk!")
    , wait_time

car = new Car
car.get_in_accident()
{% endhighlight %}

<p>What you see in this example is:
<code>
HON...
imma deploying mah airbag!
aaaa!</p>
<p>timers.js:103
            if (!process.listeners('uncaughtException').length) throw e;
                                                                      ^
TypeError: Object # has no method 'honk_horn'
    at Object._onTimeout (.:29:14)
    at Timer.list.ontimeout (timers.js:101:19)
</code></p>
<p>@honk_horn is supposed to refer to the instance variable when yell is called.  It doesn't know about it's self?  Well, there's a good chapter about this (Chapter 6 of <a href="http://www.amazon.com/gp/product/032182010X/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=032182010X&linkCode=as2&tag=squarism-20" title="Programming in Coffeescript">this book</a>) on Binding and the <a href="http://coffeescript.org/#fat_arrow">Fat Arrow</a> in coffeescript.  It's a simple fix to a confusing problem.  The method that is called later (the callback method) needs to have a fat arrow => which generates a __bind function in javascript when the coffescript is compiled.  This saves you a lot of time and effort.  All you have to remember is to use the fat arrow when a callback is going to be called out of scope.</p>

<p>So just change the setTimeout line to have a => instead of ->:</p>
{% highlight ruby %}
  yell: (message, wait_time) ->
    setTimeout =>
{% endhighlight %}

<p>Now it works right.  Also notice that the "aaaa!" yell is happening before the "HON..." log statement in both examples.
<code>
HON...
imma deploying mah airbag!
aaaa!
HONK HONK
You jerk!
</code></p>
