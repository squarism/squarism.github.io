---
layout: post
status: publish
published: true
title: Using Perl instead of awk or sed
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 42
wordpress_url: http://squarism.com/2004/04/07/using-perl-instead-of-awk-or-sed/
date: !binary |-
  MjAwNC0wNC0wNyAxMToyOTozNyAtMDQwMA==
date_gmt: !binary |-
  MjAwNC0wNC0wNyAxNjoyOTozNyAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
You want to use Perl to process things on the command line but you don't want to write/save a file.  You want to replace sed with something more clunky.  :)

`
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
`