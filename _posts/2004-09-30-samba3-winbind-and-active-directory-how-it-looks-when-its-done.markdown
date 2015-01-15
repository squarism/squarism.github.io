---
layout: post
status: publish
published: true
title: Samba3, winbind and active directory - how it looks when it's done
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 45
wordpress_url: http://squarism.com/2004/09/30/samba3-winbind-and-active-directory-how-it-looks-when-
date: !binary |-
  MjAwNC0wOS0zMCAxMjoyNTozNyAtMDQwMA==
date_gmt: !binary |-
  MjAwNC0wOS0zMCAxNzoyNTozNyAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
There is lots of community information about how to setup winbind and Samba3 to move your *nix box towards a single sign on paradigm, but not much about what it actually looks like or how it operates in the end.

First, Samba.  The point of this setup is to not to create a unix account for everyone who will use the network share/drive.  In a large company, such a setup would make any System Administrator cringe.  Our goal is to create a share that looks like a normal Windows file server that appears to be a part of a domain (as in, they don't get some annoying login prompt when they use it); seamless integration is what we want.

So far [this article](http://www.wlug.org.nz/ActiveDirectorySamba) is the best thing I've seen for a Samba3+Winbind+Active Directoy setup guide.  In the end, I had a file share (called public) that I could browse to without a local UNIX login.  Although I have a local UNIX account, logging in as DOMAIN\me was clearly seperate from my local UNIX account.  This was a concern for me since I didn't want a situation where the Domain Controller goes down and I can't admin a box.

Samba3 can be setup so that home directories are created automatically when people browse to it.  smb.conf has comments in it that help point you in the right direction.

Here you can see how it separates the DOMAIN homes from the 'local' homes.  Neat idea of having a DOMAIN subdirectory.  (please note that my Active Directory domain in this example is 'DOMAIN' and my username is 'me' both locally and on the AD domain 'DOMAIN')

<pre>
me@box / $ ls -l /home
total 12
drwxr-xr-x   5 root    root  4096 Sep 29 14:41 DOMAIN
drwx------  26 me      users 4096 Sep 29 15:13 me
</pre>

Then if you look at /home/DOMAIN:

<pre>
me@box / $ ls -l /home/DOMAIN
total 12
drwxr-xr-x  3 DOMAIN+me   DOMAIN+Domain Users 4096 Sep 29 16:54 me
drwxr-xr-x  2 DOMAIN+bob  DOMAIN+Domain Users 4096 Sep 29 16:15 bob
drwxr-xr-x  3 DOMAIN+jane DOMAIN+Domain Users 4096 Sep 29 10:43 jane
</pre>

Pretty neat.  Winbind at work showing that home directories are owned as we might hope.  /home/DOMAIN/me is shared to me only when I access the samba server logged in from my XP machine as the user DOMAIN\me.  This is exactly like plain-vanilla samba home directory sharing.

Access control lists work also to provide NTFS-like security even from a windows machine.  If you right-click on a folder on my samba server, set permissions on the permissions tab, you'll see the acls if you use the getfacl utility.

The screen dump below shows that I (DOMAIN\me) created a folder named 'blee' and granted permissions to DOMAIN\bob just like a normal windows share.  I didn't set the ACL permissions using a UNIX box, thus proving that ACLs = NTFS type permissions.

<pre>
me@box public $ getfacl blee
# file: blee
# owner: DOMAIN+me
# group: DOMAIN+Domain40Users
user::rwx
user:DOMAIN+bob:rwx
group::r-x
mask::rwx
other::r-x
default:user::rwx
default:user:DOMAIN+bob:rwx
default:group::---
default:mask::rwx
default:other::---
</pre>