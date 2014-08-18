---
layout: post
status: publish
published: true
title: Basic 555 timer Arduino project
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 336
wordpress_url: http://squarism.com/?p=336
date: !binary |-
  MjAxMC0wMi0yMCAxNjoyNzozMCAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0wMi0yMCAyMToyNzozMCAtMDUwMA==
categories:
- Arduino
tags: []
comments: []
---
<p>I put together the arduino protoshield from sparkfun.  Excellent instructions at <a href="http://www.atomicsalad.com/archive/2010/02/02/tutorial_sparkfun_protoshield_for_arduino_assembly_updated.php">atomicsalad</a>.  Even though it's a standard through-hole kit, atomicsalad's instructions were nice to follow along.</p>
<p>After it was put together I had a few built-in LED lights to play with.  I had seen this 555 timer in a piece kit I bought and I wondered what it does.  I found a ton of examples and apparently you can do a zillion things with it.  I wanted to start with the basics so I set out to make a light blink using only hardware.  I'm only using the arduino for power in this one.</p>
<p><img src="/uploads/2010/02/jump_breadboard_at_30-150x150.jpg" alt="jump_breadboard_at_30" title="jump_breadboard_at_30" width="150" height="150" class="alignright size-thumbnail wp-image-337" />
I found a great tutorial on youtube and modified it to work on a larger breadboard.  I had some trouble because it turns out that <a href="http://www.sparkfun.com/commerce/product_info.php?products_id=112">this breadboard</a> has its power rails split down the middle.  I was confused and stuck on this for a day.  Eventually I found a video that hinted at this fact and connected the two sides like so.  After that, the power rails on each side will work like I expected.  This is by design on these boards so that you can have two different voltages but I found it annoying.</p>
<p>So here's the schematic that I followed for the configuration on the big breadboard.
<img src="/uploads/2010/02/555_bb.png" alt="555_bb" title="555_bb" width="349" height="216" class="aligncenter size-full wp-image-340" /></p>
<p>I transferred this layout onto a mini breadboard and it works like a champ.  The protoshield has room for a <a href="http://www.sparkfun.com/commerce/product_info.php?products_id=8803">mini self-adhesive breadboard</a>.  Here's the actual wiring shot.  This uses a light on the protoshield vs the light on the breadboard schematic.  The concept is the same though.  Pin3 on the 555 is the output which makes the light blink rapidly.  You could use this chip as a cpu clock for example.
<img src="/uploads/2010/02/555_timer_wiring-580x435.jpg" alt="555_timer_wiring" title="555_timer_wiring" width="580" height="435" class="aligncenter size-large wp-image-342" /></p>
<p>You don't have to use the breadboard switch (the black thing on the left), it's just more convenient to flip a switch rather than plug in/out of the 3v.  Oh yeah it's powered by 3v on the arduino.  The cap is 100uf.  You can use 2x orange,orange,maroon (gold) resistors or one of those and a blue,gray,maroon one (sorry I don't have the resistance values).  Play with the resistor values to change the blink rate.</p>
