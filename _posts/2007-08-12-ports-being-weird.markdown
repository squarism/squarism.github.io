---
layout: post
status: publish
published: true
title: Ports being weird.
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 83
wordpress_url: http://squarism.com/2007/08/12/ports-being-weird/
date: !binary |-
  MjAwNy0wOC0xMiAxNjozNjoxMCAtMDQwMA==
date_gmt: !binary |-
  MjAwNy0wOC0xMiAyMTozNjoxMCAtMDQwMA==
categories:
- Mac
tags: []
comments: []
---
When I typed port, portmirror or anything related to darwinports (macports), I got a strange error with no google hits.

` # portmirror
can't find package macports
    while executing
"package require macports"
    (file "/opt/local/bin/portmirror" line 11)
stormbringer:~/phonedmg root# port
can't find package macports
    while executing
"package require macports"
    (file "/opt/local/bin/port" line 42)
`

The solution was to [download macports 1.5](http://svn.macports.org/repository/macports/downloads/MacPorts-1.5.0/) and run it again.  It's been a while since I had used ports on my Mac and maybe the project got renamed or changed.  I dunno.

Then "port selfupdate" failed with "Directory not empty" errors from mv:rename so I did this:

`mv /opt/local/var/db/dports/distfiles/ /opt/local/var/macports/distfiles
mv /opt/local/var/db/dports/receipts/ /opt/local/var/macports/receipts/
mv /opt/local/var/db/dports/software/ /opt/local/var/macports/software/`

Then it seemed to work:

`# port selfupdate
MacPorts base version 1.5 installed
Downloaded MacPorts base version 1.510
Configuring, Building and Installing new MacPorts base
selfupdate done!`