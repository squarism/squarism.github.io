---
title: "distcc is cool."
description: "Distcchttp://distcc.samba.org/ is a distributed C/C++ compiler. You can easily use a bunch of machines' power to compile stuff. The setup isn't ba"
date: 2004-11-18T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

[Distcc](http://distcc.samba.org/) is a distributed C/C++ compiler.  You can easily use a bunch of machines' power to compile stuff.  The setup isn't bad at all.  It's just a non-root network service.

Gentoo.org has some [nice instructions](http://www.gentoo.org/doc/en/distcc.xml) on setting up distcc for builds.  Here, we have 2x Pentium 3 machines and 1x dual xeon helping me build [nethack](http://www.nethack.org/).  Don't have numbers on how much faster it was but it seemed faster.  Most makes/compiles are annoyingly slow, this seemed ok.

_(screenshot lost)_
