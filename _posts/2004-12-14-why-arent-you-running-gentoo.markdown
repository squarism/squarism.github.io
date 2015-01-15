---
layout: post
status: publish
published: true
title: Why aren't you running gentoo?
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! 'emerge world updates every package you have to the latest version that''s
  available via source.  Read on for a screendump of tastiness.

'
wordpress_id: 57
wordpress_url: http://squarism.com/2004/12/14/why-arent-you-running-gentoo/
date: !binary |-
  MjAwNC0xMi0xNCAxOTozMDoyMiAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0xMi0xNSAwMDozMDoyMiAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
emerge world updates every package you have to the latest version that's available via source.  Read on for a screendump of tastiness.

<!-- more -->

`
root@gentoobox opt # emerge -pv world

These are the packages that I would merge, in order:

Calculating world dependencies ...done!
[ebuild  N    ] sys-apps/man-pages-1.70  1,589 kB
...
ebuild     U ] app-portage/gentoolkit-0.2.0 [0.2.0_pre8] 60 kB
[ebuild     U ] app-misc/screen-4.0.2 [4.0.1-r2] -debug -nethack +pam (-uclibc) 820 kB

Total size of downloads: 173,636 kB
`