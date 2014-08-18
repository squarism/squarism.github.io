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
excerpt: ! "Over a weekend I had the fun task of rebuilding two Sun Cluster hosts
  as standalone servers (Sun Cluster wasn't great for us).  I rebuilt one box and
  noticed after encapsulation that is complained about the ufs log on /.  It was
  weird but didn't cause any problems.\n\nThe 2nd identical box didn't go so well.
  \ After veritas' rootdisk encapsulation, it kernel panicked with that error above
  and I was dead in the water.  I thought it was a fluke so I spent 3 hours rebuilding
  it again.  The 2nd time it did the same thing.  This was amazing to me because I
  knew the hardware was good and that the software should work (worked on the 1st
  box anyway).  I called Veritas support and got some answers.  I'm posting this just
  in case someone googles this and it saves their ass.\n\nWhen booting Solaris after
  encapsulation, I got the following error:\n\n<pre>\nRebooting with command: boot
  \                                         \nBoot device: /pci@8,600000/SUNW,qlc@4/fp@0,0/disk@w21000004cfd9a1cb,0:a
  \ File and args: \nSunOS Release 5.9 Version Generic_117171-13 64-bit\nCopyright
  1983-2003 Sun Microsystems, Inc.  All rights reserved.\nUse is subject to license
  terms.\nWARNING: vxvm:vxdmp: Cannot find device number for \ne_ddi_get_dev_info:
  Illegal major device number \nNOTICE: vxvm:vxio: Cannot open disk ROOTDISK: kernel
  error 6\nCannot mount root on /pseudo/vxio@0:0 fstype ufs\npanic[cpu0]/thread=140a000:
  vfs_mountroot: cannot mount root\n0000000001409970 genunix:vfs_mountroot+70 (0,
  0, 0, 200, 1458170, 0)\n%l0-3: 000000000144bc00 000000000144bc00 0000000000002000
  0000000001495428\n%l4-7: 000000000149b000 0000000001411e28 000000000144c400 000000000144f400\n0000000001409a20
  genunix:main+90 (1409ba0, f005a4d8, 1409ec0, 391d52, 2000, 500)\n%l0-3: 0000000000000001
  000000000140a000 0000000001412f98 0000000000000000\n%l4-7: 0000000078002000 0000000000394000
  00000000014a3800 00000000010665f8\n\nskipping system dump - no dump device configured\n</pre>\n\nRead
  on for the fix.\n"
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
<p>Over a weekend I had the fun task of rebuilding two Sun Cluster hosts as standalone servers (Sun Cluster wasn't great for us).  I rebuilt one box and noticed after encapsulation that is complained about the ufs log on /.  It was weird but didn't cause any problems.</p>
<p>The 2nd identical box didn't go so well.  After veritas' rootdisk encapsulation, it kernel panicked with that error above and I was dead in the water.  I thought it was a fluke so I spent 3 hours rebuilding it again.  The 2nd time it did the same thing.  This was amazing to me because I knew the hardware was good and that the software should work (worked on the 1st box anyway).  I called Veritas support and got some answers.  I'm posting this just in case someone googles this and it saves their ass.</p>
<p>When booting Solaris after encapsulation, I got the following error:</p>
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
<p>skipping system dump - no dump device configured
</pre></p>
<p>Read on for the fix.
<a id="more"></a><a id="more-56"></a>
<a href="http://docs.sun.com/app/docs/doc/817-6960/6mmah949u?a=view#epmqw">This link at Sun</a> explains that ufs logging is enabled by default on Solaris 9/04.  This is a new release of Solaris that I had never installed before but it was confusing that one box's rootdisks encapsulated fine but the 2nd one failed (twice).  Veritas support explained that this behavior is quite random because of how the log gets written.  If the box goes down a certain way, the log might be written a certain way (I don't have any more technical details) and for whatever reason, Veritas can't read the ufs log.</p>
<p>On the box that was downed, I had to undo the Veritas encapsulation, turn off ufs logging and encapsulate again.  Here we go...</p>
<ol>
<li>I booted off the Solaris 9 DVD (you can use the install CD) with boot cdrom -s
<li>I mounted 1 half of my mirror on /mnt: mount /dev/dsk/c1t0d0s4 /mnt
<li>Back up vfstab file: cp /mnt/etc/vfstab /mnt/etc/vfstab.original
<li>Copy pre-encapsulation vfstab.prevm to vfstab: cp /mnt/etc/vfstab.prevm /mnt/etc/vfstab
<li>Vi vfstab and inspect it to make sure it's correct (it looked fine to me).
<li>Add "nologging" to the end of any root-related boot partitions.  Root partitions could include /, /var, /opt, /usr.  If unsure, add nologging to as many as possible.  An example entry would look like this:<br>
/dev/dsk/c1t0d0s0       /dev/rdsk/c1t0d0s0      /       ufs     1       no      nologging</p>
<li>Backup system file: cp /mnt/etc/system /mnt/etc/system.original
<li>edit /mnt/etc/system:
<br>
( comment out the following 2 lines )<br>
rootdev:/pseudo/vxio@0:0<br>
set vxio:vol_rootdev_is_volume=1<br></p>
<li>touch /mnt/etc/vx/reconfig.d/state.d/install-db
<li>umount and reboot: cd /; umount /mnt; reboot
<li>System should boot like veritas doesn't have root encapsulated.
<li>Install SUNWsan
<li>run vxinstall - select option 2  "custom install"<br>
When I said "yes to the question "Do you want to use enclosure based names?", vxinstall exited without error, just say "no".</p>
<li>Encapsulate the boot disk and leave all other disks alone.
</ol></p>
<p>After I rebooted, everything came back fine under Veritas control and I mirrored the rootdisks.</p>
