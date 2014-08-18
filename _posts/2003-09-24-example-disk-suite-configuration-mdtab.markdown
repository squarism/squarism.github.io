---
layout: post
status: publish
published: true
title: Example Disk Suite Configuration (md.tab)
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! 'An example of mirroring the root disks with DiskSuite on Solaris 9.  Step
  by step instructions on how to mirror 2 internal root disks with the bundled version
  of DS.

'
wordpress_id: 27
wordpress_url: http://squarism.com/2003/09/24/example-disk-suite-configuration-mdtab/
date: !binary |-
  MjAwMy0wOS0yNCAxNTozMjo1NSAtMDQwMA==
date_gmt: !binary |-
  MjAwMy0wOS0yNCAyMDozMjo1NSAtMDQwMA==
categories:
- Unix
tags: []
comments:
- id: 6
  author: kumar
  author_email: kumar@skylarkinfo.com
  author_url: ''
  date: !binary |-
    MjAwNC0wNy0wNiAwMjo0NDoxMyAtMDQwMA==
  date_gmt: !binary |-
    MjAwNC0wNy0wNiAwNjo0NDoxMyAtMDQwMA==
  content: ! 'It is good.

'
---
<p>An example of mirroring the root disks with DiskSuite on Solaris 9.  Step by step instructions on how to mirror 2 internal root disks with the bundled version of DS.
<a id="more"></a><a id="more-27"></a>
With a default install (Entire Group plus/minus OEM) of Solaris 9, you should have Solaris Volume Manager installed.  It's basically disksuite with a few niceties.  I believe one of them is viewing the volumes in MB instead of cylinders.  Don't quote me on that.</p>
<p>Vi /etc/lvm/md.tab and follow the example below:</p>
<pre>
# Root Mirror MetaDevices
# MetaDevice for c1t0d0s0 (boot disk root slice)
/dev/md/dsk/d11 1 1 /dev/dsk/c1t0d0s0
# MetaDevice for c1t1d0s0 (bootmirror disk root slice)
/dev/md/dsk/d12 1 1 /dev/dsk/c1t1d0s0
# MetaDevice for a mirror using boot disk to start with
/dev/md/dsk/d10 -m /dev/md/dsk/d11</p>
<p># Swap Mirror Metadevices
# MetaDevice for c1t0d0s1 (boot disk swap)
/dev/md/dsk/d21 1 1 /dev/dsk/c1t0d0s1
# MetaDevice for c1t1d0s1 (bootmirror disk swap)
/dev/md/dsk/d22 1 1 /dev/dsk/c1t1d0s1
# MetaDevice for Swap Mirror
/dev/md/dsk/d20 -m /dev/md/dsk/d21</p>
<p># /export Mirror Metadevices
# MetaDevice for c1t0d0s5
/dev/md/dsk/d31 1 1 /dev/dsk/c1t0d0s7
# MetaDevice for c1t1d0s5
/dev/md/dsk/d32 1 1 /dev/dsk/c1t1d0s7
# MetaDevice for Export Mirror
/dev/md/dsk/d30 -m /dev/md/dsk/d31</p>
<p># /usr Mirror Metadevices
# MetaDevice for c1t0d0s3
/dev/md/dsk/d41 1 1 /dev/dsk/c1t0d0s3
# MetaDevice for c1t1d0s3
/dev/md/dsk/d42 1 1 /dev/dsk/c1t1d0s3
# MetaDevice for /usr Mirror
/dev/md/dsk/d40 -m /dev/md/dsk/d41</p>
<p># /var Mirror Metadevices
# MetaDevice for c1t0d0s4
/dev/md/dsk/d51 1 1 /dev/dsk/c1t0d0s4
# MetaDevice for c1t1d0s3
/dev/md/dsk/d52 1 1 /dev/dsk/c1t1d0s4
# MetaDevice for /var Mirror
/dev/md/dsk/d50 -m /dev/md/dsk/d51
</pre></p>
<p>Now create your metadatabase.  It holds info about your volumes.  This is similar to encapsulation under Veritas.</p>
<pre>
[root@server /]# metadb -af -c 4 /dev/dsk/c1t0d0s6
[root@server /]# metadb -af -c 4 /dev/dsk/c1t1d0s6
</pre></p>
<p>Make sure that the database replicas were created.</p>
<pre>
[root@server /]# metadb
        flags           first blk       block count
     a        u         16              8192            /dev/dsk/c1t0d0s6
     a        u         8208            8192            /dev/dsk/c1t0d0s6
     a        u         16400           8192            /dev/dsk/c1t0d0s6
     a        u         24592           8192            /dev/dsk/c1t0d0s6
     a        u         16              8192            /dev/dsk/c1t1d0s6
     a        u         8208            8192            /dev/dsk/c1t1d0s6
     a        u         16400           8192            /dev/dsk/c1t1d0s6
     a        u         24592           8192            /dev/dsk/c1t1d0s6
