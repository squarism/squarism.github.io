---
layout: post
status: publish
published: true
title: My DroboFS Problems
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1530
wordpress_url: http://squarism.com/?p=1530
date: !binary |-
  MjAxMi0wMi0xNCAxNzoxMzowMSAtMDUwMA==
date_gmt: !binary |-
  MjAxMi0wMi0xNCAyMjoxMzowMSAtMDUwMA==
categories:
- Blog
tags: []
comments:
- id: 9055
  author: anonymous
  author_email: anonymous@yahoo.com
  author_url: ''
  date: !binary |-
    MjAxNC0wMS0yMCAyMDozNzo0OCAtMDUwMA==
  date_gmt: !binary |-
    MjAxNC0wMS0yMSAwMTozNzo0OCAtMDUwMA==
  content: I had a similar problem (on a drobo 5n) when I changed the admin.conf file
    and could no longer get access to any data or ssh or anything.  For future reference
    or for anyone else that reads this I found a way to overcome the problem.  I turned
    the drobo off and pulled the entire diskpack and saved it.  Then I put a spare
    drive in and setup the drobo just like it was new.  I configured ssh and then
    looked at the file that I misconfigured.  I updated one of the init.d scripts
    so as to replace that file on the next bootup.  Then I shutdown the drobo and
    put my original diskpack in and it repaired the file during startup and I was
    able to get my data back.
---
I love my Drobo (disk pack).  It was revolutionary at the time and it's been working great for years.  I took that love and bought a DroboFS a few years ago and fell in love again.  It was a huge step up from my D-Link 323 which lasted about a year before I threw it out in anger.

![](/uploads/2012/02/drobofs_crash.png "drobofs_crash")
The DroboFS has been throwing problems in my face lately which culminated in my losing all my data on it.  I deserve any data loss incurred for not having a backup but in my defense, it's a huge volume.  Very expensive to mirror on another NAS.  The error being thrown is:
`Drobo detected an internal problem.  Please contact Drobo Support by clicking on the link below:`

This was mostly my fault.  I had lost my password to the DroboFS but still had ssh access. So I reset the password over ssh after I found the .conf file but apparently a few days later some process really didn't like this and I could no longer admin the Drobo over Drobo Dashboard.  All my data was still in tact but eventually it wouldn't finish it's boot sequence.  At this point, support could no longer help me so I just wiped my whole device rather than waiting for a fix.

That's the problem with this all-in-one.  The data is on the same disks as the config.  The firmware is probably burned on some memory somewhere but the conf files, the encryption, the non-RAID layout is all on the disk.  So if you screw up your Drobo, you lose your data.  If you reset the Drobo to factory settings, you lose your data.

I don't think any of this data loss was related to the recent 1.2.1 firmware update that they did but I did have some compatibility problems.  My disk pack is EoL but the DroboFS isn't.

I had reset my Drobo which meant there were no droboapps on it.  So I loaded up apache, droboadmin and the nfs server.  I also enabled time machine on a share.  Some combination of this made it crash on boot.  So now I had to wipe the config again which meant another data loss.  I couldn't even copy off data this time.

Anyway, I even tried replacing my one 750gb disk with a 1TB disk but I got in a weird state where it thought I had removed disks too quickly.  All the disks were blinking red and I had to reset and wipe again.  I think it had something to do with wanting to reset with drives removed but also having the name remain the same.  At one point, I had a single drive in the Drobo but putting that single drive in later made it freak out because the box name was the same.  Maybe it thought that it had failed but I was actually wanting it to wipe the old drive.  I never pulled a drive while it was blinking and always when it was green but I think there's some delay and lag that you have to be careful off, especially when inserting 5 drives at a time.  The whole thing is really tricky and error-prone in a failure situation (I feel the same of Linux software raid).

In total, I had wiped my DroboFS 5 times.  Now I think I have everything stable but I'm not going to load the NFS server.  That means I'm going to have to use SMB or something from my Linux boxes.

I still really like the Drobo products.  I just think eventually I'm going to buy a Synology just to have two different vendor NAS's.  But it's an expensive experiment ($800 empty) so this all kind of really sucks.