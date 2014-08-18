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
<p>All of a sudden, gnome-terminal on Fedora core 2 was acting really strange.  It was slow to open, slow to type, slow to close.  Found a <a href="http://bugzilla.redhat.com/bugzilla/show_bug.cgi?id=87779">bug doc</a> on redhat's site although it was an older distro.</p>
<p>Eh, it's worth a shot.  Searched for the rpm on <a href="http://www.rpmfind.net/linux/rpm2html/search.php?query=vte&amp;submit=Search+...">rpmfind.net</a>.  </p>
<p>Fedora ships with <code>vte-0.11.10-5.1</code>.  So I upgraded vte with <code>[root@fedora2 root]# rpm -Uvh [URL from rpmfind.net</code> just like usual.  The upgrade completed and immediately afterwards, gnome-terminal opened quickly again.  I surprised that I didn't have to restart X or log out of Gnome etc.  Whatever was broken must have not been cached or in memory.</p>
<p>I guess I'm used to network type services like bind where you edit <em>something </em>and restart <em>something </em>and then the <em>something </em>works again.  :)</p>
