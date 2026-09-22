---
title: "Scroll Lock Button on OSX"
description: "Here's an esoteric fix for something I wanted to do. In a certain game, right click will move the camera. For some reason, when hosting synergy on ..."
date: 2008-03-12T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Here's an esoteric fix for something I wanted to do. In a certain game, right click will move the camera. For some reason, when hosting synergy on the Mac (as the server) and connecting a Windows client, the right clicking gets whacked. It works fine the other way (don't ask me).

So I want to hit scroll lock to lock the screen so that mouse-looking works. Except there's no scroll lock button on a Mac keyboard! Doh. But I find a solution:

`keystroke(f13) = lockCursorToScreen(toggle)`

Found on [mattcutts.com](http://www.mattcutts.com/blog/how-to-configure-synergy-in-six-steps/), this is the option I need. I use SynergyKM, which is a Mac-ified app to control synergy. It doesn't use the conf file of synergy but instead uses a .plist property file. So I edited it to look like this:

![Synergy Scrolllock](/uploads/2008/03/Synergy_Scrolllock.png "Synergy Scrolllock")

And viola, roll over to the XP box from Mac, hit F13 and mouse look works in WoW (or probably any other drag-tracking app).
