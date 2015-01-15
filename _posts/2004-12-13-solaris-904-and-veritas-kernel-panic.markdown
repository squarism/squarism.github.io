---
layout: post
status: publish
published: true
title: Solaris 9/04 and Veritas kernel panic.
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 56
wordpress_url: http://squarism.com/2004/12/13/solaris-904-and-veritas-kernel-panic/
date: !binary |-
  MjAwNC0xMi0xMyAxMDo0Njo1MyAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0xMi0xMyAxNTo0Njo1MyAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
Over a weekend I had the fun task of rebuilding two Sun Cluster hosts as standalone servers (Sun Cluster wasn't great for us).  I rebuilt one box and noticed after encapsulation that is complained about the ufs log on /.  It was weird but didn't cause any problems.

The 2nd identical box didn't go so well.  After veritas' rootdisk encapsulation, it kernel panicked with that error above and I was dead in the water.  I thought it was a fluke so I spent 3 hours rebuilding it again.  The 2nd time it did the same thing.  This was amazing to me because I knew the hardware was good and that the software should work (worked on the 1st box anyway).  I called Veritas support and got some answers.  I'm posting this just in case someone googles this and it saves their ass.

When booting Solaris after encapsulation, I got the following error:

<pre>
Rebooting with command: boot
Boot device: /pci@8,600000/SUNW,qlc@4/fp@0,0/disk@w21000004cfd9a1cb,0:a  File and args:
SunOS Release 5.9 Version Generic_117171-13 64-bit
Copyright 1983-2003 Sun Microsystems, Inc.  All rights reserved.
Use is subject to license terms.
WARNING: vxvm:vxdmp: Cannot find device number for
e_ddi_get_dev_info: Illegal major device number
NOTICE: vxvm:vxio: Cannot open disk ROOTDISK: kernel error 6
Cannot mount root on /pseudo/vxio@0:0 fstype ufs
panic[cpu0]/thread=140a000: vfs_mountroot: cannot mount root
0000000001409970 genunix:vfs_mountroot+70 (0, 0, 0, 200, 1458170, 0)
%l0-3: 000000000144bc00 000000000144bc00 0000000000002000 0000000001495428
%l4-7: 000000000149b000 0000000001411e28 000000000144c400 000000000144f400
0000000001409a20 genunix:main+90 (1409ba0, f005a4d8, 1409ec0, 391d52, 2000, 500)
%l0-3: 0000000000000001 000000000140a000 0000000001412f98 0000000000000000
%l4-7: 0000000078002000 0000000000394000 00000000014a3800 00000000010665f8</p>

skipping system dump - no dump device configured
</pre>

Read on for the fix.

<!-- more -->

[This link at Sun](http://docs.sun.com/app/docs/doc/817-6960/6mmah949u?a=view#epmqw) explains that ufs logging is enabled by default on Solaris 9/04.  This is a new release of Solaris that I had never installed before but it was confusing that one box's rootdisks encapsulated fine but the 2nd one failed (twice).  Veritas support explained that this behavior is quite random because of how the log gets written.  If the box goes down a certain way, the log might be written a certain way (I don't have any more technical details) and for whatever reason, Veritas can't read the ufs log.

On the box that was downed, I had to undo the Veritas encapsulation, turn off ufs logging and encapsulate again.  Here we go...

</p>

After I rebooted, everything came back fine under Veritas control and I mirrored the rootdisks.