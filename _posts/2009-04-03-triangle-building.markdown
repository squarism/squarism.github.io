---
layout: post
status: publish
published: true
title: Triangle Building
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 129
wordpress_url: http://squarism.com/?p=129
date: !binary |-
  MjAwOS0wNC0wMyAyMjo0NDoyNCAtMDQwMA==
date_gmt: !binary |-
  MjAwOS0wNC0wNCAwMzo0NDoyNCAtMDQwMA==
categories:
- GameDev
- Processing
tags: []
comments: []
---
![triangle_building_1](/uploads/2009/04/triangle_building_1-580x435.jpg "triangle_building_1")
I got distracted while working on an actual game and started messing around with image recognition.  I was greatly inspired by [the LevelHead tech demo](http://vimeo.com/1320756) and thoroughly depressed by Julian Oliver's talent.  I started messing around with OpenCV and wanted to track rotation of objects.  I figured out that a triangle would be the best way to track rotation because a right-triangle is unique when rotated 90º four times.

So the magic triangle again.  It seems it has endless uses.  I started trying to draw one programmatically. But my trig skills are lacking and I needed to create a test program.  My math didn't work out that great so I asked yahoo answers.  Someone named Mathmom28 answered my question perfectly and the above sheet of paper shows the end result of her answer.  It's a bit disheartening to be relying on a homework forum for answers from "Mathmom28" but I don't think I'm going to pass judgement on my superiors.  Suddenly I feel like I'm in high school again.

The magic to this madness was a formula she posted which is something I've since long-forgotten: the point-slope form of a line.  A line 90º perpendicular to another one is it's negative reciprocal.  In other words, y = 3x/5y at 90º is y=-5y/3x.  Once I got that, it was cake to finish something that's pretty polished.

Try out [Triangle Building](http://squarism.com/files/triangle_building/).  The instructions are at the bottom of the screen.

![triangle_building](/uploads/2009/04/triangle_building.png "triangle_building")