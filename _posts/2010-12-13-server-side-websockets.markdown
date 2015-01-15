---
layout: post
status: publish
published: true
title: Server side websockets
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 697
wordpress_url: http://squarism.com/?p=697
date: !binary |-
  MjAxMC0xMi0xMyAyMjo1ODoxNSAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0xNCAwMzo1ODoxNSAtMDUwMA==
categories:
- Brainstorm
tags: []
comments: []
---
For some reason I started researching server side websockets with a python module for apache.  I thought, "oh this would be cool to create a reverse proxy or a socket to a port that's not accessible through a firewall".  You could just have an apache module create a path back to some service.

Not knowing a lot about websockets, I kept reading and eventually realized that this problem would be best solved in an app server. The websocket module I found was written in python but if I used something like passenger to reverse back to a rails app server and then I could use whatever language I wanted. Besides, the web server shouldn't be running code.

Anyway, fizzled idea.