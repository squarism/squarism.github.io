---
title: "Strip off tabs in vim"
description: "When you paste a block of text into a Putty window, many times you'll get an increasing number of leading tabs. Not so if you use gnome-terminal IIRC"
date: 2005-09-22T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

When you paste a block of text into a Putty window, many times you'll get an increasing number of leading tabs. Not so if you use gnome-terminal (IIRC). Quite annoying in a Windows world.

Strip tabs and spaces out from current position to the end of the file with:
`:.,$s/^[<tab>]*\s*//`

Or perhaps you only want a small block in the middle of the file changed. First, turn on line numbers.

`:set number`

Then search and replace on specific line numbers (in this example lines 15 through 41).
`:15,41s/^[<tab>]*\s*//`

Then use Ctrl-V (down arrow or h,j,k,l keys to select block) and hit ">" to re-indent. Works much better than reformatting by hand.
