---
layout: post
status: publish
published: true
title: Upgrade fest.
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 77
wordpress_url: http://squarism.com/2007/04/10/upgrade-fest/
date: !binary |-
  MjAwNy0wNC0xMCAxNzo0ODoxOCAtMDQwMA==
date_gmt: !binary |-
  MjAwNy0wNC0xMCAyMjo0ODoxOCAtMDQwMA==
categories:
- Unix
- Blog
tags: []
comments: []
---
<p>Following an <a href="http://www.gentoo.org/doc/en/gcc-upgrading.xml">upgrade guide</a> on gentoo's lovely doc site.  GCC was majorly out of date (3.3 to 4.1.1) and hopefully you can still read this after all is said and done.</p>
<p>Right now, apache is in a weird state and I need to emerge a ton of crap:</p>
<blockquote><p>
# /etc/init.d/apache2 restart
 * Apache2 has detected a syntax error in your configuration files:
Syntax error on line 6 of /etc/apache2/modules.d/70_mod_php.conf:
Cannot load /usr/lib/apache2-extramodules/libphp4.so into server: libXrender.so.1: cannot open shared object file: No such file or directory
</p></blockquote>
<p>Need X11 and a million other things put back on.  Cobwebs from leaving it alone for so long.</p>
