---
title: "Useful Crontab Header"
description: "Blog post about useful crontab header"
date: 2004-11-12T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

```bash
# minute (0-59),
# |      hour (0-23),
# |      |       day of the month (1-31),
# |      |       |       month of the year (1-12),
# |      |       |       |       day of the week (0-6 with 0=Sunday).
# |      |       |       |       |       commands
```

Good for putting at the top of crontab files.