</pre></p>
<p>Initialize your metadevices.  You don't have to force each one but I did for quicker Bash shortcuts (up arrow).</p>
<pre>
[root@server /]# metainit -f /dev/md/dsk/d11
d11: Concat/Stripe is setup
[root@server /]# metainit -f /dev/md/dsk/d12
d12: Concat/Stripe is setup
[root@server /]# metainit -f /dev/md/dsk/d10
d10: Mirror is setup
[root@server /]# metainit -f /dev/md/dsk/d21
d21: Concat/Stripe is setup
[root@server /]# metainit -f /dev/md/dsk/d22
d22: Concat/Stripe is setup
[root@server /]# metainit -f /dev/md/dsk/d20
d20: Mirror is setup
[root@server /]# metainit -f /dev/md/dsk/d31
d31: Concat/Stripe is setup
[root@server /]# metainit -f /dev/md/dsk/d32
d32: Concat/Stripe is setup
[root@server /]# metainit -f /dev/md/dsk/d30
d30: Mirror is setup
[root@server /]# metainit -f /dev/md/dsk/d41
d41: Concat/Stripe is setup
[root@server /]# metainit -f /dev/md/dsk/d42
d42: Concat/Stripe is setup
[root@server /]# metainit -f /dev/md/dsk/d40
d40: Mirror is setup
[root@server /]# metainit -f /dev/md/dsk/d51
d51: Concat/Stripe is setup
[root@server /]# metainit -f /dev/md/dsk/d52
d52: Concat/Stripe is setup
[root@server /]# metainit -f /dev/md/dsk/d50
d50: Mirror is setup
</pre></p>
<p>Here, metaroot modifies vfstab to boot / off the d10 metadevice</p>
<pre>
[root@server /]# metaroot d10
</pre></p>
<p>Then manually change /dev/dsk/c1t0d0s1 for swap to read /dev/md/dsk/d20</p>
<pre>
#device         device          mount           FS      fsck    mount
mount
#to mount       to fsck         point           type    pass    at boot
options
#
fd      -       /dev/fd fd      -       no      -
/proc   -       /proc   proc    -       no      -
/dev/md/dsk/d20 -       -       swap    -       no      -
/dev/md/dsk/d10 /dev/md/rdsk/d10        /       ufs     1       no
-
/dev/md/dsk/d40 /dev/md/rdsk/d40        /usr    ufs     1       no
-
/dev/md/dsk/d50 /dev/md/rdsk/d50        /var    ufs     1       no
-
/dev/md/dsk/d30 /dev/md/rdsk/d30        /export ufs     2       yes
-
swap    -       /tmp    tmpfs   -       yes     -
</pre></p>
<p>Reboot to check your progress.  If your server comes up, continue while doing a happy dance.</p>
<p><u>Root's fine</u></p>
<pre>
[root@server /]# df -lk /
Filesystem            kbytes    used   avail capacity  Mounted on
/dev/md/dsk/d10      5039370  336115 4652862     7%    /
</pre></p>
<p><u>Swap's fine</u></p>
<pre>
[root@server /]# swap -l
swapfile             dev  swaplo blocks   free
/dev/md/dsk/d20     85,20     16 2097392 2097392
</pre></p>
<p>Do the following for every mirror pair, here I attach d11 to d12 as d10 (d11 is assumed by our previous config file).</p>
<p>[root@server /]# metattach d10 d12
d10: submirror d12 is attached</p>
<p>[...]</p>
<p>[root@server /]# metastat|grep Resync
      State: Resyncing
    Resync in progress: 2 % done
    State: Resyncing</p>
