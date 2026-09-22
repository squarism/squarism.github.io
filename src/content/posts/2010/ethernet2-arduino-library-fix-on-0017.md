---
title: "Ethernet2 Arduino Library Fix on 0017"
description: "Blog post about ethernet2 arduino library fix on 0017"
date: 2010-02-06T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![arduino_0017](/uploads/2010/02/arduino_0017.png "arduino_0017")
Ethernet2 lib. It's a lighterweight and better Ethernet class. Head into your ~/Documents/Arduino/libraries (or Windows equivalent) and checkout the SVN project:

`$ svn co http://tinkerit.googlecode.com/svn/trunk/Ethernet2%20library/Ethernet2`

Now change your sketch to use Ethernet2.h instead of Ethernet.h. Wondeful? No. You'll get this error in 0017.

`'EthernetClass' has not been declared`

Ok, the forums have a fix. But it didn't work for the longest time because I didn't know what they meant by Server.cpp. There's two of them! The original or the new one?! If you edit the old one you'll get this:

`Print.cpp:129: first defined here`

So:

1. Edit Server.cpp in Ethernet2 to include Ethernet2.h and not Ethernet.h.
2. Delete the Print.cpp and Print.h files from Ethernet2.
3. Compile.
4. Have some yay.
