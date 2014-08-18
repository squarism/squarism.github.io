---
layout: post
status: publish
published: true
title: Making Rails Development on Windows Not Suck
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1615
wordpress_url: http://squarism.com/?p=1615
date: !binary |-
  MjAxMi0wOS0yMiAxODowNDo1NyAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wOS0yMiAyMzowNDo1NyAtMDQwMA==
categories:
- Ruby
tags: []
comments:
- id: 7573
  author: r
  author_email: r_stonehouse@yahoo.com
  author_url: ''
  date: !binary |-
    MjAxMy0wNC0wNiAxNDozNzowNiAtMDQwMA==
  date_gmt: !binary |-
    MjAxMy0wNC0wNiAxOTozNzowNiAtMDQwMA==
  content: Try using Virtualbox and Vagrant.  Setup a samba share and everything works
    great.
---
<p><img src="/uploads/2012/09/ruby_on_windows-300x300.png" alt="" title="ruby_on_windows" width="300" height="300" class="alignright size-medium wp-image-1717" />
One of these strategies will probably work for you.</p>
<p>I have a Windows 7 box.  Normally I dev on Mac (not perfect but sucks less).  I had built a Linux VM (ubuntu) but wanted to share my projects from the VM to windows to use sublime text 2.  Editing through the shell is ok but I wanted a full text editor instead of vi (which I haven't gotten my speed up on).  So I normally watch my files for changes with Guard as previously blogged.</p>
<p>So I share out my ~/projects directory through VMWare to Windows.  Great!  Now I can have all the unix tools in the VM and a GUI editor without doing the console screen painting through VMWare. The problem is, libevent doesn't trigger through the shared folder feature of VMware.  I have no idea why.</p>
<p>So I pivoted.  I tried the windows rails installer.  Even though it tries to pre-patch mingw32 right before the native gem install, it didn't work well with native libs like nokogiri (just to name one).</p>
<p>So I tried cygwin and apt-cyg (apt-get for Cygwin, nice, sorta).  It didn't work well with compiling ruby even after googling flags and installing gcc.  Was getting "could not find C compiler".</p>
<p>So this journey continues.  I installed the latest version of VMware workstation on Windows, going to try shared directory again with new vmware version and ubuntu 12.04.  Maybe there will be some magic in the upgrades.  I doubt it but I will try.</p>
<p>I could also try my <a href="http://squarism.com/2012/09/15/a-different-repl-workflow-in-ruby/">inline rspec</a> trick even though that still uses libevent for triggering the test execution.</p>
<p>If you have no idea what I'm talking about but am curious, leave a comment and I'll make a video or follow-up.</p>
