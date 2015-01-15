---
layout: post
status: publish
published: true
title: Synergy2 mouse centering
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 84
wordpress_url: http://squarism.com/2007/10/04/synergy2-mouse-centering/
date: !binary |-
  MjAwNy0xMC0wNCAyMToyOTozOCAtMDQwMA==
date_gmt: !binary |-
  MjAwNy0xMC0wNSAwMjoyOTozOCAtMDQwMA==
categories:
- Development
- Mac
tags: []
comments:
- id: 102
  author: hexameter.com &raquo; N52te
  author_email: ''
  author_url: http://hexameter.com/2007/10/04/n52te/
  date: !binary |-
    MjAwNy0xMC0wNCAyMTo1MjoxMCAtMDQwMA==
  date_gmt: !binary |-
    MjAwNy0xMC0wNSAwMjo1MjoxMCAtMDQwMA==
  content: ! '[...] crashing on my non-stop. I haven&#8217;t found a fix. Synergy
    is also giving me problems. You can read about that on my other neglected tech-only
    blog (sigh, no &#8230; wait&#8230; no [...]'
- id: 1835
  author: ubernub.com &raquo; N52te
  author_email: ''
  author_url: http://ubernub.com/2007/10/04/n52te
  date: !binary |-
    MjAxMC0wMy0xNyAxNTozOToxNyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0wMy0xNyAyMDozOToxNyAtMDQwMA==
  content: ! '[...] crashing on my non-stop. I haven&#8217;t found a fix. Synergy
    is also giving me problems. You can read about that on my other neglected tech-only
    blog (sigh, no &#8230; wait&#8230; no [...]'
---
Synergy is a great tool for sharing multiple screens (reverse KVM) but for some reason lately I've noticed that if I'm physically on the center screen, then the mouse recenters occasionally.  It's pretty annoying.

I turned on debug log and looked in ~/Library/Logs/synergyd.log.  I found this:

> 2007-10-04 22:12:11.894 Synergyd[337] DEBUG: dropped bogus motion -840,-526

I searched sourceforge for that string and found code that essentially centers the mouse when it detects motion on the primary screen.  There doesn't seem to be an option to control the behavior, so short of me making a patch, I don't see a solution.

UPDATE: I found a workaround, simply move your mouse over to the display that it being buggy and the if() condition doesn't fire off.  So in my case, my mac connects to my PC's keyboard and mouse.  I move the PC's mouse over to the Mac screen and the Mac stops acting weird (the centering problem).