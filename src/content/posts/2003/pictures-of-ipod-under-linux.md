---
title: "Pictures of iPod under Linux"
description: "Got an iPod for Xmas. Santa deserves a Nobel Prize."
date: 2003-12-28T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Got an iPod for Xmas.  Santa deserves a Nobel Prize.

After admiring the packaging, manuals and the well designed manuals; I popped it into my USB slot and realized that I don't have a USB 2.0 slot.  Can't believe it.  So I'll have to order a new Motherboard.  This might seem drastic but a new MB will give me a Firewire port, AGP 8x and USB 2.0.  Firewire is good for compatibility with Apple products, AGP 8x is better than my 4x (Radeon 9800XT does 8x) and USB 2.0 is a lot faster.

But enough of that.  Here's a shot of Gnome 2.4 (comes with Fedora Core 1).  I did recompile the kernel to support USB mass storage (not sure if it's on by default).  As you can see the last icon is the Trash icon.  Watch carefully:
_Before mounting (screenshot lost)_

Now I mount the appropriate SCSI device (USB mass storage makes it a SCSI device - check your logs for clues as to which one) and automounter has already made a mount point for me.  I didn't even create /mnt/ipod (ipod is the volume name on the iPod itself):
_After mounting (screenshot lost)_

So then the little icon labeled "ipod" appears.  Looks good, open it and see the volume.  Drag and drop files, umount and get on the train.  Nice Apple.  Smart design.
_Nautilus looking at the iPod (screenshot lost)_
