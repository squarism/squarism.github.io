---
layout: post
status: publish
published: true
title: Consumer Routers Suck
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1527
wordpress_url: http://squarism.com/?p=1527
date: !binary |-
  MjAxMi0wMi0yMCAxODozOTozMiAtMDUwMA==
date_gmt: !binary |-
  MjAxMi0wMi0yMCAyMzozOTozMiAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
<p>I can't buy a decent router.  This has been a decade long struggle and it's about time I wrote about it.  For a while I was doing network administration and Cisco stuff.  I got my CCNA certification and learned to build Linux routers.  I was knee-deep in firewalls, NAT and beginner network stuff.  It eventually lost my interest but that's another story.  At this same time, I was running a Linux router at home for my roommates and myself.  This is pre-WiFi so we ran 100mb ethernet all over the house and down the hallways.  It worked fine until a hard drive (IBM Deathstar) died in the Linux router.  I went through a series of hard drives in this box and it was kind of stupid because the OS really just needs to load up once and have some swap space (maybe).  So although the Linux router was free (with an old PC) and stable, the reliance on a spinning disk was a problem.</p>
<p>Years passed and I had switched to the consumer router/wifi/switch combo box.  It was the blue Linksys (pre-Cisco buyout) model.  At that time everyone had one; it was super popular.  My blue Linksys ran for a while but soon died mysteriously.  I bought the Linksys GL one that runs some flavor of Linux so I could load custom firmware on it.  This died so I switched to Dlink.  This one started freezing up.  At this point I was really frustrated because I had switched brands and strategies (custom firmware) and even moved from a Linux PC router to appliances (consumer routers).</p>
<p>You have to understand how black box these problems were.  It's not like they would freeze and flash some light, spit out an error or dump some log message.  They just stop working.  Suddenly you can't ping them, or route out or my external IP is down.  And it's not ever related directly to anything.  It's not like I could run 100 copies of a program and bring it down.  It's always really random and sometimes would happen under light load.  So when this would happen, roommates or spouses would get mad.  My self-hosted stuff would be down.  My Counter-Strike:Source server would be offline, a LAN party would be interrupted.  This is over many years (10) and something (productive or fun) would always be impacted.  So this last round of trying to buy my way out of the problem, I bought the most expensive router I had ever bought, a Buffalo WZR-HP-G300NH.</p>
<p>The Buffalo came with a vendor-branded version of dd-wrt.  I had been running dd-wrt on my dlink for a long time and although I enjoyed the interface and features, it didn't have any magic effect on this lockup issue.  So I hoped that somehow the Buffalo would have more memory and/or be magically more compatible with dd-wrt.  It wasn't magic.  It had the same lockup problems.  The firmware that it ships with is based on dd-wrt but it is very old.  It had Buffalo branding/logos on the admin page, I guess Buffalo just modifies or maintains the dd-wrt build.  So I updated it to an official dd-wrt release.  This worked for a while but then I had the lockup problems again.  The problem is very random and intermittant so at this point when I say "it worked for a while", this is inaccurate recall.</p>
<p>Even the dd-wrt wiki has a special page called <a href="http://www.dd-wrt.com/wiki/index.php/Router_Slowdown">Router Slowdown</a> where they describe memory problems and too many open connections.  No fault of their software, I would happily load it on an appliance with more memory.  Unfortunately, building something small and quiet that perhaps fits in a hand-built 1U 19" rack is a bit more expensive than just buying one from someone.</p>
<p><img src="/uploads/2012/02/hacom_mars-580x52.jpg" alt="" title="OLYMPUS DIGITAL CAMERA" width="580" height="52" class="aligncenter size-large wp-image-1542" />
So recently I have bought a 1U small office router from <a href="http://www.hacom.net">Hacom</a>.  It has way more memory and hopefully has better quality memory so that it'll crash less, if at all.  I think if I had added up all the money I've spent on the consumer routers, it would add up to the Hacom.  Eh, hindsight is 20/20.</p>
<p>It runs pfsense and I love it.  It was really easy to set up even though the UI is pretty different.  If you've been through a bunch of different routers, another UI is no big deal.  It probably took me about 30 minutes to set up.  When I ordered it, I got a personal call from Hacom and they answered a few questions I had!  How awesome is that?!  I asked about the fan noise since their newer models aren't fanless and he said it was whisper quiet.  It is but it has a tone.  I can't hear it around an open door corner so it's pretty quiet but I wouldn't put it in the same room as you work.</p>
<p>I've had no lockup problems and it tells me how much memory I'm using.  I haven't even hit 10% on memory use yet.  I will update if any stability problems pop up.</p>
