---
layout: post
status: publish
published: true
title: Replace Guard with Autotest if using Minitest
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1631
wordpress_url: http://squarism.com/?p=1631
date: !binary |-
  MjAxMi0wOS0xMiAyMzoyMDo1MiAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wOS0xMyAwNDoyMDo1MiAtMDQwMA==
categories:
- Rails
tags: []
comments: []
---
![](/uploads/2012/09/spork.png "spork")
I love Guard.  I've posted about it and used it a lot.  But it's got some problems right now with all the downstream gems and addons that I like.

Of course, a more elegant solution is to not pre-fork and use Gary Bernhardt's (and others') advice of extracting domain objects from rails and [running tests](https://www.destroyallsoftware.com/screencasts/catalog/extracting-domain-objects) over that.  This is fine within plain old ruby objects but sometimes you need to load rake or factory_girl and that requires rails.  So let's assume you can't isolate your tests into lib/ or extras/ and you need fast tests while loading your entire Rails environment.  That's where Guard and Autotest come in.

The newest Guard installs Listen which doesn't work.  So I had to back down a version of listen.  Added gem 'listen', '0.4.7' to my Gemfile to get rid of polling warning.  0.5.0 is latest but it has a problem right now (bug opened 2 days ago as of today, grr).  All that is unrelated to the real problem.

Spork-minitest [doesn't work with guard](https://github.com/semaperepelitsa/spork-minitest/issues/2).  The issue is that spork-minitest doesn't support any options like -r or -e that the guard is passing.

So let's switch to autotest.  But first, let's look at my current configuration and I'll show you what I had to change.  This is what my Guardfile looked like with Guard on a Rails project:

{% highlight ruby %}
guard 'spork' do
  watch('config/application.rb')
  watch('config/environment.rb')
  watch(%r{^config/environments/.+\\.rb$})
  watch(%r{^config/initializers/.+\\.rb$})
  watch('Gemfile')
  watch('Gemfile.lock')
  watch('test/test_helper.rb') { :minitest }
  watch(%r{features/support/}) { :cucumber }
end

guard 'minitest' do
  # with Minitest::Unit
  watch(%r|^test/(.*)\/(.*)_test\.rb|)
  watch(%r|^lib/(.*)\.rb|)     { |m| "test/unit/lib/#{m[1]}_test.rb" }
  watch(%r|^test/test_helper\.rb|)    { "test" }

  # Rails 3.2
  watch(%r|^app/controllers/(.*)\.rb|) { |m| "test/functional/#{m[1]}_test.rb" }
  watch(%r|^app/helpers/(.*)\.rb|)     { |m| "test/unit/helpers/#{m[1]}_test.rb" }
  watch(%r|^app/models/(.*)\.rb|)      { |m| "test/unit/models/#{m[1]}_test.rb" }
end
{% endhighlight %}

Delete that whole Guardfile and let's switch to autotest with spork and minitest.

This is what my Gemfile looked like with Guard:

{% highlight ruby %}
group :develop do
  # unrelated gems here.
  gem 'minitest'
  gem 'spork'
  gem 'rb-inotify' if RUBY_PLATFORM.downcase.include?("linux")
  gem 'rb-fsevent', "~> 0.9.0" if RUBY_PLATFORM.downcase.include?("darwin")
  gem 'guard'
  gem 'guard-spork'
  gem 'guard-minitest'
  gem 'spork-testunit'
end
{% endhighlight %}

This is what my Gemfile looks like when switched to Autotest:

{% highlight ruby %}
group :test, :develop do
  # unrelated gems here.

  # spork and autotest allow you to run tests when you save a file.
  # run `spork` in one terminal from the project root.
  # run `bundle exec autotest -cf` in one terminal from the project root.
  # Then edit test files or app/* or lib/* and watch tests run automatically on save.
  gem 'spork'   # Spork caches rails so tests run fast.
  gem 'autotest-standalone' # The file '.autotest' makes sure the tests are run via test server (spork).
  gem 'autotest-rails-pure' # -pure gives us autotest without ZenTest gem.
  gem 'autotest-growl'      # growl notifications, complains a little bit if growl isn't installed
  gem 'autotest-fsevent'    # react to filesystem events, save your CPU
  gem 'spork-minitest'
end
{% endhighlight %}

It works great!  As I said in the Gemfile comments:

*   Start `spork` in one terminal
*   Run `bundle exec autotest -cf` in another terminal

`
-c is for avoiding re-running rake test on red/green
-f is for fast start to avoid running rake test on startup
`

Save a file like products_controller_test.rb and watch it run.  Save the app/controllers/products_controller.rb and watch products_controller_test.rb run.

The only problem is that it reacts a little bit slow because of a 1 second default sleep in Autotest.  So this is my entire .autotest file which includes a hack to reduce that 1 second to 0 seconds.  No impact to CPU and it reacts as fast as Guard did.

{% highlight ruby %}
require 'autotest/fsevent'

class Autotest
  # run tests over drb server (spork)
  def make_test_cmd files_to_test
    if files_to_test.empty?
      "" # no tests to run
    else
      "testdrb #{files_to_test.keys.join(' ')}"
    end
  end
end

# tighten up the time before the test is run
ObjectSpace.each_object(Autotest).first.sleep = 0
{% endhighlight %}

I plan on doing a pull request to address this problem.  So watch for that.