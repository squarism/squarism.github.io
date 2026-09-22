---
title: "A Spork nil:NilClass fix"
description: "Blog post about a spork nil:nilclass fix"
date: 2012-03-09T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![](/uploads/2012/03/wtf_is_going_on.png "wtf_is_going_on")
This might not be your issue.  I had a really weird problem that was ungoogleable so I thought I'd post it.

With a combination of spork, guard and rspec, none of my testing stuff was working.  The spork prefork block was throwing this error.
```text
Using RSpec
Preloading Rails environment
undefined method `gsub' for nil:NilClass (NoMethodError)
```

The solution was to comment all my test gems one at a time.  And then I realized that my Ubuntu edited version of my Gemfile was conflicting with my Mac edited version of this same file.

So I made my Gemfile a little smarter.

```ruby
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
```

Then things started to work again.  With any weird bugs in Rails, try commenting out gems one at a time.
