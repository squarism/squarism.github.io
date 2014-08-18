---
layout: post
status: publish
published: true
title: Sparkfun Onslaught
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 282
wordpress_url: http://squarism.com/?p=282
date: !binary |-
  MjAxMC0wMS0wNyAyMjo0MjoxMiAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0wMS0wOCAwMzo0MjoxMiAtMDUwMA==
categories:
- Arduino
tags: []
comments: []
---
<p><img src="/uploads/2010/01/simon_sparkfun.jpg" alt="simon_sparkfun" title="simon_sparkfun" width="550" height="413" class="aligncenter size-full wp-image-283" />
Sparkfun had their free day today.  I tried to nab some stuff but their servers were too busy and I couldn't sit there and refresh all day (what am I idle rich?).  I just happened to have an order placed the week before and it all came in today.</p>
<p><code>WRL-08664 XBee 1mW Chip Antenna
DEV-09063 Arduino XBee Shield Empty
KIT-09285 Beginner Parts Kit
DEV-09282 ScrewShield
DEV-00666 Arduino USB Board
LCD-00258 Serial Enabled LCD Backpack
TOL-09465 Tool Kit - Beginner
TOL-09317 Third Hand
KIT-09343 Simon Game - Through-Hole Soldering Kit
TOL-00298 Wall Adapter Power Supply - 9VDC 650mA
SEN-08958 Infrared Proximity Sensor Long Range - Sharp GP2Y0A02YK0F
SEN-08733 Infrared Sensor Jumper Wire - 3-Pin JST</code></p>
<p>Chief amongst the loot was a soldering iron and a simon game kit.  Really, I could care less if the thing worked.  I wanted to learn soldering.  I seriously have never done it before.  I couldn't believe my eyes when the damn thing lit up and worked!  I thought for sure my scorch marks had screwed something up.  When I was soldering the legs on the mega-168 processor the thing got warm.  I was working kind of fast and nervous.  I guess I didn't burn anything too bad.  Many of my connections look like shiz and I have pointy parts all over the place.   I was really trying to peer and study how the solder was making the connections.  I'd shake and bend the pins to see how much strength it had and so on.  I was really surprised at out unintuitive the whole process is.  You'd think it'd be harder but after doing the same pins over and over you start to see what a good solder bead looks like.  I just followed the instructions (some of which were a bit off because of a newer board rev) and it wasn't too hard when I took my time and read ahead making sure I wasn't doing something stupid.</p>
<p><img src="/uploads/2010/01/helping_hands.jpg" alt="helping_hands" title="helping_hands" width="550" height="413" class="aligncenter size-full wp-image-284" />Crazy pants!  I can't believe it worked!  The cheapy soldering iron and solder they sent with a starter kit worked really well.  I just held the solder inside the plastic tube it came in.   I thought that the cheapy iron would be crappy but it worked well.  I got some helping hands to help.  They helped.  :D  What was also helpful was having a workbench, damp sponge, helping hands and some youtube videos for instruction.  It's just not as hard as I thought it was.  Now SMD soldering, I have no idea how people do that.</p>
<p>So really I was expecting the kit to be a learning experience and I'd throw it away.  But somehow, despite the weird and PCB-stress-inducing battery clips, the Simon game worked.  When it lit up and I played a little game of simon, I was really surprised.  Kristin has it on the coffee table and she plays it a lot.  I don't think she ever played it in the 80s, weird.  I tweeted about my success and the freaking official Sparkfun twitter account saw my #sparkfun tag and congratulated me.  Awesome!</p>
<p>After a holiday break, a sudden rush of software-type-hacky-motivation came to me.  I grabbed my arduino and laptop and checked it out.  First, it didn't work.  The laptop is new and I had to set up the dev-env again.  Apparently the default now is the ATmega328 and my Arduino is based on the ATmega168.  After that was settled, I had a led blinking again.  </p>
<p>So I had this Hitachi based LCD panel that I had never done anything with.  I got it powered (3.3v) and was trying to figure out how to run the thing.  I read and read and found that I didn't have the right crap on hand.  First, it seems like there's two ways to drive it.  You can drive it "manually" with a bunch of parallel type wires or you can buy a serial backpack and solder it on (I think).  I tried getting things working parallel but it turned out to be a little more than I was comfortable with.  I don't understand multiplexing yet and I actually didn't have enough hook up wires to get it done.  So part of the order you see up top is a serial backpack.  Well somehow I managed to get it wired up but it'd short out my Arduino board, I was just using the board for power.  My LED would fade away, it seems to do that when I short something out.  Thinking that this was a power problem, I plugged in the 9v adapter with the usb (5v).  Well then I started smelling a plastic smell.  I heard a crackle and then I saw a little bubble appear on the backpack chip.  Ow.  I threw it away and I don't have a picture of it.  All it reminded me off is when Tim and I burned up a southbridge on my old AMD computer.  Smells like fail.</p>
<p>So I just played around with the broken backpack.  I desoldered some of the headers off for practice.  Desoldering is hard, I burned up the PCB pretty bad but it was a good learning experience.  Then threw it away.  I ordered a proper serial LCD from sparkfun.  I recently got that working electrically although the code side of it I need to clean up a little bit and grok it some more.</p>
