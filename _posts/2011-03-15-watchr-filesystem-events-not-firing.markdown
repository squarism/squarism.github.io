---
layout: post
status: publish
published: true
title: Watchr filesystem events not firing
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1068
wordpress_url: http://squarism.com/?p=1068
date: !binary |-
  MjAxMS0wMy0xNSAyMjozMDowNSAtMDQwMA==
date_gmt: !binary |-
  MjAxMS0wMy0xNiAwMzozMDowNSAtMDQwMA==
categories:
- Ruby
- Mac
tags: []
comments: []
---
I wanted to use a ruby environment inside a Ubuntu VM but still be able to edit text files in Textmate.  So I shared out my project folder and fired up[ a watchr script I made](https://gist.github.com/821247).  Unfortunately, it didn't work at all.

I tried a few different libs, including rev, rb-inotify, rb-fsevents (which turned out to be mac only) but nothing was firing when I'd save a file.  I thought maybe rev or watchr was broken in 1.9 but that was not the case.  The problem is the vmware shared folders.  When you do a write, modify or whatever, it doesn't fire the same hooks as a local event does:
`
Modify File -> Textmate Save -> project/foo.txt  (does not fire in watchr)
Modify File -> Vi Save in VM -> project/foo.txt (watchr fires)
`

And it wasn't just watchr (as I said), every ruby library was seeing the same thing.  So I gave up on the shared folders through VMware and just installed netatalk.

`sudo aptitude install netatalk`

I can edit files in Textmate this way and watchr works as expected.  So why is this important?  Because a tight [REPL](http://en.wikipedia.org/wiki/Read-eval-print_loop) is important.  And watchr / wtchr makes the tight loop happen.  This is also probably going to happen if you use autotest in a project with lib/* test/* too.

Pretty specific but I hope it helps someone.