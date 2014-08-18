---
layout: post
status: publish
published: true
title: distcc is cool.
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 55
wordpress_url: http://squarism.com/2004/11/18/distcc-is-cool/
date: !binary |-
  MjAwNC0xMS0xOCAxNzoxMToxNyAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0xMS0xOCAyMjoxMToxNyAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
<p><a href="http://distcc.samba.org/">Distcc</a> is a distributed C/C++ compiler.  You can easily use a bunch of machines' power to compile stuff.  The setup isn't bad at all.  It's just a non-root network service.</p>
<p>Gentoo.org has some <a href="http://www.gentoo.org/doc/en/distcc.xml">nice instructions</a> on setting up distcc for builds.  Here, we have 2x Pentium 3 machines and 1x dual xeon helping me build <a href="http://www.nethack.org/">nethack</a>.  Don't have numbers on how much faster it was but it seemed faster.  Most makes/compiles are annoyingly slow, this seemed ok.</p>
<p><a href="http://squarism.com/archives/distcc_full.html"><img alt="distcc_thumb.jpg" src="http://squarism.com/wp-content/photos/distcc_thumb.jpg" width="239" height="267" /></a></p>
