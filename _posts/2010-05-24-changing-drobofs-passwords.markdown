---
layout: post
status: publish
published: true
title: Changing DroboFS passwords
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 515
wordpress_url: http://squarism.com/?p=515
date: !binary |-
  MjAxMC0wNS0yNCAyMzozMDoxOSAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wNS0yNSAwNDozMDoxOSAtMDQwMA==
categories:
- Blog
tags: []
comments:
- id: 2338
  author: marc juneau
  author_email: marc@nolagraphics.com
  author_url: http://nolagraphics.com
  date: !binary |-
    MjAxMC0wOS0yMCAxMjoxNTo0OSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0wOS0yMCAxNzoxNTo0OSAtMDQwMA==
  content: sooo i have a drobo-fs too.. it rocks yes ... but i was wondering if you
    have any experience setting up other htpasswd files on it ... i have another folder
    in my apache root called "/files" and i made a symlink to one of my shares
    for that so i can have that enabled on the web ... question tho ... i cant seem
    to get a htpasswd file to work on it ... any trick / tips ?
---
First off, this DroboFS is awesome.  However some of the apps are a little thin on the docs and there were a few things I had to figure out.

So first a few assumptions, you didn't change your drobo's name.  I actually did and that's ok, just in this post, it's called drobo-fs which affects mount paths and some of the commands.  So just watch for "drobo-fs" below.

To get apps on the drobo, you have to install apache first, reboot and then install drobotools and reboot again.  After that you can one-click install from the web admin.  Just follow the official PDF docs.

Ok, if you install dropbear, we have the first password to reset: ssh root.

### 1. Change ssh root

ssh root@drobo-fs
(yes)
# passwd
(ignore error about /etc/shadow)

### 2. Change apache's root

cd /mnt/Drobo-FS/Shares/DroboApps/droboadmin

Find a box with htpasswd on it (like a Linux box).  There are ones [online](http://www.htaccesstools.com/htpasswd-generator/) if you don't like that.  You'll get a hash like:
`root:$apr1$UNZ3DFk3$tspu/3z5Pkkn.h.TUytUl1`

Backup your htpasswd:

Close your browser (clear the session) and try to go to:
http://drobo:8080/droboadmin/

The login should work now without restarting.  If it doesn't restore your htpasswd file and hit the web.

Looks like this thing has 128MB of RAM.  It has some basic busybox commands but no bash, nano or even users.  I haven't figure out ctorrent yet.  Also, big note: the root password resets on reboot.  Run /mnt/DroboFS/Shares/DroboApps/dropbear/root_passwd to make the password change permanent.