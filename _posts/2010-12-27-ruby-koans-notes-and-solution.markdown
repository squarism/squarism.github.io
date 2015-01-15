---
layout: post
status: publish
published: true
title: Ruby Koans Notes and Solutions
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 868
wordpress_url: http://squarism.com/?p=868
date: !binary |-
  MjAxMC0xMi0yNyAwMDowNDozMSAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0yNyAwNTowNDozMSAtMDUwMA==
categories:
- Ruby
tags: []
comments:
- id: 6606
  author: James Bell
  author_email: jamesbellthefirst@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wNy0xOSAxMDozNToxMiAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNy0xOSAxNTozNToxMiAtMDQwMA==
  content: ! "I was searching to get help on test_constants_become_symbols (in about_symbols.rb)
    and found your github project. Thanks for sharing it.\r\nHowever, I don't think
    your answer for test_constants_become_symbols is correct. \r\nThe following assert
    always passes:\r\nassert_equal true, all_symbols.include?(:anyGarbageSymbolThatHasNotBeenUsedBefore)\r\n\r\nThat
    tells me that you haven't actually proven anything by checking for :RubyConstant
    (since the check will return true even if it didn't previously exist). Furthermore,
    RubyConstant and :RubyConstant are not the same:\r\nassert_equal false, :RubyConstant
    == RubyConstant\r\nassert_equal false, :RubyConstant.object_id == RubyConstant.object_id\r\n\r\nI
    eventually rewrote the test as:\r\nall_symbols = Symbol.all_symbols\r\nsymbols_as_strings
    = Symbol.all_symbols.map { |x| x.to_s }\r\nassert_equal true, symbols_as_strings.include?(\"RubyConstant\")\r\n\r\nWhich
    is actually (I think) the explanation for the previous \"THINK ABOUT IT\". The
    compare is done against the string value instead of a symbol because the act of
    testing against a symbol creates the symbol, but comparing to string values allows
    you to actually see if the symbol was previously defined.\r\n\r\nI'm by no means
    a Ruby expert (just started learning yesterday) so I may be wrong... but the tests
    support me! :)"
- id: 6623
  author: Matt
  author_email: matt.briancon@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wOC0xNiAwOTo1OTozMSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wOC0xNiAxNDo1OTozMSAtMDQwMA==
  content: ! "@James Bell\r\n\r\nThe test can be done without modifying the code so
    much:\r\n\r\nall_symbols = Symbol.all_symbols\r\nassert_equal true, all_symbols.include?(&acirc;&euro;&oelig;RubyConstant&acirc;&euro;\x9D.to_sym)"
- id: 6624
  author: Matt
  author_email: matt.briancon@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wOC0xNiAxMToyMDo0NSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wOC0xNiAxNjoyMDo0NSAtMDQwMA==
  content: ! "The reason for this behavior is intentional and explained here: http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-talk/380637\r\n\r\nThat
    said, I think most people would agree that this behavior is unexpected.  There
    is a feature ticket (not a bug because it's a spec change) where you can track
    the discussion: http://redmine.ruby-lang.org/issues/4541"
- id: 6625
  author: Matt
  author_email: matt.briancon@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wOC0xNiAxMTozNDowNyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wOC0xNiAxNjozNDowNyAtMDQwMA==
  content: ! 'A better link: http://www.ruby-forum.com/topic/1393096'
---
![](/uploads/2010/12/rubykoans-150x150.png "rubykoans")Just finished EdgeCase UK's rubykoans test/project.  It's a test driven development style learning session that you should really check out even if you're only partial curious in what ruby is.  If you've got some ruby experience under your belt, you should go through the exercise too because it's good practice, reference and you'll probably learn something new.

I'm not posting this so someone can cheat.  I'm posting this for the me out there who wants to see if they did it the same.  There were many "THINK ABOUT IT" sections that were open-ended or tricky.  The whole thing took me about 4 days while on vacation.  Maybe 16-20 hours of solid work.  It's good, just do it!

I used auto_enlighten.rb which I nabbed from [davesquared.net](http://www.davesquared.net/2010/08/continually-running-script-with-ruby.html).  It was really handy.  Using watchr, all I had to do was save an .rb file and the test ran again.  So I could just try my answer and continually monitor my progress and get feedback on errors.  This was very much the #1 bullet point in the Ted talk [7 ways games reward the brain](http://blog.vongraf.com/2010/11/06/7-ways-games-reward-the-brain/).  The whole exercise is one long experience bar with continuous feedback.  Excellent!  Books should be this way!

I definitely had some learning experiences along the way and I've posted my solutions with notes on gotchas to [github](https://github.com/squarism/rubykoans).  And there were many gotchas.  Sometimes, I would nail a solution, first shot, very elegantly.  Other times, I would churn on a test for many minutes and research for more information.  There were some very, very deep and specific issues that I would read more about.

For example, take this excerpt one of the early tests: test_slicing_arrays.  For the ruby koans, they created a special __ method that is equal to "FILL ME IN" (slick move EdgeCase).  So you just have to change the __ for the test to pass.  In this case, I expected it to be nil.  So I filled in nil and it failed.

{% highlight ruby %}
def test_slicing_arrays
    array = [:peanut, :butter, :and, :jelly]
    # snip for blog post
    # Learned: this is crazy!  empty when beyond range but at .size, nil when beyond .size
    assert_equal __, array[4,0]
    # snip for blog post
end
{% endhighlight %}
Notice my Learned: note there in the middle.  This was surprising.  If you open up irb and follow along, you'll find that slicing an array of 4 things from 4 to 0 gives you an empty array.  Wow.  That's a bug if you ask me.  There's a bunch of notes marked "Learned:" like this in the [github](https://github.com/squarism/rubykoans) project.  The README has a grep example you can use to find all the things I thought were gotchas.  But do them yourself first!  It's way more fun to do this interactively.</p>

BTW, Internet, I would love a node.js koans project.