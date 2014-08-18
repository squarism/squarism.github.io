---
layout: post
status: publish
published: true
title: Goddamn Solaris
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 358
wordpress_url: http://squarism.com/?p=358
date: !binary |-
  MjAxMC0wMy0wNiAyMDoxMToxNyAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0wMy0wNyAwMToxMToxNyAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
<p><img src="/uploads/2010/03/sun_expensive.png" alt="sun_expensive" title="sun_expensive" width="499" height="160" class="aligncenter size-full wp-image-375" />
Solaris is a rock-solid serious OS with a dependable hardware platform.  Sun has always been solid technically.  Sun pours a lot of good tech into Solaris.  ZFS is amazing.  Dtrace is revolutionary.  Zones are flexible and lightweight.  They're doing good engineering all around in a crazy number of areas.  But we're going to temporarily ignore those things and talk about why Solaris is horrifying.  Hopefully Oracle can fix a number of these Goddamn Problems&acirc;&bdquo;&cent;.  If not, maybe OpenSolaris will/has.</p>
<p>I'm open to counter-points except for the argument "but you can change it".  I know a lot of this is configurable (like adding packages or editing the default files) but that's not the point.  Linux comes out of the box "right" or most specifically, easier/better.  It's especially annoying because Sun boxes are so much more expensive and are <em>sooo</em> close to perfection.  And many times the box isn't yours or the baseline isn't yours so you can't just add packages or reconfigure a global config file.</p>
<p>1. Default Bash Prompt.
Seriously, <code>-bash-3.00#</code> in 2010?  Which box am I on?  I don't know!  What directory am I in?  Every box, I edit /etc/profile to have <code>export PS1='[\u@\h \W]\$ '</code></p>
<p>2. No `locate'.
Everyone does a find /.  Yay.  I love waiting 5 minutes to find one file.  In linux, I schedule updatedb at 2am and find files sub-second.</p>
<p>3. No `screen'.
Greatest command in the world and it's an optional install from sunfreeware.  So I have a crappy default term program and no way to start processes except with <code>nohup command &</code>.  Boo.</p>
<p>4. Solaris tar is stupid.
Can't have filenames greater than 100 characters.  Ok, use gtar.  Great.  Gtar doesn't do bzip or gzip on the fly.  Argh.  Why can't Solaris just include and use exclusively GNU tar (as well as everything else GNU)?!</p>
<p>5. No network package installs
Yum is great.  Aptitude is better.  Emerge is slow and dangerous (try moving between major Gentoo profiles).  But at least I can download packages from the net on the fly.  Ubuntu even tells me what to install when a command isn't found!</p>
<p>6. You know what I meant Mr. Picky.
If I type <code>ls file -l</code> I get <code>-l: No such file or directory</code> and then a non-long <code>file</code> return.  Because it thinks I meant "show me two files file and -l".  When you type a command in Solaris and forget to put a switch on, you're doomed to Ctrl-A, insert the switch and make it look like <code>ls -l file</code>.  In Linux, it knows what you meant.  Most core commands are more flexible in this way under Linux.  It's goddamn maddening when you go back to Solaris.</p>
<p>7. UFS is pathetic.
ZFS is pure bliss but it's tricky to put on your root partition.  You can't do it during the default install and you have to migrate everything.  Which is not only complicated but hard to do if you have UFS permissions all over the place (next point).  Also, UFS logging should be the default.  I don't want to do fsck checks if my box crashes.  Really.  W(hy)TF isn't logging the default?  Who doesn't want journaling on?!  What's the drawback?!  *head asplode*</p>
<p>8. ACL translations
The problem with migrating is that fine-grained POSIX ACLs (UFS) aren't compatible with ZFS ACLs.  You control POSIX ACLs on UFS with setfacl & getfacl.  You control ACLs on ZFS with chmod.  The two commands are very different in syntax.  So you have to "port" them.  Which is especially maddening if you do a `man get_acl'.  There's a goddamn C system call that can translate the ACLs built into the OS!  How do you think this works?
<code>cp /zfs/my_file /ufs/</code></p>
<p>The OS doesn't strip the extended ACLs off the file when it appears in /ufs/my_file!  The capability is in the OS but it's not exposed as a command or another acl_translate call.  You'd have to write your own utility ... hmm.  Maybe that's a project.</p>
<p>9. Embrace GCC plz
GCC can do a zillion things more than CC.  Get rid of CC, embrace GNU.  Keep format, keep whatever bios-replacement commands you want.  Keep the nice stuff from Solaris but please don't try to compete with better GNU utilities that already are switch compatible with Solaris tools.  Some of these GNU binaries are literally drop-in replacements with Solaris compatible switches.  And even if not, make Solaris 11 a GNU platform milestone and let customers decide if they want to upgrade.</p>
<p>10. X11, CDE, openwin
I love the new /SP/console and LOM stuff.  I love the console architecture.  I love all the things that PCs can't do (unless you buy Vendor specific add-in cards).  I do not love CDE (yes Gnome is there) and OpenWindows.  /usr/openwin/bin/xclock should not be the path to xclock.  xclock should be in my default /usr/bin/ path and Xorg should be the only X11 anything anywhere.  I'm sick of not having Xnest and all the other awesome Linux standard tools.</p>
<p>11. netstat -pan doesn't work.
Solaris netstat won't show me the process number of a network port.  This is heresy.  Just add the goddamn -p.  Do you know how useful it is to do something like <code>netstat -pan | grep `ps -ef|grep -v grep |grep java | awk '{print $2}'` | grep LISTEN</code> is?  Works on Linux.  Bam!  All the java listening ports.  Done.  Great for security, debugging and scripting.</p>
<p>12. Solaris ps -ef is stupid.
Linux ps auxww is God.  GNU ps rules.  Holy ass this is annoying on Solaris.</p>
<p>13. No top.
All you get is prstat.  Linux (some distros) has this awesome improvement on top called htop.  Htop lets you nice, kill and highlight processes.  It's really great but I'd be happy with top on default Solaris installs.  Even my Mac has top on it.  I'd love to know why adding a binary in /usr/bin is so hard.  Does it break some other command called top?  Do things detect top in the $PATH and set Linux mode to true?</p>
<p>*breathe*</p>
<p>Rants are great.  By the end of the list, I realize I'm nitpicking.  But day in and day out, I'm praying to the Sun gods that they develops the absolute crap out of Solaris and get an amazing milestone together for Solaris 11 or Solaris 12 or whatever.  Something that will appeal to ever-increasing Ubuntu and casual hacker community instead of reminiscing about legacy compatibility until x86 mediocrity makes the obscure Solaris way of doing things completely irrelevant.</p>
<p>I remember when Solaris didn't even have ssh by default.  I guess this "behind" strategy continues.  Maybe OpenSolaris can become the default on Sparc and people can stay behind until they feel like stepping into a different baseline.  But even outside of packages and baselines, nice things left off (like UFS logging) by default is just maddening.</p>
