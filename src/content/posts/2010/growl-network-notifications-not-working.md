---
title: "Growl Network Notifications Not Working"
description: "Growl's network notifications weren't working. Either sending or receiving. I had two machines that had growl cleanly installed and my main machine..."
date: 2010-02-27T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Growl's network notifications weren't working. Either sending or receiving. I had two machines that had growl cleanly installed and my main machine that's had many versions installed over the years. It was my main box with a dirty growl history that was having problems.

I found a post on [cocoaforge](http://forums.cocoaforge.com/viewtopic.php?f=6&t=15109) that helped a lot. First, I ran the uninstall applescript (I always keep uninstallers in ~/Uninstallers but you can find it in the Growl.dmg). That didn't really work, it gave me an Apple Script time out. So I removed everything manually. I deleted the pref pane from SysPrefs by right-clicking on Growl and selecting remove.

![growl_remove](/uploads/2010/02/growl_remove.png "growl_remove")

After that was done I removed the preferences file from ~/Library/Preferences and also a folder under ~/Library/Application Support called Growl (has two subfolders called Tickets and Plugins). I emptied trash. Reinstalled Growl 1.2 (latest). I didn't restart. I re-setup the network bit of Growl on this page:

![growl_network](/uploads/2010/02/growl_network.png "growl_network")

Notifications started working. Now all my boxes are notified when something cool happens. Weee!
