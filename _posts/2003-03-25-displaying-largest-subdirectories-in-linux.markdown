---
layout: post
status: publish
published: true
title: Displaying largest subdirectories in Linux
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 17
wordpress_url: http://squarism.com/2003/03/25/displaying-largest-subdirectories-in-linux/
date: !binary |-
  MjAwMy0wMy0yNSAxNDozODowNSAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0wMy0yNSAxOTozODowNSAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
A quick script that can be triggered to email administrators (ie: using nagios) the largest subdirectories from a parent directory.  Can also simply print the results to STDOUT.

Doesn't work with the Solaris versions of `du' and `sort'.  :(

{% highlight bash %}
#!/bin/sh
TOP=20
DIR=/home/*
ADMIN=admin@host.com

if [ $1 == "-p" ]
then
  du -sc $DIR|sort -rg|grep -v total|head -n $TOP
  exit
fi

mail -s "**Space Utilization Report for `hostname`**" $ADMIN
{% endhighlight %}