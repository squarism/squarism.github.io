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
<p><img src="/uploads/2010/05/doomguy_passed-580x150.jpg" alt="" title="doomguy_passed" width="580" height="150" class="aligncenter size-large wp-image-496" />
I read <a href="http://szeryf.wordpress.com/2007/07/30/way-beyond-cool-autotest-growl-doomguy/">this post about setting up autotest with growl</a>.  The little doomguy was a nice effect and got a literal lol out of me (llol?).  However, the post was from 2007 and apparently autotest has some problems with 1.9.  I'm not running 1.9 but on the eve of rails3, I probably will be.  Ok, <a href="http://www.google.com/search?hl=en&source=hp&q=%22better+than+autotest%22&aq=f&aqi=&aql=f&oq=&gs_rfai=">what's cooler than autotest</a>?  Apparently not much, three hits on google.</p>
<p><strong>Install a gem</strong>
I found <a href="http://github.com/mynyml/watchr">Watchr</a>.  It's not too hard to set up.  <code>sudo gem install watchr</code> to get the gem.  If you're on *nix, grab the filesystem event gem: <code>sudo gem install rev</code>.  Now we have watchr up but we need a config.</p>
<p><strong>Create the watchr config</strong>
The docs tell you to edit a config/watchr.rb file.  Mine came from <a href="http://wiki.github.com/mynyml/watchr/prepackaged-scripts">the examples on their wiki</a>.  It worked out of the box.  It's posted <a href="http://squarism.com/files/watchr_doom/watchr.rb">here</a>.  It's a basic rails testing config that I haven't had to edit.  It's very readable if you need to futz with it.</p>
<p><strong>Create a test case</strong>
Ok so watchr just runs `rake test` which you can do in your rails app root.  But perhaps you don't have any test cases created.  The generators will create them for you.  But assuming you don't have one, create a file named [rails app root]/test/functional/hello_test.rb.</p>
{% highlight ruby %}
require 'test_helper'</p>
<p>class HelloTest < ActiveSupport::TestCase
  def test_hello
    s = "Hello"
    assert_equal("Hello", s)
  end</p>
<p>end
{% endhighlight %}
</p>

<p>Obviously this is a crappy assertion.</p>
<p><strong>Get Growlnotify</strong>
Obviously, you'll need growl installed.  But you also need the growlnotify binary.  It's good to have anyway (I use it in Automator).  I didn't have it by default on two of my machines so I assume that the normal Growl install doesn't install it.  It's on the Growl 1.2 dmg under extras.  You just have to copy it to /usr/local/bin.  Download the <a href="http://growl.info/">growl dmg</a>, open the dmg.  You don't need to reinstall growl.
<code>sudo cp /Volumes/Growl-1.2/Extras/growlnotify/growlnotify /usr/local/bin</code></p>
<p>You can test it with:
<code>growlnotify -t "Title" -m "Message"</code></p>
<p><strong>Make doomguy happen</strong>
Create a directory for the growl icons: <code>mkdir ~/.watchr_images</code>.
Copy <a href="http://squarism.com/files/watchr_doom/failed.png">these</a> <a href="http://squarism.com/files/watchr_doom/passed.png">two</a> doomguy faces to ~/.watchr_images/.  On mac, hit Shift+Cmd+G and go to the hidden folder.
<img src="/uploads/2010/05/doomguy_go.png" alt="" title="doomguy_go" width="433" height="127" class="aligncenter size-full wp-image-490" /></p>
<p>Now we should have two pngs in our hidden folder.
<img src="/uploads/2010/05/doomguy_pngs.png" alt="" title="doomguy_pngs" width="217" height="141" class="aligncenter size-full wp-image-491" /></p>
<p>The watchr.rb file references these images.  If you want to put it somewhere else (like maybe under ~/Pictures), you can change the .rb.</p>
<p><strong>Ok Go!</strong>
Launch with: watchr config/watchr.rb from your rails app root.  Watchr should be in your $PATH because you installed the gem.  You should have a blank screen now where watchr is waiting.</p>
<p>When you save a file, watchr will fire.  Depending on the file you saved, a different test will run.  If you save a controller, for example, the functional test for that controller will fire.  If you save a model object, a unit test for that model object will fire.  If you want to force a whole test suite to run hit Ctrl+\ in the watchr window.</p>
<p>When things pass:
<img src="/uploads/2010/05/watchr_growl_overlay.png" alt="" title="watchr_growl_overlay" width="326" height="81" class="aligncenter size-full wp-image-492" /></p>
<p>When things fail:
<img src="/uploads/2010/05/watchr_growl_overlay_fail.png" alt="" title="watchr_growl_overlay_fail" width="325" height="100" class="aligncenter size-full wp-image-493" /></p>
<p>The growl display setting is "Music Video".  I have it popping up on my 3rd monitor which is less distracting but still visible.  However if you put it on your main monitor, the overlay won't interfere with mouse clicks, which is nice.  It makes for a killer setup where I don't have to test my app with a browser or with contrived/non-automated tests.  Now I just need to write more tests.</p>
