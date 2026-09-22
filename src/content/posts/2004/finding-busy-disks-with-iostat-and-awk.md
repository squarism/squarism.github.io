---
title: "Finding busy disks with iostat and awk"
description: "So you want to find busy disks in solaris? Maybe you want a quick iostat summary? Need an easier way to find slow disks? Getting percent busy info ..."
date: 2004-04-05T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

So you want to find busy disks in solaris?  Maybe you want a quick iostat summary?  Need an easier way to find slow disks?  Getting percent busy info from iostat is easy with awk.  Usually any disk with %busy greater than 0 (some people prefer >= 2) is a sign of a slow disk.

```bash
iostat -xcn|awk '$10 > 0{ print $10"%" " - "  $11 }'
```

Or perhaps you want to see how many disks are considered 'slow' in your system:

```bash
echo `iostat -xcn|awk '$10 > 0{ print $10"%" " - "  $11 }'|wc -l` out of `iostat -xcn|wc -l`
```
