---
layout: post
status: publish
published: true
title: Dataloading ftw
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 277
wordpress_url: http://squarism.com/?p=277
date: !binary |-
  MjAwOS0xMS0xMiAyMjowMzoxNCAtMDUwMA==
date_gmt: !binary |-
  MjAwOS0xMS0xMyAwMzowMzoxNCAtMDUwMA==
categories:
- Ruby
tags: []
comments:
- id: 1822
  author: T.L.
  author_email: tl.smoot@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMC0wMS0yNCAxODozNzowMyAtMDUwMA==
  date_gmt: !binary |-
    MjAxMC0wMS0yNCAyMzozNzowMyAtMDUwMA==
  content: ! "mysql> select count(*) from care;\r\n+----------+\r\n|    0 |\r\n+----------+"
---
<p>Man.  I need to finish this ruby project I started.  I've had this RSS loader running on a box since 7/10/2009 and:</p>
<pre>mysql> select count(*) from jobs;
+----------+
|  1414595 |
+----------+</p>
<p>mysql> select count(*) from entries;
+----------+
|   184149 |
+----------+</p>
<p>mysql> select count(*) from batches;
+----------+
|    35170 |
+----------+
</pre></p>
<p>1.4 millions jobs with 184k RSS posts.  Eep.  I need to finish the analyzer part and turn this off.  It's only a 200mb DB right now but my procrastination could cause /var to fill up.  Heh.</p>
