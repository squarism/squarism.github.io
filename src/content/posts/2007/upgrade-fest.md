---
title: "Upgrade fest."
description: "Following an upgrade guidehttp://www.gentoo.org/doc/en/gcc-upgrading.xml on gentoo's lovely doc site. GCC was majorly out of date 3.3 to 4.1.1 a"
date: 2007-04-10T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Following an [upgrade guide](http://www.gentoo.org/doc/en/gcc-upgrading.xml) on gentoo's lovely doc site. GCC was majorly out of date (3.3 to 4.1.1) and hopefully you can still read this after all is said and done.

Right now, apache is in a weird state and I need to emerge a ton of crap:

```
# /etc/init.d/apache2 restart
Apache2 has detected a syntax error in your configuration files:
Syntax error on line 6 of /etc/apache2/modules.d/70_mod_php.conf:
Cannot load /usr/lib/apache2-extramodules/libphp4.so into server:
  libXrender.so.1: cannot open shared object file: No such file or directory
```

Need X11 and a million other things put back on. Cobwebs from leaving it alone for so long.
