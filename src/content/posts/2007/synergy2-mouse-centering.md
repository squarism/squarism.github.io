---
title: "Synergy2 mouse centering"
description: "Synergy is a great tool for sharing multiple screens reverse KVM but for some reason lately I've noticed that if I'm physically on the center screen"
date: 2007-10-04T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Synergy is a great tool for sharing multiple screens (reverse KVM) but for some reason lately I've noticed that if I'm physically on the center screen, then the mouse recenters occasionally. It's pretty annoying.

I turned on debug log and looked in ~/Library/Logs/synergyd.log. I found this:

```text
2007-10-04 22:12:11.894 Synergyd[337] DEBUG: dropped bogus motion -840,-526
```

I searched sourceforge for that string and found code that essentially centers the mouse when it detects motion on the primary screen. There doesn't seem to be an option to control the behavior, so short of me making a patch, I don't see a solution.

UPDATE: I found a workaround, simply move your mouse over to the display that it being buggy and the if() condition doesn't fire off. So in my case, my mac connects to my PC's keyboard and mouse. I move the PC's mouse over to the Mac screen and the Mac stops acting weird (the centering problem).
