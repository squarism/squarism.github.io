---
layout: post
status: publish
published: true
title: RMagic, ImageMagick, Snow Leopard and Ruby 1.9
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 381
wordpress_url: http://squarism.com/?p=381
date: !binary |-
  MjAxMC0wMy0wOCAyMjozMjoyOCAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0wMy0wOSAwMzozMjoyOCAtMDUwMA==
categories:
- Ruby
- Mac
tags: []
comments: []
---
<p>I ran into a problem that kept me busy over the weekend.  It seems that rmagick (which is requires for <a href="http://nubyonrails.com/pages/sparklines">the awesome sparklines project</a> will compile and run on Snow Leopard, however it has a critical bug when trying to use it.  The script/server process will crash with a "Trace/BPT trap" error.  The logs won't say anything and the hell if anything is going to appear on the browser.  WTF.</p>
<p>Here's my stack on my Mac: (do not use this stack, this is just for informational purposes only)</p>
<ul>
<li>ruby19 installed via macports: sudo install ruby19</li>
<li>regular rubygems installed</li>
<li>ImageMagick 6.6.0-0 installed via macports</li>
<li>A bunch of github gems installed but not firing on the controller method that crashes</li>
</ul></p>
<p>So I started over on a CentOS 5.4 VM just to try out my stack and it worked.  Except, I used ruby 1.8.7 compiled via source.  It's a really lengthy process and it'll be part of my README if I ever get this project done.  On CentOS you have to compile and install ImageMagick yourself because yum has a really old version.  There's a ton of devel dependencies too.  If anyone needs the instructions, leave a comment and I'll copy/paste from my README.</p>
<p>So I suspected that ruby 1.9 was causing problems my mac laptop and that turned out to be true.  I did a <code>sudo port uninstall ruby19</code> and then a <code>sudo port install ruby</code>.  I had to reinstall all the gems again but it wasn't too bad.  If port gives you a ln error, just exit your shell and open a new one.</p>
<p>So RMagick, ImageMagick and ruby 1.9 do not play together.</p>
