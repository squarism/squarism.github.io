---
title: "Macports upgrade breaks ImageMagick"
description: "A blind upgrade of all macports packages broke my ruby project because it uses imagemagick."
date: 2010-12-16T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

A blind upgrade of all macports packages broke my ruby project because it uses imagemagick.

```text
dlopen(/opt/local/lib/ruby/gems/1.8/gems/rmagick-2.13.1/lib/RMagick2.bundle, 9): Library not loaded: /opt/local/lib/libMagickCore.3.dylib
  Referenced from: /opt/local/lib/ruby/gems/1.8/gems/rmagick-2.13.1/lib/RMagick2.bundle
  Reason: image not found - /opt/local/lib/ruby/gems/1.8/gems/rmagick-2.13.1/lib/RMagick2.bundle
```

Massive hack incoming:
```bash
cd /opt/local/lib
sudo ln -s libMagickCore.4.dylib libMagickCore.3.dylib
```

There should be a better solution but I can't find one until macports gets it's goddamn *bEEp* straight.  I swear to deity, every time I do a sudo port upgrade outdated, something breaks.  I know it's not macports fault but the nature of native ruby gem extensions but I'm just going to avoid upgrading.

Something else to consider is my recent switch to homebrew.  I haven't made the switch on all my boxes and the ImageMagick problem isn't related to the package manager.  I do prefer brew's command structure.  Moving MySQL wasn't insanely difficult but I did cheat by just doing a stupid copy of the MySQL data files.
