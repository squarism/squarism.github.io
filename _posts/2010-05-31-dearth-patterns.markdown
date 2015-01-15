---
layout: post
status: publish
published: true
title: Dearth Patterns
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 411
wordpress_url: http://squarism.com/?p=411
date: !binary |-
  MjAxMC0wNS0zMSAxMTozNjoyOSAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wNS0zMSAxNjozNjoyOSAtMDQwMA==
categories:
- Systems
tags: []
comments:
- id: 2280
  author: Technology Knowledge Debt, Part One &laquo; SQUARISM
  author_email: ''
  author_url: http://squarism.com/2010/07/03/tech-knowledge-debt/
  date: !binary |-
    MjAxMC0wNy0wMyAxNToxNToyMyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0wNy0wMyAyMDoxNToyMyAtMDQwMA==
  content: ! '[...] Knowledge Debt, Part One Posted on July 3, 2010As a follow-up
    to my previous post where I psuedo-whined about common knowledge gaps in technology
    projects, I thought I&#039;d try to [...]'
- id: 2343
  author: Tshepang Lekhonkhobe
  author_email: tshepang@gmail.com
  author_url: http://tshepang.tumblr.com
  date: !binary |-
    MjAxMC0xMC0wNCAwODoxMDoxNCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0xMC0wNCAxMzoxMDoxNCAtMDQwMA==
  content: ! "One solution to all this pain, I guess, is decent documentation, and
    regular pointers to such, EG, via blog posts. I tend to find those to be such
    a relief, because the thought of digging through manuals (which often lack nice
    examples) scares me away.\r\n\r\nI'm thinking here of X11. Everyone knows it's
    such a critical piece of Unix infrastructure, but whoever goes there to poke around
    into such a scary pile of functionality is a rare individual indeed."
- id: 5540
  author: SQUARISM &raquo; Technology Knowledge Debt, Part Two
  author_email: ''
  author_url: http://squarism.com/2010/08/05/technology-knowledge-debt-part-two/
  date: !binary |-
    MjAxMS0wMy0wOSAxNjoxNzo1OSAtMDUwMA==
  date_gmt: !binary |-
    MjAxMS0wMy0wOSAyMToxNzo1OSAtMDUwMA==
  content: ! '[...] Control, Sudo and Cron as common debted areas. The original post
    that posed the questions is here, where I wondered why the same patterns happen
    from project to project, company to company and [...]'
---
There seems to be a lack of understanding and experience in the same areas from project to project, company to company and sector to sector.  It's nothing specific to any one company.  I've seen this in small .com companies to large contractors.  It's very odd to me.  Even if everyone can't know everything, it seems certain things are never taught or learned.

Some of these things are high-level skills and some are very specific.  I think the specific ones are weirder.  Osmosis, you'd think, would have some people learn certain tools or languages or whatever.

**Troubleshooting**
Basic troubleshooting skills.  Like, change one thing at a time.  Or, turn on debugging.  Or what the likely culprit is versus chasing after every possibility.  Or, feeling overwhelmed and not trying anything: it's just broken.  Broken how?  What changed last?  What is persisted?  Is there a tmp file?  Is there a cache?  Can you repeat this every time?  If not, what are the variables?

**VNC**
No one seems to know how VNC works.  But everyone uses remote desktop just fine.  With VNC, it's an effort to get everyone connected and it's a hand-holding operation.  I understand it's tricky.  But VNC has been around for almost a decade and it hasn't really changed.  I figured osmosis would kick in.

**X11**
Cygwin, Xming, putty and getting X11 working.  Or how X11 isn't encrypted.  Or security problems with xhost.  Or running X as root.  Or how X11 is different than the Windows display.  Or how X11 is separate from the X11 shell.  How to forward X11 over ssh.  All these X concepts don't come from the Windows world but are in every other OS: Solaris, OSX (X11 app), Linux.

