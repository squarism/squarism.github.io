---
title: "A nice bash prompt"
description: "Throw this into your /etc/bashrc for all users to pick up this more interesting bash prompt. If you just want to test it out on a single user's pro..."
date: 2003-04-20T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Throw this into your /etc/bashrc for all users to pick up this more interesting bash prompt.  If you just want to test it out on a single user's profile, add to ~/.bashrc (at the end is good).

```bash
# a ruley rule bash prompt
COLOR1="\[33[1;37m\]"
COLOR2="\[33[0;37m\]"
COLOR3="\[33[1;33m\]"
if [ "$UID" = "0" ];
then
COLOR2="\[33[1;34m\]"
fi
PS1="$COLOR2($COLOR1\u@\h$COLOR2)-($COLOR3\W$COLOR2)\\$ $COLOR1"
```

_(image lost)_