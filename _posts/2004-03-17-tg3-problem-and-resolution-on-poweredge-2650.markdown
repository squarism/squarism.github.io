---
layout: post
status: publish
published: true
title: tg3 problem and resolution on poweredge 2650
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 37
wordpress_url: http://squarism.com/2004/03/17/tg3-problem-and-resolution-on-poweredge-2650/
date: !binary |-
  MjAwNC0wMy0xNyAyMDo0MzozMCAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0wMy0xOCAwMTo0MzozMCAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
I had a flaky network problem where high loads (fast downloads from tux.org or sun.com) would cause a hang or complete drop of all network connections on the box.  Originally, I had plugged in two CAT5 cables hoping that it would be one of the gbit ethernet ports but that had no effect.

When the network went down I was unable to ping or do anything network related until someone physically walked to the box and did a `service network restart`.  It was quite annoying since this box was in a remote location.

The error message that appeared in `/var/log/messages` was:

`Mar 17 16:45:14 {servername} kernel: tg3: tg3_stop_block timed out, ofs=3400 enable_bit=2`

Eventually, I found (with help of a coworker) that the box was reachable when it was 'down' on the local subnet.  I could ssh in from a box on the same subnet and fix the problem.  Not a bad workaround but the crashing was fairly easy to produce.  About 1 or 2 minutes of ~300KB (bytes, not bits) of fast downloading would cause the "Broadcom Corporation NetXtreme BCM5700 Gigabit Ethernet (rev 12)" to die.

This was running Fedora Core 1.  I had a similar box (a poweredge 1750) that was running RedHat9 working fine.  I was very confused because the linux kernels were very close in version numbers.

I googled and found many people with the same problem.  In the past I've fixed problems like this by using a generic driver like `tulip' or something.  I eventually tried a different network driver in this vein of thought.  My /etc/modules.conf file had

`alias eth0 tg3
alias eth1 tg3`

At the top, so I tried `depmod e1000` which spit out a bunch of IRQ errors meaning that the driver couldn't find the appropriate hardware.  I tried bcm5700 which linux didn't have compiled in by default.  I wasn't about to do a whole kernel recompile for one stupid driver.  I tried e100 and it returned no errors.  This was happy.

`lsmod` showed that e100 was loaded although showing "0" in the "Used By" column.  That's ok.  So maybe I can use the e100 driver for eth0 or eth1 ... but this still didn't explain why I was able to get to the box (on eth1) on the same subnet.

Then I found the answer which as of now seems to be the answer.  `netstat -nr` shows this {ips changed to protect the innocent}:

`[root@server /]# netstat -nr
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
10.0.0.96   0.0.0.0         255.255.255.224 U         0 0          0 eth1
10.0.0.96   0.0.0.0         255.255.255.224 U         0 0          0 eth1
169.254.0.0     0.0.0.0         255.255.0.0     U         0 0          0 eth1
127.0.0.0       0.0.0.0         255.0.0.0       U         0 0          0 lo
0.0.0.0         10.0.0.97   0.0.0.0         UG        0 0          0 eth0`

Note that 0.0.0.0 (the default route) is specifically going through eth0.  Now it makes sense.  So I changed `alias eth0 tg3` -> `alias eth0 e100`, ran `depmod -a`, rebooted a few times and heavy downloads have been running smoothly for 27 minutes now.

I'll update this if this solution turns evil.  :}  For now, the e100 is metal.  \m/