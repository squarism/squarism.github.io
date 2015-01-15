---
layout: post
status: publish
published: true
title: An example md.tab on an E450
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 40
wordpress_url: http://squarism.com/2004/03/31/an-example-mdtab-on-an-e450/
date: !binary |-
  MjAwNC0wMy0zMSAxODo0MToyMyAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0wMy0zMSAyMzo0MToyMyAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
The E450 has a potential of 20 internal disks, none of them labeled in any particular order (ctd numbers) and it was a pain to configure most of them as a big stripe.

Here's the md.tab I created, note the u02 section showing how to string 7 disks (slice 2 is the whole disk) all together.  Note that the line wraps aren't shown so _don't recklessly copy and paste_.

`# Root Mirror MetaDevices
# root
/dev/md/dsk/d11 1 1 /dev/dsk/c0t0d0s0
/dev/md/dsk/d12 1 1 /dev/dsk/c0t1d0s0
/dev/md/dsk/d10 -m /dev/md/dsk/d11
# swap
/dev/md/dsk/d21 1 1 /dev/dsk/c0t0d0s1
/dev/md/dsk/d22 1 1 /dev/dsk/c0t1d0s1
/dev/md/dsk/d20 -m /dev/md/dsk/d21
# u01
/dev/md/dsk/d61 1 1 /dev/dsk/c0t0d0s5
/dev/md/dsk/d62 1 1 /dev/dsk/c0t1d0s5
/dev/md/dsk/d60 -m /dev/md/dsk/d61
# /export/home
/dev/md/dsk/d81 1 1 /dev/dsk/c0t0d0s7
/dev/md/dsk/d82 1 1 /dev/dsk/c0t1d0s7
/dev/md/dsk/d80 -m /dev/md/dsk/d81
# u02
/dev/md/dsk/d101 7 1 /dev/dsk/c0t2d0s2 1 /dev/dsk/c0t3d0s2 1 /dev/dsk/c2t0d0s2 1 /dev/dsk/c2t1d0s2 1 /dev/dsk/c2t2d0s2 1 /dev/dsk/c2
t3d0s2 1 /dev/dsk/c3t0d0s2
/dev/md/dsk/d102 7 1 /dev/dsk/c3t1d0s2 1 /dev/dsk/c3t2d0s2 1 /dev/dsk/c3t3d0s2 1 /dev/dsk/c4t0d0s2 1 /dev/dsk/c4t1d0s2 1 /dev/dsk/c4
t2d0s2 1 /dev/dsk/c4t3d0s2
/dev/md/dsk/d100 -m /dev/md/dsk/d101
# staging
/dev/md/dsk/d111 2 1 /dev/dsk/c5t0d0s2 1 /dev/dsk/c5t1d0s2
/dev/md/dsk/d112 2 1 /dev/dsk/c5t2d0s2 1 /dev/dsk/c5t3d0s2
/dev/md/dsk/d110 -m /dev/md/dsk/d111
`