**Version control**
Conflicts, merging, branching.  Why SVN is different from SharePoint is different than git is different than just calling files .year.mon.day in a file share.  Even 'senior developers' that don't have any high-level knowledge of CVS, a program that was released in 1990.  I've seen this everywhere.

**Sudo and cron**
Even if in a Windows environment, what the UAC momentary elevation of privileges is like (also see OSX ignorance).  Or how `at` works on Windows.  At is also a program in UNIX.

**Myth of supportability**
Everything has to be written in the language that's delivered.  If we're delivering a COTS program that runs on C# then every script has to be C# because that's what we know.  If you offered to write a utility in a higher level language, then all the Java devs would cry foul because it's too foreign.  So everything is a hammer problem even though all tech changes in a few years.  I wish someone would add up all the "this is going to save you so much money" promises of middleware.

Regarding COTS, Mike Taylor's [Whatever happened to programming?](http://reprog.wordpress.com/2010/03/03/whatever-happened-to-programming/) is a good read.  I think of his libraries as my COTS/middleware.

**Copy and paste**
How to paste in X11 (middle click).  How to paste into putty (right click).  How to copy in X11 (select), how to copy in putty (select).  How to copy and paste across VNC (enable clipboard support).  How to strip out formatting (paste to notepad, start->Run, anything plain text).

**Hierarchies in Software Architecture**
How many nodes make up an X?  How many X's make up a Y?  Can I have multiple Y's per Z?  What's shared between Z and foo?  Do I have to create foo first?  Enough of the contrived examples.  Let me give you some real examples:

I have a bunch of disks I'm going to share out for a database.

1.  Combine one or more disks into raid or jbod array on SAN
2.  Slice up SAN into one or more LUNs
3.  Create volumes or filesystems with one or more partitions
4.  Organize partisions into one or more diskgroups
5.  Database is spread across one or more diskgroups
6.  Database has one or more schemas
7.  Schema has one or more tables
8.  Tables can have one or more data partitions</p>

And so on.  It can keep going like this for quite a while.  In terms of performance, if the partitions go to the same busy disks then there's not a whole lot of point in sharding.  In terms of design and planning, obviously I have to do step 1 before I can do step 5 and often undoing step 1 will cause the house of cards to tumble.

That's not really a software thing like I said, ok.  I can have multiple listeners in Oracle DB but I can't have multiple listeners on the same port.  I can have multiple reverse HTTP proxies on different boxes point back to the same web server on a single port though.  I can have multiple IPs on a box but not multiple programs using a port on a single IP.  I can have multiple virtualhosts against one IP in Apache but I can't have name based virtualhosts against one IP with ssh.  This hierarchy is especially important when load balancing webapps.  Even the F5 has an internal hierarchy to make the configuration flexible.

Ok, ok.  That's still not software enough.  I can have multiple sessions in a webapp but only one identity.  The identity is in the persistence layer of the above SAN example and my webapp can scale out to the horizon with shared-nothing or whatever I want.  I'm still really logging in only once even if I bounce between 500 boxes.  The session could be just an instance of my identity.

**Webapp vs webpage**
Website is to webserver as webapp is to application server.  HTML is a webpage/website.  JSP/PHP/CF/ASP is a webapp.  This is simplified but so many people don't know the difference even when their job revolves around integrating or even developing 'webpages'.

**Plain-text**
Many protocols, passwords and network traffic can be viewed in plaintext.  There's some protocols you can interact with just by typing text to an open telnet session.  You can do IRC with telnet.  You can do SMTP with telnet.  You can do a HTTP GET.

**Hands-On Security**
Policy makers vs whitehats.  Like actually checking Sans for actual 0-day remote root-level ultra-bad exploit on foo software.  Security is always a huge blanket statement with very few actual experts.  I'm certainly not one but I have met very few that I thought were teaching me something.  I want the guy who actually knows what a XSS attack or a buffer overflow is.  This might just be a reflection on the projects I've been on.