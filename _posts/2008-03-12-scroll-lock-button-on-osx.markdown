---
layout: post
status: publish
published: true
title: Scroll Lock Button on OSX
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 85
wordpress_url: http://squarism.com/2008/03/12/scroll-lock-button-on-osx/
date: !binary |-
  MjAwOC0wMy0xMiAxNjozMToxOCAtMDQwMA==
date_gmt: !binary |-
  MjAwOC0wMy0xMiAyMTozMToxOCAtMDQwMA==
categories:
- Mac
tags: []
comments:
- id: 132
  author: HansMcAnon
  author_email: HansMcAnon@anon.net
  author_url: http://HansMcAnon
  date: !binary |-
    MjAwOC0wNS0xMCAxODowODowMCAtMDQwMA==
  date_gmt: !binary |-
    MjAwOC0wNS0xMCAyMzowODowMCAtMDQwMA==
  content: Fantastic. I'd been looking for a solution for this forever!
- id: 136
  author: Andrew
  author_email: andrewberry@sentex.net
  author_url: ''
  date: !binary |-
    MjAwOC0wNi0yNyAxNToxNTo0MiAtMDQwMA==
  date_gmt: !binary |-
    MjAwOC0wNi0yNyAyMDoxNTo0MiAtMDQwMA==
  content: Wow, this is something I've wanted for *years*. Thanks for the tip!
- id: 137
  author: Joey Foxenberger
  author_email: jfox95@gmail.com
  author_url: ''
  date: !binary |-
    MjAwOC0wOC0xOSAxMzo1ODoxNSAtMDQwMA==
  date_gmt: !binary |-
    MjAwOC0wOC0xOSAxODo1ODoxNSAtMDQwMA==
  content: ! "I can't seem to find the plist. I know the name of the plist is net.sourceforge.synergy2.synergypane
    - correct?\r\n\r\nJust can't seem to find it anywhere."
- id: 138
  author: Joey Foxenberger
  author_email: jfox95@gmail.com
  author_url: ''
  date: !binary |-
    MjAwOC0wOC0xOSAxNDowMzo0OCAtMDQwMA==
  date_gmt: !binary |-
    MjAwOC0wOC0xOSAxOTowMzo0OCAtMDQwMA==
  content: ! "haha, nevermind. Of course 2 seconds after I posted that, I find it.\r\n\r\nThanks
    for the tip though.\r\n\r\nFor those that might have the same question: /Users/YOURUSERNAME/Library/Preferences/"
- id: 1573
  author: Narflar
  author_email: byrne.al@gmail.com
  author_url: ''
  date: !binary |-
    MjAwOS0wNS0yMiAwNzoxMzo1OCAtMDQwMA==
  date_gmt: !binary |-
    MjAwOS0wNS0yMiAxMjoxMzo1OCAtMDQwMA==
  content: I just wanna say thanks.  This has bugged me for a while and I just found
    your post on this.  Worked like a champ.
- id: 7240
  author: SYNERGY &#8211; Scroll Lock Button on OSX | Geekonym
  author_email: ''
  author_url: http://geekonym.com/synergy-scroll-lock-button-osx/
  date: !binary |-
    MjAxMi0wOS0xNiAxODozNzoxNiAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wOS0xNiAyMzozNzoxNiAtMDQwMA==
  content: ! '[...] SQUARISM &Acirc;&raquo; Scroll Lock Button on OSX.        Be Sociable,
    Share!           [...]'
---
<p>Here's an esoteric fix for something I wanted to do.  In a certain game, right click will move the camera.  For some reason, when hosting synergy on the Mac (as the server) and connecting a Windows client, the right clicking gets whacked.  It works fine the other way (don't ask me).</p>
<p>So I want to hit scroll lock to lock the screen so that mouse-looking works.  Except there's no scroll lock button on a Mac keyboard!  Doh.  But I find a solution:</p>
<p><code>
keystroke(f13) = lockCursorToScreen(toggle)
</code></p>
<p>Found on <a href="http://www.mattcutts.com/blog/how-to-configure-synergy-in-six-steps/">mattcutts.com</a>, this is the option I need.  I use SynergyKM, which is a Mac-ified app to control synergy.  It doesn't use the conf file of synergy but instead uses a .plist property file.  So I edited it to look like this:</p>
<p><a href="http://squarism.com/2008/03/12/scroll-lock-button-on-osx/synergy-scrolllock/"><img src="/uploads/2008/03/Synergy_Scrolllock-300x97.png" alt="Synergy Scrolllock" title="Synergy Scrolllock" width="300" height="97" class="alignnone size-medium wp-image-1295" /></a> </p>
<p>And viola, roll over to the XP box from Mac, hit F13 and mouse look works in WoW (or probably any other drag-tracking app).</p>
