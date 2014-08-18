---
layout: post
status: publish
published: true
title: Pictures of iPod under Linux
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 31
wordpress_url: http://squarism.com/2003/12/28/pictures-of-ipod-under-linux/
date: !binary |-
  MjAwMy0xMi0yOCAwMDowMToyMyAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0xMi0yOCAwNTowMToyMyAtMDUwMA==
categories:
- Unix
tags: []
comments:
- id: 7
  author: joe
  author_email: dfsdfdsf@yahoo.com
  author_url: ''
  date: !binary |-
    MjAwNC0wNC0xMyAyMzo0MzowMyAtMDQwMA==
  date_gmt: !binary |-
    MjAwNC0wNC0xNCAwMzo0MzowMyAtMDQwMA==
  content: i love your story. i read it every night before i go to bed
- id: 8
  author: Chris
  author_email: ''
  author_url: ''
  date: !binary |-
    MjAwNC0wNC0xNSAxNDo1OToxOCAtMDQwMA==
  date_gmt: !binary |-
    MjAwNC0wNC0xNSAxODo1OToxOCAtMDQwMA==
  content: ! 'Well I appreciate the comments but I''m a bit scared.


    "I like your site.  It matches my gun.  I like bunnies.  HEHEHEHEHEHE.  Shoot
    you!  La-la-la-la!!"


    Ok fine, maybe you''re serious.

'
---
<p>Got an iPod for Xmas.  Santa deserves a Nobel Prize.</p>
<p>After admiring the packaging, manuals and the well designed manuals; I popped it into my USB slot and realized that I don't have a USB 2.0 slot.  Can't believe it.  So I'll have to order a new Motherboard.  This might seem drastic but a new MB will give me a Firewire port, AGP 8x and USB 2.0.  Firewire is good for compatibility with Apple products, AGP 8x is better than my 4x (Radeon 9800XT does 8x) and USB 2.0 is a lot faster.</p>
<p>But enough of that.  Here's a shot of Gnome 2.4 (comes with Fedora Core 1).  I did recompile the kernel to support USB mass storage (not sure if it's on by default).  As you can see the last icon is the Trash icon.  Watch carefully:
<a href="http://www.squarism.com/archives/ipod-Linux1.html">Before mounting</a></p>
<p>Now I mount the appropriate SCSI device (USB mass storage makes it a SCSI device - check your logs for clues as to which one) and automounter has already made a mount point for me.  I didn't even create /mnt/ipod (ipod is the volume name on the iPod itself):
<a href="http://www.squarism.com/archives/ipod-Linux2.html">After mounting</a></p>
<p>So then the little icon labeled "ipod" appears.  Looks good, open it and see the volume.  Drag and drop files, umount and get on the train.  Nice Apple.  Smart design.
<a href="http://www.squarism.com/archives/ipod-Linux3.html">Nautilus looking at the iPod</a></p>
