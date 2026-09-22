---
title: "Software RAID5 is no good."
description: "Set up a 2.6TB raid5 volume using A5200s and a 2x450mhz E220R. Shared it using samba3. Saw that network copies were horrible to it. This is the out..."
date: 2004-11-08T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Set up a 2.6TB raid5 volume using A5200s and a 2x450mhz E220R.  Shared it using samba3.  Saw that network copies were horrible to it.  This is the output of bonnie++ (a disk benchmark) and then I piped the results to `bon_csv2html` program (included with the source distribution of bonnie).

_(image lost)_
You can see that I'm getting only 594KB of block writes per second but 13.3MB of block reads per second.  Writes are way too slow because it's having to write little 32k interlaces across 40 disks in an external disk array.

Test2 is a 3 disk RAID5 stripe.  Interlace size is still the default of 32k.  Still not great performance.  Boo software RAID5.
