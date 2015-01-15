---
layout: post
status: publish
published: true
title: Installing BeOS 5 Max Edition on Virtual PC 2004
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 36
wordpress_url: http://squarism.com/2004/01/25/installing-beos-5-max-edition-on-virtual-pc-2004/
date: !binary |-
  MjAwNC0wMS0yNSAxOToxODo0NyAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0wMS0yNiAwMDoxODo0NyAtMDUwMA==
categories:
- Mac
tags: []
comments:
- id: 9
  author: Darrel
  author_email: darrel@knutson.com
  author_url: ''
  date: !binary |-
    MjAwNC0wNC0wMiAwOTowMzowMCAtMDUwMA==
  date_gmt: !binary |-
    MjAwNC0wNC0wMiAxNDowMzowMCAtMDUwMA==
  content: Your experiences with installing BeOS in Virtual PC are similar to mine,
    but you didn't write if it actually worked for you. It didn't for me using the
    BeOS 5.0 installer CD and Virtual PC 6.0 on Mac OS X 10.3. The video driver is
    not recognized (i.e. BeOS in B&amp;W) and the keyboard on my iBook G4 is totally
    useless.
- id: 10
  author: Chris
  author_email: ''
  author_url: ''
  date: !binary |-
    MjAwNC0wNC0xNSAxNDo1NzowOCAtMDQwMA==
  date_gmt: !binary |-
    MjAwNC0wNC0xNSAxODo1NzowOCAtMDQwMA==
  content: ! 'You know, you are right.  I never did post my results.


    Unfortunately, BeOS promptly locks up on any keyboard input and I searched around
    for ever and ever for a fix.  I gave up soon after.


    I never had a problem with the video or even the mouse.  I can move the mouse
    over to NetPositive for example, open NetPositive but the second I type something
    in the URL bar the mouse freezes and I assume that the rest of the virtual machine
    freezes.


    I tried playing with Safe Mode settings but it didn''t change much.

'
---
_Logging what I'm doing._

Clicked on New in "Virtual PC List", selected "Other" for OS.  Basically, this just lets us boot from a CD in a vanilla PC and install to a simple file on our Mac.

Downloaded BeOS Max Ed from [here](http://www.bebits.com/app/3148).  **Make sure to put the CD in, let it spin up and then click Start Up in Virtual PC.**  Otherwise, it just says Boot Failed over and over again while letting you select a or c.  This drove me nuts and cost me a few CDRs.

The installer was black and white although this isn't a huge deal according to someone else on the web.  It should reboot in full color.

[View image](http://squarism.com/archives/beosInstallVPC.html)

In addition, I could not type on the keyboard otherwise the installer would freeze.  Strange.

It took a **long time**, an hour and more.  The Max edition certainly adds a lot of packages to the base BeOS install.

The GUI and most components were considerably slow during the installer (1.33ghz powerbook).  Like a Pentium II 350mhz or something.  Reminds me of the good old days before lighting quick video acceleration, OpenGL/DirectX interface components (Windows 2000).  The mouse was very jerky, like the difference between a USB mouse and a PS2 mouse.

There was constant CD->Hard Disk activity.  The powerbook fan would spin up every once and a while.  It was hot and working hard.  There is no progress bar in the BeOS installer.

Just go get some coffee :)

Virtual PC has a little IO bar at the bottom of the window.  This was particularly useful to watch disk/cdrom activity like IDE lights on the front of a real PC to make sure everything wasn't locked up.  Orange lights mean writes and green lights mean reads.