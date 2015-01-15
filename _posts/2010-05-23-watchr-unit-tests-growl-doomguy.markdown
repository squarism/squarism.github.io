---
layout: post
status: publish
published: true
title: Watchr Unit Tests + Growl + Doomguy
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 489
wordpress_url: http://squarism.com/?p=489
date: !binary |-
  MjAxMC0wNS0yMyAxMTo1NzowNiAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wNS0yMyAxNjo1NzowNiAtMDQwMA==
categories:
- Rails
tags: []
comments: []
---
![](/uploads/2010/05/doomguy_passed-580x150.jpg "doomguy_passed")
I read [this post about setting up autotest with growl](http://szeryf.wordpress.com/2007/07/30/way-beyond-cool-autotest-growl-doomguy/).  The little doomguy was a nice effect and got a literal lol out of me (llol?).  However, the post was from 2007 and apparently autotest has some problems with 1.9.  I'm not running 1.9 but on the eve of rails3, I probably will be.  Ok, [what's cooler than autotest](http://www.google.com/search?hl=en&source=hp&q=%22better+than+autotest%22&aq=f&aqi=&aql=f&oq=&gs_rfai=)?  Apparently not much, three hits on google.

**Install a gem**
I found [Watchr](http://github.com/mynyml/watchr).  It's not too hard to set up.  `sudo gem install watchr` to get the gem.  If you're on *nix, grab the filesystem event gem: `sudo gem install rev`.  Now we have watchr up but we need a config.

**Create the watchr config**
The docs tell you to edit a config/watchr.rb file.  Mine came from [the examples on their wiki](http://wiki.github.com/mynyml/watchr/prepackaged-scripts).  It worked out of the box.  It's posted [here](http://squarism.com/files/watchr_doom/watchr.rb).  It's a basic rails testing config that I haven't had to edit.  It's very readable if you need to futz with it.

**Create a test case**
Ok so watchr just runs `rake test` which you can do in your rails app root.  But perhaps you don't have any test cases created.  The generators will create them for you.  But assuming you don't have one, create a file named [rails app root]/test/functional/hello_test.rb.

{% highlight ruby %}
require 'test_helper'</p>

class HelloTest < ActiveSupport::TestCase
  def test_hello
    s = "Hello"
    assert_equal("Hello", s)
  end

end
{% endhighlight %}

Obviously this is a crappy assertion.

**Get Growlnotify**
Obviously, you'll need growl installed.  But you also need the growlnotify binary.  It's good to have anyway (I use it in Automator).  I didn't have it by default on two of my machines so I assume that the normal Growl install doesn't install it.  It's on the Growl 1.2 dmg under extras.  You just have to copy it to /usr/local/bin.  Download the [growl dmg](http://growl.info/), open the dmg.  You don't need to reinstall growl.
`sudo cp /Volumes/Growl-1.2/Extras/growlnotify/growlnotify /usr/local/bin`

You can test it with:
`growlnotify -t "Title" -m "Message"`

**Make doomguy happen**
Create a directory for the growl icons: `mkdir ~/.watchr_images`.
Copy [these](http://squarism.com/files/watchr_doom/failed.png) [two](http://squarism.com/files/watchr_doom/passed.png) doomguy faces to ~/.watchr_images/.  On mac, hit Shift+Cmd+G and go to the hidden folder.
![](/uploads/2010/05/doomguy_go.png "doomguy_go")

Now we should have two pngs in our hidden folder.
![](/uploads/2010/05/doomguy_pngs.png "doomguy_pngs")

The watchr.rb file references these images.  If you want to put it somewhere else (like maybe under ~/Pictures), you can change the .rb.

**Ok Go!**
Launch with: watchr config/watchr.rb from your rails app root.  Watchr should be in your $PATH because you installed the gem.  You should have a blank screen now where watchr is waiting.

When you save a file, watchr will fire.  Depending on the file you saved, a different test will run.  If you save a controller, for example, the functional test for that controller will fire.  If you save a model object, a unit test for that model object will fire.  If you want to force a whole test suite to run hit Ctrl+\ in the watchr window.

When things pass:
![](/uploads/2010/05/watchr_growl_overlay.png "watchr_growl_overlay")

When things fail:
![](/uploads/2010/05/watchr_growl_overlay_fail.png "watchr_growl_overlay_fail")

The growl display setting is "Music Video".  I have it popping up on my 3rd monitor which is less distracting but still visible.  However if you put it on your main monitor, the overlay won't interfere with mouse clicks, which is nice.  It makes for a killer setup where I don't have to test my app with a browser or with contrived/non-automated tests.  Now I just need to write more tests.