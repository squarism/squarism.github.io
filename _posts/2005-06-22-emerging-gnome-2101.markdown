---
layout: post
status: publish
published: true
title: Emerging Gnome 2.10.1
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 59
wordpress_url: http://squarism.com/2005/06/22/emerging-gnome-2101/
date: !binary |-
  MjAwNS0wNi0yMiAxMToxOTowNiAtMDQwMA==
date_gmt: !binary |-
  MjAwNS0wNi0yMiAxNjoxOTowNiAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
I've updated Gnome 2.8 to 2.10 on two other boxes.  The third box (which may have had lots of unstable packages on it) is complaining.  When I `emerge gnome`, gnome-games fails with:

game.o(.text+0xa19): In function `bj_game_ensure_config_dir_exists(char const*)':
: undefined reference to `g_mkdir(char const*, int)'
collect2: ld returned 1 exit status
make[3]: *** [blackjack] Error 1
make[3]: Leaving directory `/var/tmp/portage/gnome-games-2.10.1/work/gnome-games-2.10.1/blackjack/src'
make[2]: *** [all-recursive] Error 1
make[2]: Leaving directory `/var/tmp/portage/gnome-games-2.10.1/work/gnome-games-2.10.1/blackjack'
make[1]: *** [all-recursive] Error 1
make[1]: Leaving directory `/var/tmp/portage/gnome-games-2.10.1/work/gnome-games-2.10.1'
make: *** [all] Error 2

!!! ERROR: gnome-extra/gnome-games-2.10.1 failed.
!!! Function gnome2_src_compile, Line 41, Exitcode 2
!!! compile failure
!!! If you need support, post the topmost build error, NOT this status message.

It's insane because I really don't want gnome-games but it's a dependancy.  Working through it ... will post progress...

---

Emerging single packages seems to work, I wonder if g_mkdir is in a header I don't have somewhere ...

---

I emerged a set of packages (one and two at a time) out of the `emerge -pv gnome` dependancy list and I got past gnome-games.  Must have been a libray somewhere.  I will post the history of packages I emerged.  I am 3 packages into `emerge gnome`, past the games.  Must be working.  Very close to getting 2.10 working on this machine.  :)

---