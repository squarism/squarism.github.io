---
layout: post
status: publish
published: true
title: Simple Ruby-Processing Collision Detection
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "<img src=\"/uploads/2011/04/ruby-processing-deadgrid.png\"
  alt=\"\" title=\"ruby-processing-deadgrid\" width=\"336\" height=\"358\" class=\"alignright
  size-full wp-image-1225\" />\r\n<a href=\"http://squarism.com/2009/07/09/better-tetris-collision-detection/\">In
  an old post</a> I talked about doing collision detection using a 2d bitmap (or
  grid).  That example was done using Processing (Java).  It was a simple example
  but was very relevant to all the problems I had when building <a href=\"http://squarism.com/tatris/\">Tatris</a>
  which did not use a bitmap for player position, instead it used real 2d space of
  x,y.\r\n\r\nI didn't talk about it in the previous post but I had added an Observer
  to the Java code that would highlight blocks in green when a collision was detected.
  \ Unfortunately, the code is a bit unclean although it works.  I have a few global
  variables (common in Processing sketches) and some unused variables.  So I never
  posted it.\r\n\r\nFast-forward to today and I have been playing around with <a href=\"https://github.com/jashkenas/ruby-processing/wiki/getting-started\">ruby-processing</a>
  (rp5) and porting some of my sketches.  The code is not much smaller (300ish lines
  of Java, 265 lines of Ruby) but I didn't optimize either code for line numbers.
  \ Neither code is really easier to read.  This might be because I straight-up ported
  the code with only minor changes.  Even if I were to do this from scratch, I'm not
  sure I could make it more ruby-like.  Where I use arrays for x,y, I'm sure I could
  do something cooler like ruby Hashes, but a lot of the code is bound to JRuby and
  the Processing API so it ends up reading about the same.\r\n"
wordpress_id: 1222
wordpress_url: http://squarism.com/?p=1222
date: !binary |-
  MjAxMS0wNC0xNiAyMTozMDo0OCAtMDQwMA==
date_gmt: !binary |-
  MjAxMS0wNC0xNyAwMjozMDo0OCAtMDQwMA==
categories:
- Ruby
- Processing
tags: []
comments: []
---
<p><img src="/uploads/2011/04/ruby-processing-deadgrid.png" alt="" title="ruby-processing-deadgrid" width="336" height="358" class="alignright size-full wp-image-1225" />
<a href="http://squarism.com/2009/07/09/better-tetris-collision-detection/">In an old post</a> I talked about doing collision detection using a 2d bitmap (or grid).  That example was done using Processing (Java).  It was a simple example but was very relevant to all the problems I had when building <a href="http://squarism.com/tatris/">Tatris</a> which did not use a bitmap for player position, instead it used real 2d space of x,y.</p>
<p>I didn't talk about it in the previous post but I had added an Observer to the Java code that would highlight blocks in green when a collision was detected.  Unfortunately, the code is a bit unclean although it works.  I have a few global variables (common in Processing sketches) and some unused variables.  So I never posted it.</p>
<p>Fast-forward to today and I have been playing around with <a href="https://github.com/jashkenas/ruby-processing/wiki/getting-started">ruby-processing</a> (rp5) and porting some of my sketches.  The code is not much smaller (300ish lines of Java, 265 lines of Ruby) but I didn't optimize either code for line numbers.  Neither code is really easier to read.  This might be because I straight-up ported the code with only minor changes.  Even if I were to do this from scratch, I'm not sure I could make it more ruby-like.  Where I use arrays for x,y, I'm sure I could do something cooler like ruby Hashes, but a lot of the code is bound to JRuby and the Processing API so it ends up reading about the same.
<a id="more"></a><a id="more-1222"></a>
One of the changes was to move the observer notification into the key_pressed method.  When you run into a block, it does a few checks to see if you're at the edge of the screen and if not, it notifies the BlockedHandler which will highlight the grid block at the proper location.</p>
<p>I was unable to export an applet from ruby-processing but I have <a href="http://squarism.com/files/deadgrid_events/">the java version posted here</a>.  The controls are:</p>
<blockquote><p>Arrow keys to move
Space to randomize grid</p></blockquote>
<p>I also have a Mac app of the ruby version <a href="http://squarism.com/files/rp5-deadgrid.zip">here</a>.  It should work stand-alone.  I suggest running the code before looking at it so that you can see it in motion.  It won't make a whole lot of sense just by looking at the screenshot.</p>
<p><a href="https://gist.github.com/squarism/5298005">deadgrid_events.rb on gist.github.com</a></p>
