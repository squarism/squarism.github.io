---
layout: post
status: publish
published: true
title: Fit-PC2 and Ubuntu 10.04
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 619
wordpress_url: http://squarism.com/?p=619
date: !binary |-
  MjAxMC0wNy0xMCAwOTo1MTowMiAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wNy0xMCAxNDo1MTowMiAtMDQwMA==
categories:
- Blog
tags: []
comments:
- id: 2407
  author: AJenbo
  author_email: anders@jenbo.dk
  author_url: ''
  date: !binary |-
    MjAxMC0xMS0yMyAyMjoyNDoxMiAtMDUwMA==
  date_gmt: !binary |-
    MjAxMC0xMS0yNCAwMzoyNDoxMiAtMDUwMA==
  content: ! "sudo apt-get install ubuntu-desktop\r\nsudo apt-get remove netbook-launcher\r\n\r\nAlso
    you can pick desktop at the login screen just before you type the password."
- id: 2416
  author: Dillon
  author_email: dillon@squarism.com
  author_url: http://
  date: !binary |-
    MjAxMC0xMS0yNCAxNDo1NDoyNiAtMDUwMA==
  date_gmt: !binary |-
    MjAxMC0xMS0yNCAxOTo1NDoyNiAtMDUwMA==
  content: Hey thanks for the note.
- id: 7040
  author: nick
  author_email: flosspike@googlemail.com
  author_url: ''
  date: !binary |-
    MjAxMi0wNi0xNCAxNTo1MjozNSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wNi0xNCAyMDo1MjozNSAtMDQwMA==
  content: Hi, I upgraded to mint 9 but can't stand it, stupid mistake. I was running
    9.04 fine, it was stable. linux mint 9 is so jittery, media files that used to
    play dont, they judder, skip and get out of sync. Same video files just changed
    from ubuntu 9.04 to mint 9 due to the fact there was a new display driver.. Wish
    I could go back to 9.04 but the dist is no longer supported so can't install properly
    as per instructions. So crappy mint it is. why did they stop giving instructions
    at 9.04.? wished i never bought a fit2pc now.
---
<p><img src="/uploads/2010/07/fitpc2.jpg" alt="" title="fitpc2" width="620" height="382" class="aligncenter size-full wp-image-620" /></p>
<p>I had Ubuntu 9.04 running on my Fit-PC2 and I wanted to move up to 10.04.  I ran: <code>sudo apt-get update; sudo apt-get dist-upgrade</code> and it chugged along doing the update.  Install went fine and I was impressed that you can jump major revs like that.</p>
<p>Although there was one bit of weirdness: when I did the dist-upgrade I noticed that it was going to upgrade openoffice.  I didn't want openoffice at all on there so I was going to remove it before it upgraded.  So I hit Ctrl-C which promptly locked the whole box.  I thought it was heat related and so I got an ice pack and wrapped the Fit in ice.  I tried it again, Ctrl-C locks the box.  Like, the whole box.  Caps lock dead.  Anyway, I've never seen that before.  When I let the dist-upgrade go, it worked fine.</p>
<p>When it booted 10.04, my display was set to 1280x1024 and was running slow.  It was running the vesa driver.  So I downloaded the paulsbo driver for the GMA500 (the 'gpu' that the Fit-PC2 uses) and although the module built fine, it really screwed up everything.  The screen would blank, X would be trying to start, there'd be video garbage doing all kinds of weird things.</p>
<p>So I wiped the whole thing and installed 9.10 and followed the 9.10 installation instructions on the Fit wiki.  I installed the netbook-remix distro (i386) and the install instructions still work.  Now I just need to get rid of the netbook-remix gui.  Too bad they don't have desktop-switcher anymore.</p>
<p>Also, I was playing around with <a href="http://xmonad.org/">Xmonad</a> which is interesting if not a bit understated.  It reminds me of when I used Enlightenment back in 1999.  The styles are different but the amount of config editing is the same.</p>
