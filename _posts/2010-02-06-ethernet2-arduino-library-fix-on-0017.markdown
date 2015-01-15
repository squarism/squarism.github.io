---
layout: post
status: publish
published: true
title: Ethernet2 Arduino Library Fix on 0017
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 310
wordpress_url: http://squarism.com/?p=310
date: !binary |-
  MjAxMC0wMi0wNiAyMjo1ODo0NiAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0wMi0wNyAwMzo1ODo0NiAtMDUwMA==
categories:
- Arduino
tags: []
comments:
- id: 1828
  author: Arduino command protocol - SQUARISM
  author_email: ''
  author_url: http://squarism.com/2010/02/28/arduino-command-protocol/
  date: !binary |-
    MjAxMC0wMi0yOCAxMTo0MTowMSAtMDUwMA==
  date_gmt: !binary |-
    MjAxMC0wMi0yOCAxNjo0MTowMSAtMDUwMA==
  content: ! '[...] an Ethernet Shield both from sparkfun. As for software, I&#8217;m
    using the Ethernet2 library (see my previous post about this), the WString library
    and a homerolled IRC protocol parser. The breadboard&#8217;s power [...]'
- id: 2334
  author: Kevin
  author_email: kbourgault@email.msn.com
  author_url: ''
  date: !binary |-
    MjAxMC0wOS0xMSAwMDoxODoxMyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0wOS0xMSAwNToxODoxMyAtMDQwMA==
  content: Thanks so much for your help. Your tip saved a hell of a lot of potential
    aggravation for me.
---
![arduino_0017](/uploads/2010/02/arduino_0017.png "arduino_0017")
Ethernet2 lib.  It's a lighterweight and better Ethernet class.  Head into your ~/Documents/Arduino/libraries (or Windows equivalent) and checkout the SVN project:

`$ svn co http://tinkerit.googlecode.com/svn/trunk/Ethernet2%20library/Ethernet2`

Now change your sketch to use Ethernet2.h instead of Ethernet.h.  Wondeful?  No.  You'll get this error in 0017.

`'EthernetClass' has not been declared`

Ok, the forums have a fix.  But it didn't work for the longest time because I didn't know what they meant by Server.cpp.  There's two of them!  The original or the new one?!  If you edit the old one you'll get this:

`Print.cpp:129: first defined here`

So:
1. Edit Server.cpp in Ethernet2 to include Ethernet2.h and not Ethernet.h.
2. Delete the Print.cpp and Print.h files from Ethernet2.
3. Compile.
4. Have some yay.