---
layout: post
status: publish
published: true
title: Growl Network Notifications Not Working
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 349
wordpress_url: http://squarism.com/?p=349
date: !binary |-
  MjAxMC0wMi0yNyAyMToxMzo1MyAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0wMi0yOCAwMjoxMzo1MyAtMDUwMA==
categories:
- Mac
tags: []
comments: []
---
Growl's network notifications weren't working.  Either sending or receiving.  I had two machines that had growl cleanly installed and my main machine that's had many versions installed over the years.  It was my main box with a dirty growl history that was having problems.

I found a post on [cocoaforge](http://forums.cocoaforge.com/viewtopic.php?f=6&t=15109) that helped a lot.  First, I ran the uninstall applescript (I always keep uninstallers in ~/Uninstallers but you can find it in the Growl.dmg).  That didn't really work, it gave me an Apple Script time out.  So I removed everything manually.  I deleted the pref pane from SysPrefs by right-clicking on Growl and selecting remove.

![growl_remove](/uploads/2010/02/growl_remove.png "growl_remove")

After that was done I removed the preferences file from ~/Library/Preferences and also a folder under ~/Library/Application Support called Growl (has two subfolders called Tickets and Plugins).  I emptied trash.  Reinstalled Growl 1.2 (latest).  I didn't restart.  I re-setup the network bit of Growl on this page:

![growl_network](/uploads/2010/02/growl_network.png "growl_network")

Notifications started working.  Now all my boxes are notified when something cool happens.  Weee!