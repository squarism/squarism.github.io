---
title: "Triangle Building"
description: "Blog post about triangle building"
date: 2009-04-03T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![triangle_building_1](/uploads/2009/04/triangle_building_1.jpg "triangle_building_1")
I got distracted while working on an actual game and started messing around with image recognition. I was greatly inspired by [the LevelHead tech demo](http://vimeo.com/1320756) and thoroughly depressed by Julian Oliver's talent. I started messing around with OpenCV and wanted to track rotation of objects. I figured out that a triangle would be the best way to track rotation because a right-triangle is unique when rotated 90º four times.

So the magic triangle again. It seems it has endless uses. I started trying to draw one programmatically. But my trig skills are lacking and I needed to create a test program. My math didn't work out that great so I asked yahoo answers. Someone named Mathmom28 answered my question perfectly and the above sheet of paper shows the end result of her answer. It's a bit disheartening to be relying on a homework forum for answers from "Mathmom28" but I don't think I'm going to pass judgement on my superiors. Suddenly I feel like I'm in high school again.

The magic to this madness was a formula she posted which is something I've since long-forgotten: the point-slope form of a line. A line 90º perpendicular to another one is it's negative reciprocal. In other words, y = 3x/5y at 90º is y=-5y/3x. Once I got that, it was cake to finish something that's pretty polished.

Try out [Triangle Building](/files/triangle_building/). The instructions are at the bottom of the screen.

![triangle_building](/uploads/2009/04/triangle_building.png "triangle_building")
