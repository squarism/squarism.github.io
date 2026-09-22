---
title: "Simple Ruby-Processing Collision Detection"
description: "Blog post about simple ruby-processing collision detection"
date: 2011-04-16T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![](/uploads/2011/04/ruby-processing-deadgrid.png "ruby-processing-deadgrid")

[In an old post](/posts/better-tetris-collision-detection/) I talked about doing collision detection using a 2d bitmap (or grid). That example was done using Processing (Java). It was a simple example but was very relevant to all the problems I had when building [Tatris](http://squarism.com/tatris/) which did not use a bitmap for player position, instead it used real 2d space of x,y.

I didn't talk about it in the previous post but I had added an Observer to the Java code that would highlight blocks in green when a collision was detected. Unfortunately, the code is a bit unclean although it works. I have a few global variables (common in Processing sketches) and some unused variables. So I never posted it.

Fast-forward to today and I have been playing around with [ruby-processing](https://github.com/jashkenas/ruby-processing/wiki/getting-started) (rp5) and porting some of my sketches. The code is not much smaller (300ish lines of Java, 265 lines of Ruby) but I didn't optimize either code for line numbers. Neither code is really easier to read. This might be because I straight-up ported the code with only minor changes. Even if I were to do this from scratch, I'm not sure I could make it more ruby-like. Where I use arrays for x,y, I'm sure I could do something cooler like ruby Hashes, but a lot of the code is bound to JRuby and the Processing API so it ends up reading about the same.
One of the changes was to move the observer notification into the key_pressed method. When you run into a block, it does a few checks to see if you're at the edge of the screen and if not, it notifies the BlockedHandler which will highlight the grid block at the proper location.

I was unable to export an applet from ruby-processing but I have [the java version posted here](/files/deadgrid_events/). The controls are:

> Arrow keys to move
> Space to randomize grid

I also have a Mac app of the ruby version [here](/files/rp5-deadgrid.zip). It should work stand-alone. I suggest running the code before looking at it so that you can see it in motion. It won't make a whole lot of sense just by looking at the screenshot.

[deadgrid_events.rb on gist.github.com](https://gist.github.com/squarism/5298005)
