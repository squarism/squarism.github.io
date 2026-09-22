---
title: "Better tetris collision detection"
description: "Blog post about better tetris collision detection"
date: 2009-07-09T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![deadgrid](/uploads/2009/07/deadgrid.png "deadgrid")

As I said in the TODO part of the [Making Tetris post](/posts/making-tatris/), a better way to do collision detection is to have the blocks on the field be bits. This is typically what I saw in academic assignments and student presentations. This is probably the right way to do it in other words. It's more efficient and it's more simple ([KISS](http://en.wikipedia.org/wiki/KISS_principle)).

Even though this isn't how I did it in the game, I still wanted to play around with the concept so I made a little prototype that demonstrates the basic gist. Instead of a piece, it's a single block. Instead of a tetris grid of finished blocks, it's random blocks. It's really the same thing, it just looks and plays with different shapes.

So here it is. Space randomizes the grid and the arrow keys move. [Play It!](/files/deadgrid)
