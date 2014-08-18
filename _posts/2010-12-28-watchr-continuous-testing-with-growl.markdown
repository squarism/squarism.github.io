---
layout: post
status: publish
published: true
title: Watchr Continuous Testing with Growl
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 860
wordpress_url: http://squarism.com/?p=860
date: !binary |-
  MjAxMC0xMi0yOCAxODo0NTowOSAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0yOCAyMzo0NTowOSAtMDUwMA==
categories:
- Ruby
tags: []
comments:
- id: 5520
  author: Freddy
  author_email: Fred@gmx.de
  author_url: ''
  date: !binary |-
    MjAxMS0wMy0wOSAxMzowOTo0MiAtMDUwMA==
  date_gmt: !binary |-
    MjAxMS0wMy0wOSAxODowOTo0MiAtMDUwMA==
  content: ! "Great post, helped me a lot !\r\nTo get this finally working with my
    Windows XP, growl for Windows and RSPEC with Rails 3.0, i had to do some adjustments.
    I also switched title and message, so that the actual result is shown bigger in
    growl.\r\n\r\nCheers\r\n\r\ndef growl(title)\r\n  growlnotify = `growlnotify.exe`\r\n
    \ message = \"\\\"Watchr Test Results\\\"\"\r\n  passed = title.include?(' 0 failures')
    if title\r\n  image = passed ? \"C:/Users/Starter/watchr_images/passed.png\"
    : \"C:/Users/Starter/watchr_images/failed.png\"\r\n  severity
    = passed ? \"-1\" : \"1\"\r\n  options = \"/ai:#{image} /p:#{severity}\"
    \ \r\n  output = \" #{message} #{options} /t:\\\"(#{title})\\\"\"\r\n  #puts
    \ (\"\\n\\n **\" + output)\r\n  system(\"growlnotify #{output}\")\r\n  #system
    (\"growlnotify #{options}\")\r\nend\r\n\r\n\r\ndef runcmd(cmd)\r\n  puts(cmd)\r\n
    \ `#{cmd}`\r\nend\r\n\r\ndef run(files_to_run)\r\n  system('cls')\r\n  #puts(\"Running:
    #{files_to_run}\")\r\n  rawtext = runcmd(%Q(bundle exec rspec -c #{files_to_run}))\r\n
    \ results = rawtext.split(\"\\n\").fetch(-2) rescue nil\r\n  puts rawtext\r\n
    \ #puts \"-------------\\n\" + results + \"\\n-------------\"\r\n  growl results\r\n
    \ no_int_for_you\r\nend"
- id: 5531
  author: Dillon
  author_email: dillon@squarism.com
  author_url: http://
  date: !binary |-
    MjAxMS0wMy0wOSAxNDo1MTo0NCAtMDUwMA==
  date_gmt: !binary |-
    MjAxMS0wMy0wOSAxOTo1MTo0NCAtMDUwMA==
  content: Cool!  Thanks for the follow-up.
---
<p>An improvement to <a href="http://squarism.com/2010/05/23/watchr-unit-tests-growl-doomguy/">the post I did</a> about the doom faces for growl status and watchr config with ruby testing.  This improvement will give you a pass screen that is a bit easier to read because it will have a slight green or red tint to it.
<img src="/uploads/2010/12/watchr_improved_pass-580x67.png" alt="" title="watchr_improved_pass" width="580" height="67" class="aligncenter size-large wp-image-863" />
<img src="/uploads/2010/12/watchr_improved_fail-580x66.png" alt="" title="watchr_improved_fail" width="580" height="66" class="aligncenter size-large wp-image-861" /></p>
<p>First, it requires a bit of Growl set up.  You just need to change the severity colors from all black to look like this.  You can keep the normal level as black and hopefully this will keep your normal growl messages from other programs as normal black.
<img src="/uploads/2010/12/watchr_improved_growl_setup.png" alt="" title="watchr_improved_growl_setup" width="748" height="629" class="aligncenter size-full wp-image-862" />
Note that the high severity color in that screenshot is a really dark red.  This is important to get that slight red tint from the dead doomguy shot above.</p>
<p>This also requires and new and improved <a href="http://squarism.com/files/combo_guesser/watchr.rb">watchr.rb file</a> to go along with it.</p>
{% highlight ruby %}
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
{% endhighlight %}</p>
<h2>Optional Bit</h2><p>
My previous post was inside a rails project, which is fine and good until you want to write a command-line ruby program or something outside of rails.  First, you'll need some tests and then you'll need a Rakefile that invokes your tests.  I have an example project <a href="http://squarism.com/files/combo_guesser/">here</a>.  There's also a zip archive <a href="http://squarism.com/files/combo_guesser.zip">here</a>. It's a non-rails app with a rake file that you can run for testing:
<code>combo-guesser$ rake
(in ./combo_guesser)
/bin/ruby ./test/combo_guesser_test.rb
Loaded suite ./test/combo_guesser_test
Started
.
Finished in 0.000755 seconds.</p>
<p>1 tests, 10 assertions, 0 failures, 0 errors, 0 skips
</code></p>
<p>All this makes for a really fast testing feedback loop.</p>
