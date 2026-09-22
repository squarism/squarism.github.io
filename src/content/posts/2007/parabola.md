---
title: "Parabola"
description: "Blog post about parabola"
date: 2007-04-15T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![parabola sketch](/uploads/2007/04/parabola_sketch.jpg "parabola sketch")

My goal was to create the curves above. I knew if I could draw it then I could move a box or game object along that path. It took me about two weeks of casual time and many math questions posted to yahoo answers.

The problem is, implementing a math formula in C++. It's just not as pretty as the equation and any algebra tricks are hard to express in code. Not to mention remembering algebra period. ?

Eventually, I ended up with this. I specified the starting point, the ending point and how tall I want the curve. A series of horrible equations builds the rest into a vector of x,y point structs. There's an LOD thing too that says how pretty the curve should be.

![parabola3](/uploads/2007/04/parabola3.png "parabola3")

Of course, it's pixilated and kinda ugly. I tried anti-aliasing it but it doesn't look much better. Also, I might have some math issues because in some places there seems to be small humps. I might be running into precision problems again. ?

Overall, I'm pretty exhausted. I don't know what my next project will be, I don't know if I want to make more of a game that's interactive instead of these little graphics tests.

Also, C++ is pretty ugly imo. It's used everywhere, I understand but I might pick up an actionscript book and see how much of this graphics stuff could be wrapped up in flash. I bet you can do some cool low-level drawing in flash; and then it'd be more 'portable' than an OSX app.

Anyway ... it's a thing of goddamn beauty for now. Except [the code](http://wiki.ubernub.com/parabola), which is ugly, untidy and probably doesn't compile by itself. I'll update it so it's stand-alone.
