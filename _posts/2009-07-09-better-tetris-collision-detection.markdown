---
layout: post
status: publish
published: true
title: Better tetris collision detection
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 244
wordpress_url: http://squarism.com/?p=244
date: !binary |-
  MjAwOS0wNy0wOSAyMTo0NDoyNiAtMDQwMA==
date_gmt: !binary |-
  MjAwOS0wNy0xMCAwMjo0NDoyNiAtMDQwMA==
categories:
- GameDev
- Processing
tags: []
comments:
- id: 6048
  author: SQUARISM &raquo; Simple Ruby-Processing Collision Detection
  author_email: ''
  author_url: http://squarism.com/2011/04/16/simple-ruby-processing-collision-detection/
  date: !binary |-
    MjAxMS0wNC0xNiAyMTo0NToxMSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNC0xNyAwMjo0NToxMSAtMDQwMA==
  content: ! '[...] In an old post I talked about doing collision detection using
    a 2d bitmap (or grid). That example was done using Processing (Java). It was a
    simple example but was very relevant to all the problems I had when building Tatris
    which did not use a bitmap for player position, instead it used real 2d space
    of x,y. [...]'
---
<p><img src="/uploads/2009/07/deadgrid.png" alt="deadgrid" title="deadgrid" width="336" height="358" class="aligncenter size-full wp-image-247" /></p>
<p>As I said in the TODO part of the <a href="http://squarism.com/2009/06/22/making-tetris/4/">Making Tetris post</a>, a better way to do collision detection is to have the blocks on the field be bits.  This is typically what I saw in academic assignments and student presentations.  This is probably the right way to do it in other words.  It's more efficient and it's more simple (<a href="http://en.wikipedia.org/wiki/KISS_principle">KISS</a>).</p>
<p>Even though this isn't how I did it in the game, I still wanted to play around with the concept so I made a little prototype that demonstrates the basic gist.  Instead of a piece, it's a single block.  Instead of a tetris grid of finished blocks, it's random blocks.  It's really the same thing, it just looks and plays with different shapes.</p>
<p>So here it is.  Space randomizes the grid and the arrow keys move.  <a href="http://squarism.com/files/deadgrid">Play It!</a></p>
