---
layout: post
status: publish
published: true
title: A Spork nil:NilClass fix
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1571
wordpress_url: http://squarism.com/?p=1571
date: !binary |-
  MjAxMi0wMy0wOSAxOTo0MDowOCAtMDUwMA==
date_gmt: !binary |-
  MjAxMi0wMy0xMCAwMDo0MDowOCAtMDUwMA==
categories:
- Ruby
tags: []
comments:
- id: 7089
  author: Bill
  author_email: me@privacy.net
  author_url: ''
  date: !binary |-
    MjAxMi0wNi0yMyAwOTowNjoyMCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wNi0yMyAxNDowNjoyMCAtMDQwMA==
  content: Thank you for posting this!  Helped me out when I was having issues with
    rspec switching between windows and linux platforms.
- id: 7091
  author: Tango
  author_email: Tango.S.Fleuri@Gmail.com
  author_url: ''
  date: !binary |-
    MjAxMi0wNi0yMyAxMDoyNjo1NiAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wNi0yMyAxNToyNjo1NiAtMDQwMA==
  content: ! "Nice!\r\nI've met this wired problem when changing from windows to linux,
    and forgot to remove some gems specified for windows, so I googled it and your
    post did the trick.\r\nWell, it's googleable now ."
- id: 7409
  author: sq
  author_email: shazebq@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMy0wMS0yMCAyMzozMjo0OCAtMDUwMA==
  date_gmt: !binary |-
    MjAxMy0wMS0yMSAwNDozMjo0OCAtMDUwMA==
  content: Thanks a lot man!  I had the exact same problem coming from an ubuntu edited
    version of my gemfile to working on a mac.
---
![](/uploads/2012/03/wtf_is_going_on.png "wtf_is_going_on")
This might not be your issue.  I had a really weird problem that was ungoogleable so I thought I'd post it.

With a combination of spork, guard and rspec, none of my testing stuff was working.  The spork prefork block was throwing this error.
`
Using RSpec
Preloading Rails environment
undefined method `gsub' for nil:NilClass (NoMethodError)
`

The solution was to comment all my test gems one at a time.  And then I realized that my Ubuntu edited version of my Gemfile was conflicting with my Mac edited version of this same file.

So I made my Gemfile a little smarter.

{% highlight ruby %}
group :test do
  gem 'rspec'
  gem 'rspec-rails'
  gem 'spork'
  #
  gem 'rb-inotify' if RUBY_PLATFORM.downcase.include?("linux")
  gem 'rb-fsevent' if RUBY_PLATFORM.downcase.include?("darwin")
  gem 'guard'
  gem 'guard-rspec'
  gem 'guard-spork'
end
{% endhighlight %}

Then things started to work again.  With any weird bugs in Rails, try commenting out gems one at a time.