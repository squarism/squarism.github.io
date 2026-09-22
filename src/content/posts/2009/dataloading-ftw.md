---
title: "Dataloading ftw"
description: "Man.  I need to finish this ruby project I started.  I've had this RSS loader running on a box since 7/10/2009 and:"
date: 2009-11-12T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Man.  I need to finish this ruby project I started.  I've had this RSS loader running on a box since 7/10/2009 and:

```text
mysql> select count(*) from jobs;
+----------+
|  1414595 |
+----------+
mysql> select count(*) from entries;
+----------+
|   184149 |
+----------+

mysql> select count(*) from batches;
+----------+
|    35170 |
+----------+
```

1.4 millions jobs with 184k RSS posts.  Eep.  I need to finish the analyzer part and turn this off.  It's only a 200mb DB right now but my procrastination could cause /var to fill up.  Heh.
