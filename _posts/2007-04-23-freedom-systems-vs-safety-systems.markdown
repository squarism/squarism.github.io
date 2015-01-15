---
layout: post
status: publish
published: true
title: Freedom Systems vs Safety Systems
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 81
wordpress_url: http://squarism.com/2007/04/23/freedom-systems-vs-safety-systems/
date: !binary |-
  MjAwNy0wNC0yMyAxNTo0OTozMSAtMDQwMA==
date_gmt: !binary |-
  MjAwNy0wNC0yMyAyMDo0OTozMSAtMDQwMA==
categories:
- Systems
tags: []
comments: []
---
[Code Craft had an extremely intuitive post](http://codecraft.info/index.php/archives/20/) about Freedom Languages vs Safety Languages.  He covered what is popular vs what is fringe, where the party-lines are drawn and (imo) almost made an analogy for safety within the USA.

I'll sum it up: **You're safe or free but rarely absolutely both**.

So of course, me, the junior (mid-level if I'm around monkeys) programmer probably can't offer the same level of insight into software.  However, I can make an attempt to "port" Code Craft's post into Freedom System vs Safety Systems.

### Can't we all just get along?

Windows (safety) vs Mac (freedom).  Windows vs Linux.  Linux vs Mac.  A horrific never-ending battle and argument to plague the Internet and geek circles forever.  But even within the Linux community, Ubuntu vs Gentoo.  Debian vs Gentoo.  Redhat (safety) vs Gentoo/Ubuntu/Debian (freedom).  Advocates of safety usually point-out the use of their choice OS in the business world thereby enabling them to get a job.  Advocates of freedom platforms usually point-out weaknesses and flaws of the safety platforms.

Switching a business to an all-Linux or all-Mac platform would be a giant risk.  It's the opposite of safe.  However, getting into bed with Microsoft is not very freedom-enabling.  Vendor lock-in, security problems and lack of diversity in tools get you into a unified headache.

### Protect me from myself

So what to do?  I don't have time to worry about platforms.  I want to move on to the fun stuff.  User space.  In user space, I get to write apps, play games, make money and do all the things that I'm supposed to do above and beyond building boxes all day.  I'm not an OS loader so "[insert vendor here], help me get on with my day."

Self-updating systems.  Self-updating apps.  Warning dialogs, system file permissions.  They are all mechanisms that state "I don't have time to know it all".  I don't have to track 0day exploits full-time to keep my workflow running.  I don't have to stress that as a normal user I can't delete a critical file.  Almost all systems protect the users from harming themselves (or they should).

However, even in Windows Safe Mode, the user can still do damage.  You can delete NTLM in XP (and others) and the system won't boot.  You can delete most of the C: drive with non-administrator rights.  In Linux, things are a bit harder but in common practice people actually getting things done usually have root or full sudo rights.  The same is true in OSX, the productive user needs root level access to get things done.  So where is the happy medium?

Well it's a bit inverse of programming languages.  Actually the safe thing to do in the Enterprise is to enable the user to screw up their own box.  It's more IT tickets but it's usually less of a headache provided a small-enough organization.  In my experience in software and integration, most of the time we get root anyway.  The IT department will segment a section of the network off and it's our own sandbox to wreak havoc.  At the same time, we operate much faster than if we can't even set the system time as it is on Windows with no admin rights.

### Me too

Kevin Barnes compared a C-like for loop to a Ruby for loop as evidence that safety languages are safe because they are very similar.  So do systems on a broader scale suffer from a copy-cat mentality.  DOS became Windows and OSX borrowed some ideas from Windows.  Minimizing all open windows is _Windows Key+M_ on Windows and on OSX it's _Apple Key+M_.  But simple asthetics are not all.  The fact is, even files and folders are all copied concepts.  Command line commands are very similar.  For example, most OS's have similar commands to change into a subfolder and view a file:

**Linux**
`
$ cd docs
$ more resume.txt
`

**Windows**
`
C:\> cd docs
C:\> more resume.txt
`

**Mac**
`
$ cd docs
$ more resume.txt
`

Of course where the Freedom Factor comes in is with the more complex and arcane things like building software.  On RedHat and mainstream Linux distros, building an rpm is usually unnecessary and even complex build processes are point and click with Ubuntu.  Freedom advocates of Gentoo or Debian would cite performance differences between self-built code and generic-built code.

"Me too" in platforms is very much a function of copying, standards and memes.

### Ring the bell for freedom

So in conclusion, Kevin @ Code Craft has a much easier time comparing languages vs systems.  Systems are generally not a science and higher-level which means they are harder to express in snippets.  Systems are best described in diagrams and concepts versus strict syntax.  So he is fortunate to be a blogger in a discrete subject such as software development.

Although I tried my best to copy his post, I don't think it really turned out that way.  I think the better approach would be to take gaping void's sex vs cash theory and apply it to technology.  It's really what Kevin should have done to begin with.  A Sexy technology is very much full of freedom (Ruby, OSX, OpenGL) whereas Cash technology is very much full of business and work (Java, Windows, DirectX).