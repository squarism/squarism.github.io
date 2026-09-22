---
title: "Fit-PC2 and Ubuntu 10.04"
description: "Blog post about fit-pc2 and ubuntu 10.04"
date: 2010-07-10T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![](/uploads/2010/07/fitpc2.jpg "fitpc2")

I had Ubuntu 9.04 running on my Fit-PC2 and I wanted to move up to 10.04. I ran: `sudo apt-get update; sudo apt-get dist-upgrade` and it chugged along doing the update. Install went fine and I was impressed that you can jump major revs like that.

Although there was one bit of weirdness: when I did the dist-upgrade I noticed that it was going to upgrade openoffice. I didn't want openoffice at all on there so I was going to remove it before it upgraded. So I hit Ctrl-C which promptly locked the whole box. I thought it was heat related and so I got an ice pack and wrapped the Fit in ice. I tried it again, Ctrl-C locks the box. Like, the whole box. Caps lock dead. Anyway, I've never seen that before. When I let the dist-upgrade go, it worked fine.

When it booted 10.04, my display was set to 1280x1024 and was running slow. It was running the vesa driver. So I downloaded the paulsbo driver for the GMA500 (the 'gpu' that the Fit-PC2 uses) and although the module built fine, it really screwed up everything. The screen would blank, X would be trying to start, there'd be video garbage doing all kinds of weird things.

So I wiped the whole thing and installed 9.10 and followed the 9.10 installation instructions on the Fit wiki. I installed the netbook-remix distro (i386) and the install instructions still work. Now I just need to get rid of the netbook-remix gui. Too bad they don't have desktop-switcher anymore.

Also, I was playing around with [Xmonad](http://xmonad.org/) which is interesting if not a bit understated. It reminds me of when I used Enlightenment back in 1999. The styles are different but the amount of config editing is the same.
