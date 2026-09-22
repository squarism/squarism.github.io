---
title: "Changing DroboFS passwords"
description: "First off, this DroboFS is awesome. However some of the apps are a little thin on the docs and there were a few things I had to figure out."
date: 2010-05-24T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

First off, this DroboFS is awesome. However some of the apps are a little thin on the docs and there were a few things I had to figure out.

So first a few assumptions, you didn't change your drobo's name. I actually did and that's ok, just in this post, it's called drobo-fs which affects mount paths and some of the commands. So just watch for "drobo-fs" below.

To get apps on the drobo, you have to install apache first, reboot and then install drobotools and reboot again. After that you can one-click install from the web admin. Just follow the official PDF docs.

Ok, if you install dropbear, we have the first password to reset: ssh root.

### 1. Change ssh root

```bash
ssh root@drobo-fs
# (yes)
# passwd
# (ignore error about /etc/shadow)
```

### 2. Change apache's root

```bash
cd /mnt/Drobo-FS/Shares/DroboApps/droboadmin
```

Find a box with htpasswd on it (like a Linux box). There are ones [online](http://www.htaccesstools.com/htpasswd-generator/) if you don't like that. You'll get a hash like:
`root:$apr1$UNZ3DFk3$tspu/3z5Pkkn.h.TUytUl1`

Backup your htpasswd:

Close your browser (clear the session) and try to go to:
http://drobo:8080/droboadmin/

The login should work now without restarting. If it doesn't restore your htpasswd file and hit the web.

Looks like this thing has 128MB of RAM. It has some basic busybox commands but no bash, nano or even users. I haven't figure out ctorrent yet. Also, big note: the root password resets on reboot. Run /mnt/DroboFS/Shares/DroboApps/dropbear/root_passwd to make the password change permanent.
