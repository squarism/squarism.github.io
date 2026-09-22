---
title: "Watchr Continuous Testing with Growl"
description: "An improvement to the post I did about the doom faces for growl status and watchr config with ruby testing. This version tints the pass screen green and the fail screen red."
date: 2010-12-28T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

An improvement to [the post I did](/posts/watchr-unit-tests-growl-doomguy/) about the doom faces for growl status and watchr config with ruby testing.  This improvement will give you a pass screen that is a bit easier to read because it will have a slight green or red tint to it.
![](/uploads/2010/12/watchr_improved_pass.png "watchr_improved_pass")
![](/uploads/2010/12/watchr_improved_fail.png "watchr_improved_fail")

First, it requires a bit of Growl set up.  You just need to change the severity colors from all black to look like this.  You can keep the normal level as black and hopefully this will keep your normal growl messages from other programs as normal black.
![](/uploads/2010/12/watchr_improved_growl_setup.png "watchr_improved_growl_setup")
Note that the high severity color in that screenshot is a really dark red.  This is important to get that slight red tint from the dead doomguy shot above.

This also requires and new and improved [watchr.rb file](http://squarism.com/files/combo_guesser/watchr.rb) to go along with it.

```ruby
def growl(message)
  growlnotify = `which growlnotify`.chomp
  title = "Watchr Test Results"
  passed = message.include?('0 failures, 0 errors')
  image = passed ? "~/.watchr_images/passed.png" : "~/.watchr_images/failed.png"
  severity = passed ? "-1" : "1"
  options = "-w -n Watchr --image '#{File.expand_path(image)}'"
  options << " -m '#{message}' '#{title}' -p #{severity}"
  system %(#{growlnotify} #{options} &)
end
```
## Optional Bit

My previous post was inside a rails project, which is fine and good until you want to write a command-line ruby program or something outside of rails.  First, you'll need some tests and then you'll need a Rakefile that invokes your tests.  I have an example project [here](http://squarism.com/files/combo_guesser/).  There's also a zip archive [here](http://squarism.com/files/combo_guesser.zip). It's a non-rails app with a rake file that you can run for testing:
```bash
combo-guesser$ rake
(in ./combo_guesser)
/bin/ruby ./test/combo_guesser_test.rb
Loaded suite ./test/combo_guesser_test
Started
.
Finished in 0.000755 seconds.

1 tests, 10 assertions, 0 failures, 0 errors, 0 skips
```

All this makes for a really fast testing feedback loop.