<p>Best idea to let one synch go at a time.  Watch status with:</p>
<pre>while true; do metastat|grep %; sleep 1; done
</pre></p>
<p>When you don't see Resync progress anymore, the mirrors are sync'd.  Then we check to see how our new mirrors are doing:</p>
<pre>
[root@server /]# metastat
d40: Mirror
    Submirror 0: d41
      State: Okay
    Pass: 1
    Read option: roundrobin (default)
    Write option: parallel (default)
    Size: 6142014 blocks (2.9 GB)</p>
<p>d41: Submirror of d40
    State: Okay
    Size: 6142014 blocks (2.9 GB)
    Stripe 0:
        Device     Start Block  Dbase        State Reloc Hot Spare
        c1t0d0s3          0     No            Okay   Yes</p>
<p>d30: Mirror
    Submirror 0: d31
      State: Okay
    Pass: 1
    Read option: roundrobin (default)
    Write option: parallel (default)
    Size: 51314418 blocks (24 GB)</p>
<p>d31: Submirror of d30
    State: Okay
    Size: 51314418 blocks (24 GB)
    Stripe 0:
        Device     Start Block  Dbase        State Reloc Hot Spare
        c1t0d0s5          0     No            Okay   Yes</p>
<p>d20: Mirror
    Submirror 0: d21
      State: Okay
    Pass: 1
    Read option: roundrobin (default)
    Write option: parallel (default)
    Size: 2097414 blocks (1.0 GB)</p>
<p>d21: Submirror of d20
    State: Okay
    Size: 2097414 blocks (1.0 GB)
    Stripe 0:
        Device     Start Block  Dbase        State Reloc Hot Spare
        c1t0d0s1          0     No            Okay   Yes</p>
<p>d10: Mirror
    Submirror 0: d11
      State: Okay
    Pass: 1
    Read option: roundrobin (default)
    Write option: parallel (default)
    Size: 10238616 blocks (4.9 GB)</p>
<p>d11: Submirror of d10
    State: Okay
    Size: 10238616 blocks (4.9 GB)
    Stripe 0:
        Device     Start Block  Dbase        State Reloc Hot Spare
        c1t0d0s0          0     No            Okay   Yes</p>
<p>d50: Mirror
    Submirror 0: d51
      State: Okay
    Pass: 1
    Read option: roundrobin (default)
    Write option: parallel (default)
    Size: 1022706 blocks (499 MB)</p>
<p>d51: Submirror of d50
    State: Okay
    Size: 1022706 blocks (499 MB)
    Stripe 0:
        Device     Start Block  Dbase        State Reloc Hot Spare
        c1t0d0s4          0     No            Okay   Yes</p>
<p>d52: Concat/Stripe
    Size: 1022706 blocks (499 MB)
    Stripe 0:
        Device     Start Block  Dbase   Reloc
        c1t1d0s4          0     No      Yes</p>
<p>d42: Concat/Stripe
    Size: 6142014 blocks (2.9 GB)
    Stripe 0:
        Device     Start Block  Dbase   Reloc
        c1t1d0s3          0     No      Yes</p>
<p>d32: Concat/Stripe
    Size: 51314418 blocks (24 GB)
    Stripe 0:
        Device     Start Block  Dbase   Reloc
        c1t1d0s5          0     No      Yes</p>
<p>d22: Concat/Stripe
    Size: 2097414 blocks (1.0 GB)
    Stripe 0:
        Device     Start Block  Dbase   Reloc
        c1t1d0s1          0     No      Yes</p>
<p>d12: Concat/Stripe
    Size: 10238616 blocks (4.9 GB)
    Stripe 0:
        Device     Start Block  Dbase   Reloc
        c1t1d0s0          0     No      Yes</p>
<p>Device Relocation Information:
Device   Reloc  Device ID
c1t1d0   Yes    id1,ssd@w20000004cf9f2e91
c1t0d0   Yes    id1,ssd@w20000004cf99e53f
</pre></p>
