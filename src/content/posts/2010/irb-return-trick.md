---
title: "IRB return trick"
description: "Irb, like ruby and many other languages, returns things to the left. When you say:"
date: 2010-07-09T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Irb, like ruby and many other languages, returns things to the left.  When you say:

`x = 5`

5 gets sent to x and x gets sent to the console or to the bit bucket if nothing is watching for it.  Irb with Ruby will tell you this explicitly which is great for debugging and developing.

```text
>> x = 5
=> 5
```

But sometimes it's annoying.  Like when you have a massive array of objects and you're iterating through them.  A quick trick is to add another meaningless return on the end like this:

```text
>> x = 5; 1
=> 1
```

If x=5 was a huge database result set or a large array, it'd be hard to read.  But 1 is easy to ignore.
