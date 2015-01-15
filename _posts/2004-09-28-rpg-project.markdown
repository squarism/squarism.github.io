---
layout: post
status: publish
published: true
title: RPG project
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! 'A few ideas detailing a first bold attempt at game programming.


  Of note, the game will try to be of a Final Fantasy 1 feel while having attributes
  and statistics similar to Final Fantasy 7 and 11.  Features and goals include:


  - Some sort of world map

  - Possibly a shader to make the world look like a snow globe (see Doom3''s glass
  post-processing effect)

  - Special effects based on hits / actions

  - Eventually some sort of story and plot


  These are on the upper end of the TODO list.  Read on for more immediate tasks.

'
wordpress_id: 44
wordpress_url: http://squarism.com/2004/09/28/rpg-project/
date: !binary |-
  MjAwNC0wOS0yOCAyMTo0ODo0OCAtMDQwMA==
date_gmt: !binary |-
  MjAwNC0wOS0yOSAwMjo0ODo0OCAtMDQwMA==
categories:
- Blog
tags: []
comments: []
---
A few ideas detailing a first bold attempt at game programming.

Of note, the game will try to be of a Final Fantasy 1 feel while having attributes and statistics similar to Final Fantasy 7 and 11.  Features and goals include:

- Some sort of world map
- Possibly a shader to make the world look like a snow globe (see Doom3's glass post-processing effect)
- Special effects based on hits / actions
- Eventually some sort of story and plot

These are on the upper end of the TODO list.  Read on for more immediate tasks.

<!-- more -->

Java has been fun to learn but it is limited in the ways of graphics.  I've read that there are OpenGL bindings for Java but it doesn't quite seem right.  Java is interpreted.  All the 3d books published implement their concepts in C/C++.  Learning a new language isn't exactly what I call easy.  Certainly graphics programming is an advanced topic.  So for the short-term, I'm going to try to keep my goals and features realistic:

- Get a basic encounter working: 1) party runs into a 'bad guy'  2) players hit 'bad guy' and HP gets subtracted
- Write a character class/object then write a series of actions to act upon that object
- Implement basic game rule formulas (like evasion calculations, turn order and random damage)
- Get something at least somewhat playable working in text mode
- After a semblance of a framework and design is becoming clear, try to get a UI or a graphical menu working

I would like to start this project in XCode.  Objective-c is completely new to me and it seems different than even C/C++ (I'm not very good in any of these).  The going will be slow and the results will likely not even be fun to play.  It's just a better project than the examples in my [intro to C books.](http://www.oreilly.com/catalog/pcp3/)