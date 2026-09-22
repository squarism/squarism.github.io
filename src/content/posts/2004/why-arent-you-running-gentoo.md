---
title: "Why aren't you running gentoo?"
description: "emerge world updates every package you have to the latest version that's available via source. Read on for a screendump of tastiness."
date: 2004-12-14T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

emerge world updates every package you have to the latest version that's available via source.  Read on for a screendump of tastiness.

<!-- more -->

```bash
root@gentoobox opt # emerge -pv world

These are the packages that I would merge, in order:

Calculating world dependencies ...done!
[ebuild  N    ] sys-apps/man-pages-1.70  1,589 kB
...
ebuild     U ] app-portage/gentoolkit-0.2.0 [0.2.0_pre8] 60 kB
[ebuild     U ] app-misc/screen-4.0.2 [4.0.1-r2] -debug -nethack +pam (-uclibc) 820 kB

Total size of downloads: 173,636 kB
```
