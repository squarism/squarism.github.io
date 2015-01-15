---
layout: post
status: publish
published: true
title: Macports upgrade breaks ImageMagick
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 585
wordpress_url: http://squarism.com/?p=585
date: !binary |-
  MjAxMC0xMi0xNiAxMzo1NToxNiAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0xNiAxODo1NToxNiAtMDUwMA==
categories:
- Ruby
- Mac
tags: []
comments:
- id: 6129
  author: Francisco S&Atilde;&iexcl;ez
  author_email: francisco.saez@facilethings.com
  author_url: http://facilethings.com/
  date: !binary |-
    MjAxMS0wNi0wMyAxMjoyMToyMCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNi0wMyAxNzoyMToyMCAtMDQwMA==
  content: ! "I've had the same problem and found a better solution. After upgrading
    all ports, you can check what ImageMagick ports are installed. In my case:\r\n\r\n$
    port installed ImageMagick\r\nThe following ports are currently installed:\r\n
    \ ImageMagick @6.6.2-0_0+q16\r\n  ImageMagick @6.7.0-0_0+q16 (active)\r\n\r\nSo
    now, if you want to activate the older version, just type:\r\n\r\n% sudo port
    activate ImageMagick @6.6.2-0_0+q16"
- id: 6827
  author: Clemens Lang
  author_email: neverpanic@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMi0wMS0yNyAyMDowMTo0MiAtMDUwMA==
  date_gmt: !binary |-
    MjAxMi0wMS0yOCAwMTowMTo0MiAtMDUwMA==
  content: ! "Problems like these will be fixed by a contribution developed in last
    year's Google Summer of Code for the MacPorts project called rev-upgrade. It will
    scan all installed binaries for this kind of problems and rebuild the broken ports.
    The code is currently in MacPorts trunk and might be in the next release.\r\n\r\nThis
    is not a MacPorts-only problem btw, but always happens when updating libraries
    to newer (incompatible) versions without rebuilding the dependents. So the real
    problem here is having unversioned dependencies."
- id: 6828
  author: Clemens Lang
  author_email: neverpanic@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMi0wMS0yNyAyMDowMjo1NiAtMDUwMA==
  date_gmt: !binary |-
    MjAxMi0wMS0yOCAwMTowMjo1NiAtMDUwMA==
  content: Oh, and meanwhile you should file a ticket against the rb-rmagick port
    and have it revision-bumped to trigger a rebuild.
---
A blind upgrade of all macports packages broke my ruby project because it uses imagemagick.

`
dlopen(/opt/local/lib/ruby/gems/1.8/gems/rmagick-2.13.1/lib/RMagick2.bundle, 9): Library not loaded: /opt/local/lib/libMagickCore.3.dylib
  Referenced from: /opt/local/lib/ruby/gems/1.8/gems/rmagick-2.13.1/lib/RMagick2.bundle
  Reason: image not found - /opt/local/lib/ruby/gems/1.8/gems/rmagick-2.13.1/lib/RMagick2.bundle
`

Massive hack incoming:
`
cd /opt/local/lib
sudo ln -s libMagickCore.4.dylib libMagickCore.3.dylib
`

There should be a better solution but I can't find one until macports gets it's goddamn *bEEp* straight.  I swear to deity, every time I do a sudo port upgrade outdated, something breaks.  I know it's not macports fault but the nature of native ruby gem extensions but I'm just going to avoid upgrading.

Something else to consider is my recent switch to homebrew.  I haven't made the switch on all my boxes and the ImageMagick problem isn't related to the package manager.  I do prefer brew's command structure.  Moving MySQL wasn't insanely difficult but I did cheat by just doing a stupid copy of the MySQL data files.