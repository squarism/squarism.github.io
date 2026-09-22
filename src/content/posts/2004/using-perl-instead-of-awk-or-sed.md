---
title: "Using Perl instead of awk or sed"
description: "You want to use Perl to process things on the command line but you don't want to write/save a file. You want to replace sed with something more clu..."
date: 2004-04-07T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

You want to use Perl to process things on the command line but you don't want to write/save a file.  You want to replace sed with something more clunky.  :)

```bash
[user@server tmp]$ ls / | perl -e 'while (){ print $_; }'
bin
boot
dev
etc
home
initrd
lib
lost+found
misc
mnt
opt
proc
root
sbin
tmp
usr
var
[user@server tmp]$ ls / | perl -e 'while (){ print "/" . $_; }'
/bin
/boot
/dev
/etc
/home
/initrd
/lib
/lost+found
/misc
/mnt
/opt
/proc
/root
/sbin
/tmp
/usr
/var
```
