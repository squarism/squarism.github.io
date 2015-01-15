---
layout: post
status: publish
published: true
title: Hollywood Security BS
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 791
wordpress_url: http://squarism.com/?p=791
date: !binary |-
  MjAxMC0xMi0wMyAyMjozNjo1MSAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0wNCAwMzozNjo1MSAtMDUwMA==
categories:
- GameDev
- Processing
tags: []
comments:
- id: 2497
  author: Matt Topper
  author_email: matt@matttopper.com
  author_url: ''
  date: !binary |-
    MjAxMC0xMi0wNCAwOTozMjo1MSAtMDUwMA==
  date_gmt: !binary |-
    MjAxMC0xMi0wNCAxNDozMjo1MSAtMDUwMA==
  content: ! "Ahem...ruby-processing.\r\nhttps://github.com/jashkenas/ruby-processing/wiki"
---
![](/uploads/2010/12/sshot_1-580x468.png "HollywoodSecurity")

I had watched Alicia Silverstone 'hack' a system recently and decided to make a mostly functional mock up like they do in the movies.  I'm getting pretty comfortable in [Processing](http://processing.org/) and even though I really can't stand [Java](http://www.oracle.com/technetwork/java/index.html) anymore, I wanted to get this thing done and out of my head.  I was just going to skip over this idea but inspiration just started flowing and I was idly solving it while getting coffee etc and I just had to get it on paper/code.

So here are the things it does:

*   Switches between two GameState objects login and success
*   Separate the view and the state (more on this)
*   Has a super cool blinking cursor
*   Handles shift, ctrl and meta (windows key) gracefully
*   Handles backspace
*   When you type muffin, it takes you to the super secret database ... or whatever
*   Goes fullscreen (which you can't see in this shot)</p>

This could get out of hand real quick.  First, I reused a ton of code from Tatris.  But in Tatris, the game state was tied to a view.  I had pictured this project having different views.  Like instead of a password prompt, maybe there'd be a keypad with a combo.  Same state object (authorized vs unauthorized) so I didn't need to recreate the wheel.  The problem is, I don't really have a controller so I'm kinda breaking MVC.  But I didn't want this thing to bloat up so I just went with it.

Next, UI layer.  Not great.  I'm drawing text boxes and blinking cursors.  It's really pretty messy.  I'd be better off picking some UI components or something and using those.  It's tough.  Even in games, there's so many UI differences.  Different scrollbars, different OK type buttons.  What a usability nightmare.  But I'm trying to create an old school terminal so all the weirdness is actually good.

Anyway, it was a fun little diversion.  There's more on [the github page](https://github.com/squarism/HollywoodSecurity).