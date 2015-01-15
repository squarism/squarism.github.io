---
layout: post
status: publish
published: true
title: Gnome-terminal cpu utilization fixed
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 49
wordpress_url: http://squarism.com/2004/10/25/gnome-terminal-cpu-utilization-fixed/
date: !binary |-
  MjAwNC0xMC0yNSAxMToyMDoxNCAtMDQwMA==
date_gmt: !binary |-
  MjAwNC0xMC0yNSAxNjoyMDoxNCAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
All of a sudden, gnome-terminal on Fedora core 2 was acting really strange.  It was slow to open, slow to type, slow to close.  Found a [bug doc](http://bugzilla.redhat.com/bugzilla/show_bug.cgi?id=87779) on redhat's site although it was an older distro.

Eh, it's worth a shot.  Searched for the rpm on [rpmfind.net](http://www.rpmfind.net/linux/rpm2html/search.php?query=vte&amp;submit=Search+...).

Fedora ships with `vte-0.11.10-5.1`.  So I upgraded vte with `[root@fedora2 root]# rpm -Uvh [URL from rpmfind.net` just like usual.  The upgrade completed and immediately afterwards, gnome-terminal opened quickly again.  I surprised that I didn't have to restart X or log out of Gnome etc.  Whatever was broken must have not been cached or in memory.

I guess I'm used to network type services like bind where you edit _something _and restart _something _and then the _something _works again.  :)