---
layout: post
status: publish
published: true
title: Software RAID5 is no good.
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 53
wordpress_url: http://squarism.com/2004/11/08/software-raid5-is-no-good/
date: !binary |-
  MjAwNC0xMS0wOCAxNDowMzozMyAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0xMS0wOCAxOTowMzozMyAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
<p>Set up a 2.6TB raid5 volume using A5200s and a 2x450mhz E220R.  Shared it using samba3.  Saw that network copies were horrible to it.  This is the output of bonnie++ (a disk benchmark) and then I piped the results to `bon_csv2html' program (included with the source distribution of bonnie).</p>
<p><img alt="bonnie_results.jpg" src="http://squarism.com/wp-content/photos/bonnie_results.jpg" width="738" height="73" /></p>
<p>You can see that I'm getting only 594KB of block writes per second but 13.3MB of block reads per second.  Writes are way too slow because it's having to write little 32k interlaces across 40 disks in an external disk array.</p>
<p>Test2 is a 3 disk RAID5 stripe.  Interlace size is still the default of 32k.  Still not great performance.  Boo software RAID5.</p>
