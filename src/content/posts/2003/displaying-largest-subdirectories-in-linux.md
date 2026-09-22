---
title: "Displaying largest subdirectories in Linux"
description: "A quick script that can be triggered to email administrators ie: using nagios the largest subdirectories from a parent directory. Can also simply pr"
date: 2003-03-25T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

A quick script that can be triggered to email administrators (ie: using nagios) the largest subdirectories from a parent directory.  Can also simply print the results to STDOUT.

Doesn't work with the Solaris versions of `du` and `sort`.  :(

```bash
#!/bin/sh
TOP=20
DIR=/home/*
ADMIN=admin@host.com

if [ $1 == "-p" ]
then
  du -sc $DIR|sort -rg|grep -v total|head -n $TOP
  exit
fi

mail -s "**Space Utilization Report for `hostname`**" $ADMIN
```
