---
layout: post
status: publish
published: true
title: Boom Threads
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 91
wordpress_url: http://squarism.com/?p=91
date: !binary |-
  MjAwOS0wMy0xMCAyMjoyODoyMyAtMDQwMA==
date_gmt: !binary |-
  MjAwOS0wMy0xMSAwMzoyODoyMyAtMDQwMA==
categories:
- GameDev
- Processing
tags: []
comments: []
---
<p><img src="/uploads/2009/03/boomthreads_sshot-580x297.png" alt="boomthreads_sshot" title="boomthreads_sshot" width="580" height="297" class="aligncenter size-large wp-image-98" />
I was messing around with threaded drawing.  I really don't know how much of an advantage this gives.  I needed to figure out a way to animate something on the side for performance gains.  I think this is how I'd do it (not with 78 threads running).</p>
<p>I did see a ton of threads created though.  You can see below out of Activity Monitor.  Each of the boxes displayed is a thread that draws itself.  They all maintain elapsed which might be a design flaw.  I couldn't figure out a way to sync the drawing to all the threads running by themselves.
<img src="/uploads/2009/03/boomthreads_threads.png" alt="boomthreads_threads" title="boomthreads_threads" width="434" height="34" class="aligncenter size-full wp-image-100" /></p>
<p>Animation is done with timeElapsed in mind.  That's so it runs about the same on fast and slow computers.</p>
<p>Hit the link here to check it out: <a href="/files/BoomThreads/">BoomThreads</a></p>
<p><strong>UPDATE: I was thinking about this and this is not actually accomplishing any threaded performance gains.  It sequentially calls draw which doesn't thread the drawing itself.  I need to take out the random waits and have it look like this.  Right now, there is artifical randomness (which is why all the boxes move at different speeds).  I'll update this soon if drawing can be threaded.</strong></p>
