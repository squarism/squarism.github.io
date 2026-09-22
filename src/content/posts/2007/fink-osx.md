---
title: "Fink on OSX"
date: 2007-05-12T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

I wanted lua installed on my Mac for some gamedev tests ... darwinports didn't give me a warm fuzzy.  In uninstalled DarwinPorts with:
`sudo rm -rf /opt/local /Applications/DarwinPorts /Library/Tcl/darwinports1.0 /Library/StartupItems/DarwinPortsStartup`

And then downloaded fink (the universal binary).  After installing the rather large 17mb package, fink wasn't working.  First the path /sw/bin wasn't added to my profile.  I fixed that by editing ~/.bash_profile:
`PATH=$PATH:/sw/bin`
Simple enough but then you're supposed to type "fink scanpackages; fink index" after the install is done.  That failed like this:

```bash
$ fink index
...
Failed: Can't locate auto/Term/ReadKey/termsizeopt.al in @INC
```

So then I googled this and only found [a jp site](http://radastery.jp/blog/2006/10/intel_mac_fink.html) that suggested this:
```bash
$ sudo perl -MCPAN -e shell
cpan> install Term::ReadKey
```

Which fixed the `fink index` command.
