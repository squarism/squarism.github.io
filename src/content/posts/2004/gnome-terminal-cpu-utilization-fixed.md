---
title: "Gnome-terminal cpu utilization fixed"
description: "All of a sudden, gnome-terminal on Fedora core 2 was acting really strange. It was slow to open, slow to type, slow to close. Found a bug dochttp:/"
date: 2004-10-25T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

All of a sudden, gnome-terminal on Fedora core 2 was acting really strange.  It was slow to open, slow to type, slow to close.  Found a [bug doc](http://bugzilla.redhat.com/bugzilla/show_bug.cgi?id=87779) on redhat's site although it was an older distro.

Eh, it's worth a shot.  Searched for the rpm on [rpmfind.net](http://www.rpmfind.net/linux/rpm2html/search.php?query=vte&submit=Search+...).

Fedora ships with `vte-0.11.10-5.1`.  So I upgraded vte with `[root@fedora2 root]# rpm -Uvh [URL from rpmfind.net` just like usual.  The upgrade completed and immediately afterwards, gnome-terminal opened quickly again.  I surprised that I didn't have to restart X or log out of Gnome etc.  Whatever was broken must have not been cached or in memory.

I guess I'm used to network type services like bind where you edit _something _and restart _something _and then the _something _works again.  :)
